const axios = require('axios')
const agent = require('./agent')

const serverUrl = 'https://localhost:8443/token'

let opts = { httpsAgent: agent('valid') }

axios.get(serverUrl, opts)
  .then((res) => {
    console.log(res.data)
  })
  .catch((err) => {
    console.error(err.response.data)
  });
