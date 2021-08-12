import RevolutCheckout from '@revolut/checkout'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Initiate Sweet Alert 2
const MySwal = withReactContent(Swal)

// Revolut checkout popup
const popup = async (transaction) => {
    const RC = await RevolutCheckout(transaction?.order, process.env.REACT_APP_REVOLUT_ENVIRONMENT)
    RC.payWithPopup({
        name: transaction?.customer?.firstName + " " + transaction?.customer?.lastName,
        email: transaction?.customer?.email,
        billingAddress: {
            countryCode: transaction?.customer?.country,
            postcode: transaction?.customer?.zip ? transaction?.customer?.zip : '00000'
        },
        // Callback called when payment finished successfully
        onSuccess() {
            if(transaction?.customer?.trial === true){
                window.location.href = '/success?t=1'
            } else {
                window.location.href = '/success'
            }
            //window.location.href = '/success'
        },
        // Callback in case some error happened
        onError(message) {
            MySwal.fire({
                title: "There was an issue",
                text: String(message).replace('RevolutCheckout: ',''),
                confirmButtonText: "Retry",
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'btn btn-primary m-2',
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    popup(transaction)
                }
            })
        },
        // Callback in case user cancelled a transaction
        onCancel() {
            MySwal.fire({
                title: "Transaction canceled",
                text: "Please click retry to restart the transaction",
                allowOutsideClick: false,
                confirmButtonText: "Retry",
                customClass: {
                    confirmButton: 'btn btn-primary m-2',
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    popup(transaction)
                }
            })
        }
    })
}

export { popup }