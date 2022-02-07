const express = require('express')
const fs = require('fs')
const https = require('https')
const path = require('path')

const opts = {
  key: fs.readFileSync(path.join(__dirname, 'keys/server_key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'keys/server_cert.pem')),
  requestCert: true,
  rejectUnauthorized: false,
  ca: [
    fs.readFileSync(path.join(__dirname, 'keys/server_cert.pem'))
  ]
}

const app = express()

const auth = (req, res, next) => {
  const cert = req.socket.getPeerCertificate()

  if (req.client.authorized) {
    return next()
  }

  if (cert.subject) {
    return res.status(403)
      .json({
        error: `Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`
      })
  }

  return res.status(401)
    .json({
      error: `Sorry, but you need to provide a client certificate to continue.`
    })
}

app.get('/token', auth, (req, res) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IktlNHA3N0FJRHVFMTlsb3ZqeTQ3NzJlVFB4ajRDVGlBRXlCQ1NPdlk5T3ciLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCIsImtpZCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mZTE3ZTI2Ni1lODc0LTRhNzgtOGIyMy04YzUwYTllNzUyMDYvIiwiaWF0IjoxNjQ0MjU5MjY1LCJuYmYiOjE2NDQyNTkyNjUsImV4cCI6MTY0NDI2MzE2NSwiYWlvIjoiRTJaZ1lEQ3RpK1p6YmZ5dElTU3hZaDNEamJQc0FBPT0iLCJhcHBfZGlzcGxheW5hbWUiOiJQb3N0bWFuIiwiYXBwaWQiOiJmNGEwYWUyYi00M2UzLTQ1NzUtYmFjNi0xZmU5YTJmMmMwMjQiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mZTE3ZTI2Ni1lODc0LTRhNzgtOGIyMy04YzUwYTllNzUyMDYvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJmMzc5ZDBkYy1kNzgyLTRjZDgtOWYwYi0wYjE3ZDk0NjdlMjQiLCJyaCI6IjAuQVh3QVp1SVhfblRvZUVxTEk0eFFxZWRTQmdNQUFBQUFBQUFBd0FBQUFBQUFBQUI4QUFBLiIsInJvbGVzIjpbIkV4dGVybmFsQ29ubmVjdGlvbi5SZWFkV3JpdGUuT3duZWRCeSIsIkdyb3VwLlJlYWQuQWxsIiwiR3JvdXAuQ3JlYXRlIiwiR3JvdXAuUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiLCJHcm91cE1lbWJlci5SZWFkLkFsbCIsIkdyb3VwTWVtYmVyLlJlYWRXcml0ZS5BbGwiXSwic3ViIjoiZjM3OWQwZGMtZDc4Mi00Y2Q4LTlmMGItMGIxN2Q5NDY3ZTI0IiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiZmUxN2UyNjYtZTg3NC00YTc4LThiMjMtOGM1MGE5ZTc1MjA2IiwidXRpIjoic2cwQllKMDQ1MGVrTzdkMm1xbGRBUSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc190Y2R0IjoxNjE4MTI4NjE2fQ.XgYmoe7lfO5bnpmmITjeK6GwOy68aeQhbVvb1Hqw-Pt0p1zYMfnt8j0QtDKq5AQIemF__twMOSl7HHZ9CLt2FF4y6OFQ2BYkqrwAYE66wlz24yZhHijardmc3GRBD6Zbr5nQW-abKKi3zYVdhRYodiustiEyOol_DmF1elKctF9GDDlgRoBkHPzXp5IHRpetrjdzjM3M8J52ukYJg5iiYlrIVUb2ZS_mtfuU5Ydfwqx7LglOspj7-C2lyQbpmTQqCaG5ClKa89fmdZovRWrfFRNnvilmtg3vyzFA2CLcT7GH9uCrjTjAaa6Y2qAHAFrHGWSB9rzPWnK4eAmwyxtt0g'

  res.json({
    access_token: token,
  })
})

https.createServer(opts, app).listen(8443, () => console.log('Server running at https://localhost:8443'))

