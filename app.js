let font = null;

let modules = [null, null, null, null, null];

let searching = 0, staging = 1, chooseModule = -1,
	open = 0, connected = 0;

function preload(){
	font = loadFont('Ubuntu-Regular.ttf');
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER);
	textFont(font);

	if(localStorage.getItem("modules")){
		modules = JSON.parse(localStorage.getItem("modules"));
	}

	for(let element of document.getElementsByClassName("p5Canvas"))
		element.addEventListener("contextmenu", e => e.preventDefault())
}

let ships = [], rocks = [], blasts = [], deaths = [], heals = [], gameID = null, ROWS, COLS;

socket.on("reset", () => {
	searching = 0;
	staging = 1;
	open = 0;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;
});

socket.on("start", data => {
	chooseModule = -1;
	searching = 0;
	staging = 0;
	open = 0;
	connected = 1;
	select = null;
	selectMove = null;

	ROWS = data.rows;
	COLS = data.cols;

	gameID = data.uid;

	ships = [];
	for(let s of data.ships)
		ships.push(new Ship(s));

	rocks = data.rocks;

	blasts = [];
	deaths = [];

	camera.x = 0;
	camera.y = 0;
	camera.z = 1;

	for(let s of data.ships)
		if(s.type == BS && s.team == socket.id){
			camera.x = s.pos[0];
			camera.y = s.pos[1];
		}

	focus = null;
});

socket.on("state", data => {
	let uids = new Set();
	for(let d of data.s) uids.add(d.uid);

	ships = ships.filter(x => uids.has(x.uid));

	uids = new Set();
	for(let s of ships){
		for(let d of data.s){
			if(s.uid == d.uid){
				s.decode(d);
			}
		}
		uids.add(s.uid);
	}

	for(let d of data.s) if(!uids.has(d.uid)){
		ships.push(new Ship(d));
	}

	for(let e of data.ev){
		const T = e[0], D = e[1];

		if(T == "explode"){
			blasts.push([D[0], D[1], Date.now() + 200*D[2]]);
		}

		if(T == "die"){
			deaths.push([D, Date.now() + 3000]);
		}

		if(T == "heal"){
			heals.push([D, Date.now() + 2000]);
		}
	}
});

socket.on("end", () => {
	chooseModule = -1;
	searching = 0;
	staging = 1;
	open = 0;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;
});

