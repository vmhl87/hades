p5.disableFriendlyErrors = true;

let font = null, SHOW_TOUCH_REGIONS = false;

let modules = [LASER, ALPHA, EMP, DUEL, DECOY];

let savedBuilds = [], showBuilds = false;

function genUser(){
	return [
		"GUEST" + Math.floor(Math.random()*1000).toString(),
		Math.floor(Math.random()*1000000).toString()
	];
}

let searching = 0, staging = 1, chooseModule = -1, mode = 0,
	connected = 0, snapshot = 0, ID = null, TEAM = null, now = null,
	queueSize = 0, user = genUser(), savedUser = false, artifacts = [];

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

	if(localStorage.getItem("user")){
		user = JSON.parse(localStorage.getItem("user"));
		savedUser = true;
	}

	if(localStorage.getItem("mode")){
		mode = localStorage.getItem("mode");
	}

	if(localStorage.getItem("savedBuilds")){
		savedBuilds = JSON.parse(localStorage.getItem("savedBuilds"));
	}

	if(localStorage.getItem("performance")){
		setFrameRate = parseInt(localStorage.getItem("performance"));
		frameRate(setFrameRate);
	}

	setupLogin();
	setupSpectate();

	/*
	for(let element of document.getElementsByClassName("p5Canvas"))
		element.addEventListener("contextmenu", e => e.preventDefault())
	*/
}

let ships = [], rocks = [], entities = [],
	gameID = null, ROWS, COLS, dead = [], speed = 1, age = 0, last = 0;

socket.on("reset", () => {
	searching = 0;
	staging = 1;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;

	artifacts = [];

	camera = {x: 0, y: 0, z: 1};
	speed = 1;
	last = 0;
	age = 0;
});

socket.on("start", data => {
	chooseModule = -1;
	searching = 0;
	staging = 0;
	connected = 1;
	select = null;
	selectMove = null;

	artifacts = [];

	ROWS = data.rows;
	COLS = data.cols;
	dead = new Array(ROWS*COLS).fill(0);

	gameID = data.uid;

	ships = [];
	for(let s of data.ships)
		ships.push(new Ship(s));

	rocks = data.rocks;

	entities = {blast: [], death: [], heal: [], emp: [], imp: [], sectorDeath: [], eliminate: [], win: [], surrender: []};

	last = Date.now();
	speed = 1;
	age = 0;

	camera.x = 0;
	camera.y = 0;
	camera.z = 1;

	for(let s of data.ships)
		if(s.type == BS && s.user == socket.id){
			camera.x = s.pos[0];
			camera.y = s.pos[1];
			TEAM = s.team;
		}

	selectMove = null;
	focus = null;

	ID = socket.id;
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

	for(let i=0; i<ROWS*COLS; ++i)
		dead[i] = data.dead[i];

	for(let d of data.s) if(!uids.has(d.uid)){
		ships.push(new Ship(d));
	}

	entities = data.entities;

	speed = data.speed;
	last = max(data.datetime, Date.now()-300);
	age = data.age;
});

socket.on("artifact", (shipID, type) => {
	if(!staging && connected)
		artifacts.push([Date.now()+20000, shipID, type]);
});

socket.on("end", () => {
	chooseModule = -1;
	searching = 0;
	staging = 1;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;
	camera = {x: 0, y: 0, z: 1};

	artifacts = [];
});

socket.on("queueSize", (m, x) => {
	if(m == MODES[mode])
		queueSize = x;
});

