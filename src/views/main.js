import React, { Component } from "react"
import { withRouter } from "react-router"
import queryString from 'query-string'
import { callAPI } from '../functions/helpers'
import Validation from '../components/validation'
import Checkout from '../components/checkout'
import Loader from '../components/loader'

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      transaction: null
    }
  }
  // Props handling
  setLoading = (value) => {
    this.setState({ loading: value })
  }
  setTransaction = (transaction) => {
    this.setState({ transaction })
  }

  async componentDidMount() {
    // Enable loading
    this.setLoading(true)

    // Get hostedpage query string
    const params = queryString.parse(this.props.location.search)
    const hostedpage = params?.hostedpage
    if (hostedpage) {
      // Get Pabbly & Revolut API data
      const transaction = await callAPI(hostedpage)

      // Save result in props
      this.setTransaction(transaction)
      // Disable loading
      this.setLoading(false)
    } else {
      // Redirect in case there is no hostedpage query string
      alert("An error occured. Sorry for the trouble! Please contact us via support@tykr.com or our contact page. We will redirect you to that page right away.")
      window.location.href = 'https://tykr.com/contact'
    }
  }

  render() {

    const activeModule = () => {
      if (this?.state?.loading) {
        return < Loader />
      } else {
        if (this?.state?.transaction?.customer?.trial === false) {
          return < Checkout transaction={this?.state?.transaction} />
        } else {
          return < Validation transaction={this?.state?.transaction} />
        }

      }
    }

    return (
      <div>
        {activeModule()}
      </div>
    )
  }
}

export default withRouter(Main)