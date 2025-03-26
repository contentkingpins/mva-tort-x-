// Lambda function for processing collision counselor leads
// Stores leads in S3 and DynamoDB, and forwards to Ringba for call transfer

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const { marshall } = require('@aws-sdk/util-dynamodb');

// Initialize clients
const s3Client = new S3Client({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const ssmClient = new SSMClient({ region: 'us-east-1' });

// Constants
const BUCKET_NAME = 'collision-counselor-leads';
const TABLE_NAME = 'collision-counselor-leads';
const PARAMETER_NAME = '/collision-counselor/trusted-form-api-key';
const RINGBA_ENDPOINT = 'https://display.ringba.com/enrich/2633440120270751643';

// Retrieve API key from Parameter Store
let TRUSTED_FORM_API_KEY = null;

/**
 * Main Lambda handler function
 */
exports.handler = async (event) => {
    console.log('Received event: ', JSON.stringify(event, null, 2));
    
    try {
        // Get the TrustedForm API key from Parameter Store
        try {
            const response = await ssmClient.send(
                new GetParameterCommand({
                    Name: PARAMETER_NAME,
                    WithDecryption: true
                })
            );
            TRUSTED_FORM_API_KEY = response.Parameter.Value;
            console.log('Retrieved TrustedForm API key from Parameter Store');
        } catch (error) {
            console.error('Error retrieving TrustedForm API key:', error);
            // Continue without the API key
        }
        
        // Extract data from the event
        const leadData = typeof event === 'string' ? JSON.parse(event) : event;
        
        // Generate date-based path for S3 storage
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const filePath = `${year}/${month}/${day}/${leadData.lead_id}.json`;
        
        // Store lead data in S3
        console.log(`Storing lead data in S3: ${filePath}`);
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: filePath,
                Body: JSON.stringify(leadData, null, 2),
                ContentType: 'application/json'
            })
        );
        
        // Store lead data in DynamoDB
        console.log('Storing lead data in DynamoDB');
        await dynamoClient.send(
            new PutItemCommand({
                TableName: TABLE_NAME,
                Item: marshall(leadData)
            })
        );
        
        // Claim TrustedForm certificate if URL is present and API key is available
        if (leadData.trustedFormCertURL && TRUSTED_FORM_API_KEY) {
            try {
                await claimTrustedFormCertificate(leadData.trustedFormCertURL, leadData);
                console.log('Successfully claimed TrustedForm certificate');
            } catch (error) {
                console.error('Error claiming TrustedForm certificate:', error);
                // Continue processing even if certificate claiming fails
            }
        }
        
        // Forward lead to Ringba for call transfer
        try {
            const ringbaResponse = await forwardToRingba(leadData);
            console.log('Successfully forwarded lead to Ringba:', ringbaResponse);
        } catch (error) {
            console.error('Error forwarding lead to Ringba:', error);
            // Continue processing even if Ringba forwarding fails
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Lead processed successfully',
                leadId: leadData.lead_id
            })
        };
    } catch (error) {
        console.error('Error processing lead:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing lead',
                error: error.message
            })
        };
    }
};

/**
 * Claims a TrustedForm certificate
 */
