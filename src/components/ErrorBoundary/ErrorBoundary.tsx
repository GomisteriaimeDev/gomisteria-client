import React, { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.scss";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h1>Diçka shkoi keq</h1>
            <p>Na vjen keq, por ndodhi një gabim i papritur.</p>
            <p>Something went wrong. Please try again.</p>
            <button onClick={this.handleReload} className="error-boundary__btn">
              Kthehu në faqen kryesore / Go to homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
