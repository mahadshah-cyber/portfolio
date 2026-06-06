"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  webglSupported: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, webglSupported: true };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        this.setState({ webglSupported: false, hasError: true });
      }
    } catch {
      this.setState({ webglSupported: false, hasError: true });
    }
  }

  componentDidCatch(error: Error) {
    console.warn("WebGL/3D error caught:", error.message);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full min-h-[300px] bg-zinc-950/50 rounded-xl border border-zinc-800/50">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-zinc-400 text-sm">3D content requires WebGL</p>
            <p className="text-zinc-600 text-xs mt-1">Try a different browser or update your graphics driver</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
