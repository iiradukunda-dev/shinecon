export async function getMomoToken() {
  const mtnEnv = process.env.MTN_ENVIRONMENT || 'sandbox';
  const baseUrl = mtnEnv === 'sandbox' 
    ? 'https://sandbox.momodeveloper.mtn.com/collection' 
    : 'https://proxy.momoapi.mtn.com/collection';
    
  const authHeader = Buffer.from(`${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`).toString('base64');
  
  const response = await fetch(`${baseUrl}/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[MTN MoMo] Token Error:', errorText);
    throw new Error('Failed to get MTN MoMo token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPayment(amount, phoneNumber, reference) {


  const mtnEnv = process.env.MTN_ENVIRONMENT || 'sandbox';
  
  if (!process.env.MTN_API_USER || !process.env.MTN_API_KEY || !process.env.MTN_SUBSCRIPTION_KEY) {
    console.warn('[MTN MoMo] Missing API Credentials. Make sure MTN_API_USER, MTN_API_KEY, and MTN_SUBSCRIPTION_KEY are set.');
    return {
      success: false,
      error: 'Missing MTN MoMo API Credentials in .env'
    };
  }

  try {
    const token = await getMomoToken();
    const baseUrl = mtnEnv === 'sandbox' 
      ? 'https://sandbox.momodeveloper.mtn.com/collection/v1_0' 
      : 'https://proxy.momoapi.mtn.com/collection/v1_0';

    const response = await fetch(`${baseUrl}/requesttopay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Reference-Id': reference,
        'X-Target-Environment': mtnEnv,
        'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'RWF',
        externalId: reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber
        },
        payerMessage: 'Payment to SM Connect',
        payeeNote: 'SM Connect Payment'
      })
    });

    if (response.status === 202) {
      return {
        success: true,
        transactionId: reference,
        status: 'PENDING'
      };
    } else {
      const errorText = await response.text();
      console.error('[MTN MoMo] RequestToPay Error:', response.status, errorText);
      return {
        success: false,
        error: 'Failed to initiate USSD push.'
      };
    }
  } catch (error) {
    console.error('[MTN MoMo] Exception:', error);
    return {
      success: false,
      error: 'Internal error communicating with MTN'
    };
  }
}

export async function checkPaymentStatus(reference) {

  
  // Simulated status check
  return {
    success: true,
    status: 'SUCCESSFUL' // or PENDING, FAILED
  };
}
