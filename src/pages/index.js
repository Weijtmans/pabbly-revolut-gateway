import React, { Component } from "react"
import "../styling/style.css"

class LambdaDemo extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: false, msg: null }
  }

  handleClick = api => e => {
    e.preventDefault()

    this.setState({ loading: true })
    fetch("/.netlify/functions/" + api)
      .then(response => response.json())
      .then(json => this.setState({ loading: false, msg: JSON.stringify(json) }))
  }

  render() {
    const { loading, msg } = this.state

    return (
      <p>
        <button onClick={this.handleClick("revolut")}>{loading ? "Loading..." : "Call Revolut API"}</button>
        <br />
        <span>{msg}</span>
      </p>
    )
  }
}

class Home extends Component {
  render() {
    return (
      <div className="app">
        <header className="app-header">
          <p>
            Checkout
          </p>
          <LambdaDemo />
        </header>
      </div>
    )
  }
}

export default Home
