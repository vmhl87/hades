let showGuide = false, guideUI = {};

{
	let ct = 0;

	guideUI.start = ct++;

	guideUI.credits = ct++;
	guideUI.gameplay = ct++;
	guideUI.ship = ct++;
	guideUI.weapon = ct++;
	guideUI.shield = ct++;
	guideUI.module = ct++;
	guideUI.drone = ct++;

	guideUI.intro = ct++;
	guideUI.movement = ct++;
	guideUI.combat = ct++;
	guideUI.modules = ct++;
	guideUI.keyboardShortcuts = ct++;

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
	guideUI.pulse = ct++;

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
	guideUI.bond = ct++;
	guideUI.disrupt = ct++;

	guideUI.decoy = ct++;
	guideUI.rocket = ct++;
	guideUI.turret = ct++;
	guideUI.phase = ct++;
	guideUI.warp = ct++;
	guideUI.bomb = ct++;

	guideUI.tree = new Array(ct);

	for(let i=0; i<guideUI.tree.length; ++i)
		guideUI.tree[i] = {par: null, child: [], info: []};

	function subpage(node, child){
		guideUI.tree[node].child.push(child);
		guideUI.tree[child].par = node;
	}

	for(let x=guideUI.credits; x<=guideUI.drone; ++x)
		subpage(guideUI.start, x);

	for(let x=guideUI.intro; x<=guideUI.keyboardShortcuts; ++x)
		subpage(guideUI.gameplay, x);

	for(let x=guideUI.battleship; x<=guideUI.bomber; ++x)
		subpage(guideUI.ship, x);

	for(let x=guideUI.laser; x<=guideUI.pulse; ++x)
		subpage(guideUI.weapon, x);

	for(let x=guideUI.alpha; x<=guideUI.ally; ++x)
		subpage(guideUI.shield, x);

	for(let x=guideUI.emp; x<=guideUI.disrupt; ++x)
		subpage(guideUI.module, x);

	for(let x=guideUI.decoy; x<=guideUI.bomb; ++x)
		subpage(guideUI.drone, x);

	function info(page){
		return guideUI.tree[page].info;
	}

	info(guideUI.start).push("Guide");

	info(guideUI.credits).push("Credits");
	info(guideUI.gameplay).push("Gameplay");
	info(guideUI.ship).push("Ships");
	info(guideUI.weapon).push("Weapons");
	info(guideUI.shield).push("Shields");
	info(guideUI.module).push("Modules");
	info(guideUI.drone).push("Drones");

	info(guideUI.intro).push("Introduction");
	info(guideUI.movement).push("Movement");
	info(guideUI.combat).push("Combat");
	info(guideUI.modules).push("Modules");
	info(guideUI.keyboardShortcuts).push("Keyboard Shortcuts");

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
	info(guideUI.pulse).push(["module", PULSE]);
	info(guideUI.pulse).push("Pulse");

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
	info(guideUI.bond).push(["module", BOND]);
	info(guideUI.bond).push("Bond");
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
	info(guideUI.bomb).push(["module", BOMB]);
	info(guideUI.bomb).push("Remote Bomb");

	guideUI.now = guideUI.start;
	guideUI.time = Date.now();
};

