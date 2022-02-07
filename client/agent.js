const https = require('https')
const fs = require('fs')
const path = require('path')

module.exports = function (name) {
  const certFile = path.resolve(__dirname, `keys/${name}_cert.pem`)
  const keyFile = path.resolve(__dirname, `keys/${name}_key.pem`)

  return new https.Agent({
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile),
    rejectUnauthorized: false,
  })
}
