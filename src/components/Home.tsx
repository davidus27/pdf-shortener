import { Component, ReactElement } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

import SelectButton from './SelectButton';


interface HomeProps {}

interface HomeState {
  activeDocuments: File[];
}

class Home extends Component<HomeProps, HomeState> {

  constructor(props: any) {
    super(props);
    this.state = {
      activeDocuments: []
    };
  }

  getName(): string {
    const splittedPath = window.location.href.split('/',);
    const pdfName = splittedPath[splittedPath.length - 1];
    if (pdfName.length > 50) {
      return pdfName.slice(0, 5) + "..." + pdfName.slice(-7);
    }
    return pdfName;
  }

  onChange(files: File[]): void {
    this.setState({activeDocuments: files});
  }

  render(): ReactElement {
    return (
      <div id="pdf-found-div">

        <div className="">
            <br />
            <h1 className="">Insert a new PDF document</h1>
        </div>
        
        <DropzoneArea
          acceptedFiles={['.pdf']}
          showPreviewsInDropzone={true}
          maxFileSize={15728640}
          filesLimit={1}
          useChipsForPreview
          onChange={(files) => this.onChange(files)}
        />

        {
          Boolean(this.state.activeDocuments.length) &&
          <SelectButton 
            to={{pathname: "/Checkout", query: { activeDocuments: this.state.activeDocuments }}} 
            onClick={() => console.log(this.state.activeDocuments)}
          />
        }
      </div>
    );
  }
}

export default Home;
