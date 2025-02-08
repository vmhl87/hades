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

const COLS = Module.COLS, ROWS = Module.ROWS;

let games = [], queue = [];

function tick(game){
	if(game) game.update();
	else{
		for(let g of games){
			tick(g);

			if(!g.alive()){
				g.end();

				let p = [];
				for(let x of g.players) p.push(x.id);
				console.log("ending game:", p);
			}
		}

		games = games.filter(x => x.alive(BS) > 0);
	}
}

setInterval(tick, 250, null);

// -- client interconnect --

function spawnBS(){
	let res = [Math.floor(Math.random()*COLS*ROWS), -1];

	do{
		res[1] = Math.floor(Math.random()*COLS*ROWS);
	}while(res[1] == res[0]);

	return [[res[0]%COLS, Math.floor(res[0]/COLS)], [res[1]%COLS, Math.floor(res[1]/COLS)]];
}

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

	socket.on("enqueue", modules => {
		console.log("enqueued player", socket.id, "with", modules);
		queue.push({s: socket, modules: modules});
		let m = [];
		for(let q of queue) m.push(q.s.id);
		console.log(" =>", m);
		if(queue.length == 2){
			console.log("starting new game:", m);
			const g = new Game([queue[0].s, queue[1].s]);
			const p = spawnBS();
			g.addShip(BS, queue[0].s.id, queue[0].modules,
				[300*(p[0][0]-COLS/2+0.5), 300*(p[0][1]-ROWS/2+0.5)]);
			g.addShip(BS, queue[1].s.id, queue[1].modules,
				[300*(p[1][0]-COLS/2+0.5), 300*(p[1][1]-ROWS/2+0.5)]);
			g.start();
			games.push(g);
			queue = [];
		}
	});

	socket.on("dequeue", () => {
		console.log("dequeued player", socket.id);
		queue = queue.filter(x => x.s.id != socket.id);
		let m = [];
		for(let q of queue) m.push(q.s.id);
		console.log(" =>", m);
	});

	socket.on("solo", modules => {
		console.log("solo match started by", socket.id, "with", modules);
		const g = new Game([socket]);
		const p = spawnBS();
		g.addShip(BS, socket.id, modules,
			[300*(p[0][0]-COLS/2+0.5), 300*(p[0][1]-ROWS/2+0.5)]);
		g.addShip(BS, -1, [BATTERY, OMEGA, VENG],
			[300*(p[1][0]-COLS/2+0.5), 300*(p[1][1]-ROWS/2+0.5)]);
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
});