function draw(){
	if(!staging && mouseIsPressed){
		const dist = _dist([mouseX, mouseY], [lastMouseX, lastMouseY]);
		if(dist > 0.5){
			camera.x += (lastMouseX-mouseX)/camera.z;
			camera.y += (lastMouseY-mouseY)/camera.z;
		}
		if(dist > 4) moved = true;
	}

	lastMouseX = mouseX;
	lastMouseY = mouseY;

	background(0, 10, 25);

	if(staging){
		fill(200); noStroke();
		push(); translate(width/2, height/2-100);
		scale(5); drawShip(BS, 0, 1);
		pop();

		if(ALLMODULE){
			for(let i=0; i<5; ++i){
				push(); translate(width/2-100+50*i, height/2+50);
				drawModule2(modules[i], mouseIn(width/2-100+i*50, height/2+50, 20, 20) ? 1 : 0);
				pop();
			}

		}else{
			fill(255, 50, 50, searching ? 60 :
				(mouseIn(width/2-100, height/2+50, 20, 20) || chooseModule == 0 ? 80 : 60));
			rect(width/2 - 120, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2-100, height/2 + 50);
			drawModule(modules[0]);
			pop();

			fill(0, 255, 255, searching ? 60 :
				(mouseIn(width/2-50, height/2+50, 20, 20) || chooseModule == 1 ? 80 : 60));
			rect(width/2 - 70, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2-50, height/2 + 50);
			drawModule(modules[1]);
			pop();

			fill(100, 255, 100, searching ? 60 :
				(mouseIn(width/2, height/2+50, 20, 20) || chooseModule == 2 ? 80 : 60));
			rect(width/2 - 20, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2, height/2 + 50);
			drawModule(modules[2]);
			pop();

			fill(100, 255, 100, searching ? 60 :
				(mouseIn(width/2+50, height/2+50, 20, 20) || chooseModule == 3 ? 80 : 60));
			rect(width/2 + 30, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2+50, height/2 + 50);
			drawModule(modules[3]);
			pop();

			fill(255, 100, 0, searching ? 60 :
				(mouseIn(width/2+100, height/2+50, 20, 20) || chooseModule == 4 ? 80 : 60));
			rect(width/2 + 80, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2+100, height/2 + 50);
			drawModule(modules[4]);
			pop();
		}

		if(searching){
			fill(0, 100);
			for(let i=0; i<5; ++i)
				rect(width/2-120+i*50, height/2+30, 40, 40);
		}

		if(chooseModule == -1){
			if(searching){
				fill(100 + (sin(frameCount/30)/2+0.5)*50);
				textSize(25); text("SCANNING", width/2, height/2 + 150);

				fill(mouseIn(width/2, height/2+200, 60, 15) ? 255 : 200);
				textSize(15); text("CANCEL", width/2, height/2 + 200);

				fill(mouseIn(width/2, height/2+230, 60, 15) ? 255 : 200);
				textSize(15); text("SOLO", width/2, height/2 + 230);

			}else{
				fill(mouseIn(width/2, height/2+150, 60, 30) ? 255 : 200);
				textSize(25); text("START", width/2, height/2 + 150);
			}

		}else{
			if(chooseModule == 0){
				for(let i=0; i<5; ++i){
					fill(255, 50, 50, mouseIn(width/2-100+i*50, height/2+150, 20, 20) ? 80 : 60);
					rect(width/2-120+i*50, height/2+130, 40, 40);
					push(); translate(width/2-100+i*50, height/2+150);
					drawModule(LASER+i);
					pop();
				}
			}

			if(chooseModule == 1){
				for(let i=0; i<6; ++i){
					fill(0, 255, 255, mouseIn(width/2-125+i*50, height/2+150, 20, 20) ? 80 : 60);
					rect(width/2-145+i*50, height/2+130, 40, 40);
					push(); translate(width/2-125+i*50, height/2+150);
					drawModule(ALPHA+i);
					pop();
				}
			}

			if(chooseModule == 2 || chooseModule == 3){
				for(let i=0; i<5; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+i ? 60 :
						(mouseIn(width/2-100+i*50, height/2+125, 20, 20) ? 80 : 60)
					);
					rect(width/2-120+i*50, height/2+105, 40, 40);
					push(); translate(width/2-100+i*50, height/2+125);
					drawModule(EMP+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+i) rect(width/2-120+i*50, height/2+105, 40, 40);
				}

				for(let i=0; i<5; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+5+i ? 60 :
						(mouseIn(width/2-100+i*50, height/2+175, 20, 20) ? 80 : 60)
					);
					rect(width/2-120+i*50, height/2+155, 40, 40);
					push(); translate(width/2-100+i*50, height/2+175);
					drawModule(EMP+5+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+5+i) rect(width/2-120+i*50, height/2+155, 40, 40);
				}
			}

			if(chooseModule == 4){
				for(let i=0; i<4; ++i){
					fill(255, 100, 0, mouseIn(width/2-75+i*50, height/2+150, 20, 20) ? 80 : 60);
					rect(width/2-95+i*50, height/2+130, 40, 40);
					push(); translate(width/2-75+i*50, height/2+150);
					drawModule(DECOY+i);
					pop();
				}
			}

			if(chooseModule < -1){
				for(let i=0; i<7; ++i){
					fill(255, 50, 50, mouseIn(width/2-150+i*50, height/2+125, 20, 20) ? 80 : 60);
					rect(width/2-170+i*50, height/2+105, 40, 40);
					push(); translate(width/2-150+i*50, height/2+125);
					drawModule(LASER+i);
					pop();
				}

				for(let i=0; i<6; ++i){
					fill(0, 255, 255, mouseIn(width/2-125+i*50, height/2+175, 20, 20) ? 80 : 60);
					rect(width/2-145+i*50, height/2+155, 40, 40);
					push(); translate(width/2-125+i*50, height/2+175);
					drawModule(ALPHA+i);
					pop();
				}

				for(let i=0; i<5; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+i ? 60 :
						(mouseIn(width/2-100+i*50, height/2+225, 20, 20) ? 80 : 60)
					);
					rect(width/2-120+i*50, height/2+205, 40, 40);
					push(); translate(width/2-100+i*50, height/2+225);
					drawModule(EMP+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+i) rect(width/2-120+i*50, height/2+205, 40, 40);
				}

				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+5+i ? 60 :
						(mouseIn(width/2-125+i*50, height/2+275, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+255, 40, 40);
					push(); translate(width/2-125+i*50, height/2+275);
					drawModule(EMP+5+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+5+i) rect(width/2-145+i*50, height/2+255, 40, 40);
				}

				for(let i=0; i<4; ++i){
					fill(255, 100, 0, mouseIn(width/2-75+i*50, height/2+325, 20, 20) ? 80 : 60);
					rect(width/2-95+i*50, height/2+305, 40, 40);
					push(); translate(width/2-75+i*50, height/2+325);
					drawModule(DECOY+i);
					pop();
				}
			}
		}

		if(SECDISP[0]){
			--SECDISP[0];

			SECDISP[1][0] = _lerp(SECDISP[1][0], [width/2-50, height/2-200], 0.1);
			SECDISP[1][1] = _lerp(SECDISP[1][1], [width/2, height/2-250], 0.1);
			SECDISP[1][2] = _lerp(SECDISP[1][2], [width/2+50, height/2-200], 0.1);

			const F = Math.min(1, SECDISP[0]/30);

			push();
			fill(lerp(0, 255, F), lerp(10, 180, F), lerp(25, 50, F)); noStroke();
			for(let i=0; i<3; ++i) circle(...SECDISP[1][i], 10);
			stroke(lerp(0, 255, F), lerp(10, 180, F), lerp(25, 50, F)); strokeWeight(3);
			line(...SECDISP[1][0], ...SECDISP[1][1]);
			line(...SECDISP[1][1], ...SECDISP[1][2]);
			pop();
		}

	}else if(connected){
		if(focus && focus[0] == "ship"){
			let found = false;
			for(let i=0; i<ships.length; ++i) if(ships[i].uid == focus[1]){
				shipID = i;
				found = true;
			}
			if(!found){
				focus = null;
				shipID = null;
			}
			
		}else shipID = null;

		for(let s of ships) s.travel();

		const w = 5, h = 3;

		push(); translate(width/2-camera.x*camera.z, height/2-camera.y*camera.z);
		stroke(200, 30); strokeWeight(2*sqrt(camera.z));
		for(let i=0; i<=ROWS; ++i)
			line(-300*COLS/2*camera.z,(-300*ROWS/2+i*300)*camera.z,
				300*COLS/2*camera.z, (-300*ROWS/2+i*300)*camera.z);
		for(let i=0; i<=COLS; ++i)
			line((-300*COLS/2+i*300)*camera.z, -300*ROWS/2*camera.z,
				(-300*COLS/2+i*300)*camera.z, 300*ROWS/2*camera.z);
		pop();

		if(selectMove != null){
			fill(255, 255, 100, 15); noStroke();
			let x = selected();
			if(x && x[0] == "rock" && (!focus || x[1] != focus[1]))
				circle(...screenPos(rocks[x[1]]), 20*sqrt(camera.z));
		}

		if(focus){
			fill(255, 15); noStroke();
			if(focus[0] == "rock") circle(...screenPos(rocks[focus[1]]), 20*sqrt(camera.z));
			if(focus[0] == "ship"){
				push();
				stroke(90, 100); fill(90, 30);
				if(selectMove == null) for(let i=0; i<ships[shipID].modules.length; ++i)
					if(mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 20, 20))
						if(RANGE[ships[shipID].modules[i].type] != null)
							circle(...screenPos(ships[shipID].vpos), RANGE[ships[shipID].modules[i].type]*2*camera.z);
				if(selectMove != null && selectMove[0] == "module" && RANGE[ships[shipID].modules[selectMove[1].i].type])
					circle(...screenPos(ships[shipID].vpos), RANGE[ships[shipID].modules[selectMove[1].i].type]*2*camera.z);
				pop();

				push();
				noFill(); stroke(...(ships[shipID].team == socket.id ? [70, 90, 90] : [90, 70, 70]), 100);
				let shade = true;
				for(let i=0; i<ships[shipID].modules.length; ++i){
					if(weaponRange(ships[shipID].modules[i].type) != null){
						circle(...screenPos(ships[shipID].vpos), weaponRange(ships[shipID].modules[i].type)*2*camera.z);
						shade = false;
					}
					if(ships[shipID].modules[i].type == ROCKETD)
						circle(...screenPos(ships[shipID].vpos), 60*2*camera.z);
				}
				if([DARTP, ROCKETP, DELTAP].includes(ships[shipID].type))
					circle(...screenPos(ships[shipID].move[ships[shipID].move.length-1]),
						RANGE[ships[shipID].type]*2*camera.z);
				if(shade){
					fill(255, 15); noStroke();
					circle(...screenPos(ships[shipID].vpos), 30*sqrt(camera.z));
				}
				pop();

				push();
				noFill(); stroke(90, 70, 70, 100);
				for(let s of ships) if(s.team != ships[shipID].team){
					let near = _dist(ships[shipID].vpos, s.vpos) < 130;
					if([DARTP, ROCKETP, DELTAP].includes(s.type))
						if(_dist(ships[shipID].vpos, s.move[s.move.length-1]) < RANGE[s.type]+20)
							circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					if(ships[shipID].wait){
						if(_linedist(ships[shipID].vpos, ships[shipID].wait, s.vpos) < 130) near = true;
						if([DARTP, ROCKETP, DELTAP].includes(s.type))
							if(_linedist(ships[shipID].vpos, ships[shipID].wait,
								s.move[s.move.length-1]) < RANGE[s.type]+20)
								circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					}
					if(ships[shipID].move.length){
						if(_linedist(ships[shipID].vpos, ships[shipID].move[0], s.vpos) < 130) near = true;
						if([DARTP, ROCKETP, DELTAP].includes(s.type))
							if(_linedist(ships[shipID].vpos, ships[shipID].move[0],
								s.move[s.move.length-1]) < RANGE[s.type]+20)
								circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					}
					for(let i=0; i<ships[shipID].move.length-1; ++i){
						if(_linedist(ships[shipID].move[i], ships[shipID].move[i+1], s.vpos) < 130) near = true;
						if([DARTP, ROCKETP, DELTAP].includes(s.type))
							if(_linedist(ships[shipID].move[i], ships[shipID].move[i+1],
								s.move[s.move.length-1]) < RANGE[s.type]+20)
								circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					}
					if(near) for(let i=0; i<s.modules.length; ++i){
						if(RANGE[s.modules[i].type])
							circle(...screenPos(s.vpos), weaponRange(s.modules[i].type)*2*camera.z);
						if(s.modules[i].type == ROCKETD)
							circle(...screenPos(s.vpos), 60*2*camera.z);
					}
				}
				pop();
			}
		}

		for(let r of rocks){
			let d = 1/sqrt(camera.z);
			push(); translate(width/2, height/2); scale(camera.z);
			translate(-camera.x, -camera.y);
			noStroke(); fill(150, 100, 200);
			rect(r[0]-d, r[1]-d, 2*d, 2*d);
			pop();
		}

		for(let s of ships){
			if(s.move.length){
				push(); translate(width/2, height/2);
				translate(-camera.x*camera.z, -camera.y*camera.z);
				stroke(100, 200, 200, 30); strokeWeight(4*sqrt(camera.z)); noFill();
				beginShape();
				vertex(s.vpos[0]*camera.z, s.vpos[1]*camera.z);
				vertex(s.pos[0]*camera.z, s.pos[1]*camera.z);
				for(let m of s.move)
					vertex(m[0]*camera.z, m[1]*camera.z);
				endShape();
				pop();
			}

			if(s.wait){
				push(); translate(width/2, height/2);
				translate(-camera.x*camera.z, -camera.y*camera.z);
				stroke(255, 50, 50, 30); strokeWeight(4*sqrt(camera.z)); noFill();
				line(s.pos[0]*camera.z, s.pos[1]*camera.z,
					s.wait[0]*camera.z, s.wait[1]*camera.z);
				pop();
			}

			if(s.tp){
				push(); translate(width/2, height/2);
				translate(-camera.x*camera.z, -camera.y*camera.z);
				stroke(255, 255, 50, 30); strokeWeight(4*sqrt(camera.z)); noFill();
				line(s.pos[0]*camera.z, s.pos[1]*camera.z,
					s.tp[0]*camera.z, s.tp[1]*camera.z);
				pop();
			}
		}

		for(let s of ships){
			push(); translate(width/2+(s.vpos[0]-camera.x)*camera.z, height/2+(s.vpos[1]-camera.y)*camera.z);
			scale(sqrt(camera.z));

			for(let m of s.modules) if(Array.isArray(m.aux) && m.aux.length && m.aux[0] &&
				(m.aux[1] > 3/TIME[m.type] || (m.aux[1]*TIME[m.type])%1 < 0.5) || m.type == PASSIVE){
				if(m.type == ALPHA){
					stroke(50, 150, 150, 50); noFill(); strokeWeight(3);
					arc(0, 0, 50-3, 50-3, -PI*0.25, PI*0.25);
					arc(0, 0, 50-3, 50-3, PI-PI*0.25, PI+PI*0.25);

					noStroke(); fill(50, 150, 150, 80);
					circle(0, 0, 50);
				}

				if(m.type == IMPULSE){
					stroke(50, 150, 150, 40); noFill(); strokeWeight(3);
					arc(0, 0, 55-3, 55-3, -PI*0.25+frameCount/30, PI*0.25+frameCount/30);
					arc(0, 0, 55-3, 55-3, PI-PI*0.25+frameCount/30, PI+PI*0.25+frameCount/30);

					noStroke(); fill(50, 150, 150, 40);
					circle(0, 0, 55);
				}

				if(m.type == PASSIVE){
					stroke(50, 150, 150, ceil(150*m.aux[0])); noFill(); strokeWeight(3);
					arc(0, 0, 55, 53, -PI*0.25, PI*0.25);
					arc(0, 0, 55, 53, PI-PI*0.25, PI+PI*0.25);

					noStroke(); fill(50, 150, 150, ceil(40*m.aux[0]));
					ellipse(0, 0, 55+2, 53+2);
				}

				if(m.type == OMEGA){
					stroke(50, 150, 150, 70); noFill(); strokeWeight(3);
					circle(0, 0, 70-3);

					noStroke(); fill(50, 150, 150, 40);
					circle(0, 0, 70);
				}

				if(m.type == MIRROR){
					scale(sqrt(camera.z));
					fill(200, 50, 50, 30); noStroke();
					circle(0, 0, RANGE[MIRROR]*2);
					stroke(200, 50, 50, 150); strokeWeight(2); noFill();
					arc(0, 0, RANGE[MIRROR]*2, RANGE[MIRROR]*2, -PI/2, -PI/2+PI*2*m.aux[0]);
				}

				if(m.type == ALLY){
					scale(sqrt(camera.z));
					fill(150, 200, 200, 15); noStroke();
					circle(0, 0, RANGE[ALLY]*2);
					stroke(150, 200, 200, 150); strokeWeight(2); noFill();
					arc(0, 0, RANGE[ALLY]*2, RANGE[ALLY]*2, -PI/2, -PI/2+PI*2*m.aux[0]);
					strokeWeight(1.5);
					if(-PI/2+PI*2*m.aux > -PI*0.08) arc(0, 0, RANGE[ALLY]*2-6, RANGE[ALLY]*2-6,
						max(-PI/2, -PI*0.08), min(-PI/2+PI*2*m.aux[0], PI*0.08));
					if(-PI/2+PI*2*m.aux > PI-PI*0.08) arc(0, 0, RANGE[ALLY]*2-6, RANGE[ALLY]*2-6,
						max(-PI/2, PI-PI*0.08), min(-PI/2+PI*2*m.aux[0], PI*1.08));
				}
			}

			pop();
		}

		push(); noStroke();
		for(let h of heals){
			fill(50, 200, 50, 60*sin((h[1]-Date.now())/2000*PI));
			circle(...screenPos(h[0]), 60*2*camera.z);
		}
		pop();

		heals = heals.filter(x => x[1] > Date.now());

		push(); noFill(); strokeWeight(3*sqrt(camera.z));
		for(let d of deaths){
			stroke(0, 255, 255, 80*Math.min(1, (d[1]-Date.now())/800));
			circle(...screenPos(d[0]), (3000-d[1]+Date.now())/50*sqrt(camera.z));
		}
		pop();

		deaths = deaths.filter(x => x[1] > Date.now());

		for(let s of ships){
			for(let m of s.modules){
				if(m.type == DESTINY && m.state < 0){
					push(); fill(255, 100, 50, 20); noStroke();
					circle(...screenPos(s.vpos), RANGE[DESTINY]*2*camera.z);
					noFill(); stroke(200, 100, 50); strokeWeight(2*sqrt(camera.z));
					arc(...screenPos(s.vpos), RANGE[DESTINY]*2*camera.z, RANGE[DESTINY]*2*camera.z,
						-PI/2, -PI/2+PI*2*(1+m.state));
					pop();
				}
			}

			if(s.type == REPAIR){
				push(); fill(50, 200, 50, 20); noStroke();
				circle(...screenPos(s.vpos), 60*2*camera.z);
				pop();
			}
		}

		for(let s of ships){
			push(); translate(width/2+(s.vpos[0]-camera.x)*camera.z, height/2+(s.vpos[1]-camera.y)*camera.z);
			rotate(s.rot); scale(sqrt(camera.z));
			drawShip(s.type, s.team != socket.id, s.move.length ? 1 : 0);
			pop();
		}

		for(let s of ships){
			push(); translate(width/2+(s.vpos[0]-camera.x)*camera.z, height/2+(s.vpos[1]-camera.y)*camera.z);
			scale(sqrt(camera.z));

			const hp = s.hp, max = HP[s.type];

			fill(100, 80); noStroke();
			if(hp != max) rect(-15, -20, 30, 3);

			if(hp/max > 0.7) fill(50, 150, 50);
			else if(hp/max > 0.5) fill(150, 150, 50);
			else if(hp/max > 0.3) fill(200, 100, 0);
			else fill(150, 50, 50);

			if(hp != max) rect(-15, -20, ceil(30*hp/max), 3);

			for(let m of s.modules)
				if(m.type >= ALPHA && m.type <= ALLY)
					if(m.aux[0]){
						fill(100, 80); noStroke();
						rect(-15, -25, 30, 3);

						fill(50, 150, 150);
						rect(-15, -25, ceil(30*m.aux[0]), 3);
					}


			const exp = s.expire;

			if(exp != 1){
				fill(100, 80); noStroke();
				rect(-15, -25, 30, 3);

				fill(200, 150, 50);
				rect(-15, -25, ceil(30*exp), 3);

				fill(50, 150, 150);

				stroke(50, 150, 150); noFill();
			}

			pop();
		}

		push();
		for(let b of blasts){
			fill(200, 100, 50, ceil((b[2]-Date.now())*255/2000));
			circle(...screenPos(b[0]), b[1]*2*camera.z);
		}
		pop();

		blasts = blasts.filter(x => x[2] > Date.now());

		{
			const S = sqrt(camera.z);

			let REV = new Map();
			for(let i=0; i<ships.length; ++i)
				REV.set(ships[i].uid, i);

			function SH(uid){
				return REV.has(uid) ? ships[REV.get(uid)] : null;
			}

			push();
			for(let s of ships)
				for(let m of s.modules)
					if(Array.isArray(m.aux) && m.aux.length){
						let C = [s.vpos[0]+17*Math.cos(s.rot)/S, s.vpos[1]+17*Math.sin(s.rot)/S];

						if([LASER, LASER2, COL].includes(m.type)){
							fill(200, 100, 50, 150); noStroke();
							circle(...screenPos(C), 12*S*(5+sin(frameCount/20))/5);
						}

						for(let uid of m.aux){
							let x = SH(uid);
							if(x == null) continue;

							if([LASER, LASER2, COL].includes(m.type)){
								fill(200, 100, 50, 150); noStroke();
								circle(...screenPos(x.vpos), 7*S*(8+sin(frameCount/20))/8);
								if(m.state < 0.6){
									stroke(200, 100, 50); strokeWeight(2*S);
									line(...screenPos(C), ...screenPos(x.vpos));
								}else if(m.state < 1){
									stroke(200, 100, 50); strokeWeight(4*S);
									line(...screenPos(C), ...screenPos(x.vpos));
								}else{
									stroke(200, 100, 50); strokeWeight(6*S);
									line(...screenPos(C), ...screenPos(x.vpos));
									stroke(255, 150, 100); strokeWeight(3*S);
									line(...screenPos(C), ...screenPos(x.vpos));
								}

							}else if(m.type == TURRETD){
								fill(50, 150, 200, 150); noStroke();
								circle(...screenPos(x.vpos), 7*S*(8+sin(frameCount/20))/8);
								let R = [x.vpos[0]-s.vpos[0], x.vpos[1]-s.vpos[1]],
									D = _dist(x.vpos, s.vpos);
								R[0] /= D; R[1] /= D;
								R[0] = s.vpos[0]+R[0]*10/S;
								R[1] = s.vpos[1]+R[1]*10/S;
								stroke(50, 150, 200); strokeWeight(2*S);
								line(...screenPos(R), ...screenPos(x.vpos));

							}else if([BATTERY, MASS, SENTINEL, GUARD, INT].includes(m.type)){
								stroke(200, 100, 50); strokeWeight(2*S);
								const L = (((frameCount+x.uid*6+s.uid*3)/20) % 1) * 0.9;
								line(...screenPos(_lerp(C, x.vpos, L)),
									...screenPos(_lerp(C, x.vpos, L+0.1)));
							}
						}
					}
			pop();

			if(focus && focus[0] == "ship" && shipID != null){
				for(let m of ships[shipID].modules)
					if(m.type >= LASER && m.type <= TURRETD)
						for(let uid of m.aux){
							let s = SH(uid);
							if(s != null){
								push(); translate(...screenPos(s.vpos));
								scale(S); rotate(-frameCount/30);
								stroke(200, 150, 50); strokeWeight(1);
								line(0, -5, 0, 5);
								line(-5, 0, 5, 0);
								pop();
							}
						}
			}
		};

		if(focus){
			if(selectMove){
				push();
				fill(0, 20, 30); stroke(50, 200, 200, 50); strokeWeight(3);
				rect(width/2-150, height-60, 300, 40);
				pop();

				push(); textSize(18); textAlign(LEFT, TOP);
				fill(200); text("SELECT DESTINATION", width/2-140, height-50);
				pop();

				push();
				fill(20, 40, 60); noStroke(); rect(width/2+77, height-51, 65, 22);
				pop();

				push(); textSize(14); textAlign(CENTER, CENTER);
				fill(mouseIn(width/2+77+65/2, height-42, 40, 20) ? 255 : 200);
				text("CANCEL", width/2+77+65/2, height-42);
				pop();

			}else{
				if(focus[0] == "rock"){
					push();
					fill(0, 20, 30); stroke(50, 200, 200, 50); strokeWeight(3);
					rect(width/2-55, height-60, 110, 40);
					pop();

					push(); textSize(18); textAlign(CENTER, TOP);
					fill(200); text("ASTEROID", width/2, height-50);
					pop();

				}else if(focus[0] == "ship"){
					const hp = ships[shipID].hp, max = HP[ships[shipID].type];

					push();
					fill(0, 20, 30); stroke(50, 200, 200, 50); strokeWeight(3);
					rect(width/2-150, height-120, 300, 100);
					pop();

					push(); textAlign(LEFT, TOP); textSize(18);
					fill(200); noStroke(); text(
						focus[0] == "rock" ? "ASTEROID" : NAME[ships[shipID].type],
						width/2-150 + 10, height-120 + 10);
					pop();

					fill(20, 40, 60); noStroke();
					rect(width/2+150-20-100, height-120+100-20-20, 100, 20);

					if(hp/max > 0.7) fill(50, 150, 50);
					else if(hp/max > 0.5) fill(150, 150, 50);
					else if(hp/max > 0.3) fill(200, 100, 0);
					else fill(150, 50, 50);

					rect(width/2+150-20-100, height-120+100-20-20, ceil(100*hp/max), 20);

					push(); textSize(13);
					fill(200); noStroke(); textAlign(CENTER, CENTER);
					text(hp.toString() + " / " + max.toString(), width/2+150-20-100+50, height-120+100-20-20+7.5);
					pop();

					for(let i=0; i<ships[shipID].modules.length; ++i){
						push(); translate(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25);
						drawModule2(ships[shipID].modules[i].type, ships[shipID].modules[i].state);
						pop();
					}

					let canMove = ships[shipID].team == socket.id &&
						ships[shipID].type == BS && ships[shipID].tp == null,
						canStop = ships[shipID].wait;

					push(); strokeWeight(2);
					if(canStop){
						if(canMove){
							if(mouseIn(width/2-117, height-50, 20, 20)) stroke(15, 45, 55);
							else stroke(10, 35, 40);
						}else stroke(7, 30, 40);
						line(width/2-130, height-45, width/2-125, height-40);
						line(width/2-125, height-40, width/2-105, height-60);

						if(canMove){
							if(mouseIn(width/2-117, height-50, 20, 20)) stroke(30, 90, 110);
							else stroke(20, 70, 80);
						}else stroke(10, 40, 60);
						const wait = 25-floor(ships[shipID].wait[2]*25/40);
						line(width/2-130, height-45, width/2-130+min(5, wait), height-45+min(5, wait));
						if(wait >= 5)
							line(width/2-125, height-40, width/2-125+wait-5, height-40-wait+5);

					}else{
						if(canMove){
							if(mouseIn(width/2-117, height-50, 20, 20)) stroke(30, 90, 110);
							else stroke(20, 70, 80);
						}else stroke(10, 40, 60);
						line(width/2-130, height-50, width/2-105, height-50);
						line(width/2-115, height-60, width/2-105, height-50);
						line(width/2-115, height-40, width/2-105, height-50);
					}
					if(canMove && (canStop || ships[shipID].move.length > 1)){
						if(mouseIn(width/2-70, height-50, 20, 20)) stroke(30, 90, 110);
						else stroke(20, 70, 80);
					}else stroke(10, 40, 60);
					line(width/2-80, height-60, width/2-60, height-40);
					line(width/2-80, height-40, width/2-60, height-60);
					pop();
				}
			}
		}

	}else{
		fill(200); textSize(25); noStroke();
		text("CONNECTING", width/2, height/2);
	}
}

