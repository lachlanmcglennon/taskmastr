
const storage = require('../utils/storageWrapper');
const Message = require('../models/Message');
const { generateCustomTeamId, generateCustomUserId } = require('../utils/idGenerator');



exports.getTasks = async (req, res) => {
  try {
    const teamId = req.params.id;
    const tasks = await storage.getTasks(teamId);
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const teamId = req.params.id;
    const taskData = { ...req.body, teamId };
    const newTask = await storage.saveTask(taskData);
    res.status(201).json(newTask);
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const teamId = req.params.id;
    const messages = await Message.find({ teamId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.sendMessageREST = async (req, res) => {
  try {
    const teamId = req.params.id;
    const senderId = req.user.userId;
    const { encryptedContent } = req.body;

    if (
      !encryptedContent ||
      typeof encryptedContent !== 'object' ||
      Object.keys(encryptedContent).length === 0
    ) {
      return res.status(400).json({ error: 'Missing or invalid encrypted content' });
    }

    console.log(`📨 Message from ${senderId} to team ${teamId} at ${new Date().toISOString()}`);
    const message = await Message.create({
      teamId,
      senderId,
      encryptedContent, // This is now a Map-like object
      timestamp: new Date()
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, members, encryptedKeys } = req.body;
    const Team = require('../models/Team');
    const newTeam = await Team.create({ name, members, encryptedKeys, teamId: generateCustomTeamId() });
    res.status(201).json({ teamId: newTeam.teamId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.userId;
    const Team = require('../models/Team');
    const team = await Team.findOne({ teamId });

    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }else{
      return res.status(501).json({ error: 'Allready in team' });
    }

    const User = require('../models/User');
    const user = await User.findOne({ userId: userId });
    if (!user.teams.includes(teamId)) {
      user.teams.push(teamId);
      await user.save();
    }else{
      return res.status(502).json({ error: 'Allready have team saved' });
    }

    res.status(200).json({ message: 'Joined team successfully', team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to join team' });
  }
};

