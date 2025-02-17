// -- server setup --

const app = require("express")();
const server = app.listen(3232);
const path = require("path");

const io = require("socket.io")(server, {pingTimeout: 300000});

// -- constants --

let ct = 0;

// SHIP TYPES

const BS = ++ct, SENTINEL = ++ct, GUARD = ++ct, INT = ++ct, COL = ++ct;

const DARTP = ++ct, ROCKETP = ++ct, DELTAP = ++ct;

// DRONE TYPES

const DECOY = ++ct, REPAIR = ++ct, ROCKET = ++ct, TURRET = ++ct;

// WEAPON TYPES

const LASER = ++ct, BATTERY = ++ct, MASS = ++ct, LASER2 = ++ct, DART = ++ct;

/* UNOBTAIN */ const ROCKETD = ++ct, TURRETD = ++ct;

// SHIELD TYPES

const ALPHA = ++ct, IMPULSE = ++ct, PASSIVE = ++ct, OMEGA = ++ct, MIRROR = ++ct, ALLY = ++ct;

// MODULE TYPES

const EMP = ++ct, SOL = ++ct, FORT = ++ct, TP = ++ct, AMP = ++ct, DESTINY = ++ct, BARRIER = ++ct, DELTA = ++ct, RIPPLE = ++ct, DISRUPT = ++ct;

/* UNOBTAIN */ const VENG = ++ct;

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

const Module = require("./game.js");

const Ship = Module.Ship, Game = Module.Game;

const COLS = Module.COLS, ROWS = Module.ROWS, TPS = Module.TPS;

let games = [], queue = [];

function tick(game){
	if(game) game.update();
	else{
		for(let g of games){
			tick(g);

			if(g.lifetime == 0){
				g.end();

				let p = [];
				for(let x of g.players) p.push(x.id);
				console.log("ending game:", p);
			}
		}

		games = games.filter(x => x.lifetime > 0);
	}
}

setInterval(tick, 1000/TPS, null);

// -- client interconnect --

function spawnBS(n){
	function shuffle(a){
		for(let i=a.length-1; i>0; --i){
			const j = Math.floor(Math.random()*(i+1));
			const t = a[i];
			a[i] = a[j];
			a[j] = t;
		}

		return a;
	}

	let S = new Set();

	while(S.size < n)
		S.add(Math.floor(Math.random()*COLS*ROWS));

	return shuffle(Array.from(S).map(x => [x%COLS, Math.floor(x/COLS)]));
}

function startGame(){
	let m = [];
	for(let q of queue) m.push(q.s.id);
	console.log("starting new game:", m);
	const g = new Game(queue.map(x => x.s));
	const p = spawnBS(queue.length);
	for(let i=0; i<queue.length; ++i)
		g.addShip(BS, queue[i].s.id, queue[i].modules,
			[300*(p[i][0]-COLS/2+0.5), 300*(p[i][1]-ROWS/2+0.5)]);
	g.start();
	games.push(g);
	queue = [];
}

let roundStart = null;

function checkStartGame(){
	if(roundStart != null){
		if(roundStart < Date.now()){
			roundStart = null;
			startGame();
		}
	}
}

setInterval(checkStartGame, 500, null);

io.on("connect", (socket) => {
	socket.on("error", e => {
		throw (e.description || e);
	});

	console.log("connect " + socket.id);

	socket.emit("reset");

	socket.on("disconnect", e => {
		console.log("disconnect " + socket.id);

		if(queue.filter(x => x.s.id == socket.id).length){
			console.log("dequeued player", socket.id);
			queue = queue.filter(x => x.s.id != socket.id);
			let m = [];
			for(let q of queue) m.push(q.s.id);
			console.log(" =>", m);
			if(queue.length >= 2){
				roundStart = Date.now()+3000;
				console.log("pushing back");
			}else roundStart = null;
		}

		for(let g of games){
			for(let s of g.ships){
				if(s.type == BS && s.team == socket.id){
					console.log(" => killing ships");
					s.hp = 0;
				}
			}
		}
	});

	socket.on("quit", () => {
		console.log("quit " + socket.id);

		for(let g of games){
			for(let s of g.ships){
				if(s.type == BS && s.team == socket.id){
					console.log(" => killing ships");
					s.hp = 0;
				}
			}
		}
	});

	socket.on("enqueue", modules => {
		console.log("enqueued player", socket.id, "with", modules);
		queue.push({s: socket, modules: modules});
		let m = [];
		for(let q of queue) m.push(q.s.id);
		console.log(" =>", m);
		if(queue.length >= 2){
			roundStart = Date.now()+3000;
			console.log("pushing back");
		}
	});

	socket.on("dequeue", () => {
		console.log("dequeued player", socket.id);
		queue = queue.filter(x => x.s.id != socket.id);
		let m = [];
		for(let q of queue) m.push(q.s.id);
		console.log(" =>", m);
		if(queue.length >= 2){
			roundStart = Date.now()+3000;
			console.log("pushing back");
		}else roundStart = null;
	});

	socket.on("solo", modules => {
		console.log("solo match started by", socket.id, "with", modules);
		const g = new Game([socket]);
		const p = spawnBS(1);
		g.addShip(BS, socket.id, modules,
			[300*(p[0][0]-COLS/2+0.5), 300*(p[0][1]-ROWS/2+0.5)]);
		g.start();
		games.push(g);
	});

	socket.on("move", data => {
		for(let g of games){
			if(g.uid == data.gameID){
				for(let s of g.ships){
					if(s.uid == data.shipID){
						if(s.wait) s.cancelMove();
						if(s.move.length) s.moveTo(data.pos, data.dock);
						else s.waitMoveTo(data.pos, data.dock);
					}
				}
			}
		}
	});

	socket.on("confirmMove", data => {
		for(let g of games){
			if(g.uid == data.gameID){
				for(let s of g.ships){
					if(s.uid == data.shipID){
						s.confirmMove();
					}
				}
			}
		}
	});

	socket.on("cancelMove", data => {
		for(let g of games){
			if(g.uid == data.gameID){
				for(let s of g.ships){
					if(s.uid == data.shipID){
						s.cancelMove();
					}
				}
			}
		}
	});

	socket.on("spawn", data => {
		for(let g of games){
			if(g.uid == data.gameID){
				g.addShip(...data.arg);
			}
		}
	});

	socket.on("activateModule", data => {
		for(let g of games){
			if(g.uid == data.gameID){
				for(let i=0; i<g.ships.length; ++i){
					if(g.ships[i].uid == data.shipID){
						if(data.i != null && data.i < g.ships[i].modules.length &&
							g.ships[i].modules[data.i].state == 1){
							g.activateModule(i, data);
						}
					}
				}
			}
		}
	});

	socket.on("echo", e => console.log("echo", ...e));
});
