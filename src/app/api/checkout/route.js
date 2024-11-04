import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key

export async function POST(req) {
  try {
    const { priceId, numOfTokens, amountSpent, userUid } = await req.json();

    const { nextUrl } = req; // Get the current URL from the request context

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      // Construct the success URL dynamically
      success_url: `${nextUrl.origin}/success/${numOfTokens}`, // Your success URL
      cancel_url: `${nextUrl.origin}`, // Your cancel URL
      metadata: {
        user_uid: userUid,
        num_of_tokens: numOfTokens,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
