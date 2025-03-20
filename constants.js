const SECTOR_COLLAPSE_TIME = 40, TPS = 4;

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

const NULL = 2.71, DEV = 1.618;

let NAME = new Array(ct), HP = new Array(ct), RANGE = new Array(ct).fill(null),
	TIME = new Array(ct), ACTIVATED = new Array(ct), EFFECT_TIME = new Array(ct),
	RECHARGE_TIME = new Array(ct), STRENGTH = new Array(ct), DAMAGE = new Array(ct),
	LASER_DAMAGE = new Array(ct), EXPIRE_TIME = new Array(ct), SPEED = new Array(ct),
	TARGETS = new Array(ct), LASER_CHARGE = new Array(ct);

LASER_CHARGE[LASER] = [6, 10];
LASER_CHARGE[LASER2] = [3, 6];
LASER_CHARGE[COL] = [10, 20];

TARGETS[LASER] = 1;
TARGETS[CANNON] = 1;
TARGETS[SPREAD] = 3;
TARGETS[LASER2] = 2;
TARGETS[DART] = 1;
TARGETS[PULSE] = 100;
TARGETS[ROCKETD] = 1;
TARGETS[TURRETD] = 3;
TARGETS[SENTINEL] = 1;
TARGETS[GUARD] = 1;
TARGETS[INT] = 4;
TARGETS[COL] = 1;

SPEED[BS] = 20;
SPEED[SENTINEL] = 10;
SPEED[GUARD] = 11;
SPEED[INT] = 26;
SPEED[COL] = 12;
SPEED[BOMBER] = 8;
SPEED[DECOY] = 20;
SPEED[REPAIR] = 20;
SPEED[ROCKET] = 15;
SPEED[WARP] = 20;
SPEED[DARTP] = 25;
SPEED[ROCKETP] = 70;
SPEED[STRIKEP] = 110;
SPEED[BOMBERP] = 25;

SPEED[DELTA] = 2;

EXPIRE_TIME[DECOY] = 40;
EXPIRE_TIME[REPAIR] = 40;
EXPIRE_TIME[ROCKET] = 100;
EXPIRE_TIME[TURRET] = 120;
EXPIRE_TIME[PHASE] = 30;
EXPIRE_TIME[WARP] = 40;
EXPIRE_TIME[BOMB] = 120;

LASER_DAMAGE[LASER] = [160, 350, 600];
LASER_DAMAGE[LASER2] = [184, 450, 800];
LASER_DAMAGE[COL] = [80, 200, 600];

DAMAGE[CANNON] = 284;
DAMAGE[SPREAD] = 220;
DAMAGE[SENTINEL] = 200;
DAMAGE[GUARD] = 60;
DAMAGE[INT] = 100;
DAMAGE[PULSE] = 3000;
DAMAGE[TURRETD] = 200;

DAMAGE[BARRIER] = 3000;
DAMAGE[DUEL] = 1.5;
DAMAGE[AMP] = 3;
DAMAGE[SUSPEND] = 0.70;
DAMAGE[MIRROR] = 3;
DAMAGE[FORT] = 0.6;
DAMAGE[VENG] = 7000;
DAMAGE[DELTA] = 900;
DAMAGE[LEAP] = 4000;

DAMAGE[DARTP] = 4000;
DAMAGE[ROCKETP] = 1000;
DAMAGE[STRIKEP] = 3000;
DAMAGE[BOMBERP] = 2000;

STRENGTH[DELTA] = 3000;
STRENGTH[PASSIVE] = 3500;
STRENGTH[OMEGA] = 4700;
STRENGTH[MIRROR] = 1500;
STRENGTH[ALLY] = 3000;

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
NAME[WARP] = "WARP DRONE";
NAME[BOMB] = "REMOTE BOMB";

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
HP[BOMB] = 2000;
HP[DARTP] = 250;
HP[ROCKETP] = 400;
HP[STRIKEP] = 180;
HP[BOMBERP] = 900;

for(let i=LASER; i<=LASER2; ++i) RANGE[i] = 80;
RANGE[DART] = 100;
RANGE[PULSE] = 60;
RANGE[TURRETD] = 130;
RANGE[ROCKETD] = 400;
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
RANGE[BOND] = 110;
RANGE[BOMB] = 60;

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
ACTIVATED[BOND] = true;
ACTIVATED[DISRUPT] = true;
ACTIVATED[SUSPEND] = true;

