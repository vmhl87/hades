// -- server setup --

const app = require("express")();
const server = app.listen(3232);
const path = require("path");

const io = require("socket.io")(server, {pingTimeout: 300000});

// -- constants --

let ct = 0;

const BS = ++ct, SENTINEL = ++ct, GUARD = ++ct, INT = ++ct, COL = ++ct;

const LASER = ++ct, BATTERY = ++ct, MASS = ++ct, LASER2 = ++ct, DART = ++ct;

const ALPHA = ++ct, IMPULSE = ++ct, PASSIVE = ++ct, OMEGA = ++ct, MIRROR = ++ct, ALLY = ++ct;

const EMP = ++ct, SOL = ++ct, FORT = ++ct, TP = ++ct, AMP = ++ct, DESTINY = ++ct, BARRIER = ++ct, DELTA = ++ct, VENG = ++ct;

const DECOY = ++ct, REPAIR = ++ct, ROCKET = ++ct, TURRET = ++ct;

const DARTP = ++ct, ROCKETP = ++ct, DELTAP = ++ct;

// -- file xfer --

app.get("/", (x, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/constants.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "constants.js"));
});

app.get("/app.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "app.js"));
});

app.get("/util.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "util.js"));
});

app.get("/assets.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "assets.js"));
});

app.get("/style.css", (req, res) => {
	res.set("Content-Type", "text/css");
	res.sendFile(path.join(__dirname, "style.css"));
});

app.get('/Ubuntu-Regular.ttf', (x, res) => {
  res.sendFile(__dirname + '/Ubuntu-Regular.ttf')
});

// -- game management --

const Game = require("./game.js");

let games = [], queue = [];

function tick(game){
	if(game){
		game.kill();
		++game.time;

	}else{
		for(let g of games){
			tick(g);
			if(g.alive(BS) == 0){
				let p = [];
				for(let x of g.players)
					p.push(x.id);
				console.log("ending game:", p);
			}
		}

		games = games.filter(x => x.alive(BS) > 0);
	}
}

setInterval(tick, 250, null);

// -- client interconnect --

io.on("connect", (socket) => {
	socket.on("error", e => {
		throw (e.description || e);
	});

	console.log("connect " + socket.id);

	socket.on("disconnect", e => {
		console.log("disconnect " + socket.id);
	});

	socket.on("enqueue", modules => {
		console.log("enqueued player", socket.id, "with", modules);
		queue.push({s: socket, modules: modules});
		console.log(" =>", queue);
		if(queue.length == 2){
			console.log("starting new game:", queue);
			const g = new Game([queue[0].s, queue[1].s]);
			g.addShip(BS, 7000, queue[0].s.id, queue[0].modules, [-100, 0]);
			g.addShip(BS, 7000, queue[1].s.id, queue[1].modules, [100, 0]);
			g.start();
			games.push(g);
			queue = [];
		}
	});

	socket.on("dequeue", () => {
		console.log("dequeued player", socket.id);
		queue = queue.filter(x => x.id != socket.id);
		console.log(" =>", queue);
	});

	socket.on("solo", modules => {
		console.log("solo match started by", socket.id, "with", modules);
		const g = new Game([socket]);
		g.addShip(BS, 7000, socket.id, modules, [0, 0]);
		g.start();
		games.push(g);
	});
});
