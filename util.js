const socket = io();

const MODES = ["FFA", "2TEAM", "CO-OP", "SOLO"];

const CAN_ENTER_ALLMOD = false;

function start(){
	socket.emit("enqueue", modules, user, MODES[mode]);
}

function cancel(){
	socket.emit("dequeue");
}

function begin(){
	socket.emit("begin", MODES[mode]);
}

function solo(){
	socket.emit("solo", modules, user);
}

function setupLogin(){
	const usernameBox = document.getElementById("username");
	const passwordBox = document.getElementById("password");

	usernameBox.addEventListener("input", () => {
		usernameBox.value = usernameBox.value.toUpperCase().replaceAll(' ', '_');
	});

	usernameBox.addEventListener("keypress", event => {
		if(event.key == "Enter"){
			passwordBox.focus();
		}
	});

	passwordBox.addEventListener("keypress", event => {
		if(event.key == "Enter"){
			user[0] = usernameBox.value;
			user[1] = passwordBox.value;
			localStorage.setItem("user", JSON.stringify(user));
			usernameBox.value = "";
			passwordBox.value = "";
			savedUser = true;
			document.getElementById("login-overlay").style.display = "none";
		}
	});

	const saveButton = document.getElementById("save");

	saveButton.addEventListener("click", () => {
		user[0] = usernameBox.value;
		user[1] = passwordBox.value;
		localStorage.setItem("user", JSON.stringify(user));
		usernameBox.value = "";
		passwordBox.value = "";
		savedUser = true;
		document.getElementById("login-overlay").style.display = "none";
	});

	const cancelButton = document.getElementById("cancel");

	cancelButton.addEventListener("click", () => {
		usernameBox.value = "";
		passwordBox.value = "";
		document.getElementById("login-overlay").style.display = "none";
	});
}

function setupSpectate(){
	const gameid = document.getElementById("gameID");
	const submit = document.getElementById("submit");
	const cancelButton = document.getElementById("cancel2");

	function disable(){
		submit.disabled = true;
		submit.style.backgroundColor = "#606060";
		submit.style.color = "#A0A0A0";
		submit.style.cursor = "not-allowed";
		submit.textContent = "INVALID ID";
	}

	function enable(){
		submit.disabled = false;
		submit.style.backgroundColor = "#808080";
		submit.style.color = "white";
		submit.style.cursor = "pointer";
		submit.textContent = "SPECTATE";
	}

	gameid.addEventListener("input", () => {
		gameid.value = gameid.value.replace(/[^\d]/g, "");
		disable();
		socket.emit("checkGameID", parseInt(gameid.value));
	});

	socket.on("validGameID", x => {
		if(x.toString() == gameid.value){
			enable();
		}
	});

	gameid.addEventListener("keypress", event => {
		if(event.key == "Enter"){
			if(submit.disabled) return;
			socket.emit("spectate", parseInt(gameid.value));
			gameid.value = "";
			document.getElementById("spectate-overlay").style.display = "none";
		}
	});

	submit.addEventListener("click", () => {
		if(submit.disabled) return;
		socket.emit("spectate", parseInt(gameid.value));
		gameid.value = "";
		document.getElementById("spectate-overlay").style.display = "none";
	});

	cancelButton.addEventListener("click", () => {
		gameid.value = "";
		document.getElementById("spectate-overlay").style.display = "none";
	});
}

function mouseIn(x, y, w, h){
	if(document.getElementById("login-overlay").style.display != "none") return false;
	if(document.getElementById("spectate-overlay").style.display != "none") return false;

	if(MOBILE){
		for(const [k, v] of posTouches)
			if(!movedTouches.has(k) || (touches.length == 1 && staging))
				if(abs(v.last[0]-x) < w && abs(v.last[1]-y) < h) return true;

		return false;

	}else return abs(mouseX-x) < w && abs(mouseY-y) < h;
}

function _wrap(Z, W){
	const S = Z.split(' ');
	let R = "", line = "";

	for(let X of S){
		const L = line + (line.length ? ' ' : "") + X;
		if(textWidth(L) > W){
			R += (R.length ? '\n' : "") + line;
			line = X;
		}else line = L;
	}

	if(line.length)
		R += (R.length ? '\n' : '') + line;

	return R;
}

