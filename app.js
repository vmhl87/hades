let font = null;

let modules = [LASER, ALPHA, EMP, DUEL, DECOY];

function genUser(){
	return [
		"GUEST" + Math.floor(Math.random()*1000).toString(),
		Math.floor(Math.random()*1000000).toString()
	];
}

let searching = 0, staging = 1, chooseModule = -1,
	connected = 0, snapshot = 0, ID = null, now = null,
	queueSize = 0, open = 0, user = genUser(), savedUser = false;

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

	setupLogin();

	for(let element of document.getElementsByClassName("p5Canvas"))
		element.addEventListener("contextmenu", e => e.preventDefault())
}

let ships = [], rocks = [], blasts = [], entities = [],
	gameID = null, ROWS, COLS, dead = [], speed = 1, age = 0, last = 0;

socket.on("reset", () => {
	searching = 0;
	staging = 1;
	open = 0;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;

	camera = {x: 0, y: 0, z: 1};
	speed = 1;
	last = 0;
	age = 0;
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
	dead = new Array(ROWS*COLS).fill(0);

	gameID = data.uid;

	ships = [];
	for(let s of data.ships)
		ships.push(new Ship(s));

	rocks = data.rocks;

	entities = {blast: [], death: [], heal: [], emp: [], imp: [], sectorDeath: []};

	last = Date.now();
	speed = 1;
	age = 0;

	camera.x = 0;
	camera.y = 0;
	camera.z = 1;

	for(let s of data.ships)
		if(s.type == BS && s.team == socket.id){
			camera.x = s.pos[0];
			camera.y = s.pos[1];
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
	last = Date.now();
	age = data.age;
});

socket.on("end", () => {
	chooseModule = -1;
	searching = 0;
	open = 0;
	staging = 1;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;
	camera = {x: 0, y: 0, z: 1};
});

socket.on("queueSize", x => queueSize = x);

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

		{
			let pick = null;

			for(let i=0; i<5; ++i) if(mouseIn(width/2-100+50*i, height/2+50, 26, 20))
				pick = i;

			if(chooseModule != -1) pick = chooseModule < 0 ? chooseModule+10 : chooseModule;

			if(pick != null && (!MOBILE || !ALLMODULE) && !showGuide){
				const I = INFO[modules[pick]];

				if(I != null){
					push(); textSize(14);
					const W = MODULE_NAME[modules[pick]]+"\n\n"+
						wrap(I, 220)+"\n\n"+STATS[modules[pick]];
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
			if(!MOBILE || chooseModule == -1) for(let i=0; i<5; ++i){
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

			fill(255, 150, 0, searching ? 60 :
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

				if(queueSize > (open ? 1 : 0)){
					textSize(15);
					H = mouseIn(width/2, height/2+230, textWidth("SOLO")+30, 15);
					fill(H ? 255 : 200); textSize(H ? 16 : 15);
					text("SOLO", width/2, height/2 + 230);
				}

			}else{
				textSize(25);
				const H = mouseIn(width/2, height/2+150, textWidth("ENTER QUEUE")+30, 30);
				fill(H ? 255 : 200); textSize(H ? 26 : 25);
				text("ENTER QUEUE", width/2, height/2 + 150);
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
				for(let i=0; i<5; ++i){
					fill(255, 100, 0, mouseIn(width/2-100+i*50, height/2+150, 20, 20) ? 80 : 60);
					rect(width/2-120+i*50, height/2+130, 40, 40);
					push(); translate(width/2-100+i*50, height/2+150);
					drawModule(DECOY+i);
					pop();
				}
			}

			if(chooseModule < -1){
				if(MOBILE){
					push(); translate(0, -100);
				}

				for(let i=0; i<6; ++i){
					fill(255, 50, 50, mouseIn(width/2-125+i*50, height/2+125, 20, 20) ? 80 : 60);
					rect(width/2-145+i*50, height/2+105, 40, 40);
					push(); translate(width/2-125+i*50, height/2+125);
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

				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+i ? 60 :
						(mouseIn(width/2-125+i*50, height/2+225, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+205, 40, 40);
					push(); translate(width/2-125+i*50, height/2+225);
					drawModule(EMP+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+i) rect(width/2-125+i*50, height/2+205, 40, 40);
				}

				for(let i=0; i<6; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+6+i ? 60 :
						(mouseIn(width/2-125+i*50, height/2+275, 20, 20) ? 80 : 60)
					);
					rect(width/2-145+i*50, height/2+255, 40, 40);
					push(); translate(width/2-125+i*50, height/2+275);
					drawModule(EMP+6+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+6+i) rect(width/2-145+i*50, height/2+255, 40, 40);
				}

				for(let i=0; i<6; ++i){
					fill(255, 100, 0, mouseIn(width/2-125+i*50, height/2+325, 20, 20) ? 80 : 60);
					rect(width/2-145+i*50, height/2+305, 40, 40);
					push(); translate(width/2-125+i*50, height/2+325);
					drawModule(DECOY+i);
					pop();
				}

				if(MOBILE) pop();
			}
		}

		if(showGuide) drawGuide();

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
			REV.set(ships[i].uid, i);
		}

		push(); fill(200, 50, 50, 20); stroke(255, 50, 50); strokeWeight(1.5*camera.z);

		for(let s of ships){
			s.travel();

			if(s.type == BOMBER){
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
					if(ships[shipID].type != BS || ships[shipID].team == ID || ships[shipID].modules[i].use)
						if(mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 20))
							if(RANGE[ships[shipID].modules[i].type] != null)
								circle(...screenPos(ships[shipID].vpos), RANGE[ships[shipID].modules[i].type]*2*camera.z);
				if(selectMove != null && selectMove[0] == "module" && RANGE[ships[shipID].modules[selectMove[1].i].type])
					circle(...screenPos(ships[shipID].vpos), RANGE[ships[shipID].modules[selectMove[1].i].type]*2*camera.z);
				pop();

				push();
				noFill(); stroke(...(ships[shipID].team == ID ? [70, 90, 90] : [90, 70, 70]), 100);
				let shade = true;
				for(let i=0; i<ships[shipID].modules.length; ++i)
					if(ships[shipID].type != BS || ships[shipID].team == ID || ships[shipID].modules[i].use){
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
						if(s.type != BS || s.team == ID || s.modules[i].use){
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

			if(dragMove != null && dragMove[2] == s.uid){
				push();
				strokeWeight(4*sqrt(camera.z)); noFill();
				stroke(200, 100, 100, 50);
				if(s.move.length)
					line(...screenPos(s.move[s.move.length-1].slice(0, 2)), dragMove[0], dragMove[1]);
				else line(...screenPos(s.pos), dragMove[0], dragMove[1]);
				pop();
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
			const s = ships[i];
			if(s.imp == 0){
				push(); translate(width/2+(s.vpos[0]-camera.x)*camera.z, height/2+(s.vpos[1]-camera.y)*camera.z);

				for(let m of s.modules) if(Array.isArray(m.aux) && m.aux.length && m.aux[0] &&
					(m.aux[1] > 3/TIME[m.type] || ((Date.now()/1000)%1 < 0.5)) || m.type == PASSIVE){

					if(m.type == ALPHA) drawEffect(ALPHA);

					if(m.type == DELTA) drawEffect(DELTA, m.aux[2]);

					if(m.type == PASSIVE && (m.use || s.type != BS || s.team == ID))
						drawEffect(PASSIVE, m.aux[0]);

					if(m.type == OMEGA) drawEffect(OMEGA);

					if(m.type == MIRROR) drawEffect(MIRROR, m.aux[0]);

					if(m.type == ALLY) drawEffect(ALLY, m.aux[0]);
				}
			}

			pop();
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
			//circle(...screenPos(d[0]), (3000-d[1]+NOW)/50*sqrt(camera.z));
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

		for(let s of ships){
			push(); translate(...screenPos(s.vpos));
			drawShip2(s);
			pop();
		}

		push();
		for(let b of entities.blast){
			fill(200, 100, 50, ceil((b[2]-NOW)*255/2/TPS));
			circle(...screenPos(b[0]), b[1]*2*camera.z);
		}
		pop();

		{
			const S = sqrt(camera.z);

			function SH(uid){
				return REV.has(uid) ? ships[REV.get(uid)] : null;
			}

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
							fill(200, 100, 50, 150); noStroke();
							circle(...screenPos(C), 12*S*(5+sin(Date.now()/16/20))/5);
						}

						for(let uid of m.aux){
							let x = SH(uid);
							if(x == null) continue;

							if([LASER, LASER2, COL].includes(m.type)){
								fill(200, 100, 50, 150); noStroke();
								circle(...screenPos(x.vpos), 7*S*(8+sin(Date.now()/16/20))/8);
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
								circle(...screenPos(x.vpos), 7*S*(8+sin(Date.now()/16/20))/8);
								let R = [x.vpos[0]-s.vpos[0], x.vpos[1]-s.vpos[1]],
									D = _dist(x.vpos, s.vpos);
								R[0] /= D; R[1] /= D;
								R[0] = s.vpos[0]+R[0]*10/S;
								R[1] = s.vpos[1]+R[1]*10/S;
								stroke(50, 150, 200); strokeWeight(2*S);
								line(...screenPos(R), ...screenPos(x.vpos));

							}else if([CANNON, SPREAD, SENTINEL, GUARD, INT].includes(m.type)){
								stroke(200, 100, 50); strokeWeight(2*S);
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
				fill(0, 20, 30); stroke(50, 200, 200, 50); strokeWeight(3);
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
					const hp = ships[shipID].hp, max = ships[shipID].mhp;

					push();
					fill(0, 20, 30); stroke(50, 200, 200, 50); strokeWeight(3);
					rect(width/2-150, height-120, 300, 100);
					pop();

					push(); textAlign(LEFT, TOP); textSize(18);
					fill(200); noStroke(); text(
						focus[0] == "rock" ? "ASTEROID" : NAME[ships[shipID].type] +
							(ships[shipID].user != null ? "  [" + ships[shipID].user + "]" : ""),
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
					text(ceil(hp).toString() + " / " + max.toString(), width/2+150-20-100+50, height-120+100-20-20+7.5);
					pop();

					for(let m of ships[shipID].modules)
						if(m.type >= ALPHA && m.type <= ALLY)
							if(m.aux[0] && (m.use || ships[shipID].type != BS || ships[shipID].team == ID)){
								fill(50, 150, 150);
								rect(width/2+150-20-100, height-120+100-20-20-6, ceil(100*m.aux[0]), 3);
							}

					for(let i=0; i<ships[shipID].modules.length; ++i){
						const H = mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 20);

						const Y = height-120-10-25 - (H && ships[shipID].modules[i].state == 1 && ACTIVATED[ships[shipID].modules[i].type] && (
								ships[shipID].type != BS || ships[shipID].modules[i].use || ships[shipID].team == ID
							)? 2 : 0);

						push(); translate(width/2+25-25*ships[shipID].modules.length+50*i, Y);
						const S = ships[shipID], M = S.modules[i];
						drawModule2(M.use || S.type != BS || S.team == ID ? M.type : NULL, ships[shipID].modules[i].state);
						pop();

						if(H){
							if(!MOBILE && mouseIsPressed){
								const T = M.use || S.type != BS || S.team == ID ? M.type : NULL;

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

							}else if(ACTIVATED[M.type] || [DART, ROCKETD, BOMBER].includes(M.type)){
								const T = M.use || S.type != BS || S.team == ID ? M.type : NULL;

								if(T != NULL){
									const RT = M.type >= ALPHA && M.type <= ALLY ? RECHARGE_TIME[T] : RECHARGE_TIME[T]-EFFECT_TIME[T];
									push(); textSize(14); textAlign(CENTER, BOTTOM); fill(..._moduleColor(T), 150);
									text((M.state == 1 ? "[READY]" : (
										M.state < 0 ? ("[ACTIVE] " + ceil(-EFFECT_TIME[T]*M.state) + "s") :
										("[RECHARGING] " + ceil((RT)*(1-M.state)) + "s"))),
										width/2+25-25*S.modules.length+50*i, Y-35);
									pop();
								}
							}
						}
					}

					let canMove = ships[shipID].team == ID && !snapshot &&
						ships[shipID].type == BS && ships[shipID].tp == null,
						canStop = ships[shipID].wait;

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
					push(); translate(width/2-70, height-50);
					if(canMove && (canStop || ships[shipID].move.length > 1)){
						if(mouseIn(width/2-70, height-50, 20, 20)){
							stroke(30, 90, 110);
							scale(1.1);
						}else stroke(20, 70, 80);
					}else stroke(10, 40, 60);
					line(-10, -10, 10, 10);
					line(-10, 10, 10, -10);
					pop();
					if(GOD){
						if(mouseIn(width/2-23, height-50, 20, 20)) stroke(30, 90, 110);
						else stroke(20, 70, 80);
						noFill();
						arc(width/2-23, height-50, 20, 20, PI*-0.3, PI*0.3);
						arc(width/2-23, height-50, 20, 20, PI*0.7, PI*1.3);
						circle(width/2-23, height-50, 8);
						line(width/2-23, height-50-4, width/2-23, height-50-12);
						line(width/2-23, height-50+4, width/2-23, height-50+12);
					}
					if(GOD){
						if(mouseIn(width/2+117, height-95, 20, 20)) stroke(20, 70, 80);
						else stroke(10, 40, 60);
						noFill();
						arc(width/2+125, height-95, 10, 10, -PI*0.75, PI*0.75);
						arc(width/2+110, height-95, 10, 10, PI-PI*0.75, PI+PI*0.75);
						line(width/2+117.5-15/4, height-95-15/4, width/2+117.5+15/4, height-95+15/4);
						line(width/2+117.5+15/4, height-95-15/4, width/2+117.5+15/6, height-95-15/6);
						line(width/2+117.5-15/4, height-95+15/4, width/2+117.5-15/6, height-95+15/6);
					}
					pop();
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

		{
			let shipInArena = false;

			for(let s of ships) if(s.team == ID && s.type == BS) shipInArena = true;

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

	if(mouseIn(30, 30, 30, 30)){
		showGuide = !showGuide;
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

	if(chooseModule == -1){
		push();
		textSize(18);
		const T = queueSize.toString() + " OTHER PLAYER" + (queueSize == 1 ? "" : "S") + " IN QUEUE  -  ";
		const D = textWidth(T), E = textWidth("START GAME");
		pop();

		if(mouseIn(width/2+D/2, height/2+150, E/2+30, 15)){
			if(searching){
				searching = 0;
				staging = 0;
				if(open) begin();
				else solo();
				return;
			}
		}

		if(mouseIn(width/2, height/2+150, 120, 30)){
			if(!searching){
				searching = 1;
				setTimeout(() => {
					if(searching){
						start();
						open = 1;
					}
				}, 2000);
				return;
			}
		}

		if(mouseIn(width/2, height/2+200, 120, 15)){
			if(searching){
				searching = 0;
				if(open) cancel();
				open = 0;
				return;
			}
		}

		if(mouseIn(width/2, height/2+230, 60, 15) && queueSize > (open ? 1 : 0)){
			if(searching){
				searching = 0;
				if(open) cancel();
				solo();
				staging = 0;
				return;
			}
		}

	}else if(chooseModule == 0){
		let p = true;

		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+150, 20, 20)){
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

		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+125, 20, 20) &&
				modules[5-chooseModule] != EMP+i){
				modules[chooseModule] = modules[chooseModule] == EMP+i ? null : EMP+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+175, 20, 20) &&
				modules[5-chooseModule] != EMP+5+i){
				modules[chooseModule] = modules[chooseModule] == EMP+5+i ? null : EMP+5+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;

	}else if(chooseModule == 4){
		let p = true;

		for(let i=0; i<5; ++i){
			if(mouseIn(width/2-100+i*50, height/2+150, 20, 20)){
				modules[4] = modules[4] == DECOY+i ? null : DECOY+i;
				localStorage.setItem("modules", JSON.stringify(modules));
				p = false;
			}
		}

		if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;

	}else if(chooseModule < -1){
		const OFFSET = MOBILE ? 100 : 0;

		let p = true;

		for(let i=0; i<6; ++i)
			if(mouseIn(width/2-125+i*50, height/2+125-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == LASER+i ? null : LASER+i;
				p = false;
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

		for(let i=0; i<6; ++i)
			if(mouseIn(width/2-125+i*50, height/2+275-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == EMP+6+i ? null : EMP+6+i;
				p = false;
			}

		for(let i=0; i<6; ++i)
			if(mouseIn(width/2-125+i*50, height/2+325-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == DECOY+i ? null : DECOY+i;
				p = false;
			}

		if(!mouseIn(width/2, height/2+50, 150, 20) && p) chooseModule = -1;
		if(MOBILE) chooseModule = -1;
	}

	if(!searching){
		if(ALLMODULE){
			for(let i=0; i<5; ++i)
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
}

function click(){
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
			if(s.team == ID && s.type == BS){
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
				if(ships[shipID].team == ID && ships[shipID].modules[i].state == 1){
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
			let canMove = ships[shipID].team == ID &&
				ships[shipID].type == BS && ships[shipID].tp == null,
				canStop = canMove && ships[shipID].wait;
			if(canMove && (ships[shipID].move.length > 1 || canStop) &&
				mouseIn(width/2-70, height-50, 20, 20)){
				socket.emit("cancelMove", {gameID: gameID, shipID: focus[1]});
				ships[shipID].wait = null;
			}
			if(GOD && mouseIn(width/2-23, height-50, 20, 20)) god();
			if(GOD && mouseIn(width/2+117, height-95, 20, 20)) ascend();
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
					_dist(P, ships[shipID].vpos) < RANGE[ships[shipID].modules[selectMove[1].i].type]){
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
				if(_dist(ships[shipID].vpos, s.vpos) < RANGE[RIPPLE]
					&& (ships[shipID].team == s.team || s.team == CERB)){
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
	if(!staging && connected){
		if(key == 'w'){
			for(let s of ships){
				if(s.type == BS && s.team == ID){
					focus = ["ship", s.uid];
					return;
				}
			}
		}

		if(focus && shipID != null && selectMove == null){
			const keys = "asdfghjkl;";

			for(let i=0; i<ships[shipID].modules.length; ++i){
				if(key == keys[i]){
					if(ships[shipID].team == ID && !snapshot && ships[shipID].modules[i].state == 1){
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
				let canMove = ships[shipID].team == ID &&
					ships[shipID].type == BS && ships[shipID].tp == null,
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
