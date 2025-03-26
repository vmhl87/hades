const COLS = 5, ROWS = 5, TPS = 4, SECTOR_COLLAPSE_TIME = 40, MAX_ARTS = 4, ROGUE_BS_HEAL_AMT = 2000;

let ct = 0;

// SHIP TYPES

const BS = ++ct, SENTINEL = ++ct, GUARD = ++ct, INT = ++ct, COL = ++ct, BOMBER = ++ct;

const DARTP = ++ct, ROCKETP = ++ct, STRIKEP = ++ct, BOMBERP = ++ct;

// DRONE TYPES

const DECOY = ++ct, ROCKET = ++ct, TURRET = ++ct, PHASE = ++ct, WARP = ++ct, BOMB = ++ct, REPAIR = ++ct;

// WEAPON TYPES

const LASER = ++ct, CANNON = ++ct, SPREAD = ++ct, LASER2 = ++ct, DART = ++ct, PULSE = ++ct;

/* UNOBTAIN */ const TURRETD = ++ct, ROCKETD = ++ct;

// SHIELD TYPES

const ALPHA = ++ct, DELTA = ++ct, OMEGA = ++ct, PASSIVE = ++ct, MIRROR = ++ct, ALLY = ++ct;

// MODULE TYPES

const EMP = ++ct, DUEL = ++ct, FORT = ++ct, TP = ++ct, AMP = ++ct, LEAP = ++ct, BARRIER = ++ct, STRIKE = ++ct, BOND = ++ct, DISRUPT = ++ct;

/* UNOBTAIN */ const SUSPEND = ++ct, VENG = ++ct, RIPPLE = ++ct, APOCALYPSE = ++ct;

const Const = require("./constants.js");

/*
let SPEED = new Array(ct), HP = new Array(ct),
	EFFECT_TIME = new Array(ct), RECHARGE_TIME = new Array(ct),
	ACTIVATED = new Array(ct), RANGE = new Array(ct),
	EXPIRE_TIME = new Array(ct), TARGETS = new Array(ct),
	DAMAGE = new Array(ct), LASER_DAMAGE = new Array(ct),
	STRENGTH = new Array(ct);
*/

let SPEED = Const.SPEED, HP = Const.HP, EFFECT_TIME = Const.EFFECT_TIME, RECHARGE_TIME = Const.RECHARGE_TIME,
	ACTIVATED = Const.ACTIVATED, RANGE = Const.RANGE, EXPIRE_TIME = Const.EXPIRE_TIME, TARGETS = Const.TARGETS,
	DAMAGE = Const.DAMAGE, LASER_DAMAGE = Const.LASER_DAMAGE, STRENGTH = Const.STRENGTH,
	LASER_CHARGE = Const.LASER_CHARGE;

const PASSIVE_DELAY = 3, PASSIVE_TIME = 30;

const CERB = 3.14;

const Artifacts = require("./artifacts.js");

function _dist(a, b){
	return Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]));
}

function IS_WEAPON(T){
	return (T >= LASER && T <= ROCKETD) || (T >= SENTINEL && T <= COL);
}

function normalModule(M){
	let W = M.filter(x => x >= LASER && x <= PULSE),
		S = M.filter(x => x >= ALPHA && x <= ALLY),
		C = M.filter(x => x >= EMP && x <= DISRUPT),
		D = M.filter(x => x >= DECOY && x <= BOMB);

	let H = new Set();
	C = C.filter(x => H.has(x) ? false : (H.add(x) || true));

	W = W.slice(0, 1);
	S = S.slice(0, 1);
	C = C.slice(0, 3);
	D = D.slice(0, Math.min(1, 3-C.length)0);

	return [...W, ...S, ...C, ...D];
}

let UID = 0;

class Ship{
	constructor(type, team, modules, pos, move = []){
		this.type = type;
		this.hp = HP[type];
		this.mhp = HP[type];
		this.team = team;
		this.modules = [];
		for(let m of modules) if(m)
			this.modules.push({type: m, state: 1, aux: null, use: false});
		this.pos = pos;
		this.dock = null;
		this.move = move;
		this.wait = null;
		this.tp = null;
		this.uid = ++UID;
		this.vel = type == DARTP ? SPEED[DARTP] : 0;
		this.expire = 1;
		this.emp = 0;
		this.fort = 0;
		this.imp = 0;
		this.ally = null;
		this.speed = SPEED[type];

		this.ai = null;
		this.kill = null;
		this._kill = new Map();
		this.arts = new Set();
		this.seenArts = new Set();

		this.dmgBoost = 1;
		this.empVuln = 1;
		this.cerbVuln = 1;
		this.disruptVuln = 1;
		this.moveVuln = 1;

		this.entangled = false;
		this.hit = false;

		this.suspend = 1;
		this.sectorDmg = ([STRIKEP, ROCKETP, STRIKEP, BOMBERP]).includes(type) ? 0 : 150;

		this.shipName = null;

		this.bond = [0, null];

		for(let m of this.modules){
			if(IS_WEAPON(m.type)){
				m.aux = [];
				m.color = [200, 100, 50];

				if(m.type == PULSE){
					m.color = [200, 75, 50];
					m.delay = RECHARGE_TIME[PULSE];
				}

			}else if(m.type == PASSIVE)
				m.aux = [1, 1];

			else if(m.type == DELTA)
				m.aux = [0, 0, 0];

			else if(m.type >= ALPHA && m.type <= ALLY)
				m.aux = [0, 0];

			if(m.type == MIRROR)
				m.blast = [0, 0];

			if(m.type == TURRETD)
				m.state = 0;

			if([LASER, LASER2, COL, CANNON, PULSE].includes(m.type))
				m.state = 0;

			if(m.type == WARP)
				m.color = [200, 100, 50];

			if(m.type == BOND)
				m.aux = { offset: [0, 0], uid: null };
		}

		if(type == BS && Number.isInteger(team[0]) && team[0] < 0){
			this.ai = [Math.random(), 0];
		}

		if([SENTINEL, GUARD, COL, BOMBER].includes(type))
			this.ai = [Math.random(), Math.floor(Math.random()*COLS*ROWS)];

		if(type == INT) this.ai = Math.random();
	}

	waitMoveTo(pos, i){
		if(this.bond[0] == 0) this.wait = [...pos, 1, i];
	}

	moveTo(pos, i){
		if(this.bond[0] == 0) this.move.push([...pos, i]);
	}

	confirmMove(){
		if(this.wait && this.bond[0] == 0){
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
			mhp: this.mhp,
			team: this.team[0],
			user: this.team[1],
			name: this.team[2],
			modules: this.modules,
			pos: this.pos,
			move: this.move,
			dock: this.dock,
			wait: this.wait,
			tp: this.tp,
			uid: this.uid,
			expire: this.expire,
			emp: this.emp,
			fort: this.fort,
			imp: this.imp,
			ally: this.ally == null ? 0 : 1,
			arts: Array.from(this.arts),
			bond: this.bond,
			entangled: this.entangled,
			hit: this.hit,
		};
	}
	
