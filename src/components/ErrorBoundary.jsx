import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

/**
 * Production React Root Error Boundary Component
 * Catches unhandled errors and allows isolated recovery without losing app state.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ZAYATHON Root Error Boundary]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (window.location.hash || window.location.pathname !== '/') {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex items-center justify-center p-6 font-mono selection:bg-cyan-500 selection:text-black">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0B1120] border border-cyan-500/40 text-center space-y-6 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">System Anomaly Recovered</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An isolated exception occurred. The platform isolated the state to keep your data safe.
              </p>
              {this.state.error?.message && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-left overflow-x-auto max-h-32">
                  <strong>Details:</strong> {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" /> Retry Render
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 rounded-xl neon-button text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
