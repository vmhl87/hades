const socket = io();

function start(){
	socket.emit("enqueue", modules);
}

function cancel(){
	socket.emit("dequeue");
}

function solo(){
	socket.emit("solo", modules);
}

function mouseIn(x, y, w, h){
	if(MOBILE){
		for(const [k, v] of posTouches)
			if(!movedTouches.has(k))
				if(abs(v.last[0]-x) < w && abs(v.last[1]-y) < h) return true;

		return false;

	}else return abs(mouseX-x) < w && abs(mouseY-y) < h;
}

function wrap(T, W){
	const S = T.split(' ');
	let res = "", line = "", b = false;

	for(let i=0; i<S.length; ++i){
		const L = line + (b ? ' ' : '') + S[i];
		b = true;
		if(textWidth(L) > W){
			res += (res.length ? '\n' : '') + line;
			line = S[i];
		}else line = L;
	}

	return res + (res.length ? '\n' : '') + line;
}

class Ship{
	constructor(dat){
		this.type = dat.type;
		this.hp = dat.hp;
		this.team = dat.team;
		this.modules = dat.modules;
		this.pos = dat.pos;
		this.move = dat.move;
		this.wait = dat.wait;
		this.tp = dat.tp;
		this.vpos = [...this.pos];
		this.rot = PI;
		this.uid = dat.uid;
		this.dock = dat.dock;
		this.expire = dat.expire;
		this.emp = dat.emp;
		this.fort = dat.fort;
		this.imp = dat.imp;
		this.ally = dat.ally;

		if(this.move.length)
			this.rot = atan2(this.move[0][1]-this.pos[1], this.move[0][0]-this.pos[0]);
	}

	decode(dat){
		this.hp = dat.hp
		this.modules = dat.modules;
		this.pos = dat.pos;
		this.move = dat.move;
		if(this.team != ID) this.wait = dat.wait;
		else if(this.wait != null && dat.wait != null)
			this.wait[2] = dat.wait[2];
		this.tp = dat.tp;
		this.dock = dat.dock;
		this.expire = dat.expire;
		this.emp = dat.emp;
		this.fort = dat.fort;
		this.imp = dat.imp;
		this.ally = dat.ally;
	}

	travel(){
		let target;
		if(this.move.length) target = atan2(this.move[0][1]-this.pos[1], this.move[0][0]-this.pos[0]);
		else if(this.wait) target = atan2(this.wait[1]-this.pos[1], this.wait[0]-this.pos[0]);
		else if(this.tp != null) target = PI*1.6;
		else target = PI*1.85;

		if(this.move.length) this.wait = null;

		let diff = target - this.rot;
		if(diff > PI) diff -= PI*2;
		if(diff < -PI) diff += PI*2;

		let T = MOBILE ? 0.1 : 0.05;

		this.rot += diff * T * 2;
		if(this.rot > PI*2) this.rot -= PI*2;
		if(this.rot < -PI*2) this.rot += PI*2;

		this.vpos[0] = lerp(this.vpos[0], this.pos[0], T);
		this.vpos[1] = lerp(this.vpos[1], this.pos[1], T);
	}
}

let camera = {x: 0, y: 0, z: 1}, lastMouseX = 0, lastMouseY = 0;

function mousePos(){
	return [camera.x+(mouseX-width/2)/camera.z, camera.y+(mouseY-height/2)/camera.z];
}

function screenPos(pos){
	return [width/2+(pos[0]-camera.x)*camera.z, height/2+(pos[1]-camera.y)*camera.z];
}

function mouseWheel(e){
	if(!staging){
		let old = camera.z;
		if(e.delta > 0) camera.z /= 1.04;
		if(e.delta < 0) camera.z *= 1.04;
		camera.z = min(10, max(0.3, camera.z));
		if(old != camera.z){
			let offset = {x: mouseX-width/2, y: mouseY-height/2};
			old = (camera.z-old)/old;
			camera.x += offset.x*old/camera.z;
			camera.y += offset.y*old/camera.z;
		}
	}
}

function _dist(a, b){
	return sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]));
}

function _linedist(l, r, p) {
	const x1 = l[0], y1 = l[1], x2 = r[0], y2 = r[1];
	if(l[0] == r[0] && l[1] == r[1]) return _dist(l, p);
	const lv = [x2-x1, y2-y1], pv = [p[0]-x1, p[1]-y1];
	const dot = pv[0]*lv[0] + pv[1]*lv[1];
	const t = max(0, min(1, dot/(lv[0]*lv[0]+lv[1]*lv[1])));
	return _dist(p, [x1+t*lv[0], y1+t*lv[1]]);
}

