import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Button extends Component {
  sendMessage() {
    const { msg } = this.props;
    console.log(`Message to pass ${msg}`); // eslint-disable-line no-console
  }

  render() {
    const { children } = this.props;
    return <button type="button" onClick={() => this.sendMessage()}>{children}</button>;
  }
}

Button.propTypes = {
  children: PropTypes.node,
  msg: PropTypes.string.isRequired,
};

Button.defaultProps = {
  children: [],
};
