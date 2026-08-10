import React from 'react';

// Catches render/lifecycle errors anywhere below it so one broken panel
// (e.g. a WebGL context failure on a low-resource device) can never blank
// the entire app — instead it shows a real message and a way to recover.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('VibeSpace crashed:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      if (this.props.compact) {
        return (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '10px', minHeight: this.props.minHeight || '220px', background: '#0f172a',
            border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', textAlign: 'center',
            fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
          }}>
            <div style={{ fontSize: '26px' }}>⚠️</div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', maxWidth: '280px' }}>
              {this.props.friendlyMessage || 'This panel hit an error and stopped working.'}
            </p>
            <button
              onClick={() => { this.props.onReset?.(); this.setState({ error: null }); }}
              style={{
                background: '#1e293b', color: '#e2e8f0', fontWeight: 700, fontSize: '11px',
                padding: '8px 16px', borderRadius: '10px', border: '1px solid #334155', cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        );
      }
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
          background: '#020617', color: '#e2e8f0', padding: '24px', textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ fontSize: '40px' }}>⚠️</div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Something went wrong</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', maxWidth: '360px' }}>
            {this.props.friendlyMessage || 'A part of the app hit an unexpected error. Reloading usually fixes it.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(to right, #9333ea, #db2777)', color: 'white',
              fontWeight: 700, fontSize: '13px', padding: '10px 24px', borderRadius: '12px',
              border: 'none', cursor: 'pointer',
            }}
          >
            Reload App
          </button>
          <details style={{ marginTop: '12px', fontSize: '11px', color: '#64748b', maxWidth: '400px' }}>
            <summary style={{ cursor: 'pointer' }}>Technical details</summary>
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{String(this.state.error?.message || this.state.error)}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
