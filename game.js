const COLS = 5, ROWS = 3;

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

let SPEED = new Array(ct), HP = new Array(ct),
	EFFECT_TIME = new Array(ct), RECHARGE_TIME = new Array(ct),
	ACTIVATED = new Array(ct), RANGE = new Array(ct);

EFFECT_TIME[EMP] = 6;
RECHARGE_TIME[EMP] = 60;

EFFECT_TIME[FORT] = 12;
RECHARGE_TIME[FORT] = 60;

EFFECT_TIME[TP] = 5;
RECHARGE_TIME[TP] = 55;

EFFECT_TIME[AMP] = 30;
RECHARGE_TIME[AMP] = 60;

EFFECT_TIME[DESTINY] = 3;
RECHARGE_TIME[DESTINY] = 60;

EFFECT_TIME[BARRIER] = 11;
RECHARGE_TIME[BARRIER] = 60;

EFFECT_TIME[DELTA] = 0;
RECHARGE_TIME[DELTA] = 60;

EFFECT_TIME[RIPPLE] = 5;
RECHARGE_TIME[RIPPLE] = 60;

EFFECT_TIME[DISRUPT] = 0;
RECHARGE_TIME[DISRUPT] = 60;

EFFECT_TIME[DECOY] = 0;
RECHARGE_TIME[DECOY] = 60;

EFFECT_TIME[REPAIR] = 0;
RECHARGE_TIME[REPAIR] = 60;

EFFECT_TIME[ROCKET] = 0;
RECHARGE_TIME[ROCKET] = 60;

EFFECT_TIME[TURRET] = 0;
RECHARGE_TIME[TURRET] = 60;

//ACTIVATED[ALPHA] = true;
//ACTIVATED[IMPULSE] = true;
//for(let i=OMEGA; i<=ALLY; ++i)
	//ACTIVATED[i] = true;
ACTIVATED[EMP] = true;
ACTIVATED[FORT] = true;
ACTIVATED[TP] = true;
ACTIVATED[AMP] = true;
ACTIVATED[DESTINY] = true;
ACTIVATED[BARRIER] = true;
ACTIVATED[DELTA] = true;
ACTIVATED[RIPPLE] = true;
ACTIVATED[DISRUPT] = true;
ACTIVATED[DECOY] = true;
ACTIVATED[REPAIR] = true;
ACTIVATED[ROCKET] = true;
ACTIVATED[TURRET] = true;

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

RANGE[DESTINY] = 65;
RANGE[DARTP] = 40;
RANGE[ROCKETP] = 70;
RANGE[DELTAP] = 70;

function _dist(a, b){
	return Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]));
}

let UID = 0;

class Ship{
	constructor(type, hp, team, modules, pos, move = []){
		this.type = type;
		this.hp = hp;
		this.team = team;
		this.modules = [];
		for(let m of modules) if(m)
			this.modules.push({type: m, state: 1, aux: null});
		this.pos = pos;
		this.dock = null;
		this.move = move;
		this.wait = null;
		this.tp = null;
		this.uid = ++UID;
		this.vel = type == DARTP ? SPEED[DARTP] : 0;
	}

	waitMoveTo(pos, i){
		this.wait = [...pos, 40, i];
	}

	moveTo(pos, i){
		this.move.push([...pos, i]);
	}

	confirmMove(){
		if(this.wait){
			this.move.push([this.wait[0], this.wait[1], this.wait[3]]);
			this.wait = null;
		}
	}

	cancelMove(){
		if(this.wait) this.wait = null;
		else if(this.move.length > 1) this.move.pop();
	}

	encode(){
		return {
			type: this.type,
			hp: this.hp,
			team: this.team,
			modules: this.modules,
			pos: this.pos,
			move: this.move,
			dock: this.dock,
			wait: this.wait,
			tp: this.tp,
			uid: this.uid
		};
	}
	
	hurt(x){
		this.hp = Math.max(0, this.hp-x);
	}

