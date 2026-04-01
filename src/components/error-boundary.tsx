import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
          <h2 className="font-serif text-2xl font-normal italic text-foreground">
            Something went wrong
          </h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 text-sm font-medium text-accent underline-offset-4 hover:underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
