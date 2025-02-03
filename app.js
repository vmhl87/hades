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

let ships = [], rocks = [];

socket.on("reset", () => {
	searching = 0;
	staging = 1;
	open = 0;
	connected = 0;
});

socket.on("start", data => {
	chooseModule = -1;
	searching = 0;
	staging = 0;
	open = 0;
	connected = 1;

	ships = [];
	for(let s of data.ships)
		ships.push(new Ship(s));
	rocks = data.rocks;
});

socket.on("state", data => {
	let uids = new Set();
	for(let d of data) uids.add(d.uid);

	ships = ships.filter(x => uids.has(x.uid));

	uids = new Set();
	for(let s of ships){
		for(let d of data){
			if(s.uid == d.uid){
				s.decode(d);
			}
		}
		uids.add(s.uid);
	}

	for(let d of data) if(!uids.has(d.uid)){
		ships.push(new Ship(d));
	}
});

socket.on("end", () => {
	chooseModule = -1;
	searching = 0;
	staging = 1;
	open = 0;
	connected = 0;
});

let camera = {x: 0, y: 0, z: 1};

function draw(){
	background(0, 10, 25);

	if(staging){
		fill(200); noStroke();
		push(); translate(width/2, height/2-100);
		scale(5); drawShip(BS, 0, 1);
		pop();

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

				for(let i=0; i<4; ++i){
					fill(100, 255, 100,
						modules[5-chooseModule] == EMP+5+i ? 60 :
						(mouseIn(width/2-75+i*50, height/2+175, 20, 20) ? 80 : 60)
					);
					rect(width/2-95+i*50, height/2+155, 40, 40);
					push(); translate(width/2-75+i*50, height/2+175);
					drawModule(EMP+5+i);
					pop();
					fill(0, 100);
					if(modules[5-chooseModule] == EMP+5+i) rect(width/2-95+i*50, height/2+155, 40, 40);
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
		}

	}else if(connected){
		for(let s of ships){
			let target;
			if(s.move.length) target = atan2(s.move[0][1]-s.pos[1], s.move[0][0]-s.pos[0]);
			else target = PI*1.7;

			let diff = target - s.rot;
			if(diff > PI) diff -= PI*2;
			if(diff < -PI) diff += PI*2;

			s.rot += diff * 0.1;
			if(s.rot > PI*2) s.rot -= PI*2;
			if(s.rot < -PI*2) s.rot += PI*2;

			s.vpos[0] = lerp(s.vpos[0], s.pos[0], 0.05);
			s.vpos[1] = lerp(s.vpos[1], s.pos[1], 0.05);
		}

		for(let r of rocks){
			push();
			translate(width/2-camera.x, height/2-camera.y); scale(camera.z);
			noStroke(); fill(150, 100, 200);
			rect(r[0]-1, r[1]-1, 2, 2);
			pop();
		}

		for(let s of ships){
			push();
			translate(width/2-camera.x, height/2-camera.y); scale(camera.z);
			stroke(100, 200, 200, 30); strokeWeight(4);
			if(s.move.length) line(s.vpos[0], s.vpos[1], s.move[0][0], s.move[0][1]);
			for(let i=0; i<s.move.length-1; ++i)
				line(s.move[i][0], s.move[i][1], s.move[i+1][0], s.move[i+1][1]);
			pop();
		}

		for(let s of ships){
			push(); translate(s.vpos[0], s.vpos[1]);
			translate(width/2-camera.x, height/2-camera.y); scale(camera.z);
			rotate(s.rot);
			drawShip(s.type, s.team != socket.id, s.move.length ? 1 : 0);
			pop();
		}

	}else{
		fill(200); textSize(25); noStroke();
		text("CONNECTING", width/2, height/2);
	}
}

function mouseReleased(){
	if(staging){
		if(!searching){
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
					modules[0] = LASER+i;
					chooseModule = -1;
					localStorage.setItem("modules", JSON.stringify(modules));
				}
			}

		}else if(chooseModule == 1){
			for(let i=0; i<6; ++i){
				if(mouseIn(width/2-125+i*50, height/2+150, 20, 20)){
					modules[1] = ALPHA+i;
					chooseModule = -1;
					localStorage.setItem("modules", JSON.stringify(modules));
				}
			}

		}else if(chooseModule == 2 || chooseModule == 3){
			for(let i=0; i<5; ++i){
				if(mouseIn(width/2-100+i*50, height/2+125, 20, 20) &&
					modules[5-chooseModule] != EMP+i){
					modules[chooseModule] = EMP+i;
					chooseModule = -1;
					localStorage.setItem("modules", JSON.stringify(modules));
				}
			}

			for(let i=0; i<4; ++i){
				if(mouseIn(width/2-75+i*50, height/2+175, 20, 20) &&
					modules[5-chooseModule] != EMP+5+i){
					modules[chooseModule] = EMP+5+i;
					chooseModule = -1;
					localStorage.setItem("modules", JSON.stringify(modules));
				}
			}

		}else if(chooseModule == 4){
			for(let i=0; i<4; ++i){
				if(mouseIn(width/2-75+i*50, height/2+150, 20, 20)){
					modules[4] = DECOY+i;
					chooseModule = -1;
					localStorage.setItem("modules", JSON.stringify(modules));
				}
			}
		}

	}else{
	}
}
