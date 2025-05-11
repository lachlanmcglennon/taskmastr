const User = require('../models/User');
const Team = require('../models/Team');
exports.getUserName = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user name' });
  }
};

exports.getTeamMemberKeys = async (req, res) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const members = await User.find({ userId: { $in: team.members } });

    const result = members.map(user => ({
      userId: user.userId,
      publicKey: user.publicKey
    }));

    res.json({ members: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
};