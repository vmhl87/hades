const socket = io();

let ui = {
	staging: 1,
	module: {
		id: null
	}
};

let modules = [null, null, null, null, null];

function setup(){
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER); textSize(25);
}

function draw(){
	if(ui.staging){
		background(0, 10, 25);

		fill(200); noStroke();
		push(); translate(width/2, height/2-100);
		scale(5); drawBattleship(0, 1, 1);
		pop();

		fill(255, 0, 0, 50);
		rect(width/2 - 120, height/2 - 20 + 50, 40, 40);

		fill(0, 255, 255, 50);
		rect(width/2 - 70, height/2 - 20 + 50, 40, 40);

		fill(100, 255, 100, 50);
		rect(width/2 - 20, height/2 - 20 + 50, 40, 40);
		rect(width/2 + 30, height/2 - 20 + 50, 40, 40);

		fill(255, 100, 0, 50);
		rect(width/2 + 80, height/2 - 20 + 50, 40, 40);

		fill(200);
		text("START", width/2, height/2 + 150);

	}else{
	}
}