	hurt(x, src = null){
		this.hit = true;

		if(typeof src == "string" && src.startsWith(CERB.toString())) x *= this.cerbVuln;

		if(this.move.length && this.emp == 0) x *= this.moveVuln;

		if(this.type == BS && this.ai != null)
			this.ai[1] = true;

		let dmg = x;

		if(this.fort > 0)
			dmg *= DAMAGE[FORT];

		if(this.ally != null){
			if(this.ally[0] == null) return;

			const rem = Math.min(Math.ceil(this.ally[0].modules[this.ally[1]].aux[0]*STRENGTH[ALLY]), dmg);

			this.ally[0].modules[this.ally[1]].aux[0] = Math.max(0,
				this.ally[0].modules[this.ally[1]].aux[0]-rem/STRENGTH[ALLY]);
			dmg -= rem;
		}

		if(this.imp == 0) for(let m of this.modules) if(dmg && m.type >= ALPHA && m.type <= MIRROR && m.aux[0]){
			if(m.type == ALPHA) return;

			if(m.type == PASSIVE){
				m.aux[1] = 0;
				m.use = true;
			}

			const rem = Math.min(Math.ceil(m.aux[0]*STRENGTH[m.type]), dmg);

			if(m.type == MIRROR){
				m.blast[0] += rem;
				if(m.blast[1] == 0) m.blast[1] = 1+TPS;
			}

			m.aux[0] = Math.max(0, m.aux[0]-rem/STRENGTH[m.type]);
			dmg -= rem;
		}

		if(dmg) this._hurt(dmg, src);
	}

	_hurt(x, src = null){
		this.hit = true;

		this.hp = Math.max(0, this.hp-x);

		if(src != null){
			if(!this._kill.has(src)) this._kill.set(src, 0);
			this._kill.set(src, this._kill.get(src) + x);

			if(this.hp == 0){
				let best = 0;
				for(let x of this._kill.keys()){
					if(this._kill.get(x) > best){
						best = this._kill.get(x);
						this.kill = x;

					}else if(this._kill.get(x) == best)
						if(Math.random() > 0.5) this.kill = x;
				}
			}
		}
	}

	heal(x){
		this.hp = Math.min(this.mhp, this.hp+x);
	}

	travel(){
		if([TURRET, PHASE, BOMB].includes(this.type)){
			this.move = [];
			this.wait = null;
			this.dock = null;
			return;
		}

		const now = Date.now();

		if(this.wait != null){
			this.wait[2] -= 1/(10*TPS);
			if(this.wait[2] <= 0) this.confirmMove();
		}

		while(this.move.length && this.move[0][0] == this.pos[0] && this.move[0][1] == this.pos[1]){
			this.dock = this.move[0][2];
			this.move = this.move.slice(1);
		}

		if(this.move.length){
			let move = this.move[0],
				dir = [move[0]-this.pos[0], move[1]-this.pos[1]],
				dist = this.vel/TPS,
				mag = Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1]);
			this.dock = this.move[0][2];
			if(dist > mag){
				this.pos = move.slice(0, 2);
				this.move = this.move.slice(1);
			}else{
				dist /= mag;
				this.pos[0] += dir[0]*dist;
				this.pos[1] += dir[1]*dist;
			}

			//let S = SPEED[this.type] * this.suspend;
			let S = this.speed * this.suspend;

			for(let m of this.modules) if(m.type == DELTA && m.aux[2])
				S *= SPEED[DELTA];

			this.vel = Math.min(this.vel+32/TPS, S);

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
		this.uid = (++UID)*1000 + Math.floor(Math.random()*1000);  // entropy
		this.entities = {blast: [], death: [], heal: [], emp: [], imp: [], sectorDeath: [], eliminate: [], win: [], surrender: []};
		this.lifetime = TPS*6;
		this.loneBSTimer = Math.random();
		this.sectors = new Array(ROWS*COLS);
		for(let i=0; i<ROWS*COLS; ++i)
			this.sectors[i] = [];
		this.dead = new Array(ROWS*COLS).fill(0);
		this.aliveCount = ROWS*COLS;

