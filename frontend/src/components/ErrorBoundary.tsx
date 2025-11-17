import React from 'react';

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    // Log error to console for debugging in dev
    console.error('ErrorBoundary caught error', error, info);
    // store the error so we can show message/stack in the UI while developing
    try {
      this.setState({ error });
    } catch (e) {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded border border-red-200">
          <h3 className="text-lg font-semibold text-red-700">Something went wrong</h3>
          <p className="text-sm text-red-600">An unexpected error occurred while rendering this part of the UI.</p>
          {this.state.error && (
            <div className="mt-3 text-xs text-red-700">
              <div className="font-medium">Error:</div>
              <pre className="whitespace-pre-wrap">{this.state.error.message}</pre>
              <div className="mt-2 font-medium">Stack:</div>
              <pre className="whitespace-pre-wrap text-[10px]">{this.state.error.stack}</pre>
            </div>
          )}
          <div className="mt-3">
            <button onClick={() => window.location.reload()} className="px-3 py-1 rounded bg-red-600 text-white">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}
