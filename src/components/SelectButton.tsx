import React, { Component } from 'react';
// import {Link} from 'react-router-dom';

import '../styles/SelectButton.css';

interface ButtonProps {
  // to: object | string;
  onClick: () => void;
}

interface ButtonState {}

class SelectButton extends Component<ButtonProps, ButtonState> {

  render() {
    return (
        <div className="submit">
            <button className="submit-btn" onClick={this.props.onClick}>
                Submit
            </button>
        </div>
    );
  }
}

export default SelectButton;
