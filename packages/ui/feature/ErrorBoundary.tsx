import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-black text-ink">Something went wrong</h2>
                    <p className="mt-2 text-sm text-muted max-w-md">
                        An unexpected error occurred while rendering this page.
                    </p>
                    {this.state.error && (
                        <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-slate-100 p-4 text-left text-xs text-slate-600">
                            {this.state.error.message}
                        </pre>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
