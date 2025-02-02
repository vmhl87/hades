const socket = io();

let ui = {
	staging: 1,
	module: {
		id: null
	}
};

let modules = [MASS, IMPULSE, FORT, DELTA, TURRET];

function setup(){
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER); textSize(25);
}

function draw(){
	if(ui.staging){
		background(0, 10, 25);

		fill(200); noStroke();
		push(); translate(width/2, height/2-100);
		scale(5); drawShip(BS, 0);
		pop();

		fill(255, 0, 0, 50);
		rect(width/2 - 120, height/2 - 20 + 50, 40, 40);
		push(); translate(width/2-100, height/2 + 50);
		drawModule(modules[0]);
		pop();

		fill(0, 255, 255, 50);
		rect(width/2 - 70, height/2 - 20 + 50, 40, 40);
		push(); translate(width/2-50, height/2 + 50);
		drawModule(modules[1]);
		pop();

		fill(100, 255, 100, 50);
		rect(width/2 - 20, height/2 - 20 + 50, 40, 40);
		push(); translate(width/2, height/2 + 50);
		drawModule(modules[2]);
		pop();
		rect(width/2 + 30, height/2 - 20 + 50, 40, 40);
		push(); translate(width/2+50, height/2 + 50);
		drawModule(modules[3]);
		pop();

		fill(255, 100, 0, 50);
		rect(width/2 + 80, height/2 - 20 + 50, 40, 40);
		push(); translate(width/2+100, height/2 + 50);
		drawModule(modules[4]);
		pop();

		fill(200);
		text("START", width/2, height/2 + 150);

	}else{
	}
}
