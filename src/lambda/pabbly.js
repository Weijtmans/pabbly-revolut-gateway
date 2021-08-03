import Axios from "axios"

export async function handler(event, context) {

  const data = JSON.parse(event?.body)
  console.log(data)

  const config = {
    auth: { 
      username: "a24c6373ed10747ae066",
      password: "bd07194ab682c114215b653705792ec0"
    }
  }

  const body = {
      hostedpage: "9d3feee2795e75dc675875a216030385:1b18809b47d10682da819ed0798926cd3938598b7a3da47b73519bf10f0e0c8b092c841ee405e50d49e124ccdaddc7f028a39b556330bfecac1d18af07ccb96a7dfcf89e655d2e947aae9c49e8f8ba932830a9cad9f640d7cfdbfaea14f5ef906784f24e29a41818c2fa33d19a6494d0de39e2a404c2cf306785ddaedf058816ccfe263e78e0fdd3ad027737473f730332702fbe9b67252e009e6512c1be46bd",
  }

  try {
    const response = await Axios.post( 
        'https://payments.pabbly.com/api/v1/verifyhosted',
        body,
        config
    )
    const data = response?.data
    // Success
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
      // Error
      if (error.response) {
          console.log(error?.response?.data)
          console.log(error?.response?.status)
          console.log(error?.response?.headers)
      } else if (error?.request) {
          console.log(error?.request);
      } else {
          console.log('Error', error?.message)
      }
      return {
        statusCode: 500,
        body: JSON.stringify(error?.message)
      }
  }
}
