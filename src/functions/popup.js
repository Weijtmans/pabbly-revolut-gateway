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
                text: String(message).replace('RevolutCheckout: ','') + ".",
                customClass: {
                    confirmButton: 'btn btn-primary m-2',
                },
                buttonsStyling: false,
                confirmButtonText: 'Close',
            })
        }
    })
}

export { popup }