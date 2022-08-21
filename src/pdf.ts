import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';


if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
}
  
interface DocumentFilters {
    containsTexts: any;
    hasLinks: boolean;
    hasHighlights: boolean;
    hasImages: boolean;
    textRange: string;
    // hasBookmarks: boolean;
    // hasOutlines: boolean;
    // hasThumbnails: boolean;
    // hasFormFields: boolean;
    // hasAnnotations: boolean;
    // hasEmbeddedFiles: boolean;
    // hasPageLabels: boolean;
}


/**
 * This class handles conversions of File object to a PDF-js object and to PDF-Lib.
 */
class DocumentConvertor {

    public static getDocumentProxy(file: File): Promise<any> {
        const temporaryFileReader = new FileReader();
    
        return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = function() {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
            temporaryFileReader.onload = function() {
                const typedarray = new Uint8Array(this.result as ArrayBufferLike);
                const pdfTask = pdfjsLib.getDocument(typedarray);
                // check if pdfTask is a type Promise<PDFPageProxy>
                resolve(pdfTask);
            };
            temporaryFileReader.readAsArrayBuffer(file);
        });
    }

    public static async getDocumentProxies(files: Array<File>) {

        if(!files && !files.length)
            return;
    
        const pdfTasks = [];
        for(let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const documentProxy: any = await this.getDocumentProxy(files[fileIndex]);
            // const x = documentProxy.promise;
            pdfTasks.push(await documentProxy.promise);
        }
    
        return pdfTasks;
    }

    private async getDocumentAsBuffer(file: File): Promise<ArrayBuffer | string> {
        return new Promise((resolve, reject): void =>  {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    resolve(reader.result);
                }
            };
            reader.onerror = err => reject(err);

            reader.readAsArrayBuffer(file);
        });
    }

    public async getPDFDocument(file: File): Promise<PDFDocument> {
        const finalDocument = await this.getDocumentAsBuffer(file);
        return await PDFDocument.load(finalDocument);
    }

    public async getPDFDocuments(files: Array<File>): Promise<Array<PDFDocument>> {
        const pdfDocuments = [];
        for(let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const pdfDocument = await this.getPDFDocument(files[fileIndex]);
            pdfDocuments.push(pdfDocument);
        }
        return pdfDocuments;
    }

}


class DocumentProcessor {
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
        for(let annotationIndex = 0; annotationIndex < annotations.length; annotationIndex++) {
            const annotation = annotations[annotationIndex];
            if(annotation.subtype === 'Highlight') {
                return true;
            }
        }
        return false;
    }

    private hasLinks(annotations: Array<any>) {
        // iterate over annotations and check if they match the filter
        for(let annotationIndex = 0; annotationIndex < annotations.length; annotationIndex++) {
            const annotation = annotations[annotationIndex];
            if(annotation.subtype === 'Link' && annotation?.url?.includes('http')) {
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
            for(let operatorIndex = 0; operatorIndex < operatorList.fnArray.length; operatorIndex++) {
                const operator = operatorList.fnArray[operatorIndex];
                if(validObjectTypes.includes(operator)) {
                    const imageName = operatorList.argsArray[operatorIndex][0];
                    // console.log('page', pdfPage, 'imageName', imageName);
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
        for(let rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
            const range = ranges[rangeIndex];
            const rangeParts = range.split('-');
            const start = parseInt(rangeParts[0]);
            const end = parseInt(rangeParts[1]);
            if(start <= pageIndex && pageIndex <= end) {
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

        if(filters.checks.logicOperator === 'AND') {
            result &&= range;
        } else if(filters.checks.logicOperator === 'OR') {
            result ||= range;
        }

        return result;
    }


    public async getFilteredPages(filters: DocumentFilters): Promise<number[][]> {
        if (!this.documentProxies) {
            await this.prepare();
        }
        const filteredPages = [];
        for(let pdfIndex = 0; pdfIndex < this.documentProxies.length; pdfIndex++) {
            const pdfPageCount = this.documentProxies[pdfIndex].numPages;
            
            // initialize the array of page numbers full of 0
            const pageNumbers = new Array(pdfPageCount).fill(true);

            for(let pageIndex = 1; pageIndex <= pdfPageCount; pageIndex++) {
                const page = await this.documentProxies[pdfIndex].getPage(pageIndex);
                
                const annotations = await page.getAnnotations();

                const highlight = filters.hasHighlights && this.isHighlighted(annotations);
                const links = filters.hasLinks && this.hasLinks(annotations);
                const images = filters.hasImages && await this.hasImages(page);

                let range = true;
                if(filters.textRange) {
                    range = this.isInRange(filters.textRange, pageIndex);
                }

                const result = (highlight || links || images) && range;

                pageNumbers[pageIndex - 1] = result;

            }
            filteredPages.push(pageNumbers);
        }
        return filteredPages;
    }

    public tranformFilteredPagesToIndexes(filteredPages: number[][]): Array<Array<number>> {
        // iterate over filteredPages and transform to indexes
        const filteredIndexes = [];
        for(let pdfIndex = 0; pdfIndex < filteredPages.length; pdfIndex++) {
            const pageNumbers = filteredPages[pdfIndex];
            filteredIndexes.push([]);
            for(let pageIndex = 0; pageIndex < pageNumbers.length; pageIndex++) {
                if(pageNumbers[pageIndex]) {
                    filteredIndexes[pdfIndex].push(pageIndex);
                }
            }
        }
        return filteredIndexes;
    }

}



// define class for pdf viewer
class PdfViewer {
    private files: Array<File>;
    private pdfDocuments: Array<any>;
    private scale: number;

    constructor(files: Array<File>, scale = 0.4) {
        this.files = files;
        this.scale = scale;
    }

    public async prepareForRender() {
        this.pdfDocuments = await DocumentConvertor.getDocumentProxies(this.files);
    }

    private renderPage(pdf: any, pageNumber: number, canvas: any) {
        pdf.getPage(pageNumber).then((page: any) => {
          const viewport = page.getViewport({ scale: this.scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;          
          page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
        });
    }

    public async renderDocument(filteredPages: Array<number>, fileIndex: number) {
        const viewer = document.getElementById('pdf-viewer');
        if (!this.pdfDocuments) {
            await this.prepareForRender();
        }
        
        const pdfDocument = this.pdfDocuments[fileIndex];

        // remove all children
        while(viewer?.firstChild) {
            viewer?.removeChild(viewer?.firstChild);
        }

        // increase the filter by 1 for each page
        const increased_filter = filteredPages.map((pageNumber) => pageNumber + 1);

        for(let page = 1; page <= pdfDocument.numPages; page++) {
            // render only pages that are in the filter
            if(increased_filter.includes(page)) {
                const canvas = document.createElement("canvas");    
                canvas.className = 'pdf-page-canvas';
                canvas.setAttribute('style', 'padding: 20px;');
                viewer.appendChild(canvas);            
                this.renderPage(pdfDocument, page, canvas);
            }
        }
    }

    public async renderAllDocuments(documentFilters: Array<Array<number>>) {
        for(let fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
            await this.renderDocument(documentFilters[fileIndex], fileIndex);
        }
    }

    public getPageCount(fileIndex: number) {
        if (!this.pdfDocuments) {
            return -1;
        }
        return this.pdfDocuments[fileIndex].numPages;
    }

    public getPageCounts(): Array<number> {
        const pageCounts = [];
        // iterate over files and get all page counts
        for (let fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
            pageCounts.push(this.getPageCount(fileIndex));
        }
        return pageCounts;
    }
}



export { PdfViewer, DocumentProcessor };
export type { DocumentFilters }; 