function main(){
	background(0, 10, 25);

	if(staging){
		fill(200); noStroke();
		push();
		textSize(18); textAlign(CENTER, CENTER);
		const A = user[0] + "  -  ", B = (savedUser ? "SIGN OUT" : "SIGN IN");
		const C = textWidth(A), D = textWidth(B);
		text(A, width/2-D/2, height/2-190);
		const H = mouseIn(width/2+C/2, height/2-190, D/2, 10);
		textSize(H ? 19 : 18); fill(H ? 255 : 200);
		text(B, width/2+C/2, height/2-190);
		translate(width/2+15, height/2-100);
		scale(5); drawShip(BS, 0, 2);
		pop();

		if(localStorage.getItem("save") != null && !searching){
			push(); translate(width-30, 30);
			const H = mouseIn(width-30, 30, 30, 30);
			stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
			if(H) scale(1.1);
			noFill();
			beginShape();
			vertex(3, -10);
			vertex(3, 10);
			vertex(10, 3);
			endShape();
			beginShape();
			vertex(-10, -3);
			vertex(-3, -10);
			vertex(-3, 10);
			endShape();
			pop();
			push();
			if(H){
				textAlign(RIGHT, CENTER); textSize(18);
				fill(50, 200, 200, 80); noStroke();
				text("VIEW SNAPSHOT", width-60, 28);
			}
			pop();
		}

		{
			push(); translate(30, 30);
			const H = mouseIn(30, 30, 30, 30);
			stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
			if(H) scale(1.1);
			line(-10, -10, 10, -10);
			line(-10, 0, 10, 0);
			line(-10, 10, 10, 10);
			pop();
			push();
			if(H){
				textAlign(LEFT, CENTER); textSize(18);
				fill(50, 200, 200, 80); noStroke();
				text("GUIDE", 60, 28);
			}
			pop();
		};

		if(!showBuilds && !searching){
			push(); translate(30, height-30);
			const H = mouseIn(30, height-30, 30, 30);
			stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
			noFill();
			if(H) scale(1.1);
			rect(-10, -10, 20, 20);
			line(0, -5, 0, 0);
			beginShape();
			vertex(-3, 2);
			vertex(0, 5);
			vertex(3, 2);
			endShape();
			pop();
			push();
			if(H){
				textAlign(LEFT, CENTER); textSize(18);
				fill(50, 200, 200, 80); noStroke();
				text("SAVED BUILDS", 60, height-32);
			}
			pop();
		};

		if(!searching){
			push(); translate(width-30, height-30);
			const H = mouseIn(width-30, height-30, 30, 30);
			stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
			noFill();
			if(H) scale(1.1);
			beginShape();
			vertex(-12, 0);
			vertex(-3, 7);
			vertex(3, 7);
			vertex(12, 0);
			vertex(3, -7);
			vertex(-3, -7);
			endShape(CLOSE);
			fill(50, 200, 200, H ? 80 : 60); noStroke();
			beginShape();
			vertex(-3, 0);
			vertex(0, -5);
			vertex(3, 0);
			vertex(0, 5);
			endShape(CLOSE);
			pop();
			push();
			if(H){
				textAlign(RIGHT, CENTER); textSize(18);
				fill(50, 200, 200, 80); noStroke();
				text("SPECTATE GAME", width-60, height-32);
			}
			pop();
		};

		{
			let pick = null;

			if(MODES[mode] == "TAG"){
				if(mouseIn(width/2-25, height/2+50, 26, 20)) pick = 1.5;
				if(mouseIn(width/2+25, height/2+50, 26, 20)) pick = 2.5;

			}else{
				for(let i=0; i<5; ++i) if(mouseIn(width/2-100+50*i, height/2+50, 26, 20))
					pick = i;
			}

			if(chooseModule != -1) pick = chooseModule < 0 ? chooseModule+10 : chooseModule;

			if(pick != null && ((!MOBILE && chooseModule == -1) || !ALLMODULE) && !showGuide){
				const M = MODES[mode] == "TAG" ? ([STRIKE, EMP])[pick-1.5] : modules[pick];

				const I = INFO[M];

				if(I != null){
					push(); textSize(14);
					const W = MODULE_NAME[M]+"\n\n"+
						wrap(I, 220)+"\n\n"+STATS[M];
					const H = font.textBounds(W, 0, 0).h;
					const P = width/2-100+50*pick;

					fill(0, 20, 30); noStroke();
					rect(width/2-120, height/2-20-H-10, 240, H+20);
					triangle(P-10, height/2-20+10, P, height/2-20+27, P+10, height/2-20+10);
					noFill(); stroke(20, 70, 80); strokeWeight(3);
					line(width/2-120, height/2-20-H-10, width/2+120, height/2-20-H-10);
					line(width/2-120, height/2-20-H-10, width/2-120, height/2-20+10);
					line(width/2+120, height/2-20-H-10, width/2+120, height/2-20+10);
					line(width/2-120, height/2-20+10, P-10, height/2-20+10);
					line(P-10, height/2-20+10, P, height/2-20+27);
					line(P, height/2-20+27, P+10, height/2-20+10);
					line(P+10, height/2-20+10, width/2+120, height/2-20+10);
					textAlign(LEFT, BOTTOM);
					fill(150); noStroke();
					text(W, width/2-110, height/2-20);
					pop();
				}
			}
		}

		if(ALLMODULE){
			if((!MOBILE && 0) || chooseModule == -1) for(let i=0; i<5; ++i){
				push(); translate(width/2-100+50*i, height/2+50);
				drawModule2(modules[i], mouseIn(width/2-100+i*50, height/2+50, 20, 20) ? 1 : 0);
				pop();
			}

		}else if(MODES[mode] == "TAG"){
			fill(100, 255, 100, searching ? 60 :
				(mouseIn(width/2-25, height/2+50, 20, 20) ? 80 : 60));
			rect(width/2 - 45, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2-25, height/2 + 50);
			drawModule(STRIKE);
			pop();

			fill(100, 255, 100, searching ? 60 :
				(mouseIn(width/2+25, height/2+50, 20, 20) ? 80 : 60));
			rect(width/2 + 5, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2+25, height/2 + 50);
			drawModule(EMP);
			pop();

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

			fill(...(modules[4] >= EMP ? [100, 255, 100] : [255, 150, 0]), searching ? 60 :
				(mouseIn(width/2+100, height/2+50, 20, 20) || chooseModule == 4 ? 80 : 60));
			rect(width/2 + 80, height/2 - 20 + 50, 40, 40);
			push(); translate(width/2+100, height/2 + 50);
			drawModule(modules[4]);
			pop();
		}

		if(searching){
			fill(0, 100);

			if(MODES[mode] == "TAG"){
				rect(width/2-45, height/2+30, 40, 40);
				rect(width/2+5, height/2+30, 40, 40);

			}else{
				for(let i=0; i<5; ++i)
					rect(width/2-120+i*50, height/2+30, 40, 40);
			}
		}

		if(chooseModule == -1){
			if(searching){
				textSize(18);
				const Q = max(1, queueSize);
				const T = Q.toString() + " PLAYER" + (Q == 1 ? "" : "S") + " IN QUEUE  -  ";
				const D = textWidth(T), E = textWidth("START");
				fill(200);
				text(T, width/2 - E/2, height/2 + 150);
				let H = mouseIn(width/2+D/2, height/2+150, E/2+30, 15);
				fill(H ? 255 : 200); textSize(H ? 19 : 18);
				text("START", width/2 + D/2, height/2 + 150);

				textSize(15);
				H = mouseIn(width/2, height/2+200, textWidth("LEAVE QUEUE")+30, 15);
				fill(H ? 255 : 200); textSize(H ? 16 : 15);
				text("LEAVE QUEUE", width/2, height/2 + 200);

			}else{
				textSize(25);
				const T = MODES[mode] == "SOLO" ? "START GAME" : "ENTER QUEUE";
				const H = mouseIn(width/2, height/2+150, textWidth(T)+30, 30);
				fill(H ? 255 : 200); textSize(H ? 26 : 25);
				text(T, width/2, height/2 + 150);
				textSize(15); fill(200);
				const A = "GAME MODE:  ", B = MODES[mode], C = textWidth(A), D = textWidth(B);
				text(A, width/2-D/2, height/2+190);
				const I = mouseIn(width/2+C/2, height/2+200, C/2+10, 20);
				fill(I ? 255 : 200); textSize(I ? 16 : 15);
				text(B, width/2+C/2, height/2+190);
			}

		}else{
			if(chooseModule == 0){
				for(let i=0; i<6; ++i){
					fill(255, 50, 50, mouseIn(width/2-125+i*50, height/2+150, 20, 20) ? 80 : 60);
					rect(width/2-145+i*50, height/2+130, 40, 40);
					push(); translate(width/2-125+i*50, height/2+150);
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
				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						[modules[5-chooseModule], modules[4]].includes(EMP+i) ? 60 :
						(mouseIn(width/2-125+i*50, height/2+125, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+105, 40, 40);
					push(); translate(width/2-125+i*50, height/2+125);
					drawModule(EMP+i);
					pop();
					fill(0, 100);
					if([modules[5-chooseModule], modules[4]].includes(EMP+i)) rect(width/2-145+i*50, height/2+105, 40, 40);
				}

				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						[modules[5-chooseModule], modules[4]].includes(EMP+6+i) ? 60 :
						(mouseIn(width/2-125+i*50, height/2+175, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+155, 40, 40);
					push(); translate(width/2-125+i*50, height/2+175);
					drawModule(EMP+6+i);
					pop();
					fill(0, 100);
					if([modules[5-chooseModule], modules[4]].includes(EMP+6+i)) rect(width/2-145+i*50, height/2+155, 40, 40);
				}
			}

			if(chooseModule == 4){
				for(let i=0; i<6; ++i){
					fill(255, 150, 0, mouseIn(width/2-125+i*50, height/2+125, 20, 20) ? 80 : 60);
					rect(width/2-145+i*50, height/2+105, 40, 40);
					push(); translate(width/2-125+i*50, height/2+125);
					drawModule(DECOY+i);
					pop();
				}

				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						[modules[2], modules[3]].includes(EMP+i) ? 60 :
						(mouseIn(width/2-125+i*50, height/2+175, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+155, 40, 40);
					push(); translate(width/2-125+i*50, height/2+175);
					drawModule(EMP+i);
					pop();
					fill(0, 100);
					if([modules[2], modules[3]].includes(EMP+i)) rect(width/2-145+i*50, height/2+155, 40, 40);
				}

				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						[modules[2], modules[3]].includes(EMP+6+i) ? 60 :
						(mouseIn(width/2-125+i*50, height/2+225, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+205, 40, 40);
					push(); translate(width/2-125+i*50, height/2+225);
					drawModule(EMP+6+i);
					pop();
					fill(0, 100);
					if([modules[2], modules[3]].includes(EMP+6+i)) rect(width/2-145+i*50, height/2+205, 40, 40);
				}
			}

			if(chooseModule < -1){
				push(); translate(0, MOBILE ? -150 : -50);

				for(let i=0; i<5; ++i){
					fill(255, 50, 50, mouseIn(width/2-100+i*50, height/2+75-50, 20, 20) ? 80 : 60);
					rect(width/2-120+i*50, height/2+55, 40, 40);
					push(); translate(width/2-100+i*50, height/2+75);
					drawModule(LASER+i);
					pop();
				}

				for(let i=0; i<3; ++i){
					fill(255, 50, 50, mouseIn(width/2-75+i*50, height/2+125-50, 20, 20) ? 80 : 60);
					rect(width/2-95+i*50, height/2+105, 40, 40);
					push(); translate(width/2-75+i*50, height/2+125);
					drawModule(LASER+5+i);
					pop();
				}

				{
					fill(255, 50, 50, mouseIn(width/2-75+3*50, height/2+125-50, 20, 20) ? 80 : 60);
					rect(width/2-95+3*50, height/2+105, 40, 40);
					push(); translate(width/2-75+3*50, height/2+125);
					drawModule(BOMBER);
					pop();
				};

				for(let i=0; i<6; ++i){
					fill(0, 255, 255, mouseIn(width/2-125+i*50, height/2+175-50, 20, 20) ? 80 : 60);
					rect(width/2-145+i*50, height/2+155, 40, 40);
					push(); translate(width/2-125+i*50, height/2+175);
					drawModule(ALPHA+i);
					pop();
				}

				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+i ? 60 :
						(mouseIn(width/2-125+i*50, height/2+225-50, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+205, 40, 40);
					push(); translate(width/2-125+i*50, height/2+225);
					drawModule(EMP+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+i) rect(width/2-125+i*50, height/2+205, 40, 40);
				}

				for(let i=0; i<7; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+6+i ? 60 :
						(mouseIn(width/2-150+i*50, height/2+275-50, 20, 20) ? 80 : 60)
					);
					rect(width/2-170+i*50, height/2+255, 40, 40);
					push(); translate(width/2-150+i*50, height/2+275);
					drawModule(EMP+6+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+6+i) rect(width/2-170+i*50, height/2+255, 40, 40);
				}

				for(let i=0; i<7; ++i){
					fill(255, 150, 0, mouseIn(width/2-150+i*50, height/2+325-50, 20, 20) ? 80 : 60);
					rect(width/2-170+i*50, height/2+305, 40, 40);
					push(); translate(width/2-150+i*50, height/2+325);
					drawModule(DECOY+i);
					pop();
				}

				pop();
			}
		}

		if(showGuide) drawGuide();

		if(showBuilds){
			const H = savedBuilds.length ? savedBuilds.length*50*0.75+10+70 : 38,
				W = savedBuilds.length ? 235 : 150;

			push();
			fill(0, 20, 30); stroke(20, 70, 80); strokeWeight(3);
			rect(15, height-15-H, W, H);

			textAlign(LEFT, TOP); textSize(16); fill(40, 130, 150); noStroke();
			if(savedBuilds.length) text("SAVED BUILDS", 25, height-5-H);
			textAlign(LEFT, BOTTOM);
			const B = font.textBounds("SAVE NEW BUILD", 25, height-25);
			textAlign(CENTER, CENTER);
			const C = font.textBounds("SAVE NEW BUILD", B.x+B.w/2, B.y+B.h/2);
			const D = mouseIn(B.x+B.w/2, B.y+B.h/2, B.w/2+10, B.h/2+10);
			textSize(D ? 17 : 16);
			text("SAVE NEW BUILD", B.x+B.w/2, B.y*2-C.y+B.h/2);

			for(let i=0; i<savedBuilds.length; ++i){
				const H1 = mouseIn(15+25+75, height-15-H+25+i*50*0.75+25, 90, 15),
					H2 = mouseIn(15+25+250*0.75, height-15-H+25+i*50*0.75+25, 15, 15);

				for(let j=0; j<5; ++j){
					push(); translate(15+25+j*50*0.75, height-15-H+25+i*50*0.75+25); scale(H1 ? 0.85 : 0.75);
					drawModule2(savedBuilds[i][j], 1);
					pop();
				}

				push(); translate(15+25+250*0.75, height-15-H+25+i*50*0.75+25);
				stroke(150, 50, 50); strokeWeight(2); scale(H2 ? 1.2 : 1);
				line(-8, -8, 8, 8);
				line(-8, 8, 8, -8);
				pop();
			}

			pop();
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
				selectMove = null;
				focus = null;
				shipID = null;
			}
			
		}else shipID = null;

		let REV = new Map();

		let bsID = [], cerbID = [], repairID = [], modID = [];
		for(let i=0; i<ships.length; ++i){
			if(ships[i].type == BS){
				bsID.push(i);
				modID.push(i);
			}
			if(ships[i].type >= SENTINEL && ships[i].type <= COL)
				cerbID.push(i);
			if(ships[i].type == REPAIR) repairID.push(i);
			if(ships[i].type == PHASE) modID.push(i);
			if(ships[i].type == BOMB) modID.push(i);
			REV.set(ships[i].uid, i);
		}

		function SH(uid){
			return REV.has(uid) ? ships[REV.get(uid)] : null;
		}

		push(); fill(200, 50, 50, 20); stroke(255, 50, 50); strokeWeight(1.5*sqrt(camera.z));

		for(let s of ships){
			s.travel();

			if(s.type == BOMBER && s.dock != null){
				const X = floor(rocks[s.dock][0]/300+COLS/2);
				const Y = floor(rocks[s.dock][1]/300+ROWS/2);

				const LX = max(0, X-0.5);
				const RX = min(COLS-1, X+0.5);

				const LY = max(0, Y-0.5);
				const RY = min(ROWS-1, Y+0.5);

				rect(...screenPos([300*LX-150*COLS+15, 300*LY-150*ROWS+15]),
					(RX-LX+1-0.1)*300*camera.z, (RY-LY+1-0.1)*300*camera.z);
			}
		}

		pop();

		let warn = null;

		push(); translate(width/2-camera.x*camera.z, height/2-camera.y*camera.z);
		translate(-150*COLS*camera.z, -150*ROWS*camera.z); scale(camera.z);
		for(let i=0; i<ROWS; ++i)
			for(let j=0; j<COLS; ++j)
				if(dead[i*COLS+j] > 0){
					fill(200, 50, 50, 30 + 15*Math.sin(Date.now()/500));
					if(dead[i*COLS+j] == 2)
						fill(200, 50, 50, 100);
					else warn = min(warn == null ? 1000 : warn,
						floor((2-dead[i*COLS+j])*SECTOR_COLLAPSE_TIME));
					rect(300*j, 300*i, 300, 300);
				}
		for(let i of entities.sectorDeath){
			push(); translate(300*(i[0]%COLS)+150, 300*floor(i[0]/COLS)+150);
			drawEffect(APOCALYPSE);
			pop();
		}
		pop();

		push(); translate(width/2-camera.x*camera.z, height/2-camera.y*camera.z);
		stroke(200, 30); strokeWeight(2*sqrt(camera.z));
		for(let i=0; i<=ROWS; ++i)
			line(-300*COLS/2*camera.z,(-300*ROWS/2+i*300)*camera.z,
				300*COLS/2*camera.z, (-300*ROWS/2+i*300)*camera.z);
		for(let i=0; i<=COLS; ++i)
			line((-300*COLS/2+i*300)*camera.z, -300*ROWS/2*camera.z,
				(-300*COLS/2+i*300)*camera.z, 300*ROWS/2*camera.z);
		stroke(200, 50, 50);
		translate(-150*COLS*camera.z, -150*ROWS*camera.z); scale(camera.z);
		for(let i=0; i<ROWS; ++i) if(dead[i*COLS]) line(0, 300*i, 0, 300*i+300);
		for(let i=0; i<ROWS; ++i) if(dead[i*COLS+COLS-1]) line(300*COLS, 300*i, 300*COLS, 300*i+300);
		for(let i=0; i<COLS; ++i) if(dead[i]) line(300*i, 0, 300*i+300, 0);
		for(let i=0; i<COLS; ++i) if(dead[i+(ROWS-1)*COLS]) line(300*i, 300*ROWS, 300*i+300, 300*ROWS);
		for(let i=0; i<ROWS-1; ++i)
			for(let j=0; j<COLS; ++j)
				if(dead[i*COLS+j] != dead[i*COLS+j+COLS])
					line(300*j, 300*i+300, 300*j+300, 300*i+300);
		for(let i=0; i<ROWS; ++i)
			for(let j=0; j<COLS-1; ++j)
				if(dead[i*COLS+j] != dead[i*COLS+j+1])
					line(300*j+300, 300*i, 300*j+300, 300*i+300);
		pop();

		if(selectMove != null && !MOBILE){
			fill(255, 255, 100, 15); noStroke();
			let x = selected();

			if(x && x[0] == "rock" && (!focus || x[1] != focus[1]))
				circle(...screenPos(rocks[x[1]]), 20*sqrt(camera.z));

			if(x && x[0] == "ship" && (!focus || x[1] != focus[1])){
				let I = null;
				for(let i=0; i<ships.length; ++i) if(ships[i].uid == x[1]) I = i;
				if(I) circle(...screenPos(ships[I].vpos), 40*sqrt(camera.z));
			}
		}

		if(focus){
			fill(255, 15); noStroke();
			if(focus[0] == "rock") circle(...screenPos(rocks[focus[1]]), 20*sqrt(camera.z));
			if(focus[0] == "ship" && shipID != null){
				push();
				stroke(90, 100); fill(90, 30);
				if(selectMove == null) for(let i=0; i<ships[shipID].modules.length; ++i)
					if(ships[shipID].type != BS || ships[shipID].team == TEAM || ships[shipID].modules[i].use)
						if(mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 20))
							if(RANGE[ships[shipID].modules[i].type] != null)
								circle(...screenPos(ships[shipID].vpos), RANGE[ships[shipID].modules[i].type]*2*camera.z);
				if(selectMove != null && selectMove[0] == "module" && RANGE[ships[shipID].modules[selectMove[1].i].type])
					circle(...screenPos(ships[shipID].vpos), RANGE[ships[shipID].modules[selectMove[1].i].type]*2*camera.z);
				pop();

				push();
				noFill(); stroke(...(ships[shipID].team == TEAM ? [70, 90, 90] : [90, 70, 70]), 100);
				let shade = true;
				for(let i=0; i<ships[shipID].modules.length; ++i)
					if(ships[shipID].type != BS || ships[shipID].team == TEAM || ships[shipID].modules[i].use){
						if(weaponRange(ships[shipID].modules[i].type) != null){
							circle(...screenPos(ships[shipID].vpos), weaponRange(ships[shipID].modules[i].type)*2*camera.z);
							shade = false;
						}
						if(ships[shipID].modules[i].type == ROCKETD)
							circle(...screenPos(ships[shipID].vpos), 60*2*camera.z);
					}
				if([DARTP, ROCKETP, STRIKEP, BOMBERP].includes(ships[shipID].type))
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
					let D = 0;
					for(let x of s.modules) if(weaponRange(x.type) != null)
						D = max(D, weaponRange(x.type));
					if([DARTP, ROCKETP, STRIKEP, BOMBERP].includes(s.type))
						D = max(D, RANGE[s.type]);
					if(D == 0) continue;
					let near = _dist(ships[shipID].vpos, s.vpos) < D+30;

					if([DARTP, ROCKETP, STRIKEP, BOMBERP].includes(s.type))
						if(_dist(ships[shipID].vpos, s.move[s.move.length-1]) < RANGE[s.type]+20)
							circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					if(ships[shipID].wait){
						if(_linedist(ships[shipID].vpos, ships[shipID].wait, s.vpos) < D+30) near = true;
						if([DARTP, ROCKETP, STRIKEP, BOMBERP].includes(s.type))
							if(_linedist(ships[shipID].vpos, ships[shipID].wait,
								s.move[s.move.length-1]) < RANGE[s.type]+20)
								circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					}
					if(ships[shipID].move.length){
						if(_linedist(ships[shipID].vpos, ships[shipID].move[0], s.vpos) < D+30) near = true;
						if([DARTP, ROCKETP, STRIKEP, BOMBERP].includes(s.type))
							if(_linedist(ships[shipID].vpos, ships[shipID].move[0],
								s.move[s.move.length-1]) < RANGE[s.type]+20)
								circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					}
					for(let i=0; i<ships[shipID].move.length-1; ++i){
						if(_linedist(ships[shipID].move[i], ships[shipID].move[i+1], s.vpos) < D+30) near = true;
						if([DARTP, ROCKETP, STRIKEP, BOMBERP].includes(s.type))
							if(_linedist(ships[shipID].move[i], ships[shipID].move[i+1],
								s.move[s.move.length-1]) < RANGE[s.type]+20)
								circle(...screenPos(s.move[s.move.length-1]), RANGE[s.type]*2*camera.z);
					}
					if(near) for(let i=0; i<s.modules.length; ++i)
						if(s.type != BS || s.team == TEAM || s.modules[i].use){
							if(weaponRange(s.modules[i].type) != null)
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
			const H = focus != null && focus[0] == "ship" && focus[1] == s.uid;

			if(s.move.length){
				push(); translate(width/2, height/2);
				translate(-camera.x*camera.z, -camera.y*camera.z);
				stroke(100, 200, 200, H ? 50 : 25);
				strokeWeight(4*sqrt(camera.z)); noFill();
				beginShape();
				vertex(s.vpos[0]*camera.z, s.vpos[1]*camera.z);
				vertex(s.pos[0]*camera.z, s.pos[1]*camera.z);
				for(let m of s.move)
					vertex(m[0]*camera.z, m[1]*camera.z);
				endShape();
				pop();
			}

			if(s.wait){
				push();
				strokeWeight(4*sqrt(camera.z)); noFill();
				stroke(200, 100, 100, H ? 50 : 25);
				line(...screenPos(s.pos), ...screenPos(s.wait));
				pop();
			}

			s.target = null;

			if(dragMove != null && dragMove[2] == s.uid){
				const S = selectedPos(dragMove);

				if(S != null && S[0] == "rock"){
					const P = screenPos([rocks[S[1]][0], rocks[S[1]][1]+10]);

					push();
					strokeWeight(4*sqrt(camera.z)); noFill();
					stroke(200, 100, 100, 50);
					if(s.move.length)
						line(...screenPos(s.move[s.move.length-1].slice(0, 2)), ...P);
					else line(...screenPos(s.pos), ...P);
					pop();

					if(!s.move.length)
						s.target = atan2(P[1]-screenPos(s.vpos)[1], P[0]-screenPos(s.vpos)[0]);

				}else{
					if(!s.move.length)
						s.target = atan2(dragMove[1]-screenPos(s.vpos)[1], dragMove[0]-screenPos(s.vpos)[0]);
				}
			}

			if(s.tp){
				push(); translate(width/2, height/2);
				translate(-camera.x*camera.z, -camera.y*camera.z);
				stroke(255, 255, 50, H ? 50 : 25); strokeWeight(4*sqrt(camera.z)); noFill();
				line(s.pos[0]*camera.z, s.pos[1]*camera.z,
					s.tp[0]*camera.z, s.tp[1]*camera.z);
				pop();
			}
		}

		const NOW = snapshot ? age : age + (Date.now()-last)*TPS/1000/speed;

		for(let i of bsID){
			for(let m of ships[i].modules){
				if(m.type == BOND && m.aux.uid != null){
					if(REV.has(m.aux.uid)){
						push();
						stroke(100, 255, 100, 100); strokeWeight(sqrt(camera.z));
						noFill();
						beginShape();
						for(let j=0; j<=6; ++j){
							const P = _lerp(screenPos(ships[i].vpos), screenPos(SH(m.aux.uid).vpos), j/6);
							vertex(
								P[0]+(noise(23+j*10, round(Date.now()/100))-0.5)*sqrt(camera.z)*20,
								P[1]+(noise(96+j*10, round(Date.now()/100))-0.5)*sqrt(camera.z)*20
							);
						}
						endShape();
						stroke(200, 200, 50, 150+sin(Date.now()/500)*50); strokeWeight(2*sqrt(camera.z));
						line(...screenPos(ships[i].vpos), ...screenPos(SH(m.aux.uid).vpos));
						stroke(100, 255, 100, 100); strokeWeight(sqrt(camera.z));
						beginShape();
						for(let j=0; j<=6; ++j){
							const P = _lerp(screenPos(ships[i].vpos), screenPos(SH(m.aux.uid).vpos), j/6);
							vertex(
								P[0]+(noise(34+j*10, floor(Date.now()/100))-0.5)*sqrt(camera.z)*20,
								P[1]+(noise(94+j*10, floor(Date.now()/100))-0.5)*sqrt(camera.z)*20
							);
						}
						endShape();
						pop();
					}
				}
			}
		}

		for(let i of bsID){
			const s = ships[i];
			if(s.imp == 0){
				push(); translate(width/2+(s.vpos[0]-camera.x)*camera.z, height/2+(s.vpos[1]-camera.y)*camera.z);

				for(let m of s.modules)
					if(Array.isArray(m.aux) && m.aux.length && m.aux[0] &&
						(m.aux[1] > 3/TIME[m.type] || ((Date.now()/1000)%1 < 0.5)) || m.type == PASSIVE){

						if(m.type == ALPHA) drawEffect(ALPHA);

						if(m.type == DELTA) drawEffect(DELTA, m.aux[2]);

						if(m.type == PASSIVE && (m.use || s.type != BS || s.team == TEAM))
							drawEffect(PASSIVE, m.aux[0]);

						if(m.type == OMEGA) drawEffect(OMEGA);

						if(m.type == MIRROR) drawEffect(MIRROR, m.aux[0]);

						if(m.type == ALLY) drawEffect(ALLY, m.aux[0]);
					}

				pop();
			}
		}

		for(let e of entities.emp){
			push(); translate(...screenPos(e[0]));
			drawEffect(EMP, (e[1]-NOW)/TPS/4);
			pop();
		}
		
		for(let i of entities.imp){
			push(); translate(...screenPos(i[0]));
			drawEffect(DISRUPT, (i[1]-NOW)/TPS/4);
			pop();
		}

		push(); noStroke();
		for(let h of entities.heal){
			fill(50, 200, 50, 60*sin((h[1]-NOW)/TPS/2*PI));
			circle(...screenPos(h[0]), 60*2*camera.z);
		}
		pop();

		push(); noFill(); strokeWeight(3*sqrt(camera.z));
		for(let d of entities.death){
			stroke(0, 255, 255, 80*Math.min(1, (d[1]-NOW)/0.8/TPS));
			circle(...screenPos(d[0]), 60*(1-(d[1]-NOW)/TPS/3)*sqrt(camera.z));
		}
		pop();

		for(let i of modID){
			const s = ships[i];
			for(let m of s.modules){
				if([LEAP, VENG, BARRIER, AMP, SUSPEND].includes(m.type) && m.state < 0){
					push(); translate(...screenPos(s.vpos));
					drawEffect(m.type, m.state);
					pop();
				}

				if(m.type == PULSE){
					push(); translate(...screenPos(s.vpos));
					drawEffect(m.type, [m.color, m.state]);
					pop();
				}
			}

			if(s.fort > 0){
				push(); translate(...screenPos(s.vpos));
				drawEffect(FORT, s.fort);
				pop();
			}
		}

		for(let i of repairID){
			if(ships[i].type == REPAIR){
				push(); translate(...screenPos(ships[i].vpos));
				drawEffect(REPAIR);
				pop();
			}
		}

		for(let s of ships) if(focus == null || focus[0] != "ship" || s.uid != focus[1]){
			push(); translate(...screenPos(s.vpos));
			drawShip2(s);
			pop();
		}

		if(focus != null && focus[0] == "ship" && shipID != null){
			push(); translate(...screenPos(ships[shipID].vpos));
			drawShip2(ships[shipID]);
			pop();
		}

		push();
		for(let b of entities.blast){
			fill(...b[2], ceil((b[3]-NOW)*255/2/TPS));
			circle(...screenPos(b[0]), b[1]*2*camera.z);
		}
		pop();

		{
			const S = sqrt(camera.z);

			push();
			for(let s of ships) if(!s.emp){
				let sol = false;

				for(let m of s.modules)
					if(m.type == DUEL && m.state == 1)
						sol = true;

				for(let m of s.modules)
					if((m.type >= LASER && m.type <= ROCKETD) || (m.type >= SENTINEL && m.type <= COL))
					if(m.aux.length){
						let C = [s.vpos[0]+17*Math.cos(s.rot)/S, s.vpos[1]+17*Math.sin(s.rot)/S];

						if([LASER, LASER2, COL].includes(m.type)){
							fill(...m.color, 150); noStroke();
							circle(...screenPos(C), 12*S*(5+sin(Date.now()/16/20))/5);
						}

						for(let uid of m.aux){
							let x = SH(uid);
							if(x == null) continue;

							if([LASER, LASER2, COL].includes(m.type)){
								fill(...m.color, 150); noStroke();
								circle(...screenPos(x.vpos), 7*S*(8+sin(Date.now()/16/20))/8);
								if(m.state < 0.6){
									stroke(...m.color); strokeWeight(2*S);
									line(...screenPos(C), ...screenPos(x.vpos));
								}else if(m.state < 1){
									stroke(...m.color); strokeWeight(4*S);
									line(...screenPos(C), ...screenPos(x.vpos));
								}else{
									stroke(...m.color); strokeWeight(6*S);
									line(...screenPos(C), ...screenPos(x.vpos));
									stroke(m.color[0]+50, m.color[1]+50, m.color[2]+50); strokeWeight(3*S);
									line(...screenPos(C), ...screenPos(x.vpos));
								}

							}else if(m.type == TURRETD){
								fill(50, 150, 200, 150); noStroke();
								circle(...screenPos(x.vpos), 7*S*(8+sin(Date.now()/16/20))/8);
								let R = [x.vpos[0]-s.vpos[0], x.vpos[1]-s.vpos[1]],
									D = _dist(x.vpos, s.vpos);
								R[0] /= D; R[1] /= D;
								R[0] = s.vpos[0]+R[0]*10/S;
								R[1] = s.vpos[1]+R[1]*10/S;
								stroke(50, 150, 200); strokeWeight(2*S);
								line(...screenPos(R), ...screenPos(x.vpos));

							}else if([CANNON, SPREAD, SENTINEL, GUARD, INT].includes(m.type)){
								stroke(...m.color); strokeWeight(2*S);
								const L = (((Date.now()/16+x.uid*6+s.uid*3)/20) % 1) * 0.9;
								line(...screenPos(_lerp(C, x.vpos, L)),
									...screenPos(_lerp(C, x.vpos, L+0.1)));
							}
						}

						if(sol){
							push(); translate(...screenPos(s.vpos)); scale(S);
							translate(0, 25); scale(1/2); drawModule(DUEL);
							pop();
						}
					}
			}
			pop();

			if(focus && focus[0] == "ship" && shipID != null){
				for(let m of ships[shipID].modules)
					if((m.type >= LASER && m.type <= ROCKETD) || (m.type >= SENTINEL && m.type <= COL))
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
				fill(0, 20, 30); stroke(20, 70, 80); strokeWeight(3);
				rect(width/2-150, height-60, 300, 40);
				pop();

				push(); textSize(18); textAlign(LEFT, TOP);
				fill(200); text("SELECT DESTINATION", width/2-140, height-50);
				pop();

				push();
				fill(20, 40, 60); noStroke(); rect(width/2+77, height-51, 65, 22);
				pop();

				push(); textAlign(CENTER, CENTER);
				const H = mouseIn(width/2+77+65/2, height-42, 40, 20);
				fill(H ? 255 : 200); textSize(H ? 15 : 14);
				text("CANCEL", width/2+77+65/2, height-42);
				pop();

				if(SHOW_TOUCH_REGIONS){
					push(); stroke(255, 150, 50);
					rect(width/2+77+65/2-60, height-42-30, 120, 60);
					pop();
				}

			}else{
				if(focus[0] == "rock"){
					push();
					fill(0, 20, 30); stroke(20, 70, 80); strokeWeight(3);
					rect(width/2-55, height-60, 110, 40);
					pop();

					push(); textSize(18); textAlign(CENTER, TOP);
					fill(200); text("ASTEROID", width/2, height-50);
					pop();

				}else if(focus[0] == "ship" && shipID != null){
					const hp = ships[shipID].hp, max = ships[shipID].mhp;

					push();
					fill(0, 20, 30); stroke(20, 70, 80); strokeWeight(3);
					rect(width/2-150, height-120, 300, 100);
					pop();

					let N = focus[0] == "rock" ? "ASTEROID" : NAME[ships[shipID].type];

					if(ships[shipID].name != null) N += " [" + ships[shipID].name + "]";
					else if(ships[shipID].type == BS) N = "ROGUE BATTLESHIP";

					push(); textAlign(LEFT, TOP); textSize(18);
					fill(200); noStroke(); text(N, width/2-150 + 10, height-120 + 10);
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
					text(ceil(hp).toString() + " / " + max.toString(), width/2+150-20-100+50, height-120+100-20-20+7.5);
					pop();

					for(let m of ships[shipID].modules)
						if(m.type >= ALPHA && m.type <= ALLY)
							if(m.aux[0] && (m.use || ships[shipID].type != BS || ships[shipID].team == TEAM)){
								fill(50, 150, 150);
								rect(width/2+150-20-100, height-120+100-20-20-6, ceil(100*m.aux[0]), 3);
							}

					for(let i=0; i<ships[shipID].modules.length; ++i){
						const H = mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 20);

						const Y = height-120-10-25 - (H && ships[shipID].modules[i].state == 1 && ACTIVATED[ships[shipID].modules[i].type] && (
								ships[shipID].type != BS || ships[shipID].modules[i].use || ships[shipID].team == TEAM
							)? 2 : 0);

						push(); translate(width/2+25-25*ships[shipID].modules.length+50*i, Y);
						const S = ships[shipID], M = S.modules[i];
						drawModule2(M.use || S.type != BS || S.team == TEAM ? M.type : NULL, ships[shipID].modules[i].state);
						pop();

						if(H){
							if(!MOBILE && mouseIsPressed){
								const T = M.use || S.type != BS || S.team == TEAM ? M.type : NULL;

								if(MODULE_NAME[T] != null){
									push(); textSize(14);
									const W = MODULE_NAME[T]+"\n\n"+wrap(INFO[T], 220)+(STATS[T]==null?"":"\n\n"+STATS[T]);
									const H = font.textBounds(W, 0, 0).h;
									const P = width/2+25-25*S.modules.length+50*i;

									fill(0, 20, 30); noStroke();
									rect(width/2-120, height-225-H-10, 240, H+20);
									triangle(P-10, height-225+10, P, height-225+27, P+10, height-225+10);
									noFill(); stroke(20, 70, 80); strokeWeight(3);
									line(width/2-120, height-225-H-10, width/2+120, height-225-H-10);
									line(width/2-120, height-225-H-10, width/2-120, height-225+10);
									line(width/2+120, height-225-H-10, width/2+120, height-225+10);
									line(width/2-120, height-225+10, P-10, height-225+10);
									line(P-10, height-225+10, P, height-225+27);
									line(P, height-225+27, P+10, height-225+10);
									line(P+10, height-225+10, width/2+120, height-225+10);
									textAlign(LEFT, BOTTOM);
									fill(150); noStroke();
									text(W, width/2-110, height-225);
									pop();
								}

							}else if(ACTIVATED[M.type] || [DART, ROCKETD, BOMBER, VENG].includes(M.type)){
								const T = M.use || S.type != BS || S.team == TEAM ? M.type : NULL;

								if(T != NULL){
									const RT = M.type >= ALPHA && M.type <= ALLY ? RECHARGE_TIME[T] : RECHARGE_TIME[T]-EFFECT_TIME[T];
									push(); textSize(14); textAlign(CENTER, BOTTOM); fill(..._moduleColor(T), 150);
									const ST = M.state < 0 ? M.state : min(1, M.state * (M.type == DELTA ? 1/0.75 : 1));
									let D = ST == 1 ? "[READY]" : (
										ST < 0 ? (([TP, LEAP, TURRET, WARP].includes(M.type) ? "[ACTIVATING]" : "[ACTIVE]") + " "
										+ ceil(-EFFECT_TIME[T]*ST) + "s") : ("[RECHARGING] " + ceil((RT)*(1-ST)) + "s"));
									text(D, width/2+25-25*S.modules.length+50*i, Y-35);
									pop();
								}
							}
						}
					}

					let canMove = ships[shipID].user == ID && !snapshot &&
						(ships[shipID].type == BS || CENT) && ships[shipID].tp == null && ships[shipID].bond[0] == 0,
						canStop = ships[shipID].wait;

					if(SHOW_TOUCH_REGIONS){
						push(); stroke(255, 150, 50); noFill();
						rect(width/2-117-10-30, height-50-30, 60, 60);
						rect(width/2-70+10-30, height-50-30, 60, 60);
						pop();
					}

					push(); strokeWeight(2);
					if(canStop){
						push(); translate(width/2-115, height-50);
						if(canMove){
							if(mouseIn(width/2-117, height-50, 20, 20)){
								stroke(15, 45, 55);
								scale(1.1);
							}else stroke(10, 35, 40);
						}else stroke(7, 30, 40);
						line(-15, 5, -10, 10);
						line(-10, 10, 10, -10);

						if(canMove){
							if(mouseIn(width/2-117, height-50, 20, 20)) stroke(30, 90, 110);
							else stroke(20, 70, 80);
						}else stroke(10, 40, 60);
						const wait = 25-floor(ships[shipID].wait[2]*25);
						line(-15, 5, -15+min(5, wait), 5+min(5, wait));
						if(wait >= 5)
							line(-10, 10, -10+wait-5, 10-wait+5);
						pop();

					}else{
						push(); translate(width/2-115, height-50);
						if(canMove){
							if(mouseIn(width/2-117, height-50, 20, 20)){
								stroke(30, 90, 110);
								scale(1.1);
							}else stroke(20, 70, 80);
						}else stroke(10, 40, 60);
						line(-15, 0, 10, 0);
						line(0, -10, 10, 0);
						line(0, 10, 10, 0);
						pop();
					}
					pop();

					push(); strokeWeight(2);
					translate(width/2-70, height-50);
					if(canMove && (canStop || ships[shipID].move.length > 1)){
						if(mouseIn(width/2-70, height-50, 20, 20)){
							stroke(30, 90, 110);
							scale(1.1);
						}else stroke(20, 70, 80);
					}else stroke(10, 40, 60);
					line(-10, -10, 10, 10);
					line(-10, 10, 10, -10);
					pop();

					if(ships[shipID].arts.length){
						push(); translate(width/2+15, height-50); scale(1, 1.3);
						fill(200, 150, 50); stroke(200, 150, 50); strokeWeight(3);
						beginShape();
						vertex(0.5, -3);
						vertex(2, -1);
						vertex(0, 0);
						vertex(-0.5, 3);
						vertex(-2, 1);
						vertex(0, 0);
						endShape(CLOSE);
						pop();

						const H = mouseIn(width/2+15, height-50, 15, 15);

						if(H){
							if(MOBILE || mouseIsPressed){
								const A = ships[shipID].arts;

								let W = 0, H = A.length*50-10;

								push(); textSize(16);
								for(let x of A) W = Math.max(W, textWidth(Artifacts.types[x][0]));
								W += 60; const P = 10; W += P*2; H += P*2;
								fill(0, 20, 30); stroke(20, 70, 80); strokeWeight(2);
								rect(width/2+15-W/2, height-80-H, W, H);

								for(let i=0; i<A.length; ++i){
									push(); translate(width/2+15-W/2+20+P, height-80-H+20+50*i+P);
									push(); scale(0.5);
									drawArtifact(Artifacts.types[A[i]][4], 200);
									pop();
									fill(200); noStroke();
									textAlign(LEFT, CENTER);
									text(Artifacts.types[A[i]][0], 30, -2);
									pop();
								}
								pop();

							}else{
								push();
								textAlign(CENTER, BOTTOM); textSize(16);
								const B = font.textBounds("ARTIFACTS", 0, 0);
								fill(0, 20, 30); stroke(20, 70, 80); strokeWeight(2);
								rect(width/2+15-B.w/2-10, height-80-B.h-12, B.w+20, B.h+20);
								fill(40, 130, 150); noStroke();
								text("ARTIFACTS", width/2+15, height-80);
								pop();
							}
						}
					};
				}
			}
		}

		if(warn != null){
			push();
			textAlign(CENTER, CENTER);
			fill(50, 200, 200, 200); noStroke(); textSize(17);
			text("SECTOR COLLAPSE IN " + warn.toString() + "s", width/2, 28);
			pop();
		}

		for(let e of entities.eliminate){
			push(); textAlign(CENTER, TOP); textSize(17);
			fill(200, 150, 50, 255*min(1, (e[1]-NOW)/TPS));
			text(e[0] + " ELIMINATED", width/2, 50);
			pop();
		}

		for(let e of entities.surrender){
			push(); textAlign(CENTER, TOP); textSize(17);
			fill(200, 150, 50, 255*min(1, (e[1]-NOW)/TPS));
			text(e[0] + " SURRENDERS", width/2, 50);
			pop();
		}

		for(let e of entities.win){
			push(); textAlign(CENTER, TOP); textSize(17);
			fill(200, 150, 50, 255*min(1, (e[1]-NOW)/TPS));
			let mine = null;
			for(let x of ships) if(x.type == BS && x.user == ID) mine = x.name;
			text((e[0] == mine ? "YOU WIN" : (MODES[mode] == "2TEAM" ? "YOU LOSE" : e[0] + " WINS")) + " THE MATCH", width/2, 70);
			pop();
		}

		if(!snapshot){
			push(); translate(width-30, 30);
			const H = mouseIn(width-30, 30, 30, 30);
			stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
			if(H) scale(1.1);
			noFill();
			beginShape();
			vertex(3, -10);
			vertex(3, 10);
			vertex(10, 3);
			endShape();
			beginShape();
			vertex(-10, -3);
			vertex(-3, -10);
			vertex(-3, 10);
			endShape();
			pop();
			push();
			if(H){
				textAlign(RIGHT, CENTER); textSize(18);
				fill(50, 200, 200, 80); noStroke();
				text("SAVE SNAPSHOT", width-60, 28);
			}
			pop();
		}

		if(CENT){
			push(); stroke(200, 100, 50, mouseIn(30, height-220, 30, 30) ? 80 : 60); noFill(); strokeWeight(3);
			rect(6, height-220-20, 40, 40);
			pop();
		}

		{
			let shipInArena = false;

			for(let s of ships) if(s.user == ID && s.type == BS) shipInArena = true;

			{
				push(); translate(30, 30);
				const H = mouseIn(30, 30, 30, 30);
				stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
				if(H) scale(1.1);
				line(-10, -10, 10, 10);
				line(-10, 10, -3, 3);
				line(3, -3, 10, -10);
				pop();
				push();
				if(H){
					textAlign(LEFT, CENTER); textSize(18);
					fill(50, 200, 200, 80); noStroke();
					text(snapshot ? "EXIT SNAPSHOT" : (shipInArena ? "ABANDON GAME" : "EXIT TO MENU"), 60, 28);
				}
				pop();
			};

			if(focus == null && shipInArena){
				push(); translate(width-30, height-30);
				const H = mouseIn(width-30, height-30, 30, 30);
				stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
				if(H) scale(1.1);
				line(10, 10, 7, 7);
				line(10, -10, 7, -7);
				line(-10, 10, -7, 7);
				line(-10, -10, -7, -7);
				noFill(); strokeWeight(2);
				circle(0, 0, 6);
				pop();
				push();
				if(H){
					textAlign(RIGHT, CENTER); textSize(18);
					fill(50, 200, 200, 80); noStroke();
					text("FOCUS BATTLESHIP", width-60, height-32);
				}
				pop();
			}
		};

		if(focus == null){
			push(); translate(30, height-30);
			const H = mouseIn(30, height-30, 30, 30);
			stroke(50, 200, 200, H ? 80 : 60); strokeWeight(3);
			noFill();
			if(H) scale(1.1);
			beginShape();
			vertex(-12, 0);
			vertex(-3, 7);
			vertex(3, 7);
			vertex(12, 0);
			vertex(3, -7);
			vertex(-3, -7);
			endShape(CLOSE);
			fill(50, 200, 200, H ? 80 : 60); noStroke();
			beginShape();
			vertex(-3, 0);
			vertex(0, -5);
			vertex(3, 0);
			vertex(0, 5);
			endShape(CLOSE);
			pop();
			push();
			if(H){
				textAlign(LEFT, CENTER); textSize(18);
				fill(50, 200, 200, 80); noStroke();
				text("GAME ID: " + gameID.toString(), 60, height-32);
			}
			pop();
		};

		if(artifacts.length){
			const T = Artifacts.types[artifacts[0][2]];
			const O = 255*min(1, (artifacts[0][0]-Date.now())*7/5000);

			push();
			fill(0, 20, 30, O); stroke(20, 70, 80, O); strokeWeight(3);
			rect(width/2-150, 30, 300, 100);
			fill(40, 130, 150, O); noStroke();
			textAlign(RIGHT, TOP); textSize(17);
			text("ARTIFACT RECOVERED", width/2 + 140, 37);

			push(); translate(width/2-150+50, 80);
			drawArtifact(T[4], O*100/255);
			pop();

			fill(200, O); noStroke(); textSize(15);
			text(T[0], width/2+140, 60);
			fill(150, O); textSize(14);
			text(T[1], width/2+140, 80);
			textSize(15); textAlign(CENTER, BOTTOM);
			const A = "Keep", B = "         ", C = "Discard", D = textWidth(A), E = textWidth(B), F = textWidth(C);
			fill(50, 150, 50, O);
			textSize(mouseIn(width/2-150+90+210/2-E/2-F/2, 120, D/2+10, 15) && artifacts[0][0]-Date.now() > 5000/7 ? 17 : 15);
			text(A, width/2-150+90+210/2-E/2-F/2, 120);
			fill(150, 50, 50, O);
			textSize(mouseIn(width/2-150+90+210/2+D/2+E/2, 120, D/2+10, 15) && artifacts[0][0]-Date.now() > 5000/7 ? 17 : 15);
			text(C, width/2-150+90+210/2+D/2+E/2, 120);
			pop();

			if(T[2] != null && mouseIn(width/2-150+50, 80, 40, 40) && artifacts[0][0]-Date.now() > 5000/7){
				push(); textSize(14);
				const W = wrap(T[2], 260);
				const H = font.textBounds(W, 0, 0).h;
				fill(0, 20, 30, O); stroke(20, 70, 80, O); strokeWeight(3);
				rect(width/2-140, 140, 280, H+22);
				textAlign(LEFT, TOP);
				fill(150, O); noStroke();
				text(W, width/2-130, 150);
				pop();
			}
		}

		while(artifacts.length && artifacts[0][0] < Date.now()){
			artifacts = artifacts.slice(1);
			if(artifacts.length) artifacts[0][0] = Date.now()+20000;
		}

	}else{
		fill(200); textSize(25); noStroke();
		text("CONNECTING", width/2, height/2);
	}
}

