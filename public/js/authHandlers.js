export function handleLogin(loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("logEmail")?.value;
      const password = document.getElementById("logPassword")?.value;
      console.log("📤 Submitting login:", { email, password });
  
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Login failed");
        }
  
        const data = await res.json();
        localStorage.setItem("token", data.token);
        console.log("✅ Login success:", data);
        window.location.reload();
      } catch (err) {
        alert("❌ " + err.message);
        console.error("Login error:", err);
      }
    });
  }
  
  export function handleRegister(registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("regName")?.value;
      const email = document.getElementById("regEmail")?.value;
      const password = document.getElementById("regPassword")?.value;
      console.log("📤 Submitting registration:", { name, email, password });
  
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
  
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Registration failed");
        }
  
        const data = await res.json();
        localStorage.setItem("token", data.token);
        console.log("✅ Registration success:", data);
        window.location.reload();
      } catch (err) {
        console.error("❌ Registration error:", err.message);
        document.getElementById("registerStatus").innerText = "❌ " + err.message;
      }
    });
  }
  