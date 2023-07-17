import 'cypress-file-upload';

const insertFile = (filepath: string, fileName: string) => {
  cy.get('input[type="file"]').attachFile(filepath + fileName);
  cy.get('.file-dropzone').click()
  cy.get('.file-dropzone').contains(fileName)
}

const addPageRanges = () => {
  cy.get('.add-btn').click()
  cy.get('.page-range-input').type('1-2')
}

const fillOutKeywordSearch = () => {
  cy.get('.pages-contains').type('test1')
  cy.get('.dropdown').contains('Optional').click()

  cy.get('.pages-contains').type('test2')
  cy.get('.dropdown').contains('Optional').click()

  cy.get('.pages-contains').type('test3')
  cy.get('.dropdown').contains('Optional').click()
}


describe('Testing use case to see checkout', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
    // insertFile('pdfs/', 'test-highlighted.pdf')
    // insertFile('pdfs/', 'test.pdf')

    cy.get('.submit-btn').click()
  })

  it('Submit a form', () => {
    fillOutKeywordSearch();

    cy.get('.highlight-switch').click()

    cy.get('.links-switch').click()

    cy.get('.images-switch').click()

    addPageRanges()
    
    // Submit a form
    cy.get('.process-btn').click()
  })
});