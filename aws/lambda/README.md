# Collision Counselor Lead Processor Lambda

This Lambda function processes leads submitted through the Collision Counselor website. It performs the following actions:

1. Stores lead data in an S3 bucket
2. Stores lead data in a DynamoDB table
3. Claims TrustedForm certificates (if available)
4. Forwards lead data to Ringba for call transfer

## Deployment Instructions

### Prerequisites

- AWS CLI installed and configured
- Node.js and npm installed

### Steps to Deploy

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a ZIP package for Lambda:
   ```bash
   zip -r function.zip index.js node_modules package.json
   ```

3. Create or update the Lambda function:
   ```bash
   # If creating a new function
   aws lambda create-function \
     --function-name collision-counselor-lead-processor \
     --runtime nodejs20.x \
     --handler index.handler \
     --zip-file fileb://function.zip \
     --role arn:aws:iam::<YOUR-ACCOUNT-ID>:role/collision-counselor-lambda-role

   # If updating an existing function
   aws lambda update-function-code \
     --function-name collision-counselor-lead-processor \
     --zip-file fileb://function.zip
   ```

4. Add environment variables (optional):
   ```bash
   aws lambda update-function-configuration \
     --function-name collision-counselor-lead-processor \
     --environment "Variables={IS_PRODUCTION=true}"
   ```

## Testing

To test the function, you can send a test event through the AWS Console or using the AWS CLI:

```bash
aws lambda invoke \
  --function-name collision-counselor-lead-processor \
  --payload '{"firstName":"Test","lastName":"User","email":"test@example.com","mobile":"1234567890","zipCode":"90210","accidentDate":"2023-01-01","hasAttorney":"no","atFault":false,"priorSettlement":false,"lead_id":"CL-TEST123"}' \
  response.json
```

## Production Configuration

For production:

1. Ensure the IS_PRODUCTION environment variable is set to "true"
2. Add an API Gateway trigger to expose an endpoint
3. Configure appropriate IAM permissions for:
   - S3 bucket access
   - DynamoDB table access
   - Systems Manager Parameter Store access
   - Cloudwatch logs

## Security Considerations

- API keys are stored in AWS Systems Manager Parameter Store
- No sensitive credentials are hardcoded in the function
- Lambda function should use a role with least privilege permissions 