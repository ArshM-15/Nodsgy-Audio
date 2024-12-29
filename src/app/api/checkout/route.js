import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { numOfCredits, userUid } = await req.json();

    // Replace host with nodsgy.com for production, regardless of the environment
    const domain = "nodsgy.com";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"; // Use http for local dev, https for production
    let priceId;
    if (numOfCredits == 50) {
      priceId = process.env.FIRST_CREDIT_PRICE_ID;
    } else if (numOfCredits == 100) {
      priceId = process.env.SECOND_CREDIT_PRICE_ID;
    } else if (numOfCredits == 250) {
      priceId = process.env.THIRD_CREDIT_PRICE_ID;
    } 
    // else if (numOfCredits == 100) {
    //   priceId = process.env.FOURTH_CREDIT_PRICE_ID;
    // }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${protocol}://${domain}/success/${numOfCredits}`, // Use nodsgy.com for success URL
      cancel_url: `${protocol}://${domain}`, // Use nodsgy.com for cancel URL
      metadata: {
        user_uid: userUid,
        num_of_credits: numOfCredits,
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
