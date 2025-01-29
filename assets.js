function drawShip(T, R, G, B){
	function _symm(pts){
		beginShape();
		for(let i=0; i<pts.length; ++i)
			vertex(pts[i][0], pts[i][1]);
		for(let i=pts.length-1; i>=0; --i)
			vertex(pts[i][0], -pts[i][1]);
		endShape(CLOSE);
	}

	push();
	if(T == BS1){
		fill(60, 90, 90); noStroke();
		_symm([
			[14, 3.7],
			[4, 6]
		]);
		_symm([
			[-7.5, 8.5],
			[2, 4]
		]);
		fill(70, 100, 100);
		_symm([
			[-20, 2.3],
			[-18.5, 6],
			[-15, 8.5],
			[-11, 8.5]
		]);
		fill(90, 120, 120);
		_symm([
			[-19, 2],
			[-15, 6.5],
			[-10, 8]
		]);
		fill(80, 120, 120);
		_symm([
			[-6, 5],
			[3, 6.2]
		]);
		_symm([
			[8, 1],
			[12, 4.5],
			[18, 3.5]
		]);
		fill(100, 150, 150);
		_symm([
			[-15, 2.5],
			[-11, 8.5],
			[-10.5, 9.15],
			[-7.3, 9.15],
			[-3.5, 3],
			[-1, 3],
			[2.5, 6.7],
			[5.5, 6.7],
			[9.7, 3],
			[16, 3],
			[17, 4],
			[20, 4],
			[18.5, 1.5]
		]);
		fill(80, 120, 120);
		_symm([
			[8, 0],
			[5, 3],
			[3.5, 3],
			[1.5, 0.5],
			[-8, 0.5],
			[-10, 1],
			[-12, 4],
			[-19.5, 5],
			[-20.75, 2]
		]);
		_symm([
			[15.5, 0.25],
			[19, 4],
			[18.5, 4],
			[15, 0.25],
			[7.75, 0.25]
		]);
		fill(70, 105, 105);
		_symm([
			[-21, 2],
			[-20.25, 3.5],
			[-13, 2.5],
			[-12, 0]
		]);

	}else if(T == BS2){
		fill(110, 30, 30); noStroke();
		_symm([
			[14, 3.7],
			[4, 6]
		]);
		_symm([
			[-7.5, 8.5],
			[2, 4]
		]);
		fill(120, 40, 40);
		_symm([
			[-20, 2.3],
			[-18.5, 6],
			[-15, 8.5],
			[-11, 8.5]
		]);
		fill(140, 60, 60);
		_symm([
			[-19, 2],
			[-15, 6.5],
			[-10, 8]
		]);
		fill(140, 50, 50);
		_symm([
			[-6, 5],
			[3, 6.2]
		]);
		_symm([
			[8, 1],
			[12, 4.5],
			[18, 3.5]
		]);
		fill(170, 70, 70);
		_symm([
			[-15, 2.5],
			[-11, 8.5],
			[-10.5, 9.15],
			[-7.3, 9.15],
			[-3.5, 3],
			[-1, 3],
			[2.5, 6.7],
			[5.5, 6.7],
			[9.7, 3],
			[16, 3],
			[17, 4],
			[20, 4],
			[18.5, 1.5]
		]);
		fill(140, 50, 50);
		_symm([
			[8, 0],
			[5, 3],
			[3.5, 3],
			[1.5, 0.5],
			[-8, 0.5],
			[-10, 1],
			[-12, 4],
			[-19.5, 5],
			[-20.75, 2]
		]);
		_symm([
			[15.5, 0.25],
			[19, 4],
			[18.5, 4],
			[15, 0.25],
			[7.75, 0.25]
		]);
		fill(125, 40, 40);
		_symm([
			[-21, 2],
			[-20.25, 3.5],
			[-13, 2.5],
			[-12, 0]
		]);

	}else if(T == SENTINEL){
		fill(80, 50, 50);
		_symm([
			[-10, 0],
			[-7, 4.5],
			[0, 5.5]
		]);
		fill(130, 60, 60);
		_symm([
			[-7, 0],
			[-5, 4],
			[0, 6],
			[4, 5],
			[9, 4.5],
			[10, 3.5],
			[6, 3],
			[4, 0]
		]);
		fill(150, 80, 80);
		_symm([
			[-12, 0],
			[-10, 2],
			[-8, 2],
			[-7.25, 0.5],
			[-3, 0.5],
			[-1, 4],
			[3, 4],
			[4.75, 0.5],
			[2.5, 0.5],
			[0.5, 2],
			[-0.75, 4],
			[-1, 4],
			[0.25, 2]
		]);
	}

	pop();
}

