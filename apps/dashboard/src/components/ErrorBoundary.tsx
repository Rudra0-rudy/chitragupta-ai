import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to console only. No network calls — offline-safe.
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReload = (): void => {
    window.location.reload()
  }

  handleGoHome = (): void => {
    window.location.href = '/'
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-[#F5F2E8]">
        <div className="w-full max-w-lg border-2 border-[#1A1A18] bg-white">
          {/* Header strip */}
          <div className="border-b-2 border-[#1A1A18] bg-[#C8302A] px-5 py-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F5F2E8]" strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-widest text-[#F5F2E8]">
              Something went wrong
            </span>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-sm text-[#4A4845] leading-relaxed mb-5">
              This section failed to render. The rest of the application
              is still available — use the buttons below to recover.
            </p>

            {this.state.error?.message && (
              <div className="border-2 border-[#8A8680] bg-[#F5F2E8] px-3 py-2 mb-6">
                <p className="text-[10px] uppercase tracking-widest text-[#8A8680] mb-1">
                  Error
                </p>
                <p className="text-xs font-mono text-[#1A1A18] break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1E3878] hover:bg-[#1A1A18] text-[#F5F2E8] border-2 border-[#1A1A18] rounded-none font-bold uppercase text-xs tracking-widest px-5 py-3 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#E8C018] text-[#1A1A18] border-2 border-[#1A1A18] rounded-none font-bold uppercase text-xs tracking-widest px-5 py-3 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