ACTIVATED[DECOY] = true;
ACTIVATED[REPAIR] = true;
ACTIVATED[ROCKET] = true;
ACTIVATED[TURRET] = true;
ACTIVATED[PHASE] = true;
ACTIVATED[WARP] = true;
ACTIVATED[BOMB] = true;

RECHARGE_TIME[TURRETD] = 3;

EFFECT_TIME[CANNON] = 0;
RECHARGE_TIME[CANNON] = 2;

EFFECT_TIME[DART] = 0;
RECHARGE_TIME[DART] = 10;

EFFECT_TIME[PULSE] = 0;
RECHARGE_TIME[PULSE] = 10;

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

EFFECT_TIME[RIPPLE] = 0;
RECHARGE_TIME[RIPPLE] = 60;

EFFECT_TIME[BOND] = 5;
RECHARGE_TIME[BOND] = 90;

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

EFFECT_TIME[BOMB] = 0;
RECHARGE_TIME[BOMB] = 90;

EFFECT_TIME[ALPHA] = 8;
RECHARGE_TIME[ALPHA] = 30;

EFFECT_TIME[DELTA] = 45;
RECHARGE_TIME[DELTA] = 75;

EFFECT_TIME[OMEGA] = 45;
RECHARGE_TIME[OMEGA] = 60;

EFFECT_TIME[MIRROR] = 45;
RECHARGE_TIME[MIRROR] = 60;

EFFECT_TIME[ALLY] = 45;
RECHARGE_TIME[ALLY] = 60;

const LOCMOD = [DECOY, REPAIR, ROCKET, TP, STRIKE, RIPPLE, BOND, WARP];

const CERB = 3.14;

let INFO = new Array(ct);

INFO[LASER] = "A single-target weapon that increases in damage the longer it fires. Damage resets when the weapon switches targets.";
INFO[CANNON] = "A single-target weapon that deals high damage to one enemy. Two second delay when switching targets.";
INFO[SPREAD] = "A multi-target weapon that deals constant damage to three enemies within range.";
INFO[LASER2] = "A multi-target weapon that deals damage to two enemies within range. Damage increases while both beams are active, and resets when there are less than two enemies in range.";
INFO[DART] = "A single-target weapon that periodically launches powerful rockets towards one enemy in range. When projectiles reach their destination, damage is dealt to only the targeted enemy, if it is still within the blast radius. Battleships are preferred over Cerberus.";
INFO[PULSE] = "A powerful weapon that slowly charges up while enemies are within range. Once fully charged up, a massive blast deals damage to every ship within range.";
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
INFO[DUEL] = "Increases primary weapon damage when there is exactly one enemy Battleship in the sector. Rocket Launcher is not affected.";
INFO[FORT] = "Locks the Battleship in place and reduces incoming damage for a short period of time.";
INFO[TP] = "After a short delay, the Battleship instantaneously moves to a selected location within range.";
INFO[AMP] = "Massively increases primary weapon damage for all ships in range. Rocket Launcher, and Warp Drones are not affected.";
INFO[LEAP] = "After a short delay, the Battleship applies massive blast damage to all enemy ships in range and then teleports away to a randomly selected adjacent sector.";
INFO[BARRIER] = "Prevents enemy ships, drones, and most rockets within range from moving. Enemy ships which teleport into or out of the field take damage. Teleportation caused by LEAP is affected as well. Half of the incurred damage is applied normally, and the other half applies directly to the hull regardless of shields.";
INFO[STRIKE] = "Launches a fast rocket that deals high damage to enemy vessels within range. Can pass through Barrier. A small amount of damage is applied if the rocket is destroyed before reaching its destination.";
INFO[RIPPLE] = "Instantaneously swaps the Battleship with an allied drone, rocket, or Cerberus ship within range.";
INFO[BOND] = "Binds to a target ship, holding it stationary relative to the owner Battleship. Can push Barrier. Bonded ships can only break the link with a module that causes Teleport.";
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
INFO[BOMB] = "A stationary drone equipping a Pulse weapon, charging up when enemies are within range.";

