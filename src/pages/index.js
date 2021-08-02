import React, { Component } from "react"
import RevolutCheckout from '@revolut/checkout'
import Axios from 'axios'
import "../styling/style.css"

class Home extends Component {

  callRevolut = () => async e => {
    e.preventDefault()
  
    const body = {
        amount: 0,
        currency: "USD",
        capture_mode: "MANUAL",
        description: "Tykr Subsciption",
    }

      const response = await Axios.post( 
          '/.netlify/functions/revolut',
          body,
          {}
      )
      const data = response.data
      // Success
      console.log(data)

      const RC = await RevolutCheckout(data.public_id, 'sandbox')

      RC.payWithPopup({
        savePaymentMethodFor: "merchant",
        name: "Elgar Weijtmans",
        email: "elgar@weijtmans.org",
        // Callback called when payment finished successfully
        onSuccess() {
          window.alert("Thank you!");
        },
        // Callback in case some error happened
        onError(message) {
          console.log(message)
          window.alert("Oh no :(");
        },
        // (optional) Callback in case user cancelled a transaction
        onCancel() {
          window.alert("Payment cancelled!");
        },
      })

  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <button onClick={this.callRevolut()}>Call Revolut API</button>
        </header>
      </div>
    )
  }
}

export default Home