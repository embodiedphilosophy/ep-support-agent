import Script from "next/script";
export default function Page() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px", lineHeight: 1.6 }}>
      <h1 style={{ fontWeight: 400 }}>EP Support Agent: test page</h1>
      <p>This private page is for testing the support chat before it goes on embodiedphilosophy.com. Click the chat bubble in the bottom-right corner.</p>
      <p>Try the common questions: a missing login email, a missed live session, a refund, a discount, cancelling a membership. Then ask for a person to test the handoff to Ichha.</p>
      <p style={{ fontSize: 14, color: "#6b665d" }}>Test mode: handoffs don't create real Zendesk tickets yet.</p>
      <Script src="/widget.js" strategy="afterInteractive" />
    </main>
  );
}
