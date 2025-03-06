const SECTOR_COLLAPSE_TIME = 40, TPS = 4;

let ct = 0;

// SHIP TYPES

const BS = ++ct, SENTINEL = ++ct, GUARD = ++ct, INT = ++ct, COL = ++ct, BOMBER = ++ct;

const DARTP = ++ct, ROCKETP = ++ct, STRIKEP = ++ct, BOMBERP = ++ct;

// DRONE TYPES

const DECOY = ++ct, ROCKET = ++ct, TURRET = ++ct, PHASE = ++ct, WARP = ++ct, REPAIR = ++ct;

// WEAPON TYPES

const LASER = ++ct, CANNON = ++ct, SPREAD = ++ct, LASER2 = ++ct, DART = ++ct;

/* UNOBTAIN */ const TURRETD = ++ct, ROCKETD = ++ct;

// SHIELD TYPES

const ALPHA = ++ct, DELTA = ++ct, OMEGA = ++ct, PASSIVE = ++ct, MIRROR = ++ct, ALLY = ++ct;

// MODULE TYPES

const EMP = ++ct, DUEL = ++ct, FORT = ++ct, TP = ++ct, AMP = ++ct, LEAP = ++ct, BARRIER = ++ct, STRIKE = ++ct, RIPPLE = ++ct, DISRUPT = ++ct;

/* UNOBTAIN */ const SUSPEND = ++ct, VENG = ++ct, APOCALYPSE = ++ct;

const NULL = 2.71, DEV = 1.618;

let NAME = new Array(ct), HP = new Array(ct), RANGE = new Array(ct).fill(null),
	TIME = new Array(ct), ACTIVATED = new Array(ct), EFFECT_TIME = new Array(ct),
	RECHARGE_TIME = new Array(ct);

TIME[ALPHA] = 6;
TIME[DELTA] = 45;
TIME[OMEGA] = 45;
TIME[MIRROR] = 45;
TIME[ALLY] = 45;

TIME[BARRIER] = 11;
TIME[AMP] = 30;
TIME[SUSPEND] = 30;

NAME[BS] = "BATTLESHIP";
NAME[SENTINEL] = "CERBERUS SENTINEL";
NAME[GUARD] = "CERBERUS GUARDIAN";
NAME[INT] = "CERBERUS INTERCEPTOR";
NAME[COL] = "CERBERUS COLOSSUS";
NAME[BOMBER] = "CERBERUS BOMBER";
NAME[DARTP] = "ROCKET";
NAME[ROCKETP] = "DRONE ROCKET";
NAME[STRIKEP] = "STRIKE ROCKET";
NAME[BOMBERP] = "BOMBER ROCKET";
NAME[DECOY] = "DECOY DRONE";
NAME[REPAIR] = "REPAIR DRONE";
NAME[ROCKET] = "ROCKET DRONE";
NAME[TURRET] = "TURRET DRONE";
NAME[PHASE] = "PHASE DRONE";
NAME[WARP] = "WARP DRONES";

HP[BS] = 7000;
HP[SENTINEL] = 1200;
HP[GUARD] = 8000;
HP[INT] = 9000;
HP[COL] = 20000;
HP[BOMBER] = 16000;
HP[DECOY] = 1000;
HP[REPAIR] = 1000;
HP[ROCKET] = 600;
HP[TURRET] = 1500;
HP[PHASE] = 1000;
HP[WARP] = 900;
HP[DARTP] = 250;
HP[ROCKETP] = 400;
HP[STRIKEP] = 180;
HP[BOMBERP] = 900;

for(let i=LASER; i<=LASER2; ++i) RANGE[i] = 80;
RANGE[DART] = 100;
RANGE[ROCKETD] = 400;
RANGE[TURRETD] = 130;
for(let i=SENTINEL; i<=COL; ++i) RANGE[i] = 80;

function weaponRange(T){
	if(T >= LASER && T <= ROCKETD) return RANGE[T];
	if(T >= SENTINEL && T <= COL) return RANGE[T];
	return null;
}

RANGE[DELTA] = 55;
RANGE[MIRROR] = 90;
RANGE[ALLY] = 140;

RANGE[EMP] = 80;
RANGE[TP] = 400;
RANGE[AMP] = 100;
RANGE[LEAP] = 65;
RANGE[BARRIER] = 100;
RANGE[DISRUPT] = 70;
RANGE[VENG] = 160;
RANGE[SUSPEND] = 150;
RANGE[PHASE] = 150;
RANGE[DECOY] = 250;
RANGE[REPAIR] = 200;
RANGE[ROCKET] = 250;
RANGE[TURRET] = 130;
RANGE[WARP] = 400;

RANGE[RIPPLE] = 300;

RANGE[DARTP] = 40;
RANGE[ROCKETP] = 70;
RANGE[STRIKEP] = 70;
RANGE[BOMBERP] = 100;

