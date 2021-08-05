import Axios from "axios"

/* MAIN FUNCTION */
exports.handler = async (event) => {

    /* FLOWS
    1) Activate trial subscription in Pabbly after payment confirmation in Revolut
    - Receive revolut "ORDER_COMPLETED" webhook
    - Check basic values (user-agent and body)
    - Check payment details via Revolut API via https://sandbox-merchant.revolut.com/api/1.0/orders/{order_id} (set env variable for revolut api url)
    - Check order amount = 0 and outstanding amount is 0
    - Get subscription data via Pabbly API (with "merchant_order_ext_ref" aka subscription_id)
    - Get invoices via Pabbly API (with customer_id)
    - Check if there are no invoices
    - Activate trial via https://payments.pabbly.com/api/v1/subscription/activatetrial/subscription_id

    2) Register paid invoice in Pabbly after payment confirmation in Revolut
    - Receive revolut "ORDER_COMPLETED" webhook
    - Check basic values (user-agent and body)
    - Check payment details via Revolut API via https://sandbox-merchant.revolut.com/api/1.0/orders/{order_id}
    - Save order amount = 0 and check outstanding amount is 0
    - Get subscription data via Pabbly API (with "merchant_order_ext_ref" aka subscription_id)
    - Get invoices via Pabbly API (with customer_id)
    - Get latest invoice with matching price
    - Register payment in Pabbly via https://payments.pabbly.com/api/v1/invoice/recordpayment/{invoice_id}

    3) Initiate payment in Revolut after new invoice in Pabbly after payment confirmation in Pabbly
    - Reveive Pabbly "Invoice_created" webhook
    - Check basic values (user-agent and body)
    - Check if Data Subscription Gateway Type is custom
    - Get all customers via https://merchant.revolut.com/api/1.0/customers
    - Find customer ID via email
    - Create order {"amount": 0, "currency": "USD", "customer_id": "fa397c63-e548-417e-a929-8c37d976bf1e"} via https://sandbox-merchant.revolut.com/api/1.0/orders
    - Confirm order via https://merchant.revolut.com/api/1.0/orders/{order_id}/confirm
    - Register payment in Pabbly via https://payments.pabbly.com/api/v1/invoice/recordpayment/{invoice_id}
    */

    console.log(event)
    console.log(event?.body)

    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }

}