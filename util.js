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
	return abs(mouseX-x) < w && abs(mouseY-y) < h;
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

		if(this.move.length)
			this.rot = atan2(this.move[0][1]-this.pos[1], this.move[0][0]-this.pos[0]);
	}

	decode(dat){
		this.hp = dat.hp
		this.modules = dat.modules;
		this.pos = dat.pos;
		this.move = dat.move;
		this.wait = dat.wait;
		this.tp = dat.tp;
		this.dock = dat.dock;
		this.expire = dat.expire;
		this.emp = dat.emp;
	}

	travel(){
		let target;
		if(this.move.length) target = atan2(this.move[0][1]-this.pos[1], this.move[0][0]-this.pos[0]);
		else if(this.wait) target = atan2(this.wait[1]-this.pos[1], this.wait[0]-this.pos[0]);
		else if(this.tp != null) target = PI*1.6;
		else target = PI*1.85;

		let diff = target - this.rot;
		if(diff > PI) diff -= PI*2;
		if(diff < -PI) diff += PI*2;

		this.rot += diff * 0.1;
		if(this.rot > PI*2) this.rot -= PI*2;
		if(this.rot < -PI*2) this.rot += PI*2;

		this.vpos[0] = lerp(this.vpos[0], this.pos[0], 0.05);
		this.vpos[1] = lerp(this.vpos[1], this.pos[1], 0.05);

		// this.vpos = this.pos; this.rot = target;
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
	let opt = [];

	for(let i=0; i<rocks.length; ++i){
		const d = _dist(screenPos(rocks[i]), [mouseX, mouseY]);
		if(d < 50) opt.push([d, ["rock", i]]);
	}

	if(selectMove == null) for(let i=0; i<ships.length; ++i){
		const d = _dist(screenPos(ships[i].pos), [mouseX, mouseY]);
		if(d < 50) opt.push([d-20, ["ship", ships[i].uid]]);
	}

	opt.sort((a, b) => a[0] - b[0]);

	if(opt.length) return opt[0][1];

	return null;
}

let startMouseX, startMouseY;

let focus = null;

function mousePressed(){
	moved = false;
	startMouseX = mouseX;
	startMouseY = mouseY;
	select = selected();
}

let lastMouse = [], ALLMODULE = false, SECDISP = [0];

function mouseReleased(){
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
			ALLMODULE = true;
			modules = [null, null, null, null, null];
			SECDISP = [100, []];
			for(let i=0; i<3; ++i) SECDISP[1].push([...lastMouse[i][1]]);
		}

		stagingUI();

	}else if(connected && !moved && _dist([mouseX, mouseY], [startMouseX, startMouseY]) < 20){
		let s = selected();
		if(!s || (s[0] == select[0] && s[1] == select[1])){
			click();
		}
	}
}
