import { PDFDocument, PDFName, PDFPage } from 'pdf-lib';

const processTitle = (title: any) => {
    return title.split("/").pop().replace("%20", " ");
}

// Convert File to the arrayBuffer
const convertFile = async (file: File) => {
    
} 

class DocumentCutter {

    file: File;
    pdfDoc: any;
    foundPages: any;
    
    
    constructor(file: File) {
        this.file = file;
        this.pdfDoc = null;
        this.foundPages = {};
    }

    /*
    constructor(fileName: string) {
        this.filePath = fileName;
        this.pdfDoc = null;
        this.foundPages = {};
    }
    */

    // TODO: use this later in more generic constructor
    async initialize() {
        if(!/file:\/\//i.test(this.file.name)) {
            // const arrayBuffer = await fetch(this.filePath).then(res => res.arrayBuffer());
            // this.pdfDoc = await PDFDocument.load(arrayBuffer);
            this.pdfDoc = await PDFDocument.load(this.file.name);
            return this;
        }
        const arrayBuffer = await fetch(this.file.name).then(res => res.arrayBuffer());
        const uint8 = new Uint8Array(arrayBuffer);
        this.pdfDoc = await PDFDocument.load(uint8);
        return this;
    }

    static satisifiesRules(references: any)  { 
        // TODO: set types: -> Map<PDFRef, boolean>

        // gets Map object of references 
        // returns boolean value if that 
        // page does contain highlighted elements
        return references.get(PDFName.of("Subtype")) === PDFName.of("Highlight");
    }

    findPages() {
        if(!this.pdfDoc) return this;
        const documentReferenceObjects = this.pdfDoc.context?.indirectObjects;
        this.pdfDoc.getPages().forEach((page: PDFPage, pageIndex: any) => {
            const annotationArray = page.node.Annots()?.asArray(); 

            if(!annotationArray) return;
            for(let annotation of annotationArray) {
                if(DocumentCutter.satisifiesRules(documentReferenceObjects.get(annotation))) {
                    this.foundPages[pageIndex] = true;
                    break;
                }
            }
        });
        return this;
    }
    
    removeExtraPages() {
        for(let pageIndex = this.pdfDoc.getPageCount() - 1; pageIndex >= 0; pageIndex--) {
            if(!this.foundPages[pageIndex]) {
                this.pdfDoc.removePage(pageIndex);
            }
        }
        return this;
    }
}

class NewDocumentCreator extends DocumentCutter {
    
    async createNewPDF(fileName=`New_${processTitle(this.file.name)}`) {
        if(!this.pdfDoc.getPageCount()) return false;
        const pdfBytes = await this.pdfDoc.save();
        NewDocumentCreator.downloadFile(pdfBytes, "application/pdf", fileName);
        return true;
    }

    static downloadFile = (content: any, mimeType: string, filename: string) => {
        const a = document.createElement('a')
        const blob = new Blob([content], {type: mimeType})
        const url = URL.createObjectURL(blob)
        a.setAttribute('href', url)
        a.setAttribute('download', filename)
        a.click()
    };
  
    static uploadFile(filePath: string, callback: any) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", filePath);
        httpRequest.send();
        httpRequest.onload = callback;
    }
  
}


export {processTitle, NewDocumentCreator};
