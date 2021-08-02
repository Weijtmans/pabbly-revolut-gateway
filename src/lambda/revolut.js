import Axios from "axios"

export async function handler(event, context) {

  const config = {
    headers: { Authorization: "Bearer " + process.env.REVOLUT_KEY }
  }

  const bodyParameters = {
      amount: 1,
      currency: "USD"
  }

  try {
    const response = await Axios.post( 
        'https://sandbox-merchant.revolut.com/api/1.0/orders',
        bodyParameters,
        config
    )
    const data = response.data
    // Success
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
      // Error
      if (error.response) {
          /*
          * The request was made and the server responded with a
          * status code that falls out of the range of 2xx
          */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
      } else if (error.request) {
          /*
          * The request was made but no response was received, `error.request`
          * is an instance of XMLHttpRequest in the browser and an instance
          * of http.ClientRequest in Node.js
          */
          console.log(error.request);
      } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message);
      }
      return {
        statusCode: 500,
        body: JSON.stringify(error.message) // Could be a custom message or object i.e. JSON.stringify(err)
      }
  }
}
