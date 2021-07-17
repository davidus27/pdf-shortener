import React, { Component } from 'react';
import {Link} from 'react-router-dom';
// import { Checkbox, Card  } from '@procore/core-react'

import { NewDocumentCreator } from '../logic/DocumentCutter';


import SelectButton from './SelectButton';
import '../styles/BackButton.css';

interface CheckoutProps {
  activeDocuments: File[];
}

interface CheckoutState {
  activeDocuments: [];
}


class Checkout extends Component<CheckoutProps, CheckoutState> {

  handleSubmit() {
    const document = new NewDocumentCreator(this.props.activeDocuments[0]); // TODO: make it for all files
    console.log(document);

    const reader = new FileReader();
    reader.onload = () => {
      NewDocumentCreator.downloadFile(reader.result, 'pdf/application', 'out.pdf');
    }
    reader.readAsArrayBuffer(this.props.activeDocuments[0]);
  }

  render() {
    return (
      <div id="pdf-found-div">
        <span className="center-con">
          <Link to="/">
            <div className="round">
                <div id="cta">
                    <span className="arrow primera next "></span>
                    <span className="arrow segunda next "></span>
                </div>
            </div>
          </Link>
        </span>

      <div className="position-absolute top-0 start-50 translate-middle-x">
          <br />
          <h1 className="text-center display-5">TEXT</h1>
      </div>

      <div className="position-absolute top-50 start-50 translate-middle-x">
        Test.
      </div>
      


        <SelectButton redirectTo="/Loading" onClick={this.handleSubmit.bind(this)} />

      </div>
    );
  }
}

export default Checkout;
