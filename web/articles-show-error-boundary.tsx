import * as React from 'react';

export class ArticlesShowErrorBoundary extends React.PureComponent<{
  children: React.ReactNode;
}> {
  state = {
    error: false
  };

  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    if (this.state.error) {
      return (
        <>
          <h1>404</h1>
          <p>Article not found.</p>
        </>
      );
    }

    return this.props.children;
  }
}
