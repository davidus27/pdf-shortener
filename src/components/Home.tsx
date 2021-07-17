import { Component } from 'react';

import { DropzoneArea } from 'material-ui-dropzone';

// import CustomDropzone from './CustomDropzone';
import SelectButton from './SelectButton';

interface HomeProps {
  activeDocuments: File[];
  setActiveDocuments: any;
}

interface HomeState {
  activeDocuments: [];
}

class Home extends Component<HomeProps, HomeState> {

  getName() {
    const splittedPath = window.location.href.split('/',);
    const pdfName = splittedPath[splittedPath.length - 1];
    if (pdfName.length > 50) {
      return pdfName.slice(0, 5) + "..." + pdfName.slice(-7);
    }
    return pdfName;
  }

  render() {
    return (
        <div id="pdf-found-div">

        <div className="position-absolute top-0 start-50 translate-middle-x">
            <br />
            <h1 className="text-center display-5">Insert a new PDF document</h1>
        </div>
        
        <DropzoneArea />
        {/* 
        <div className="position-absolute bottom-50 start-50 translate-middle-x">
          <CustomDropzone acceptedFiles={this.props.activeDocuments} onDropAccepted={(files) => this.props.setActiveDocuments(files)} />
        </div>
        */ }
        {
          Boolean(this.props?.activeDocuments.length) &&
          <SelectButton redirectTo="/Checkout" onClick={() => console.log(this.props.activeDocuments)}/>
        }

    </div>
    );
  }
}

export default Home;
