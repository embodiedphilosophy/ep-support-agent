# EP Support Agent

A website chat assistant for Embodied Philosophy, powered by Claude.

- `public/widget.js`: the chat bubble. Add it to any page with `<script src="https://<deployment>/widget.js" defer></script>`.
- `app/api/chat/route.js`: the chat service. It calls Claude with the knowledge base and hands conversations to Ichha.
- `lib/kb.js`: the knowledge base, copied from the "EP Support KB" Google Sheet.
- `lib/zendesk.js`: creates a Zendesk ticket for Ichha when the assistant hands off.

Environment variables:
- `ANTHROPIC_API_KEY` (required)
- `HANDOFF_DRY_RUN`: leave unset while testing (no real tickets). Set to `0` to create real Zendesk tickets.
- `ANTHROPIC_MODEL` (optional), `ALLOWED_ORIGINS` (optional), `ZENDESK_SUBDOMAIN` (optional, default `embodiedphilosophy`)