function _lerp(a, b, c){
	return [lerp(a[0], b[0], c), lerp(a[1], b[1], c)];
}

let select = null, moved, shipID = null, selectMove = null;

function selected(){
	return selectedPos([mouseX, mouseY]);
}

function selectedPos(pos){
	let opt = [];

	const F = MOBILE ? 2 : 1;

	if(selectMove == null || selectMove[0] != "module" ||
	(shipID != null && ships[shipID].modules[selectMove[1].i].type != RIPPLE))
		for(let i=0; i<rocks.length; ++i){
			const d = _dist(screenPos(rocks[i]), pos);
			if(d < 50/F) opt.push([d, ["rock", i]]);
		}

	if(selectMove == null || (selectMove[0] == "module" &&
	shipID != null && ships[shipID].modules[selectMove[1].i].type == RIPPLE))
		for(let i=0; i<ships.length; ++i){
			const d = _dist(screenPos(ships[i].pos), pos);
			if(d < 50/F) opt.push([d-20/F, ["ship", ships[i].uid]]);
		}

	opt.sort((a, b) => a[0] - b[0]);

	if(opt.length) return opt[0][1];

	return null;
}

window.addEventListener('touchmove',e => e.preventDefault(), {passive:false});

let MOBILE = false;

let startMouseX, startMouseY;

let focus = null;

let posTouches = new Map(), movedTouches = new Set();

let dragMove = null;

function mousePressed(){
	if(!MOBILE){
		moved = false;
		startMouseX = mouseX;
		startMouseY = mouseY;
		select = selected();
		/*
		if(focus != null && focus[0] == "ship" && select != null && select[0] == "ship" && focus[1] == select[1] &&
			selectMove == null && !snapshot)
			for(let s of ships) if(s.uid == focus[1] && s.team == ID && !s.wait && s.type == BS){
				dragMove = [mouseX, mouseY, s.uid];
				selectMove = ["ship", s.uid];
			}
			*/
	}
}

let lastMouse = [], ALLMODULE = false, SECDISP = [0], GOD = false;

function mobileClick(P){
	if(staging){
		lastMouse.push([Date.now(), P.last]);
		if(lastMouse.length > 3) lastMouse = lastMouse.slice(1);

		if(lastMouse.length == 3 && lastMouse[0][0] > Date.now()-2000
			&& _dist(lastMouse[1][1], [width/2, height/2-250]) < 200
			&& abs(atan2(lastMouse[0][1][0]-lastMouse[1][1][0], lastMouse[0][1][1]-lastMouse[1][1][1])+PI/4) < 1
			&& abs(atan2(lastMouse[1][1][0]-lastMouse[2][1][0], lastMouse[1][1][1]-lastMouse[2][1][1])+PI*3/4) < 1
			&& _dist(lastMouse[0][1], lastMouse[1][1]) < 300
			&& _dist(lastMouse[1][1], lastMouse[2][1]) < 300
			&& _dist(lastMouse[0][1], lastMouse[1][1]) > 50
			&& _dist(lastMouse[1][1], lastMouse[2][1]) > 50
		){
			if(ALLMODULE){
				ALLMODULE = false;
				if(localStorage.getItem("modules"))
					modules = JSON.parse(localStorage.getItem("modules"));
				SECDISP = [100, []];
				for(let i=0; i<3; ++i) SECDISP[1].push([...lastMouse[i][1]]);
			}else{
				ALLMODULE = true;
				modules = [null, null, null, null, null];
				SECDISP = [100, []];
				for(let i=0; i<3; ++i) SECDISP[1].push([...lastMouse[i][1]]);
			}
		}

		stagingUI();

	}else if(connected) click();
}

