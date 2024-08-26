type IFetchClient = {
  (savedCartId: string): Promise<{
    clientSecret: string;
    totalPrice: number;
    stripeId: string;
  }>;
};

export async function fetchClientSecret(savedCartId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/create-payment-intent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id: savedCartId }), // Example amount in cents
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch client secret");
  }

  return response.json();
}

export async function updateClientSecret(
  savedCartId: string,
  stripeId: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/update-payment-intent`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id: savedCartId, stripe_id: stripeId }), // Example amount in cents
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch client secret");
  }

  return response.json();
}
