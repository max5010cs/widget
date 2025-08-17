(function () {
  if (window.MyChatWidgetLoaded) return;
  window.MyChatWidgetLoaded = true;

  // Inject styles
  const style = document.createElement("style");
  style.innerHTML = `
    .chat-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00f0ff, #00ff85, #ff005c, #ffe600, #00f0ff);
      background-size: 400% 400%;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      cursor: pointer;
      box-shadow: 0 8px 24px 0 rgba(0,255,255,0.25), 0 0 32px 8px #00f0ff88, 0 0 48px 12px #ffe60055;
      z-index: 9999;
      transition: transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s;
      animation: chat-bubble-rotate 2.5s linear infinite, chat-bubble-float 3s ease-in-out infinite alternate, bubble-gradient-move 5s ease-in-out infinite;
      overflow: hidden;
    }
    .chat-bubble:hover {
      transform: scale(1.12) rotate(-8deg);
      box-shadow: 0 16px 32px rgba(255,0,92,0.35), 0 0 64px 16px #ffe600cc, 0 0 32px 8px #00ff85cc;
      animation-play-state: paused;
    }
    @keyframes chat-bubble-rotate {
      0% { transform: rotate(0deg) scale(1);}
      100% { transform: rotate(360deg) scale(1);}
    }
    @keyframes chat-bubble-float {
      0% { bottom: 20px; }
      100% { bottom: 30px; }
    }
    @keyframes bubble-gradient-move {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .bubble-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: none;
      user-select: none;
      position: relative;
      z-index: 2;
    }
    .bubble-texno {
      font-family: 'Inter', 'Montserrat', Arial, sans-serif;
      font-size: 3.2rem;
      font-weight: 900;
      letter-spacing: 2px;
      color: #111;
      background: none;
      -webkit-background-clip: unset;
      -webkit-text-fill-color: unset;
      animation: none;
      text-shadow: 0 2px 8px #fff8, 0 0 8px #ffe60088, 0 0 16px #ff005c22;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .bubble-circle {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px dashed;
      border-image: linear-gradient(135deg, #00f0ff, #00ff85, #ff005c, #ffe600, #00f0ff) 1;
      top: 0; left: 0;
      pointer-events: none;
      animation: bubble-circle-spin 6s linear infinite, bubble-circle-gradient-move 5s ease-in-out infinite;
      z-index: 1;
    }
    @keyframes bubble-circle-spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(-360deg);}
    }
    @keyframes bubble-circle-gradient-move {
      0% { border-image-source: linear-gradient(135deg, #00f0ff, #00ff85, #ff005c, #ffe600, #00f0ff);}
      25% { border-image-source: linear-gradient(135deg, #ffe600, #ff005c, #00ff85, #00f0ff, #ffe600);}
      50% { border-image-source: linear-gradient(135deg, #ff005c, #00ff85, #00f0ff, #ffe600, #ff005c);}
      75% { border-image-source: linear-gradient(135deg, #00ff85, #00f0ff, #ffe600, #ff005c, #00ff85);}
      100% { border-image-source: linear-gradient(135deg, #00f0ff, #00ff85, #ff005c, #ffe600, #00f0ff);}
    }

    .chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 360px;
      height: 480px;
      background: #f7fafc;
      border-radius: 38px 12px 38px 12px / 28px 38px 12px 38px;
      box-shadow: 0 8px 32px 0 rgba(0,0,0,0.10), 0 1.5px 8px #e0e7ef;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: "Inter", "Montserrat", Arial, sans-serif;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      border: 1.5px solid #e0e7ef;
      backdrop-filter: blur(6px);
      /* Add a subtle border highlight for a modern effect */
      border-top: 2.5px solid #b2f0ec;
      border-bottom: 2.5px solid #ffe60055;
    }
    .chat-window.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .chat-header {
      background: linear-gradient(90deg, #e0f7fa 0%, #e6ffe6 100%);
      color: #222;
      padding: 18px 20px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 17px;
      letter-spacing: 1px;
      border-bottom: 1px solid #e0e7ef;
      box-shadow: 0 2px 8px #e0e7ef11;
    }
    .chat-close {
      cursor: pointer;
      font-weight: bold;
      font-size: 20px;
      color: #222;
      transition: transform 0.2s, color 0.2s;
      padding: 2px 8px;
      border-radius: 50%;
    }
    .chat-close:hover {
      transform: rotate(90deg) scale(1.2);
      color: #ff005c;
      background: #f3f4f6;
    }

    .chat-messages {
      flex: 1;
      padding: 18px 16px 10px 16px;
      overflow-y: auto;
      font-size: 15px;
      background: transparent;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }
    .chat-messages::-webkit-scrollbar {
      width: 7px;
      background: #f1f5f9;
    }
    .chat-messages::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 6px;
    }
    .chat-message {
      margin: 0;
      padding: 10px 16px;
      border-radius: 16px;
      max-width: 80%;
      line-height: 1.5;
      animation: fadeIn 0.3s ease forwards;
      box-shadow: 0 1px 4px #e0e7ef33;
      font-size: 15px;
    }
    .chat-message.user {
      background: linear-gradient(90deg, #f1f5f9 60%, #e0f7fa 100%);
      align-self: flex-end;
      color: #222;
      border-bottom-right-radius: 4px;
    }
    .chat-message.bot {
      background: linear-gradient(90deg, #f8fafc 60%, #fffbe6 100%);
      align-self: flex-start;
      color: #222;
      border-bottom-left-radius: 4px;
    }
    .chat-message.hardcoded {
      background: none;
      color: #00b894;
      font-weight: 700;
      font-size: 16px;
      align-self: center;
      margin-bottom: 8px;
      box-shadow: none;
      padding: 0;
      border-radius: 0;
      animation: none;
      letter-spacing: 0.5px;
    }

    .chat-input-area {
      display: flex;
      border-top: 1px solid #e0e7ef;
      background: #f8fafc;
      padding: 12px 10px;
      gap: 10px;
    }
    .chat-input {
      flex: 1;
      border: none;
      padding: 12px 16px;
      font-size: 15px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 1px 4px #e0e7ef22;
      outline: none;
      transition: box-shadow 0.2s;
      color: #222;
    }
    .chat-input:focus {
      box-shadow: 0 2px 8px #b2f0ec33;
      border: 1.5px solid #b2f0ec;
    }
    .chat-send {
      background: linear-gradient(90deg, #b2f0ec 0%, #e6ffe6 100%);
      color: #222;
      border: none;
      padding: 0 22px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 1px 4px #e0e7ef22;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      outline: none;
    }
    .chat-send:hover {
      background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%);
      color: #222;
      box-shadow: 0 2px 8px #fcb69f33;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Create chat bubble
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.innerHTML = `
    <div class="bubble-inner">
      <span class="bubble-texno">T</span>
      <span class="bubble-circle"></span>
    </div>
  `;
  document.body.appendChild(bubble);

  // Create chat window
  const chat = document.createElement("div");
  chat.className = "chat-window";
  chat.innerHTML = `
    <div class="chat-header">
      SupportBot
      <span class="chat-close">✖</span>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input-area">
      <input class="chat-input" type="text" placeholder="Type your message..." />
      <button class="chat-send">Send</button>
    </div>
  `;
  document.body.appendChild(chat);

  const closeBtn = chat.querySelector(".chat-close");
  const sendBtn = chat.querySelector(".chat-send");
  const input = chat.querySelector(".chat-input");
  const messages = chat.querySelector(".chat-messages");

  // Add hardcoded message at the top
  const hardcodedMsg = document.createElement("div");
  hardcodedMsg.className = "chat-message hardcoded";
  hardcodedMsg.textContent = "How can I help you?";
  messages.appendChild(hardcodedMsg);

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // Open/close
  bubble.addEventListener("click", () => {
    chat.classList.add("active");
    bubble.style.display = "none";
  });
  closeBtn.addEventListener("click", () => {
    chat.classList.remove("active");
    setTimeout(() => (bubble.style.display = "flex"), 300);
  });

  // Send message to backend
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      addMessage(data.reply || "⚠️ No response", "bot");
    } catch (err) {
      console.error("Chat API error:", err);
      addMessage("⚠️ Error contacting server", "bot");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
