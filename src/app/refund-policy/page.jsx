import React from "react";

export default function RefundPolicy() {
  return (
    <div class="bg-gray-100 text-gray-800 mb-[10rem]">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Refund Policy</h1>
        <p class="mb-4">
          Effective Date: <strong>January 5, 2025</strong>
        </p>
      </div>

      <main class="container mx-auto px-4 py-8">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">1. No Refunds</h2>
          <p class="mb-4">
            At Nodsgy, we strive to provide the best possible service to our
            users. Please note that all purchases of credits and other services
            on our platform are final. As a result,{" "}
            <strong>we do not offer refunds</strong> for any credits,
            subscriptions, or services once the transaction is completed.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">2. Responsibility</h2>
          <p class="mb-4">
            It is the user's responsibility to ensure they understand the
            functionality and requirements of the Nodsgy platform before making
            a purchase. By completing a purchase, you acknowledge that you have
            read and agreed to this policy.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">3. Contact Us</h2>
          <p class="mb-4">
            If you experience any issues or have concerns about your purchase,
            please contact our support team at <b>creatorofnodsgy@gmail.com</b>.
            While refunds are not provided, we are committed to ensuring a
            positive experience for all users and will do our best to address
            your concerns.
          </p>
        </section>
      </main>

      <footer class="bg-gray-800 text-white py-4">
        <div class="container mx-auto px-4">
          <p class="text-center">&copy; 2025 Nodsgy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
