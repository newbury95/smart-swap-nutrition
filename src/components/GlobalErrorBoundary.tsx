
import React, { Component, ErrorInfo } from 'react';
import CrashReporter from './CrashReporter';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  componentStack: string | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      componentStack: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      componentStack: errorInfo.componentStack
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      componentStack: null
    });
    
    // Force reload the page to ensure clean state
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // You can render any custom fallback UI
      return (
        <CrashReporter
          error={this.state.error}
          componentStack={this.state.componentStack || undefined}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
