import { PDFDocument, PDFName, PDFPage } from 'pdf-lib';


/**
 * Helpfull functions for the processing of PDF file
 */

const processTitle = (title: any) => {
    return title.split("/").pop().replace("%20", " ");
}

const downloadFile = (content: any, mimeType: string, filename: string) => {
    const a = document.createElement('a')
    const blob = new Blob([content], {type: mimeType})
    const url = URL.createObjectURL(blob)
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.click()
};

const uploadFile = (filePath: string, callback: any) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", filePath);
    httpRequest.send();
    httpRequest.onload = callback;
};



/**
 * Responsible to convert any convertable form of PDF file 
 * (File | ArrayBuffer | string ...) into PDFDocument object
 */
class DocumentProcessor {
 
    private file: File;

    constructor(input : File) {
        this.file = input;
    }

    protected async prepareFile(): Promise<ArrayBuffer | string> {
        return new Promise((resolve, reject): void =>  {
            const reader = new FileReader();
            reader.onload = res => {
                if (reader.result) {
                    resolve(reader.result);
                }
            };
            reader.onerror = err => reject(err);

            reader.readAsArrayBuffer(this.file);
        });
    }
    
    public async load(): Promise<PDFDocument> {
        const finalDocument = await this.prepareFile();
        return await PDFDocument.load(finalDocument);
    }
}

/**
 * Containing the elementary operations under the PDF file
 */
class DocumentCutter {

    protected pdfDoc: any;
    protected file: File;
    protected foundPages: any;
    
    constructor(file: File) {
        this.file = file;
        this.foundPages = {};
    }

    protected async initialize() {
        this.pdfDoc = await new DocumentProcessor(this.file).load();   
    }


    protected satisifiesRules(references: any)  { 
        // TODO: set types: -> Map<PDFRef, boolean>

        // gets Map object of references 
        // returns boolean value if that 
        // page does contain highlighted elements
        return references.get(PDFName.of("Subtype")) === PDFName.of("Highlight");
    }

    protected findPages(filter: any) {
        if(!this.pdfDoc) return this;
        
        const documentReferenceObjects = this.pdfDoc.context?.indirectObjects;
        this.pdfDoc.getPages().forEach((page: PDFPage, pageIndex: any) => {
            const annotationArray = page.node.Annots()?.asArray(); 

            if(!annotationArray) return;
            for(let annotation of annotationArray) {
                if(this.satisifiesRules(documentReferenceObjects.get(annotation))) {
                    this.foundPages[pageIndex] = true;
                    break;
                }
            }
        });
        return this;
    }
    
    protected removeExtraPages() {
        if (!this.pdfDoc) return this;

        for(let pageIndex = this.pdfDoc.getPageCount() - 1; pageIndex >= 0; pageIndex--) {
            if(!this.foundPages[pageIndex]) {
                this.pdfDoc.removePage(pageIndex);
            }
        }
        return this;
    }

    /**
     * Creates a new PDF document with copied filtered pages.
     * Creates much smaller document, 
     * but does not contain all the information from the original document 
     * @returns newPDFDoc: PDFDocuemnt
     */
    protected async createNewPdf() {
        const newPDFDoc = await PDFDocument.create();
        
        const indexes = Object.keys(this.foundPages).map(element => parseInt(element));

        const copiedPages = await newPDFDoc.copyPages(this.pdfDoc, indexes);

        copiedPages.forEach(page => {
            newPDFDoc.addPage(page);
        });

        return newPDFDoc;
    }
}

interface PDFFilter {
    type: string
};

/**
 * Responsible to filter and create new document that can be downloaded
 */
class NewDocumentCreator extends DocumentCutter {

    async createFilteredDocument(filter: PDFFilter, fileName=`New_${processTitle(this.file.name)}`): Promise<number> {
        // Initiate the PDF document object
        await this.initialize();

        // Check if the object was successfully created
        if(!this.pdfDoc) throw Error;


        // Find pages using corresponding filter and remove them from the PDF document object
        // TODO: create copy of the object and remove pages from it instead
        this.findPages(filter).removeExtraPages();

        // If all pages were removed return 0
        if(!this.pdfDoc.getPageCount()) return 0;
        

        // Save the document and download a file
        const pdfBytes = await this.pdfDoc.save();
        downloadFile(pdfBytes, "pdf/application", fileName);

        // Save new document and download a file
        const newPDFDocument = await this.createNewPdf();
        const newPDFBytes = await newPDFDocument.save();
        downloadFile(newPDFBytes, "pdf/application", 'new_copy.pdf');



        return this.pdfDoc.getPageCount();
    }

  
}

export {processTitle, NewDocumentCreator};
