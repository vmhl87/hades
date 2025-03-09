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
		if(M == 2){
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
		}else if(M == 1){
			fill(60, 180, 180);
			_symm([
				[-20, 0],
				[-20, 2],
				[-26-0.5, 5.25+0.2*0.5],
				[-15, 7]
			]);
			fill(100, 255, 255);
			_symm([
				[-19, 0],
				[-20, 3],
				[-24-0.6*0.5, 5+0.12*0.5],
				[-15, 6]
			]);
		}
		if(O == 0) fill(60, 90, 90);
		if(O == 1) fill(115, 10, 10);
		if(O == 2) fill(100, 50, 50);
		_symm([
			[14, 3.7],
			[4, 6]
		]);
		_symm([
			[-7.5, 8.5],
			[2, 4]
		]);
		if(O == 0) fill(70, 100, 100);
		if(O == 1) fill(125, 20, 20);
		if(O == 2) fill(110, 60, 60);
		_symm([
			[-20, 2.3],
			[-18.5, 6],
			[-15, 8.5],
			[-11, 8.5]
		]);
		if(O == 0) fill(90, 120, 120);
		if(O == 1) fill(145, 40, 40);
		if(O == 2) fill(130, 80, 80);
		_symm([
			[-19, 2],
			[-15, 6.5],
			[-10, 8]
		]);
		if(O == 0) fill(80, 120, 120);
		if(O == 1) fill(145, 30, 30);
		if(O == 2) fill(130, 70, 70);
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
		if(O == 1) fill(170, 40, 40);
		if(O == 2) fill(155, 80, 80);
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
		if(O == 1) fill(145, 30, 30);
		if(O == 2) fill(130, 70, 70);
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
		if(O == 1) fill(130, 20, 20);
		if(O == 2) fill(115, 60, 60);
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
				[-18-0.5, 0],
				[-8, 2]
			]);
			fill(100, 255, 255);
			_symm([
				[-15-0.5*0.5, 0],
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
		/*
		fill(80, 50, 50);
		_symm([
			[7, 0],
			[-1.5, 6],
			[2, 0]
		]);
		*/
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
		//fill(130, 70, 70);
		//circle(4.5, 0, 4.5);
		fill(80, 50, 50);
		circle(4.5, 0, 3);
		if(M){
			fill(60, 180, 180);
			_symm([
				[-8-0.5, 0],
				[-3, 2],
				[-2, 2],
				[-1, 1],
				[-0.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-5-0.7*0.5, 0],
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
				[-20-2*0.5, 0],
				[-8, 3]
			]);
			fill(100, 255, 255);
			_symm([
				[-16-0.5, 0],
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
		/*
		fill(130, 70, 70);
		_symm([
			[3.5, 0],
			[3, 1.5],
			[2, 2],
			[-7, 2],
			[-8, 1.5],
			[-8.5, 0]
		]);
		*/
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
				[-26-0.5, 4.25+0.2*0.5],
				[-15, 6]
			]);
			fill(100, 255, 255);
			_symm([
				[-19, 0],
				[-20, 3],
				[-24-0.6*0.5, 4+0.12*0.5],
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
		//circle(5, 0, 4.5);
		//circle(5+5.2, -3, 4.5);
		//circle(5+5.2, 3, 4.5);
		_symm([
			[-22, 1.3],
			[-8.7, 1.3],
			[-4.5, 6],
			[-1, 6],
			[-6, 0]
		]);
		fill(110, 60, 60);
		rect(14, -0.3, 9, 0.6);
		/*
		push();
		translate(5+3.5, 0); rotate(PI*2/3);
		rect(5.5, -0.3, 2, 0.6); rotate(PI*2/3);
		rect(5.5, -0.3, 2, 0.6);
		pop();
		*/
		fill(80, 50, 50);
		circle(5, 0, 3);
		circle(5+5.2, -3, 3);
		circle(5+5.2, 3, 3);
		/*
		_symm([
			[-22, 0.3],
			[-8, 0.3],
			[-3, 6],
			[-2.4, 6],
			[-7.4, 0]
		]);
		*/
	}

	if(T == BOMBER){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-28-2*0.5, 0],
				[-20, 3]
			]);
			fill(100, 255, 255);
			_symm([
				[-24-0.5, 0],
				[-20, 2]
			]);
		}
		fill(80, 50, 50);
		rect(4, -3, 10, 6);
		_symm([
			[-21, 3],
			[-17, 6],
			[-11, 4]
		]);
		_symm([
			[-15, 8],
			[-10, 10],
			[-6, 8.5],
			[-2, 6],
			[-9.5, 8],
			[-15, 8]
		]);
		fill(150, 80, 80);
		_symm([
			[-15, 0.5],
			[-22, 1.5],
			[-21, 3],
			[-11, 4],
			[5, 4],
			[7, 0]
		]);
		_symm([
			[12, 0],
			[14, 9],
			[17, 8],
			[20, 0]
		]);
		_symm([
			[-13, 9],
			[-10, 10],
			[-6, 8.5],
			[-2, 6],
			[-9.5, 9],
			[-13, 9]
		]);
		fill(80, 50, 50);
		_symm([
			[-3, 0],
			[-5, 4],
			[-7, 4],
			[-5, 0]
		]);
		_symm([
			[3, 0],
			[1, 4],
			[-1, 4],
			[1, 0]
		]);
		fill(130, 70, 70);
		fill(80, 50, 50);
		circle(16, 0, 4);
		circle(15.5, -5, 2);
		circle(15.5, 5, 2);
	}

	if(T == DECOY){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		_symm([
			[4.5, 0],
			[4, 2],
			[-3, 10],
			[-4, 10.5],
			[-5, 9.5],
			[-2, 2],
			[-1.6, 0]
		]);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		circle(1.25, 0, 2.5);
		if(M){
			fill(60, 180, 180);
			_symm([
				[-10-0.5, 0],
				[-5, 2],
				[-4, 2],
				[-3, 1],
				[-2.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-7-0.7*0.5, 0],
				[-5, 1],
				[-4, 1],
				[-3.5, 0]
			]);
		}
	}

	if(T == REPAIR){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		ellipse(1.25, 0, 12, 10);
		arc(3, 0, 18, 18, PI*0.7, PI*0.9);
		arc(3, 0, 18, 18, PI*1.1, PI*1.3);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		circle(1, 0, 2.5);
		if(M){
			fill(60, 180, 180);
			_symm([
				[-14-0.5, 0],
				[-9, 2],
				[-8, 2],
				[-7, 1],
				[-6.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-11-0.7*0.5, 0],
				[-9, 1],
				[-8, 1],
				[-7.5, 0]
			]);
		}
	}

	if(T == TURRET){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		circle(0, 0, 15);
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		arc(0, 0, 15, 15, PI/2-PI/4, PI/2+PI/4);
		arc(0, 0, 15, 15, PI/2+PI*2/3-PI/4, PI/2+PI*2/3+PI/4);
		arc(0, 0, 15, 15, PI/2+PI*4/3-PI/4, PI/2+PI*4/3+PI/4);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		circle(0, 0, 13);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		circle(0, -3, 2.5);
		circle(3*sin(PI*2/3), -3*cos(PI*2/3), 2.5);
		circle(3*sin(PI*4/3), -3*cos(PI*4/3), 2.5);
	}

	if(T == PHASE){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		circle(0, 0, 15);
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		arc(0, 0, 15, 15, -PI/6, PI/6);
		arc(0, 0, 15, 15, PI/2-PI/6, PI/2+PI/6);
		arc(0, 0, 15, 15, PI-PI/6, PI+PI/6);
		arc(0, 0, 15, 15, PI*1.5-PI/6, PI*1.5+PI/6);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		circle(0, 0, 13);
		if(O == 0) stroke(60, 100, 100);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		noFill(); strokeWeight(2);
		line(0, -3, 0, 3);
		line(-3, 0, 3, 0);
	}

	if(T == ROCKET){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-17-0.5, 0],
				[-12, 2],
				[-11, 2],
				[-10, 1],
				[-9.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-14-0.7*0.5, 0],
				[-12, 1],
				[-11, 1],
				[-10.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		_symm([
			[-9, 1],
			[0, 2]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
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
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		circle(3, 0, 2.5);
	}
	
	if(T == WARP){
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		_symm([
			[8.5, 0],
			[8, 2],
			[-4, 8],
			[-6, 7],
			[-4, 6],
			[-2, 2]
		]);
		if(O == 0) fill(60, 100, 100);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		circle(3, 0, 2.5);
	}

	if(T == DARTP){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-12-0.5, 0],
				[-7, 1.5],
				[-6, 1.5],
				[-5, 0.6],
				[-4.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-9-0.7*0.5, 0],
				[-7, 0.6],
				[-6, 0.6],
				[-5.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		_symm([
			[2, 0],
			[-2, 2],
			[-5, 1]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		_symm([
			[6, 0],
			[4, 1],
			[-5, 1]
		]);
	}

	if(T == STRIKEP){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-16-0.5, 0],
				[-10, 2.5],
				[-9, 2.5],
				[-8, 1.5],
				[-6.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-13-0.5*0.5, 0],
				[-10, 1.2],
				[-9, 1.2],
				[-7.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		_symm([
			[2, 0],
			[-5, 3],
			[-7, 2]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
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
				[-16-0.5, 0],
				[-9, 1.8],
				[-8, 1.8],
				[-7, 0.9],
				[-6.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-12-0.7*0.5, 0],
				[-9, 0.9],
				[-8, 0.9],
				[-7.5, 0]
			]);
		}
		if(O == 0) fill(70, 110, 110);
		if(O == 1) fill(120, 20, 20);
		if(O == 2) fill(105, 60, 60);
		_symm([
			[2, 0],
			[0, 2],
			[-6, 2],
			[-8, 0]
		]);
		if(O == 0) fill(100, 150, 150);
		if(O == 1) fill(170, 50, 50);
		if(O == 2) fill(155, 90, 90);
		_symm([
			[9.5, 0],
			[9, 0.5],
			[4, 1],
			[-2, 1],
			[-8, 1],
			[-9, 0]
		]);
	}

	if(T == BOMBERP){
		if(M){
			fill(60, 180, 180);
			_symm([
				[-16-0.5, 0],
				[-9, 1.8],
				[-8, 1.8],
				[-7, 0.9],
				[-6.5, 0]
			]);
			fill(100, 255, 255);
			_symm([
				[-12-0.7*0.5, 0],
				[-9, 0.9],
				[-8, 0.9],
				[-7.5, 0]
			]);
		}
		fill(110, 60, 60);
		_symm([
			[2, 0],
			[-2, 2],
			[-5, 1]
		]);
		fill(150, 80, 80);
		_symm([
			[6, 0],
			[4, 1],
			[-5, 1]
		]);
	}

	pop();
}

function drawShip3(s){
	drawShip2({
		type: s.type,
		team: s.team || DEV,
		imp: s.imp || 0,
		emp: s.emp || 0,
		ally: s.ally || 0,
		hp: s.hp || HP[s.type],
		modules: s.modules || [],
		rot: s.rot || 0,
		move: s.move || [],
		expire: s.expire || 1,
	});
}

function drawShip2(s){
	push(); scale(sqrt(camera.z));
	push();
	/*
	if(s.user != null && s.type == BS){
		fill(200); noStroke(); textSize(8);
		textAlign(CENTER, CENTER); text(s.user, 0, 20);
	}
	*/
	if(dragMove != null && dragMove[2] == s.uid && !s.move.length)
		rotate(atan2(dragMove[1]-screenPos(s.vpos)[1], dragMove[0]-screenPos(s.vpos)[0]));
	else rotate(s.rot);
	drawShip(s.type, s.team != ID && s.team != DEV ? (Number.isInteger(s.team) ? 2 : 1) : 0, s.move.length && !s.emp ? 1 : 0);
	pop();
	if(s.imp){
		stroke(50, 200, 50); noFill(); strokeWeight(2);
		arc(0, 0, 35, 35, -PI*0.25, PI*0.25);
		arc(0, 0, 35, 35, PI-PI*0.25, PI+PI*0.25);
	}
	if(s.emp){
		stroke(255, 50, 50); noFill(); strokeWeight(2);
		arc(0, 0, 40, 40, -PI*0.25, PI*0.25);
		arc(0, 0, 40, 40, PI-PI*0.25, PI+PI*0.25);
	}
	if(s.ally){
		stroke(50, 200, 200); noFill(); strokeWeight(2);
		arc(0, 0, 45, 45, -PI*0.25, PI*0.25);
		arc(0, 0, 45, 45, PI-PI*0.25, PI+PI*0.25);
	}
	if(s.type == TURRET && s.modules[0].state < 1){
		stroke(50, 150, 200, 150*(1-s.modules[0].state)); noFill(); strokeWeight(2);
		for(let i=0; i<3; ++i)
			arc(0, 0, 20, 20, PI*2*i/3+Date.now()/500, PI*2*i/3+PI/3+Date.now()/500);
	}

	const hp = s.hp, max = HP[s.type];

	fill(100, 80); noStroke();
	if(hp != max) rect(-15, -20, 30, 3);

	if(hp/max > 0.7) fill(50, 150, 50);
	else if(hp/max > 0.5) fill(150, 150, 50);
	else if(hp/max > 0.3) fill(200, 100, 0);
	else fill(150, 50, 50);

	if(hp != max) rect(-15, -20, ceil(30*hp/max), 3);

	if(s.imp == 0) for(let m of s.modules)
		if(m.type >= ALPHA && m.type <= ALLY)
			if(m.aux[0] && (m.use || s.type != BS || s.team == ID)){
				fill(100, 80); noStroke();
				rect(-15, -25, 30, 3);

				fill(50, 150, 150);
				rect(-15, -25, ceil(30*m.aux[0]), 3);
			}

	const exp = s.expire;

	if(exp != 1){
		fill(100, 80); noStroke();
		rect(-15, -25, 30, 3);

		fill(200, 150, 50);
		rect(-15, -25, ceil(30*exp), 3);

		fill(50, 150, 150);

		stroke(50, 150, 150); noFill();
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

	push(); strokeWeight(2); noFill();

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

	if(T == CANNON){
		_batt(-4, 0, 1, 1);
		_batt(4, 0, 1, 1);
	}

	if(T == SPREAD){
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

	// DRONE

	if(T == ROCKETD){
		stroke(200, 50, 50); fill(200, 50, 50);
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
		vertex(-11, 9);
		vertex(-11, 11);
		vertex(-9, 11);
		vertex(-2, 4);
		vertex(6, -4);
		endShape();
		strokeWeight(2);
		line(-11, 5, -2, -4);
		line(-5, 11, 4, 2);
	}

	if(T == TURRETD){
		stroke(200, 50, 50);
		line(4, -10, 4, 10);
		line(0, -10, 0, 10);
		line(-4, -10, -4, 10);
		line(-13, -10, 13, -10);
		line(11.7, -5, 4, -9);
		line(-11.7, -5, -4, -9);
		line(9, -1.3, 4, -9);
		line(-9, -1.3, -4, -9);
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

	if(T == BOMBER){
		stroke(200, 50, 50); fill(200, 50, 50);
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
		vertex(-11, 9);
		vertex(-11, 11);
		vertex(-9, 11);
		vertex(-2, 4);
		vertex(6, -4);
		endShape();
		strokeWeight(2);
		line(-11, 5, -2, -4);
		line(-5, 11, 4, 2);
	}

	// SHIELD

	if(T == ALPHA){
		stroke(50, 150, 150); noFill();
		arc(0, 0, 20, 20, -PI*0.3, PI*0.3);
		arc(0, 0, 20, 20, PI-PI*0.3, PI+PI*0.3);
	}

	if(T == DELTA){
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

	if(T == DUEL){
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

	if(T == LEAP){
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

	if(T == STRIKE){
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

	if(T == SUSPEND){
		stroke(50, 150, 50); noFill();
		arc(0, 0, 25, 25, PI*0.225, PI*1.275);
		for(let i=1.4; i<2; i+=0.2)
			arc(0, 0, 25, 25, PI*(i+0.025), PI*(i+0.075));
		line(-6, -2, 0, 2);
		line(6, -2, 0, 2);
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

	if(T == APOCALYPSE){
		stroke(50, 150, 50); noFill();
		rectMode(CENTER, CENTER);
		rect(0, 0, 25, 25);
		strokeWeight(1.5);
		rect(0, 0, 17, 17);
		strokeWeight(1);
		rect(0, 0, 10, 10);
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

	if(T == PHASE){
		stroke(150, 100, 50); noFill();
		line(0, -5, 0, 5);
		line(-5, 0, 5, 0);
		arc(0, 0, 22, 22, -PI/6, PI/6);
		arc(0, 0, 22, 22, PI/2-PI/6, PI/2+PI/6);
		arc(0, 0, 22, 22, PI-PI/6, PI+PI/6);
		arc(0, 0, 22, 22, PI*1.5-PI/6, PI*1.5+PI/6);
	}

	if(T == WARP){
		stroke(150, 100, 50); fill(150, 100, 50);
		beginShape();
		vertex(0, -7);
		vertex(5, 4);
		vertex(2, 2);
		vertex(0, 7);
		vertex(-2, 2);
		vertex(-5, 4);
		endShape(CLOSE); noFill();
		arc(0, 0, 25, 30, -PI*0.2, PI*0.2);
		arc(0, 0, 25, 30, PI-PI*0.2, PI+PI*0.2);
	}

	pop();
}

function _moduleColor(T){
	if(T >= LASER && T <= ROCKETD) return [255, 50, 50];
	if(T >= SENTINEL && T <= BOMBER) return [255, 50, 50];
	if(T >= ALPHA && T <= ALLY) return [0, 255, 255];
	if(T >= EMP && T <= APOCALYPSE) return [100, 255, 100];
	if(T >= DECOY && T <= REPAIR) return [255, 150, 0];
	return [255];
}

function drawModule2(T, S){
	fill(0, 10, 25); noStroke();
	rect(-20, -20, 40, 40);

	if(T == NULL){
		fill(255, 40);
		rect(-20, -20, 40, 40);
		stroke(80); strokeWeight(3); noFill();
		arc(0, -6, 17, 13, -PI*0.8, PI*0.5);
		line(0, 13/2-6, 0, 5);
		line(0, 10, 0, 12);
		return;
	}

	/*
	fill(255, 40);
	if(T >= LASER && T <= ROCKETD) fill(255, 50, 50, 60);
	if(T >= SENTINEL && T <= BOMBER) fill(255, 50, 50, 60);
	if(T >= ALPHA && T <= ALLY) fill(0, 255, 255, 60);
	if(T >= EMP && T <= APOCALYPSE) fill(100, 255, 100, 60);
	if(T >= DECOY && T <= REPAIR) fill(255, 150, 0, 60);
	*/

	fill(..._moduleColor(T), 60);

	rect(-20, -20, 40, 40);

	drawModule(T);

	fill(0, 100);
	rect(-20, -20, 40, 40-40*abs(S));

	fill(0, 40);
	if(S != 1 && S >= 0)
		if(!(T >= LASER && T <= ROCKETD) && (T != DELTA || S != 0.75))
			rect(-20, 20-40*abs(S), 40, 40*abs(S));
}

function drawEffect(T, S=null){
	push();

	if(T == APOCALYPSE){
		rectMode(CENTER, CENTER);
		stroke(255, 50, 50, 150); strokeWeight(2); noFill();
		let m = min(1, ((Date.now()/2000)%1)*2);
		if(m < 1) rect(0, 0, 300*m, 300*m);
		strokeWeight(1.5);
		m = min(1, ((Date.now()/2000-0.1)%1)*2);
		if(m < 1) rect(0, 0, 300*m, 300*m);
		strokeWeight(1);
		m = min(1, ((Date.now()/2000-0.2)%1)*2);
		if(m < 1) rect(0, 0, 300*m, 300*m);
	}

	if(T == ALPHA){
		scale(sqrt(camera.z));

		stroke(50, 150, 150, 50); noFill(); strokeWeight(3);
		arc(0, 0, 50-3, 50-3, -PI*0.25, PI*0.25);
		arc(0, 0, 50-3, 50-3, PI-PI*0.25, PI+PI*0.25);

		noStroke(); fill(50, 150, 150, 80);
		circle(0, 0, 50);
	}

	if(T == DELTA){
		scale(sqrt(camera.z));

		if(S){
			fill(200, 100, 50, 100); noStroke();
			circle(0, 0, RANGE[DELTA]*2*sqrt(camera.z));
		}

		stroke(50, 150, 150, 40); noFill(); strokeWeight(3);
		arc(0, 0, 55-3, 55-3, -PI*0.25+frameCount/30, PI*0.25+frameCount/30);
		arc(0, 0, 55-3, 55-3, PI-PI*0.25+frameCount/30, PI+PI*0.25+frameCount/30);

		noStroke(); fill(50, 150, 150, 40);
		circle(0, 0, 55);
	}

	if(T == PASSIVE){
		scale(sqrt(camera.z));

		stroke(50, 150, 150, ceil(150*S)); noFill(); strokeWeight(3);
		arc(0, 0, 55, 53, -PI*0.25, PI*0.25);
		arc(0, 0, 55, 53, PI-PI*0.25, PI+PI*0.25);

		noStroke(); fill(50, 150, 150, ceil(40*S));
		ellipse(0, 0, 55+2, 53+2);
	}

	if(T == OMEGA){
		scale(sqrt(camera.z));

		stroke(50, 150, 150, 70); noFill(); strokeWeight(3);
		circle(0, 0, 70-3);

		noStroke(); fill(50, 150, 150, 40);
		circle(0, 0, 70);
	}
	
	if(T == MIRROR){
		scale(camera.z);
		fill(200, 50, 50, 30); noStroke();
		circle(0, 0, RANGE[MIRROR]*2);
		stroke(200, 50, 50, 150); strokeWeight(2); noFill();
		arc(0, 0, RANGE[MIRROR]*2, RANGE[MIRROR]*2, -PI/2, -PI/2+PI*2*S);
	}

	if(T == ALLY){
		scale(camera.z);

		fill(150, 200, 200, 15); noStroke();
		circle(0, 0, RANGE[ALLY]*2);
		stroke(150, 200, 200, 150); strokeWeight(2); noFill();
		arc(0, 0, RANGE[ALLY]*2, RANGE[ALLY]*2, -PI/2, -PI/2+PI*2*S);
		strokeWeight(1.5);
		if(-PI/2+PI*2*S > -PI*0.08) arc(0, 0, RANGE[ALLY]*2-6, RANGE[ALLY]*2-6,
			max(-PI/2, -PI*0.08), min(-PI/2+PI*2*S, PI*0.08));
		if(-PI/2+PI*2*S > PI-PI*0.08) arc(0, 0, RANGE[ALLY]*2-6, RANGE[ALLY]*2-6,
			max(-PI/2, PI-PI*0.08), min(-PI/2+PI*2*S, PI*1.08));
	}

	if(T == EMP){
		scale(camera.z);
		noStroke();
		fill(100, 150, 255, 50*min(1, S*2.5));
		circle(0, 0, RANGE[EMP]*2*min(1, (1-S)*20/3));
		stroke(100, 150, 255, 100); strokeWeight(2/sqrt(camera.z));
		noFill();
		if(S > 0.4){
			for(let j=0; j<3; ++j){
				let a = noise(floor(Date.now()/100), j)*30;
				beginShape();
				for(let i=20; i<=RANGE[EMP]*min(1, (1-S)*20/3); i+=10){
					const old = a;
					a += (noise(floor(Date.now()/100+i), j)*2-1)*PI*0.1;

					vertex(cos(a)*i, sin(a)*i);
				}
				endShape();
			}
		}
	}

	if(T == DISRUPT){
		scale(camera.z);
		noStroke();
		fill(100, 255, 150, 50*min(1, S*2.5));
		circle(0, 0, RANGE[DISRUPT]*2*min(1, (1-S)*20/3));
		stroke(100, 255, 150, 100*min(1, (1-S)*80/3)); noFill(); strokeWeight(2/sqrt(camera.z));
		for(let j=0; j<3; ++j){
			let a = (1-Math.pow(noise(floor(Date.now()/100), j), 2))*
					(2*(RANGE[DISRUPT]+20)*min(1, (1-S)*20/3)-40)+40,
				b = (noise(floor(Date.now()/100)+100, j)*30)%(PI*2),
				c = (b+noise(floor(Date.now()/100)+200, j)*PI*2)%(PI*2);
			arc(0, 0, a, a, b, c);
		}
	}

	if(T == LEAP){
		scale(camera.z);
		fill(255, 100, 50, 20); noStroke();
		circle(0, 0, RANGE[LEAP]*2);
		noFill(); stroke(200, 100, 50); strokeWeight(2/sqrt(camera.z));
		arc(0, 0, RANGE[LEAP]*2, RANGE[LEAP]*2, -PI/2, -PI/2+PI*2*(1+S));
	}

	if(T == VENG){
		scale(camera.z);
		fill(255, 50, 50, 20); noStroke();
		circle(0, 0, RANGE[VENG]*2);
		noFill(); stroke(200, 50, 50); strokeWeight(2/sqrt(camera.z));
		arc(0, 0, RANGE[VENG]*2, RANGE[VENG]*2, -PI/2, -PI/2+PI*2*(1+S));
	}

	if(T == BARRIER){
		scale(camera.z);
		strokeWeight(2/sqrt(camera.z));
		if(S < -3/TIME[BARRIER] || ((Date.now()/1000)%1 < 0.5)){
			fill(255, 20); noStroke();
			for(let i=0; i<6; ++i)
				arc(0, 0, RANGE[BARRIER]*2, RANGE[BARRIER]*2,
					PI/3*i-PI*0.25+PI*Date.now()/10000, PI/3*i+PI*0.25+PI*Date.now()/10000, OPEN);
		}
		stroke(150, 150); noFill();
		circle(0, 0, RANGE[BARRIER]*2);
	}

	if(T == AMP){
		scale(camera.z);
		strokeWeight(2/sqrt(camera.z));
		fill(200, 50, 50, 30); noStroke();
		circle(0, 0, RANGE[AMP]*2);
		stroke(200, 50, 50, 100); noFill();
		circle(0, 0, RANGE[AMP]*2);
		if(S < -3/TIME[AMP] || ((Date.now()/1000)%1 < 0.5)){
			strokeWeight(1.5/sqrt(camera.z));
			circle(0, 0, (RANGE[AMP]-4)*2);
			strokeWeight(1/sqrt(camera.z));
			circle(0, 0, (RANGE[AMP]-8)*2);
			strokeWeight(0.6/sqrt(camera.z));
			circle(0, 0, (RANGE[AMP]-12)*2);
			strokeWeight(0.3/sqrt(camera.z));
			circle(0, 0, (RANGE[AMP]-16)*2);
		}
	}

	if(T == SUSPEND){
		scale(camera.z);
		strokeWeight(2/sqrt(camera.z));
		fill(100, 150, 200, 30); noStroke();
		circle(0, 0, RANGE[SUSPEND]*2);
		stroke(10, 150, 200, 100); noFill();
		circle(0, 0, RANGE[SUSPEND]*2);
		if(S < -3/TIME[SUSPEND] || ((Date.now()/1000)%1 < 0.5)){
			strokeWeight(1.5/sqrt(camera.z));
			circle(0, 0, (RANGE[SUSPEND]-4)*2);
			strokeWeight(1/sqrt(camera.z));
			circle(0, 0, (RANGE[SUSPEND]-8)*2);
			strokeWeight(0.6/sqrt(camera.z));
			circle(0, 0, (RANGE[SUSPEND]-12)*2);
			strokeWeight(0.3/sqrt(camera.z));
			circle(0, 0, (RANGE[SUSPEND]-16)*2);
		}
	}

	if(T == FORT){
		stroke(200, 100, 50, 255*min(1, (0.5-abs(S-0.5))*3)); noFill(); strokeWeight(2);
		scale(sqrt(camera.z));
		for(let i=0; i<6; ++i){
			arc(0, 0, 50, 50, PI/3*i-PI/2-PI/15+Date.now()/2000, PI/3*i-PI/2+PI/15+Date.now()/2000);
			line(21*sin(PI/3*i+Date.now()/1500), 21*cos(PI/3*i+Date.now()/1500), 17*sin(PI/3*i+Date.now()/1500), 17*cos(PI/3*i+Date.now()/1500));
		}
	}

	if(T == REPAIR){
		scale(camera.z);
		fill(50, 200, 50, 20); noStroke();
		circle(0, 0, 60*2);
	}

	pop();
}
