let Artifacts = {
	names: {},
	types: [],
};

{
	let ct = 0;

	function s(arg){
		Artifacts.names[arg[0]] = ct++;
		Artifacts.types.push(arg);
	}

	s([
		"Light Alloy Plating",
		"+500 Max HP",
		"When the space defenses of what used to be Germany took down the first Cerberus craft in 2107, scientists found this strange material amidst the wreckage. It is slightly translucent, multicolored, and incredibly durable.",
		(x, g) => { x.hp += 500; x.mhp += 500; },
		["DIAMOND", [255, 255, 50], [255, 125, 0], [200, 0, 0]],
	]);

	s([
		"Heavy Alloy Plating",
		"+1500 Max HP, -25% Speed",
		"Synthesized from some form of supercompressed carbon, this material comprises the hull of Cerberus ships, granting supreme protection at the cost of greatly increasing the ship’s mass.",
		(x, g) => { x.hp += 1500; x.mhp += 1500; x.speed *= 0.75; },
		["DIAMOND", [50, 150, 255], [200, 50, 200], [200, 50, 0]],
	]);

	s([
		"Ion Cell",
		"+20% Speed, -25% EMP Resist",
		"At the heart of every Cerberus ship's reactor is an ion cell, a mysterious device the size of a water bottle that releases an enormous amount of energy by generating polarized magnetic fields which mysteriously deteriorate a few days after the cell is harvested. Although useful for significantly boosting the Battleship engine’s performance for a little while, the properties of the Ion Cell make it especially susceptible to EMP disruption.",
		(x, g) => { x.speed *= 1.2; x.empVuln *= 1.25; },
		["ORB", [50, 255, 255], [255, 255, 0], [150, 100, 255]],
	]);

	s([
		"Spectral Filter",
		"+5% Damage",
		"Partially derived from technologies discovered in Cerberus Ion Cells, the Spectral Filter creates a temporary molecular field around outgoing weaponry, weakening molecular bonds around the area of impact and slightly improving the damage done to enemy ships.",
		(x, g) => {
			for(let m of x.modules){
				if(m.color != null)
					m.color = [50, 100, 200];
			}

			x.dmgBoost *= 1.05;
		},
		["DIAMOND", [125, 200, 255], [150, 50, 255], [150, 150, 200]],
	]);

	s([
		"Quantum Oscillator",
		"-50% Cerberus Damage",
		"",
		(x, g) => { x.cerbVuln *= 0.5; },
		["ORB", [0, 255, 200], [100, 200, 0], [0, 100, 0]],
	]);

	s([
		"Entanglement Drive",
		"+15% Resistance while moving",
		"",
		(x, g) => { x.moveVuln *= 0.85; x.entangled = true; },
		["Y", [255, 150, 100], [255, 255, 200], [80, 120, 200]],
	]);

	s([
		"Gamma Shield",
		"-50% Sector Damage",
		"",
		(x, g) => { x.sectorDmg *= 0.5; },
		["DIAMOND", [0, 255, 0], [0, 200, 200], [0, 120, 0]],
	]);

	s([
		"Surge Protector",
		"+25% EMP/Disrupt Resist",
		"",
		(x, g) => { x.empVuln *= 0.8; x.disruptVuln *= 0.8; },
		["Y", [150], [255, 255, 0], [0, 255, 0]],
	]);
};