ACTIVATED[ALPHA] = true;
ACTIVATED[DELTA] = true;
ACTIVATED[OMEGA] = true;
ACTIVATED[MIRROR] = true;
ACTIVATED[ALLY] = true;

ACTIVATED[EMP] = true;
ACTIVATED[FORT] = true;
ACTIVATED[TP] = true;
ACTIVATED[AMP] = true;
ACTIVATED[LEAP] = true;
ACTIVATED[BARRIER] = true;
ACTIVATED[STRIKE] = true;
ACTIVATED[RIPPLE] = true;
ACTIVATED[DISRUPT] = true;
ACTIVATED[SUSPEND] = true;

ACTIVATED[DECOY] = true;
ACTIVATED[REPAIR] = true;
ACTIVATED[ROCKET] = true;
ACTIVATED[TURRET] = true;
ACTIVATED[PHASE] = true;
ACTIVATED[WARP] = true;

EFFECT_TIME[DART] = 0;
RECHARGE_TIME[DART] = 10;

EFFECT_TIME[ROCKETD] = 0;
RECHARGE_TIME[ROCKETD] = 12;

EFFECT_TIME[BOMBER] = 0;
RECHARGE_TIME[BOMBER] = 24;

EFFECT_TIME[EMP] = 6;
RECHARGE_TIME[EMP] = 45;

EFFECT_TIME[FORT] = 10;
RECHARGE_TIME[FORT] = 30;

EFFECT_TIME[TP] = 3;
RECHARGE_TIME[TP] = 55;

EFFECT_TIME[AMP] = 30;
RECHARGE_TIME[AMP] = 60;

EFFECT_TIME[LEAP] = 6;
RECHARGE_TIME[LEAP] = 90;

EFFECT_TIME[BARRIER] = 11;
RECHARGE_TIME[BARRIER] = 60;

EFFECT_TIME[STRIKE] = 0;
RECHARGE_TIME[STRIKE] = 45;

RECHARGE_TIME[RIPPLE] = 60;

EFFECT_TIME[VENG] = 10;
RECHARGE_TIME[VENG] = 120;

EFFECT_TIME[SUSPEND] = 30;
RECHARGE_TIME[SUSPEND] = 90;

EFFECT_TIME[DISRUPT] = 6;
RECHARGE_TIME[DISRUPT] = 45;

EFFECT_TIME[DECOY] = 0;
RECHARGE_TIME[DECOY] = 60;

EFFECT_TIME[REPAIR] = 0;
RECHARGE_TIME[REPAIR] = 30;

EFFECT_TIME[ROCKET] = 0;
RECHARGE_TIME[ROCKET] = 120;

EFFECT_TIME[TURRET] = 3;
RECHARGE_TIME[TURRET] = 60;

EFFECT_TIME[PHASE] = 0;
RECHARGE_TIME[PHASE] = 90;

EFFECT_TIME[WARP] = 3;
RECHARGE_TIME[WARP] = 60;

EFFECT_TIME[ALPHA] = 8;
RECHARGE_TIME[ALPHA] = 45;

EFFECT_TIME[DELTA] = 45;
RECHARGE_TIME[DELTA] = 75;

EFFECT_TIME[OMEGA] = 45;
RECHARGE_TIME[OMEGA] = 60;

EFFECT_TIME[MIRROR] = 45;
RECHARGE_TIME[MIRROR] = 60;

EFFECT_TIME[MIRROR] = 45;
RECHARGE_TIME[MIRROR] = 60;

EFFECT_TIME[ALLY] = 45;
RECHARGE_TIME[ALLY] = 60;

const LOCMOD = [DECOY, REPAIR, ROCKET, TP, STRIKE, RIPPLE, WARP];

const CERB = 3.14;

let INFO = new Array(ct);

INFO[LASER] = "A single-target weapon that increases in damage the longer it fires. Damage resets when the weapon switches targets.";
INFO[CANNON] = "A single-target weapon that deals high damage to one enemy. Two second delay when switching targets.";
INFO[SPREAD] = "A multi-target weapon that deals constant damage to three enemies within range.";
INFO[LASER2] = "A multi-target weapon that deals damage to two enemies within range. Damage increases while both beams are active, and resets when there are less than two enemies in range.";
INFO[DART] = "A single-target weapon that periodically launches powerful rockets towards one enemy in range. When projectiles reach their destination, damage is dealt to only the targeted enemy, if it is still within the blast radius. Battleships are preferred over Cerberus.";

INFO[ROCKETD] = "A single-target weapon that periodically launches rockets towards enemies in range. Projectiles deal a small amount of damage if destroyed before they reach their destination. Battleships are preferred over Cerberus.";
INFO[TURRETD] = "A multi-target weapon that deals constant damage to three enemies within range.";

