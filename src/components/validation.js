import React, { Component } from "react"
import { withRouter } from "react-router"
import queryString from 'query-string'
import { callAPI, popup } from '../functions/checkout'
import "../styling/style.css"
import logo from '../styling/images/icon.png'

class Validation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
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
        // Get hostedpage query string
        const params = queryString.parse(this.props.location.search)

        // Enable loading
        this.setLoading(true)

        // Get Pabbly & Revolut API data
        const transaction = await callAPI(params?.hostedpage)
        // Save result in props
        this.setTransaction(transaction)
        // Disable loading
        this.setLoading(false)
    }

    clickButton = () => async e => {
        e.preventDefault()

        // Get Revolut public_id from props
        const currentTransaction = this?.state?.transaction?.order
        if (currentTransaction) {
            // Initiate Revolut checkout popup
            popup(currentTransaction)
        }
    }

    render() {
        const { loading, transaction } = this.state
        return (
            <div className="container">
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-sm-12 col-md-7 col-lg-5">
                        <div className="login-wrap p-4 p-md-5 text-center">
                            <div className="icon d-flex align-items-center justify-content-center">
                                <img className="logo" src={logo} alt="Logo" />
                            </div><br />
                            <h3 className="text-center mb-4">Almost there! 💪</h3>
                            <p>We will create a $0 payment to verify your card.<br />Rest assured, you will not be charged during your 14-day free trial.</p>
                            <br />
                            <button className="btn btn-primary rounded submit px-4 btn-lg" onClick={this.clickButton()}>{loading ? <div className="spinner-border spinner-border-sm text-light" role="status"><span className="visually-hidden">Loading...</span></div> : 'Verify your card'}</button>&nbsp;
                            <p><br />{JSON.stringify(transaction?.order)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Validation)