import { PDFDocument } from 'pdf-lib';

const downloadFile = (content: any, mimeType: string, filename: string) => {
    const a = document.createElement('a')
    const blob = new Blob([content], {type: mimeType})
    const url = URL.createObjectURL(blob)
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.click()
};

// create DocumentCutter class
export default class DocumentCutter {
    // define attributes
    file: File;
    pdfDoc: PDFDocument;

    // create constructor 
    constructor(file: File) {
        this.file = file;
    }

    private async prepareDocument(): Promise<ArrayBuffer | string> {
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

    public async load() {
        const finalDocument = await this.prepareDocument();
        this.pdfDoc =  await PDFDocument.load(finalDocument);
    }

    public async cut(indexes: Array<number>) {
        if (!this.pdfDoc) return;

        for(let pageIndex = this.pdfDoc.getPageCount() - 1; pageIndex >= 0; pageIndex--) {
            if(!indexes.includes(pageIndex)) {
                this.pdfDoc.removePage(pageIndex);
            }
        }
    }

    // download pdf file
    async download(fileName: string) {
        // if pdfDoc is not defined, initialize it and download the initial file
        if(!this.pdfDoc) await this.load();
        
        const pdfBytes = await this.pdfDoc.save();
        downloadFile(pdfBytes, 'application/pdf', fileName);

    }

    // create new pdf document from current pdf document
    // add indexes of pages to be left in document
    // option to add name of file to be downloaded
    public async processDocument(indexes: Array<number> = [], fileName = 'test.pdf') {
        await this.load();
        await this.cut(indexes);
        await this.download(fileName);
    }

}

