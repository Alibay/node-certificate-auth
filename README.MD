# Client Certificate Authentication (mTLS) with Node.js

This is demo on how to do client authentication with certificates, **mTLS or mutual TLS** - as opposed to username and passwords with out of the box (OOTB) Node.js.

This demo has a server with two clients:

- "Valid" who has a server-signed trusted certificate
- "Invalid" who has an invalid self-signed certificate

Based on the following tutorials:

- [Authentication using HTTPS client certificates](https://medium.com/@sevcsik/authentication-using-https-client-certificates-3c9d270e8326)
  Author: Andras Sevcsik-Zajácz, Web technology enthusiast

- [HTTPS Authorized Certs with Node.js](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2)
  Author: Anders Brownworth, Rethinking money @CirclePay | Co-taught the Blockchain class at MIT

# Demo: How to Use

First install required dependencies with `npm install`. Then the demo works as follows:

## Step 1 - Start Server

We start a sever that by default only accepts requests authenticated by client certificates

```
npm run server
```

You can test this is working by opening [https://localhost:8443/token](https://localhost:4433/token) in your browser.

## Step 2 - Test Valid Client

```
$ npm run valid-client

> node ./client/valid.js

```

## Step 3 - Test Invalid Client

```
$ npm run invalid-client

> node ./client/invalid.js

```


# Reference - Introduction to Creating Certificates

## Server Certificates

- CN: localhost
- O: Client Certificate Demo

```bash
openssl req \
	-x509 \
	-newkey rsa:4096 \
	-keyout server/keys/server_key.pem \
	-out server/keys/server_cert.pem \
	-nodes \
	-days 365 \
	-subj "/CN=localhost/O=Client\ Certificate\ Demo"
```

This command shortens following _three_ commands:

- `openssl genrsa`
- `openssl req`
- `openssl x509`

which generates _two_ files:

- `server_cert.pem`
- `server_key.pem`

## Create Client Certificates

For demo, two users are created:

- Valid, who has a valid certificate, signed by the server
- Invalid, who creates own certificate, self-signed


### Create Valid Certificate (server-signed)

We create a certificate for Valid.

- sign Certificate Signing Request (CSR)...
- with our server key via `-CA server/keys/server_cert.pem` and
  `-CAkey server/keys/server_key.pem` flags
- and save results as certificate

```bash
# generate server-signed (valid) certificate
openssl req \
	-newkey rsa:4096 \
	-keyout client/keys/valid_key.pem \
	-out client/keys/valid_csr.pem \
	-nodes \
	-days 365 \
	-subj "/CN=Valid"

# sign with server_cert.pem
openssl x509 \
	-req \
	-in client/keys/valid_csr.pem \
	-CA server/keys/server_cert.pem \
	-CAkey server/keys/server_key.pem \
	-out client/keys/valid_cert.pem \
	-set_serial 01 \
	-days 365
```

### Create Invalid Certificate (self-signed)

A certificate without our server key.

```bash
# generate self-signed (invalid) certificate
openssl req \
	-newkey rsa:4096 \
	-keyout client/keys/invalid_key.pem \
	-out client/keys/invalid_csr.pem \
	-nodes \
	-days 365 \
	-subj "/CN=Invalid"

# sign with invalid_csr.pem
openssl x509 \
	-req \
	-in client/keys/invalid_csr.pem \
	-signkey client/keys/invalid_key.pem \
	-out client/keys/invalid_cert.pem \
	-days 365
```

## Notes

- [Let's Encrypt](https://letsencrypt.org/) is a "free, automated, and open" Certificate Authority
- **PEM**: Privacy Enhanced Mail is a Base64 encoded DER certificate

### OpenSSL commands

| Command | Documentation | Description |
|:--|:--|:--|
| `genrsa` | [Docs](https://www.openssl.org/docs/man1.0.2/apps/genrsa.html) |  Generates an RSA private key |
| **`req`** | [Docs](https://www.openssl.org/docs/man1.0.2/apps/req.html) |  Primarily creates and processes certificate requests in PKCS#10 format. It can additionally create self signed certificates for use as root CAs for example. |
| `x509` | [Docs](https://www.openssl.org/docs/man1.0.2/apps/x509.html) | The x509 command is a multi purpose certificate utility. It can be used to display certificate information, convert certificates to various forms, sign certificate requests like a "mini CA" or edit certificate trust settings. |

[View all `openssl` commands &rarr;](https://www.openssl.org/docs/man1.0.2/apps/openssl.html)
