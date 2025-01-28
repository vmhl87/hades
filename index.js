const app = require("express")();
const server = app.listen(3232);
const path = require("path");

const io = require("socket.io")(server, {pingTimeout: 300000});

app.get("/", (x, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/app.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "app.js"));
});

app.get("/assets.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "assets.js"));
});

app.get("/style.css", (req, res) => {
	res.set("Content-Type", "text/css");
	res.sendFile(path.join(__dirname, "style.css"));
});

io.on("connect", (socket) => {
	socket.on("error", e => {
		throw (e.description || e);
	});

	console.log("connect " + socket.id);

	socket.on("disconnect", e => {
		console.log("disconnect " + socket.id);
	});
});
