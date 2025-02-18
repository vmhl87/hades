let font = null;

let modules = [null, null, null, null, null];

let searching = 0, staging = 1, chooseModule = -1,
	connected = 0, snapshot = 0, ID = null, now = null;

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

let ships = [], rocks = [], blasts = [], deaths = [], heals = [], emps = [],
	imps = [], sectorDeaths = [], gameID = null, ROWS, COLS, dead = [];

socket.on("reset", () => {
	searching = 0;
	staging = 1;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;
});

socket.on("start", data => {
	chooseModule = -1;
	searching = 0;
	staging = 0;
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

	blasts = [];
	deaths = [];
	heals = [];
	emps = [];
	imps = [];
	sectorDeaths = [];

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

	for(let i=0; i<ROWS*COLS; ++i)
		dead[i] = data.dead[i];

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

		if(T == "emp"){
			emps.push([D, Date.now() + 4000]);
		}

		if(T == "imp"){
			imps.push([D, Date.now() + 4000]);
		}

		if(T == "deadSector"){
			sectorDeaths.push([D, Date.now() + 4000]);
		}
	}
});

socket.on("end", () => {
	chooseModule = -1;
	searching = 0;
	staging = 1;
	connected = 0;
	select = null;
	selectMove = null;
	gameID = null;
});