function mouseReleased(){
	if(MOBILE) return;

	if(mouseButton == RIGHT) return;

	if(!staging && connected && abs(startMouseX-30) < 30 && abs(startMouseY-30) < 30 && mouseIn(width-30, 30, 30, 30)){
		GOD = !GOD;
		return;
	}

	if(staging){
		lastMouse.push([Date.now(), [mouseX, mouseY]]);
		if(lastMouse.length > 3) lastMouse = lastMouse.slice(1);

		if(lastMouse.length == 3 && lastMouse[0][0] > Date.now()-2000
			&& _dist(lastMouse[1][1], [width/2, height/2-250]) < 200
			&& abs(atan2(lastMouse[0][1][0]-lastMouse[1][1][0], lastMouse[0][1][1]-lastMouse[1][1][1])+PI/4) < 1
			&& abs(atan2(lastMouse[1][1][0]-lastMouse[2][1][0], lastMouse[1][1][1]-lastMouse[2][1][1])+PI*3/4) < 1
			&& _dist(lastMouse[0][1], lastMouse[1][1]) < 300
			&& _dist(lastMouse[1][1], lastMouse[2][1]) < 300
			&& _dist(lastMouse[0][1], lastMouse[1][1]) > 50
			&& _dist(lastMouse[1][1], lastMouse[2][1]) > 50
		){
			if(ALLMODULE){
				ALLMODULE = false;
				if(localStorage.getItem("modules"))
					modules = JSON.parse(localStorage.getItem("modules"));
				SECDISP = [100, []];
				for(let i=0; i<3; ++i) SECDISP[1].push([...lastMouse[i][1]]);
			}else{
				ALLMODULE = true;
				modules = [null, null, null, null, null];
				SECDISP = [100, []];
				for(let i=0; i<3; ++i) SECDISP[1].push([...lastMouse[i][1]]);
			}
		}

		stagingUI();

	}else if(connected && dragMove != null){
		select = selected();
		if(select != null) click();

	}else if(connected && !moved && _dist([mouseX, mouseY], [startMouseX, startMouseY]) < 20){
		click();
	}

	if(dragMove != null) selectMove = null;
	dragMove = null;
}

function echo(...x){
	socket.emit("echo", x);
}

let scrollVel = [0, 0];

function draw(){
	if(touches.length && !MOBILE){
		MOBILE = true;
		frameRate(30);
	}

	if(!staging){
		if(!MOBILE && mouseIsPressed && !(abs(startMouseX-30) < 30 && abs(startMouseY-30) < 30)){
			const dist = _dist([mouseX, mouseY], [lastMouseX, lastMouseY]);
			if(dist > 4){
				moved = true;
				if(focus != null && focus[0] == "ship" && select != null && select[0] == "ship" && focus[1] == select[1] &&
					selectMove == null && !snapshot)
						for(let s of ships) if(s.uid == focus[1] && s.team == ID && !s.wait && s.type == BS){
							dragMove = [mouseX, mouseY, s.uid];
							selectMove = ["ship", s.uid];
						}
				scrollVel = [0, 0];
			}

			if(dragMove != null){
				dragMove[0] = mouseX;
				dragMove[1] = mouseY;

			}else{
				if(dist > 0.5){
					camera.x += (lastMouseX-mouseX)/camera.z;
					camera.y += (lastMouseY-mouseY)/camera.z;
				}
				scrollVel[0] = lastMouseX-mouseX;
				scrollVel[1] = lastMouseY-mouseY;
			}
		}
	}

	lastMouseX = mouseX;
	lastMouseY = mouseY;

	if((MOBILE && !touches.length) || (!MOBILE && !mouseIsPressed)){
		camera.x += scrollVel[0]/camera.z;
		camera.y += scrollVel[1]/camera.z;

		scrollVel[0] *= 0.8;
		scrollVel[1] *= 0.8;
	}

	if(MOBILE) updateTouch();

	if(!staging && connected){
		camera.x = min(150*COLS+(width/2-30)/camera.z, camera.x);
		camera.x = max(-150*COLS-(width/2-30)/camera.z, camera.x);
		camera.y = min(150*ROWS+(height/2-30)/camera.z, camera.y);
		camera.y = max(-150*ROWS-(height/2-30)/camera.z, camera.y);
	}

	main();
}

let lockID = null, offset = [0, 0], ctlState = 0;

