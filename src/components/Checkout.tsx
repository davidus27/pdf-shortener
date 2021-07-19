import { Component } from 'react';

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
      loadingShown: false
    };
  }

  handleSubmit() {
    if (!this.props.activeDocuments.length) return;

    const document = new NewDocumentCreator(this.props.activeDocuments[0]); // TODO: make it for all files
    console.log(document);

    const reader = new FileReader();
    reader.onload = () => {
      NewDocumentCreator.downloadFile(reader.result, 'pdf/application', 'out.pdf');
    }
    reader.readAsArrayBuffer(this.props.activeDocuments[0]);
  }

  render() {
    const { history } = this.props;

    return (
      <div id="pdf-found-div">
        <BackButton onClick={() => history.goBack()} />

        <div className="position-absolute top-0 start-50 translate-middle-x">
            <br />
            <h1 className="text-center display-5">TEXT</h1>
        </div>

        <div className="position-absolute top-50 start-50 translate-middle-x">
          Test.
        </div>
      
        <Button onClick={() => {this.setState({loadingShown: true})}} >Select</Button>
        <Loading loadingShown={this.state.loadingShown} />
        <SelectButton to="/Loading" onClick={this.handleSubmit.bind(this)} />

      </div>
    );
  }
}

export default Checkout;
