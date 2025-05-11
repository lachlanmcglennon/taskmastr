const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");
const User = require("./models/User"); // add this import

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email }); // adjust if your token uses a different field
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.user.name} connected.`);

    socket.on("joinTeam", (teamId) => {
      socket.join(`team_${teamId}`);
    });

    socket.on("sendMessage", async ({ teamId, message }) => {
      // No DB insert here
      io.to(`team_${teamId}`).emit("newMessage", message);
    });
  });
}

module.exports = setupSocket;