function updateTouch(){
	let S = new Set();

	let V = [0, 0];

	for(let t of touches){
		S.add(t.id);

		if(posTouches.has(t.id)){
			const P = posTouches.get(t.id);

			if(_dist(P.first, [t.x, t.y]) > 10 && !movedTouches.has(t.id)){
				movedTouches.add(t.id);
				P.first = [t.x, t.y];
				if(focus != null && focus[0] == "ship" && select != null && select[0] == "ship" && focus[1] == select[1] &&
					selectMove == null && touches.length == 1 && !snapshot)
						for(let s of ships) if(s.uid == focus[1] && s.team == ID && !s.wait && s.type == BS){
							dragMove = [t.x, t.y, s.uid, t.id];
							selectMove = ["ship", s.uid];
						}
			}

			V = [P.last[0]-t.x, P.last[1]-t.y];

			P.last = [t.x, t.y];

		}else posTouches.set(t.id, {first: [t.x, t.y], last: [t.x, t.y], orig: [t.x, t.y]});
	}

	if(!staging) if(touches.length == 1){
		if(ctlState == 1 || ctlState == 0){
			if(movedTouches.has(touches[0].id)){
				ctlState = 1;

				if(lockID == touches[0].id){
					const P = posTouches.get(touches[0].id);

					if(abs(P.orig[0]-(width-30)) < 30 && abs(P.orig[1]-30) < 30)
						lockID = null;
					
					else if(dragMove != null){
						dragMove[0] = touches[0].x;
						dragMove[1] = touches[0].y;
					
					}else{
						camera.x = offset[0] + (P.first[0]-P.last[0])/camera.z;
						camera.y = offset[1] + (P.first[1]-P.last[1])/camera.z;

						scrollVel[0] = V[0];
						scrollVel[1] = V[1];
					}

				}else{
					lockID = touches[0].id;
					offset = [camera.x, camera.y, 0, 0];
				}
			}
		}

	}else if(touches.length == 2){
		if(dragMove != null) selectMove = null;
		dragMove = null;

		ctlState = 2;

		if(lockID == touches[0].id+touches[1].id){
			const D = _dist([touches[0].x, touches[0].y], [touches[1].x, touches[1].y]);

			camera.z = offset[0]*D/offset[1];
			camera.z = min(20, max(0.15, camera.z));

			const P = [(touches[0].x+touches[1].x)/2, (touches[0].y+touches[1].y)/2];

			const old = [camera.x, camera.y];

			camera.x = offset[2][0] + (offset[3][0]-P[0])/camera.z;
			camera.y = offset[2][1] + (offset[3][1]-P[1])/camera.z;

			scrollVel = [(camera.x-old[0])*camera.z, (camera.y-old[1])*camera.z];

		}else{
			lockID = touches[0].id+touches[1].id;
			offset = [camera.z, _dist([touches[0].x, touches[0].y], [touches[1].x, touches[1].y]),
				[camera.x, camera.y], [(touches[0].x+touches[1].x)/2, (touches[0].y+touches[1].y)/2]
			];
		}
	}

	let rem = [];

	for(const [k, v] of posTouches)
		if(!S.has(k)) rem.push(k);

	for(let k of rem){
		const P = posTouches.get(k);

		if(movedTouches.has(k)){
			if(!staging && connected && dragMove != null && dragMove[3] == k){
				select = selectedPos(P.last);
				console.log(select);
				if(select != null) click();
			}
			movedTouches.delete(k);
		}else if(touches.length == 0 && ctlState == 0){
			mobileClick({first: [...P.first], last: [...P.last]});
		}

		if(!staging && connected && abs(P.last[0]-30) < 30 && abs(P.last[1]-30) < 30
			&& abs(P.orig[0]-(width-30)) < 30 && abs(P.orig[1]-3) < 30)
			GOD = !GOD;

		posTouches.delete(k);
		movedTouches.delete(k);
	}

	if(rem.length){
		if(dragMove != null) selectMove = null;
		dragMove = null;
	}
}

function touchStarted(){
	if(touches.length == 1 && !posTouches.has(touches[0].id)){
		select = selectedPos([touches[0].x, touches[0].y]);
	}
	updateTouch();
}

function touchEnded(){
	updateTouch();
	if(touches.length == 0) ctlState = 0;
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function saveState(){
	return JSON.stringify({
		ships, rocks, entities, ROWS, COLS, ID, age
	});
}

function loadState(STATE){
	const S = JSON.parse(STATE);

	ships = [];
	for(let x of S.ships) ships.push(new Ship(x));

	entities = S.entities;

	ROWS = S.ROWS;
	COLS = S.COLS;
	ID = S.ID;
	age = S.age;

	speed = 1;

	staging = 0;
	connected = 1;
	snapshot = 1;
}

function god(){
	if(!staging && connected && focus != null && focus[0] == "ship" && shipID != null)
		socket.emit("spawn", {gameID: gameID, arg: [STRIKEP, ID, [], ships[shipID].pos]});
}

function ascend(){
	if(!staging && connected && focus != null && focus[0] == "ship" && shipID != null)
		socket.emit("ascend", {gameID: gameID, shipID: focus[1]});
}
