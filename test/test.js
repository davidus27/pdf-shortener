const assert = require('assert');
const core = require("../src/core");

pdfViewer = core.PdfViewer;
pdfProcessor = core.PdfProcessor;


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe("PdfViewer", function () {
    describe("constructor", function () {
        it("should return a new instance of PdfViewer", function () {
            var pdfViewer = new PdfViewer([]);
            assert.equal(pdfViewer instanceof PdfViewer, true);
        });
    });
}
