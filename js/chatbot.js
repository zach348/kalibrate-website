// Kalibrate Science Chatbot Widget
(function () {
  "use strict";

  const API_URL = "https://kalibrate-chatbot-api.vercel.app/api/chat";

  const SUGGESTED_QUESTIONS = [
    "How does Kalibrate reduce anxiety?",
    "What is the Yerkes-Dodson Law?",
    "How does the breathing guidance work?",
    "How is this different from meditation apps?",
    "What is Multiple Object Tracking?",
    "Who is Kalibrate designed for?",
  ];

  let messages = [];
  let isOpen = false;
  let isLoading = false;

  // --- DOM Creation ---

  function createWidget() {
    // FAB button
    const fab = document.createElement("button");
    fab.id = "kb-chat-fab";
    fab.setAttribute("aria-label", "Open science chatbot");
    fab.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    document.body.appendChild(fab);

    // Chat panel
    const panel = document.createElement("div");
    panel.id = "kb-chat-panel";
    panel.innerHTML = `
      <div class="kb-chat-header">
        <div class="kb-chat-header-info">
          <span class="kb-chat-header-icon">🧠</span>
          <div>
            <div class="kb-chat-header-title">Kalibrate Science</div>
            <div class="kb-chat-header-subtitle">Ask about the science behind Kalibrate</div>
          </div>
        </div>
        <button class="kb-chat-close" aria-label="Close chatbot">&times;</button>
      </div>
      <div class="kb-chat-messages" id="kb-chat-messages">
        <div class="kb-chat-welcome">
          <p>Hi! I can answer questions about Kalibrate's scientific foundations — the research behind the design, how the adaptive system works, breathing science, and more.</p>
          <div class="kb-chat-suggestions" id="kb-chat-suggestions"></div>
        </div>
      </div>
      <form class="kb-chat-input-area" id="kb-chat-form">
        <input type="text" class="kb-chat-input" id="kb-chat-input" placeholder="Ask about the science..." maxlength="500" autocomplete="off">
        <button type="submit" class="kb-chat-send" id="kb-chat-send" aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
        </button>
      </form>
    `;
    document.body.appendChild(panel);

    // Populate suggestions
    const suggestionsEl = document.getElementById("kb-chat-suggestions");
    SUGGESTED_QUESTIONS.forEach((q) => {
      const btn = document.createElement("button");
      btn.className = "kb-chat-suggestion";
      btn.textContent = q;
      btn.addEventListener("click", () => sendMessage(q));
      suggestionsEl.appendChild(btn);
    });

    // Event listeners
    fab.addEventListener("click", toggleChat);
    panel.querySelector(".kb-chat-close").addEventListener("click", toggleChat);
    document.getElementById("kb-chat-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("kb-chat-input");
      const text = input.value.trim();
      if (text) {
        sendMessage(text);
        input.value = "";
      }
    });
  }

  function toggleChat() {
    isOpen = !isOpen;
    const panel = document.getElementById("kb-chat-panel");
    const fab = document.getElementById("kb-chat-fab");
    if (isOpen) {
      panel.classList.add("kb-open");
      fab.classList.add("kb-hidden");
      document.getElementById("kb-chat-input").focus();
    } else {
      panel.classList.remove("kb-open");
      fab.classList.remove("kb-hidden");
    }
  }

  // --- Message Handling ---

  function addMessage(role, content) {
    const messagesEl = document.getElementById("kb-chat-messages");
    const bubble = document.createElement("div");
    bubble.className = `kb-chat-bubble kb-chat-${role}`;
    bubble.textContent = content;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addLoadingIndicator() {
    const messagesEl = document.getElementById("kb-chat-messages");
    const loader = document.createElement("div");
    loader.className = "kb-chat-bubble kb-chat-assistant kb-chat-loading";
    loader.id = "kb-chat-loader";
    loader.innerHTML = '<span class="kb-dot"></span><span class="kb-dot"></span><span class="kb-dot"></span>';
    messagesEl.appendChild(loader);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeLoadingIndicator() {
    const loader = document.getElementById("kb-chat-loader");
    if (loader) loader.remove();
  }

  async function sendMessage(text) {
    if (isLoading) return;

    // Hide suggestions after first message
    const suggestions = document.getElementById("kb-chat-suggestions");
    if (suggestions) suggestions.style.display = "none";
    // Also hide the welcome text after first user message
    const welcome = document.querySelector(".kb-chat-welcome p");
    if (welcome && messages.length === 0) welcome.style.display = "none";

    // Add user message
    messages.push({ role: "user", content: text });
    addMessage("user", text);

    isLoading = true;
    document.getElementById("kb-chat-send").disabled = true;
    addLoadingIndicator();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();

      removeLoadingIndicator();

      if (!res.ok) {
        const errMsg = data.error || "Something went wrong. Please try again.";
        addMessage("assistant", errMsg);
      } else {
        const reply = data.response;
        messages.push({ role: "assistant", content: reply });
        addMessage("assistant", reply);
      }
    } catch (err) {
      removeLoadingIndicator();
      addMessage("assistant", "Connection error. Please check your internet and try again.");
    }

    isLoading = false;
    document.getElementById("kb-chat-send").disabled = false;
  }

  // --- Init ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
