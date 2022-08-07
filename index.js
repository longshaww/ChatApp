const { instrument } = require("@socket.io/admin-ui");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const moment = require("moment");
const botName = "Chatbot";
const { Server } = require("socket.io");
const { userInfo } = require("os");

const {
	userJoin,
	getCurrentUser,
	Message,
	userLeave,
	getRoomUsers,
} = require("./utils/chat.utils");
const mainRoute = require("./routes/chat.route");
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000", "https://admin.socket.io"],
	},
	credentials: true,
});

app.use(express.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index");
});

app.use("/chat", mainRoute);
io.on("connection", (socket) => {
	socket.on("join", ({ username, room }, replyMsg) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);
		const msg = Message(
			`${user.username} has joined ${user.room}`,
			botName,
			"text-danger"
		);
		socket.to(user.room).emit("receive-msg", msg);
		io.to(user.room).emit("room-users", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
		replyMsg(msg);
	});

	socket.on("msg", (msg, self) => {
		if (!msg) return;
		const user = getCurrentUser(socket.id);
		if (!user)
			return socket.emit(
				"receive-msg",
				new Message("Please reload", botName, "text-danger")
			);
		const newMsg = Message(msg, user.username);
		self(newMsg);
		socket.to(user.room).emit("receive-msg", newMsg);
	});

	socket.on("disconnect", () => {
		const user = userLeave(socket.id);
		if (!user) return;
		const msg = Message(
			`${user.username} has disconnected`,
			botName,
			"text-danger"
		);
		socket.to(user.room).emit("receive-msg", msg);
		io.to(user.room).emit("room-users", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});
});

instrument(io, { auth: false });

server.listen(3000, () => {
	console.log("Chat app listening on http://localhost:3000");
});
