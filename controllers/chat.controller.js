const getChat = (req, res) => {
	const { username, room } = req.query;
	if (!username | !room) {
		return res.redirect("/");
	}
	res.render("chat");
};

module.exports = { getChat };
