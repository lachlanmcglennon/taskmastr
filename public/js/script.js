import { handleLogin, handleRegister } from "./authHandlers.js";

console.log("✅ script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  console.log("🔐 Token found:", token);

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const status = document.getElementById("status");

  if (token) {
    if (loginForm) loginForm.style.display = "none";
    if (status) status.innerText = "✅ You are logged in!";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (status) status.innerText = "🔒 Not logged in.";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  if (loginForm) handleLogin(loginForm);
  if (registerForm) handleRegister(registerForm);

  const toggleBtn = document.getElementById("toggleAuthBtn");
  const authTitle = document.getElementById("authTitle");

  let showingLogin = true;
  if (toggleBtn && loginForm && registerForm) {
    toggleBtn.addEventListener("click", () => {
      showingLogin = !showingLogin;
      loginForm.style.display = showingLogin ? "block" : "none";
      registerForm.style.display = showingLogin ? "none" : "block";
      toggleBtn.innerText = showingLogin
        ? "Need an account? Register"
        : "Already have an account? Login";
      authTitle.innerText = showingLogin ? "Login" : "Register";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      console.log("🚪 Logging out");
      localStorage.removeItem("token");
      window.location.href = "/";
    });
  }
});
