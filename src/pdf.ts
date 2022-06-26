import * as pdfjsLib from 'pdfjs-dist';

if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
}


const processDocument = (inputFile: File) => {
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
};

const prepareDocumentProxy = async (files: Array<File>) => {

    if(!files && !files.length)
        return;

    const pdfTasks = [];
    for(let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const documentProxy: any = await processDocument(files[fileIndex]);
        // const x = documentProxy.promise;
        pdfTasks.push(await documentProxy.promise);
    }

    return pdfTasks;
}

const processAllDocuments = async (files: any) => {
    const pdfDocuments = await prepareDocumentProxy(files);

    for(let pdfIndex = 0; pdfIndex < pdfDocuments.length; pdfIndex++) {
        const pdfPageCount = pdfDocuments[pdfIndex].numPages;
        
        for(let pageIndex = 1; pageIndex <= pdfPageCount; pageIndex++) {
            const page = await pdfDocuments[pdfIndex].getPage(pageIndex);
            const annotations = await page.getAnnotations();
            console.log(annotations);

        }
        // console.log(pdfDocuments[fileIndex]);
    }
}


const renderPage = (pdf: any, pageNumber: number, canvas: any, scale: number) => {
    pdf.getPage(pageNumber).then(function(page: any) {
      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;          
      page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
    });
}

const renderPages = (document: any, pdfDocument: any, scale = 0.4) => {
    const viewer = document.getElementById('pdf-viewer');
    
    for(let page = 1; page <= pdfDocument.numPages; page++) {
        const canvas = document.createElement("canvas");    
        canvas.className = 'pdf-page-canvas';         
        viewer.appendChild(canvas);            
        renderPage(pdfDocument, page, canvas, scale);
    }
}




export { processAllDocuments, prepareDocumentProxy, renderPages }; 
