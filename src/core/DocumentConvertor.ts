import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// set up the PDFJS worker
// if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
//     const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
//     pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
// }


/**
 * This class handles conversions of File object to a PDF-js object and to PDF-Lib.
 */
export default class DocumentConvertor {

    public static getDocumentProxy(file: File): Promise<any> {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = function () {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
            temporaryFileReader.onload = function () {
                const typedarray = new Uint8Array(this.result as ArrayBufferLike);
                const pdfTask = pdfjsLib.getDocument(typedarray);
                // check if pdfTask is a type Promise<PDFPageProxy>
                resolve(pdfTask);
            };
            temporaryFileReader.readAsArrayBuffer(file);
        });
    }

    public static async getDocumentProxies(files: File[]) {

        if (!files || !files.length)
            return;

        const pdfTasks = [];
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const documentProxy: any = await this.getDocumentProxy(files[fileIndex]);
            // const x = documentProxy.promise;
            pdfTasks.push(await documentProxy.promise);
        }

        return pdfTasks;
    }

    private async getDocumentAsBuffer(file: File): Promise<ArrayBuffer | string> {
        return new Promise((resolve, reject): void => {
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
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const pdfDocument = await this.getPDFDocument(files[fileIndex]);
            pdfDocuments.push(pdfDocument);
        }
        return pdfDocuments;
    }

}