async function claimTrustedFormCertificate(certUrl, leadData) {
    try {
        // Only proceed if we have a certificate URL and API key
        if (!certUrl || !TRUSTED_FORM_API_KEY) {
            console.log('Missing TrustedForm certificate URL or API key');
            return null;
        }
        
        console.log(`Claiming TrustedForm certificate: ${certUrl}`);
        
        // Prepare the claim data
        const claimData = {
            reference: leadData.lead_id || `CL-${Date.now()}`,
            email: leadData.email,
            phone_1: leadData.mobile || leadData.phone,
            firstname: leadData.firstName,
            lastname: leadData.lastName,
            source: 'Collision Counselor Form'
        };
        
        // Make the API request to claim the certificate
        const response = await fetch(certUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${TRUSTED_FORM_API_KEY}:`).toString('base64')}`
            },
            body: new URLSearchParams(claimData)
        });
        
        if (!response.ok) {
            throw new Error(`TrustedForm API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error claiming TrustedForm certificate:', error);
        throw error;
    }
}

/**
 * Forwards lead data to Ringba for call transfer
 */
async function forwardToRingba(leadData) {
    try {
        // Prepare Ringba parameters based on the specification
        const params = new URLSearchParams();
        
        // Map the lead data to Ringba parameters - using exact parameter names from spec
        params.append('isTest', process.env.IS_PRODUCTION === 'true' ? '0' : '1');
        params.append('callerid', (leadData.mobile || leadData.phone || '').replace(/\D/g, ''));
        params.append('claimantName', `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim());
        params.append('claimantEmail', leadData.email || '');
        params.append('sourceId', leadData.lead_id || `CL-${Date.now()}`);
        
        // Always include trustedFormCertURL even if null (convert to empty string)
        params.append('trustedFormCertURL', leadData.trustedFormCertURL || '');
        
        // Always include pubID (with fallback to empty string)
        params.append('pubID', leadData.pubID || '');
        
        // Format incident date (MM/DD/YYYY)
        let incidentDateFormatted = '';
        if (leadData.accidentDate) {
            const date = new Date(leadData.accidentDate);
            if (!isNaN(date.getTime())) {
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                incidentDateFormatted = `${month}/${day}/${year}`;
            }
        }
        params.append('incidentDate', incidentDateFormatted);
        
        // Add the state abbreviation
        params.append('incidentState', leadData.zipCode ? getStateFromZip(leadData.zipCode) : (leadData.incidentState || ''));
        
        // Convert boolean values to Yes/No
        params.append('atFault', leadData.atFault === true ? 'Yes' : 'No');
        params.append('attorney', leadData.hasAttorney === 'yes' ? 'Yes' : 'No');
        params.append('settlement', leadData.priorSettlement === true ? 'Yes' : 'No');
        
        // Log the Ringba request for debugging
        console.log('Sending request to Ringba:', RINGBA_ENDPOINT);
        console.log('Ringba parameters:', Object.fromEntries(params));
        
        // Build URL with query parameters
        const url = `${RINGBA_ENDPOINT}?${params.toString()}`;
        
        // Send the request to Ringba using GET instead of POST
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = 'Could not retrieve error details';
            }
            throw new Error(`Ringba API error (${response.status}): ${errorText}`);
        }
        
        // Parse and return the response
        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            result = { rawResponse: responseText };
        }
        
        return result;
    } catch (error) {
        console.error('Error forwarding lead to Ringba:', error);
        throw error;
    }
}

/**
 * Utility to get state from zip code
 */