function stagingUI(){
	if(mouseIn(width-30, 30, 30, 30) && !searching){
		if(localStorage.getItem("save") != null){
			loadState(localStorage.getItem("save"));
		}
		return;
	}

	if(showGuide && mouseIn(width/2, height/2, 150, min(height-120, 500)/2)){
		controlGuide();
		return;
	}

	if(showBuilds){
		const H = savedBuilds.length ? savedBuilds.length*50*0.75+10+70 : 38,
			W = savedBuilds.length ? 235 : 150;

		if(mouseIn(15+W/2, height-15-H/2, W/2, H/2)){
			push();
			textAlign(LEFT, BOTTOM); textSize(16);
			const B = font.textBounds("SAVE NEW BUILD", 25, height-25);
			textAlign(CENTER, CENTER);
			const C = font.textBounds("SAVE NEW BUILD", B.x+B.w/2, B.y+B.h/2);
			const D = mouseIn(B.x+B.w/2, B.y+B.h/2, B.w/2+10, B.h/2+10);
			pop();

			if(D){
				savedBuilds.push([...modules]);
				localStorage.setItem("savedBuilds", JSON.stringify(savedBuilds));
				return;
			}

			for(let i=0; i<savedBuilds.length; ++i){
				const H1 = mouseIn(15+25+75, height-15-H+25+i*50*0.75+25, 90, 15),
					H2 = mouseIn(15+25+250*0.75, height-15-H+25+i*50*0.75+25, 15, 15);
				
				if(H1){
					modules = [...savedBuilds[i]];
					localStorage.setItem("modules", JSON.stringify(modules));
					return;
				}

				if(H2){
					savedBuilds.splice(i, 1);
					localStorage.setItem("savedBuilds", JSON.stringify(savedBuilds));
					return;
				}
			}

			return;

		}else showBuilds = false;
	}

	if(mouseIn(30, 30, 30, 30)){
		showGuide = !showGuide;
		return;
	}

	if(mouseIn(30, height-30, 30, 30) && !showGuide){
		/*
		if(ALLMODULE){
			const D = parseInt(prompt("game ID"));
			if(Number.isInteger(D)){
				socket.emit("spectate", D);
				return;
			}

		}else{
		*/
			showBuilds = !showBuilds;
			return;
		//}
	}

	if(mouseIn(width-30, height-30, 30, 30)){
		document.getElementById("spectate-overlay").style.display = "block";
		document.getElementById("gameID").focus();
		return;
	}

	if(!searching){
		push();
		textSize(18); textAlign(CENTER, CENTER);
		const A = user[0] + "  -  ", B = (savedUser ? "SIGN OUT" : "SIGN IN");
		const C = textWidth(A), D = textWidth(B);
		const H = mouseIn(width/2+C/2, height/2-190, D/2, 10);
		pop();

		if(H){
			if(savedUser){
				user = genUser();
				localStorage.removeItem("user");
				savedUser = false;

			}else{
				document.getElementById("login-overlay").style.display = "block";
				document.getElementById("username").focus();
			}
		}
	}

	let X = false;

	if(chooseModule == -1){
		{
			push();
			textSize(18);
			const T = queueSize.toString() + " OTHER PLAYER" + (queueSize == 1 ? "" : "S") + " IN QUEUE  -  ";
			const D = textWidth(T), E = textWidth("START GAME");
			pop();

			if(mouseIn(width/2+D/2, height/2+150, E/2+30, 15)){
				if(searching){
					searching = 0;
					staging = 0;
					begin();
					return;
				}
			}
		};

		{
			push();
			textSize(15);
			const A = "GAME MODE:  ", B = MODES[mode], C = textWidth(A), D = textWidth(B);
			pop();

			if(mouseIn(width/2+C/2, height/2+200, C/2+10, 20)){
				if(!searching){
					mode = (mode+1) % MODES.length;
					localStorage.setItem("mode", mode);
					queueSize = 0;
				}
			}
		};

		if(mouseIn(width/2, height/2+150, 120, 30)){
			if(!searching){
				if(MODES[mode] == "SOLO"){
					staging = 0;
					solo();

				}else{
					searching = 1;
					start();
					return;
				}
			}
		}

		if(mouseIn(width/2, height/2+200, 120, 15)){
			if(searching){
				searching = 0;
				cancel();
				return;
			}
		}

	}else if(chooseModule == 0){
		let p = true;

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+150, 20, 20)){
				modules[0] = modules[0] == LASER+i ? null : LASER+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;

	}else if(chooseModule == 1){
		let p = true;

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+150, 20, 20)){
				modules[1] = modules[1] == ALPHA+i ? null : ALPHA+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;

	}else if(chooseModule == 2 || chooseModule == 3){
		let p = true;

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+125, 20, 20) &&
				![modules[5-chooseModule], modules[4]].includes(EMP+i)){
				modules[chooseModule] = modules[chooseModule] == EMP+i ? null : EMP+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+175, 20, 20) &&
				![modules[5-chooseModule], modules[4]].includes(EMP+6+i)){
				modules[chooseModule] = modules[chooseModule] == EMP+6+i ? null : EMP+6+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;

	}else if(chooseModule == 4){
		let p = true;

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+125, 20, 20)){
				modules[4] = modules[4] == DECOY+i ? null : DECOY+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+175, 20, 20) &&
				![modules[2], modules[3]].includes(EMP+i)){
				modules[chooseModule] = modules[chooseModule] == EMP+i ? null : EMP+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		for(let i=0; i<6; ++i){
			if(mouseIn(width/2-125+i*50, height/2+225, 20, 20) &&
				![modules[2], modules[3]].includes(EMP+6+i)){
				modules[chooseModule] = modules[chooseModule] == EMP+6+i ? null : EMP+6+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;

	}else if(chooseModule < -1){
		const OFFSET = MOBILE ? 150 : 50;

		let p = true;

		for(let i=0; i<5; ++i)
			if(mouseIn(width/2-100+i*50, height/2+75-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == LASER+i ? null : LASER+i;
				p = false;
			}

		for(let i=0; i<3; ++i)
			if(mouseIn(width/2-75+i*50, height/2+125-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == LASER+5+i ? null : LASER+5+i;
				p = false;
			}

			if(mouseIn(width/2-75+3*50, height/2+125-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == BOMBER ? null : BOMBER;
			}

		for(let i=0; i<6; ++i)
			if(mouseIn(width/2-125+i*50, height/2+175-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == ALPHA+i ? null : ALPHA+i;
				p = false;
			}

		for(let i=0; i<6; ++i)
			if(mouseIn(width/2-125+i*50, height/2+225-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == EMP+i ? null : EMP+i;
				p = false;
			}

		for(let i=0; i<7; ++i)
			if(mouseIn(width/2-150+i*50, height/2+275-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == EMP+6+i ? null : EMP+6+i;
				p = false;
			}

		for(let i=0; i<7; ++i)
			if(mouseIn(width/2-150+i*50, height/2+325-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == DECOY+i ? null : DECOY+i;
				p = false;
			}

		//if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;
		//if(MOBILE) chooseModule = -1;
		X = true;
	}

	if(!searching && MODES[mode] != "TAG"){
		if(ALLMODULE){
			if(chooseModule == -1) for(let i=0; i<5; ++i)
				if(mouseIn(width/2-100+i*50, height/2+50, 20, 20)){
					chooseModule = chooseModule == i-10 ? -1 : i-10;
					return;
				}

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

	if(X) chooseModule = -1;
}

function click(){
	if(artifacts.length){
		if(artifacts[0][0]-Date.now() > 5000/7){
			const T = Artifacts.types[artifacts[0][2]];

			push();
			textSize(15); textAlign(CENTER, BOTTOM);
			const A = "Keep", B = "         ", C = "Discard", D = textWidth(A), E = textWidth(B), F = textWidth(C);
			pop();

			if(mouseIn(width/2-150+90+210/2-E/2-F/2, 120, D/2+10, 15)){
				socket.emit("artifact", gameID, artifacts[0][1], artifacts[0][2]);
				artifacts[0][0] = min(artifacts[0][0], Date.now()+5000/7);
				return;
			}

			if(mouseIn(width/2-150+90+210/2+D/2+E/2, 120, D/2+10, 15)){
				artifacts[0][0] = min(artifacts[0][0], Date.now()+5000/7);
				return;
			}
		}

		if(mouseIn(width/2, 80, 150, 50)) return;
	}

	if(mouseIn(width-30, 30, 30, 30) && !snapshot){
		localStorage.setItem("save", saveState());
		return;
	}

	if(mouseIn(30, 30, 30, 30)){
		if(snapshot){
			snapshot = 0;
			connected = 0;
			staging = 1;
		}else socket.emit("quit");
		return;
	}

	if(mouseIn(30, height-100, 30, 30) && CENT){
		if(shipID != null){
			socket.emit("ascend", {gameID: gameID, shipID: focus[1]});
			return;
		}
	}

	if(mouseIn(15, height-160, 15, 30) && CENT){
		if(shipID != null){
			TEAM = ships[shipID].team;
			ID = ships[shipID].user;
			return;
		}
	}

	if(mouseIn(30, height-220, 30, 30) && CENT){
		eval(prompt());
		return;
	}

	if(focus && focus[0] == "ship"){
		let found = false;
		for(let i=0; i<ships.length; ++i) if(ships[i].uid == focus[1]){
			shipID = i;
			found = true;
		}
		if(!found){
			selectMove = null;
			focus = null;
			shipID = null;
		}
		
	}else shipID = null;

	if((!focus || MOBILE) && mouseIn(width-30, height-30, 30, 30) && selectMove == null)
		for(let s of ships)
			if(s.user == ID && s.type == BS){
				focus = ["ship", s.uid];
				return;
			}

	if(focus && mouseIn(width/2, height, focus[0] == "rock" ? 55 : 150, 20) && selectMove == null){
		selectMove = null;
		focus = null;
		return;
	}

	if(focus && shipID != null && selectMove == null && !snapshot){
		for(let i=0; i<ships[shipID].modules.length; ++i){
			if(mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 25)){
				if(ships[shipID].user == ID && ships[shipID].modules[i].state == 1){
					if(ships[shipID].tp != null && [TP, LEAP, RIPPLE].includes(ships[shipID].modules[i].type))
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
			let canMove = ships[shipID].user == ID &&
				(CENT || ships[shipID].type == BS) && ships[shipID].tp == null && ships[shipID].bond[0] == 0,
				canStop = canMove && ships[shipID].wait;
			if(canMove && (ships[shipID].move.length > 1 || canStop) &&
				mouseIn(width/2-70+10, height-50, 30, 30)){
				socket.emit("cancelMove", {gameID: gameID, shipID: focus[1]});
				ships[shipID].wait = null;
			}
			if(canMove && mouseIn(width/2-117-10, height-50, 30, 30)){
				if(canStop) socket.emit("confirmMove", {gameID: gameID, shipID: focus[1]});
				else selectMove = ["ship", focus[1]];
			}
		}

	}else if(focus && selectMove != null){

		if(mouseIn(width/2+77+65/2, height-42, 60, 30)){
			selectMove = null;
			return;
		}

		if(mouseIn(width/2, height-40, 150, 20)){
		}else if(select && select[0] == "rock"){
			if(selectMove[0] == "ship" && shipID != null){
				if(ships[shipID].move.length || ships[shipID].dock == null || ships[shipID].dock != select[1]){
					socket.emit("move", {
						gameID: gameID, shipID: selectMove[1],
						pos: [rocks[select[1]][0], rocks[select[1]][1]+10],
						dock: select[1]
					});
					ships[shipID].wait = [rocks[select[1]][0], rocks[select[1]][1]+10, 1, select[1]];
					selectMove = null;
				}
				
			}else if(selectMove[0] == "module" && shipID != null){
				const P = [rocks[select[1]][0], rocks[select[1]][1]+10];

				if(RANGE[ships[shipID].modules[selectMove[1].i].type] == null ||
					CENT || _dist(P, ships[shipID].vpos) < RANGE[ships[shipID].modules[selectMove[1].i].type]){
					if(ships[shipID].modules[selectMove[1].i].type != STRIKE || ships[shipID].move.length > 0
						|| (ships[shipID].move.length == 0 && select[1] != ships[shipID].dock)){
						socket.emit("activateModule", {gameID: gameID, shipID: selectMove[1].s,
							i: selectMove[1].i, loc: P, dock: select[1]});
						selectMove = null;
					}
				}
			}

		}else if(shipID != null && ships[shipID].modules[selectMove[1].i].type == RIPPLE && select != null && select[1] != selectMove[1].s){
			for(let s of ships) if(s.uid == select[1])
				if((_dist(ships[shipID].vpos, s.vpos) < RANGE[RIPPLE] || CENT)
					&& (ships[shipID].user == s.user || s.team == CERB || CENT)){
					socket.emit("activateModule", {gameID: gameID, shipID: selectMove[1].s,
						i: selectMove[1].i, loc: select[1]});
					selectMove = null;
				}

		}else if(shipID != null && ships[shipID].modules[selectMove[1].i].type == BOND && select != null && select[1] != selectMove[1].s){
			for(let s of ships) if(s.uid == select[1])
				if(_dist(ships[shipID].vpos, s.vpos) < RANGE[BOND] || CENT){
					socket.emit("activateModule", {gameID: gameID, shipID: selectMove[1].s,
						i: selectMove[1].i, loc: select[1]});
					selectMove = null;
				}

		}else{
			selectMove = null;
		}

	}else{
		focus = select && (!focus || focus[0] != select[0] || focus[1] != select[1]) ? [...select] : null;
	}
}

function keyReleased(){
	MOBILE = false;
	funkyDelay = Date.now();

	if(!staging && connected){
		if(key == 'w'){
			for(let s of ships){
				if(s.type == BS && s.user == ID){
					focus = ["ship", s.uid];
					return;
				}
			}
		}

		if(focus && shipID != null && selectMove == null){
			const keys = "asdfghjkl;";

			for(let i=0; i<ships[shipID].modules.length; ++i){
				if(key == keys[i]){
					if(ships[shipID].user == ID && !snapshot && ships[shipID].modules[i].state == 1){
						if(ships[shipID].tp != null && [TP, LEAP, RIPPLE].includes(ships[shipID].modules[i].type))
							return;
						if(LOCMOD.includes(ships[shipID].modules[i].type))
							selectMove = ["module", {s: focus[1], i: i}];
						else socket.emit("activateModule", {gameID: gameID, shipID: focus[1], i: i});
					}
					return;
				}
			}
		}

		if(focus && selectMove == null && !snapshot){
			if(shipID != null){
				let canMove = ships[shipID].user == ID &&
					(ships[shipID].type == BS || CENT) && ships[shipID].tp == null && ships[shipID].bond[0] == 0,
					canStop = canMove && ships[shipID].wait;
				if(canMove && (ships[shipID].move.length > 1 || canStop) &&
					key == 'x'){
					socket.emit("cancelMove", {gameID: gameID, shipID: focus[1]});
					ships[shipID].wait = null;
				}
				if(canMove && key == 'e'){
					if(canStop) socket.emit("confirmMove", {gameID: gameID, shipID: focus[1]});
					else selectMove = ["ship", focus[1]];
				}
			}

		}else if(focus && selectMove != null){
			if(key == 'x') selectMove = null;
		}
	}
}
