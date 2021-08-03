import Axios from "axios"

// Generic Pabbly API call function
const callApi = async ({ method, url, data }) => {
  try {
    // Try API call using Axios
    const response = await Axios({
      method,
      url,
      data,
      auth: {
        username: process.env.PABBLY_PUBLIC_KEY,
        password: process.env.PABBLY_PRIVATE_KEY
      }
    })
    // Success
    return {
      success: true,
      content: response?.data
    }
  } catch (error) {
    // Error
    return {
      success: false,
      content: error
    }
  }
}

export async function handler(event, context) {
  // Parse data from API call
  const data = JSON.parse(event?.body)
  // Log data from API call
  console.log(data)

  // Call Pabbly Hostedpage Endpoint
  const hostedpageResponse = await callApi({ method: "POST", url: 'https://payments.pabbly.com/api/v1/verifyhosted', data: { hostedpage: data.hostedpage }})
  const hostedpageData = hostedpageResponse?.content
  // Log result
  console.log({hostedpageData})
  
  if (hostedpageResponse?.success) {
    // Success
    // Call Customer Endpoint
    const customerResponse = await callApi({ method: "GET", url: 'https://payments.pabbly.com/api/v1/customer/' + hostedpageResponse.content?.data?.customer_id, data: null})
    const customerData = customerResponse?.content
    // Log result
    console.log({customerData})
    if (customerResponse?.success) {
      // Success; Return data to front-end
      return {
        statusCode: 200,
        body: JSON.stringify({
          firstName: customerData?.data?.first_name,
          lastName: customerData?.data?.last_name,
          email: hostedpageData?.data?.email_id,
          country: customerData?.data?.billing_address?.country,
          state: customerData?.data?.billing_address?.state,
          amount: hostedpageData?.data?.amount * 10,
          currency: hostedpageData?.data?.currency_symbol,
          trial: hostedpageData?.data?.trial_days > 0
        })
      }
    } else {
      // Error from Customer Endpoint
      return {
        statusCode: 500,
        body: JSON.stringify(customerData)
      }
    }
  } else {
    // Error from Hostedpage Endpoint
    return {
      statusCode: 500,
      body: JSON.stringify(hostedpageData)
    }
  }
}
