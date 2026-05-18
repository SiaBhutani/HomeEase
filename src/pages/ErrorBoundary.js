import React, { Component } from 'react';

// Error Boundary Class Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate error occurred
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service
    console.error("Error caught in ErrorBoundary:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return <h2>Something went wrong. Please try again later.</h2>;
    }

    return this.props.children; // Render the child components if no error
  }
}

export default ErrorBoundary;
