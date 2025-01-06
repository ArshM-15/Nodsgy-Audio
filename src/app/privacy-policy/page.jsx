import React from "react";

export default function PrivacyPolicy() {
  return (
    <div class="max-w-4xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p class="mb-4">
        Effective Date: <strong>January 5, 2025</strong>
      </p>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <p class="mb-4">
          At Nodsgy, we collect the following information to provide and improve
          our services:
        </p>

        <h3 class="text-lg font-semibold">User Information:</h3>
        <ul class="list-disc list-inside mb-4">
          <li>
            <strong>amountOfTimesPayed:</strong> Number of times a user has made
            payments.
          </li>
          <li>
            <strong>amountSpent:</strong> Total amount spent by the user.
          </li>
          <li>
            <strong>createdAt:</strong> Account creation timestamp.
          </li>
          <li>
            <strong>credits:</strong> Current credit balance.
          </li>
          <li>
            <strong>email:</strong> User's email address.
          </li>
          <li>
            <strong>photoURL:</strong> User's profile picture URL.
          </li>
          <li>
            <strong>tokens:</strong> Token balance (if applicable).
          </li>
          <li>
            <strong>username:</strong> User's name.
          </li>
        </ul>

        <h3 class="text-lg font-semibold">Audio File Information:</h3>
        <ul class="list-disc list-inside mb-4">
          <li>
            <strong>createdAt:</strong> Timestamp of when the audio file was
            created.
          </li>
          <li>
            <strong>keyPoints:</strong> Extracted key points from the audio
            content.
          </li>
          <li>
            <strong>name:</strong> Name of the audio file.
          </li>
          <li>
            <strong>url:</strong> URL of the stored audio file.
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">2. Payment Information</h2>
        <p class="mb-4">
          We use <strong>Stripe</strong> to process payments. We do not store
          your payment information. Stripe securely processes all transactions,
          and their privacy policy applies to payment data. For more details,
          visit{" "}
          <a href="https://stripe.com/privacy" class="text-blue-500 underline">
            Stripe's Privacy Policy
          </a>
          .
        </p>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">
          3. How We Use Your Information
        </h2>
        <ul class="list-disc list-inside mb-4">
          <li>To provide and improve our services.</li>
          <li>To manage your credits and payments.</li>
          <li>
            To store and provide access to your generated audio explanations.
          </li>
          <li>
            To communicate with you about your account, credits, and updates.
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">
          4. Data Storage and Security
        </h2>
        <p class="mb-4">We take appropriate measures to protect your data:</p>
        <ul class="list-disc list-inside mb-4">
          <li>
            <strong>Local Storage:</strong> Credits are stored locally on your
            device.
          </li>
          <li>
            <strong>Server Storage:</strong> Account information and audio
            explanations are securely stored on our servers using encryption and
            access controls.
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">5. Your Rights</h2>
        <ul class="list-disc list-inside mb-4">
          <li>Access and update your account information at any time.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Manage local storage data directly on your device.</li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">6. Sharing of Information</h2>
        <p class="mb-4">
          We do not sell or share your information, except in the following
          cases:
        </p>
        <ul class="list-disc list-inside mb-4">
          <li>With your consent.</li>
          <li>To comply with legal requirements.</li>
          <li>During a business transfer, such as a merger or acquisition.</li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">
          7. Changes to This Privacy Policy
        </h2>
        <p class="mb-4">
          We may update this Privacy Policy from time to time. Changes will be
          posted here, and the "Effective Date" will be updated accordingly.
          Please review this page periodically.
        </p>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">8. Contact Us</h2>
        <p class="mb-4">
          If you have any questions about this Privacy Policy, you can contact
          us at:
        </p>
        <ul class="list-inside">
          <li>
            <strong>Email:</strong> creatorofnodsgy@gmail.com
          </li>
          <li>
          </li>
        </ul>
      </section>
    </div>
  );
}
