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

      // 🟢 Auto-set teamId from user's first team (if any)
      if (data.user.teams && data.user.teams.length > 0) {
        localStorage.setItem("teamId", data.user.teams[0]);
        console.log("🟢 Auto-set teamId:", data.user.teams[0]);
      } else {
        localStorage.removeItem("teamId"); // Clean up just in case
        console.log("ℹ️ User is not in any teams");
      }

      // Check for stored private key
      let privateKey = localStorage.getItem("privateKey");
      if (!privateKey) {
        const keyPair = await window.crypto.subtle.generateKey(
          { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
          true,
          ["encrypt", "decrypt"]
        );

        const privKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        privateKey = btoa(String.fromCharCode(...new Uint8Array(privKey)));
        localStorage.setItem("privateKey", privateKey);

        const pubKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const publicKey = btoa(String.fromCharCode(...new Uint8Array(pubKey)));

        // Send public key to backend
        await fetch("/api/auth/setPublicKey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`
          },
          body: JSON.stringify({ publicKey })
        });
      }

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
      // Check for existing private key
      let privateKey = localStorage.getItem("privateKey");
      let publicKey;

      if (!privateKey) {
        const keyPair = await window.crypto.subtle.generateKey(
          { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
          true,
          ["encrypt", "decrypt"]
        );

        // Export and store private key locally
        const privKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        privateKey = btoa(String.fromCharCode(...new Uint8Array(privKey)));
        localStorage.setItem("privateKey", privateKey);

        // Export public key to send to backend
        const pubKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        publicKey = btoa(String.fromCharCode(...new Uint8Array(pubKey)));
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, publicKey }),
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