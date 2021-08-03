import Axios from "axios"

export async function handler(event, context) {

  const data = JSON.parse(event?.body)
  console.log(data)

  const config = {
    auth: {
      username: process.env.PABBLY_PUBLIC_KEY,
      password: process.env.PABBLY_PRIVATE_KEY
    }
  }

  const body = {
    hostedpage: data.hostedpage,
  }

  try {
    const response = await Axios.post(
      'https://payments.pabbly.com/api/v1/verifyhosted',
      body,
      config
    )
    const data = response?.data
    // Success
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    // Error
    if (error.response) {
      console.log(error?.response?.data)
      console.log(error?.response?.status)
      console.log(error?.response?.headers)
    } else if (error?.request) {
      console.log(error?.request);
    } else {
      console.log('Error', error?.message)
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error?.message)
    }
  }
}
