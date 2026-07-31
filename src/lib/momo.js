export async function createPayment(amount, phoneNumber, reference) {
  // In a real scenario, you would obtain an access token and call the MTN MoMo API.
  // For the sake of this mock, we will return a simulated transaction ID.
  console.log(`[MTN MoMo] Creating payment for ${phoneNumber}: ${amount} RWF, Ref: ${reference}`);

  const mtnEnv = process.env.MTN_ENV || 'sandbox';
  if (mtnEnv === 'sandbox' && !process.env.MTN_API_KEY) {
    // Return a mocked successful response
    return {
      success: true,
      transactionId: `momo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'PENDING'
    };
  }

  // Example actual implementation block (commented out or partially implemented):
  /*
  const token = await getMomoToken();
  const response = await fetch('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
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
  */

  return {
    success: true,
    transactionId: `momo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'PENDING'
  };
}

export async function checkPaymentStatus(reference) {
  console.log(`[MTN MoMo] Checking status for ref: ${reference}`);
  
  // Simulated status check
  return {
    success: true,
    status: 'SUCCESSFUL' // or PENDING, FAILED
  };
}
