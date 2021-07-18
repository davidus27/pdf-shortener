import React, { Component } from 'react';

interface ButtonProps {
  onClick: () => void;
}

interface ButtonState {}

class BackButton extends Component<ButtonProps, ButtonState> {

  render() {
    return (
        <span className="center-con">
        <div className="round" onClick={this.props.onClick} >
            <div id="cta">
                <span className="arrow primera next "></span>
                <span className="arrow segunda next "></span>
            </div>
        </div>
    </span>
    );
  }
}

export default BackButton;