function wrap(T, W){
	let res = "", f = false;

	for(const x of T.split('\n')){
		if(f) res += '\n';
		res += _wrap(x, W);
		f = true;
	}

	return res;
}

let timeframes = [0, 0];

class Ship{
	constructor(dat){
		this.type = dat.type;
		this.team = dat.team;
		this.user = dat.user;
		this.name = dat.name;
		this.modules = dat.modules;
		this.pos = dat.pos;
		this.vpos = [...this.pos];
		this.vvpos = [...this.pos];
		this.rot = PI;
		this.uid = dat.uid;

		this.target = null;  // for drag moving

		this.decode(dat);

		if(this.move.length)
			this.rot = atan2(this.move[0][1]-this.pos[1], this.move[0][0]-this.pos[0]);
	}

	decode(dat){
		this.hp = dat.hp;
		this.mhp = dat.mhp;
		this.modules = dat.modules;
		if(!Number.isNaN(dat.pos[0]) && !Number.isNaN(dat.pos[1]))
			this.pos = dat.pos;
		this.move = dat.move;

		if(this.user != ID) this.wait = dat.wait;
		else if(this.wait != null && dat.wait != null)
			this.wait[2] = dat.wait[2];

		this.tp = dat.tp;
		this.dock = dat.dock;
		this.expire = dat.expire;
		this.emp = dat.emp;
		this.fort = dat.fort;
		this.imp = dat.imp;
		this.ally = dat.ally;
		this.arts = dat.arts;
		this.bond = dat.bond;
		this.entangled = dat.entangled;
		this.hit = dat.hit;
	}

	travel(){
		if(Number.isNaN(this.vvpos[0]) || Number.isNaN(this.vvpos[1]) ||
			Number.isNaN(this.vpos[0]) || Number.isNaN(this.vpos[1])){
			this.vvpos = [...this.pos];
			this.vpos = [...this.pos];
			this.rot = PI*1.85;
		}

		let target;
		if(this.move.length) target = atan2(this.move[0][1]-this.pos[1], this.move[0][0]-this.pos[0]);
		else if(this.wait) target = atan2(this.wait[1]-this.pos[1], this.wait[0]-this.pos[0]);
		else if(this.tp != null) target = PI*1.6;
		else target = PI*1.85;

		if(this.move.length) this.wait = null;

		if(this.target != null) target = this.target;

		let diff = target - this.rot;
		if(diff > PI) diff -= PI*2;
		if(diff < -PI) diff += PI*2;

		let T = (MOBILE ? 0.1 : 0.05) / speed;

		this.rot += diff * T * 2;
		if(this.rot > PI*2) this.rot -= PI*2;
		if(this.rot < -PI*2) this.rot += PI*2;

		const F = last+500, OLD = timeframes[1], NEW = timeframes[0];

		if(F != OLD){  // I think this was what caused corner glitch
			this.vvpos[0] = lerp(this.vvpos[0], this.pos[0], (NEW-OLD)/(F-OLD));
			this.vvpos[1] = lerp(this.vvpos[1], this.pos[1], (NEW-OLD)/(F-OLD));
		}

		this.vpos[0] = lerp(this.vpos[0], this.vvpos[0], T*5);
		this.vpos[1] = lerp(this.vpos[1], this.vvpos[1], T*5);
	}
}

let camera = {x: 0, y: 0, z: 1}, lastMouseX = 0, lastMouseY = 0;

function mousePos(){
	return [camera.x+(mouseX-width/2)/camera.z, camera.y+(mouseY-height/2)/camera.z];
}

function screenPos(pos){
	return [width/2+(pos[0]-camera.x)*camera.z, height/2+(pos[1]-camera.y)*camera.z];
}

let usingTrackpad = false;