INFO[SENTINEL] = "A single-target weapon that deals high damage to one enemy.";
INFO[GUARD] = "A single-target weapon that deals low damage to one enemy.";
INFO[INT] = "A multi-target weapon that deals damage to four enemies within range.";
INFO[COL] = "A single-target weapon that slowly increases in damage the longer it fires. Damage resets with the weapon switches targets.";
INFO[BOMBER] = "A multi-target weapon that regularly launches a rocket towards every enemy within range. Projectiles deal a small amount of damage if destroyed before they reach their destination.";

INFO[ALPHA] = "A shield that absorbs all damage taken for a short period of time.";
INFO[DELTA] = "A weak shield that increases the speed of the Battleship and applies constant damage to enemies within range. This effect ends after a short time, or when the Battleship stops moving. Can only be activated while in motion.";
INFO[PASSIVE] = "A shield that is always active and regenerates strength slowly over time.";
INFO[OMEGA] = "A powerful shield that absorbs damage until it is depleted or its activation timer runs out.";
INFO[MIRROR] = "A weak shield that reflects and multiplies damage until it is depleted.";
INFO[ALLY] = "A weak shield that absorbs damage taken by any allied drone or rocket within range. The Battleship itself is not covered by this shield.";

INFO[EMP] = "Disables all enemy vessels within range for a short period of time. Disabled Battleships cannot move or fire, but can activate Modules.";
INFO[DUEL] = "Increases weapon damage when there is exactly one enemy Battleship in the sector.";
INFO[FORT] = "Locks the Battleship in place and reduces incoming damage for a short period of time.";
INFO[TP] = "After a short delay, the Battleship instantaneously moves to a selected location within range.";
INFO[AMP] = "Massively increases weapon damage for all ships in range.";
INFO[LEAP] = "After a short delay, the Battleship applies massive blast damage to all enemy ships in range and then teleports away to a randomly selected adjacent sector.";
INFO[BARRIER] = "Prevents enemy ships, drones, and most rockets within range from moving. Enemy ships which teleport into or out of the field take damage. Teleportation caused by LEAP is affected as well. Half of the incurred damage is applied normally, and the other half applies directly to the hull regardless of shields.";
INFO[STRIKE] = "Launches a fast rocket that deals high damage to enemy vessels within range. Can pass through Barrier. A small amount of damage is applied if the rocket is destroyed before reaching its destination.";
INFO[RIPPLE] = "Instantaneously swaps the Battleship with an allied drone, rocket, or Cerberus ship within range.";
INFO[DISRUPT] = "Nullifies all enemy shields within range for a short time.";

INFO[SUSPEND] = "Projects a suspension field around nearby enemies that slows their movement and decreases their weapon damage.";

INFO[VENG] = "When the Battleship's health falls below a critical threshold, this Module begins an activation countdown. When the countdown finishes, a massive explosion deals damage to all enemies within a large range.";

INFO[APOCALYPSE] = "When the ship's health reaches zero, all vessels equipped with APOCALYPSE warp out of the system, and sector collapse initiates. After a countdown, one to five sectors implode, instantly destroying all vessels within them. The resulting sectors deal constant damage to any ships within them for the rest of the round.";

INFO[DECOY] = "A drone that attracts fire. All enemy ships within range will immediately switch target to this drone.";
INFO[REPAIR] = "A drone that once destroyed repairs allied ships within range by a high amount. If the drone's lifetime expires before being destroyed, it repairs nearby allies by a small amount.";
INFO[ROCKET] = "A drone that periodically fires rockets at enemy vessels within range. Battleships are preferred over Cerberus.";
INFO[TURRET] = "A drone that after a small setup time applies constant damage to three enemies within range.";
INFO[PHASE] = "A drone that projects a suspension field around nearby enemy ships, slowing them down and decreasing their weapon damage.";
INFO[WARP] = "Two drones that after a small delay teleport to a target location and fire on enemy ships.";

INFO[NULL] = "The owner battleship hasn't used this module yet.";

let STATS = new Array(ct);

STATS[LASER] = "DPS: 160-600, Charge time: 10s\nRange: 80m";
STATS[CANNON] = "DPS: 284\nRange: 80m";
STATS[SPREAD] = "DPS: 220\nRange: 80m";
STATS[LASER2] = "DPS: 184-800, Charge time: 6s\nRange: 80m";
STATS[DART] = "Damage: 4000, Recharge time: 10s\nRange: 100m";

STATS[ROCKETD] = "Damage: 1000, Recharge time: 12s\nRange: 400m";
STATS[TURRETD] = "DPS: 200\nRange: 130m";