	travel(){
		const now = Date.now();

		if(this.wait && --this.wait[2] == 0) this.confirmMove();

		while(this.move.length && this.move[0][0] == this.pos[0] && this.move[0][1] == this.pos[1]){
			this.dock = this.move[0][2];
			this.move = this.move.slice(1);
		}

		if(this.move.length){
			let move = this.move[0],
				dir = [move[0]-this.pos[0], move[1]-this.pos[1]],
				dist = this.vel/4,
				mag = Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1]);
			this.dock = this.move[0][2];
			if(dist > mag){
				this.pos = [...move];
				this.move = this.move.slice(1);
			}else{
				dist /= mag;
				this.pos[0] += dir[0]*dist;
				this.pos[1] += dir[1]*dist;
			}

			this.vel = Math.min(this.vel+8, SPEED[this.type]);

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
		this.ev = [];
	}

	addShip(type, team, modules, pos, move = []){
		this.ships.push(new Ship(type, HP[type], team, modules, pos, move));
	}

	activateModule(s, dat){
		if(ACTIVATED[this.ships[s].modules[dat.i].type])
			this.ships[s].modules[dat.i].state = -1;

		const T = this.ships[s].modules[dat.i].type;

		if(T == DELTA) this.addShip(DELTAP, this.ships[s].team, [], [...this.ships[s].pos], [[...dat.loc, dat.dock]]);

		if(T == DECOY) this.addShip(DECOY, this.ships[s].team, [], [...this.ships[s].pos], [[...dat.loc, dat.dock]]);
		if(T == REPAIR) this.addShip(REPAIR, this.ships[s].team, [], [...this.ships[s].pos], [[...dat.loc, dat.dock]]);
		if(T == ROCKET) this.addShip(ROCKET, this.ships[s].team, [ROCKETD], [...this.ships[s].pos], [[...dat.loc, dat.dock]]);
		if(T == TURRET){
			const R = Math.random()*Math.PI*2;
			this.addShip(TURRET, this.ships[s].team, [TURRETD], [
				this.ships[s].pos[0]+10*Math.cos(R),
				this.ships[s].pos[1]+10*Math.sin(R)
			]);
		}

		if(T == TP){
			this.ships[s].move = [];
			this.ships[s].wait = null;
			this.ships[s].tp = [...dat.loc, dat.dock];
		}

		if(T == DESTINY){
			let T = [this.ships[s].pos[0]+COLS*150, this.ships[s].pos[1]+ROWS*150];
			T[0] = Math.floor(T[0]/300);
			T[1] = Math.floor(T[1]/300);
			
			const R = this.rocks.filter(x => {
				let P = [x[0]+COLS*150, x[1]+ROWS*150];
				P[0] = Math.floor(P[0]/300);
				P[1] = Math.floor(P[1]/300);

				return Math.abs(P[0]-T[0]) <= 1 && Math.abs(P[1]-T[1]) <= 1
					&& (P[0] != T[0] || P[1] != T[1]);
			});

			const I = Math.floor(Math.random()*R.length);
			let J = null;

			for(let i=0; i<this.rocks.length; ++i)
				if(this.rocks[0] == R[I][0] && this.rocks[1] == R[I][1])
					J = i;

			this.ships[s].move = [];
			this.ships[s].wait = null;
			this.ships[s].tp = [R[I][0], R[I][1]+10, J];
		}
	}

	explode(pos, range, str){
		this.ev.push(["explode", [pos, range, str]]);
	}

	die(pos){
		this.ev.push(["die", pos]);
	}

	updateModules(s){
		for(let i=0; i<s.modules.length; ++i){
			const T = s.modules[i].type;

			if(s.modules[i].state < 0)
				s.modules[i].state = Math.min(0, s.modules[i].state+1/(1+EFFECT_TIME[T]*4));
			else if(s.modules[i].state != 1)
				s.modules[i].state = Math.min(1, s.modules[i].state+1/(1+(RECHARGE_TIME[T]-EFFECT_TIME[T])*4));

			const S = s.modules[i].state;

			if(T == TP && S == 0){
				s.pos = s.tp.slice(0, 2);
				s.dock = s.tp[2];
				s.tp = null;
			}

			if(T == DESTINY && S == 0){
				for(let x of this.ships)
					if(x.team != s.team)
						if(_dist(x.pos, s.pos) < RANGE[DESTINY])
							x.hurt(5000);

				this.explode([...s.pos], RANGE[DESTINY], 9);
				s.pos = s.tp.slice(0, 2);
				s.dock = s.tp[2];
				s.tp = null;
			}
		}
	}

	start(){
		const d = 5;

		let count = new Array(COLS*ROWS).fill(0);

		for(let i=0; i<d*COLS*ROWS; ++i){
			let a = [Math.floor(Math.random()*COLS*ROWS), Math.floor(Math.random()*COLS*ROWS)];
			let b = count[a[0]] > count[a[1]] ? a[1] : a[0];
			++count[b];
			this.rocks.push([
				Math.round(Math.random()*300) + 300*(b%COLS) - 300*COLS/2,
				Math.round(Math.random()*300) + 300*Math.floor(b/COLS) - 300*ROWS/2
			]);
		}

		let m = [];
		for(let p of this.players) m.push(p.id);
		console.log("starting game", m);

		let q = [];
		for(let s of this.ships) q.push(s.encode());

		for(let p of this.players){
			p.emit("start", {ships: q, rocks: this.rocks, uid: this.uid, rows: ROWS, cols: COLS});
		}
	}

	update(){
		for(let s of this.ships) s.travel();

		{
			let X = new Array(this.rocks.length);
			for(let i=0; i<this.rocks.length; ++i)
				X[i] = [];

			for(let i=0; i<this.ships.length; ++i)
				if(!this.ships[i].move.length && this.ships[i].dock != null && this.ships[i].tp == null)
					X[this.ships[i].dock].push(i);

			for(let i=0; i<this.rocks.length; ++i)
				for(let j=0; j<X[i].length; ++j)
					this.ships[X[i][j]].pos = [
						this.rocks[i][0]-10*Math.sin(2*Math.PI/X[i].length*(j-X[i].length/2+0.5)),
						this.rocks[i][1]+10*Math.cos(2*Math.PI/X[i].length*(j-X[i].length/2+0.5))
					];
		}

		for(let s of this.ships) this.updateModules(s);

		for(let s of this.ships){
			if(!s.move.length){
				if(s.type == DARTP){
					s.hp = -1;
					this.explode(s.pos, RANGE[DARTP], 9);
					for(let x of this.ships)
						if(x.team != s.team)
							if(_dist(x.pos, s.pos) < RANGE[DARTP])
								x.hurt(4000);
				}

				if(s.type == ROCKETP){
					s.hp = -1;
					this.explode(s.pos, RANGE[ROCKETP], 5);
					for(let x of this.ships)
						if(x.team != s.team)
							if(_dist(x.pos, s.pos) < RANGE[ROCKETP])
								x.hurt(700);
				}

				if(s.type == DELTAP){
					s.hp = -1;
					this.explode(s.pos, RANGE[DELTAP], 7);
					for(let x of this.ships)
						if(x.team != s.team)
							if(_dist(x.pos, s.pos) < RANGE[DELTAP])
								x.hurt(2000);
				}
			}
		}

		for(let s of this.ships) if(s.hp == 0){
			if(s.type == DELTAP){
				this.explode(s.pos, RANGE[DELTAP], 1);
				for(let x of this.ships)
					if(x.team != s.team)
						if(_dist(x.pos, s.pos) < RANGE[DELTAP])
							x.hurt(500);
			}
		}

		let q = [];
		for(let s of this.ships){
			if(s.hp > 0) q.push(s.encode());
			else if([BS, DECOY, REPAIR, ROCKET, TURRET].includes(s.type))
				this.die(s.pos);
		}

		this.ships = this.ships.filter(x => x.hp > 0);

		for(let p of this.players) p.emit("state", {s: q, ev: [...this.ev]});

		this.ev = [];
	}

	end(){
		for(let p of this.players) p.emit("end");
	}

	alive(type){
		return this.ships.filter(x => x.type == type).length;
	}
}

module.exports = { Ship, Game, COLS, ROWS };
