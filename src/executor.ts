import {PdfViewer, DocumentFilters, DocumentProcessor } from './pdf';
import DocumentCutter from './DocumentCutter';

export default class Executor {
    files: File[]
    documentFilters: DocumentFilters;
    filteredPages: Array<Array<number>>;

    constructor(files: File[], documentFilters: DocumentFilters) {
        this.files = files;
        this.documentFilters = documentFilters;
    }

    private async getFilteredPages() {
        const x = new DocumentProcessor(this.files);
        return x.tranformFilteredPagesToIndexes(await x.getFilteredPages(this.documentFilters));
    }

    public async renderDocuments(): Promise<void> {
        const filteredPages = await this.getFilteredPages();
        const pdfViewerObj = new PdfViewer(this.files);
        await pdfViewerObj.renderAllDocuments(filteredPages);
    }
    
    public async downloadAllDocuments(): Promise<void> {
        const filteredPages = await this.getFilteredPages();
        // iterate over files and download each one
        for (let fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
          const dc = new DocumentCutter(this.files[fileIndex]);
          const name = this.files[fileIndex].name.slice(0, -4);
          await dc.processDocument(filteredPages[fileIndex], `${ name }_new_version_${fileIndex + 1}.pdf`);
        }
    }

    async getPageCount(): Promise<Array<number>> {
      const pdfViewerObj = new PdfViewer(this.files);
      await pdfViewerObj.prepareForRender();
      const pageCounts = [];
      // iterate over files and get all page counts
      for (let fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
        pageCounts.push(pdfViewerObj.getPageCount(fileIndex));
      }
      return pageCounts;
    };


}

