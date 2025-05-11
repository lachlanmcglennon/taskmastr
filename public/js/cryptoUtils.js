export async function encryptMessageForTeam(teamId, plaintext) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/users/team/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const { members } = await res.json(); // expects [{ userId, publicKey }]
  const encryptedContent = {};

  for (const member of members) {
    const binaryDer = Uint8Array.from(atob(member.publicKey), c => c.charCodeAt(0));
    const publicKey = await crypto.subtle.importKey(
      "spki",
      binaryDer.buffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    const encoded = new TextEncoder().encode(plaintext);
    const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, encoded);
    encryptedContent[member.userId] = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }

  return encryptedContent;
}