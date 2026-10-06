/* Embodied Philosophy support chat widget.
   Embed on any page with:
   <script src="https://YOUR-DEPLOYMENT/widget.js" defer></script>
   Optional attributes: data-color="#2E2A4F" data-title="Ether" */
(function () {
  if (window.__epChatLoaded) return;
  window.__epChatLoaded = true;

  var script = document.currentScript;
  var base = script ? new URL(script.src).origin : "";
  var color = (script && script.getAttribute("data-color")) || "#2E2A4F";
  var title = (script && script.getAttribute("data-title")) || "Ether";
  var KEY = "ep-chat-v1";
  var GREETING = "Hi, I'm Ether, Embodied Philosophy's AI assistant. I can help with course access, recordings, memberships, refunds and more. If I can't help, I'll pass you to Ichha on our support team. What can I help you with?";

  var state = { open: false, busy: false, messages: [] };
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (saved && Array.isArray(saved.messages)) state.messages = saved.messages;
  } catch (e) {}
  function save() {
    try { sessionStorage.setItem(KEY, JSON.stringify({ messages: state.messages.slice(-40) })); } catch (e) {}
  }

  var host = document.createElement("div");
  host.id = "ep-chat";
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: "open" });

  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
    '.btn{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;border:0;background:' + color + ';color:#fff;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;z-index:2147483646}' +
    '.btn svg{width:26px;height:26px}' +
    '.panel{position:fixed;right:20px;bottom:88px;width:370px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 120px);background:#fff;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.22);display:none;flex-direction:column;overflow:hidden;z-index:2147483647;color:#1d1b22}' +
    '.panel.open{display:flex}' +
    '.head{background:' + color + ';color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}' +
    '.head b{font-size:15px;font-weight:600}.head small{display:block;font-size:12px;opacity:.8;margin-top:2px}' +
    '.x{background:none;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1;padding:4px}' +
    '.log{flex:1;overflow-y:auto;padding:16px;background:#f7f6f3;display:flex;flex-direction:column;gap:10px}' +
    '.m{max-width:85%;padding:10px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}' +
    '.m.a{background:#fff;border:1px solid #e6e3dc;align-self:flex-start;border-bottom-left-radius:4px}' +
    '.m.u{background:' + color + ';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
    '.m a{color:inherit;text-decoration:underline}' +
    '.typing{font-size:13px;color:#77736b;align-self:flex-start}' +
    '.note{font-size:11px;color:#8a867d;text-align:center;padding:6px 12px 0;background:#fff}' +
    'form{display:flex;gap:8px;padding:10px 12px 12px;border-top:1px solid #ece9e2;background:#fff}' +
    'textarea{flex:1;resize:none;border:1px solid #d9d5cc;border-radius:10px;padding:9px 10px;font-size:14px;height:42px;max-height:120px;outline:none;color:#1d1b22}' +
    'textarea:focus{border-color:' + color + '}' +
    '.send{border:0;background:' + color + ';color:#fff;border-radius:10px;padding:0 14px;font-size:14px;cursor:pointer}' +
    '.send:disabled{opacity:.5;cursor:default}' +
    '@media (max-width:480px){.panel{right:8px;left:8px;width:auto;bottom:80px;height:calc(100vh - 100px)}}' +
    '</style>' +
    '<button class="btn" aria-label="Chat with Ether"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>' +
    '<div class="panel" role="dialog" aria-label="Support chat">' +
    '<div class="head"><div><b></b><small>Embodied Philosophy’s AI assistant</small></div><button class="x" aria-label="Close chat">×</button></div>' +
    '<div class="log" aria-live="polite"></div>' +
    '<div class="note">AI assistant. Please don\'t share card or password details.</div>' +
    '<form><textarea placeholder="Type your question…" aria-label="Message"></textarea><button class="send" type="submit">Send</button></form>' +
    '</div>';

  var btn = root.querySelector(".btn");
  var panel = root.querySelector(".panel");
  var log = root.querySelector(".log");
  var form = root.querySelector("form");
  var input = root.querySelector("textarea");
  var send = root.querySelector(".send");
  root.querySelector(".head b").textContent = title;

  function linkify(el, text) {
    var parts = text.split(/(https?:\/\/[^\s)]+[^\s).,;:!?])/g);
    parts.forEach(function (p, i) {
      if (i % 2 === 1) {
        var a = document.createElement("a");
        a.href = p; a.textContent = p; a.target = "_blank"; a.rel = "noopener";
        el.appendChild(a);
      } else if (p) el.appendChild(document.createTextNode(p));
    });
  }
  function bubble(role, text) {
    var d = document.createElement("div");
    d.className = "m " + (role === "user" ? "u" : "a");
    linkify(d, text);
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  function render() {
    log.innerHTML = "";
    bubble("assistant", GREETING);
    state.messages.forEach(function (m) { bubble(m.role, m.content); });
  }
  function toggle(open) {
    state.open = open;
    panel.classList.toggle("open", open);
    if (open) { render(); setTimeout(function () { input.focus(); }, 50); }
  }
  btn.addEventListener("click", function () { toggle(!state.open); });
  root.querySelector(".x").addEventListener("click", function () { toggle(false); });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || state.busy) return;
    input.value = "";
    state.messages.push({ role: "user", content: text });
    bubble("user", text);
    save();
    state.busy = true; send.disabled = true;
    var t = document.createElement("div");
    t.className = "typing"; t.textContent = "Typing…";
    log.appendChild(t); log.scrollTop = log.scrollHeight;

    fetch(base + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: state.messages }),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); })
      .then(function (res) {
        var reply = res.ok && res.j.reply
          ? res.j.reply
          : res.status === 429
            ? "You've sent a lot of messages in a short time. Please wait a few minutes, or email hello@embodiedphilosophy.com."
            : "Sorry, I'm having trouble right now. Please email hello@embodiedphilosophy.com and we'll help.";
        state.messages.push({ role: "assistant", content: reply });
        save();
        t.remove();
        bubble("assistant", reply);
      })
      .catch(function () {
        t.remove();
        bubble("assistant", "Sorry, I couldn't connect. Please email hello@embodiedphilosophy.com and we'll help.");
      })
      .finally(function () { state.busy = false; send.disabled = false; input.focus(); });
  });
})();
