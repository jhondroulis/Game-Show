import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReset() {
    this.setState({ hasError: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-boundary">
        <div className="error-boundary__card">
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__subtitle">
            Try reloading the page. If the issue persists, re-upload the questions file.
          </p>
          <div className="error-boundary__actions">
            <button className="error-boundary__button" onClick={() => window.location.reload()}>
              Reload
            </button>
            <button className="error-boundary__button error-boundary__button--secondary" onClick={this.handleReset}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
};

ErrorBoundary.defaultProps = {
  onReset: null,
};

