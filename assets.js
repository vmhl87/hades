function drawShip(T, O, M){
	function _symm(a){
		beginShape();
		for(let i=0; i<a.length; ++i)
			vertex(a[i][0], a[i][1]);
		for(let i=a.length-1; i>=0; --i)
			vertex(a[i][0], -a[i][1]);
		endShape(CLOSE);
	}

	push(); noStroke();

	if(T == BS){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-20, 0],
				[-20, 2],
				[-26-(sin(frameCount/20)/2+0.5), 5.25+0.2*(sin(frameCount/20)/2+0.5)],
				[-15, 7]
			]);
			fill(100, 255, 255);
			_symm([
				[-19, 0],
				[-20, 3],
				[-24-0.6*(sin(frameCount/20)/2+0.5), 5+0.12*(sin(frameCount/20)/2+0.5)],
				[-15, 6]
			]);
		}
		if(O == 0) fill(60, 90, 90);
		if(O == 1) fill(110, 30, 30);
		_symm([
			[14, 3.7],
			[4, 6]
		]);
		_symm([
			[-7.5, 8.5],
			[2, 4]
		]);
		if(O == 0) fill(70, 100, 100);
		if(O == 1) fill(120, 40, 40);
		_symm([
			[-20, 2.3],
			[-18.5, 6],
			[-15, 8.5],
			[-11, 8.5]
		]);
		if(O == 0) fill(90, 120, 120);
		if(O == 1) fill(140, 60, 60);
		_symm([
			[-19, 2],
			[-15, 6.5],
			[-10, 8]
		]);
		if(O == 0) fill(80, 120, 120);
		if(O == 1) fill(140, 50, 50);
		_symm([
			[-6, 5],
			[3, 6.2]
		]);
		_symm([
			[8, 1],
			[12, 4.5],
			[18, 3.5]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
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
		if(O == 0) fill(80, 120, 120);
		if(O == 1) fill(140, 50, 50);
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
		if(O == 0) fill(70, 105, 105);
		if(O == 1) fill(125, 40, 40);
		_symm([
			[-21, 2],
			[-20.25, 3.5],
			[-13, 2.5],
			[-12, 0]
		]);
	}

	if(T == SENTINEL){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-18-(sin(frameCount/20)/2+0.5), 0],
				[-8, 2]
			]);
			fill(100, 255, 255);
			_symm([
				[-15-0.5*(sin(frameCount/20)/2+0.5), 0],
				[-8, 1.5]
			]);
		}
		fill(80, 50, 50);
		_symm([
			[-10, 0],
			[-7, 4.5],
			[0, 5.5]
		]);
		fill(130, 70, 70);
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
			[4.75, 0.5]
		]);
	}

	if(T == GUARD){
		fill(80, 50, 50);
		_symm([
			[7, 0],
			[-1.5, 6],
			[2, 0]
		]);
		fill(150, 80, 80);
		_symm([
			[8, 0],
			[6, 4],
			[3, 6],
			[0, 7],
			[-6, 6.5],
			[-6, 6],
			[-2, 5.5],
			[2, 3],
			[1, 0]
		]);
		fill(130, 70, 70);
		circle(4.5, 0, 4.5);
		fill(80, 50, 50);
		circle(4.5, 0, 3);
		if(M){
			fill(60, 180, 180);
			_symm([
				[-8-(sin(frameCount/20)/2+0.5), 0],
				[-3, 2],
				[-2, 2],
				[-1, 1],
				[-0.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-5-0.7*(sin(frameCount/20)/2+0.5), 0],
				[-3, 1],
				[-2, 1],
				[-1.5, 0]
			]);
		}
	}

	if(T == INT){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-20-2*(sin(frameCount/20)/2+0.5), 0],
				[-8, 3]
			]);
			fill(100, 255, 255);
			_symm([
				[-16-(sin(frameCount/20)/2+0.5), 0],
				[-8, 2]
			]);
		}
		fill(150, 80, 80);
		_symm([
			[6, 0],
			[7.5, 1.5],
			[18, 1.5],
			[18, 2.25],
			[13.5, 3.75],
			[-7.5, 7.5],
			[-9, 6.75],
			[-12, 3],
			[-10.5, 1.5]
		]);
		fill(130, 70, 70);
		_symm([
			[3.5, 0],
			[3, 1.5],
			[2, 2],
			[-7, 2],
			[-8, 1.5],
			[-8.5, 0]
		]);
		fill(80, 50, 50);
		_symm([
			[3, 0],
			[2.5, 1.25],
			[1.5, 1.5],
			[-6.5, 1.5],
			[-7.5, 1.25],
			[-8, 0]
		]);
	}

	if(T == COL){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-20, 0],
				[-20, 2],
				[-26-(sin(frameCount/20)/2+0.5), 4.25+0.2*(sin(frameCount/20)/2+0.5)],
				[-15, 6]
			]);
			fill(100, 255, 255);
			_symm([
				[-19, 0],
				[-20, 3],
				[-24-0.6*(sin(frameCount/20)/2+0.5), 4+0.12*(sin(frameCount/20)/2+0.5)],
				[-15, 5]
			]);
		}
		fill(80, 50, 50);
		_symm([
			[8, 6],
			[4, 9],
			[-14, 8],
			[-18, 6]
		]);
		fill(150, 80, 80);
		_symm([
			[23.5, 0],
			[23, 2],
			[20, 8],
			[18, 9],
			[8, 9],
			[4, 6],
			[-18, 6],
			[-20, 5],
			[-22, 2]
		]);
		fill(130, 70, 70);
		circle(5, 0, 4.5);
		circle(5+5.2, -3, 4.5);
		circle(5+5.2, 3, 4.5);
		_symm([
			[-22, 1.3],
			[-8.7, 1.3],
			[-4.5, 6],
			[-1, 6],
			[-6, 0]
		]);
		fill(110, 60, 60);
		rect(14, -0.3, 9, 0.6);
		push();
		translate(5+3.5, 0); rotate(PI*2/3);
		rect(5.5, -0.3, 2, 0.6); rotate(PI*2/3);
		rect(5.5, -0.3, 2, 0.6);
		pop();
		fill(80, 50, 50);
		circle(5, 0, 3);
		circle(5+5.2, -3, 3);
		circle(5+5.2, 3, 3);
		_symm([
			[-22, 0.3],
			[-8, 0.3],
			[-3, 6],
			[-2.4, 6],
			[-7.4, 0]
		]);
	}

	if(T == DECOY){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		_symm([
			[4.5, 0],
			[4, 2],
			[-3, 10],
			[-4, 10.5],
			[-5, 9.5],
			[-2, 2],
			[-1.6, 0]
		]);
		if(O == 0) fill(80, 120, 120);
		if(O == 1) fill(140, 50, 50);
		circle(1.25, 0, 4);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 40, 40);
		circle(1.25, 0, 2.5);
		if(M){
			fill(60, 180, 180);
			_symm([
				[-10-(sin(frameCount/20)/2+0.5), 0],
				[-5, 2],
				[-4, 2],
				[-3, 1],
				[-2.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-7-0.7*(sin(frameCount/20)/2+0.5), 0],
				[-5, 1],
				[-4, 1],
				[-3.5, 0]
			]);
		}
	}

	if(T == REPAIR){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		ellipse(1.25, 0, 12, 10);
		arc(3, 0, 18, 18, PI*0.7, PI*0.9);
		arc(3, 0, 18, 18, PI*1.1, PI*1.3);
		if(O == 0) fill(80, 120, 120);
		if(O == 1) fill(140, 50, 50);
		circle(1, 0, 4);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 40, 40);
		circle(1, 0, 2.5);
		if(M){
			fill(60, 180, 180);
			_symm([
				[-14-(sin(frameCount/20)/2+0.5), 0],
				[-9, 2],
				[-8, 2],
				[-7, 1],
				[-6.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-11-0.7*(sin(frameCount/20)/2+0.5), 0],
				[-9, 1],
				[-8, 1],
				[-7.5, 0]
			]);
		}
	}

	if(T == TURRET){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		circle(0, 0, 15);
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 40, 40);
		arc(0, 0, 15, 15, PI/2-PI/4, PI/2+PI/4);
		arc(0, 0, 15, 15, PI/2+PI*2/3-PI/4, PI/2+PI*2/3+PI/4);
		arc(0, 0, 15, 15, PI/2+PI*4/3-PI/4, PI/2+PI*4/3+PI/4);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		circle(0, 0, 13);
		if(O == 0) fill(80, 120, 120);
		if(O == 1) fill(140, 50, 50);
		circle(0, -3, 4);
		circle(3*sin(PI*2/3), -3*cos(PI*2/3), 4);
		circle(3*sin(PI*4/3), -3*cos(PI*4/3), 4);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 40, 40);
		circle(0, -3, 2.5);
		circle(3*sin(PI*2/3), -3*cos(PI*2/3), 2.5);
		circle(3*sin(PI*4/3), -3*cos(PI*4/3), 2.5);
	}

	if(T == ROCKET){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-17-(sin(frameCount/20)/2+0.5), 0],
				[-12, 2],
				[-11, 2],
				[-10, 1],
				[-9.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-14-0.7*(sin(frameCount/20)/2+0.5), 0],
				[-12, 1],
				[-11, 1],
				[-10.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 40, 40);
		_symm([
			[-9, 1],
			[0, 2]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		_symm([
			[8.5, 0],
			[8, 2],
			[-4, 8],
			[-6, 7],
			[-4, 6],
			[-2, 2]
		]);
		_symm([
			[-6, 0],
			[-9, 3],
			[-12, 0]
		]);
		if(O == 0) fill(80, 120, 120);
		if(O == 1) fill(140, 50, 50);
		circle(3, 0, 4);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 40, 40);
		circle(3, 0, 2.5);
	}

	if(T == DARTP){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-12-(sin(frameCount/20)/2+0.5), 0],
				[-7, 1.5],
				[-6, 1.5],
				[-5, 0.6],
				[-4.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-9-0.7*(sin(frameCount/20)/2+0.5), 0],
				[-7, 0.6],
				[-6, 0.6],
				[-5.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 40, 40);
		_symm([
			[2, 0],
			[-2, 2],
			[-5, 1]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		_symm([
			[6, 0],
			[4, 1],
			[-5, 1]
		]);
	}

	if(T == DELTAP){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-16-(sin(frameCount/20)/2+0.5), 0],
				[-10, 2.5],
				[-9, 2.5],
				[-8, 1.5],
				[-6.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-13-0.5*(sin(frameCount/20)/2+0.5), 0],
				[-10, 1.2],
				[-9, 1.2],
				[-7.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 40, 40);
		_symm([
			[2, 0],
			[-5, 3],
			[-7, 2]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		_symm([
			[9.5, 0],
			[9, 0.5],
			[4, 1],
			[-2, 1],
			[-7, 2],
			[-9, 0]
		]);
	}

	if(T == ROCKETP){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-16-(sin(frameCount/20)/2+0.5), 0],
				[-9, 1.8],
				[-8, 1.8],
				[-7, 0.9],
				[-6.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-12-0.7*(sin(frameCount/20)/2+0.5), 0],
				[-9, 0.9],
				[-8, 0.9],
				[-7.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 40, 40);
		_symm([
			[2, 0],
			[0, 2],
			[-6, 2],
			[-8, 0]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 70, 70);
		_symm([
			[9.5, 0],
			[9, 0.5],
			[4, 1],
			[-2, 1],
			[-8, 1],
			[-9, 0]
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

	// CERB
	
	if(T == GUARD){
		_batt(0, 0, 1, 1);
	}

	if(T == SENTINEL){
		_batt(-4, 0, 1, 1);
		_batt(4, 0, 1, 1);
	}

	if(T == INT){
		_batt(-6, 0, 1, 0);
		_batt(0, 1, 1, 1);
		_batt(6, 0, 0, 1);
	}

	if(T == COL){
		stroke(200, 50, 50);
		line(0, -10, 0, 10);
		line(-10, -10, 10, -10);
		line(8.7, -5, 0, -9);
		line(-8.7, -5, 0, -9);
		line(5, -1.3, 0, -9);
		line(-5, -1.3, 0, -9);
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
	
	if(T == EMP){
		fill(50, 150, 50); stroke(50, 150, 50);
		beginShape();
		vertex(0.5, -3);
		vertex(2, -1);
		vertex(0, 0);
		vertex(-0.5, 3);
		vertex(-2, 1);
		vertex(0, 0);
		endShape(CLOSE);
		noFill();
		circle(0, 0, 25);
		strokeWeight(1.5);
		circle(0, 0, 20);
	}

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

	if(T == AMP){
		stroke(50, 150, 50); noFill();

		for(let i=0; i<8; ++i)
			arc(0, 0, 25, 25, -PI/16 + PI*i/4, PI/16 + PI*i/4);

		circle(0, 0, 8);
		line(0, -7, 0, 7);
		line(-7, 0, 7, 0);
	}

	if(T == DESTINY){
		stroke(50, 150, 50); fill(50, 150, 50);
		beginShape();
		vertex(0, -5);
		vertex(-5, 0);
		vertex(0, 5);
		vertex(5, 0);
		endShape(CLOSE);
		noFill();
		line(5, 5, 10, 10);
		line(-5, 5, -10, 10);
		line(5, -5, 10, -10);
		line(-5, -5, -10, -10);
		line(-2, 8, -2.75, 9);
		line(2, 8, 2.75, 9);
		line(-2, -8, -2.75, -9);
		line(2, -8, 2.75, -9);
		line(-8, 2, -9, 2.75);
		line(8, 2, 9, 2.75);
		line(-8, -2, -9, -2.75);
		line(8, -2, 9, -2.75);
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

	if(T == DELTA){
		stroke(50, 150, 50); fill(50, 150, 50);
		beginShape();
		vertex(10, -10);
		vertex(10, -8);
		vertex(8, -6);
		vertex(6, -8);
		vertex(8, -10);
		endShape(CLOSE);
		beginShape();
		vertex(4, -6);
		vertex(-4, 2);
		vertex(-11, 5);
		vertex(-9, 9);
		vertex(-5, 11);
		vertex(-2, 4);
		vertex(6, -4);
		endShape();
		line(-1.5, -7, -3, -12);
		line(1.5, 7, 3, 12);
		line(-7, -1.5, -12, -3);
		line(7, 1.5, 12, 3);
	}

	if(T == RIPPLE){
		stroke(50, 150, 50); noFill();
		arc(0, -6, 18, 18, -PI*0.4, PI*0.6);
		arc(6*sin(PI*2/3), -6*cos(PI*2/3), 18, 18, PI*2/3-PI*0.4, PI*2/3+PI*0.6);
		arc(-6*sin(PI*2/3), -6*cos(PI*2/3), 18, 18, PI*4/3-PI*0.4, PI*4/3+PI*0.6);
	}

	if(T == DISRUPT){
		stroke(50, 150, 50); noFill();
		arc(0, 0, 25, 25, -PI*0.3, PI*0.3);
		arc(0, 0, 25, 25, PI-PI*0.3, PI+PI*0.3);
		beginShape();
		vertex(0, -9);
		vertex(-2, -6);
		vertex(4, -3);
		vertex(-4, 3);
		vertex(2, 6);
		vertex(0, 9);
		endShape();
	}

	if(T == VENG){
		stroke(50, 150, 50); noFill();
		beginShape();
		vertex(0, -5);
		vertex(-5, 0);
		vertex(0, 5);
		vertex(5, 0);
		endShape(CLOSE);
		line(5, 5, 10, 10);
		line(-5, 5, -10, 10);
		line(5, -5, 10, -10);
		line(-5, -5, -10, -10);
		line(-2, 8, -2.75, 9);
		line(2, 8, 2.75, 9);
		line(-2, -8, -2.75, -9);
		line(2, -8, 2.75, -9);
		line(-8, 2, -9, 2.75);
		line(8, 2, 9, 2.75);
		line(-8, -2, -9, -2.75);
		line(8, -2, 9, -2.75);
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
		vertex(-5, -7);
		vertex(0, 4);
		vertex(-3, 2);
		vertex(-5, 7);
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

	if(T == ROCKET){
		stroke(150, 100, 50); fill(150, 100, 50);
		beginShape();
		vertex(-5, -7);
		vertex(0, 4);
		vertex(-3, 2);
		vertex(-5, 7);
		vertex(-7, 2);
		vertex(-10, 4);
		endShape(CLOSE);
		beginShape();
		vertex(6.5, -8);
		vertex(6.5, -9);
		vertex(7, -10);
		vertex(7.5, -9);
		vertex(7.5, -8);
		endShape(CLOSE);
		beginShape();
		vertex(5, 11);
		vertex(6.5, 7);
		vertex(6.5, -5);
		vertex(7.5, -5);
		vertex(7.5, 7);
		vertex(9, 11);
		vertex(7, 10);
		endShape(CLOSE);
	}

	if(T == TURRET){
		stroke(150, 100, 50); fill(150, 100, 50);
		circle(0, -4, 2);
		circle(4*sin(PI*2/3), -4*cos(PI*2/3), 2);
		circle(4*sin(PI*4/3), -4*cos(PI*4/3), 2);
		noFill();
		arc(0, 0, 22, 22, PI/2-PI/4, PI/2+PI/4);
		arc(0, 0, 22, 22, PI/2+PI*2/3-PI/4, PI/2+PI*2/3+PI/4);
		arc(0, 0, 22, 22, PI/2+PI*4/3-PI/4, PI/2+PI*4/3+PI/4);
	}

	pop();
}

function drawModule2(T, S){
	fill(0, 10, 25); noStroke();
	rect(-20, -20, 40, 40);

	fill(255, 40);
	if(T >= LASER && T <= TURRETD) fill(255, 50, 50, 60);
	if(T >= ALPHA && T <= ALLY) fill(0, 255, 255, 60);
	if(T >= EMP && T <= VENG) fill(100, 255, 100, 60);
	if(T >= DECOY && T <= TURRET) fill(255, 100, 0, 60);

	rect(-20, -20, 40, 40);

	drawModule(T);

	fill(0, 100);
	rect(-20, -20+40*abs(S), 40, 40-40*abs(S));
}
