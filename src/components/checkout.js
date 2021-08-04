import React, { Component } from "react"
import { popup } from '../functions/popup'

class Checkout extends Component {

    componentDidMount() {
        // Get Revolut public_id from props
        const currentTransaction = this?.props?.transaction
        this.loadPopup(currentTransaction)
    }

    loadPopup = (currentTransaction) => {
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
            <div></div>
        )
    }
}

export default Checkout