function drawArtifact(T, O){
	stroke(200, O/2); strokeWeight(3); noFill();
	rect(-40, -40, 80, 80);

	if(T[0] == "Y"){
		for(let i=0; i<3; ++i){
			stroke(...T[1], O);
			const A = [sin(i*PI*2/3)*5, cos(i*PI*2/3)*5];
			const B = [sin(i*PI*2/3)*35, cos(i*PI*2/3)*35];

			const S = ((Date.now()/2000)%1)*5 - (2-(i+2)%3)*0.3-1;

			const C = min(1, max(0, S-0.2)), D = min(1, max(0, S+0.2));

			if(C > 0) line(..._lerp(A, B, C), ...A);
			if(D < 1) line(..._lerp(A, B, D), ...B);

			const X = S > 0 && S < 1 ? 0.5-cos(S*PI*2)/2 : 0;

			stroke(...T[2], O);
			arc(0, 0, 30+X*10, 30+X*10, (-i+1)*PI*2/3+PI/2+PI/8, (-i+2)*PI*2/3+PI/2-PI/8);

			stroke(...T[3], O);
			arc(0, 0, 50+X*5, 50+X*5, (-i+1)*PI*2/3+PI/2+PI/6, (-i+2)*PI*2/3+PI/2-PI/6);
		}
	}

	if(T[0] == "DIAMOND"){
		const A = ((Date.now()/1500)%1)*3 - 0.5;
		const B = ((Date.now()/1500)%1)*3 - 1.5;
		const S = ((Date.now()/1500+0.5)%1)*3 - 1;

		stroke(...T[1], O);
		push(); rotate(PI/2*max(0, min(1, (S-0.5)*0.6+0.5)));
		rect(-3, -3, 6, 6);
		pop();

		stroke(...T[2], O);

		{
			const C = min(1, max(0, B-0.2));
			const D = min(1, max(0, B+0.2));

			if(C > 0){
				beginShape();
				vertex(5, -15);
				if(C > 0.5){
					vertex(20, 0);
					vertex(20-30*(C-0.5), 0+30*(C-0.5));
				}else{
					vertex(5+30*C, -15+30*C);
				}
				endShape();
				beginShape();
				vertex(-5, -15);
				if(C > 0.5){
					vertex(-20, 0);
					vertex(-20+30*(C-0.5), 0+30*(C-0.5));
				}else{
					vertex(-5-30*C, -15+30*C);
				}
				endShape();
			}

			if(D < 1){
				beginShape();
				if(D > 0.5){
					vertex(20-30*(D-0.5), 0+30*(D-0.5));
				}else{
					vertex(5+30*D, -15+30*D);
					vertex(20, 0);
				}
				vertex(5, 15);
				endShape();
				beginShape();
				if(D > 0.5){
					vertex(-20+30*(D-0.5), 0+30*(D-0.5));
				}else{
					vertex(-5-30*D, -15+30*D);
					vertex(-20, 0);
				}
				vertex(-5, 15);
				endShape();
			}
		};

		stroke(...T[3], O);

		{
			const C = min(1, max(0, A-0.2));
			const D = min(1, max(0, A+0.2));

			if(C > 0){
				beginShape();
				vertex(-23, -7);
				if(C > 0.5){
					vertex(0, -30);
					vertex(0+46*(C-0.5), -30+46*(C-0.5));
				}else{
					vertex(-23+46*C, -7-46*C);
				}
				endShape();
				beginShape();
				vertex(-23, 7);
				if(C > 0.5){
					vertex(0, 30);
					vertex(0+46*(C-0.5), 30-+46*(C-0.5));
				}else{
					vertex(-23+46*C, 7+46*C);
				}
				endShape();
			}

			if(D < 1){
				beginShape();
				if(D > 0.5){
					vertex(0+46*(D-0.5), -30+46*(D-0.5));
				}else{
					vertex(-23+46*D, -7-46*D);
					vertex(0, -30);
				}
				vertex(23, -7);
				endShape();
				beginShape();
				if(D > 0.5){
					vertex(0+46*(D-0.5), 30-46*(D-0.5));
				}else{
					vertex(-23+46*D, 7+46*D);
					vertex(0, 30);
				}
				vertex(23, 7);
				endShape();
			}
		};
	}

	if(T[0] == "ORB"){
		let X = Date.now()/500;

		stroke(...T[1], O);
		arc(0, 0, 20, 20, X, X+PI);
		stroke(...T[1], O/2);
		arc(0, 0, 20, 20, X+PI+PI/8, X+2*PI-PI/8);

		X = -Date.now()/750;

		stroke(...T[2], O);
		arc(0, 0, 40, 40, X, X+PI);
		stroke(...T[2], O/2);
		arc(0, 0, 40, 40, X+PI+PI/16, X+2*PI-PI/16);

		X = Date.now()/1000;

		stroke(...T[3], O);
		arc(0, 0, 60, 60, X, X+PI);
		stroke(...T[3], O/2);
		arc(0, 0, 60, 60, X+PI+PI/24, X+2*PI-PI/24);
	}
}

try{
	module.exports = { types: Artifacts.types, names: Artifacts.names };
}catch(e){}
