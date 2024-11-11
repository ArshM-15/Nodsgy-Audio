import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, numOfTokens, amountSpent, userUid } = await req.json();
    
    const host = req.headers.get("host");
    const protocol = host.includes("localhost") ? "http" : "https"; // Use http for local dev, https for production

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${protocol}://${host}/success/${numOfTokens}`, // Constructed success URL
      cancel_url: `${protocol}://${host}`, // Constructed cancel URL
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
