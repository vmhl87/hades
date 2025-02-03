let ct = 0;

const BS = ++ct, SENTINEL = ++ct, GUARD = ++ct, INT = ++ct, COL = ++ct;

const LASER = ++ct, BATTERY = ++ct, MASS = ++ct, LASER2 = ++ct, DART = ++ct;

const ALPHA = ++ct, IMPULSE = ++ct, PASSIVE = ++ct, OMEGA = ++ct, MIRROR = ++ct, ALLY = ++ct;

const EMP = ++ct, SOL = ++ct, FORT = ++ct, TP = ++ct, AMP = ++ct, DESTINY = ++ct, BARRIER = ++ct, DELTA = ++ct, VENG = ++ct;

const DECOY = ++ct, REPAIR = ++ct, ROCKET = ++ct, TURRET = ++ct;

const DARTP = ++ct, ROCKETP = ++ct, DELTAP = ++ct;

const CERB = ++ct;

let SPEED = new Array(ct);

SPEED[BS] = 20;
SPEED[SENTINEL] = 10;
SPEED[GUARD] = 11;
SPEED[INT] = 26;
SPEED[COL] = 12;

let UID = 0;

class Ship{
	constructor(type, hp, team, modules, pos, move){
		this.type = type;
		this.hp = hp;
		this.team = team;
		this.modules = [];
		for(let m of modules)
			this.modules.push({type: m, state: 1});
		this.pos = pos;
		this.move = [];
		for(let m of move) this.moveTo(m);
		this.uid = ++UID;
	}

	moveTo(pos){
		let now = Date.now(), p = [...this.pos];
		if(this.move.length){
			now = this.move[this.move.length-1][2];
			p = this.move[this.move.length-1].slice(0, 2);
		}
		const dist = Math.sqrt((pos[0]-p[0])*(pos[0]-p[0]) + (pos[1]-p[1])*(pos[1]-p[1]));
		now += 1000*dist/SPEED[this.type];
		this.move.push([...pos, now]);
	}

	encode(){
		return {
			type: this.type,
			hp: this.hp,
			team: this.team,
			modules: this.modules,
			pos: this.pos,
			move: this.move,
			uid: this.uid
		};
	}

	update(){
		const now = Date.now();

		while(this.move.length && this.move[0][2] < now)
			this.move = this.move.slice(1);

		if(this.move.length){
			let move = this.move[0],
				dir = [this.pos[0]-move[0], this.pos[1]-move[1]],
				dist = SPEED[this.type] * (move[2]-now)/1000,
				mag = Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1]);
			dist /= mag;
			dir[0] *= dist; dir[1] *= dist;
			this.pos[0] = move[0] + dir[0];
			this.pos[1] = move[1] + dir[1];
		}
	}
}

class Game{
	constructor(players){
		this.players = players;
		this.ships = [];
		this.rocks = [];
	}

	addShip(type, hp, team, modules, pos, move){
		this.ships.push(new Ship(type, hp, team, modules, pos, move));
	}

	start(){
		for(let i=0; i<500; ++i){
			this.rocks.push([
				Math.round((Math.random()*2-1) * 800),
				Math.round((Math.random()*2-1) * 800)
			]);
		}

		let m = [];
		for(let p of this.players) m.push(p.id);
		console.log("starting game", m);

		let q = [];
		for(let s of this.ships) q.push(s.encode());

		for(let p of this.players){
			p.emit("start", {ships: q, rocks: this.rocks});
		}
	}

	update(){
		for(let s of this.ships) s.update();

		let q = [];
		for(let s of this.ships) q.push(s.encode());

		for(let p of this.players) p.emit("state", q);
	}

	end(){
		for(let p of this.players) p.emit("end");
	}

	alive(type){
		return this.ships.filter(x => x.type == type).length;
	}

	kill(){
		this.ships = this.ships.filter(x => x.hp > 0);
	}
}

module.exports = { Ship, Game };
