/**
 * The executor is an exposed object to the svelte UI.
 * It's called to do all the basic tasks with PDF files.
*/

// import { PdfViewer, DocumentFilters, DocumentProcessor } from './PDFLogic';
import PdfViewer from './PdfViewer';
import type { DocumentFilters } from './DocumentProcessor';
import DocumentProcessor from './DocumentProcessor';

import DocumentCutter from './DocumentCutter';

export default class Executor {
  files: File[]
  documentFilters: DocumentFilters;
  filteredPages: Array<Array<number>>;

  /**
  * Provide a reference to the documents with defined filters
  */
  constructor(files: File[], documentFilters: DocumentFilters) {
    this.files = files;
    this.documentFilters = documentFilters;
  }

  private async getFilteredPages(): Promise<number[][]> {
    const documentProcessor = new DocumentProcessor(this.files);
    return documentProcessor.tranformFilteredPagesToIndexes(await documentProcessor.getFilteredPages(this.documentFilters));
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
      await dc.processDocument(filteredPages[fileIndex], `${name}_new_version_${fileIndex + 1}.pdf`);
    }
  }

  /* Function that returns the final counts of pages of all documents */
  public async getPageCount(): Promise<number[]> {
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

