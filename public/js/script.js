import { handleLogin, handleRegister } from "./authHandlers.js";
import { createTeam, joinTeam } from "./teamHandler.js";
import { encryptMessageForTeam } from './cryptoUtils.js';
console.log("✅ script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const teamId = localStorage.getItem("teamId");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const status = document.getElementById("status");
  const authForms = document.getElementById("authForms");
  const teamForms = document.getElementById("teamForms");
  const createTeamForm = document.getElementById("createTeamForm");
  const joinTeamForm = document.getElementById("joinTeamForm");
  const chatContainer = document.getElementById("chatContainer");
  const teamStatus = document.getElementById("teamStatus");

  if (token) {
    authForms?.style?.setProperty("display", "none");
    teamForms?.style?.setProperty("display", "block");
    loginForm?.style?.setProperty("display", "none");
    status.innerText = "✅ You are logged in!";
    logoutBtn?.style?.setProperty("display", "inline-block");

    if (teamId) {
      initializeChat(teamId, token);
    } else {
      chatContainer.style.display = "none";
      teamStatus.style.display = "none";
      
    }

    createTeamForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("teamName")?.value;
    const token = localStorage.getItem("token");

    // 🧠 Decode userId from token payload
    const userId = JSON.parse(atob(token.split(".")[1]))?.userId;

    // 👥 Add current user as initial team member
    const encryptedKeys = {
      [userId]: "encryptedValue"
    };

    try {
      const { teamId } = await createTeam(name, [userId], encryptedKeys);
      localStorage.setItem("teamId", teamId);
      alert("✅ Team created: " + teamId);
      initializeChat(teamId, token);
    } catch (err) {
      alert("❌ Failed to create team: " + err.message);
    }
}); 
    joinTeamForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("joinTeamId")?.value;
      try {
        await joinTeam(id);
        localStorage.setItem("teamId", id);
        alert("✅ Joined team: " + id);
        initializeChat(id, token);
      } catch (err) {
        alert("❌ Failed to join team: " + err.message);
      }
    });
  } else {
    status.innerText = "🔒 Not logged in.";
    logoutBtn?.style?.setProperty("display", "none");
    chatContainer.style.display = "none";
    teamStatus.style.display = "none";
  }

  if (loginForm) handleLogin(loginForm);
  if (registerForm) handleRegister(registerForm);

  const toggleBtn = document.getElementById("toggleAuthBtn");
  const authTitle = document.getElementById("authTitle");
  let showingLogin = true;

  toggleBtn?.addEventListener("click", () => {
    showingLogin = !showingLogin;
    loginForm.style.display = showingLogin ? "block" : "none";
    registerForm.style.display = showingLogin ? "none" : "block";
    toggleBtn.innerText = showingLogin ? "Need an account? Register" : "Already have an account? Login";
    authTitle.innerText = showingLogin ? "Login" : "Register";
  });

  logoutBtn?.addEventListener("click", () => {
    console.log("🚪 Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("teamId");
    authForms?.style?.setProperty("display", "block");
    teamForms?.style?.setProperty("display", "none");
    status.innerText = "🔒 Not logged in.";
    window.location.href = "/";
  });
});

async function initializeChat(teamId, token) {
  teamForms?.style?.setProperty("display", "none");
  const { fetchMessages, listenForMessages, sendMessage, displayMessages, appendMessage } = await import("./teamChatHandler.js");

  const chatContainer = document.getElementById("chatContainer");
  const teamStatus = document.getElementById("teamStatus");
  const chatBox = document.getElementById("chatMessages");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  if (!token || !teamId) return;

  const socket = io("/", { auth: { token } });
  socket.emit("joinTeam", teamId);

  // show chat section
  chatContainer.style.display = "block";
  teamStatus.style.display = "block";
  teamStatus.innerText = `💬 You are in team: ${teamId}`;

  listenForMessages(socket, (msg) => appendMessage(msg, chatBox));

  const messages = await fetchMessages(teamId);
  displayMessages(messages, chatBox);

  chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";
    encryptMessageForTeam(teamId, text).then(encryptedContent => {
      sendMessage(socket, teamId, encryptedContent);
    });
  });
}