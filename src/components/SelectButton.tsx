import React, { Component } from 'react';
import {Link} from 'react-router-dom';

interface ButtonProps {
  redirectTo: string;
  onClick: any;
}

interface ButtonState {}

class SelectButton extends Component<ButtonProps, ButtonState> {

  render() {
    return (
        <div className="submit position-absolute bottom-0 end-0">
          <Link to={this.props.redirectTo}>
            <button className="submit-btn" onClick={this.props.onClick}>
                Submit
            </button>
          </Link>
        </div>
    );
  }
}

export default SelectButton;
