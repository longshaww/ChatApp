const listUser = [];
const moment = require("moment");

function userJoin(id, username, room) {
	const newUser = { id, username, room };
	listUser.push(newUser);
	return newUser;
}

function getCurrentUser(id) {
	return listUser.find((user) => user.id === id);
}

function Message(msg, username, color = "text-light") {
	const newMessage = {
		msg,
		username,
		color,
		time: moment().format("HH:mm"),
	};
	return newMessage;
}

function userLeave(id) {
	const index = listUser.findIndex((user) => user.id === id);
	if (index !== -1) {
		return listUser.splice(index, 1)[0];
	}
}

function getRoomUsers(room) {
	return listUser.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, Message, userLeave, getRoomUsers };