		this.age = 0;
		this.speed = 1;
	}

	addShip(type, team, modules, pos, move = []){
		this.ships.push(new Ship(type, team, modules, pos, move));
	}

	activateModule(s, dat){
		const T = this.ships[s].modules[dat.i].type;

		if(ACTIVATED[T]){
			if(T == DELTA)
				this.ships[s].modules[dat.i].aux = [1, 1, 1];

			else if(T >= ALPHA && T <= ALLY && T != PASSIVE)
				this.ships[s].modules[dat.i].aux = [1, 1];

			this.ships[s].modules[dat.i].state = -1;

			this.ships[s].modules[dat.i].use = true;
		}

		if(T == RIPPLE) this.ships[s].modules[dat.i].state = 0;

		if(T == STRIKE) this.addShip(STRIKEP, this.ships[s].team, [], [...this.ships[s].pos], [[...dat.loc, dat.dock]]);

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

		if(T == PHASE){
			const R = Math.random()*Math.PI*2;
			this.addShip(PHASE, this.ships[s].team, [SUSPEND], [
				this.ships[s].pos[0]+10*Math.cos(R),
				this.ships[s].pos[1]+10*Math.sin(R)
			]);
			this.activateModule(this.ships.length-1, {i: 0});
		}

		if(T == BOMB){
			const R = Math.random()*Math.PI*2;
			this.addShip(BOMB, this.ships[s].team, [PULSE], [
				this.ships[s].pos[0]+10*Math.cos(R),
				this.ships[s].pos[1]+10*Math.sin(R)
			]);
			this.ships[this.ships.length-1].modules[0].color = [200, 50, 100];
			this.ships[this.ships.length-1].modules[0].delay = 6;
		}

		if(T == WARP){
			const R = Math.random()*Math.PI*2;
			this.addShip(WARP, this.ships[s].team, [SENTINEL, TP], [
				this.ships[s].pos[0]+10*Math.cos(R),
				this.ships[s].pos[1]+10*Math.sin(R)
			]);
			this.ships[this.ships.length-1].modules[0].color = this.ships[s].modules[dat.i].color;
			this.activateModule(this.ships.length-1, {i: 1, loc: dat.loc, dock: dat.dock});
			this.addShip(WARP, this.ships[s].team, [SENTINEL, TP], [
				this.ships[s].pos[0]-10*Math.cos(R),
				this.ships[s].pos[1]-10*Math.sin(R)
			]);
			this.ships[this.ships.length-1].modules[0].color = this.ships[s].modules[dat.i].color;
			this.activateModule(this.ships.length-1, {i: 1, loc: dat.loc, dock: dat.dock});
		}

		if(T == TP){
			this.ships[s].move = [];
			this.ships[s].wait = null;
			this.ships[s].tp = [...dat.loc, dat.dock];
			this.ships[s].bond = [0, null];
		}

		if(T == LEAP){
			let T = [this.ships[s].pos[0]+COLS*150, this.ships[s].pos[1]+ROWS*150];
			T[0] = Math.floor(T[0]/300);
			T[1] = Math.floor(T[1]/300);

			let R = [];
			
			for(let i=0; i<this.rocks.length; ++i){
				const x = this.rocks[i];

				let P = [x[0]+COLS*150, x[1]+ROWS*150];
				P[0] = Math.floor(P[0]/300);
				P[1] = Math.floor(P[1]/300);

				if(Math.abs(P[0]-T[0]) <= 1 && Math.abs(P[1]-T[1]) <= 1
					&& (P[0] != T[0] || P[1] != T[1]))
					R.push([...x, i]);
			}
		
			const I = Math.floor(Math.random()*R.length);

			this.ships[s].move = [];
			this.ships[s].wait = null;
			this.ships[s].tp = [R[I][0], R[I][1]+10, R[I][2]];
			this.ships[s].bond = [0, null];
		}

		if(T == EMP){
			for(let x of this.ships)
				if(x.team[0] != this.ships[s].team[0])
					if(_dist(x.pos, this.ships[s].pos) < RANGE[EMP])
						x.emp = 1;

			//this.ev.push(["emp", [...this.ships[s].pos]]);
			this.entities.emp.push([[...this.ships[s].pos], this.age+4*TPS]);
		}

		if(T == DISRUPT){
			for(let x of this.ships)
				if(x.team[0] != this.ships[s].team[0])
					if(_dist(x.pos, this.ships[s].pos) < RANGE[DISRUPT])
						x.imp = 1;

			//this.ev.push(["imp", [...this.ships[s].pos]]);
			this.entities.imp.push([[...this.ships[s].pos], this.age+4*TPS]);
		}

		if(T == FORT) this.ships[s].fort = 1;

		if(T == RIPPLE){
			for(let x of this.ships) if(x.uid == dat.loc){
				const W = x.wait;
				x.wait = this.ships[s].wait;
				this.ships[s].wait = W;

				let M1 = [], M2 = [];
				for(let p of this.ships[s].move) M1.push([...p]);
				for(let p of x.move) M2.push([...p]);
				this.ships[s].move = [];
				x.move = [];
				for(let p of M1) x.move.push(p);
				for(let p of M2) this.ships[s].move.push(p);

				const D = x.dock;
				x.dock = this.ships[s].dock;
				this.ships[s].dock = D;

				const P = [...this.ships[s].pos];
				this.ships[s].pos = [...x.pos];
				x.pos = [...P];

				if(x.team[0] == CERB && x.move.length > 1)
					x.move = x.move.slice(0, 1);

				this.ships[s].bond = [0, null];
				x.bond = [0, null];
			}
		}

		if(T == BOND){
			for(let x of this.ships) if(x.uid == dat.loc){
				if(this.ships[s].bond[0] != 0 && this.ships[s].bond[1] == x.uid){
					this.ships[s].bond = [0, null];
					for(let m of x.modules) if(m.type == BOND && m.aux.uid == this.ships[s].uid)
						m.aux = { offset: [0, 0], uid: null };

				}else{
					x.move = [];
					x.tp = null;
					x.wait = null;
					x.dock = null;
					x.bond = [1, this.ships[s].uid];
					this.ships[s].modules[dat.i].aux = {
						offset: [x.pos[0]-this.ships[s].pos[0], x.pos[1]-this.ships[s].pos[1]],
						uid: dat.loc,
					};
				}
			}
		}
	}

	explode(pos, range, str, color){
		//this.ev.push(["explode", [[...pos], range, str]]);
		this.entities.blast.push([[...pos], range, color, this.age+0.2*str*TPS]);
	}

	die(pos){
		//this.ev.push(["die", pos]);
		this.entities.death.push([[...pos], this.age+3*TPS]);
	}

	updateModules(s){
		for(let i=0; i<s.modules.length; ++i){
			const T = s.modules[i].type;

			if(EFFECT_TIME[T] != null && T != PULSE){
				if(s.modules[i].state < 0)
					s.modules[i].state = Math.min(0, s.modules[i].state+1/(1+EFFECT_TIME[T]*TPS));
				else{
					if(T == DELTA)
						s.modules[i].state = Math.min(0.75, s.modules[i].state+0.75/(RECHARGE_TIME[T]*TPS));
					else if(T >= ALPHA && T <= ALLY)
						s.modules[i].state = Math.min(1, s.modules[i].state+1/(RECHARGE_TIME[T]*TPS));
					else s.modules[i].state = Math.min(1, s.modules[i].state+1/((RECHARGE_TIME[T]-EFFECT_TIME[T])*TPS));
				}

				if(s.modules[i].state == 0 && T >= ALPHA && T <= ALLY){
					if(T == DELTA)
						s.modules[i].state = 0.75*EFFECT_TIME[T]/RECHARGE_TIME[T];
					else s.modules[i].state = EFFECT_TIME[T]/RECHARGE_TIME[T];
				}
			}

			if(T == RIPPLE)
				s.modules[i].state = Math.min(1, s.modules[i].state+1/(RECHARGE_TIME[T]*TPS));

			if(T == TURRETD)
				s.modules[i].state = Math.min(1, s.modules[i].state+1/(RECHARGE_TIME[T]*TPS));

			const S = s.modules[i].state;

			if(T == TP && S == 0){
				for(let x of this.ships) if(x.team[0] != s.team[0])
					for(let m of x.modules) if(m.type == BARRIER && m.state < 0)
						if(_dist(x.pos, s.pos) < RANGE[BARRIER]){
							s.hurt(DAMAGE[BARRIER]/2, x.team[1]);
							s._hurt(DAMAGE[BARRIER]/2, x.team[1]);
						}

				if(s.tp != null){
					s.pos = s.tp.slice(0, 2);
					s.dock = s.tp[2];
					s.tp = null;
				}

				for(let x of this.ships) if(x.team[0] != s.team[0])
					for(let m of x.modules) if(m.type == BARRIER && m.state < 0)
						if(_dist(x.pos, s.pos) < RANGE[BARRIER]){
							s.hurt(DAMAGE[BARRIER]/2, x.team[1]);
							s._hurt(DAMAGE[BARRIER]/2, x.team[1]);
						}
			}

			if(T == LEAP && S == 0){
				for(let x of this.ships)
					if(x.team[0] != s.team[0])
						if(_dist(x.pos, s.pos) < RANGE[LEAP])
							x.hurt(DAMAGE[LEAP], s.team[1]);

				for(let x of this.ships) if(x.team[0] != s.team[0])
					for(let m of x.modules) if(m.type == BARRIER && m.state < 0)
						if(_dist(x.pos, s.pos) < RANGE[BARRIER]){
							s.hurt(DAMAGE[BARRIER]/2, x.team[1]);
							s._hurt(DAMAGE[BARRIER]/2, x.team[1]);
						}

				this.explode([...s.pos], RANGE[LEAP], 9, [200, 100, 50]);

				if(s.tp != null){
					s.pos = s.tp.slice(0, 2);
					s.dock = s.tp[2];
					s.tp = null;
				}

				for(let x of this.ships) if(x.team[0] != s.team[0])
					for(let m of x.modules) if(m.type == BARRIER && m.state < 0)
						if(_dist(x.pos, s.pos) < RANGE[BARRIER]){
							s.hurt(DAMAGE[BARRIER]/2, x.team[1]);
							s._hurt(DAMAGE[BARRIER]/2, x.team[1]);
						}
			}

			if([LASER, LASER2, COL].includes(T)){
				const A = s.modules[i].aux.length;

				if(A == 0) s.modules[i].state = 0;
				else if(A == TARGETS[T]){
					s.modules[i].state = Math.max(0.3, s.modules[i].state);

					if(!s.emp){
						if(s.modules[i].state < 0.6)
							s.modules[i].state += 0.3/(TPS*LASER_CHARGE[T][0]);
						else s.modules[i].state = Math.min(1,
							s.modules[i].state+0.4/(TPS*(LASER_CHARGE[T][1]-LASER_CHARGE[T][0])));
					}

				}else s.modules[i].state = 0.3;
			}

			if(T == PULSE){
				if(s.modules[i].aux.length && !s.emp) s.modules[i].state = Math.min(1, s.modules[i].state+1/(s.modules[i].delay*TPS));
				else s.modules[i].state = Math.max(0, s.modules[i].state-1/(30*TPS));
			}

			if(T == BOMBER){
				if(S == 1 && s.dock != null){
					let P = null;
					for(let i=0; i<this.sectors.length; ++i) if(this.sectors[i].includes(s.dock))
						P = i;

					if(P != null){
						const X = P%COLS, Y = Math.floor(P/COLS);

						let count = 0;

						for(let x of this.ships) if(x.team[0] != s.team[0]){
							if(Math.abs(300*X-150*COLS+150 - x.pos[0]) < 300 && Math.abs(300*Y-150*ROWS+150 - x.pos[1]) < 300){
								this.addShip(BOMBERP, s.team, [], [...s.pos], [[...x.pos, null]]);
								s.modules[i].state = 0;
								++count;
							}
						}

						if(count) s.modules[i].use = true;
					}
				}
			}

			if(T == DART){
				if(s.modules[i].aux.length){
					if(S == 1){
						let I = null;

						for(let j=0; j<this.ships.length; ++j)
							if(this.ships[j].uid == s.modules[i].aux[0])
								I = j;

						if(I != null){
							this.addShip(DARTP, s.team, [], [s.pos[0], s.pos[1]+5], [[...this.ships[I].pos,
								this.ships[I].move.length ? null : this.ships[I].dock]]);
							this.ships[this.ships.length-1].ai = s.modules[i].aux[0];
							s.modules[i].state = 0;
						}
					}
				}
			}

			if(T == ROCKETD){
				if(s.modules[i].aux.length){
					if(S == 1){
						let I = null;

						for(let j=0; j<this.ships.length; ++j)
							if(this.ships[j].uid == s.modules[i].aux[0])
								I = j;

						if(I != null){
							this.addShip(ROCKETP, s.team, [], [...s.pos], [[...this.ships[I].pos,
								this.ships[I].move.length ? null : this.ships[I].dock]]);
							s.modules[i].state = 0;
						}
					}
				}
			}

			if(T == DELTA){
				if(1+S > 10/EFFECT_TIME[T] || (s.modules[i].aux[2] && s.move.length == 0 && s.bond[0] == 0))
					s.modules[i].aux[2] = 0;

				if(s.modules[i].aux[2] == 1 && s.imp == 0)
					for(let x of this.ships)
						if(x.team[0] != s.team[0])
							if(_dist(x.pos, s.pos) < RANGE[DELTA])
								x.hurt(DAMAGE[DELTA]/TPS, s.team[1]);
			}

			if(T == ALLY && s.modules[i].aux[0] > 0 && s.imp == 0){
				for(let x of this.ships)
					if(x.team[0] == s.team[0] && x.uid != s.uid)
						if(_dist(x.pos, s.pos) < RANGE[ALLY])
							if(x.ally == null || x.ally[0] == null || x.ally[0].modules[x.ally[1]].aux[0] < s.modules[i].aux[0])
								x.ally = [s, i];
			}

			if(T == PASSIVE){
				s.modules[i].aux[1] = Math.min(1, s.modules[i].aux[1]+1/(TPS*PASSIVE_DELAY));

				if(s.modules[i].aux[1] == 1)
					s.modules[i].aux[0] = Math.min(1, s.modules[i].aux[0]+1/(TPS*PASSIVE_TIME));

			}else if(T >= ALPHA && T <= ALLY){
				if(s.modules[i].aux[0] <= 0){
					s.modules[i].aux[1] = 0;
					if(S < 0){
						if(T == DELTA)
							s.modules[i].state = (1+s.modules[i].state)*0.75*EFFECT_TIME[T]/RECHARGE_TIME[T];
						else s.modules[i].state = (1+s.modules[i].state)*EFFECT_TIME[T]/RECHARGE_TIME[T];
					}
				}

				s.modules[i].aux[1] = Math.max(0, s.modules[i].aux[1]-1/(TPS*EFFECT_TIME[T]));
				if(!s.modules[i].aux[1]) s.modules[i].aux[0] = 0;
			}

			if(T == MIRROR){
				if(s.modules[i].blast[0] > 0){
					for(let x of this.ships)
						if(x.team[0] != s.team[0])
							if(_dist(x.pos, s.pos) < RANGE[MIRROR])
								x.hurt(s.modules[i].blast[0]*DAMAGE[MIRROR], s.team[1]);

					s.modules[i].blast[0] = 0;
				}

				if(s.modules[i].blast[1] && --s.modules[i].blast[1] == 1)
					this.explode([...s.pos], RANGE[MIRROR], 3, [200, 50, 50]);
			}

			if(T == VENG){
				if(S == 0){
					for(let x of this.ships)
						if(x.team[0] != s.team[0])
							if(_dist(x.pos, s.pos) < RANGE[VENG])
								x.hurt(DAMAGE[VENG], s.team[1]);

					this.explode([...s.pos], RANGE[VENG], 9, [200, 50, 50]);
				}

				if(s.hp < s.mhp) s.modules[i].use = true;
				
				if(S == 1 && s.hp <= s.mhp*2/7){
					s.modules[i].state = -1;

					for(let i=0; i<this.ships.length; ++i)
						if(this.ships[i].uid == s.uid)
							for(let j=0; j<s.modules.length; ++j)
								if(s.modules[j].type >= ALPHA && s.modules[j].type <= ALLY
									&& s.modules[j].state == 1)
									this.activateModule(i, {i: j});
				}
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
			this.sectors[b].push(i);
		}

		let m = [];
		for(let p of this.players) m.push(p.id);
		console.log("starting game", this.uid, m);

		let q = [];
		for(let s of this.ships) q.push(s.encode());

		for(let p of this.players){
			p.emit("start", {ships: q, rocks: this.rocks, uid: this.uid, rows: ROWS, cols: COLS});
		}
	}

	addPlayer(s){
		if(this.players.filter(x => x.id == s.id).length) return;

		this.players.push(s);

		let q = [];
		for(let x of this.ships) q.push(x.encode());

		s.emit("start", {ships: q, rocks: this.rocks, uid: this.uid, rows: ROWS, cols: COLS});
	}

	update(){
		if(!this.alive()) this.lifetime = Math.max(0, this.lifetime-1);

		for(let s of this.ships){
			s.emp = Math.max(0, s.emp - 1/(TPS*EFFECT_TIME[EMP]*s.empVuln));
			s.fort = Math.max(0, s.fort - 1/(TPS*EFFECT_TIME[FORT]));
			s.imp = Math.max(0, s.imp - 1/(TPS*EFFECT_TIME[DISRUPT]*s.disruptVuln));
			s.bond[0] = Math.max(0, s.bond[0] - 1/(TPS*EFFECT_TIME[BOND]));
			if(s.bond[0] == 0) s.bond[1] = null;
		}

		let locked = new Set();

		for(let s of this.ships) for(let m of s.modules)
			if(m.type == BOND && m.aux.uid != null)
				locked.add(m.aux.uid);

		for(let s of this.ships){
			if(locked.has(s.uid) && s.bond[0] == 0)
				locked.delete(s.uid);

			if(!locked.has(s.uid)) s.bond[0] = 0;
		}

		{
			let M = new Map();
			for(let i=0; i<this.ships.length; ++i)
				M.set(this.ships[i].uid, i);

			for(let s of this.ships) for(let m of s.modules)
				if(m.type == BOND && m.aux.uid != null){
					if(!M.has(m.aux.uid) || !locked.has(m.aux.uid))
						m.aux = { offset: [0, 0], uid: null };

					else{
						this.ships[M.get(m.aux.uid)].pos[0] = s.pos[0]+m.aux.offset[0];
						this.ships[M.get(m.aux.uid)].pos[1] = s.pos[1]+m.aux.offset[1];
					}
				}
		};

		for(let s of this.ships) for(let m of s.modules)
			if(m.type == BARRIER && m.state < 0)
				for(let x of this.ships) if(x.team[0] != s.team[0] && x.type != STRIKEP)
					if(_dist(x.pos, s.pos) < RANGE[BARRIER] && (s.bond[0] == 0 || x.uid != s.bond[1]))
						locked.add(x.uid);
		
		// cerberus + lone BS AI

		let using = new Array(this.rocks.length).fill(false),
			priority = new Array(this.rocks.length).fill(false);
		
		for(let s of this.ships) if(s.team[0] != CERB && [BS, DECOY, REPAIR, ROCKET, WARP].includes(s.type)){
			if(s.type == DECOY){
				if(s.move.length) priority[s.move[0][2]] = true;
				else priority[s.dock] = true;
			}
			if(s.tp != null){
				if(s.tp[2] != null) using[s.tp[2]] = true;
			}else if(!s.move.length) using[s.dock] = true;
			else using[s.move[0][2]] = true;
		}

		let occupied = new Array(ROWS*COLS);
		for(let i=0; i<ROWS*COLS; ++i) occupied[i] = [];

		for(let i=0; i<this.sectors.length; ++i) for(let x of this.sectors[i])
			if(using[x]) occupied[i].push(x);

		{
			let S = [];

			for(let i=0; i<ROWS*COLS; ++i)
				if(this.dead[i] == 0) S.push(i);

			for(let i=0; i<this.ships.length; ++i){
				const s = this.ships[i];

				if(this.dead[Math.floor((s.pos[0]+150*COLS)/300)+Math.floor((s.pos[1]+150*ROWS)/300)*COLS] == 2)
					s.hurt(s.sectorDmg/TPS);

				if([SENTINEL, GUARD, COL].includes(s.type) && s.team[0] == CERB){
					if(s.pos[1] > -150*ROWS*2){
						if(s.wait == null && s.move.length == 0){
							if(occupied[s.ai[1]].length) s.ai[0] += 1/(TPS*([3, 1, 0, 2])[s.type-SENTINEL]);
							else s.ai[0] += 1/(TPS*20);
						}

						if(s.ai[0] >= 1){
							s.ai[0] = 0;

							let I = this.sectors[s.ai[1]][Math.floor(Math.random()*this.sectors[s.ai[1]].length)];

							let dist = 450;
							for(let x of occupied[s.ai[1]]){
								const D = _dist(this.rocks[x], s.pos);
								if(D < dist){
									dist = D;
									I = x;
								}
							}

							dist = 450;
							for(let x of this.sectors[s.ai[1]]) if(priority[x]){
								const D = _dist(this.rocks[x], s.pos);
								if(D < dist){
									dist = D;
									I = x;
								}
							}

							if(I != s.dock) s.moveTo([this.rocks[I][0], this.rocks[I][1]+10], I);
						}
					}

				}else if(s.type == BOMBER){
					if(s.pos[1] > -150*ROWS*2){
						if(s.wait == null && s.move.length == 0){
							if(occupied[s.ai[1]].length) s.ai[0] = 1;
							else s.ai[0] += 1/(TPS*20);
						}

						if(s.ai[0] >= 1){
							s.ai[0] = 0;

							let I = this.sectors[s.ai[1]][Math.floor(Math.random()*this.sectors[s.ai[1]].length)];
							let dist = 0;

							for(let i of this.sectors[s.ai[1]]){
								let worst = 450;
								for(let x of occupied[s.ai[1]]){
									const D = _dist(this.rocks[x], this.rocks[i]);
									worst = Math.min(worst, D);
								}

								if(worst > dist){
									dist = worst;
									I = i;
								}
							}

							if(I != s.dock) s.moveTo([this.rocks[I][0], this.rocks[I][1]+10], I);
						}
					}

				}else if(s.type == INT){
					if(s.wait == null && s.move.length == 0)
						s.ai += 1/(TPS*20);

					if(s.ai >= 1 && S.length){
						s.ai = 0;

						const N = 3;
						
						let P = [];

						for(let i=0; i<N; ++i){
							const R = S[Math.floor(Math.random()*S.length)];
							if(this.sectors[R].length){
								const I = this.sectors[R][Math.floor(Math.random()*this.sectors[R].length)];
								P.push([_dist(s.pos, this.rocks[I]), I]);
							}
						}

						P.sort((a, b) => a[0]-b[0]);

						if(P.length) s.waitMoveTo([this.rocks[P[0][1]][0], this.rocks[P[0][1]][1]+10], P[0][1]);
					}

				}else if(s.type == BS && s.ai != null){
					if(s.pos[1] < 150*ROWS*2){
						if(s.ai[1]){
							let veng = false;
							for(let m of s.modules) if(m.type == VENG) veng = true;

							for(let j=0; j<s.modules.length; ++j) if(s.modules[j].state == 1){
								const m = s.modules[j];

								if(m.type >= ALPHA && m.type < ALLY && !veng)
									this.activateModule(i, {i: j});

								if(m.type == ALLY && s.modules[0].aux.length)
									this.activateModule(i, {i: j});

								if(m.type == EMP) this.activateModule(i, {i: j});

								if(m.type == BARRIER) this.activateModule(i, {i: j});

								if(m.type == AMP) this.activateModule(i, {i: j});

								if(m.type == FORT) this.activateModule(i, {i: j});

								if(m.type == TURRET) this.activateModule(i, {i: j});

								if(m.type == PHASE) this.activateModule(i, {i: j});

								if(m.type == BOMB) this.activateModule(i, {i: j});

								if(m.type == DECOY){
									this.activateModule(i, {i: j, loc: s.move.length ? s.move[0].slice(0, 2) :  [...s.pos],
										dock: s.move.length ? s.move[0][2] : s.dock
									});
								}
							}

						}else{
							for(let j=0; j<s.modules.length; ++j) if(s.modules[j].state == 1){
								const m = s.modules[j];

								if(m.type == ROCKET && !s.move.length){
									let empty = true;

									for(let x=0; x<this.sectors.length; ++x) if(this.sectors[x].includes(s.dock))
										for(let y of this.ships) if((y.type >= SENTINEL && y.type <= GUARD) || y.type == COL)
											if(y.ai[1] == x) empty = false;

									if(empty) this.activateModule(i, {i: j, loc: [...s.pos], dock: s.dock});
								}
							}
						}

						if(s.wait == null && s.move.length == 0){
							s.ai[0] += 1/(TPS*30);
							if(s.ai[1]) s.ai[0] += 5/(TPS*30);
							if(this.dead[Math.floor((s.pos[0]+150*COLS)/300)+Math.floor((s.pos[1]+150*ROWS)/300)*COLS] > 0)
								s.ai[0] = 1;

						}else if(s.wait != null){
							if(s.ai[1]) s.wait[2] -= 3/(10*TPS);
							if(this.dead[Math.floor((s.pos[0]+150*COLS)/300)+Math.floor((s.pos[1]+150*ROWS)/300)*COLS] > 0)
								s.wait[2] -= 5/(10*TPS);
						}

						s.ai[1] = false;

						if(s.ai[0] >= 1){
							s.ai[0] = 0;

							let S = [];
							
							const p = [Math.floor((s.pos[0]+150*COLS)/300), Math.floor((s.pos[1]+150*ROWS)/300)];

							for(let i=p[0]-1; i<=p[0]+1; ++i)
								for(let j=p[1]-1; j<=p[1]+1; ++j)
									if(i >= 0 && j >= 0 && i < COLS && j < ROWS)
										if(this.dead[i+j*COLS] == 0) S.push(i+j*COLS);

							if(S.length){
								const P = S[Math.floor(Math.random()*S.length)];
								if(this.sectors[P].length){
									const I = this.sectors[P][Math.floor(Math.random()*this.sectors[P].length)];
									s.waitMoveTo([this.rocks[I][0], this.rocks[I][1]+10], I);
								}
							}
						}
					}
				}
			}
		};

		for(let s of this.ships) s.suspend = 1;

		for(let s of this.ships) for(let m of s.modules) if(m.type == SUSPEND && m.state < 0){
			for(let x of this.ships) if(_dist(x.pos, s.pos) < RANGE[SUSPEND] && x.team[0] != s.team[0])
				x.suspend = 0.5;
		}

		for(let s of this.ships) if(!s.emp && !locked.has(s.uid) && !s.fort) s.travel();

		{
			let X = new Array(this.rocks.length);
			for(let i=0; i<this.rocks.length; ++i)
				X[i] = [];

			for(let i=0; i<this.ships.length; ++i)
				if(!this.ships[i].move.length && this.ships[i].dock != null && this.ships[i].tp == null
					&& ![ROCKETP, DARTP, STRIKEP].includes(this.ships[i].type))
					X[this.ships[i].dock].push(i);

			for(let i=0; i<this.rocks.length; ++i)
				for(let j=0; j<X[i].length; ++j)
					this.ships[X[i][j]].pos = [
						this.rocks[i][0]-10*Math.sin(2*Math.PI/X[i].length*(j-X[i].length/2+0.5)),
						this.rocks[i][1]+10*Math.cos(2*Math.PI/X[i].length*(j-X[i].length/2+0.5))
					];
		}

		// targeting code

		let firing = new Set();

		for(let s of this.ships){
			for(let m of s.modules){
				if(IS_WEAPON(m.type) &&
					(![CANNON, TURRETD].includes(m.type) || m.state == 1)){
					let targets = [], decoys = [];

					for(let x of this.ships) if(x.team[0] != s.team[0])
						if(_dist(x.pos, s.pos) < RANGE[m.type] && (![DART, ROCKETD].includes(m.type)
							|| [BS, DECOY, REPAIR, ROCKET, TURRET, PHASE, WARP].includes(x.type)))
							if(m.type != ROCKETD || _dist(x.pos, s.pos) > 60){
								if(x.type == DECOY) decoys.push([_dist(x.pos, s.pos), x.uid]);
								else targets.push([_dist(x.pos, s.pos), x.uid]);
							}

					if([DART, ROCKETD].includes(m.type) && targets.length == 0)
						for(let x of this.ships) if(x.type >= SENTINEL && x.type <= BOMBER &&
							_dist(x.pos, s.pos) < RANGE[m.type])
								targets.push([_dist(x.pos, s.pos), x.uid]);

					const orig = m.aux.length ? m.aux[0] : null;

					const oldTargets = m.aux.filter(x => {
						for(let y of targets)
							if(y[1] == x) return true;
						
						return false;
					});

					const oldDecoys = m.aux.filter(x => {
						for(let y of decoys)
							if(y[1] == x) return true;
						
						return false;
					});

					targets.sort((a, b) => a[0]-b[0]);
					decoys.sort((a, b) => a[0]-b[0]);

					targets = targets.filter(x => !m.aux.includes(x[1]));
					decoys = decoys.filter(x => !m.aux.includes(x[1]));

					m.aux = oldDecoys;

					while(m.aux.length < TARGETS[m.type] && decoys.length){
						m.aux.push(decoys[0][1]);
						decoys = decoys.slice(1);
					}

					while(m.aux.length < TARGETS[m.type] && oldTargets.length){
						const R = Math.floor(Math.random()*oldTargets.length);
						m.aux.push(oldTargets.splice(R, 1)[0]);
					}

					while(m.aux.length < TARGETS[m.type] && targets.length){
						m.aux.push(targets[0][1]);
						targets = targets.slice(1);
					}

					if(orig != null && [LASER, COL, CANNON].includes(m.type)
						&& (!m.aux.length || m.aux[0] != orig)){
							m.state = 0;
							m.aux = [];
						}

					if(m.aux.length){
						m.use = true;
						firing.add(s.uid);
					}
				}
			}
		}

		{
			let M = new Map();
			for(let i=0; i<this.ships.length; ++i) M.set(this.ships[i].uid, i);

			let amp = new Array(this.ships.length).fill(1), sol = new Array(this.ships.length).fill(1);

			for(let s of this.ships)
				for(let m of s.modules){
					if(m.type == AMP && m.state < 0 && s.type != WARP){
						for(let x of this.ships) if(_dist(x.pos, s.pos) < RANGE[AMP])
							amp[M.get(x.uid)] = DAMAGE[AMP];
					}
					if(m.type == SUSPEND && m.state < 0){
						for(let x of this.ships) if(_dist(x.pos, s.pos) < RANGE[SUSPEND] && x.team[0] != s.team[0])
							sol[M.get(x.uid)] = DAMAGE[SUSPEND];
					}
				}

			let count = new Array(ROWS*COLS).fill(0);

			for(let s of this.ships) if(s.type == BS)
				++count[Math.floor((s.pos[0]+150*COLS)/300)+COLS*Math.floor((s.pos[1]+150*ROWS)/300)];

			for(let s of this.ships)
				for(let m of s.modules)
					if(m.type == DUEL){
						m.state =
							count[Math.floor((s.pos[0]+150*COLS)/300)+COLS*Math.floor((s.pos[1]+150*ROWS)/300)]
							== 2 ? 1 : 0;
						if(m.state){
							sol[M.get(s.uid)] *= DAMAGE[DUEL];
							if(firing.has(s.uid)) m.use = true;
						}

					}

			for(let s of this.ships) if(!s.emp)
				for(let m of s.modules)
					if(IS_WEAPON(m.type) && (m.type != PULSE || m.state == 1) &&
						(m.type != CANNON || m.state == 1)){
						const D = DAMAGE[m.type] != null ? DAMAGE[m.type] :
							(LASER_DAMAGE[m.type] != null ? LASER_DAMAGE[m.type][
								m.state < 0.6 ? 0 : (m.state < 1 ? 1 : 2)
							] : null);

						if(D != null){
							if(m.type == PULSE){
								for(let x of this.ships)
									if(x.team[0] != s.team[0])
										if(_dist(x.pos, s.pos) < RANGE[PULSE])
											x.hurt(DAMAGE[PULSE]*amp[M.get(s.uid)]*sol[M.get(s.uid)], s.team[1]);

								this.explode([...s.pos], RANGE[PULSE], 9, m.color);
								m.state = 0;

								if(s.type == BOMB) s.hp = 0;

							}else
								for(let x of m.aux) if(M.has(x)){
									this.ships[M.get(x)].hurt(s.dmgBoost*D*amp[M.get(s.uid)]*sol[M.get(s.uid)]/TPS, s.team[1]);
								}
						}
					}
		}

		for(let s of this.ships) if(s.ally != null && s.ally[0] != null)
			if(s.ally[0].modules[s.ally[1]].type != ALLY || s.ally[0].modules[s.ally[1]].aux[0] <= 0
				|| _dist(s.ally[0].pos, s.pos) > RANGE[ALLY] || s.ally[0].imp > 0) s.ally = null;

		for(let s of this.ships) this.updateModules(s);

		let targets = new Array(this.ships.length).fill(0);

		for(let i=0; i<this.ships.length; ++i) for(let m of this.ships[i].modules)
			if(IS_WEAPON(m.type)) targets[i] += m.aux.length;

		for(let i=0; i<this.ships.length; ++i) for(let m of this.ships[i].modules){
			if(m.type == DELTA && this.ships[i].move.length > 0 && m.state == 0.75) m.state = 1;
		}

		for(let s of this.ships) if(s.hp){
			if(!s.move.length){
				if(s.type == DARTP){
					s.hp = -1;
					this.explode(s.pos, RANGE[DARTP], 9, [200, 100, 50]);

					for(let x of this.ships)
						if(x.uid == s.ai)
							if(_dist(x.pos, s.pos) < RANGE[DARTP])
								x.hurt(DAMAGE[DARTP], s.team[1]);
				}

				if(s.type == ROCKETP){
					s.hp = -1;
					this.explode(s.pos, RANGE[ROCKETP], 5, [200, 100, 50]);
					for(let x of this.ships)
						if(x.team[0] != s.team[0])
							if(_dist(x.pos, s.pos) < RANGE[ROCKETP])
								x.hurt(DAMAGE[ROCKETP], s.team[1]);
				}

				if(s.type == STRIKEP){
					s.hp = -1;
					this.explode(s.pos, RANGE[STRIKEP], 7, [200, 100, 50]);
					for(let x of this.ships)
						if(x.team[0] != s.team[0])
							if(_dist(x.pos, s.pos) < RANGE[STRIKEP])
								x.hurt(DAMAGE[STRIKEP], s.team[1]);
				}

				if(s.type == BOMBERP){
					s.hp = -1;
					this.explode(s.pos, RANGE[BOMBERP], 5, [200, 100, 50]);
					for(let x of this.ships)
						if(x.team[0] != s.team[0])
							if(_dist(x.pos, s.pos) < RANGE[BOMBERP])
								x.hurt(DAMAGE[BOMBERP], s.team[1]);
				}

			}
		}

		for(let s of this.ships) if(s.hp == 0){
			if(s.type == STRIKEP){
				this.explode(s.pos, RANGE[STRIKEP], 1, [200, 100, 50]);
				for(let x of this.ships)
					if(x.team[0] != s.team[0])
						if(_dist(x.pos, s.pos) < RANGE[STRIKEP])
							x.hurt(500, s.team[1]);
			}

			if(s.type == ROCKETP){
				this.explode(s.pos, RANGE[ROCKETP], 1, [200, 100, 50]);
				for(let x of this.ships)
					if(x.team[0] != s.team[0])
						if(_dist(x.pos, s.pos) < RANGE[ROCKETP])
							x.hurt(200, s.team[1]);
			}

			if(s.type == BOMBERP){
				this.explode(s.pos, 40, 3, [200, 100, 50]);
				for(let x of this.ships)
					if(x.team[0] != s.team[0])
						if(_dist(x.pos, s.pos) < 40)
							x.hurt(500, s.team[1]);
			}
		}

		for(let i=0; i<ROWS*COLS; ++i)
			if(this.dead[i] > 0 && this.dead[i] != 2){
				this.dead[i] = Math.min(2, this.dead[i]+1/(SECTOR_COLLAPSE_TIME*TPS));
				if(this.dead[i] == 2){
					for(let s of this.ships)
						if(Math.floor((s.pos[0]+150*COLS)/300)+Math.floor((s.pos[1]+150*ROWS)/300)*COLS == i)
							s.hp = 0;
					this.entities.sectorDeath.push([i, this.age+4*TPS]);
				}
			}

		for(let s of this.ships){
			if(s.type >= DECOY && s.type <= REPAIR){
				s.expire = Math.max(0, s.expire-1/(TPS*EXPIRE_TIME[s.type]));
			}

			if(s.type == REPAIR && s.hp == 0){
				for(let x of this.ships) if(x.team[0] == s.team[0] && x.uid != s.uid)
					if(_dist(x.pos, s.pos) < RANGE[REPAIR])
						x.heal(2000);

				this.entities.heal.push([[...s.pos], this.age+2*TPS]);
			}

			if(s.expire == 0){
				s.hp = 0;

				if(s.type == REPAIR){
					for(let x of this.ships) if(x.team[0] == s.team[0] && x.uid != s.uid)
						if(_dist(x.pos, s.pos) < RANGE[REPAIR])
							x.heal(500);

					this.entities.heal.push([[...s.pos], this.age+2*TPS]);
				}
			}
		}

		let COLLAPSING = this.dead.filter(x => x != 0 && x != 2).length != 0;

		{
			// spawn cerberus

			let S = [];

			for(let i=0; i<ROWS*COLS; ++i)
				if(this.dead[i] == 0) S.push(i);

			if(S.length){
				if(this.age % (TPS*5) == 0){
					let COUNT = new Array(BOMBER-SENTINEL+1).fill(0);

					// TODO not futureproof

					for(let s of this.ships)
						if(s.type >= SENTINEL && s.type <= BOMBER)
							++COUNT[s.type-SENTINEL];

					const OPTIMAL = [0.3, 0.5, 0.4, 0.2, 0.001];

					let idx = [];

					for(let i=0; i<BOMBER-SENTINEL+1; ++i) if(COUNT[i] < OPTIMAL[i]*this.aliveCount)
						idx.push(i);

					if(idx.length){
						const I = idx[Math.floor(Math.random()*idx.length)];
						if(SENTINEL+I != COL || !COLLAPSING){
							const X = S[Math.floor(Math.random()*S.length)];
							if(this.sectors[X].length){
								const J = this.sectors[X][Math.floor(Math.random()*this.sectors[X].length)];
								const P = this.rocks[J];

								let val = true;

								for(let x of this.ships) if(x.type == BS){
									if(_dist(P, x.pos) < 200) val = false;
									if(x.move.length && _dist(P, x.move[0].slice(0, 2)) < 200) val = false;
									if(x.tp != null && _dist(P, x.tp.slice(0, 2)) < 200) val = false;
								}
							
								if(val){
									this.addShip(SENTINEL+I, [CERB, CERB.toString()+UID.toString(), null], [SENTINEL+I, SENTINEL+I == COL ? APOCALYPSE : null], [P[0], P[1]-300*ROWS*10], []);
									this.ships[this.ships.length-1].dock = J;
									if(SENTINEL+I != INT) for(let i=0; i<this.sectors.length; ++i)
										if(this.sectors[i].includes(J)) this.ships[this.ships.length-1].ai[1] = i;
								}
							}
						}
					}
				}

				// spawn lone BS

				this.loneBSTimer += 1/(20*TPS);

				if(this.loneBSTimer >= 1){
					this.loneBSTimer = Math.random();

					const OPTIMAL = 0.3;

					if(this.ships.filter(x => x.type == BS).length < OPTIMAL*this.aliveCount){
						//const J = Math.floor(Math.random()*this.rocks.length);
						const X = S[Math.floor(Math.random()*S.length)];
						if(this.sectors[X].length){
							const J = this.sectors[X][Math.floor(Math.random()*this.sectors[X].length)];
							const P = this.rocks[J];

							const MODS = [
								[CANNON, OMEGA, VENG, BOMB],
								[LASER, OMEGA, VENG, BOMB],
								[CANNON, PASSIVE, VENG, DECOY],
								[LASER, PASSIVE, VENG],
								[CANNON, PASSIVE, DUEL, ROCKET],
								[PULSE, OMEGA, FORT, VENG],
								[SPREAD, PASSIVE, DUEL],
								[SPREAD, PASSIVE, FORT, DUEL],
								[CANNON, ALPHA, AMP, BOMB],
								[CANNON, PASSIVE, FORT, PHASE],
								[LASER, PASSIVE, EMP, DECOY],
								[DART, OMEGA, EMP, ROCKET],
								[DART, ALLY, BARRIER, DECOY],
								[DART, ALLY, EMP],
								[CANNON, MIRROR, DUEL],
								[LASER, MIRROR, BARRIER, DECOY],
								[SPREAD, OMEGA, AMP, EMP],
								[SPREAD, ALPHA, VENG, AMP, ROCKET],
								[DART, PASSIVE, EMP, TURRET],
								[LASER, PASSIVE, BARRIER, PHASE],
								[PULSE, OMEGA, EMP, FORT],
							];

							const I = Math.floor(Math.random()*MODS.length);

							let val = true;

							for(let x of this.ships) if(x.type == BS){
								if(_dist(P, x.pos) < 200) val = false;
								if(x.move.length && _dist(P, x.move[0].slice(0, 2)) < 200) val = false;
								if(x.tp != null && _dist(P, x.tp.slice(0, 2)) < 200) val = false;
							}
							
							if(val){
								const U = ++UID;
								this.addShip(BS, [-U, -U, null], MODS[I], [P[0], P[1]+300*ROWS*10], []);
								this.ships[this.ships.length-1].dock = J;
							}
						}
					}
				}
			}
		};

		if(this.ships.filter(x => x.hp == 0 && x.type == COL && x.kill != null).length){
			//const REM = Math.min(this.aliveCount, Math.max(3, Math.ceil(this.aliveCount*0.2)));
			const REM = 5; // let's keep this simple

			for(let i=0; i<REM; ++i){
				const I = this.pickDyingSector();
				--this.aliveCount;
				this.dead[I] = 1;
			}

			for(let s of this.ships) if(s.type == COL) s.hp = 0;
		}

		let q = [];

		{
			let leave = new Set(), elim = [], surr = [];

			for(let s of this.ships){
				if(s.hp > 0) q.push(s.encode());
				else if([BS, DECOY, REPAIR, ROCKET, TURRET, PHASE, WARP, COL].includes(s.type)){
					this.die(s.pos);
					if(s.type == BS && !Number.isInteger(s.team[0])){
						leave.add(s.team[0]);
						if(s.hp == 0) elim.push([s.team[2], this.age + TPS*3]);
						else surr.push([s.team[2], this.age + TPS*3]);
					}

				}

				if(s.hp <= 0 && s.kill != null && [SENTINEL, GUARD, INT, COL, BOMBER, BS].includes(s.type)){
					if(s.type != BS || Number.isInteger(s.team[0]))
						for(let x of this.ships)
							if(x.team[1] == s.kill && x.type == BS && !Number.isInteger(s.kill)){
								if(s.type == BS) x.heal(ROGUE_BS_HEAL_AMT);
								else if(Math.random() > ([0.8, 0.5, 0.4, 0, 0])[s.type-SENTINEL] && Math.random() > x.arts.size/MAX_ARTS){
									const I = Math.floor(Math.random()*Artifacts.types.length);
									if(!x.seenArts.has(I)) for(let y of this.players) if(y.id == x.team[1]){
										x.seenArts.add(I);
										y.emit("artifact", x.uid, I);
									}
								}
						}
				}

				if(s.ally != null && s.ally[0] != null && s.ally[0].hp <= 0) s.ally = null;
			}

			this.ships = this.ships.filter(x => x.hp > 0);

			let alive = new Set(this.ships.filter(x => x.type == BS && !Number.isInteger(x.team[0])).map(x => x.team[0]));

			if(alive.size){
				this.entities.eliminate.push(...elim);
				this.entities.surrender.push(...surr);
			}

			let off = false;  // are any teams totally eliminated?

			for(let x of leave) if(!alive.has(x)) off = true;

			if(off){
				const Z = this.ships.filter(x => x.type == BS && !Number.isInteger(x.team[0]))
				const Y = new Set(Z.map(x => x.team[0]));
				if(Z.length == 1) this.entities.win.push([Z[0].team[2], this.age + TPS*3]);
			}
		};

		for(let k of Object.keys(this.entities))
			this.entities[k] = this.entities[k].filter(x => x[x.length-1] >= this.age);

		for(let p of this.players) p.emit("state", {s: q, entities: this.entities, dead: this.dead, age: this.age, speed: this.speed});

		for(let s of this.ships) s.hit = false;

		++this.age;
	}

	activateArtifact(shipID, type){
		for(let s of this.ships) if(s.uid == shipID){
			if(Artifacts.types[type] != null){
				s.arts.add(type);
				Artifacts.types[type][3](s, this);
			}
		}
	}

	pickDyingSector(){
		let candidate = [];
		for(let i=0; i<ROWS*COLS; ++i) if(this.dead[i] == 0) candidate.push(i);

		if(candidate.length == 1) return candidate[0];

		while(candidate.length){
			const I = candidate.splice(Math.floor(Math.random()*candidate.length), 1);

			let root = new Array(ROWS*COLS).fill(-1);

			function find(i){
				if(root[i] < 0) return i;
				root[i] = find(root[i]);
				return root[i];
			}

			function merge(a, b){
				a = find(a); b = find(b);
				if(a == b) return;
				if(root[a] < root[b]) { root[a] += root[b]; root[b] = a; }
				else { root[b] += root[a]; root[a] = b; }
			}

			this.dead[I] = 1;

			for(let i=0; i<ROWS; ++i)
				for(let j=0; j<COLS-1; ++j)
					if(this.dead[i*COLS+j] == 0 && this.dead[i*COLS+j+1] == 0)
						merge(i*COLS+j, i*COLS+j+1);

			for(let i=0; i<COLS; ++i)
				for(let j=0; j<ROWS-1; ++j)
					if(this.dead[j*COLS+i] == 0 && this.dead[j*COLS+i+COLS] == 0)
						merge(j*COLS+i, j*COLS+i+COLS);

			this.dead[I] = 0;

			if(root[find(candidate[0])] == -(this.aliveCount-1)) return I;
		}

		return null;
	}

	end(){
		for(let p of this.players) p.emit("end");
	}

	alive(){
		let S = new Set();
		for(let p of this.players) S.add(p.id);
		return this.ships.filter(x => x.type == BS && !Number.isInteger(x.team[0])).length > 0;
	}
}

module.exports = { Ship, Game, COLS, ROWS, TPS, normalModule };
