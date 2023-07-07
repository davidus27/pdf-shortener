import DocumentConvertor from "./DocumentConvertor";

// define class for pdf viewer
export default class PdfViewer {
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

    public getOriginalPageCount() {
        
    }

    private renderPage(pdf: any, pageNumber: number, canvas: any) {
        pdf.getPage(pageNumber).then((page: any) => {
            const viewport = page.getViewport({ scale: this.scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
        });
    }

    public async renderDocument(viewer: HTMLElement, filteredPages: Array<number>, fileIndex: number) {
        // const viewer = document.getElementById('pdf-viewer');
        if (!this.pdfDocuments) {
            await this.prepareForRender();
        }

        const pdfDocument = this.pdfDocuments[fileIndex];

        // remove all children
        while (viewer?.firstChild) {
            viewer?.removeChild(viewer?.firstChild);
        }

        // increase the filter by 1 for each page
        const increased_filter = filteredPages.map((pageNumber) => pageNumber + 1);

        for (let page = 1; page <= pdfDocument.numPages; page++) {
            // render only pages that are in the filter
            if (increased_filter.includes(page)) {
                const canvas = document.createElement("canvas");
                canvas.className = 'pdf-page-canvas';
                canvas.setAttribute('style', 'padding: 20px;');
                viewer.appendChild(canvas);
                this.renderPage(pdfDocument, page, canvas);
            }
        }
    }

    public async renderAllDocuments(documentFilters: Array<Array<number>>) {
        const viewer = document.querySelector('pdf-viewer');
        // add class to viewer element
        viewer.className = 'pdf-viewer';

        // remove all children
        while (viewer?.firstChild) {
            viewer?.removeChild(viewer?.firstChild);
        }

        for (let fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
            // create new document viewer for each file inside the viewer
            const documentViewer = document.createElement("div");
            documentViewer.className = 'pdf-document-viewer-' + fileIndex;
            viewer.appendChild(documentViewer);

            // const viewer = document.getElementById('pdf-viewer-' + fileIndex);
            await this.renderDocument(documentViewer, documentFilters[fileIndex], fileIndex);
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