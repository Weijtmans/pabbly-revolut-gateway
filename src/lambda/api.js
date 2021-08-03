import Axios from "axios"

/* GENERIC API HELPER FUNCTION */
const callAPI = async ({ method, url, data, auth, headers }) => {
  try {
    // Try API call using Axios
    const res = await Axios({
      method,
      url,
      data,
      auth,
      headers
    })
    // Success
    return {
      success: true,
      content: res?.data
    }
  } catch (error) {
    // Error
    return {
      success: false,
      content: error
    }
  }
}

/* PABBLY CODE */
const callPabblyAPI = async ({ hostedpage }) => {
  // Pabbly API credentials
  const pabblyKeys = {
    username: process.env.PABBLY_PUBLIC_KEY,
    password: process.env.PABBLY_PRIVATE_KEY
  }
  // Call Pabbly Hostedpage Endpoint
  const hostedpageResponse = await callAPI({ method: "POST", url: 'https://payments.pabbly.com/api/v1/verifyhosted', data: { hostedpage }, auth: pabblyKeys, headers: null })
  const hostedpageData = hostedpageResponse?.content
  // Log result
  console.log({ hostedpageData })

  if (hostedpageResponse?.success) {
    // Success
    // Call Pabbly Customer Endpoint
    const customerResponse = await callAPI({ method: "GET", url: 'https://payments.pabbly.com/api/v1/customer/' + hostedpageResponse.content?.data?.customer_id, data: null, auth: pabblyKeys, headers: null })
    const customerData = customerResponse?.content
    // Log result
    console.log({ customerData })
    if (customerResponse?.success) {
      // Success
      return {
        success: true,
        content: {
          firstName: customerData?.data?.first_name,
          lastName: customerData?.data?.last_name,
          email: hostedpageData?.data?.email_id,
          country: customerData?.data?.billing_address?.country,
          state: customerData?.data?.billing_address?.state,
          amount: hostedpageData?.data?.amount * 10,
          currency: hostedpageData?.data?.currency_symbol,
          trial: hostedpageData?.data?.trial_days > 0
        }
      }
    } else {
      // Error from Pabbly Customer Endpoint
      return {
        success: false,
        content: customerData
      }
    }
  } else {
    // Error from Pabbly Hostedpage Endpoint
    return {
      success: false,
      body: hostedpageData
    }
  }
}

/* REVOLUT CODE */
const callRevolutAPI = async (data) => {
  // Revolut API credentials
  const revolutKey = { Authorization: "Bearer " + process.env.REVOLUT_KEY }

  // Data to create order
  const order = {
    amount: data?.amount,
    currency: "USD",
    description: "This is a card verification. You will not be charged during your 14-day free trial.",
  }

  // Call Revolut Orders API
  const ordersResponce = await callAPI({ method: "POST", url: 'https://sandbox-merchant.revolut.com/api/1.0/orders', data: order, auth: null, headers: revolutKey })
  const ordersData = ordersResponce?.content
  // Log result
  console.log({ ordersData })
  if (ordersResponce?.success) {
    // Success
    return {
      success: true,
      content: ordersData
    }
  } else {
    // Error from Revolut Orders Endpoint
    return {
      success: false,
      content: ordersData
    }
  }
}

/* MAIN FUNCTION */
exports.handler = async (event) => {
  // Parse data from API call
  const postedData = JSON.parse(event?.body)
  // Log data from API call
  console.log(postedData)

  const pabblyResponse = await callPabblyAPI({ hostedpage: postedData?.hostedpage })
  const pabblyData = pabblyResponse?.content
  if (pabblyResponse?.success) {
    // Success
    // Create Revolut Order
    const revolutResponse = await callRevolutAPI(pabblyData)
    const revolutData = revolutResponse?.content
    if (revolutResponse?.success) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          order: revolutData?.public_id,
          customer: pabblyData
        })
      }
    } else {
      // Error from Revolut Endpoint
      return {
        statusCode: 500,
        body: JSON.stringify(revolutData?.content)
      }
    }
  } else {
    // Error from Pabbly Endpoint
    return {
      statusCode: 500,
      body: JSON.stringify(pabblyData?.content)
    }
  }
}