function mouseWheel(e){
	if(!staging && !usingTrackpad){
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

let gestureStart = [0, 0, 0];

window.addEventListener("gesturestart", function (e) {
	e.preventDefault();
	if(MOBILE) return;

	gestureStart = [e.pageX - camera.x, e.pageY - camera.y, camera.z];
});

window.addEventListener("gesturechange", function (e) {
	e.preventDefault();
	if(MOBILE) return;

	camera.z = gestureStart[2] * e.scale;

	camera.x = e.pageX - gestureStart[0];
	camera.y = e.pageY - gestureStart[1];

	usingTrackpad = true;
})

window.addEventListener("gestureend", function (e) {
	e.preventDefault();
	if(MOBILE) return;
});

window.addEventListener('wheel', function(e) {
	e.preventDefault();
	mouseWheel(e);

}, {passive: false})

document.addEventListener("dblclick", function(e) {
	e.preventDefault();
}, { passive: false });

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
	(shipID != null && !([RIPPLE, BOND].includes(ships[shipID].modules[selectMove[1].i].type))))
		for(let i=0; i<rocks.length; ++i){
			const d = _dist(screenPos(rocks[i]), pos);
			if(d < 50/F) opt.push([d, ["rock", i]]);
		}

	if(selectMove == null || (selectMove[0] == "module" &&
	shipID != null && [RIPPLE, BOND].includes(ships[shipID].modules[selectMove[1].i].type)))
		for(let i=0; i<ships.length; ++i){
			const d = _dist(screenPos(ships[i].vpos), pos);
			if(d < 50/F){
				opt.push([d-20/F, ["ship", ships[i].uid]]);
				if(focus != null && focus[0] == "ship" && focus[1] == ships[i].uid)
					return ["ship", focus[1]];
			}
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
	if(document.getElementById("login-overlay").style.display != "none") return;
	if(document.getElementById("spectate-overlay").style.display != "none") return;

	if(!MOBILE){
		moved = false;
		startMouseX = mouseX;
		startMouseY = mouseY;
		select = selected();
	}
}

let lastMouse = [], ALLMODULE = false, SECDISP = [0], CENT = false;

function mobileClick(P){
	if(staging){
		lastMouse.push([Date.now(), P.last]);
		if(lastMouse.length > 3) lastMouse = lastMouse.slice(1);

		if(!showGuide && lastMouse.length == 3 && lastMouse[0][0] > Date.now()-2000
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
			}else if(CAN_ENTER_ALLMOD){
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
	if(document.getElementById("login-overlay").style.display != "none") return;
	if(document.getElementById("spectate-overlay").style.display != "none") return;

	if(MOBILE) return;

	if(mouseButton == RIGHT) return;

	if(!staging && connected && abs(startMouseX-30) < 30 && abs(startMouseY-30) < 30 && mouseIn(width-30, 30, 30, 30)){
		CENT = !CENT;
		return;
	}

	if(staging){
		lastMouse.push([Date.now(), [mouseX, mouseY]]);
		if(lastMouse.length > 3) lastMouse = lastMouse.slice(1);

		if(!showGuide && lastMouse.length == 3 && lastMouse[0][0] > Date.now()-2000
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
			}else if(CAN_ENTER_ALLMOD){
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

let scrollVel = [0, 0], funkyDelay = 0;

function draw(){
	timeframes[1] = timeframes[0];
	timeframes[0] = Date.now();

	if(windowWidth != width || windowHeight != height) resizeCanvas(windowWidth, windowHeight);

	if(touches.length && !MOBILE && Date.now()-funkyDelay > 2000){
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
						for(let s of ships) if(s.uid == focus[1] && s.user == ID && !s.wait && (s.type == BS || CENT) && s.tp == null){
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
						for(let s of ships) if(s.uid == focus[1] && s.user == ID && !s.wait && (s.type == BS || CENT) && s.tp == null){
							dragMove = [t.x, t.y, s.uid, t.id];
							selectMove = ["ship", s.uid];
						}
			}

			V = [P.last[0]-t.x, P.last[1]-t.y];

			P.last = [t.x, t.y];

		}else posTouches.set(t.id, {first: [t.x, t.y], last: [t.x, t.y], orig: [t.x, t.y]});
	}

	if(touches.length == 1 && !staging){
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

	}else if(touches.length == 2 && !staging){
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
			CENT = !CENT;

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

	camera = {x: 0, y: 0, z: 1};

	ships = [];
	for(let x of S.ships){
		ships.push(new Ship(x));
		if(x.user == S.ID)
			camera = {x: x.pos[0], y: x.pos[1], z: 1};
	}

	rocks = S.rocks;

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
