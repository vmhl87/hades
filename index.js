// -- server setup --

const app = require("express")();
const server = app.listen(3232);
const path = require("path");

const io = require("socket.io")(server, {pingTimeout: 300000});

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

app.get("/guide.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "guide.js"));
});

app.get("/p5.min.js", (req, res) => {
	res.set("Content-Type", "application/javascript");
	res.sendFile(path.join(__dirname, "p5.min.js"));
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

let games = [], queue = [], TIME = 0;

function tick(game){
	if(game) game.update();
	else{
		for(let g of games) if(TIME%g.speed == 0){
			tick(g);

			if(g.lifetime == 0){
				g.end();

				let p = [];
				for(let x of g.players) p.push(x.id);
				console.log("ending game:", p);
			}
		}

		games = games.filter(x => x.lifetime > 0);

		++TIME;
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

function startGame(Q){
	const g = new Game(Q.map(x => x.s));
	const p = spawnBS(Q.length);

	let A = new Map();

	for(let i=0; i<Q.length; ++i){
		const R = Q[i].u;
		//const N = A.has(R) ? R + " (" + A.get(R).toString() + ")" : R;
		//A.set(R, A.has(R) ? A.has(R)+1 : 1);

		let N = R[0];

		if(A.has(R[0])){
			let B = A.get(R[0]), C = 0;

			if(B.has(R[1])) C = B.get(R[1]);
			else{
				C = B.size;
				B.set(R[1], C);
			}

			if(C) N += " (" + C.toString() + ")";

		}else{
			A.set(R[0], new Map());
			A.get(R[0]).set(R[1], 0);
		}

		g.addShip(1, [Q[i].s.id, N], Q[i].modules,
			[300*(p[i][0]-COLS/2+0.5), 300*(p[i][1]-ROWS/2+0.5)]);
	}

	g.start();
	games.push(g);
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
			for(let q of queue) m.push(q.u[0]);
			console.log(" =>", m);
			io.emit("queueSize", queue.length);
		}

		for(let g of games){
			for(let s of g.ships){
				if(s.type == 1 && s.team[0] == socket.id){
					console.log(" => killing ships");
					s.hp = 0;
				}
			}

			g.players = g.players.filter(x => x.id != socket.id);
		}
	});

	socket.on("quit", () => {
		console.log("quit " + socket.id);

		let ct = 0;

		for(let g of games){
			for(let s of g.ships){
				if(s.type == 1 && s.team[0] == socket.id){
					console.log(" => killing ships");
					s.hp = 0;
					++ct;
				}
			}
		}

		if(!ct){
			socket.emit("end");
			for(let g of games)
				g.players = g.players.filter(x => x.id != socket.id);
		}
	});

	socket.on("enqueue", (modules, user) => {
		console.log("enqueued player", socket.id, "with", modules);
		queue.push({s: socket, modules: modules, u: user});
		let m = [];
		for(let q of queue) m.push(q.u[0]);
		console.log(" =>", m);
		io.emit("queueSize", queue.length);
	});

	socket.on("dequeue", () => {
		console.log("dequeued player", socket.id);
		queue = queue.filter(x => x.s.id != socket.id);
		let m = [];
		for(let q of queue) m.push(q.u[0]);
		console.log(" =>", m);
		io.emit("queueSize", queue.length);
	});

	socket.on("begin", () => {
		if(queue.length){
			startGame(queue);
			queue = [];
			io.emit("queueSize", queue.length);
		}
	});

	socket.on("solo", (modules, user) => {
		console.log("solo match started by", socket.id, "with", modules);
		startGame([{s: socket, modules: modules, u: user}]);
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

	socket.on("ascend", data => {
		for(let g of games){
			if(g.uid == data.gameID){
				for(let s of g.ships){
					if(s.uid == data.shipID){
						if(s.ally == null) s.ally = [null];
						else s.ally = null;
					}
				}
			}
		}
	});

	socket.on("echo", e => console.log("echo", ...e));
});
