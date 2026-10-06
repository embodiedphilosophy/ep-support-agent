// Creates a Zendesk request (ticket) on behalf of the visitor.
// Uses Zendesk's anonymous Requests API, which EP's Zendesk already accepts from its web form,
// so no Zendesk credentials are stored in this app. Ichha replies in Zendesk; the visitor gets her reply by email.

const SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN || "embodiedphilosophy";

export async function createHandoffTicket({ name, email, topic, summary, details, transcript }) {
  const body = [
    "Handed off by the website chat assistant.",
    "",
    `Topic: ${topic}`,
    `Summary: ${summary}`,
    details ? `Details: ${details}` : null,
    "",
    "Chat transcript:",
    transcript,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const res = await fetch(`https://${SUBDOMAIN}.zendesk.com/api/v2/requests.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: {
        requester: { name, email },
        subject: `[Chat] ${topic}: ${summary.slice(0, 80)}`,
        comment: { body },
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Zendesk ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  return json.request?.id;
}
