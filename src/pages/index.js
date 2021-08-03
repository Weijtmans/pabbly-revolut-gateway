import React, { Component } from "react"
import RevolutCheckout from '@revolut/checkout'
import Axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import "../styling/style.css"
import logo from '../styling/images/icon.png'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  /*
  componentDidMount() {
    window.addEventListener('load', this.callRevolut())
  }
  */

  callPabbly = () => async e => {
    
    const hostedpage = "9d3feee2795e75dc675875a216030385:1b18809b47d10682da819ed0798926cd3938598b7a3da47b73519bf10f0e0c8b092c841ee405e50d49e124ccdaddc7f028a39b556330bfecac1d18af07ccb96a7dfcf89e655d2e947aae9c49e8f8ba932830a9cad9f640d7cfdbfaea14f5ef906784f24e29a41818c2fa33d19a6494d0de39e2a404c2cf306785ddaedf058816ccfe263e78e0fdd3ad027737473f730332702fbe9b67252e009e6512c1be46bd"
    
    const pabblyBody = {
      hostedpage
    }

    const pabblyResponse = await Axios.post(
      '/.netlify/functions/pabbly',
      pabblyBody,
      {}
    )
    const pabblyData = pabblyResponse.data
    // Success
    console.log(pabblyData)
  }

  callRevolut = () => async e => {
    e.preventDefault()

    const MySwal = withReactContent(Swal)

    const revolutBody = {
      amount: 0,
      currency: "USD",
      description: "This is a card verification. You will not be charged during your 14-day free trial.",
    }

    const revolutResponse = await Axios.post(
      '/.netlify/functions/revolut',
      revolutBody,
      {}
    )
    const revolutData = revolutResponse.data
    // Success
    console.log(revolutData)

    const setLoading = (value) => {
      this.setState({ loading: value })
    }

    const RC = await RevolutCheckout(revolutData, 'sandbox')

    const popup = () => {
      setLoading(true)
      RC.payWithPopup({
        savePaymentMethodFor: "merchant",
        name: "Elgar Weijtmans",
        email: "elgar@weijtmans.org",
        // Callback called when payment finished successfully
        onSuccess() {
          MySwal.fire({
            title: "Success",
            text: 'We sent you an email to choose your password.',
            icon: 'success',
          })
          setLoading(false)
        },
        // Callback in case some error happened
        onError(message) {
          MySwal.fire({
            title: "Error",
            text: message,
            icon: 'error',
          })
          setLoading(false)
          console.log(message)
        },
        // (optional) Callback in case user cancelled a transaction
        onCancel() {
          MySwal.fire({
            title: "Payment cancelled",
            icon: 'warning',
            text: 'It seems like the payment was canceled.',
            confirmButtonText: `Retry`,
            showCancelButton: true,
            customClass: {
              confirmButton: 'btn btn-primary m-2',
              cancelButton: 'btn btn-secondary m-2'
            },
            buttonsStyling: false
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              popup()
            }
          })
          setLoading(false)
        },
      })
    }

    popup()

  }
  render() {
    const { loading } = this.state
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-7 col-lg-5">
            <div className="login-wrap p-4 p-md-5 text-center">
              <div className="icon d-flex align-items-center justify-content-center">
                <img className="logo" src={logo} alt="Logo" />
              </div><br />
              <h3 className="text-center mb-4">Almost there! 💪</h3>
              <p>We will create a $0.00 payment to verify your card.<br />Rest assured, you will not be charged during your 14-day free trial.</p>
              <br />
              <button className="btn btn-primary rounded submit px-4 btn-lg" onClick={this.callRevolut()}>{loading ? <div className="spinner-border spinner-border-sm text-light" role="status"><span className="visually-hidden">Loading...</span></div> : 'Verify your card'}</button>&nbsp;
              <button className="btn btn-primary rounded submit px-4 btn-lg" onClick={this.callPabbly()}>Call Pabbly</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home