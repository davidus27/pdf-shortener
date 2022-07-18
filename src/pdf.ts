import * as pdfjsLib from 'pdfjs-dist';

if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
}


// define PDF document processing class
abstract class DocumentProcessor {

    public static processDocument(inputFile: File){
        const temporaryFileReader = new FileReader();
    
        return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = function() {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
            temporaryFileReader.onload = function() {
                const typedarray = new Uint8Array(this.result as ArrayBufferLike);
                const pdfTask = pdfjsLib.getDocument(typedarray);
                resolve(pdfTask);
            };
            temporaryFileReader.readAsArrayBuffer(inputFile);
        });
    }

    public static async prepareDocumentProxy(files: Array<File>) {

        if(!files && !files.length)
            return;
    
        const pdfTasks = [];
        for(let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const documentProxy: any = await this.processDocument(files[fileIndex]);
            // const x = documentProxy.promise;
            pdfTasks.push(await documentProxy.promise);
        }
    
        return pdfTasks;
    }

    public static async processAllDocuments(files: any): Promise<Array<number>> {
        const pdfDocuments = await this.prepareDocumentProxy(files);
    
        const foundHighlight = [];
    
        for(let pdfIndex = 0; pdfIndex < pdfDocuments.length; pdfIndex++) {
            const pdfPageCount = pdfDocuments[pdfIndex].numPages;
            
            for(let pageIndex = 1; pageIndex <= pdfPageCount; pageIndex++) {
                const page = await pdfDocuments[pdfIndex].getPage(pageIndex);
                const annotations = await page.getAnnotations();
                for (let annotationIndex = 0; annotationIndex < annotations.length; annotationIndex++) {
                    const annotation = annotations[annotationIndex];
                    if (annotation.subtype === 'Link') {
                        // console.log(annotation.url);
                    }
                    if (annotation.subtype === 'Highlight') {
                        console.log(`Found highlight on page ${pageIndex}`);
                        foundHighlight.push(pageIndex);
                    }
                }
            }
        }
        return foundHighlight;
    }
}


// define class for pdf viewer
class PdfViewer {
    private files: Array<File>;
    private pdfDocuments: Array<any>;
    // private indexes: any;
    // private scale: number;

    constructor(files: Array<File>, indexes: any, scale = 0.4) {
        this.files = files;
        // this.indexes = indexes;
        // this.scale = scale;
    }

    public async process() {
        this.pdfDocuments = await DocumentProcessor.prepareDocumentProxy(this.files);
    }

    public getPdfDocuments() {
        return this.pdfDocuments;
    }

    // get the pdf document indexes based on the indexes
    public getPdfDocumentIndexes() {
        return DocumentProcessor.processAllDocuments(this.files);
    }

    private renderPage(pdf: any, pageNumber: number, canvas: any, scale: number) {
        pdf.getPage(pageNumber).then((page: any) => {
          const viewport = page.getViewport({ scale: scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;          
          page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
        });
    }

    public renderPages(indexes: Array<number>, scale = 0.4) {
        const viewer = document.getElementById('pdf-viewer');

        // remove all children
        while(viewer.firstChild) {
            viewer.removeChild(viewer.firstChild);
        }

        // increase the filter by 1 for each page
        const increased_filter = indexes.map((pageNumber) => pageNumber + 1);

        for(let page = 1; page <= this.pdfDocuments[0].numPages; page++) {
            // render only pages that are in the filter
            if(increased_filter.includes(page)) {
                const canvas = document.createElement("canvas");    
                canvas.className = 'pdf-page-canvas';
                canvas.setAttribute('style', 'padding: 20px;');
                viewer.appendChild(canvas);            
                this.renderPage(this.pdfDocuments[0], page, canvas, scale);
            }
        }
    }
    
    // get page count of a pdf document by index
    public getPageCount(index: number = 0) {
        return this.pdfDocuments[index].numPages;
    }
}


export { PdfViewer }; 
