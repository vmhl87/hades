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
