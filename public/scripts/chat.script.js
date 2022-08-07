window.onload = () => {
	const { username, room } = Qs.parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const socket = io();
	const form = $("#form");
	const messageInput = $("#messageInput");
	const textContainer = $("#textContainer");
	const userContainer = $("#userContainer");
	const roomId = $("#roomId");
	const leaveBtn = $("#leaveBtn");
	const Toast = Swal.mixin({
		toast: true,
		position: "bottom-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	Toast.fire({
		icon: "success",
		title: "Connected successfully !",
	});

	socket.emit("join", { username, room }, (msg) => displayMessage(msg));
	socket.on("receive-msg", (msg) => displayMessage(msg));
	socket.on("room-users", ({ room, users }) => {
		roomId.html(room);
		displayUsers(users);
	});

	form.submit((e) => {
		e.preventDefault();
		socket.emit("msg", messageInput.val(), (self) =>
			displayMessage(self, { mine: true })
		);
		messageInput.val("");
	});

	leaveBtn.click(() => {
		socket.disconnect();
		Toast.fire({
			icon: "warning",
			title: "Leaving ...",
		});
		setTimeout(() => {
			window.location.href = "/";
		}, 1000);
	});

	function displayUsers(listUser) {
		return userContainer.html(
			listUser.map((user) => {
				return `<div>${user.username}</div>`;
			})
		);
	}
	function displayMessage(
		message,
		options = {
			mine: false,
		}
	) {
		const { msg, username, time, color } = message;
		const { mine } = options;
		if (!msg) return;
		textContainer.append(
			`<div class="shadow rounded-pill mb-3 p-3" style="background-color: ${
				mine ? "#9d87c7" : "#2c2e30"
			}">
				<div class="${color ? color : ""} d-flex">
					<div>
						<div>${username}</div>
						<div>${msg}</div>					
					</div>
					<div class="ms-auto">${time}</div>
				</div>
			</div>`
		);
	}
};
