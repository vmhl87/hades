const SECTOR_COLLAPSE_TIME = 40;

let ct = 0;

// SHIP TYPES

const BS = ++ct, SENTINEL = ++ct, GUARD = ++ct, INT = ++ct, COL = ++ct, BOMBER = ++ct;

const DARTP = ++ct, ROCKETP = ++ct, DELTAP = ++ct, BOMBERP = ++ct;

// DRONE TYPES

const DECOY = ++ct, REPAIR = ++ct, ROCKET = ++ct, TURRET = ++ct, SHIELD = ++ct;

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
NAME[BOMBER] = "CERBERUS BOMBER";
NAME[DARTP] = "ROCKET";
NAME[ROCKETP] = "DRONE ROCKET";
NAME[DELTAP] = "STRIKE ROCKET";
NAME[BOMBERP] = "BOMBER ROCKET";
NAME[DECOY] = "DECOY DRONE";
NAME[REPAIR] = "REPAIR DRONE";
NAME[ROCKET] = "ROCKET DRONE";
NAME[TURRET] = "TURRET DRONE";
NAME[SHIELD] = "SHIELD DRONE";

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
HP[SHIELD] = 1000;
HP[DARTP] = 250;
HP[ROCKETP] = 400;
HP[DELTAP] = 180;
HP[BOMBERP] = 900;

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
RANGE[BOMBERP] = 100;

const LOCMOD = [DECOY, REPAIR, ROCKET, TP, DELTA, RIPPLE];

const CERB = 3.14;

let INFO = new Array(ct);

INFO[LASER] = "A single-target weapon that increases in damage the longer it fires. Damage resets when the weapon switches targets.";
INFO[BATTERY] = "A single-target weapon that deals high damage to one enemy. Two second delay when switching targets.";
INFO[MASS] = "A multi-target weapon that deals constant damage to three enemies within range.";
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
INFO[DELTA] = "Launches a fast rocket that deals high damage to enemy vessels within range. Can pass through Barrier. A small amount of damage is applied if the rocket is destroyed before reaching its destination.";
INFO[RIPPLE] = "Instantaneously swaps the Battleship with an allied drone, rocket, or Cerberus ship within range.";
INFO[DISRUPT] = "Nullifies all enemy shields within range for a short time.";

INFO[VENG] = "When the Battleship's health falls below a critical threshold, this Module begins an activation countdown. When the countdown finishes, a massive explosion deals damage to all enemies within a large range.";

INFO[SECT] = "When the ship's health reaches zero, all vessels equipped with APOCALYPSE warp out of the system, and sector collapse initiates. After a countdown, one to five sectors implode, instantly destroying all vessels within them. The resulting sectors deal constant damage to any ships within them for the rest of the round.";

INFO[DECOY] = "A drone that attracts fire. All enemy ships within range will immediately switch target to this drone.";
INFO[REPAIR] = "A drone that once destroyed repairs allied ships within range by a high amount. If the drone's lifetime expires before being destroyed, it repairs nearby allies by a small amount.";
INFO[ROCKET] = "A drone that periodically fires rockets at enemy vessels within range. Battleships are preferred over Cerberus.";
INFO[TURRET] = "A drone that after a small setup time applies constant damage to three enemies within range.";
INFO[SHIELD] = "A drone that projects a floating shield over all allied vessels within range. The drone itself is not protected by the shield.";

let STATS = new Array(ct);

STATS[LASER] = "DPS: 160-600, Charge time: 10s\nRange: 80m";
STATS[BATTERY] = "DPS: 284\nRange: 80m";
STATS[MASS] = "DPS: 220\nRange: 80m";
STATS[LASER2] = "DPS: 184-800, Charge time: 6s\nRange: 80m";
STATS[DART] = "Damage: 4000, Recharge time: 10s\nRange: 100m";

STATS[ROCKETD] = "Damage: 1000, Recharge time: 12s\nRange: 400m";
STATS[TURRETD] = "DPS: 200\nRange: 80m";