function stagingUI(){
	if(!searching){
		if(ALLMODULE){
			for(let i=0; i<5; ++i)
				if(mouseIn(width/2-100+i*50, height/2+50, 20, 20))
					chooseModule = chooseModule == i-10 ? -1 : i-10;

		}else{
			if(mouseIn(width/2-100, height/2+50, 20, 20)){
				chooseModule = (chooseModule == 0 ? -1 : 0);
			}

			if(mouseIn(width/2-50, height/2+50, 20, 20)){
				chooseModule = (chooseModule == 1 ? -1 : 1);
			}

			if(mouseIn(width/2, height/2+50, 20, 20)){
				chooseModule = (chooseModule == 2 ? -1 : 2);
			}

			if(mouseIn(width/2+50, height/2+50, 20, 20)){
				chooseModule = (chooseModule == 3 ? -1 : 3);
			}

			if(mouseIn(width/2+100, height/2+50, 20, 20)){
				chooseModule = (chooseModule == 4 ? -1 : 4);
			}
		}
	}

	if(chooseModule == -1){
		if(mouseIn(width/2, height/2+150, 60, 30)){
			if(!searching){
				searching = 1;
				setTimeout(() => {
					if(searching){
						start();
						open = 1;
					}
				}, 3000);
			}
		}

		if(mouseIn(width/2, height/2+200, 60, 15)){
			if(searching){
				searching = 0;
				if(open) cancel();
			}
		}

		if(mouseIn(width/2, height/2+230, 60, 15)){
			if(searching){
				searching = 0;
				if(open) cancel();
				solo();
				staging = 0;
			}
		}

	}else if(chooseModule == 0){
		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+150, 20, 20)){
				modules[0] = modules[0] == LASER+i ? null : LASER+i;
				chooseModule = -1;
				localStorage.setItem("modules", JSON.stringify(modules));
			}
		}

	}else if(chooseModule == 1){
		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+150, 20, 20)){
				modules[1] = modules[1] == ALPHA+i ? null : ALPHA+i;
				chooseModule = -1;
				localStorage.setItem("modules", JSON.stringify(modules));
			}
		}

	}else if(chooseModule == 2 || chooseModule == 3){
		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+125, 20, 20) &&
				modules[5-chooseModule] != EMP+i){
				modules[chooseModule] = modules[chooseModule] == EMP+i ? null : EMP+i;
				chooseModule = -1;
				localStorage.setItem("modules", JSON.stringify(modules));
			}
		}

		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+175, 20, 20) &&
				modules[5-chooseModule] != EMP+5+i){
				modules[chooseModule] = modules[chooseModule] == EMP+5+i ? null : EMP+5+i;
				chooseModule = -1;
				localStorage.setItem("modules", JSON.stringify(modules));
			}
		}

	}else if(chooseModule == 4){
		for(let i=0; i<4; ++i){
			if(mouseIn(width/2-75+i*50, height/2+150, 20, 20)){
				modules[4] = modules[4] == DECOY+i ? null : DECOY+i;
				chooseModule = -1;
				localStorage.setItem("modules", JSON.stringify(modules));
			}
		}

	}else if(chooseModule < -1){
		for(let i=0; i<7; ++i){
			if(mouseIn(width/2-150+i*50, height/2+125, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == LASER+i ? null : LASER+i;
				chooseModule = -1;
			}
		}

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+175, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == ALPHA+i ? null : ALPHA+i;
				chooseModule = -1;
			}
		}

		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+225, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == EMP+i ? null : EMP+i;
				chooseModule = -1;
			}
		}

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+275, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == EMP+5+i ? null : EMP+5+i;
				chooseModule = -1;
			}
		}

		for(let i=0; i<4; ++i){
			if(mouseIn(width/2-75+i*50, height/2+325, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == DECOY+i ? null : DECOY+i;
				chooseModule = -1;
			}
		}
	}
}

