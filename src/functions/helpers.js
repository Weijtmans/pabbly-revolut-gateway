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
            title: "There was an issue",
            text: error,
            customClass: {
                confirmButton: 'btn btn-primary m-2',
            },
            buttonsStyling: false
        })
        console.log(error)
    }
}

export { callAPI }