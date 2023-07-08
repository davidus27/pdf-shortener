// building a module that exports all the core components
import DocumentConvertor from "./DocumentConvertor";
import DocumentCutter from "./DocumentCutter";
import DocumentProcessor from "./DocumentProcessor";
import type { DocumentFilters } from "./DocumentProcessor";
import Executor from "./Executor";
import PdfViewer from "./PdfViewer";
import PageRange from "./PageRange";

import * as pdfjsLib from 'pdfjs-dist';

// set up the PDFJS worker
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
}

export {
    DocumentConvertor,
    DocumentCutter,
    DocumentProcessor,
    DocumentFilters,
    PageRange,
    Executor,
    PdfViewer,
};