"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "../ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

function BrokenChart() {
  return (
    <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,140 18,90 38,78 38,128" fill="#94A3B8" />
      <rect x="18" y="90" width="42" height="50" fill="#CBD5E1" />
      <polygon points="18,90 60,90 38,78 18,78" fill="#DDE3EC" />
      <rect x="42" y="78" width="18" height="20" fill="white" />
      <polygon points="80,140 80,70 100,58 100,128" fill="#94A3B8" />
      <rect x="80" y="70" width="42" height="70" fill="#CBD5E1" />
      <polygon points="80,70 122,70 100,58 80,58" fill="#DDE3EC" />
      <polygon points="138,140 138,34 158,22 158,128" fill="#94A3B8" />
      <rect x="138" y="34" width="42" height="106" fill="#CBD5E1" />
      <polygon points="138,34 180,34 158,22 138,22" fill="#DDE3EC" />
    </svg>
  );
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <BrokenChart />
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-slate-700">Oops, that&apos;s our bad</h2>
        <p className="max-w-sm text-sm text-slate-500">
          We&apos;re not exactly sure what happened, but something went wrong. If you need immediate help, please{" "}
          <a href="mailto:support@communitypro.org" className="underline underline-offset-2">
            let us know
          </a>
          .
        </p>
      </div>
      <Button variant="outline" onClick={onReset} className="gap-2 rounded-full px-6">
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, hasError: false };

  static defaultProps = { resetOnPropsChange: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, hasError: true };
  }

  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState) {
    if (props.resetOnPropsChange && state.hasError) return { error: null, hasError: false };
    return null;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ error: null, hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback onReset={this.resetErrorBoundary} />;
    }
    return this.props.children;
  }
}
