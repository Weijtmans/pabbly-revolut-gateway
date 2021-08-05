import React, { Component } from "react"
import { withRouter } from "react-router"
import queryString from 'query-string'
import checkmark from '../styling/animations/checkmark.json'
import * as LottiePlayer from "@lottiefiles/lottie-player"

class Success extends Component {

  constructor(props) {
    super(props)
    this.state = {
      trial: false,
    }
  }
  // Props handling
  setTrial = (value) => {
    this.setState({ trial: value })
  }

  async componentDidMount() {
    // Get hostedpage query string
    const params = queryString.parse(this.props.location.search)
    const trial = params?.t

    if (trial === "1"){
      this.setTrial(true)
    }
  }

  render() {
    const animation = JSON.stringify(checkmark)
    const header = () => {
      if (this?.state?.trial) {
        return "Your account is ready to go"
      } else {
        return "Payment successful"
      }
    }
    const text = () => {
      if (this?.state?.trial) {
        return <p>We just sent you an email with a link to choose your password.<br />It usualy takes a couple minutes for it to land in you inbox.</p>
      } else {
        return <p>We have processed you payment.<br />You can go ahead and close this window.</p>
      }
    }

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-7 col-lg-5">
            <div className="login-wrap p-4 p-md-5 text-center">
              <div className="icon d-flex align-items-center justify-content-center">
                <lottie-player
                  autoplay
                  mode="normal"
                  src={animation}
                  style={{ width: "200px", height: "200px" }}
                ></lottie-player>
              </div><br />
              <h3 className="text-center mb-4">{header()}</h3>
              {text()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Success)