function drawGuide(){
	push();
	fill(0, 20, 30); stroke(20, 70, 80); strokeWeight(3);
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

			const S = N.child.length*40 > min(height-120, 500)-40 ? 0.75 : 1;

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

		function _text(T, x, y, w, h){
			let n = 15;

			textSize(n); fill(200);

			while(font.textBounds(wrap(T, w), 0, 0).h > min(h, height/2+min(height-120, 500)/2-20 - y))
				textSize(--n);

			text(wrap(T, w), x, y);
		}

		if(P == guideUI.credits){
			push(); textAlign(LEFT, TOP);
			_text(BODY.credits, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.intro){
			push(); textAlign(LEFT, TOP);
			_text(BODY.intro, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.movement){
			push(); textAlign(LEFT, TOP);
			_text(BODY.movement, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.combat){
			push(); textAlign(LEFT, TOP);
			_text(BODY.combat, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.modules){
			push(); textAlign(LEFT, TOP);
			_text(BODY.modules, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.keyboardShortcuts){
			push(); textAlign(LEFT, TOP);
			_text(BODY.keyboardShortcuts, width/2-120, Y, 240, 1000);
			pop();

		}else if(P == guideUI.battleship){
			push(); translate(width/2-90, Y+10);
			rotate(PI*1.85);
			drawShip(BS, 0, 0);
			pop();
			push(); translate(width/2-30, Y+10);
			rotate(PI*1.85);
			drawShip(BS, 3, 0);
			pop();
			push(); translate(width/2+30, Y+10);
			rotate(PI*1.85);
			drawShip(BS, 2, 0);
			pop();
			push(); translate(width/2+90, Y+10);
			rotate(PI*1.85);
			drawShip(BS, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			_text(BODY.battleship, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.sentinel){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(SENTINEL, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			_text(BODY.sentinel, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.guardian){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(GUARD, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			_text(BODY.guardian, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.interceptor){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(INT, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			_text(BODY.interceptor, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.colossus){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(COL, 1, 0);
			pop();
			push(); textAlign(LEFT, TOP);
			_text(BODY.colossus, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.bomber){
			push(); translate(width/2, Y+10);
			rotate(PI*1.85);
			drawShip(BOMBER, 1, 0);
			pop();

			push(); translate(width/2-60*cos(PI*0.1), Y+10-60*sin(PI*0.1));
			rotate(PI*1.1);
			drawShip(BOMBERP, 1, 1);
			pop();
			push(); translate(width/2+60*cos(PI*0.1), Y+10+60*sin(PI*0.1));
			rotate(PI*0.1);
			drawShip(BOMBERP, 1, 1);
			pop();

			push(); translate(width/2+60*cos(PI*0.1), Y+10-60*sin(PI*0.1));
			rotate(-PI*0.1);
			drawShip(BOMBERP, 1, 1);
			pop();
			push(); translate(width/2-60*cos(PI*0.1), Y+10+60*sin(PI*0.1));
			rotate(PI*0.9);
			drawShip(BOMBERP, 1, 1);
			pop();

			push(); translate(width/2-70, Y+10);
			rotate(PI);
			drawShip(BOMBERP, 1, 1);
			pop();
			push(); translate(width/2+70, Y+10);
			drawShip(BOMBERP, 1, 1);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(BODY.bomber, width/2-120, Y+50, 240, 1000);
			pop();

		}else if(P == guideUI.laser){
			const T = 12;
			const O = (((Date.now()-guideUI.time)/1000) % (T+2)) - 1;

			const H1 = O < 1.5 ? 0 : (O-1.5)*60;
			const H2 = O < 1.5 ? 0 : (O < 6 ? (O-1.5)*160 : (O < 10 ? 880+(O-6)*300 : 2080+(O-10)*600));

			push(); translate(width/2, Y+40);
			drawShip3({type: BS, rot: PI*1.85, hp: HP[BS] - H1});
			pop();

			const P = O < 2 ? -40 + (O-2)*30 : -40;

			push();
			stroke(100, 200, 200, 60); strokeWeight(3);
			line(width/2 + P, Y+10, width/2 - 40, Y+10);
			translate(width/2 + P, Y+10);
			drawShip3({type: GUARD, hp: HP[GUARD] - H2,
				rot: O < 2.2 ? 0 : (O < 2.5 ? PI*(2-0.15*(O-2.2)*1/0.3) : PI*1.85),
				move: O < 2.2 ? [3] : null});
			pop();

			const P1 = [width/2 + 17*cos(PI*1.85), Y+40 + 17*sin(PI*1.85)];
			const P2 = [width/2 + P + 8, Y+10];

			push();
			if(dist(0, 40, P, 30) < 80){
				fill(200, 100, 50, 150); noStroke();
				circle(...P1, 12*(5+sin(Date.now()/16/20))/5);
				circle(width/2 + P, Y+10, 7*(8+sin(Date.now()/16/20))/8);
				if(O < 6){
					stroke(200, 100, 50); strokeWeight(2);
					line(...P1, width/2 + P, Y+10);
				}else if(O < 10){
					stroke(200, 100, 50); strokeWeight(4);
					line(...P1, width/2 + P, Y+10);
				}else{
					stroke(200, 100, 50); strokeWeight(6);
					line(...P1, width/2 + P, Y+10);
					stroke(255, 150, 100); strokeWeight(3);
					line(...P1, width/2 + P, Y+10);
				}
				stroke(200, 100, 50); strokeWeight(2);
				const L = ((Date.now()/16/20) % 1) * 0.9;
				line(..._lerp(P2, [width/2, Y+40], L),
					..._lerp(P2, [width/2, Y+40], L+0.1));
			}
			pop();

			if(O < 0){
				fill(0, 20, 30, (-O)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			if(O > T){
				fill(0, 20, 30, (O-T)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			push(); textAlign(LEFT, TOP);
			_text(INFO[LASER] + "\n\n" + STATS[LASER], width/2-120, Y+120, 240, 1000);
			pop();

		}else if(P == guideUI.cannon){
			const T = 12;
			const O = (((Date.now()-guideUI.time)/1000) % (T+2)) - 1;

			const H1 = O < 1.5 ? 0 : (O-1.5)*60;
			const H2 = O < 1.5 ? 0 : (O-1.5)*284;

			push(); translate(width/2, Y+40);
			drawShip3({type: BS, rot: PI*1.85, hp: HP[BS] - H1});
			pop();

			const P = O < 2 ? -40 + (O-2)*30 : -40;

			push();
			stroke(100, 200, 200, 60); strokeWeight(3);
			line(width/2 + P, Y+10, width/2 - 40, Y+10);
			translate(width/2 + P, Y+10);
			drawShip3({type: GUARD, hp: HP[GUARD] - H2,
				rot: O < 2.2 ? 0 : (O < 2.5 ? PI*(2-0.15*(O-2.2)*1/0.3) : PI*1.85),
				move: O < 2.2 ? [3] : null});
			pop();

			const P1 = [width/2 + 17*cos(PI*1.85), Y+40 + 17*sin(PI*1.85)];
			const P2 = [width/2 + P + 8, Y+10];

			push();
			if(dist(0, 40, P, 30) < 80){
				stroke(200, 100, 50); strokeWeight(2);
				let L = ((Date.now()/16/20) % 1) * 0.9;
				line(..._lerp(P2, [width/2, Y+40], L),
					..._lerp(P2, [width/2, Y+40], L+0.1));
				L = ((Date.now()/16/20 + 0.4) % 1) * 0.9;
				line(..._lerp(P1, [width/2 + P, Y+10], L),
					..._lerp(P1, [width/2 + P, Y+10], L+0.1));
			}
			pop();

			if(O < 0){
				fill(0, 20, 30, (-O)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			if(O > T){
				fill(0, 20, 30, (O-T)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			push(); textAlign(LEFT, TOP);
			_text(INFO[CANNON] + "\n\n" + STATS[CANNON], width/2-120, Y+120, 240, 1000);
			pop();

		}else if(P == guideUI.spreadCannon){
			const T = 12;
			const O = (((Date.now()-guideUI.time)/1000) % (T+2)) - 1;

			const H1 = (O < 1.5 ? 0 : (O-1.5)*60) + O*120;
			const H2 = O < 1.5 ? 0 : (O-1.5)*210;
			const H3 = O*210;

			push(); translate(width/2, Y+40);
			drawShip3({type: BS, rot: PI*1.85, hp: HP[BS] - H1});
			pop();

			const P = O < 2 ? -40 + (O-2)*30 : -40;

			push();
			stroke(100, 200, 200, 60); strokeWeight(3);
			line(width/2 + P, Y+10, width/2 - 40, Y+10);
			translate(width/2 + P, Y+10);
			drawShip3({type: GUARD, hp: HP[GUARD] - H2,
				rot: O < 2.2 ? 0 : (O < 2.5 ? PI*(2-0.15*(O-2.2)*1/0.3) : PI*1.85),
				move: O < 2.2 ? [3] : null});
			pop();
			push();
			translate(width/2 + 50, Y+60);
			drawShip3({type: GUARD, hp: HP[GUARD] - H3, rot: PI*1.85});
			pop();
			push();
			translate(width/2 -10, Y+80);
			drawShip3({type: GUARD, hp: HP[GUARD] - H3, rot: PI*1.85});
			pop();

			const P1 = [width/2 + 17*cos(PI*1.85), Y+40 + 17*sin(PI*1.85)];
			const P2 = [width/2 + P + 8, Y+10];

			push();
			stroke(200, 100, 50); strokeWeight(2);
			let L = 0;
			if(dist(0, 40, P, 30) < 80){
				L = ((Date.now()/16/20) % 1) * 0.9;
				line(..._lerp(P2, [width/2, Y+40], L),
					..._lerp(P2, [width/2, Y+40], L+0.1));
				L = ((Date.now()/16/20 + 0.4) % 1) * 0.9;
				line(..._lerp(P1, [width/2 + P, Y+10], L),
					..._lerp(P1, [width/2 + P, Y+10], L+0.1));
			}
			L = ((Date.now()/16/20 + 0.1) % 1) * 0.9;
			line(..._lerp(P1, [width/2 + 50, Y+60], L),
				..._lerp(P1, [width/2 + 50, Y+60], L+0.1));
			L = ((Date.now()/16/20 + 0.7) % 1) * 0.9;
			line(..._lerp(P1, [width/2 - 10, Y+80], L),
				..._lerp(P1, [width/2 - 10, Y+80], L+0.1));
			L = ((Date.now()/16/20 + 0.2) % 1) * 0.9;
			line(..._lerp([width/2 + 56, Y+56], [width/2, Y+40], L),
				..._lerp([width/2 + 56, Y+56], [width/2, Y+40], L+0.1));
			L = ((Date.now()/16/20 + 0.8) % 1) * 0.9;
			line(..._lerp([width/2 - 4, Y+76], [width/2, Y+40], L),
				..._lerp([width/2 - 4, Y+76], [width/2, Y+40], L+0.1));
			pop();

			if(O < 0){
				fill(0, 20, 30, (-O)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			if(O > T){
				fill(0, 20, 30, (O-T)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			push(); textAlign(LEFT, TOP);
			_text(INFO[SPREAD] + "\n\n" + STATS[SPREAD], width/2-120, Y+120, 240, 1000);
			pop();

		}else if(P == guideUI.dualLaser){
			const T = 12;
			const O = (((Date.now()-guideUI.time)/1000) % (T+2)) - 1;

			const H1 = (O < 1.5 ? 0 : (O-1.5)*60) + O*60;
			const H2 = O < 1.5 ? 0 : (O < 4.5 ? (O-1.5)*185 : (O < 7.5 ? 3*185 + (O-4.5)*450 : 3*185 + 3*450 + (O-7.5)*800));
			const H3 = O < 4.5 ? O*185 : (O < 7.5 ? 4.5*185 + (O-4.5)*450 : 4.5*185 + 3*450 + (O-7.5)*800);

			push(); translate(width/2, Y+40);
			drawShip3({type: BS, rot: PI*1.85, hp: HP[BS] - H1});
			pop();

			const P = O < 2 ? -40 + (O-2)*30 : -40;

			push();
			stroke(100, 200, 200, 60); strokeWeight(3);
			line(width/2 + P, Y+10, width/2 - 40, Y+10);
			translate(width/2 + P, Y+10);
			drawShip3({type: GUARD, hp: HP[GUARD] - H2,
				rot: O < 2.2 ? 0 : (O < 2.5 ? PI*(2-0.15*(O-2.2)*1/0.3) : PI*1.85),
				move: O < 2.2 ? [3] : null});
			pop();
			push();
			translate(width/2 -10, Y+80);
			drawShip3({type: GUARD, hp: HP[GUARD] - H3, rot: PI*1.85});
			pop();

			const P1 = [width/2 + 17*cos(PI*1.85), Y+40 + 17*sin(PI*1.85)];
			const P2 = [width/2 + P + 8, Y+10];

			push();
			fill(200, 100, 50, 150); noStroke();
			circle(...P1, 12*(5+sin(Date.now()/16/20))/5);
			let L = 0;
			if(dist(0, 40, P, 30) < 80){
				fill(200, 100, 50, 150); noStroke();
				circle(width/2 + P, Y+10, 7*(8+sin(Date.now()/16/20))/8);
				stroke(200, 100, 50); strokeWeight(2);
				L = ((Date.now()/16/20) % 1) * 0.9;
				line(..._lerp(P2, [width/2, Y+40], L),
					..._lerp(P2, [width/2, Y+40], L+0.1));
				if(O < 4.5){
					stroke(200, 100, 50); strokeWeight(2);
					line(...P1, width/2 + P, Y+10);
				}else if(O < 7.5){
					stroke(200, 100, 50); strokeWeight(4);
					line(...P1, width/2 + P, Y+10);
				}else{
					stroke(200, 100, 50); strokeWeight(6);
					line(...P1, width/2 + P, Y+10);
					stroke(255, 150, 100); strokeWeight(3);
					line(...P1, width/2 + P, Y+10);
				}
			}
			fill(200, 100, 50, 150); noStroke();
			circle(width/2 - 10, Y+80, 7*(8+sin(Date.now()/16/20))/8);
			stroke(200, 100, 50); strokeWeight(2);
			L = ((Date.now()/16/20 + 0.7) % 1) * 0.9;
			line(..._lerp(P1, [width/2 - 10, Y+80], L),
				..._lerp(P1, [width/2 - 10, Y+80], L+0.1));
			if(O < 4.5){
				stroke(200, 100, 50); strokeWeight(2);
				line(...P1, width/2 - 10, Y+80);
			}else if(O < 7.5){
				stroke(200, 100, 50); strokeWeight(4);
				line(...P1, width/2 - 10, Y+80);
			}else{
				stroke(200, 100, 50); strokeWeight(6);
				line(...P1, width/2 - 10, Y+80);
				stroke(255, 150, 100); strokeWeight(3);
				line(...P1, width/2 - 10, Y+80);
			}
			stroke(200, 100, 50); strokeWeight(2);
			L = ((Date.now()/16/20 + 0.8) % 1) * 0.9;
			line(..._lerp([width/2 - 4, Y+76], [width/2, Y+40], L),
				..._lerp([width/2 - 4, Y+76], [width/2, Y+40], L+0.1));
			pop();

			if(O < 0){
				fill(0, 20, 30, (-O)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			if(O > T){
				fill(0, 20, 30, (O-T)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			push(); textAlign(LEFT, TOP);
			_text(INFO[LASER2] + "\n\n" + STATS[LASER2], width/2-120, Y+120, 240, 1000);
			pop();

		}else if(P == guideUI.rocketLauncher){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[DART] + "\n\n" + STATS[DART], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.pulse){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[PULSE] + "\n\n" + STATS[PULSE], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.alpha){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[ALPHA] + "\n\n" + STATS[ALPHA], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.delta){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[DELTA] + "\n\n" + STATS[DELTA], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.omega){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[OMEGA] + "\n\n" + STATS[OMEGA], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.passive){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[PASSIVE] + "\n\n" + STATS[PASSIVE], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.mirror){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[MIRROR] + "\n\n" + STATS[MIRROR], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.ally){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[ALLY] + "\n\n" + STATS[ALLY], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.emp){
			const T = 9;
			const O = (((Date.now()-guideUI.time)/1000) % (T+2)) - 1;

			const H1 = O <= 0.5 ? 0 : (O <= 1 ? (O-0.5)*100 : (O < 8 ? (50 + (O-8)*100) : 50));
			const H2 = O <= 0.5 ? 0 : (O < 6 ? (O-0.5)*160 : (O < 8 ? 880+(O-6)*500 : 1880));

			push(); translate(width/2, Y+40);
			if(O > 1 && O < 5) drawEffect(EMP, 1-(O-1)/4);
			drawShip3({type: BS, rot: PI*1.85, hp: HP[BS] - H1});
			pop();

			const P = O <= 1 ? -40 + (O-1)*40 : (O >= 7 ? -40 + (O-7)*40 : -40);

			push();
			stroke(100, 200, 200, 60); strokeWeight(3);
			line(width/2 + P, Y, width/2 + 130, Y);
			translate(width/2 + P, Y);
			drawShip3({type: INT, emp: O > 1 && O < 7, hp: HP[INT] - H2});
			pop();

			const P1 = [width/2 + 17*cos(PI*1.85), Y+40 + 17*sin(PI*1.85)];
			const P2 = [width/2 + P + 17, Y];

			push();
			if(dist(0, 40, P, 0) < 80){
				fill(200, 100, 50, 150); noStroke();
				circle(...P1, 12*(5+sin(Date.now()/16/20))/5);
				circle(width/2 + P, Y, 7*(8+sin(Date.now()/16/20))/8);
				if(O < 6){
					stroke(200, 100, 50); strokeWeight(2);
					line(...P1, width/2 + P, Y);
				}else if(O < 10){
					stroke(200, 100, 50); strokeWeight(4);
					line(...P1, width/2 + P, Y);
				}
				if(O <= 1 || O >= 7){
					stroke(200, 100, 50); strokeWeight(2);
					const L = ((Date.now()/16/20) % 1) * 0.9;
					line(..._lerp(P2, [width/2, Y+40], L),
						..._lerp(P2, [width/2, Y+40], L+0.1));
				}
			}
			pop();

			if(O < 0){
				fill(0, 20, 30, (-O)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			if(O > T){
				fill(0, 20, 30, (O-T)*255); noStroke();
				rect(width/2-140, Y-40, 280, 180);
			}

			push(); textAlign(LEFT, TOP);
			_text(INFO[EMP] + "\n\n" + STATS[EMP], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.duel){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[DUEL] + "\n\n" + STATS[DUEL], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.fortify){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[FORT] + "\n\n" + STATS[FORT], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.teleport){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[TP] + "\n\n" + STATS[TP], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.amplify){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[AMP] + "\n\n" + STATS[AMP], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.leap){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[LEAP] + "\n\n" + STATS[LEAP], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.barrier){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[BARRIER] + "\n\n" + STATS[BARRIER], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.strike){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[STRIKE] + "\n\n" + STATS[STRIKE], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.bond){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[BOND] + "\n\n" + STATS[BOND], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.disrupt){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[DISRUPT] + "\n\n" + STATS[DISRUPT], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.decoy){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[DECOY] + "\n\n" + STATS[DECOY], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.rocket){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[ROCKET] + "\n\n" + STATS[ROCKET], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.turret){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[TURRET] + "\n\n" + STATS[TURRET], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.phase){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[PHASE] + "\n\n" + STATS[PHASE], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.warp){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[WARP] + "\n\n" + STATS[WARP], width/2-120, Y+150, 240, 1000);
			pop();

		}else if(P == guideUI.bomb){
			push();
			textAlign(CENTER, CENTER); textSize(18);
			fill(200 + sin(Date.now()/300)*55); noStroke();
			text("PREVIEW UNDER\nCONSTRUCTION", width/2, Y+40);
			pop();

			push(); textAlign(LEFT, TOP);
			_text(INFO[BOMB] + "\n\n" + STATS[BOMB], width/2-120, Y+150, 240, 1000);
			pop();

		}else{
			push(); textAlign(LEFT, TOP);
			_text("This page is under construction.", width/2-120, Y, 240, 1000);
			pop();
		}
	}
}

function controlGuide(){
	const N = guideUI.tree[guideUI.now];

	if(mouseIn(width/2-150 + 40, height/2-min(height-120, 500)/2 + 30, 40, 20)){
		if(N.par != null) guideUI.now = N.par;
		else showGuide = false;
		guideUI.time = Date.now();
		return;
	}

	if(N.child.length){

		for(let i=0; i<N.child.length; ++i){
			const C = guideUI.tree[N.child[i]];
			let bound = 0;

			const S = N.child.length*40 > min(height-120, 500)-40 ? 0.75 : 1;

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
				guideUI.time = Date.now();
				return;
			}
		}

	}else{
		// probably nothing
	}
}

const BODY = {
	credits: "First and foremost, this is a fanmade clone of the original Hades' Star video game.\n\nMany of the ships and modules were modeled after their Hades' Star counterparts, both in visual design and function.\n\nAll of the code on this game is original and available here:  github.com/vmhl87/hades",

	intro: "In this space combat game, players pilot battleships in a 2-d arena. Battleships equip weapons, shields, modules, and drones in combat against various player- and computer-controlled enemies.\n\nPlayers may compete in multiplayer arenas, or play solo.",
	movement: "Ships in Hades' Star cannot move arbitrarily. Players may only direct their Battleship and drones to move towards locations of asteroids, and once a ship has started moving, it cannot be cancelled.\n\nIn order to move, select your Battleship by clicking on it, and either press the arrow in the control dialog or drag your ship to the desired location. The ship then begins a 10-second countdown before departing, allowing you to cancel the movement. If you wish to depart immediately, press the arrow again (it should now turn into a check mark).",
	combat: "Weapons auto-target and auto-activate without the need for player input. Each Weapon has a specific range, and begins firing on enemy ships that come within its range, up to its maximum number of targets.\n\nA Weapon will not stop firing upon an enemy ship until it is out of range, or a module such as Decoy Drone has been used to forcibly switch targeting.\n\nSelecting any Ship will display a circle representing its attack radius (or blast radius in the case of rockets) as well as any radii of nearby enemies.",
	modules: "Many shields, modules, and drones must be manually activated. To trigger them, select the owner Ship, and click on the relevant icon in the control dialog. Once activated, the module will take some time to recharge before it can be used again.\n\nSome modules, such as Teleport, require the player to select a destination upon activation.\n\nThe modules of enemy Battleships are not visible until they have been used. In the case of automatically activated modules, such as Weapons, they reveal once the Ship has begun firing upon an enemy.",
	keyboardShortcuts: "W - select your Battleship\n\nE - select movement destination\n\nX - cancel movement\n\nA/S/D/F/G - activate slot 1/2/3/4/5",

	battleship: "Battleships are powerful combat vessels which may equip one Weapon, one Shield, two Modules, and one Drone. With a 7k health pool, they can absorb significant damage.\n\nIn addition to player controlled Battleships, several computer controlled Lone Battleships may jump into the arena at various points throughout the round. Some Lone Battleships equip an unobtainable VENGEANCE module. Lone Battleships are identified by their pale salmon color.",
	sentinel: "Cerberus Sentinels are dangerous, equipping powerful cannons that deal 200 DPS, but have a small 1.2k health pool. When hidden behind other enemy ships, Sentinels can pose a significant threat.\n\nSentinels do not leave their assigned sector.",
	guardian: "Cerberus Guardians deal the lowest damage out of any ship in the game at 60 DPS. However, they have a high health pool of 8k, and can be dangerous by protecting other enemy ships from fire.\n\nGuardians do not leave their assigned sector.",
	interceptor: "Cerberus Interceptors deal 100 DPS to up to four targets in range, rendering Decoy Drones useless. Despite their high health pool of 9k, Interceptors do not actively pursue player ships and are thus not a threat.\n\nInterceptors are not limited to any sector and patrol the map at random.",
	colossus: "Cerberus Colossus equip a laser weapon that initially deals low damage (60 DPS) but slowly increases (to a maximum of 600 DPS). With a massive 20k health pool, Colossus are difficult to take down.\n\nColossus additionally equip a special APOCALYPSE module that triggers upon their death. Once triggered, a 40-second countdown initiates, upon which one to five sectors in the arena implode. All ships caught in the blast are instantly destroyed, and the resulting sector glows red for the rest of the game, damaging all ships within them (150 DPS).\n\nColossus do not leave their assigned sector.",
	bomber: "Cerberus Bombers equip a Rocket Barrage weapon that periodically (every 24 seconds) fires one rocket at every enemy ship within range. In addition to their significant health pool of 16k, Bombers actively pathfind away from enemy ships and thus are quite difficult to kill.\n\nBombers do not leave their assigned sector.",
};