function click(){
	if(focus && shipID != null && selectMove == null){
		for(let i=0; i<ships[shipID].modules.length; ++i){
			if(mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 20, 20)){
				if(ships[shipID].team == socket.id && ships[shipID].modules[i].state == 1){
					if(ships[shipID].tp != null && [TP, DESTINY].includes(ships[shipID].modules[i].type))
						return;
					if(LOCMOD.includes(ships[shipID].modules[i].type))
						selectMove = ["module", {s: focus[1], i: i}];
					else socket.emit("activateModule", {gameID: gameID, shipID: focus[1], i: i});
				}
				return;
			}
		}
	}

	if(focus && selectMove == null &&
		(focus[0] == "rock" ? mouseIn(width/2, height-40, 55, 20) : mouseIn(width/2, height-70, 150, 50))){
		if(shipID != null){
			let canMove = ships[shipID].team == socket.id &&
				ships[shipID].type == BS && ships[shipID].tp == null,
				canStop = canMove && ships[shipID].wait;
			if(canMove && (ships[shipID].move.length > 1 || canStop) &&
				mouseIn(width/2-70, height-50, 20, 20)){
				socket.emit("cancelMove", {gameID: gameID, shipID: focus[1]});
			}
			if(canMove && mouseIn(width/2-117, height-50, 20, 20)){
				if(canStop) socket.emit("confirmMove", {gameID: gameID, shipID: focus[1]});
				else selectMove = ["ship", focus[1]];
			}
		}

	}else if(focus && selectMove != null){

		if(mouseIn(width/2, height-40, 150, 20)){
			if(mouseIn(width/2+77+65/2, height-42, 40, 20)){
				selectMove = null;
			}

		}else if(select && select[0] == "rock"){
			if(selectMove[0] == "ship"){
				socket.emit("move", {
					gameID: gameID, shipID: selectMove[1],
					pos: [rocks[select[1]][0], rocks[select[1]][1]+10],
					dock: select[1]
				});
				selectMove = null;
				
			}else if(selectMove[0] == "module"){
				const P = [rocks[select[1]][0], rocks[select[1]][1]+10];

				if(RANGE[ships[shipID].modules[selectMove[1].i].type] == null ||
					_dist(P, ships[shipID].vpos) < RANGE[ships[shipID].modules[selectMove[1].i].type]){
					if(ships[shipID].modules[selectMove[1].i].type != DELTA || ships[shipID].move.length > 0
						|| (ships[shipID].move.length == 0 && select[1] != ships[shipID].dock)){
						socket.emit("activateModule", {gameID: gameID, shipID: selectMove[1].s,
							i: selectMove[1].i, loc: P, dock: select[1]});
						selectMove = null;
					}
				}
			}

		}else{
			selectMove = null;
		}

	}else{
		focus = select && (!focus || focus[0] != select[0] || focus[1] != select[1]) ? [...select] : null;
	}
}
