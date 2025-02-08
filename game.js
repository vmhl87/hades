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
	ACTIVATED = new Array(ct), RANGE = new Array(ct),
	EXPIRE_TIME = new Array(ct), TARGETS = new Array(ct),
	DAMAGE = new Array(ct), LASER_DAMAGE = new Array(ct),
	STRENGTH = new Array(ct);

STRENGTH[IMPULSE] = 2250;
STRENGTH[PASSIVE] = 3500;
STRENGTH[OMEGA] = 4500;
STRENGTH[MIRROR] = 1000;
STRENGTH[ALLY] = 600;

DAMAGE[BATTERY] = 284;
DAMAGE[MASS] = 210;
DAMAGE[SENTINEL] = 200;
DAMAGE[GUARD] = 50;
DAMAGE[INT] = 90;
DAMAGE[TURRETD] = 150;

DAMAGE[BARRIER] = 3000;
DAMAGE[SOL] = 1.5;
DAMAGE[AMP] = 2.2;
DAMAGE[MIRROR] = 3;

LASER_DAMAGE[LASER] = [160, 292, 584];
LASER_DAMAGE[LASER2] = [184, 312, 800];
LASER_DAMAGE[COL] = [60, 150, 500];

EXPIRE_TIME[DECOY] = 40;
EXPIRE_TIME[REPAIR] = 40;
EXPIRE_TIME[ROCKET] = 40;
EXPIRE_TIME[TURRET] = 40;

RECHARGE_TIME[TURRETD] = 5;

EFFECT_TIME[BATTERY] = 0;
RECHARGE_TIME[BATTERY] = 2;

EFFECT_TIME[DART] = 0;
RECHARGE_TIME[DART] = 10;

EFFECT_TIME[ROCKETD] = 0;
RECHARGE_TIME[ROCKETD] = 15;

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

EFFECT_TIME[RIPPLE] = 0;
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

// SHIELD

EFFECT_TIME[ALPHA] = 8;
RECHARGE_TIME[ALPHA] = 60;

EFFECT_TIME[IMPULSE] = 45;
RECHARGE_TIME[IMPULSE] = 60;

EFFECT_TIME[OMEGA] = 45;
RECHARGE_TIME[OMEGA] = 60;

EFFECT_TIME[MIRROR] = 45;
RECHARGE_TIME[MIRROR] = 60;

EFFECT_TIME[MIRROR] = 45;
RECHARGE_TIME[MIRROR] = 60;

EFFECT_TIME[ALLY] = 45;
RECHARGE_TIME[ALLY] = 60;

ACTIVATED[ALPHA] = true;
ACTIVATED[IMPULSE] = true;
for(let i=OMEGA; i<=ALLY; ++i)
	ACTIVATED[i] = true;

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
RANGE[BARRIER] = 100;
RANGE[DARTP] = 40;
RANGE[ROCKETP] = 70;
RANGE[DELTAP] = 70;

RANGE[REPAIR] = 60;
RANGE[EMP] = 80;
RANGE[AMP] = 100;
RANGE[MIRROR] = 90;

for(let i=LASER; i<=LASER2; ++i) RANGE[i] = 80;
RANGE[DART] = 100;
RANGE[ROCKETD] = 400;
RANGE[TURRETD] = 80;
for(let i=SENTINEL; i<=COL; ++i) RANGE[i] = 80;

TARGETS[LASER] = 1;
TARGETS[BATTERY] = 1;
TARGETS[MASS] = 3;
TARGETS[LASER2] = 2;
TARGETS[DART] = 1;
TARGETS[ROCKETD] = 1;
TARGETS[TURRETD] = 3;
TARGETS[SENTINEL] = 1;
TARGETS[GUARD] = 1;
TARGETS[INT] = 4;
TARGETS[COL] = 1;

const LASER_CHARGE = new Array(ct);

LASER_CHARGE[LASER] = [6, 10];
LASER_CHARGE[LASER2] = [3, 6];
LASER_CHARGE[COL] = [10, 20];

