import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Isolated Section Error Boundary
 * Prevents a single component failure from crashing the rest of the homepage or platform.
 */
class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[ZAYATHON Section Error Boundary - ${this.props.name || 'Section'}]:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full my-6 p-6 rounded-2xl bg-red-950/20 border border-red-500/30 text-center font-mono text-xs text-red-300">
          <div className="flex items-center justify-center gap-2 mb-2 font-bold">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>Section Temporary Error ({this.props.name || 'Component'})</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            This component encountered a minor runtime exception. The rest of the platform continues operating smoothly.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
