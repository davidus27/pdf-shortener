import * as pdfjsLib from 'pdfjs-dist';
import DocumentConvertor from './DocumentConvertor';


export interface DocumentFilters {
    keywords: {
        words: any,
        logicOperator: "AND" | "OR";
    },
    checks: {
        hasLinks: boolean;
        hasHighlights: boolean;
        hasImages: boolean;
        logicOperator: "AND" | "OR";
    }
    textRange: string;
}

export default class DocumentProcessor {
    private documentProxies: Array<pdfjsLib.PDFDocumentProxy>;
    private files: Array<File>;

    constructor(files: Array<File>) {
        this.files = files;
    }

    private async prepare() {
        this.documentProxies = await DocumentConvertor.getDocumentProxies(this.files);
    }

    private isHighlighted(annotations: Array<any>) {
        // iterate over annotations and check if they match the filter
        for (let annotationIndex = 0; annotationIndex < annotations.length; annotationIndex++) {
            const annotation = annotations[annotationIndex];
            if (annotation.subtype === 'Highlight') {
                return true;
            }
        }
        return false;
    }

    private hasLinks(annotations: Array<any>) {
        // iterate over annotations and check if they match the filter
        for (let annotationIndex = 0; annotationIndex < annotations.length; annotationIndex++) {
            const annotation = annotations[annotationIndex];
            if (annotation.subtype === 'Link' && annotation?.url?.includes('http')) {
                return true;
            }
        }
        return false;
    }

    private async hasImages(pdfPage: pdfjsLib.PDFPageProxy) {
        try {
            const operatorList = await pdfPage.getOperatorList();

            const validObjectTypes = [
                pdfjsLib.OPS.paintImageXObject, // 85
                pdfjsLib.OPS.paintImageXObjectRepeat, // 88
                pdfjsLib.OPS.paintJpegXObject //82
            ];

            // iterate over operatorList and check if there is an image
            for (let operatorIndex = 0; operatorIndex < operatorList.fnArray.length; operatorIndex++) {
                const operator = operatorList.fnArray[operatorIndex];
                if (validObjectTypes.includes(operator)) {
                    // const imageName = operatorList.argsArray[operatorIndex][0];
                    return true;
                }
            }
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    private hasText(text: string) {
    }

    private isInRange(textRange: string, pageIndex: number) {
        const ranges = textRange.split(',');
        // iterate over ranges and check if they match the filter
        for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
            const range = ranges[rangeIndex];
            const rangeParts = range.split('-');
            const start = parseInt(rangeParts[0]);
            const end = parseInt(rangeParts[1]);
            if (start <= pageIndex && pageIndex <= end) {
                return true;
            }
        }
    }

    private async calculatePageFilters(page: pdfjsLib.PDFPageProxy, filters: DocumentFilters): Promise<boolean> {
        const annotations = await page.getAnnotations();
        const pageIndex = page._pageIndex;
        const highlight = filters.checks.hasHighlights && this.isHighlighted(annotations);
        const links = filters.checks.hasLinks && this.hasLinks(annotations);
        const images = filters.checks.hasImages && await this.hasImages(page);

        let range = true;
        range = filters.textRange ? this.isInRange(filters.textRange, pageIndex) : true;

        let result = (highlight || links || images);

        if (filters.checks.logicOperator === 'AND') {
            result &&= range;
        } else if (filters.checks.logicOperator === 'OR') {
            result ||= range;
        }

        return result;
    }


    public async getFilteredPages(filters: DocumentFilters): Promise<number[][]> {
        if (!this.documentProxies) {
            await this.prepare();
        }
        const filteredPages = [];
        for (let pdfIndex = 0; pdfIndex < this.documentProxies.length; pdfIndex++) {
            const pdfPageCount = this.documentProxies[pdfIndex].numPages;

            // initialize the array of page numbers full of 0
            const pageNumbers = new Array(pdfPageCount).fill(true);

            for (let pageIndex = 1; pageIndex <= pdfPageCount; pageIndex++) {
                const page = await this.documentProxies[pdfIndex].getPage(pageIndex);

                pageNumbers[pageIndex - 1] = await this.calculatePageFilters(page, filters);

            }
            filteredPages.push(pageNumbers);
        }
        return filteredPages;
    }

    public tranformFilteredPagesToIndexes(filteredPages: number[][]): Array<Array<number>> {
        // iterate over filteredPages and transform to indexes
        const filteredIndexes = [];
        for (let pdfIndex = 0; pdfIndex < filteredPages.length; pdfIndex++) {
            const pageNumbers = filteredPages[pdfIndex];
            filteredIndexes.push([]);
            for (let pageIndex = 0; pageIndex < pageNumbers.length; pageIndex++) {
                if (pageNumbers[pageIndex]) {
                    filteredIndexes[pdfIndex].push(pageIndex);
                }
            }
        }
        return filteredIndexes;
    }

}