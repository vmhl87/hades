let showGuide = false, guideUI = {};

{
	let ct = 0;

	guideUI.start = ct++;

	guideUI.info = ct++;
	guideUI.gameMode = ct++;
	guideUI.ship = ct++;
	guideUI.weapon = ct++;
	guideUI.shield = ct++;
	guideUI.module = ct++;
	guideUI.drone = ct++;

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
	info(guideUI.gameMode).push("Game Modes");
	info(guideUI.ship).push("Ships");
	info(guideUI.weapon).push("Weapons");
	info(guideUI.shield).push("Shields");
	info(guideUI.module).push("Modules");
	info(guideUI.drone).push("Drones");

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