function drawModule(T){
	if(T == null) return;

	function _batt(x, y, r, l){
		stroke(200, 50, 50); noFill();
		rect(-2+x, -10, 4, 4);
		rect(-1+x, -6, 2, 4);
		if(l){
			beginShape();
			vertex(-2+x, -2);
			vertex(2+x+y, -2);
			vertex(2+x+y, 4);
			vertex(3+x+y, 5);
			vertex(3+x+y, 9);
			vertex(2+x+y, 10);
			vertex(-2+x, 10);
			endShape();
		}
		if(r){
			beginShape();
			vertex(2+x, 10);
			vertex(-2+x-y, 10);
			vertex(-3+x-y, 9);
			vertex(-3+x-y, 5);
			vertex(-2+x-y, 4);
			vertex(-2+x-y, -2);
			vertex(2+x, -2);
			endShape();
		}
	}

	push(); strokeWeight(2);

	// WEAPON

	if(T == LASER){
		stroke(200, 50, 50);
		line(0, -10, 0, 10);
		line(-10, -10, 10, -10);
		line(8.7, -5, 0, -9);
		line(-8.7, -5, 0, -9);
		line(5, -1.3, 0, -9);
		line(-5, -1.3, 0, -9);
	}

	if(T == BATTERY){
		_batt(-4, 0, 1, 1);
		_batt(4, 0, 1, 1);
	}

	if(T == MASS){
		_batt(-6, 0, 1, 0);
		_batt(0, 1, 1, 1);
		_batt(6, 0, 0, 1);
	}

	if(T == LASER2){
		stroke(200, 50, 50);
		line(3, -10, 3, 10);
		line(-3, -10, -3, 10);
		line(-13, -10, 13, -10);
		line(11.7, -5, 3, -9);
		line(-11.7, -5, -3, -9);
		line(8, -1.3, 3, -9);
		line(-8, -1.3, -3, -9);
	}

	if(T == DART){
		stroke(200, 50, 50);
		beginShape();
		vertex(-2, 10);
		vertex(-2, -6);
		vertex(0, -10);
		vertex(2, -6);
		vertex(2, 10);
		endShape();
		strokeWeight(1.5);
		line(-5, 8, -5, 2);
		line(5, 8, 5, 2);
	}

	// SHIELD

	if(T == ALPHA){
		stroke(50, 150, 150); noFill();
		arc(0, 0, 20, 20, -PI*0.3, PI*0.3);
		arc(0, 0, 20, 20, PI-PI*0.3, PI+PI*0.3);
	}

	if(T == IMPULSE){
		stroke(50, 150, 150); noFill();
		arc(0, 0, 25, 25, -PI*0.35, PI*0.15);
		arc(0, 0, 25, 25, PI-PI*0.15, PI+PI*0.35);
		fill(50, 150, 150);
		beginShape();
		vertex(0, -11);
		vertex(6, 4);
		vertex(0, 6);
		vertex(-6, 4);
		endShape(CLOSE);
		line(-4, 9, -4, 12);
		line(0, 10, 0, 14);
		line(4, 9, 4, 12);
	}

	if(T == PASSIVE){
		stroke(50, 150, 150); noFill();
		arc(0, 0, 25, 25, -PI*0.3, PI*0.3);
		arc(0, 0, 25, 25, PI-PI*0.3, PI+PI*0.3);
		line(12.5*cos(PI*0.3), 12.5*sin(PI*0.3), 6, 6);
		line(12.5*cos(PI*0.3), 12.5*sin(PI*0.3), 11.5, 10.5);
		line(-12.5*cos(PI*0.3), -12.5*sin(PI*0.3), -6, -6);
		line(-12.5*cos(PI*0.3), -12.5*sin(PI*0.3), -11.5, -10.5);
		fill(50, 150, 150);
		beginShape();
		vertex(3, 0);
		vertex(0, 4);
		vertex(-3, 0);
		vertex(0, -4);
		endShape(CLOSE);
	}

	if(T == OMEGA){
		stroke(50, 150, 150); noFill();
		circle(0, 0, 25);
		fill(50, 150, 150);
		beginShape();
		vertex(-3, -4);
		vertex(3, -4);
		vertex(3, 3);
		vertex(0, 5);
		vertex(-3, 3);
		endShape(CLOSE);
	}

	if(T == MIRROR){
		stroke(50, 150, 150); noFill();
		arc(0, 0, 25, 25, -PI*0.3, PI*0.3);
		arc(0, 0, 25, 25, PI-PI*0.3, PI+PI*0.3);
		beginShape();
		vertex(-2, -4);
		vertex(2, -4);
		vertex(2, 3);
		vertex(0, 4);
		vertex(-2, 3);
		endShape(CLOSE);
		beginShape();
		vertex(-6, -3);
		vertex(-7, 0);
		vertex(-6, 3);
		endShape();
		beginShape();
		vertex(6, -3);
		vertex(7, 0);
		vertex(6, 3);
		endShape();
	}

	if(T == ALLY){
		stroke(50, 150, 150); noFill();
		arc(0, 0, 25, 25, -PI*0.3, PI*0.3);
		arc(0, 0, 25, 25, PI-PI*0.3, PI+PI*0.3);
		arc(0, 0, 21, 21, -PI*0.1, PI*0.1);
		arc(0, 0, 21, 21, PI-PI*0.1, PI+PI*0.1);
		strokeWeight(1);
		circle(0, 0, 15);
	}

	// MODULE

	if(T == SOL){
		fill(50, 150, 50); noStroke();
		beginShape();
		vertex(-0.5, -10);
		vertex(-7.5, 4);
		vertex(-7, 10);
		vertex(-0.5, 6);
		endShape(CLOSE);
		stroke(50, 150, 50); noFill();
		beginShape();
		vertex(0, -10);
		vertex(-7.5, 4);
		vertex(-7, 10);
		vertex(0, 6);
		vertex(7, 10);
		vertex(7.5, 4);
		endShape(CLOSE);
	}

	if(T == FORT){
		stroke(50, 150, 50); noFill();
		for(let i=0.5; i<7; ++i){
			arc(0, 0, 27, 27, PI/3*i-PI/20, PI/3*i+PI/20);
			line(11*cos(PI/3*i), 11*sin(PI/3*i),
				27/2*cos(PI/3*i), 27/2*sin(PI/3*i));
		}
	}

	if(T == TP){
		stroke(50, 150, 50); noFill();
		ellipse(0, -8, 25, 8);
		arc(0, 0, 25, 8, -PI*0.05, PI*1.05);
		arc(0, 8, 25, 8, -PI*0.05, PI*1.05);
	}

	if(T == BARRIER){
		fill(50, 150, 50); noStroke();
		beginShape();
		vertex(0, -7);
		vertex(-5.5, 2);
		vertex(-4.5, 6.5);
		vertex(0, 4);
		vertex(4.5, 6.5);
		vertex(5.5, 2);
		endShape(CLOSE);
		noFill(); stroke(50, 150, 50);
		circle(0, 0, 25);
	}

	// DRONE
	
	if(T == DECOY){
		stroke(150, 100, 50); noFill();
		beginShape();
		vertex(-12, 3);
		vertex(-4, -3);
		vertex(0, -4);
		vertex(4, -3);
		vertex(12, 3);
		endShape();
		beginShape();
		vertex(-7, -1);
		vertex(-3, 2);
		vertex(0, 3);
		vertex(3, 2);
		vertex(7, -1);
		endShape();
		strokeWeight(1.5);
		arc(0, -2, 25, 25, PI*0.3, PI*0.7);
		arc(0, 2, 25, 25, PI*1.3, PI*1.7);
		line(0, 2-12.5, 0, -8.5);
		line(0, 12.5-2, 0, 8.5);
	}

	if(T == REPAIR){
		stroke(150, 100, 50); fill(150, 100, 50);
		beginShape();
		vertex(-5, -9);
		vertex(0, 4);
		vertex(-3, 2);
		vertex(-5, 9);
		vertex(-7, 2);
		vertex(-10, 4);
		endShape(CLOSE);
		noFill(); strokeWeight(3);
		beginShape();
		vertex(9.5, -10);
		vertex(10, -6);
		vertex(7, -4.5);
		vertex(4, -6);
		vertex(4.5, -10);
		endShape();
		line(7, -4.5, 7, 9);
	}

	pop();
}
