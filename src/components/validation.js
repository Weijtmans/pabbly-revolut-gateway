import React, { Component } from "react"
import { popup } from '../functions/popup'
import logo from '../styling/images/icon.png'

class Validation extends Component {

    clickButton = () => async e => {
        e.preventDefault()

        // Get Revolut public_id from props
        const currentTransaction = this?.props?.transaction
        if (currentTransaction) {
            // Initiate Revolut checkout popup
            popup(currentTransaction)
        } else {
            alert("An error occured. Sorry for the trouble! Please contact us via support@tykr.com or our contact page. We will redirect you to that page right away.")
            window.location.href = 'https://tykr.com/contact'
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-12 col-md-7 col-lg-5">
                        <div className="login-wrap p-4 p-md-5 text-center">
                            <div className="icon d-flex align-items-center justify-content-center">
                                <img className="logo" src={logo} alt="Logo" />
                            </div><br />
                            <h3 className="text-center mb-4">Almost there! 💪</h3>
                            <p>We will create a $0 payment to verify your card.<br />Rest assured, you will not be charged during your 14-day free trial.</p>
                            <br />
                            <button className="btn btn-primary rounded submit px-4 btn-lg" onClick={this.clickButton()}>Verify your card</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Validation