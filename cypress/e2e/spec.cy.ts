import 'cypress-file-upload';

const insertFile = (filepath: string, fileName: string) => {
  
  cy.get('input[type="file"]').attachFile(filepath + fileName);
  cy.get('.file-dropzone').click()
  cy.get('.file-dropzone').contains(fileName)
  cy.get('.submit-btn').click()
}

const addPageRanges = () => {
  cy.get('.add-btn').click()
  cy.get('.page-range-input').type('1-2')
}

describe('Simple use case of shortening a file', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
    // const filepath = 'pdfs/OWASP_Top_10.pdf'
    // cy.get('input[type="file"]').attachFile(filepath)
    // cy.get('.file-dropzone').click()
    // cy.get('.file-dropzone').contains('OWASP_Top_10.pdf')
    // cy.get('.submit-btn').click()
  })

  it('Submit a form', () => {
    cy.get('.pages-contains').type('test1')
    cy.get('.dropdown').contains('Optional').click()

    cy.get('.pages-contains').type('test2')
    cy.get('.dropdown').contains('Optional').click()

    cy.get('.pages-contains').type('test3')
    cy.get('.dropdown').contains('Optional').click()


    cy.get('.highlight-switch').click()

    cy.get('.links-switch').click()

    cy.get('.images-switch').click()

    addPageRanges()
    
    cy.get('.process-btn').click()
  })

  it('Check the result', () => {
    // cy.get('#pdf-viewer').should('be.visible')
    // pdf-viewer should contain an image elements
    cy.get('#pdf-viewer').find('canvas').should('have.length', 3)

  }) 
});