import RevolutCheckout from '@revolut/checkout'
import Axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Initiate Sweet Alert 2
const MySwal = withReactContent(Swal)

// Api call function
const callAPI = async (hostedpage) => {
    try {
        // Try API call using Axios
        const apiResponse = await Axios.post('/.netlify/functions/api', { hostedpage })
        // Success
        const apiData = apiResponse.data
        return (apiData)

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

// Revolut checkout popup
const popup = async (order) => {
    const RC = await RevolutCheckout(order, 'sandbox')
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
            console.log(message)
        },
        // (optional) Callback in case user cancelled a transaction
        onCancel() {
            MySwal.fire({
                title: "Payment cancelled",
                icon: 'warning',
                text: 'It seems like the transaction was canceled.',
                confirmButtonText: `Retry`,
                showCancelButton: true,
                customClass: {
                    confirmButton: 'btn btn-primary m-2',
                    cancelButton: 'btn btn-secondary m-2'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    popup(order)
                }
            })
        },
    })
}

export { callAPI, popup }