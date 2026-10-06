# Ether: EP Support Agent

Ether is Embodied Philosophy's website chat assistant, powered by Claude.

- `public/widget.js`: the chat bubble. Add it to any page with `<script src="https://ep-support-agent.vercel.app/widget.js" defer></script>`.
- `app/api/chat/route.js`: the chat service. It calls Claude with the knowledge base and hands conversations to Ichha.
- `lib/kb.js`: the knowledge base, copied from the "EP Support KB" Google Sheet.
- `lib/prompt.js`: Ether's instructions.
- `lib/zendesk.js`: creates a Zendesk ticket for Ichha when Ether hands off.

Claude is reached through Vercel AI Gateway by default, billed to the Vercel team. No API key is needed.

Optional environment variables:
- `HANDOFF_DRY_RUN`: leave unset while testing (no real tickets). Set to `0` to create real Zendesk tickets.
- `GATEWAY_MODEL`: defaults to `anthropic/claude-sonnet-5.5`.
- `LLM_PROVIDER=anthropic` with `ANTHROPIC_API_KEY`: call Anthropic directly instead of the gateway.
- `ALLOWED_ORIGINS`, `ZENDESK_SUBDOMAIN`.
