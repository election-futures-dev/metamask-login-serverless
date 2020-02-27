# MetaMask Login Serverless

MetaMask login using AWS Lambda.


## Web API

APIs should get through AWS API Gateway.


### POST /auth

Get token for a public address.

* Request Body JSON
```json
{
  "publicAddress": "string",
  "nonce": "string",
  "signature": "string"
}
```

* Response JSON
```json
{
  "token": "string"
}
```


## Deployment

Using AWS CLI

```
aws lambda update-function-code --function-name [FUNCTION NAME] --zip-file fileb://./build/build.zip
```
