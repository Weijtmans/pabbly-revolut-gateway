import React, { Component } from "react"
import RevolutCheckout from '@revolut/checkout'
import Axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "../styling/style.css"
import logo from '../styling/images/icon.png'

const MySwal = withReactContent(Swal)

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

  callAPI = () => async e => {
    e.preventDefault()

    // Loading state handling
    const setLoading = (value) => {
      this.setState({ loading: value })
    }
    // Set loading state to true
    setLoading(true)
    
    // Hardcoded hostedpage data
    // Todo: get from query string
    const hostedpage = "1d0ac0f76bacd694aaa73b9ee9eda234:07f6772b0efb8952b795ac59b2963ab3556934c10f81e2896705d265615d0baca043f273bd320e4d25d1825176e3202b9dcc2e054f611f1028fb81be6311b4737304ddd35845a0d2b6a8c91b74a69b707f8b9ebbf917beb8c448d91da790c2f6a5e6580dc1427e09c233ee1b5d539b874f8ea668b5a523c12f0f3079e1526033c3b54572822b536a1e2bc272af496bc972215b2f20f523695b95e4e7efe4b7c2"

    try {
      // Try API call using Axios
      const apiResponse = await Axios.post('/.netlify/functions/api', { hostedpage })
      // Success
      const apiData = apiResponse.data
      console.log(apiData)

      const RC = await RevolutCheckout(apiData?.order, 'sandbox')

      const popup = () => {
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
              customClass: {
                confirmButton: 'btn btn-primary m-2',
              },
              buttonsStyling: false
            })
            setLoading(false)
          },
          // Callback in case some error happened
          onError(message) {
            MySwal.fire({
              title: "Error",
              text: message,
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary m-2',
              },
              buttonsStyling: false
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

    } catch (error) {
      // Error
      MySwal.fire({
        title: "Error",
        text: error,
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary m-2',
        },
        buttonsStyling: false
      })
      console.log(error)
    }

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
              <button className="btn btn-primary rounded submit px-4 btn-lg" onClick={this.callAPI()}>{loading ? <div className="spinner-border spinner-border-sm text-light" role="status"><span className="visually-hidden">Loading...</span></div> : 'Verify your card'}</button>&nbsp;
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home