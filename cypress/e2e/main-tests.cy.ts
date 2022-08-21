import 'cypress-file-upload';

const insertFile = (filepath: string, fileName: string) => {
  cy.get('input[type="file"]').attachFile(filepath + fileName);
  cy.get('.file-dropzone').click()
  cy.get('.file-dropzone').contains(fileName)
  cy.get('.submit-btn').click()
}

const addPageRanges = (pageRange: string) => {
  cy.get('.add-btn').click()
  cy.get('.page-range-input').type(pageRange)
}

const fillOutKeywordSearch = () => {
  cy.get('.pages-contains').type('test1')
  cy.get('.dropdown').contains('Optional').click()

  cy.get('.pages-contains').type('test2')
  cy.get('.dropdown').contains('Optional').click()

  cy.get('.pages-contains').type('test3')
  cy.get('.dropdown').contains('Optional').click()
}


describe('Use case of higlight only', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
  })

  it('Set highlight', () => {
    cy.get('.highlight-switch').click()

    cy.get('.process-btn').click()
  })

  it('Check the result', () => {
    cy.get('#pdf-viewer').should('be.visible')
    // pdf-viewer should contain an image elements
    cy.get('#pdf-viewer').find('canvas').should('have.length', 3)

  })
});

describe('Use case of links only', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
  })

  it('Set links', () => {
    cy.get('.links-switch').click()

    cy.get('.process-btn').click()
  })

  it('Check the result', () => {
    cy.get('#pdf-viewer').should('be.visible')
    // pdf-viewer should contain an image elements
    cy.get('#pdf-viewer').find('canvas').should('have.length', 24)
  })
});

describe('Use case of highlight and links together', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
  })

  it('Set highlight and links', () => {
    cy.get('.highlight-switch').click()
    cy.get('.links-switch').click()

    cy.get('.process-btn').click()
  })

  it('Check the result', () => {
    cy.get('#pdf-viewer').should('be.visible')
    // pdf-viewer should contain an image elements
    cy.get('#pdf-viewer').find('canvas').should('have.length', 24)
  })
});

describe('Use case of highlight OR range together', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
  })

  it('Set highlight', () => {
    cy.get('.highlight-switch').click()

    cy.get('select').select('OR')

    addPageRanges('5-10')

    cy.get('.process-btn').click()
  })

  it('Check the result', () => {
    cy.get('#pdf-viewer').should('be.visible')
    // pdf-viewer should contain an image elements
    cy.get('#pdf-viewer').find('canvas').should('have.length', 8)
  })
});

describe('Use case of links AND range together', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
  })

  it('Set highlight', () => {
    cy.get('.highlight-switch').click()

    cy.get('select').select('AND')

    addPageRanges('5-10')

    cy.get('.process-btn').click()
  })

  it('Check the result', () => {
    cy.get('#pdf-viewer').should('be.visible')
    // pdf-viewer should contain an image elements
    cy.get('#pdf-viewer').find('canvas').should('have.length', 1)
  })
});

describe('Use case of complex page ranges', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  });

  it('Insert a file', () => {
    insertFile('pdfs/', 'OWASP_Top_10.pdf')
  })

  it('Set highlight', () => {
  //   cy.get('.highlight-switch').click()

    cy.get('select').select('OR')

    addPageRanges('1-2,5-10,11-20')

    cy.get('.process-btn').click()
  })

  it('Check the result', () => {
    cy.get('#pdf-viewer').should('be.visible')
    // pdf-viewer should contain an image elements
    cy.get('#pdf-viewer').find('canvas').should('have.length', 18)
  })
});