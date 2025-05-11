
export async function createTeam(name, members, encryptedKeys) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, members, encryptedKeys })
    });
    if (!res.ok) throw new Error("Failed to create team");
    return await res.json();
  }
  
  export async function joinTeam(teamId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/teams/${teamId}/join`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to join team");
    return await res.json();
  }
  