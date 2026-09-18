import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

/**
 * Production React Error Boundary Component
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
    console.error('[ZAYATHON Production Error Boundary]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0B1120] border border-cyan-500/40 text-center space-y-5 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">System Anomaly Detected</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected exception occurred. The runtime state was safely isolated to protect your data.
              </p>
              {this.state.error?.message && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-left overflow-x-auto max-h-32">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
              )}
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl neon-button text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reload Portal State
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
