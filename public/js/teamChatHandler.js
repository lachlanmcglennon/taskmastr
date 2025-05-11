
const userCache = new Map();

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.userId;
}

async function getUserName(userId) {
  if (userCache.has(userId)) return userCache.get(userId);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/users/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    userCache.set(userId, data.name);
    return data.name;
  } catch {
    return `Unknown (${userId})`;
  }
}


//E2EE ENCRYPTION

async function decryptWithPrivateKey(encryptedBase64) {
  const privateKeyPem = localStorage.getItem("privateKey");
  if (!privateKeyPem) throw new Error("Missing private key");

  const binaryDer = Uint8Array.from(atob(privateKeyPem), c => c.charCodeAt(0));
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );

  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encryptedBytes);
  return new TextDecoder().decode(decrypted);
}



//END E2EE
export async function fetchMessages(teamId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/teams/${teamId}/messages`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return await res.json();
}

export function listenForMessages(socket, callback) {
  socket.on("newMessage", (message) => {
    callback(message);
  });
}

// Now includes socket param for broadcasting (optional enhancement)
export async function sendMessage(socket, teamId, encryptedContent) {
  const token = localStorage.getItem("token");
  
  // Send to REST API
  const res = await fetch(`/api/teams/${teamId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ encryptedContent })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to send message");
  }

  const savedMessage = await res.json();

  // ✅ Broadcast to team room after saving
  if (socket) {
    socket.emit("sendMessage", { teamId, message: savedMessage });
  }

  return savedMessage;
}


export async function displayMessages(messages, container) {
  container.innerHTML = "";
  for (const msg of messages) {
    await appendMessage(msg, container);
  }
}

export async function appendMessage(msg, container) {
  const name = await getUserName(msg.senderId);
  const time = new Date(msg.timestamp).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const userId = getUserId();
  let decryptedText = "[🔒 Cannot read]";

  try {
    const encryptedForMe = msg.encryptedContent[userId];
    if (encryptedForMe) {
      decryptedText = await decryptWithPrivateKey(encryptedForMe);
    }
  } catch (err) {
    console.warn("Decryption failed:", err.message);
  }

  const el = document.createElement("div");
  el.className = "chat-message";
  el.innerHTML = `
    <div class="chat-header"><strong>${name}</strong> <span class="chat-time">${time}</span></div>
    <div class="chat-body">${decryptedText}</div>
  `;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}