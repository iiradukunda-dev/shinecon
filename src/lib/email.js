/**
 * Mock Email Service for SM Connect
 * Since we don't have an SMTP server yet, this will log the email contents to the console.
 */
export async function sendVerificationEmail(email, token) {
  const verificationUrl = `http://localhost:3000/api/auth/verify?token=${token}`;

  console.log('\n========================================================');
  console.log('📧 MOCK EMAIL SENT');
  console.log(`To: ${email}`);
  console.log('Subject: Verify your Shining Ministries Account');
  console.log('Body:');
  console.log(
    `Welcome to SM Connect! Please verify your official Gmail account by clicking the link below:`,
  );
  console.log(`\n👉 ${verificationUrl} \n`);
  console.log('========================================================\n');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return true;
}
