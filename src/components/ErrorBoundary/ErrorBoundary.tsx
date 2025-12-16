import { Component } from 'react';
import type { ReactNode } from 'react';
import './ErrorBoundary.css';

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

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

