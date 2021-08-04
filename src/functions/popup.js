import RevolutCheckout from '@revolut/checkout'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Initiate Sweet Alert 2
const MySwal = withReactContent(Swal)

// Revolut checkout popup
const popup = async (transaction) => {
    const RC = await RevolutCheckout(transaction?.order, 'sandbox')
    RC.payWithPopup({
        name: transaction?.customer?.firstName + " " + transaction?.customer?.lastName,
        email: transaction?.customer?.email,
        billingAddress: {
            countryCode: transaction?.customer?.country,
            postcode: transaction?.customer?.zip ? transaction?.customer?.zip : '00000'
        },
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
                title: "Transaction was cancelled",
                icon: 'warning',
                text: 'Please click the button below to enter your card details.',
                confirmButtonText: `Retry`,
                customClass: {
                    confirmButton: 'btn btn-primary m-2',
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    popup(transaction?.order)
                }
            })
        },
    })
}

export { popup }