export const stripe = null;

export const getStripe = () => {
  console.log('[SANDBOX] getStripe called - Stripe disabled');
  return null;
};

export async function handleCheckoutSessionCompleted(session: any) {
  console.log('[SANDBOX] handleCheckoutSessionCompleted:', session?.id);
  return { success: true };
}

export async function handleSubscriptionUpdated(subscription: any) {
  console.log('[SANDBOX] handleSubscriptionUpdated:', subscription?.id);
  return { success: true };
}

export async function handleSubscriptionDeleted(subscription: any) {
  console.log('[SANDBOX] handleSubscriptionDeleted:', subscription?.id);
  return { success: true };
}

export async function createCheckoutSession(data: any) {
  console.log('[SANDBOX] createCheckoutSession');
  return { url: '/thank-you?sandbox=true' };
}

export async function createCustomerPortalSession(customerId: string) {
  console.log('[SANDBOX] createCustomerPortalSession:', customerId);
  return { url: '/dashboard?sandbox=true' };
}