function getStateFromZip(zip) {
    // This is a simplified version - in production you should use a more complete zip-to-state mapping
    const zipCode = zip.toString().substring(0, 5);
    const zipCodeInt = parseInt(zipCode, 10);
    
    if (zipCodeInt >= 35000 && zipCodeInt <= 36999) return 'AL';
    if (zipCodeInt >= 99500 && zipCodeInt <= 99999) return 'AK';
    if (zipCodeInt >= 85000 && zipCodeInt <= 86999) return 'AZ';
    if (zipCodeInt >= 71600 && zipCodeInt <= 72999) return 'AR';
    if (zipCodeInt >= 90000 && zipCodeInt <= 96699) return 'CA';
    if (zipCodeInt >= 80000 && zipCodeInt <= 81999) return 'CO';
    if (zipCodeInt >= 6000 && zipCodeInt <= 6999) return 'CT';
    if (zipCodeInt >= 19700 && zipCodeInt <= 19999) return 'DE';
    if (zipCodeInt >= 32000 && zipCodeInt <= 34999) return 'FL';
    if (zipCodeInt >= 30000 && zipCodeInt <= 31999) return 'GA';
    if (zipCodeInt >= 96700 && zipCodeInt <= 96899) return 'HI';
    if (zipCodeInt >= 83200 && zipCodeInt <= 83999) return 'ID';
    if (zipCodeInt >= 60000 && zipCodeInt <= 62999) return 'IL';
    if (zipCodeInt >= 46000 && zipCodeInt <= 47999) return 'IN';
    if (zipCodeInt >= 50000 && zipCodeInt <= 52999) return 'IA';
    if (zipCodeInt >= 66000 && zipCodeInt <= 67999) return 'KS';
    if (zipCodeInt >= 40000 && zipCodeInt <= 42999) return 'KY';
    if (zipCodeInt >= 70000 && zipCodeInt <= 71599) return 'LA';
    if (zipCodeInt >= 3900 && zipCodeInt <= 4999) return 'ME';
    if (zipCodeInt >= 20600 && zipCodeInt <= 21999) return 'MD';
    if (zipCodeInt >= 1000 && zipCodeInt <= 2799) return 'MA';
    if (zipCodeInt >= 48000 && zipCodeInt <= 49999) return 'MI';
    if (zipCodeInt >= 55000 && zipCodeInt <= 56999) return 'MN';
    if (zipCodeInt >= 38600 && zipCodeInt <= 39999) return 'MS';
    if (zipCodeInt >= 63000 && zipCodeInt <= 65999) return 'MO';
    if (zipCodeInt >= 59000 && zipCodeInt <= 59999) return 'MT';
    if (zipCodeInt >= 27000 && zipCodeInt <= 28999) return 'NC';
    if (zipCodeInt >= 58000 && zipCodeInt <= 58999) return 'ND';
    if (zipCodeInt >= 68000 && zipCodeInt <= 69999) return 'NE';
    if (zipCodeInt >= 88900 && zipCodeInt <= 89999) return 'NV';
    if (zipCodeInt >= 3000 && zipCodeInt <= 3899) return 'NH';
    if (zipCodeInt >= 7000 && zipCodeInt <= 8999) return 'NJ';
    if (zipCodeInt >= 87000 && zipCodeInt <= 88499) return 'NM';
    if (zipCodeInt >= 10000 && zipCodeInt <= 14999) return 'NY';
    if (zipCodeInt >= 43000 && zipCodeInt <= 45999) return 'OH';
    if (zipCodeInt >= 73000 && zipCodeInt <= 74999) return 'OK';
    if (zipCodeInt >= 97000 && zipCodeInt <= 97999) return 'OR';
    if (zipCodeInt >= 15000 && zipCodeInt <= 19699) return 'PA';
    if (zipCodeInt >= 300 && zipCodeInt <= 999) return 'PR';
    if (zipCodeInt >= 2800 && zipCodeInt <= 2999) return 'RI';
    if (zipCodeInt >= 29000 && zipCodeInt <= 29999) return 'SC';
    if (zipCodeInt >= 57000 && zipCodeInt <= 57999) return 'SD';
    if (zipCodeInt >= 37000 && zipCodeInt <= 38599) return 'TN';
    if (zipCodeInt >= 75000 && zipCodeInt <= 79999) return 'TX';
    if (zipCodeInt >= 84000 && zipCodeInt <= 84999) return 'UT';
    if (zipCodeInt >= 5000 && zipCodeInt <= 5999) return 'VT';
    if (zipCodeInt >= 22000 && zipCodeInt <= 24699) return 'VA';
    if (zipCodeInt >= 20000 && zipCodeInt <= 20599) return 'DC';
    if (zipCodeInt >= 98000 && zipCodeInt <= 99499) return 'WA';
    if (zipCodeInt >= 24700 && zipCodeInt <= 26999) return 'WV';
    if (zipCodeInt >= 53000 && zipCodeInt <= 54999) return 'WI';
    if (zipCodeInt >= 82000 && zipCodeInt <= 83199) return 'WY';
    
    return '';
} 