INFO[NULL] = "The owner battleship hasn't used this module yet.";

let STATS = new Array(ct);

STATS[LASER] = `DPS: ${LASER_DAMAGE[LASER][0]}-${LASER_DAMAGE[LASER][2]}, Charge time: ${LASER_CHARGE[LASER][1]}s\nRange: ${RANGE[LASER]}m`;
STATS[CANNON] = `DPS: ${DAMAGE[CANNON]}\nRange: ${RANGE[CANNON]}m`;
STATS[SPREAD] = `DPS: ${DAMAGE[SPREAD]}\nRange: ${RANGE[SPREAD]}m`;
STATS[LASER2] = `DPS: ${LASER_DAMAGE[LASER2][0]}-${LASER_DAMAGE[LASER2][2]}, Charge time: ${LASER_CHARGE[LASER2][1]}s\nRange: ${RANGE[LASER2]}m`;
STATS[DART] = `Damage: ${DAMAGE[DARTP]}, Recharge time: ${RECHARGE_TIME[DART]}s\nRange: ${RANGE[DART]}m, HP: ${HP[DARTP]}`;
STATS[PULSE] = `Damage: ${DAMAGE[PULSE]}, Recharge time: ${RECHARGE_TIME[PULSE]}s\nRange: ${RANGE[PULSE]}m`;

STATS[ROCKETD] = `Damage: ${DAMAGE[ROCKETP]}, Recharge time: ${RECHARGE_TIME[ROCKETD]}s\nRange: ${RANGE[ROCKETD]}m`;
STATS[TURRETD] = `DPS: ${DAMAGE[TURRETD]}\nRange: ${RANGE[TURRETD]}m`;

STATS[SENTINEL] = `DPS: ${DAMAGE[SENTINEL]}\nRange: ${RANGE[SENTINEL]}m`;
STATS[GUARD] = `DPS: ${DAMAGE[GUARD]}\nRange: ${RANGE[GUARD]}m`;
STATS[INT] = `DPS: ${DAMAGE[INT]}\nRange: ${RANGE[INT]}m`;
STATS[COL] = `DPS: ${LASER_DAMAGE[COL][0]}-${LASER_DAMAGE[COL][2]}, Charge time: ${LASER_CHARGE[COL][1]}s\nRange: ${RANGE[COL]}m`;
STATS[BOMBER] = `Damage: ${DAMAGE[BOMBERP]}, Recharge time: ${RECHARGE_TIME[BOMBER]}s`;

STATS[ALPHA] = `Effect time: ${EFFECT_TIME[ALPHA]}s`;
STATS[DELTA] = `HP: ${STRENGTH[DELTA]}, DPS: ${DAMAGE[DELTA]}\nRange: ${RANGE[DELTA]}m, Speedup: ${SPEED[DELTA]}x`;
STATS[PASSIVE] = `HP: ${STRENGTH[PASSIVE]}, Recharge time: 30s`;
STATS[OMEGA] = `HP: ${STRENGTH[OMEGA]}`;
STATS[MIRROR] = `HP: ${STRENGTH[MIRROR]}, Multiplier: 300%\nRange: ${RANGE[MIRROR]}m`;
STATS[ALLY] = `HP: ${STRENGTH[ALLY]}\nRange: ${RANGE[ALLY]}m`;

STATS[EMP] = `Effect time: ${EFFECT_TIME[EMP]}s\nRange: ${RANGE[EMP]}m`;
STATS[DUEL] = `Multiplier: ${Math.round(DAMAGE[DUEL]*100)}%`;
STATS[FORT] = `Effect time: ${EFFECT_TIME[FORT]}s, Reduction: ${Math.round(100*(1-DAMAGE[FORT]))}%`;
STATS[TP] = `Delay: ${EFFECT_TIME[TP]}s\nRange: ${RANGE[TP]}m`;
STATS[AMP] = `Multiplier: ${Math.round(DAMAGE[AMP]*100)}%\nRange: ${RANGE[AMP]}m`;
STATS[LEAP] = `Damage: ${DAMAGE[LEAP]}, Delay: ${EFFECT_TIME[LEAP]}s\nRange: ${RANGE[LEAP]}m`;
STATS[BARRIER] = `Effect time: ${EFFECT_TIME[BARRIER]}s\nRange: ${RANGE[BARRIER]}m`;
STATS[STRIKE] = `Damage: ${DAMAGE[STRIKEP]}, HP: ${HP[STRIKEP]}\nRange: Unlimited`;
STATS[RIPPLE] = `Range: ${RANGE[RIPPLE]}m`;
STATS[DISRUPT] = `Effect time: ${EFFECT_TIME[DISRUPT]}s\nRange: ${RANGE[DISRUPT]}m`;
STATS[BOND] = `Effect time: ${EFFECT_TIME[BOND]}s\nRange: ${RANGE[BOND]}m`;

