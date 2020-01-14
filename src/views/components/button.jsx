import { ipcRenderer } from "electron";
import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Button extends Component {
  sendMessage() {
    const { msg } = this.props;
    ipcRenderer.send("render.scene", msg);
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
