import { Component, ReactElement } from 'react';

import { NewDocumentCreator, PDFDocumentSettings } from '../logic/DocumentCutter';
import SelectButton from '../components/SelectButton';
import BackButton from '../components/BackButton';
import Radio from '@material-ui/core/Radio';
import Loading from '../components/Loading';
import '../styles/BackButton.css';


interface CheckoutProps {
  history: any;
  location: {
    state: {
      activeDocuments: File[];
    }
  }
}

interface CheckoutState {
  loadingShown: boolean;
}


class Checkout extends Component<CheckoutProps, CheckoutState> {

  constructor(props: CheckoutProps) {
    super(props);
    this.state = {
      loadingShown: false,
    };
  }

  async handleSubmit() {
    this.toggleLoading();
    await this.loadDocument();
    this.toggleLoading();
  }
  

  async loadDocument() {
    const documents = this.props.location.state.activeDocuments;
    if (!documents.length) return;
    
    
    const settings: PDFDocumentSettings = {
      filter: {
        type: "bold"
      },
      options: undefined
    }
    
    const returnValue = new NewDocumentCreator(documents[0]).createFilteredDocument(settings);

    if (!returnValue) {
      console.log('No pages met the corresponding filters');
    } else {
      console.log('Filter ended!');
    }
  }


  toggleLoading() {
    this.setState({
      loadingShown: !this.state.loadingShown
    });
  }

  render(): ReactElement {
    const { history } = this.props;

    return (
      <div id="pdf-found-div" className="App">
        <BackButton onClick={() => history.goBack()} />
        <div className="App-header">
          <SelectButton onClick={this.handleSubmit.bind(this)} />
          <Loading open={this.state.loadingShown} onCancel={this.toggleLoading.bind(this)} /> 
        </div>
      </div>
    );
  }
}

export default Checkout;
