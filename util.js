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
		this.vpos = [...this.pos];
		this.rot = PI*1.7;
		this.uid = dat.uid;
	}

	decode(dat){
		this.hp = dat.hp
		this.modules = dat.modules;
		this.pos = dat.pos;
		this.move = dat.move;
	}
}