function main(){
	background(0, 10, 25);

	if(staging){
		fill(200); noStroke();
		push(); translate(width/2, height/2-100);
		scale(5); drawShip(BS, 0, 2);
		pop();

		if(localStorage.getItem("save") != null && !searching){
			push();
			stroke(50, 200, 200, mouseIn(width-30, 30, 30, 30) ? 80 : 60); strokeWeight(3);
			noFill();
			beginShape();
			vertex(width-27, 20);
			vertex(width-27, 40);
			vertex(width-20, 33);
			endShape();
			beginShape();
			vertex(width-40, 27);
			vertex(width-33, 20);
			vertex(width-33, 40);
			endShape();
			if(mouseIn(width-30, 30, 30, 30)){
				textAlign(RIGHT, CENTER); textSize(17);
				fill(50, 200, 200, 80); noStroke();
				text("VIEW SNAPSHOT", width-60, 28);
			}
			pop();
		}

		{
			let pick = null;

			for(let i=0; i<5; ++i) if(mouseIn(width/2-100+50*i, height/2+50, 25, 20))
				pick = i;

			if(chooseModule != -1) pick = chooseModule < 0 ? chooseModule+10 : chooseModule;

			if(pick != null && (!MOBILE || !ALLMODULE)){
				const I = INFO[modules[pick]];
				const N = MODULE_NAME[modules[pick]];

				if(I != null){
					push(); textSize(14);
					const W = wrap(I, 220);
					const H = font.textBounds(N+'\n\n'+W, 0, 0).h;
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
					text(N + '\n\n' + W, width/2-110, height/2-20);
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

				for(let i=0; i<5; ++i){
					fill(255, 100, 0, mouseIn(width/2-100+i*50, height/2+325, 20, 20) ? 80 : 60);
					rect(width/2-120+i*50, height/2+305, 40, 40);
					push(); translate(width/2-100+i*50, height/2+325);
					drawModule(DECOY+i);
					pop();
				}

				if(MOBILE) pop();
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

		let REV = new Map();

		let bsID = [], cerbID = [], repairID = [], shieldID = [];
		for(let i=0; i<ships.length; ++i){
			if(ships[i].type == BS){
				bsID.push(i);
				shieldID.push(i);
			}
			if(ships[i].type >= SENTINEL && ships[i].type <= COL)
				cerbID.push(i);
			if(ships[i].type == REPAIR) repairID.push(i);
			if(ships[i].type == SHIELD) shieldID.push(i);
			REV.set(ships[i].uid, i);
		}

		for(let s of ships) s.travel();

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
		rectMode(CENTER, CENTER);
		for(let i of sectorDeaths){
			stroke(255, 50, 50, 150); strokeWeight(2); noFill();
			let m = min(1, ((Date.now()/2000)%1)*2);
			if(m < 1) rect(300*(i[0]%COLS)+150, 300*floor(i[0]/COLS)+150, 300*m, 300*m);
			strokeWeight(1.5);
			m = min(1, ((Date.now()/2000-0.1)%1)*2);
			if(m < 1) rect(300*(i[0]%COLS)+150, 300*floor(i[0]/COLS)+150, 300*m, 300*m);
			strokeWeight(1);
			m = min(1, ((Date.now()/2000-0.2)%1)*2);
			if(m < 1) rect(300*(i[0]%COLS)+150, 300*floor(i[0]/COLS)+150, 300*m, 300*m);
		}
		pop();

		if(!snapshot) sectorDeaths = sectorDeaths.filter(x => x[1] > Date.now() ||
			(Date.now()/2000)%1 < 0.5 || (Date.now()/2000-0.2)%1 < 0.5);

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
					if(mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 20))
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

		for(let i of shieldID){
			const s = ships[i];
			if(s.imp == 0){
				push(); translate(width/2+(s.vpos[0]-camera.x)*camera.z, height/2+(s.vpos[1]-camera.y)*camera.z);
				scale(sqrt(camera.z));

				for(let m of s.modules) if(Array.isArray(m.aux) && m.aux.length && m.aux[0] &&
					(m.aux[1] > 3/TIME[m.type] || (m.aux[1]*TIME[m.type])%1 < 0.5) || m.type == PASSIVE){
					push();

					if(m.type == ALPHA){
						stroke(50, 150, 150, 50); noFill(); strokeWeight(3);
						arc(0, 0, 50-3, 50-3, -PI*0.25, PI*0.25);
						arc(0, 0, 50-3, 50-3, PI-PI*0.25, PI+PI*0.25);

						noStroke(); fill(50, 150, 150, 80);
						circle(0, 0, 50);
					}

					if(m.type == IMPULSE){
						if(m.aux[2]){
							fill(200, 100, 50, 100); noStroke();
							circle(0, 0, RANGE[IMPULSE]*2*sqrt(camera.z));
						}

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
						if(-PI/2+PI*2*m.aux[0] > -PI*0.08) arc(0, 0, RANGE[ALLY]*2-6, RANGE[ALLY]*2-6,
							max(-PI/2, -PI*0.08), min(-PI/2+PI*2*m.aux[0], PI*0.08));
						if(-PI/2+PI*2*m.aux[0] > PI-PI*0.08) arc(0, 0, RANGE[ALLY]*2-6, RANGE[ALLY]*2-6,
							max(-PI/2, PI-PI*0.08), min(-PI/2+PI*2*m.aux[0], PI*1.08));
					}

					pop();
				}
			}

			pop();
		}

		const NOW = snapshot ? now : Date.now();

		push();
		for(let e of emps){
			noStroke();
			fill(100, 150, 255, 50*min(1, (e[1]-NOW)/1600));
			circle(...screenPos(e[0]), RANGE[EMP]*2*camera.z*min(1, (NOW-e[1]+4000)/600));
			stroke(100, 150, 255, 100); strokeWeight(2*sqrt(camera.z));
			noFill();
			if(e[1]-NOW > 800){
				for(let j=0; j<3; ++j){
					let a = noise(floor(Date.now()/100), j)*30;
					beginShape();
					for(let i=20; i<=RANGE[EMP]*min(1, (Date.now()-e[1]+4000)/600); i+=10){
						const old = a;
						a += (noise(floor(Date.now()/100+i), j)*2-1)*PI*0.1;

						vertex(...screenPos([e[0][0]+cos(a)*i, e[0][1]+sin(a)*i]));
					}
					endShape();
				}
			}
		}
		pop();

		if(!snapshot) emps = emps.filter(x => x[1] > NOW);
		
		push();
		for(let i of imps){
			noStroke();
			fill(100, 255, 150, 50*min(1, (i[1]-NOW)/1600));
			circle(...screenPos(i[0]), RANGE[DISRUPT]*2*camera.z*min(1, (NOW-i[1]+4000)/600));
			stroke(100, 255, 150, 100*min(1, (i[1]-NOW)/400)); noFill(); strokeWeight(2*sqrt(camera.z));
			for(let j=0; j<3; ++j){
				let a = (1-Math.pow(noise(floor(Date.now()/100), j), 2))*
						(2*(RANGE[DISRUPT]+20)*min(1, (Date.now()-i[1]+4000)/600)-40)+40,
					b = (noise(floor(Date.now()/100)+100, j)*30)%(PI*2),
					c = (b+noise(floor(Date.now()/100)+200, j)*PI*2)%(PI*2);
				arc(...screenPos(i[0]), a*camera.z, a*camera.z, b, c);
			}
		}
		pop();

		if(!snapshot) imps = imps.filter(x => x[1] > NOW);
		
		push(); noStroke();
		for(let h of heals){
			fill(50, 200, 50, 60*sin((h[1]-NOW)/2000*PI));
			circle(...screenPos(h[0]), 60*2*camera.z);
		}
		pop();

		if(!snapshot) heals = heals.filter(x => x[1] > NOW);

		push(); noFill(); strokeWeight(3*sqrt(camera.z));
		for(let d of deaths){
			stroke(0, 255, 255, 80*Math.min(1, (d[1]-NOW)/800));
			circle(...screenPos(d[0]), (3000-d[1]+NOW)/50*sqrt(camera.z));
		}
		pop();

		if(!snapshot) deaths = deaths.filter(x => x[1] > NOW);

		for(let i of bsID){
			const s = ships[i];
			for(let m of s.modules){
				if(m.type == DESTINY && m.state < 0){
					push(); fill(255, 100, 50, 20); noStroke();
					circle(...screenPos(s.vpos), RANGE[DESTINY]*2*camera.z);
					noFill(); stroke(200, 100, 50); strokeWeight(2*sqrt(camera.z));
					arc(...screenPos(s.vpos), RANGE[DESTINY]*2*camera.z, RANGE[DESTINY]*2*camera.z,
						-PI/2, -PI/2+PI*2*(1+m.state));
					pop();
				}

				if(m.type == VENG && m.state < 0){
					push(); fill(255, 50, 50, 20); noStroke();
					circle(...screenPos(s.vpos), RANGE[VENG]*2*camera.z);
					noFill(); stroke(200, 50, 50); strokeWeight(2*sqrt(camera.z));
					arc(...screenPos(s.vpos), RANGE[VENG]*2*camera.z, RANGE[VENG]*2*camera.z,
						-PI/2, -PI/2+PI*2*(1+m.state));
					pop();
				}

				if(m.type == BARRIER && m.state < 0){
					push(); strokeWeight(2*sqrt(camera.z));
					if(m.state < -3/TIME[m.type] || ((-m.state*TIME[m.type])%1 < 0.5)){
						fill(255, 20); noStroke();
						for(let i=0; i<6; ++i)
							arc(...screenPos(s.vpos), RANGE[BARRIER]*2*camera.z, RANGE[BARRIER]*2*camera.z,
								PI/3*i-PI*0.25+PI*Date.now()/10000, PI/3*i+PI*0.25+PI*Date.now()/10000, OPEN);
					}
					stroke(150, 150); noFill();
					circle(...screenPos(s.vpos), RANGE[BARRIER]*2*camera.z);
					pop();
				}

				if(m.type == AMP && m.state < 0){
					push(); strokeWeight(2*sqrt(camera.z));
					fill(200, 50, 50, 30); noStroke();
					circle(...screenPos(s.vpos), RANGE[AMP]*2*camera.z);
					stroke(200, 50, 50, 100); noFill();
					circle(...screenPos(s.vpos), RANGE[AMP]*2*camera.z);
					if(m.state < -3/TIME[m.type] || ((-m.state*TIME[m.type])%1 < 0.5)){
						strokeWeight(1.5*sqrt(camera.z));
						circle(...screenPos(s.vpos), (RANGE[AMP]-4)*2*camera.z);
						strokeWeight(sqrt(camera.z));
						circle(...screenPos(s.vpos), (RANGE[AMP]-8)*2*camera.z);
						strokeWeight(0.6*sqrt(camera.z));
						circle(...screenPos(s.vpos), (RANGE[AMP]-12)*2*camera.z);
						strokeWeight(0.3*sqrt(camera.z));
						circle(...screenPos(s.vpos), (RANGE[AMP]-16)*2*camera.z);
					}
					pop();
				}
			}

			if(s.fort > 0){
				push(); stroke(200, 100, 50, 255*min(1, (0.5-abs(s.fort-0.5))*3)); noFill(); strokeWeight(2);
				translate(...screenPos(s.vpos)); scale(sqrt(camera.z));
				for(let i=0; i<6; ++i){
					arc(0, 0, 50, 50, PI/3*i-PI/2-PI/15+Date.now()/2000, PI/3*i-PI/2+PI/15+Date.now()/2000);
					line(21*sin(PI/3*i+Date.now()/1500), 21*cos(PI/3*i+Date.now()/1500), 17*sin(PI/3*i+Date.now()/1500), 17*cos(PI/3*i+Date.now()/1500));
				}
				pop();
			}
		}

		for(let i of repairID){
			if(ships[i].type == REPAIR){
				push(); fill(50, 200, 50, 20); noStroke();
				circle(...screenPos(ships[i].vpos), 60*2*camera.z);
				pop();
			}
		}


		for(let s of ships){
			push(); translate(width/2+(s.vpos[0]-camera.x)*camera.z, height/2+(s.vpos[1]-camera.y)*camera.z);
			rotate(s.rot); scale(sqrt(camera.z));
			drawShip(s.type, s.team != socket.id && s.team != ID ? (s.type == BS && Number.isInteger(s.team) ? 2 : 1) : 0, s.move.length && !s.emp ? 1 : 0);
			rotate(-s.rot);
			if(s.emp){
				stroke(255, 50, 50); noFill(); strokeWeight(2);
				arc(0, 0, 35, 35, -PI*0.25, PI*0.25);
				arc(0, 0, 35, 35, PI-PI*0.25, PI+PI*0.25);
			}
			if(s.ally){
				stroke(50, 200, 200); noFill(); strokeWeight(2);
				arc(0, 0, 40, 40, -PI*0.25, PI*0.25);
				arc(0, 0, 40, 40, PI-PI*0.25, PI+PI*0.25);
			}
			if(s.type == TURRET && s.modules[0].state < 1){
				stroke(50, 150, 200, 150*(1-s.modules[0].state)); noFill(); strokeWeight(2);
				for(let i=0; i<3; ++i)
					arc(0, 0, 20, 20, PI*2*i/3+Date.now()/500, PI*2*i/3+PI/3+Date.now()/500);
			}
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

			if(s.imp == 0) for(let m of s.modules)
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

			function SH(uid){
				return REV.has(uid) ? ships[REV.get(uid)] : null;
			}

			push();
			for(let s of ships) if(!s.emp){
				let sol = false;

				for(let m of s.modules)
					if(m.type == SOL && m.state == 1)
						sol = true;

				for(let m of s.modules)
					if((m.type >= LASER && m.type <= TURRETD) || (m.type >= SENTINEL && m.type <= COL))
					if(m.aux.length){
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

						if(sol){
							push(); translate(...screenPos(s.vpos)); scale(S);
							translate(0, 25); scale(1/2); drawModule(SOL);
							pop();
						}
					}
			}
			pop();

			if(focus && focus[0] == "ship" && shipID != null){
				for(let m of ships[shipID].modules)
					if((m.type >= LASER && m.type <= TURRETD) || (m.type >= SENTINEL && m.type <= COL))
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
					text(ceil(hp).toString() + " / " + max.toString(), width/2+150-20-100+50, height-120+100-20-20+7.5);
					pop();

					for(let m of ships[shipID].modules)
						if(m.type >= ALPHA && m.type <= ALLY)
							if(m.aux[0]){
								fill(50, 150, 150);
								rect(width/2+150-20-100, height-120+100-20-20-6, ceil(100*m.aux[0]), 3);
							}

					for(let i=0; i<ships[shipID].modules.length; ++i){
						push(); translate(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25);
						drawModule2(ships[shipID].modules[i].type, ships[shipID].modules[i].state);
						pop();

						if(!MOBILE && mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 20) && mouseIsPressed && mouseButton == RIGHT){
							const I = INFO[ships[shipID].modules[i].type];
							const N = MODULE_NAME[ships[shipID].modules[i].type];

							if(I != null){
								push(); textSize(14);
								const W = wrap(I, 220);
								const H = font.textBounds(N+'\n\n'+W, 0, 0).h;
								const P = width/2+25-25*ships[shipID].modules.length+50*i;

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
								text(N + '\n\n' + W, width/2-110, height-225);
								pop();
							}
						}
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
						const wait = 25-floor(ships[shipID].wait[2]*25);
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

		push();
		stroke(50, 200, 200, mouseIn(30, 30, 30, 30) ? 80 : 60); strokeWeight(3);
		line(20, 20, 40, 40);
		line(20, 40, 27, 33);
		line(33, 27, 40, 20);
		if(mouseIn(30, 30, 30, 30)){
			textAlign(LEFT, CENTER); textSize(17);
			fill(50, 200, 200, 80); noStroke();
			text(snapshot ? "EXIT SNAPSHOT" : "EXIT GAME", 60, 28);
		}
		pop();

		if(!snapshot){
			push();
			stroke(50, 200, 200, mouseIn(width-30, 30, 30, 30) ? 80 : 60); strokeWeight(3);
			noFill();
			beginShape();
			vertex(width-27, 20);
			vertex(width-27, 40);
			vertex(width-20, 33);
			endShape();
			beginShape();
			vertex(width-40, 27);
			vertex(width-33, 20);
			vertex(width-33, 40);
			endShape();
			if(mouseIn(width-30, 30, 30, 30)){
				textAlign(RIGHT, CENTER); textSize(17);
				fill(50, 200, 200, 80); noStroke();
				text("SAVE SNAPSHOT", width-60, 28);
			}
			pop();
		}

		{
			let shipInArena = false;

			for(let s of ships) if(s.team == socket.id && s.type == BS) shipInArena = true;

			if(focus == null && shipInArena){
				push();
				stroke(50, 200, 200, mouseIn(width-30, height-30, 30, 30) ? 80 : 60); strokeWeight(3);
				line(width-20, height-20, width-23, height-23);
				line(width-20, height-40, width-23, height-37);
				line(width-40, height-20, width-37, height-23);
				line(width-40, height-40, width-37, height-37);
				noFill(); strokeWeight(2);
				circle(width-30, height-30, 6);
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

	if(chooseModule == -1){
		if(mouseIn(width/2, height/2+150, 60, 30)){
			if(!searching){
				searching = 1;
				start();
			}
		}

		if(mouseIn(width/2, height/2+200, 60, 15)){
			if(searching){
				searching = 0;
				cancel();
			}
		}

		if(mouseIn(width/2, height/2+230, 60, 15)){
			if(searching){
				searching = 0;
				cancel();
				solo();
				staging = 0;
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

		for(let i=0; i<5; ++i)
			if(mouseIn(width/2-100+i*50, height/2+225-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == EMP+i ? null : EMP+i;
				p = false;
			}

		for(let i=0; i<6; ++i)
			if(mouseIn(width/2-125+i*50, height/2+275-OFFSET, 20, 20)){
				modules[chooseModule+10] = modules[chooseModule+10] == EMP+5+i ? null : EMP+5+i;
				p = false;
			}

		for(let i=0; i<5; ++i)
			if(mouseIn(width/2-100+i*50, height/2+325-OFFSET, 20, 20)){
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
			focus = null;
			shipID = null;
		}
		
	}else shipID = null;

	if(!focus && mouseIn(width-30, height-30, 30, 30))
		for(let s of ships)
			if(s.team == socket.id && s.type == BS){
				focus = ["ship", s.uid];
				return;
			}

	if(focus && shipID != null && selectMove == null){
		for(let i=0; i<ships[shipID].modules.length; ++i){
			if(mouseIn(width/2+25-25*ships[shipID].modules.length+50*i, height-120-10-25, 25, 25)){
				if(ships[shipID].team == socket.id && ships[shipID].modules[i].state == 1){
					if(ships[shipID].tp != null && [TP, DESTINY, RIPPLE].includes(ships[shipID].modules[i].type))
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
				ships[shipID].wait = null;
			}
			if(GOD && mouseIn(width/2-23, height-50, 20, 20)) god();
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
				ships[shipID].wait = [rocks[select[1]][0], rocks[select[1]][1]+10, 1, select[1]];
				selectMove = null;
				
			}else if(selectMove[0] == "module" && shipID != null){
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

		}else if(shipID != null && ships[shipID].modules[selectMove[1].i].type == RIPPLE && select != null && select[1] != selectMove[1].s){
			for(let s of ships) if(s.uid == select[1])
				if(_dist(ships[shipID].vpos, s.vpos) < RANGE[RIPPLE]
					// TODO modification to ripple
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
		if(key == 'R' && !snapshot){
			localStorage.setItem("save", saveState());
			return;
		}

		if(focus && shipID != null && selectMove == null){
			const keys = "asdfghjkl;";

			for(let i=0; i<ships[shipID].modules.length; ++i){
				if(key == keys[i]){
					if(ships[shipID].team == socket.id && ships[shipID].modules[i].state == 1){
						if(ships[shipID].tp != null && [TP, DESTINY, RIPPLE].includes(ships[shipID].modules[i].type))
							return;
						if(LOCMOD.includes(ships[shipID].modules[i].type))
							selectMove = ["module", {s: focus[1], i: i}];
						else socket.emit("activateModule", {gameID: gameID, shipID: focus[1], i: i});
					}
					return;
				}
			}
		}

		if(focus && selectMove == null){
			if(shipID != null){
				let canMove = ships[shipID].team == socket.id &&
					ships[shipID].type == BS && ships[shipID].tp == null,
					canStop = canMove && ships[shipID].wait;
				if(canMove && (ships[shipID].move.length > 1 || canStop) &&
					key == 'x'){
					socket.emit("cancelMove", {gameID: gameID, shipID: focus[1]});
					ships[shipID].wait = null;
				}
				if(GOD && key == 'w') god();
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
