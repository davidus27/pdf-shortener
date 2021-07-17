import React, { Component } from 'react';
import {  Link } from 'react-router-dom';

class Loading extends Component {

  render() {
    // setTimeout(() => {this.props.history.push('/'); }, 3000); // timing to go to the other page

    return (
      <div id="loading-screen">
          <div className="loading-animation text-center position-absolute top-50 start-50 translate-middle">
            
            <div id="loading-overlay">
              <Link id="cancel-loading-button" to="/Checkout">
                <img src="cancel-button.png" width="25" height="25" alt="X"></img>
              </Link>
                  <span id="loading" className="spinner spinner-grow" role="status"></span>
            </div>

            <div id="loading-txt"><strong>Processing PDF file, please wait...</strong></div>
            
          </div>
        <div id="overlay"></div>
      </div>
    );
  }
}

export default Loading;
