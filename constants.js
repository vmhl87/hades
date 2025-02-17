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

/* UNOBTAIN */ const VENG = ++ct, SECT = ++ct;

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
NAME[DARTP] = "ROCKET";
NAME[ROCKETP] = "DRONE ROCKET";
NAME[DELTAP] = "DELTA ROCKET";
NAME[DECOY] = "DECOY DRONE";
NAME[REPAIR] = "REPAIR DRONE";
NAME[ROCKET] = "ROCKET DRONE";
NAME[TURRET] = "TURRET DRONE";

HP[BS] = 7000;
HP[SENTINEL] = 600;
HP[GUARD] = 5600;
HP[INT] = 4500;
HP[COL] = 15000;
HP[DECOY] = 1000;
HP[REPAIR] = 1000;
HP[ROCKET] = 600;
HP[TURRET] = 1500;
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

const CERB = 3.14;

let INFO = new Array(ct);

INFO[LASER] = "A single-target weapon that increases in damage the longer it fires. Damage resets when the weapon switches targets.";
INFO[BATTERY] = "A single-target weapon that deals high damage to one enemy. Two second delay when switching targets.";
INFO[MASS] = "A multi-target weapon that deals constant damage to three enemies within range.";
INFO[LASER2] = "A multi-target weapon that deals damage to two enemies within range. Damage increases while both beams are active, and resets when there are less than two enemies in range.";
INFO[DART] = "A single-target weapon that periodically launches powerful rockets towards enemies in range. Projectiles deal damage in a large area when they reach their destination.";

INFO[ROCKETD] = "A single-target weapon that periodically launches rockets towards enemies in range. Projectiles deal a small amount of damage if destroyed before they reach their destination.";

INFO[SENTINEL] = "A single-target weapon that deals high damage to one enemy.";
INFO[GUARD] = "A single-target weapon that deals low damage to one enemy.";
INFO[INT] = "A multi-target weapon that deals damage to four enemies within range.";
INFO[COL] = "A single-target weapon that slowly increases in damage the longer it fires. Damage resets with the weapon switches targets.";

INFO[ALPHA] = "A shield that absorbs all damage taken for a short period of time.";
INFO[IMPULSE] = "A weak shield that increases the speed of the Battleship and applies constant damage to enemies within range. This effect ends after a short time, or when the Battleship stops moving. Can only be activated while in motion.";
INFO[PASSIVE] = "A shield that is always active and regenerates strength slowly over time.";
INFO[OMEGA] = "A powerful shield that absorbs damage until it is depleted or its activation timer runs out.";
INFO[MIRROR] = "A weak shield that reflects and multiplies damage until it is depleted.";
INFO[ALLY] = "A weak shield that absorbs damage taken by any allied drone or rocket within range. The Battleship itself is not covered by this shield.";

INFO[EMP] = "Disables all enemy vessels within range for a short period of time. Disabled Battleships cannot move or fire, but can activate Modules.";
INFO[SOL] = "Increases weapon damage when there is exactly one enemy Battleship in the sector.";
INFO[FORT] = "Locks the Battleship in place and reduces incoming damage for a short period of time.";
INFO[TP] = "After a short delay, the Battleship instantaneously moves to a selected location within range.";
INFO[AMP] = "Massively increases weapon damage for all ships in range.";
INFO[DESTINY] = "After a short delay, the Battleship applies massive blast damage to all enemy ships in range and then teleports away to a randomly selected adjacent sector.";
INFO[BARRIER] = "Prevents enemy ships, drones, and most rockets within range from moving. Enemy ships which teleport into or out of the field take damage.";
INFO[DELTA] = "A fast rocket that deals high damage to enemy vessels within range. Can pass through Barrier. A small amount of damage is applied if the rocket is destroyed before reaching its destination.";
INFO[RIPPLE] = "Instantaneously swaps the Battleship with an allied drone, rocket, or Cerberus ship within range.";
INFO[DISRUPT] = "Nullifies all shields within range for a short time. Additionally, all enemy Teleport countdowns cancel when this module is activated.";

INFO[VENG] = "When the Battleship's health falls below a critical threshold, this Module begins an activation countdown. When the countdown finishes, a massive explosion deals damage to all enemies within a large range.";

INFO[SECT] = "When the ship's health reaches zero, all vessels equipped with APOCALYPSE warp out of the system, and sector collapse initiates. After a countdown, one to five sectors implode, instantly destroying all vessels within them. The resulting sectors eal constant damage to any ships within them for the rest of the round.";

INFO[DECOY] = "A drone that attracts fire. All enemy ships within range will immediately switch target to Decoy drones within range.";
INFO[REPAIR] = "A drone that once destroyed repairs allied ships within range by a high amount. If the drone's lifetime expires without being destroyed, it repairs nearby allies by a small amount.";
INFO[ROCKET] = "A drone that periodically fires rockets at enemy vessels within range.";
INFO[TURRET] = "A drone that after a small setup time applies constant damage to three enemies within range.";

let MODULE_NAME = new Array(ct);

MODULE_NAME[LASER] = "LASER";
MODULE_NAME[BATTERY] = "CANNON";
MODULE_NAME[MASS] = "SPREAD CANNON";
MODULE_NAME[LASER2] = "DUAL LASER";
MODULE_NAME[DART] = "ROCKET LAUNCHER";

MODULE_NAME[ROCKETD] = "ROCKET LAUNCHER";

MODULE_NAME[SENTINEL] = "CANNON";
MODULE_NAME[GUARD] = "WEAK CANNON";
MODULE_NAME[INT] = "SPREAD CANNON";
MODULE_NAME[COL] = "LASER";

MODULE_NAME[ALPHA] = "ALPHA SHIELD";
MODULE_NAME[IMPULSE] = "DELTA SHIELD";
MODULE_NAME[PASSIVE] = "PASSIVE SHIELD";
MODULE_NAME[OMEGA] = "OMEGA SHIELD";
MODULE_NAME[MIRROR] = "MIRROR SHIELD";
MODULE_NAME[ALLY] = "ALLY SHIELD";

MODULE_NAME[EMP] = "EMP";
MODULE_NAME[SOL] = "SOLITUDE";
MODULE_NAME[FORT] = "FORTIFY";
MODULE_NAME[TP] = "TELEPORT";
MODULE_NAME[AMP] = "WEAPON AMPLIFIER";
MODULE_NAME[DESTINY] = "DESTINY";
MODULE_NAME[BARRIER] = "BARRIER";
MODULE_NAME[DELTA] = "DELTA ROCKET";
MODULE_NAME[RIPPLE] = "SWAP";
MODULE_NAME[DISRUPT] = "DISRUPT";

MODULE_NAME[VENG] = "VENGEANCE";

MODULE_NAME[SECT] = "APOCALYPSE";

MODULE_NAME[DECOY] = "DECOY DRONE";
MODULE_NAME[REPAIR] = "REPAIR DRONE";
MODULE_NAME[ROCKET] = "ROCKET DRONE";
MODULE_NAME[TURRET] = "TURRET DRONE";
