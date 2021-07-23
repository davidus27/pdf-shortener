import { Component, ReactElement } from 'react';

import { NewDocumentCreator } from '../logic/DocumentCutter';
import SelectButton from './SelectButton';
import '../styles/BackButton.css';
import BackButton from './BackButton';
import { Button } from '@material-ui/core';
import Loading from './Loading';

interface CheckoutProps {
  activeDocuments: File[];
  history: any;
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

  handleSubmit() {
    if (!this.props.activeDocuments.length) return;

    const document = new NewDocumentCreator(this.props.activeDocuments[0]); // TODO: make it for all files
    // console.log(document);

    const reader = new FileReader();
    reader.onload = () => {
      NewDocumentCreator.downloadFile(reader.result, 'pdf/application', 'out.pdf');
    }
    reader.readAsArrayBuffer(this.props.activeDocuments[0]);
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
          <SelectButton onClick={this.toggleLoading.bind(this)} />
          <Loading open={this.state.loadingShown} onCancel={this.toggleLoading.bind(this)} /> 
        </div>
      </div>
    );
  }
}

export default Checkout;
