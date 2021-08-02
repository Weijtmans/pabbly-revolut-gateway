import Axios from "axios"

export async function handler(event, context) {

  const data = JSON.parse(event.body)
  console.log(data)

  const config = {
    headers: { Authorization: "Bearer " + process.env.REVOLUT_KEY }
  }

  const body = {
      amount: data.amount,
      currency: data.currency,
      capture_mode: data.capture_mode,
      description: data.description,
  }

  try {
    const response = await Axios.post( 
        'https://sandbox-merchant.revolut.com/api/1.0/orders',
        body,
        config
    )
    const data = response.data
    // Success
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
      // Error
      if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
      } else if (error.request) {
          console.log(error.request);
      } else {
          console.log('Error', error.message);
      }
      return {
        statusCode: 500,
        body: JSON.stringify(error.message)
      }
  }
}
