import { PDFDocument, PDFName } from 'pdf-lib';

const processTitle = (title: any) => {
    return title.split("/").pop().replace("%20", " ");
}

class DocumentCutter {
    constructor(fileName) {
        this.filePath = fileName;
        this.pdfDoc = null;
        this.foundPages = {};
    }

    async initialize() {
        if(!/file:\/\//i.test(this.filePath)) {
            // const arrayBuffer = await fetch(this.filePath).then(res => res.arrayBuffer());
            // this.pdfDoc = await PDFDocument.load(arrayBuffer);
            this.pdfDoc = await PDFDocument.load(this.filePath);
            return this;
        }
        const arrayBuffer = await fetch(this.filePath).then(res => res.arrayBuffer());
        const uint8 = new Uint8Array(arrayBuffer);
        this.pdfDoc = await PDFDocument.load(uint8);
        return this;
    }

    static satisifiesRules(references)  { 
        // TODO: set types: -> Map<PDFRef, boolean>

        // gets Map object of references 
        // returns boolean value if that 
        // page does contain highlighted elements
        return references.get(PDFName.of("Subtype")) === PDFName.of("Highlight");
    }

    findPages() {
        if(!this.pdfDoc) return this;
        const documentReferenceObjects = this.pdfDoc.context?.indirectObjects;
        this.pdfDoc.getPages().forEach((page, pageIndex) => {
            if(!page.node.Annots()?.array) return;
            for(let annotation of page.node.Annots()?.array) {
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
    
    async createNewPDF(fileName=`New_${processTitle(this.filePath)}`) {
        if(!this.pdfDoc.getPageCount()) return false;
        const pdfBytes = await this.pdfDoc.save();
        NewDocumentCreator.download(pdfBytes, "application/pdf", fileName);
        return true;
    }

    static downloadFile = (content, mimeType, filename) => {
        const a = document.createElement('a')
        const blob = new Blob([content], {type: mimeType})
        const url = URL.createObjectURL(blob)
        a.setAttribute('href', url)
        a.setAttribute('download', filename)
        a.click()
    };
  
    static uploadFile(filePath, callback) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", filePath);
        httpRequest.send();
        httpRequest.onload = callback;
    }
  
}


export {processTitle, NewDocumentCreator};
