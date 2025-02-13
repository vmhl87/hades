const SECTOR_COLLAPSE_TIME = 40;

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

let NAME = new Array(ct), HP = new Array(ct), RANGE = new Array(ct).fill(null),
	TIME = new Array(ct);

TIME[ALPHA] = 6;
TIME[IMPULSE] = 45;
TIME[OMEGA] = 45;
TIME[MIRROR] = 45;
TIME[ALLY] = 45;

TIME[BARRIER] = 11;
TIME[AMP] = 30;

NAME[BS] = "BATTLESHIP";
NAME[SENTINEL] = "CERBERUS SENTINEL";
NAME[GUARD] = "CERBERUS GUARDIAN";
NAME[INT] = "CERBERUS INTERCEPTOR";
NAME[COL] = "CERBERUS COLOSSUS";
NAME[DARTP] = "DART ROCKET";
NAME[ROCKETP] = "DRONE ROCKET";
NAME[DELTAP] = "DELTA ROCKET";
NAME[DECOY] = "DECOY DRONE";
NAME[REPAIR] = "REPAIR DRONE";
NAME[ROCKET] = "ROCKET DRONE";
NAME[TURRET] = "LASER TURRET";

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
HP[ROCKETP] = 400;
HP[DELTAP] = 180;

for(let i=LASER; i<=LASER2; ++i) RANGE[i] = 80;
RANGE[DART] = 100;
RANGE[ROCKETD] = 400;
RANGE[TURRETD] = 80;
for(let i=SENTINEL; i<=COL; ++i) RANGE[i] = 80;

function weaponRange(T){
	if(T >= LASER && T <= TURRETD) return RANGE[T];
	if(T >= SENTINEL && T <= COL) return RANGE[T];
	return null;
}

RANGE[IMPULSE] = 55;
RANGE[MIRROR] = 90;
RANGE[ALLY] = 90;

RANGE[EMP] = 80;
RANGE[TP] = 400;
RANGE[AMP] = 100;
RANGE[DESTINY] = 65;
RANGE[BARRIER] = 100;
RANGE[DISRUPT] = 70;
RANGE[VENG] = 160;
RANGE[DECOY] = 250;
RANGE[REPAIR] = 200;
RANGE[ROCKET] = 250;

RANGE[RIPPLE] = 300;

RANGE[DARTP] = 40;
RANGE[ROCKETP] = 70;
RANGE[DELTAP] = 70;

const LOCMOD = [DECOY, REPAIR, ROCKET, TP, DELTA, RIPPLE];
