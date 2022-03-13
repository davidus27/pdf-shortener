import { Component, ReactElement } from 'react';

import { NewDocumentCreator, PDFDocumentSettings } from '../logic/DocumentCutter';
import SelectButton from '../components/SelectButton';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import DocumentForm from '../components/DocumentForm';
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
  settings: PDFDocumentSettings;
}


class Checkout extends Component<CheckoutProps, CheckoutState> {

  protected documentCreator: NewDocumentCreator;

  constructor(props: CheckoutProps) {
    super(props);
    this.state = {
      loadingShown: false,
      settings: {
        filter: {
          type: "link"
        },
        options: undefined
      }
    };

    this.documentCreator = new NewDocumentCreator(this.props.location.state.activeDocuments[0]);
  }

  async handleSubmit() {
    this.toggleLoading();
    await this.loadDocument();
    this.toggleLoading();
  }
  

  async loadDocument() {

    const returnValue = this.documentCreator.createFilteredDocument(this.state.settings);

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
        <DocumentForm />
        <SelectButton onClick={this.handleSubmit.bind(this)} />
        <Loading open={this.state.loadingShown} onCancel={this.toggleLoading.bind(this)} /> 
      </div>
    );
  }
}

export default Checkout;
