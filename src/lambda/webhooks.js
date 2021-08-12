import Axios from "axios"
const loggly = require('loggly')

const client = loggly.createClient({
    token: process.env.LOGGLY_TOKEN,
    subdomain: "https://tykr.loggly.com",
    auth: {
        username: "Weijtmans",
        password: process.env.LOGGLY_PASSWORD
    }
})

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

    if (event?.body) {

        // Set up API keys
        const pabblyKeys = {
            username: process.env.PABBLY_PUBLIC_KEY,
            password: process.env.PABBLY_PRIVATE_KEY
        }
        const revolutKey = { Authorization: "Bearer " + process.env.REVOLUT_KEY }

        // Parse request body
        const body = JSON.parse(event?.body)

        /* Revolut API call to register payment */
        if (
            event?.headers["user-agent"]?.includes("Revolut") &&
            body?.event === "ORDER_COMPLETED") {

            // Check payment details via Revolut API

            /* ERROR WITH THE REVOLUT MERCHANT API FOR GETTING SINGLE ORDER BY ID */
            const revolutOrderId = body?.order_id

            // Get order data from Revolut
            const orderResponse = await callAPI({ method: "GET", url: process.env.REVOLUT_URL + '/orders/' + revolutOrderId, data: null, auth: null, headers: revolutKey })
            const orderData = orderResponse?.content

            // Get subscription data via Pabbly API (with "merchant_order_ext_ref" aka subscription_id)
            const subscriptionResponce = await callAPI({ method: "GET", url: 'https://payments.pabbly.com/api/v1/subscription/' + orderData?.merchant_order_ext_ref, data: null, auth: pabblyKeys, headers: null })
            const subscriptionData = subscriptionResponce?.content

            // Get invoices via Pabbly API (with customer_id)
            const invoicesResponce = await callAPI({ method: "GET", url: 'https://payments.pabbly.com/api/v1/invoices/' + subscriptionData?.data?.customer_id, data: null, auth: pabblyKeys, headers: null })
            const invoicesData = invoicesResponce?.content

            // Check if this is a verification or an actual payment
            // Check order amount = 0 and there are no invoices
            client.log({PABBLY_REGISTER_PAYMENT_INVOICE: invoicesData})
            if (invoicesData?.message === "No Invoice found" && orderData?.order_amount?.value <= 1) {

                /* Verification payment */

                // Activate trial in Pabbly
                const activationResponse = await callAPI({ method: "POST", url: 'https://payments.pabbly.com/api/v1/subscription/activatetrial/' + orderData?.merchant_order_ext_ref, data: null, auth: pabblyKeys, headers: null })
                const activationData = activationResponse?.content

                client.log({PABBLY_TRIAL_ACTIVATED: {
                    message: activationData?.message,
                    revolut_order_id: orderData?.id,
                    pabbly_subscription_id: orderData?.merchant_order_ext_ref
                }})

                // Trial acivated
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: activationData?.message })
                }
            } else {

                /* Regular payment */

                // Get latest invoice
                const currentInvoice = invoicesData?.data[0]
                const paymentData = {
                    payment_mode: "Revolut Merchant",
                    payment_note: "Revolut ID: " + orderData?.id,
                    transaction: orderData?.id
                }

                // Record payment in Pabbly
                const paymentRecordedResponse = await callAPI({ method: "POST", url: 'https://payments.pabbly.com/api/v1/invoice/recordpayment/' + currentInvoice?.id, data: paymentData, auth: pabblyKeys, headers: null })
                const paymentRecordedData = paymentRecordedResponse?.content

                // Log interaction
                client.log({PABBLY_PAYMENT_RECORDED: {
                    message: paymentRecordedData?.message,
                    revolut_order_id: orderData?.id,
                    pabbly_incoice_id: orderData?.merchant_order_ext_ref
                }})

                // Payment recorded
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: paymentRecordedData?.message })
                }
            }
        } else if (
            event?.headers["user-agent"]?.includes("Revolut") && (
                body?.event === "ORDER_PAYMENT_DECLINED" || body?.event === "ORDER_PAYMENT_FAILED"
            )) {

            /* Payment declined or failed */

            //Get subscription data via Pabbly API (with "merchant_order_ext_ref" aka subscription_id)
            const subscriptionResponce = await callAPI({ method: "GET", url: 'https://payments.pabbly.com/api/v1/subscription/' + body?.merchant_order_ext_ref, data: null, auth: pabblyKeys, headers: null })
            const subscriptionData = subscriptionResponce?.content

            // Get invoices via Pabbly API (with customer_id)
            const invoicesResponce = await callAPI({ method: "GET", url: 'https://payments.pabbly.com/api/v1/invoices/' + subscriptionData?.data?.customer_id, data: null, auth: pabblyKeys, headers: null })
            const invoicesData = invoicesResponce?.content

            // Get latest invoice
            const currentInvoice = invoicesData?.data[0]

            // Create error object
            const errorData = {
                error_message: body?.event,
                transaction: "Revolut ID: " + body?.order_id,
            }

            // Register failed payment in Pabbly
            const failedPaymentResponse = await callAPI({ method: "POST", url: 'https://payments.pabbly.com/api/v1/invoice/failedpayment/' + currentInvoice?.id, data: errorData, auth: pabblyKeys, headers: null })
            const failedPaymentData = failedPaymentResponse?.content

            // Log interaction
            client.log({PABBLY_PAYMENT_FAILED: {
                message: body?.event,
                revolut_order_id: body?.order_id,
                pabbly_incoice_id: body?.merchant_order_ext_ref
            }})

            // Failed payment recorded
            return {
                statusCode: 200,
                body: JSON.stringify({ message: failedPaymentData?.message })
            }

        } else if (
            event?.headers["user-agent"]?.includes("axios") &&
            body?.event_type === "invoice_create" &&
            body?.event_source === "scheduler") {

            /* Pabbly API call */

            // Pabbly API call to Initiate payment in Revolut after new invoice by scheduler in Pabbly

            // Check if Data Subscription Gateway Type is custom (otherwise it would also try to be charge PayPal users)
            if (body?.data?.subscription?.gateway_type === "custom") {

                const order = {
                    amount: body?.data?.credit_note?.charge_amount * 100,
                    currency: "USD",
                    description: body?.data?.subscription?.plan?.plan_name,
                    email: body?.data?.subscription?.email_id,
                    merchant_order_ext_ref: body?.data?.subscription_id
                }

                // Create order un Revolut
                const ordersResponce = await callAPI({ method: "POST", url: process.env.REVOLUT_URL + '/orders', data: order, auth: null, headers: revolutKey })
                const ordersData = ordersResponce?.content

                // Check if order was created
                if (ordersResponce?.success) {
                    // Success

                    // Confirm order via order id
                    const confirmationResponce = await callAPI({ method: "POST", url: process.env.REVOLUT_URL + '/orders/' + ordersData?.id + "/confirm", data: null, auth: null, headers: revolutKey })
                    const confirmationData = confirmationResponce?.content

                    // Log interaction
                    client.log({REVOLUT_CREATED_RECURRING_ORDER: confirmationResponce})

                    // Payment confirmed and payment will be registered in Pabbly via webhook (above)
                    return {
                        statusCode: 200,
                        body: JSON.stringify(confirmationData)
                    }
                } else {
                    // Error from Revolut Orders Endpoint

                    // Create error object
                    const errorData = {
                        error_message: "Could not create (recurring) order in Revolut",
                        transaction: ordersData,
                    }

                     // Register failed payment in Pabbly
                    const failedPaymentResponse = await callAPI({ method: "POST", url: 'https://payments.pabbly.com/api/v1/invoice/failedpayment/' + body?.data?.id, data: errorData, auth: pabblyKeys, headers: null })
                    const failedPaymentData = failedPaymentResponse?.content

                    return {
                        statusCode: 200,
                        body: JSON.stringify({ error: failedPaymentData })
                    }
                }
            }
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ error: "unauthorized" })
            }
        }
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({ error: "unauthorized" })
        }
    }
}