STATS[SUSPEND] = `Effect time: ${EFFECT_TIME[SUSPEND]}s, Reduction: 30%\nRange: ${RANGE[SUSPEND]}m`;

STATS[VENG] = `Damage: ${DAMAGE[VENG]}, Delay: ${EFFECT_TIME[VENG]}s\nRange: ${RANGE[VENG]}m`;

STATS[APOCALYPSE] = `Delay: 40s`;

STATS[DECOY] = `HP: ${HP[DECOY]}, Deploy range: ${RANGE[DECOY]}m\nLifetime: ${EXPIRE_TIME[DECOY]}s`;
STATS[REPAIR] = `HP: ${HP[REPAIR]}, Heal amount: 500-2000\nDeploy range: ${RANGE[REPAIR]}m, Lifetime: ${EXPIRE_TIME[REPAIR]}s`;
STATS[ROCKET] = `HP: ${HP[ROCKET]}, Deploy range: ${RANGE[ROCKET]}m\nLifetime: ${EXPIRE_TIME[ROCKET]}s, Damage: ${DAMAGE[ROCKETP]}`;
STATS[TURRET] = `HP: ${HP[TURRET]}, Setup time: ${EFFECT_TIME[TURRET]}s\nLifetime: ${EXPIRE_TIME[TURRET]}s, DPS: ${DAMAGE[TURRETD]}`;
STATS[PHASE] = `HP: ${HP[PHASE]}, Range: ${RANGE[SUSPEND]}m\nLifetime: ${EXPIRE_TIME[PHASE]}s`;
STATS[WARP] = `HP: ${HP[WARP]}, Delay: ${EFFECT_TIME[WARP]}s, DPS: 200\nDeploy range: ${RANGE[WARP]}m, Lifetime: ${EXPIRE_TIME[WARP]}s`;
STATS[BOMB] = `HP: ${HP[BOMB]}, Damage: ${DAMAGE[PULSE]}, \nDelay: 6s, Lifetime: ${EXPIRE_TIME[BOMB]}s`;

let MODULE_NAME = new Array(ct);

MODULE_NAME[LASER] = "LASER";
MODULE_NAME[CANNON] = "CANNON";
MODULE_NAME[SPREAD] = "SPREAD CANNON";
MODULE_NAME[LASER2] = "DUAL LASER";
MODULE_NAME[DART] = "ROCKET LAUNCHER";
MODULE_NAME[PULSE] = "PULSE";

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
MODULE_NAME[BOND] = "BOND";

MODULE_NAME[SUSPEND] = "SUSPEND";

MODULE_NAME[VENG] = "VENGEANCE";

MODULE_NAME[APOCALYPSE] = "APOCALYPSE";

MODULE_NAME[DECOY] = "DECOY DRONE";
MODULE_NAME[REPAIR] = "REPAIR DRONE";
MODULE_NAME[ROCKET] = "ROCKET DRONE";
MODULE_NAME[TURRET] = "TURRET DRONE";
MODULE_NAME[PHASE] = "PHASE DRONE";
MODULE_NAME[WARP] = "WARP DRONES";
MODULE_NAME[BOMB] = "REMOTE BOMB";

MODULE_NAME[NULL] = "UNKNOWN";

try{
	module.exports = { SPEED, HP, EFFECT_TIME, RECHARGE_TIME, ACTIVATED, RANGE, EXPIRE_TIME, TARGETS, DAMAGE, LASER_DAMAGE, STRENGTH, LASER_CHARGE };
}catch(e){}
