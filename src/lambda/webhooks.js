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

/* MAIN FUNCTION */
exports.handler = async (event) => {

    // Log incoming data
    console.log(event)
    console.log(event?.body)

    // Set up API keys
    const pabblyKeys = {
        username: process.env.PABBLY_PUBLIC_KEY,
        password: process.env.PABBLY_PRIVATE_KEY
    }
    const revolutKey = { Authorization: "Bearer " + process.env.REVOLUT_KEY }

    /* Revolut API call */
    if (
        event?.headers["user-agent"]?.includes("Revolut") &&
        event?.body?.event === "ORDER_COMPLETED") {

        // Check payment details via Revolut API
        const orderResponse = await callAPI({ method: "GET", url: process.env.REVOLUT_URL + '/orders/' + event?.body?.order_id, data: null, auth: null, headers: revolutKey })  
        const orderData = orderResponse?.content

        //Get subscription data via Pabbly API (with "merchant_order_ext_ref" aka subscription_id)
        const subscriptionResponce = await callAPI({ method: "GET", url: 'https://payments.pabbly.com/api/v1/subscription/' + orderData?.merchant_order_ext_ref, data: null, auth: pabblyKeys, headers: null })  
        const subscriptionData = subscriptionResponce?.content

        // Get invoices via Pabbly API (with customer_id)
        const invoicesResponce = await callAPI({ method: "GET", url: 'https://payments.pabbly.com/api/v1/invoices/' + subscriptionData?.data?.customer_id, data: null, auth: pabblyKeys, headers: null })  
        const invoicesData = invoicesResponce?.content

        // Check if this is a verification or an actual payment
        // Check order amount = 0 and there are no invoices
        if (invoicesData?.message === "No Invoice found" && orderData?.order_amount?.value === 0){

            /* Verification payment */

            await callAPI({ method: "POST", url: 'https://payments.pabbly.com/api/v1/subscription/activatetrial/' + orderData?.merchant_order_ext_ref, data: null, auth: pabblyKeys, headers: null })
            
            // Trial acivated
            return {
                statusCode: 200,
                body: JSON.stringify({message: "Trial activated"})
            }
        } else {

            /* Actual payment */

            // Todo: Get latest invoice with matching price
            const currentInvoice = null
            const paymentData = {
                payment_mode: "Revolut Merchant",
                payment_note: "Revolut Order ID: " + orderData?.order_id, 
                transaction: orderData?.order_id
            }

            // Register payment in Pabbly
            await callAPI({ method: "POST", url: 'https://payments.pabbly.com/api/v1/invoice/recordpayment/' + currentInvoice?.id, data: paymentData, auth: pabblyKeys, headers: null })
            
            // Payment recorded 
            return {
                statusCode: 200,
                body: JSON.stringify({message: "Payment recorded"})
            }
        }
    }

    /* Pabbly API call */
    if (
        event?.headers["user-agent"]?.includes("axios") &&
        event?.body?.event_type === "invoice_create") {
        // Pabbly API call to Initiate payment in Revolut after new invoice in Pabbly after payment confirmation in Pabbly
        
        // Check if Data Subscription Gateway Type is custom (otherwise it would also try to be charge PayPal users)

        // Get all customers via https://merchant.revolut.com/api/1.0/customers

        // Find customer ID via email

        // Create order {"amount": 0, "currency": "USD", "customer_id": "fa397c63-e548-417e-a929-8c37d976bf1e"} via https://sandbox-merchant.revolut.com/api/1.0/orders
        
        // Confirm order via https://merchant.revolut.com/api/1.0/orders/{order_id}/confirm

        // Register payment in Pabbly
    }
}