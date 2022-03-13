import { PDFDocument, PDFName, PDFObject, PDFPage, PDFDict } from 'pdf-lib';


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

    private async prepareFile(): Promise<ArrayBuffer | string> {
        return new Promise((resolve, reject): void =>  {
            const reader = new FileReader();
            reader.onload = () => {
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

class DocumentFiltering {

    protected rules: { [key: string] : (references: Map<PDFName, PDFObject>) => Boolean } = {
        'image': this.hasImage,
        'link': this.hasLinks,
        'highlight': this.hasHighlight,
    }

    private hasImage(references: Map<PDFName, PDFObject>) : boolean {

        console.log(references.get(PDFName.of("Contents")));

        return !!(references.get(PDFName.of("Contents")));

        // if (this.references.get(PDFName.of("Subtype")) === PDFName.of("")) {

        // }
    }

    private hasLinks(references: Map<PDFName, PDFObject>) : boolean {
        
        console.log('annot:', references.get(PDFName.of("Annot")));
        console.log('annot:', PDFName.of("Annot"));
        console.log('annots:', PDFName.Annots);
        console.log('sub:', PDFName.of("Subtype"));
        console.log('sub:', references.get(PDFName.of("Subtype")));
        // console.log('ref:', PDFName.of("Subtype"));
        // console.log('ref:', PDFName);



        return !!(references.get(PDFName.of("Subtype")) === PDFName.of("Link") || references.get(PDFName.of("Annot")) === PDFName.of("Annot"));
    }

    private hasHighlight(references: Map<PDFName, PDFObject>) : boolean {
        return !!(references.get(PDFName.of("Subtype")) === PDFName.of("Highlight"));
    }

    /**
     * 
     * @param references - references inside one indirect object of the PDF file
     * @param rule - rule that are enforced on what is going to be excluded from the filter
     * @returns Boolean
     */
    public satisifiesRules(references: Map<PDFName, PDFObject>, rule: string) : boolean {
        // gets Map object of references 
        // returns boolean value if that page does contain specified type of reference

        console.log('REFERENCE:', references.get(PDFName.of("Subtype")));
        console.log('ALL:', references.values());
        
        return !!(this.rules[rule](references));
    }
}


/**
 * Containing the elementary operations under the PDF file
 */
class DocumentCutter extends DocumentFiltering {

    private pdfDoc: any;
    private file: File;
    private foundPages: { [key: string]: boolean };
    
    constructor(file: File) {
        super();
        this.file = file;
        this.foundPages = {};
    }

    protected async initialize() {
        this.pdfDoc = await new DocumentProcessor(this.file).load();   
    }
    
    protected get document() {
        return this.pdfDoc;
    }

    protected get documentName() {
        return this.file.name;
    }

    protected findPages(filterType: string) {
        if(!this.pdfDoc) return this;

        this.pdfDoc.getPages().forEach((page: PDFPage, pageIndex: number) => {
            const annotations = page.node.Annots()?.asArray();

            if (!annotations) return;
            for(const annotation of annotations) {
                const referenceDict: PDFDict = this.pdfDoc.context.lookup(annotation);
                
                console.log('Page:', pageIndex);

                if(this.satisifiesRules(referenceDict.asMap(), filterType)) {
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
    type: string;
}

export interface PDFDocumentSettings {
    options: any;
    filter: PDFFilter;
};

/**
 * Responsible to filter and create new document that can be downloaded
 */
class NewDocumentCreator extends DocumentCutter {



    public async createFilteredDocument(settings: PDFDocumentSettings, fileName=`New_${processTitle(this.documentName)}`): Promise<number> {
        // Initiate the PDF document object
        await this.initialize();

        // Check if the object was successfully created
        if(!this.document) throw Error;


        // Find pages using corresponding filter and remove them from the PDF document object
        // TODO: create copy of the object and remove pages from it instead
        this.findPages(settings.filter.type).removeExtraPages();

        // If all pages were removed return 0
        if(!this.document.getPageCount()) return 0;
        

        // // Save the document and download a file
        // const pdfBytes = await this.document.save();
        // downloadFile(pdfBytes, "pdf/application", fileName);

        // // Save new document and download a file
        const newPDFDocument = await this.createNewPdf();
        const newPDFBytes = await newPDFDocument.save();
        downloadFile(newPDFBytes, "pdf/application", 'new_copy.pdf');


        return this.document.getPageCount();
    }

  
}

export {processTitle, NewDocumentCreator};
