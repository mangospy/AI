(() => {
  const conversationEl = document.getElementById("conversation");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const messageTemplate = document.getElementById("message-template");

  let sessionId = null;
  let sessionCompleted = false;

  const roleLabels = {
    greeting_assistant: "AI Agent",
    Candidate: "You",
    unhelpful_assistant: "AI Assistant",
    system: "System",
  };

  function appendMessage({ role, content, type }) {
    const clone = messageTemplate.content.cloneNode(true);
    const roleEl = clone.querySelector(".message__role");
    const contentEl = clone.querySelector(".message__content");
    const article = clone.querySelector(".message");

    const label = roleLabels[role] || role;
    roleEl.textContent = label;
    contentEl.textContent = content;

    if (type === "secret") {
      article.classList.add("message--secret");
    } else if (role === "system" || type === "status") {
      article.classList.add("message--system");
    }

    conversationEl.appendChild(clone);
    conversationEl.scrollTo({ top: conversationEl.scrollHeight, behavior: "smooth" });
  }

  function appendStatus(status, details) {
    const content = details ? `${status}: ${details}` : status;
    appendMessage({ role: "system", content, type: "status" });
  }

  function setFormDisabled(disabled) {
    input.disabled = disabled;
    sendButton.disabled = disabled;
  }

  async function processEvents(events) {
    for (const event of events) {
      if (event.type === "message" || event.type === "secret") {
        appendMessage(event);
      } else if (event.type === "status") {
        appendStatus(event.status, event.details);
      } else if (event.type === "input_required") {
        setFormDisabled(false);
      } else if (event.type === "event" && event.content) {
        appendMessage({ role: event.role, content: event.content, type: "message" });
      }
    }
  }

  async function pollEvents() {
    if (!sessionId || sessionCompleted) {
      return;
    }

    try {
      const response = await fetch(`/api/session/${sessionId}/events?timeout=20`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events (${response.status})`);
      }

      const payload = await response.json();
      await processEvents(payload.events || []);

      if (payload.completed) {
        sessionCompleted = true;
        setFormDisabled(true);
      }

      if (!sessionCompleted) {
        void pollEvents();
      }
    } catch (error) {
      console.error("Event polling failed", error);
      appendStatus("Connection issue", "Retrying...");
      setTimeout(() => void pollEvents(), 3000);
    }
  }

  async function startSession() {
    try {
      const response = await fetch("/api/session", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Failed to start session (${response.status})`);
      }

      const payload = await response.json();
      sessionId = payload.session_id;
      sessionCompleted = payload.completed;

      await processEvents(payload.events || []);

      if (sessionCompleted) {
        setFormDisabled(true);
      } else {
        setFormDisabled(false);
        void pollEvents();
      }
    } catch (error) {
      console.error("Unable to start session", error);
      appendStatus("Startup error", "Refresh the page to try again.");
      setFormDisabled(true);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!sessionId || sessionCompleted) {
      return;
    }

    const text = input.value.trim();
    if (!text) {
      return;
    }

    setFormDisabled(true);

    try {
      const response = await fetch(`/api/session/${sessionId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message (${response.status})`);
      }

      input.value = "";
      // Re-enable the form in case the backend is waiting for more input.
      setFormDisabled(false);
    } catch (error) {
      console.error("Failed to send message", error);
      appendStatus("Send failed", "Check your connection and try again.");
      setFormDisabled(false);
    }
  });

  setFormDisabled(true);
  void startSession();
})();

