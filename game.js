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

let SPEED = new Array(ct), HP = new Array(ct);

SPEED[BS] = 20;
SPEED[SENTINEL] = 10;
SPEED[GUARD] = 11;
SPEED[INT] = 26;
SPEED[COL] = 12;
SPEED[DECOY] = 20;
SPEED[REPAIR] = 20;
SPEED[ROCKET] = 15;
SPEED[DARTP] = 25;
SPEED[ROCKETP] = 70;
SPEED[DELTAP] = 110;

HP[BS] = 7000;
HP[SENTINEL] = 600;
HP[GUARD] = 5600;
HP[INT] = 4500;
HP[COL] = 15000;
HP[DECOY] = 1000;
HP[REPAIR] = 1000;
HP[ROCKET] = 600;
HP[TURRET] = 600;
HP[DARTP] = 250;
HP[ROCKETP] = 250;
HP[DELTAP] = 180;

let UID = 0;

class Ship{
	constructor(type, hp, team, modules, pos, move = []){
		this.type = type;
		this.hp = hp;
		this.team = team;
		this.modules = [];
		for(let m of modules)
			this.modules.push({type: m, state: 1});
		this.pos = pos;
		this.move = move;
		this.uid = ++UID;
		this.lock = false;
		this.vel = 0;
	}

	moveTo(pos){
		this.move.push(pos);
	}

	encode(){
		return {
			type: this.type,
			hp: this.hp,
			team: this.team,
			modules: this.modules,
			pos: this.pos,
			move: this.move,
			uid: this.uid,
			lock: this.lock
		};
	}

	travel(){
		const now = Date.now();

		if(this.move.length){
			if(!this.lock){
				let move = this.move[0],
					dir = [move[0]-this.pos[0], move[1]-this.pos[1]],
					dist = this.vel/4,
					mag = Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1]);
				if(dist > mag){
					this.pos = [...move];
					this.move = this.move.slice(1);
				}else{
					dist /= mag;
					this.pos[0] += dir[0]*dist;
					this.pos[1] += dir[1]*dist;
				}

				this.vel = Math.min(this.vel+8, SPEED[this.type]);
			}

		}else{
			this.vel = 0;
		}
	}
}

class Game{
	constructor(players){
		this.players = players;
		this.ships = [];
		this.rocks = [];
		this.uid = ++UID;
	}

	addShip(type, team, modules, pos, move = []){
		this.ships.push(new Ship(type, HP[type], team, modules, pos, move));
	}

	start(){
		const w = 5, h = 3, d = 5;

		let count = new Array(w*h).fill(0);

		for(let i=0; i<d*w*h; ++i){
			let a = [Math.floor(Math.random()*w*h), Math.floor(Math.random()*w*h)];
			let b = count[a[0]] > count[a[1]] ? a[1] : a[0];
			++count[b];
			this.rocks.push([
				Math.round(Math.random()*300) + 300*(b%w) - 300*w/2,
				Math.round(Math.random()*300) + 300*Math.floor(b/w) - 300*h/2
			]);
		}

		let m = [];
		for(let p of this.players) m.push(p.id);
		console.log("starting game", m);

		let q = [];
		for(let s of this.ships) q.push(s.encode());

		for(let p of this.players){
			p.emit("start", {ships: q, rocks: this.rocks, uid: this.uid});
		}
	}

	update(){
		for(let s of this.ships) s.travel();

		for(let s of this.ships){
			if(!s.move.length){
				if(s.type == DARTP){
					s.hp = 0;
					// explode();
				}

				if(s.type == ROCKETP){
					s.hp = 0;
					// explode();
				}

				if(s.type == DELTAP){
					s.hp = 0;
					// explode();
				}
			}
		}

		let q = [];
		for(let s of this.ships) if(s.hp) q.push(s.encode());

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