STATS[SENTINEL] = "DPS: 200\nRange: 80m";
STATS[GUARD] = "DPS: 60\nRange: 80m";
STATS[INT] = "DPS: 100\nRange: 80m";
STATS[COL] = "DPS: 80-600, Charge time: 20s\nRange: 80m";
STATS[BOMBER] = "Damage: 2000, Recharge time: 24s\nRange: 300m";

STATS[ALPHA] = "Effect time: 6s";
STATS[IMPULSE] = "HP: 2250, DPS: 900\nRange: 55m";
STATS[PASSIVE] = "HP: 3500, Recharge time: 30s";
STATS[OMEGA] = "HP: 4700";
STATS[MIRROR] = "HP: 1000, Multiplier: 300%\nRange: 90m";
STATS[ALLY] = "HP: 1500\nRange: 90m";

STATS[EMP] = "Effect time: 6s\nRange: 80m";
STATS[SOL] = "Multiplier: 150%";
STATS[FORT] = "Effect time: 12s, Reduction: 40%";
STATS[TP] = "Delay: 3s\nRange: 400m";
STATS[AMP] = "Multiplier: 300%\nRange: 100m";
STATS[DESTINY] = "Damage: 5000, Delay: 6s\nRange: 65m";
STATS[BARRIER] = "Effect time: 10s\nRange: 100m";
STATS[DELTA] = "Damage: 3000, HP: 180\nRange: Unlimited";
STATS[RIPPLE] = "Range: 300m";
STATS[DISRUPT] = "Effect time: 6s\nRange: 70m";

STATS[VENG] = "Damage: 7000, Delay: 10s\nRange: 160m";

STATS[SECT] = "Delay: 40s";

STATS[DECOY] = "HP: 1000, Deploy range: 250m\nLifetime: 40s";
STATS[REPAIR] = "HP: 1000, Heal amount: 500-2000\nDeploy range: 200m, Lifetime: 40s";
STATS[ROCKET] = "HP: 600, Deploy range: 250m\nLifetime: 100s";
STATS[TURRET] = "HP: 1500, Setup time: 3s\nLifetime: 120s";
STATS[SHIELD] = "HP: 1000, Shield HP: 1500\nLifetime: 45s";

let MODULE_NAME = new Array(ct);

MODULE_NAME[LASER] = "LASER";
MODULE_NAME[BATTERY] = "CANNON";
MODULE_NAME[MASS] = "SPREAD CANNON";
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
MODULE_NAME[IMPULSE] = "DELTA SHIELD";
MODULE_NAME[PASSIVE] = "PASSIVE SHIELD";
MODULE_NAME[OMEGA] = "OMEGA SHIELD";
MODULE_NAME[MIRROR] = "MIRROR SHIELD";
MODULE_NAME[ALLY] = "ALLY SHIELD";

MODULE_NAME[EMP] = "EMP";
MODULE_NAME[SOL] = "DUEL";
MODULE_NAME[FORT] = "FORTIFY";
MODULE_NAME[TP] = "TELEPORT";
MODULE_NAME[AMP] = "AMPLIFY";
MODULE_NAME[DESTINY] = "LEAP";
MODULE_NAME[BARRIER] = "BARRIER";
MODULE_NAME[DELTA] = "STRIKE";
MODULE_NAME[RIPPLE] = "SWAP";
MODULE_NAME[DISRUPT] = "DISRUPT";

MODULE_NAME[VENG] = "VENGEANCE";

MODULE_NAME[SECT] = "APOCALYPSE";

MODULE_NAME[DECOY] = "DECOY DRONE";
MODULE_NAME[REPAIR] = "REPAIR DRONE";
MODULE_NAME[ROCKET] = "ROCKET DRONE";
MODULE_NAME[TURRET] = "TURRET DRONE";
MODULE_NAME[SHIELD] = "SHIELD DRONE";