STATS[SENTINEL] = "DPS: 200\nRange: 80m";
STATS[GUARD] = "DPS: 60\nRange: 80m";
STATS[INT] = "DPS: 100\nRange: 80m";
STATS[COL] = "DPS: 80-600, Charge time: 20s\nRange: 80m";
STATS[BOMBER] = "Damage: 2000, Recharge time: 24s\nRange: 300m";

STATS[ALPHA] = "Effect time: 6s";
STATS[DELTA] = "HP: 2250, DPS: 900\nRange: 55m";
STATS[PASSIVE] = "HP: 3500, Recharge time: 30s";
STATS[OMEGA] = "HP: 4700";
STATS[MIRROR] = "HP: 1000, Multiplier: 300%\nRange: 90m";
STATS[ALLY] = "HP: 2000\nRange: 140m";

STATS[EMP] = "Effect time: 6s\nRange: 80m";
STATS[DUEL] = "Multiplier: 150%";
STATS[FORT] = "Effect time: 12s, Reduction: 40%";
STATS[TP] = "Delay: 3s\nRange: 400m";
STATS[AMP] = "Multiplier: 300%\nRange: 100m";
STATS[LEAP] = "Damage: 3000, Delay: 6s\nRange: 65m";
STATS[BARRIER] = "Effect time: 10s\nRange: 100m";
STATS[STRIKE] = "Damage: 3000, HP: 180\nRange: Unlimited";
STATS[RIPPLE] = "Range: 300m";
STATS[DISRUPT] = "Effect time: 6s\nRange: 70m";

STATS[SUSPEND] = "Effect time: 30s, Reduction: 30%\nRange: 150m";

STATS[VENG] = "Damage: 7000, Delay: 10s\nRange: 160m";

STATS[APOCALYPSE] = "Delay: 40s";

STATS[DECOY] = "HP: 1000, Deploy range: 250m\nLifetime: 40s";
STATS[REPAIR] = "HP: 1000, Heal amount: 500-2000\nDeploy range: 200m, Lifetime: 40s";
STATS[ROCKET] = "HP: 600, Deploy range: 250m\nLifetime: 100s";
STATS[TURRET] = "HP: 1500, Setup time: 3s\nLifetime: 120s";
STATS[PHASE] = "HP: 1000, Range: 150m\nLifetime: 30s";
STATS[WARP] = "HP: 900, Delay: 3s, DPS: 200\nDeploy range: 400m, Lifetime: 40s";

let MODULE_NAME = new Array(ct);

MODULE_NAME[LASER] = "LASER";
MODULE_NAME[CANNON] = "CANNON";
MODULE_NAME[SPREAD] = "SPREAD CANNON";
MODULE_NAME[LASER2] = "DUAL LASER";
MODULE_NAME[DART] = "ROCKET LAUNCHER";

MODULE_NAME[ROCKETD] = "ROCKET LAUNCHER";
MODULE_NAME[TURRETD] = "TRIPLE LASER";

MODULE_NAME[SENTINEL] = "CANNON";
MODULE_NAME[GUARD] = "WEAK CANNON";
MODULE_NAME[INT] = "SPREAD CANNON";
MODULE_NAME[COL] = "LASER";
MODULE_NAME[BOMBER] = "ROCKET BARRAGE";

MODULE_NAME[ALPHA] = "ALPHA SHIELD";
MODULE_NAME[DELTA] = "DELTA SHIELD";
MODULE_NAME[PASSIVE] = "PASSIVE SHIELD";
MODULE_NAME[OMEGA] = "OMEGA SHIELD";
MODULE_NAME[MIRROR] = "MIRROR SHIELD";
MODULE_NAME[ALLY] = "ALLY SHIELD";

MODULE_NAME[EMP] = "EMP";
MODULE_NAME[DUEL] = "DUEL";
MODULE_NAME[FORT] = "FORTIFY";
MODULE_NAME[TP] = "TELEPORT";
MODULE_NAME[AMP] = "AMPLIFY";
MODULE_NAME[LEAP] = "LEAP";
MODULE_NAME[BARRIER] = "BARRIER";
MODULE_NAME[STRIKE] = "STRIKE";
MODULE_NAME[RIPPLE] = "SWAP";
MODULE_NAME[DISRUPT] = "DISRUPT";

MODULE_NAME[SUSPEND] = "SUSPEND";

MODULE_NAME[VENG] = "VENGEANCE";

MODULE_NAME[APOCALYPSE] = "APOCALYPSE";

MODULE_NAME[DECOY] = "DECOY DRONE";
MODULE_NAME[REPAIR] = "REPAIR DRONE";
MODULE_NAME[ROCKET] = "ROCKET DRONE";
MODULE_NAME[TURRET] = "TURRET DRONE";
MODULE_NAME[PHASE] = "PHASE DRONE";
MODULE_NAME[WARP] = "WARP DRONES";

MODULE_NAME[NULL] = "UNKNOWN";
