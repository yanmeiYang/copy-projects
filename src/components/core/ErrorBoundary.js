/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { renderChildren } from 'engine';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    console.error('ErrorBoundary:::', error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          border: 'solid 1px red',
          margin: 8,
          padding: 8,
        }}>
          <h1>Something went wrong.</h1>
          {renderChildren(this.props.children)}
        </div>
      );
    }
    return renderChildren(this.props.children);
    ;
  }
}
