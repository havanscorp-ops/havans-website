const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
function adjustChatHeight() {
    const minHeight = 150; // initial small height in pixels
    const maxHeight = 500; // maximum height it can grow to
  
    // Reset to the small height first
    chatMessages.style.height = minHeight + 'px';
  
    // Calculate new height based on content but do not exceed maxHeight
    const newHeight = Math.min(chatMessages.scrollHeight, maxHeight);
  
    // Set the new height to chat messages container
    chatMessages.style.height = newHeight + 'px';
  
    // Make sure the scrollbar is at the bottom so user sees latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
// Add message to chat window
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight; // scroll down
  adjustChatHeight();
}

// Fetch AI response from backend API
async function getAIResponse(message) {
  // Optionally, show a "loading..." message or spinner here
  try {
    const response = await fetch('https://daizy-backend-1.render.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return `Sorry, something went wrong: ${errorData.error || response.statusText}`;
    }
    const data = await response.json();
    return data.reply;
  } catch (error) {
    return "Sorry, I couldn't connect to the server.";
  }
}

// Handle form submit (user types question and presses send)
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, 'user');
  chatInput.value = '';
  sendBtn.disabled = true;

  const botReply = await getAIResponse(userMessage);

  addMessage(botReply, 'bot');
  sendBtn.disabled = false;
  chatInput.focus();
});

// Handle FAQ button click - send question programmatically
async function sendFAQ(question) {
  addMessage(question, 'user');
  sendBtn.disabled = true;
  chatInput.value = '';
  

  const botReply = await getAIResponse(question);

  addMessage(botReply, 'bot');
  sendBtn.disabled = false;
  chatInput.focus();
}
