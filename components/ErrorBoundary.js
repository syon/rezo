import React from 'react'
import Rescue from './Rescue'

// https://nextjs.org/docs/advanced-features/error-handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="max-w-screen-sm mx-auto my-32">
          <h2 className="text-slate-500 text-2xl my-8">Error!</h2>
          <Rescue />
        </div>
      )
    }

    // Return children components in case of no error
    return this.props.children
  }
}

export default ErrorBoundary