const PASSIVE_DELAY = 6, PASSIVE_TIME = 48;

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
		this.expire = 1;
		this.emp = 0;

		for(let m of this.modules){
			if(m.type >= LASER && m.type <= TURRETD)
				m.aux = [];

			else if(m.type == PASSIVE)
				m.aux = [1, 1];

			else if(m.type >= ALPHA && m.type <= ALLY)
				m.aux = [0, 0];

			if(m.type == MIRROR)
				m.blast = [0, 0];

			if(m.type == TURRETD)
				m.state = 0;
		}
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
			uid: this.uid,
			expire: this.expire,
			emp: this.emp,
		};
	}
	
	hurt(x){
		let dmg = x;

		// TODO make mirror and ally functional

		for(let m of this.modules) if(dmg && m.type >= ALPHA && m.type <= MIRROR && m.aux[0]){
			if(m.type == ALPHA) return;

			if(m.type == PASSIVE) m.aux[1] = 0;

			const rem = Math.min(Math.ceil(m.aux[0]*STRENGTH[m.type]), dmg);

			if(m.type == MIRROR){
				m.blast[0] += rem;
				if(m.blast[1] == 0) m.blast[1] = 5;
			}

			m.aux[0] = Math.max(0, m.aux[0]-rem/STRENGTH[m.type]);
			dmg -= rem;
		}

		if(dmg) this.hp = Math.max(0, this.hp-dmg);
	}

	heal(x){
		this.hp = Math.min(HP[this.type], this.hp+x);
	}

	travel(){
		if(this.type == TURRET){
			this.move = [];
			this.wait = null;
			this.dock = null;
			return;
		}

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
				this.pos = move.slice(0, 2);
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
		const T = this.ships[s].modules[dat.i].type;

		if(ACTIVATED[T]){
			if(T >= ALPHA && T <= ALLY)
				this.ships[s].modules[dat.i].aux = [1, 1];

			this.ships[s].modules[dat.i].state = -1;
		}

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
		}

		if(T == EMP){
			for(let x of this.ships)
				if(x.team != this.ships[s].team)
					if(_dist(x.pos, this.ships[s].pos) < RANGE[EMP])
						x.emp = 1;

			this.ev.push(["emp", [...this.ships[s].pos]]);
		}

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
			}
		}
	}

	explode(pos, range, str){
		this.ev.push(["explode", [[...pos], range, str]]);
	}

	die(pos){
		this.ev.push(["die", pos]);
	}

	updateModules(s){
		for(let i=0; i<s.modules.length; ++i){
			const T = s.modules[i].type;

			if(EFFECT_TIME[T] != null){
				if(s.modules[i].state < 0)
					s.modules[i].state = Math.min(0, s.modules[i].state+1/(1+EFFECT_TIME[T]*4));
				else if(s.modules[i].state != 1){
					if(T >= ALPHA && T <= ALLY)
						s.modules[i].state = Math.min(1, s.modules[i].state+1/(RECHARGE_TIME[T]*4));
					else s.modules[i].state = Math.min(1, s.modules[i].state+1/((RECHARGE_TIME[T]-EFFECT_TIME[T])*4));
				}

				if(s.modules[i].state == 0 && T >= ALPHA && T <= ALLY)
					s.modules[i].state = EFFECT_TIME[T]/RECHARGE_TIME[T];
			}

			if(T == TURRETD)
				s.modules[i].state = Math.min(1, s.modules[i].state+1/(RECHARGE_TIME[T]*4));

			const S = s.modules[i].state;

			if(T == TP && S == 0){
				s.pos = s.tp.slice(0, 2);
				s.dock = s.tp[2];
				s.tp = null;

				for(let x of this.ships) if(x.team != s.team)
					for(let m of x.modules) if(m.type == BARRIER && m.state < 0)
						s.hurt(DAMAGE[BARRIER]);
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

			if([LASER, LASER2, COL].includes(T)){
				const A = s.modules[i].aux.length;

				if(A == 0) s.modules[i].state = 0;
				else if(A == TARGETS[T]){
					s.modules[i].state = Math.max(0.3, s.modules[i].state);

					if(!s.emp){
						if(s.modules[i].state < 0.6)
							s.modules[i].state += 0.3/(4*LASER_CHARGE[T][0]);
						else s.modules[i].state = Math.min(1,
							s.modules[i].state+0.4/(4*(LASER_CHARGE[T][1]-LASER_CHARGE[T][0])));
					}

				}else s.modules[i].state = 0.3;
			}

			if(T == DART){
				if(s.modules[i].aux.length){
					if(S == 1){
						let I = null;

						for(let j=0; j<this.ships.length; ++j)
							if(this.ships[j].uid == s.modules[i].aux[0])
								I = j;

						if(I != null){
							this.addShip(DARTP, s.team, [], [...s.pos], [[...this.ships[I].pos,
								this.ships[I].move.length ? null : this.ships[I].dock]]);
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

			if(T == PASSIVE){
				s.modules[i].aux[1] = Math.min(1, s.modules[i].aux[1]+1/(4*PASSIVE_DELAY));

				if(s.modules[i].aux[1] == 1)
					s.modules[i].aux[0] = Math.min(1, s.modules[i].aux[0]+1/(4*PASSIVE_TIME));

			}else if(T >= ALPHA && T <= ALLY){
				if(s.modules[i].aux[0] <= 0) s.modules[i].aux[1] = 0;
				s.modules[i].aux[1] = Math.max(0, s.modules[i].aux[1]-1/(4*EFFECT_TIME[T]));
				if(!s.modules[i].aux[1]) s.modules[i].aux[0] = 0;
			}

			if(T == MIRROR){
				if(s.modules[i].blast[0] > 0){
					for(let x of this.ships)
						if(x.team != s.team)
							if(_dist(x.pos, s.pos) < RANGE[MIRROR])
								x.hurt(s.modules[i].blast[0]*DAMAGE[MIRROR]);

					s.modules[i].blast[0] = 0;
				}

				if(s.modules[i].blast[1] && --s.modules[i].blast[1] == 1)
					this.explode([...s.pos], RANGE[MIRROR], 3);
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
		for(let s of this.ships) s.emp = Math.max(0, s.emp - 1/(4*EFFECT_TIME[EMP]));

		let locked = new Set();

		for(let s of this.ships) for(let m of s.modules)
			if(m.type == BARRIER && m.state < 0)
				for(let x of this.ships) if(x.team != s.team && x.type != DELTAP)
					if(_dist(x.pos, s.pos) < RANGE[BARRIER])
						locked.add(x.uid);

		for(let s of this.ships) if(!s.emp && !locked.has(s.uid)) s.travel();

		{
			let X = new Array(this.rocks.length);
			for(let i=0; i<this.rocks.length; ++i)
				X[i] = [];

			for(let i=0; i<this.ships.length; ++i)
				if(!this.ships[i].move.length && this.ships[i].dock != null && this.ships[i].tp == null
					&& ![ROCKETP, DARTP, DELTAP].includes(this.ships[i].type))
					X[this.ships[i].dock].push(i);

			for(let i=0; i<this.rocks.length; ++i)
				for(let j=0; j<X[i].length; ++j)
					this.ships[X[i][j]].pos = [
						this.rocks[i][0]-10*Math.sin(2*Math.PI/X[i].length*(j-X[i].length/2+0.5)),
						this.rocks[i][1]+10*Math.cos(2*Math.PI/X[i].length*(j-X[i].length/2+0.5))
					];
		}

		for(let s of this.ships){
			for(let m of s.modules){
				if(m.type >= LASER && m.type <= TURRETD &&
					(![BATTERY, TURRETD].includes(m.type) || m.state == 1)){
					let targets = [], decoys = [];

					for(let x of this.ships) if(x.team != s.team)
						if(_dist(x.pos, s.pos) < RANGE[m.type] && (![DART, ROCKETP].includes(m.type)
							|| [BS, DECOY, REPAIR, ROCKET, TURRET].includes(x.type)))
							if(m.type != ROCKETD || _dist(x.pos, s.pos) > 60){
								if(x.type == DECOY) decoys.push([_dist(x.pos, s.pos), x.uid]);
								else targets.push([_dist(x.pos, s.pos), x.uid]);
							}

					const orig = m.aux.length ? m.aux[0] : null;

					m.aux = m.aux.filter(x => {
						for(let y of targets)
							if(y[1] == x) return true;

						for(let y of decoys)
							if(y[1] == x) return true;
						
						return false;
					});

					targets.sort((a, b) => a[0]-b[0]);
					decoys.sort((a, b) => a[0]-b[0]);

					targets = targets.filter(x => !m.aux.includes(x[1]));
					decoys = decoys.filter(x => !m.aux.includes(x[1]));

					let old = [...m.aux];
					m.aux = [];

					for(let i=0; i<Math.min(decoys.length, TARGETS[m.type]); ++i)
						m.aux.push(decoys[i][1]);

					while(m.aux.length < TARGETS[m.type] && old.length){
						const R = Math.floor(Math.random()*old.length);
						m.aux.push(old.splice(R, 1)[0]);
					}

					while(m.aux.length < TARGETS[m.type] && targets.length){
						m.aux.push(targets[0][1]);
						targets = targets.slice(1);
					}

				if(orig != null && [LASER, COL, BATTERY].includes(m.type)
					&& (!m.aux.length || m.aux[0] != orig)){
						m.state = 0;
						m.aux = [];
					}
				}
			}
		}

		{
			let M = new Map();
			for(let i=0; i<this.ships.length; ++i) M.set(this.ships[i].uid, i);

			let amp = new Array(this.ships.length).fill(1), sol = new Array(this.ships.length).fill(1);

			for(let s of this.ships)
				for(let m of s.modules) if(m.type == AMP && m.state < 0){
					for(let x of this.ships) if(_dist(x.pos, s.pos) < RANGE[AMP])
						amp[M.get(x.uid)] = DAMAGE[AMP];
				}

			let count = new Array(ROWS*COLS).fill(0);

			for(let s of this.ships) if(s.type == BS)
				++count[Math.floor((s.pos[0]+150*COLS)/300)+COLS*Math.floor((s.pos[1]+150*ROWS)/300)];

			for(let s of this.ships)
				for(let m of s.modules)
					if(m.type == SOL){
						m.state =
							count[Math.floor((s.pos[0]+150*COLS)/300)+COLS*Math.floor((s.pos[1]+150*ROWS)/300)]
							== 2 ? 1 : 0;
						// TODO this switches off multi-sol tactic
						//if(m.state) sol[M.get(s.uid)] = DAMAGE[SOL];
						if(m.state) sol[M.get(s.uid)] *= DAMAGE[SOL];
					}

			for(let s of this.ships) if(!s.emp)
				for(let m of s.modules)
					if(m.type >= LASER && m.type <= TURRETD &&
						(m.type != BATTERY || m.state == 1)){
						const D = DAMAGE[m.type] != null ? DAMAGE[m.type] :
							(LASER_DAMAGE[m.type] != null ? LASER_DAMAGE[m.type][
								m.state < 0.6 ? 0 : (m.state < 1 ? 1 : 2)
							] : null);

						if(D != null)
							for(let x of m.aux) if(M.has(x)){
								this.ships[M.get(x)].hurt(D*amp[M.get(s.uid)]*sol[M.get(s.uid)]/4);
							}
					}
		}

		for(let s of this.ships) this.updateModules(s);

		for(let s of this.ships) if(s.hp){
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
								x.hurt(1000);
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

			if(s.type == ROCKETP){
				this.explode(s.pos, RANGE[ROCKETP], 1);
				for(let x of this.ships)
					if(x.team != s.team)
						if(_dist(x.pos, s.pos) < RANGE[ROCKETP])
							x.hurt(200);
			}
		}

		for(let s of this.ships){
			if(s.type >= DECOY && s.type <= TURRET){
				s.expire = Math.max(0, s.expire-1/(4*EXPIRE_TIME[s.type]));
			}

			if(s.type == REPAIR && s.hp == 0){
				for(let x of this.ships) if(x.team == s.team && x.uid != s.uid)
					if(_dist(x.pos, s.pos) < RANGE[REPAIR])
						x.heal(2500);

				this.ev.push(["heal", [...s.pos]]);
			}

			if(s.expire == 0){
				s.hp = 0;

				if(s.type == REPAIR){
					for(let x of this.ships) if(x.team == s.team && x.uid != s.uid)
						if(_dist(x.pos, s.pos) < RANGE[REPAIR])
							x.heal(500);

					this.ev.push(["heal", [...s.pos]]);
				}
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

	alive(){
		let S = new Set();
		for(let p of this.players) S.add(p.id);
		return this.ships.filter(x => x.type == BS && S.has(x.team)).length > 0;
	}
}

module.exports = { Ship, Game, COLS, ROWS };
