import React, { Component, ErrorInfo, ReactNode } from 'react';

import { isAPIError } from '../auth/api';

interface Props {
  children: ReactNode;
  container?: boolean;
}

interface State {
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {};

  public static getDerivedStateFromError(err: Error): State {
    if (isAPIError(err)) {
      return { message: err.message };
    }
    return { message: err.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.message) {
      const alert = (
        <div className="alert alert-danger">{this.state.message}</div>
      );
      return this.props.container ? (
        <div className="container-fluid my-3">{alert}</div>
      ) : (
        alert
      );
    }

    return this.props.children;
  }
}
