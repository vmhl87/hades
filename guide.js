let showGuide = false, guideUI = {};

{
	let ct = 0;

	guideUI.start = ct++;

	guideUI.info = ct++;
	guideUI.gameplay = ct++;
	guideUI.gameMode = ct++;
	guideUI.ship = ct++;
	guideUI.weapon = ct++;
	guideUI.shield = ct++;
	guideUI.module = ct++;
	guideUI.drone = ct++;

	guideUI.movement = ct++;
	guideUI.combat = ct++;
	guideUI.modules = ct++;

	guideUI.quickMatch = ct++;
	guideUI.arena = ct++;

	guideUI.battleship = ct++;
	guideUI.sentinel = ct++;
	guideUI.guardian = ct++;
	guideUI.interceptor = ct++;
	guideUI.colossus = ct++;
	guideUI.bomber = ct++;

	guideUI.laser = ct++;
	guideUI.cannon = ct++;
	guideUI.spreadCannon = ct++;
	guideUI.dualLaser = ct++;
	guideUI.rocketLauncher = ct++;

	guideUI.alpha = ct++;
	guideUI.delta = ct++;
	guideUI.omega = ct++;
	guideUI.passive = ct++;
	guideUI.mirror = ct++;
	guideUI.ally = ct++;
	
	guideUI.emp = ct++;
	guideUI.duel = ct++;
	guideUI.fortify = ct++;
	guideUI.teleport = ct++;
	guideUI.amplify = ct++;
	guideUI.leap = ct++;
	guideUI.barrier = ct++;
	guideUI.strike = ct++;
	guideUI.ripple = ct++;
	guideUI.disrupt = ct++;

	guideUI.decoy = ct++;
	guideUI.rocket = ct++;
	guideUI.turret = ct++;
	guideUI.phase = ct++;
	guideUI.warp = ct++;

	guideUI.tree = new Array(ct);

	for(let i=0; i<guideUI.tree.length; ++i)
		guideUI.tree[i] = {par: null, child: [], info: []};

	function subpage(node, child){
		guideUI.tree[node].child.push(child);
		guideUI.tree[child].par = node;
	}

	for(let x=guideUI.info; x<=guideUI.drone; ++x)
		subpage(guideUI.start, x);

	for(let x=guideUI.movement; x<=guideUI.modules; ++x)
		subpage(guideUI.gameplay, x);

	for(let x=guideUI.quickMatch; x<=guideUI.arena; ++x)
		subpage(guideUI.gameMode, x);

	for(let x=guideUI.battleship; x<=guideUI.bomber; ++x)
		subpage(guideUI.ship, x);

	for(let x=guideUI.laser; x<=guideUI.rocketLauncher; ++x)
		subpage(guideUI.weapon, x);

	for(let x=guideUI.alpha; x<=guideUI.ally; ++x)
		subpage(guideUI.shield, x);

	for(let x=guideUI.emp; x<=guideUI.disrupt; ++x)
		subpage(guideUI.module, x);

	for(let x=guideUI.decoy; x<=guideUI.warp; ++x)
		subpage(guideUI.drone, x);

	function info(page){
		return guideUI.tree[page].info;
	}

	info(guideUI.start).push("Guide");

	info(guideUI.info).push("Introduction");
	info(guideUI.gameplay).push("Gameplay");
	info(guideUI.gameMode).push("Game Modes");
	info(guideUI.ship).push("Ships");
	info(guideUI.weapon).push("Weapons");
	info(guideUI.shield).push("Shields");
	info(guideUI.module).push("Modules");
	info(guideUI.drone).push("Drones");

	info(guideUI.movement).push("Movement");
	info(guideUI.combat).push("Combat");
	info(guideUI.modules).push("Modules");

	info(guideUI.quickMatch).push("Quick Match");
	info(guideUI.arena).push("Arena");

	info(guideUI.battleship).push(["ship", BS]);
	info(guideUI.battleship).push("Battleship");
	info(guideUI.sentinel).push(["ship", SENTINEL]);
	info(guideUI.sentinel).push("Cerberus Sentinel");
	info(guideUI.guardian).push(["ship", GUARD]);
	info(guideUI.guardian).push("Cerberus Guardian");
	info(guideUI.interceptor).push(["ship", INT]);
	info(guideUI.interceptor).push("Cerberus Interceptor");
	info(guideUI.colossus).push(["ship", COL]);
	info(guideUI.colossus).push("Cerberus Colossus");
	info(guideUI.bomber).push(["ship", BOMBER]);
	info(guideUI.bomber).push("Cerberus Bomber");

	info(guideUI.laser).push(["module", LASER]);
	info(guideUI.laser).push("Laser");
	info(guideUI.cannon).push(["module", CANNON]);
	info(guideUI.cannon).push("Cannon");
	info(guideUI.spreadCannon).push(["module", SPREAD]);
	info(guideUI.spreadCannon).push("Spread Cannon");
	info(guideUI.dualLaser).push(["module", LASER2]);
	info(guideUI.dualLaser).push("Dual Laser");
	info(guideUI.rocketLauncher).push(["module", DART]);
	info(guideUI.rocketLauncher).push("Rocket Launcher");

	info(guideUI.alpha).push(["module", ALPHA]);
	info(guideUI.alpha).push("Alpha Shield");
	info(guideUI.delta).push(["module", DELTA]);
	info(guideUI.delta).push("Delta Shield");
	info(guideUI.omega).push(["module", OMEGA]);
	info(guideUI.omega).push("Omega Shield");
	info(guideUI.passive).push(["module", PASSIVE]);
	info(guideUI.passive).push("Passive Shield");
	info(guideUI.mirror).push(["module", MIRROR]);
	info(guideUI.mirror).push("Mirror Shield");
	info(guideUI.ally).push(["module", ALLY]);
	info(guideUI.ally).push("Ally Shield");

	info(guideUI.emp).push(["module", EMP]);
	info(guideUI.emp).push("EMP");
	info(guideUI.duel).push(["module", DUEL]);
	info(guideUI.duel).push("Duel");
	info(guideUI.fortify).push(["module", FORT]);
	info(guideUI.fortify).push("Fortify");
	info(guideUI.teleport).push(["module", TP]);
	info(guideUI.teleport).push("Teleport");
	info(guideUI.amplify).push(["module", AMP]);
	info(guideUI.amplify).push("Amplify");
	info(guideUI.leap).push(["module", LEAP]);
	info(guideUI.leap).push("Leap");
	info(guideUI.barrier).push(["module", BARRIER]);
	info(guideUI.barrier).push("Barrier");
	info(guideUI.strike).push(["module", STRIKE]);
	info(guideUI.strike).push("Strike");
	info(guideUI.ripple).push(["module", RIPPLE]);
	info(guideUI.ripple).push("Ripple");
	info(guideUI.disrupt).push(["module", DISRUPT]);
	info(guideUI.disrupt).push("Disrupt");

	info(guideUI.decoy).push(["module", DECOY]);
	info(guideUI.decoy).push("Decoy Drone");
	info(guideUI.rocket).push(["module", ROCKET]);
	info(guideUI.rocket).push("Rocket Drone");
	info(guideUI.turret).push(["module", TURRET]);
	info(guideUI.turret).push("Turret Drone");
	info(guideUI.phase).push(["module", PHASE]);
	info(guideUI.phase).push("Phase Drone");
	info(guideUI.warp).push(["module", WARP]);
	info(guideUI.warp).push("Warp Drones");

	guideUI.now = guideUI.start;
};

