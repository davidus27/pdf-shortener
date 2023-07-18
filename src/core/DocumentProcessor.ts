import * as pdfjsLib from 'pdfjs-dist';
import DocumentConvertor from './DocumentConvertor';
import type { TextContent } from 'pdfjs-dist/types/src/display/api';


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
                    return true;
                }
            }
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    private isInRange(textRange: string, pageIndex: number) {
        pageIndex++; // pages start from 1

        const ranges = textRange.split(',');
        // iterate over ranges and check if they match the filter
        for (let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
            const range = ranges[rangeIndex];
            const rangeParts = range.split('-');
            const start = parseInt(rangeParts[0]);

            // check if the range is a single page or a range
            const end = rangeParts.length === 1 ? start : parseInt(rangeParts[1]);

            if (start <= pageIndex && pageIndex <= end) {
                return true;
            }
        }
    }

    private async pageHasText(page: pdfjsLib.PDFPageProxy, lookingFor: string[]) {
        const textContent: TextContent = await page.getTextContent();

        let summary = "";
        textContent.items.forEach((element: any) => {
            summary += " " + element.str.toUpperCase();
        });

        // find the text in the page
        for (let textIndex = 0; textIndex < lookingFor.length; textIndex++) {
            if (summary.includes(lookingFor[textIndex].toUpperCase())) {
                return true;
            }
        }
        return false;
    }

    private async calculatePageFilters(page: pdfjsLib.PDFPageProxy, filters: DocumentFilters): Promise<boolean> {
        const annotations = await page.getAnnotations();
        const pageIndex = page._pageIndex;

        // calculate the hightight filter
        const highlight = filters.checks.hasHighlights ? this.isHighlighted(annotations) : true;
        const links = filters.checks.hasLinks ? this.hasLinks(annotations) : true;
        const images = filters.checks.hasImages ? await this.hasImages(page) : true;
        const keywords = filters.keywords.words ? await this.pageHasText(page, filters.keywords.words) : true;
        let range = filters.textRange ? this.isInRange(filters.textRange, pageIndex) : true;

        let result = (highlight || links || images);

        if (filters.checks.logicOperator === 'AND') {
            result &&= range;
        } else {
            result ||= range;
        }

        if (filters.keywords.logicOperator === 'AND') {
            result &&= keywords;
        } else {
            result ||= keywords;
        }

        return result;
    }


    public async calculateFilteredPages(filters: DocumentFilters): Promise<number[][]> {
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