function generateCustomId(prefix = "id", length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix + '_';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
function generateCustomTeamId(length = 8) {
  return generateCustomId('team', length);
}
function generateCustomUserId(length = 10) {
  return generateCustomId('user', length);
}
module.exports = { generateCustomTeamId, generateCustomUserId };