function drawGuide(){
	push();
	fill(0, 20, 30); noStroke();
	rect(width/2-150, height/2-min(height-120, 500)/2, 300, min(height-120, 500));
	stroke(20, 70, 80); strokeWeight(3);
	rect(width/2-150, height/2-min(height-120, 500)/2, 300, min(height-120, 500));
	pop();

	const N = guideUI.tree[guideUI.now];

	const T = N.par == null ? "Close" : "Back";
	push();
	const H = mouseIn(width/2-150 + 40, height/2-min(height-120, 500)/2 + 30, 40, 20);
	textSize(16);
	const B = font.textBounds(T, 0, 0);
	textSize(H ? 18 : 16);
	textAlign(CENTER, CENTER);
	fill(H ? 255 : 200); noStroke();
	text(T, width/2-150 + 20 + B.w/2, height/2-min(height-120, 500)/2 + 20 + B.h/2);
	pop();

	for(let x of N.info) if(typeof x == "string"){
		push();
		textSize(16);
		textAlign(RIGHT, CENTER);
		fill(40, 130, 150); noStroke();
		text(x, width/2+150-20, height/2-min(height-120, 500)/2+20 + font.textBounds("X", 0, 0).h/2);
		pop();
		break;
	}

	if(N.child.length){
		push();
		textAlign(CENTER, CENTER);

		for(let i=0; i<N.child.length; ++i){
			const C = guideUI.tree[N.child[i]];
			let bound = 0;

			const S = N.child.length*40 > min(height-120, 500)-90 ? 0.75 : 1;

			textSize(S*15);

			for(let x of C.info)
				if(typeof x == "string"){
					bound += textWidth(x) + 20*S;

				}else if(x[0] == "ship"){
					bound += S*([SENTINEL, GUARD].includes(x[1]) ? 30 : 60);

				}else if(x[0] == "module"){
					bound += S*40;
				}

			const Y = height/2-min(height-120, 500)/2 + 90 + S*40*i;
			const H = mouseIn(width/2, Y, 20+bound/2, S*20);

			fill(H ? 255 : 200); noStroke();

			if(H) for(let x of C.info)
				if(typeof x == "string"){
					textSize(S*15);
					bound -= textWidth(x);
					textSize(S*16);
					bound += textWidth(x);
				}

			let p = width/2-bound/2;

			for(let x of C.info)
				if(typeof x == "string"){
					const W = textWidth(x) + 20*S;
					text(x, p+W/2, Y-2);
					p += W;

				}else if(x[0] == "ship"){
					const W = S*([SENTINEL, GUARD].includes(x[1]) ? 30 : 60);
					push(); translate(p+W/2, Y);
					scale(S * (H ? 1 : 0.75)); drawShip(x[1], 0, 1);
					pop();
					p += W;

				}else if(x[0] == "module"){
					const W = S*40;
					push(); translate(p+W/2, Y);
					scale(S * (H ? 1 : 0.75)); drawModule(x[1]);
					pop();
					p += W;
				}
		}

		pop();

	}else{
		const P = guideUI.now;
		const Y = height/2-min(height-120, 500)/2 + 90;

		if(P == guideUI.info){
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.info, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.movement){
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.movement, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.combat){
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.combat, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.modules){
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.modules, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.quickMatch){
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.quickMatch, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.arena){
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.arena, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.battleship){
			push(); translate(width/2-60, Y+10);
			rotate(PI*1.85);
			drawShip(BS, 0, 0);
			pop();
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(BS, 1, 0);
			pop();
			push(); translate(width/2+60, Y+10);
			rotate(PI*1.85);
			drawShip(BS, 2, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.battleship, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.sentinel){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(SENTINEL, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.sentinel, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.guardian){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(GUARD, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.guardian, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.interceptor){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(INT, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.interceptor, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.colossus){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(COL, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.colossus, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.bomber){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(BOMBER, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			textSize(15);
			text(BODY.bomber, width/2-120, Y+50, 240, 1000);
			pop();
		}
	}
}

function controlGuide(){
	const N = guideUI.tree[guideUI.now];

	if(mouseIn(width/2-150 + 40, height/2-min(height-120, 500)/2 + 30, 40, 20)){
		if(N.par != null) guideUI.now = N.par;
		else showGuide = false;
		return;
	}

	if(N.child.length){

		for(let i=0; i<N.child.length; ++i){
			const C = guideUI.tree[N.child[i]];
			let bound = 0;

			const S = N.child.length*40 > min(height-120, 500)-90 ? 0.75 : 1;

			textSize(S*15);

			for(let x of C.info)
				if(typeof x == "string"){
					bound += textWidth(x) + 20*S;

				}else if(x[0] == "ship"){
					bound += S*([SENTINEL, GUARD].includes(x[1]) ? 30 : 60);

				}else if(x[0] == "module"){
					bound += S*40;
				}

			const Y = height/2-min(height-120, 500)/2 + 90 + S*40*i;
			if(mouseIn(width/2, Y, 20+bound/2, S*20)){
				guideUI.now = N.child[i];
				return;
			}
		}

	}else{
		// probably nothing
	}
}

const BODY = {
	info: "Hades' Star is a space combat game where players pilot battleships in a 2-d arena.\n\nBattleships equip weapons, shields, modules, and drones in combat against various player- and computer-controlled enemies.\n\nPlayers may compete in multiplayer arenas, or play solo.",
	
	movement: "Ships in Hades' Star cannot move arbitrarily. Players may only direct their Battleship and drones to move towards locations of asteroids, and once a ship has started moving, it cannot be cancelled.\n\nIn order to move, select your Battleship by clicking on it, and either press the arrow in the control dialog or drag your ship to the desired location. The ship then begins a 10-second countdown before departing, allowing you to cancel the movement. If you wish to depart immediately, press the arrow again (it should now turn into a check mark).",
	combat: "Weapons auto-target and auto-activate without the need for player input. Each Weapon has a specific range, and begins firing on enemy ships that come within its range, up to its maximum number of targets.\n\nA Weapon will not stop firing upon an enemy ship until it is out of range, or a module such as Decoy Drone has been used to forcibly switch targeting.\n\nSelecting any Ship will display a circle representing its attack radius (or blast radius in the case of rockets) as well as any radii of nearby enemies.",
	modules: "Many shields, modules, and drones must be manually activated. To trigger them, select the owner Ship, and click on the relevant icon in the control dialog. Once activated, the module will take some time to recharge before it can be used again.\n\nSome modules, such as Teleport, require the player to select a destination upon activation.\n\nThe modules of enemy Battleships are not visible until they have been used. In the case of automatically activated modules, such as Weapons, they reveal once the Ship has begun firing upon an enemy.",

	quickMatch: "Quick Match is the default gamemode and the only one currently available. Battleships compete within a 5x5 sector map populated by all Cerberus variations as well as Lone Battleships. All player-controlled battleships are hostile to one another.",
	arena: "Nothing to see here yet!",

	battleship: "Battleships are powerful combat vessels which may equip one Weapon, one Shield, two Modules, and one Drone. With a 7k health pool, they can absorb significant damage.\n\nIn addition to player controlled Battleships, several computer controlled Lone Battleships may jump into the arena at various points throughout the round. These ships are characterized by their darker red color.",
	sentinel: "Cerberus Sentinels are dangerous, equipping powerful cannons that deal 200 DPS, but have a small 1.2k health pool. When hidden behind other enemy ships, Sentinels can pose a significant threat.\n\nSentinels do not leave their assigned sectors.",
	guardian: "Cerberus Guardians deal the lowest damage out of any ship in the game at 60 DPS. However, they have a high health pool of 8k, and can be dangerous by protecting other enemy ships from fire.\n\nGuardians do not leave their assigned sectors.",
	interceptor: "Cerberus Interceptors deal 100 DPS to up to four targets in range, rendering Decoy Drones useless. Despite their high health pool of 9k, Interceptors do not actively pursue player ships and are thus not a threat.\n\nInterceptors are not limited to any sector and patrol the map at random.",
	colossus: "",
	bomber: "",
};
