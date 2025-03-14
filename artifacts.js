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
		"+500 HP",
		"When the space defenses of what used to be Germany took down the first Cerberus craft in 2107, scientists found this strange material amidst the wreckage. It is slightly translucent, multicolored, and incredibly durable.",
		(x, g) => { x.hp += 500; x.mhp += 500; }
	]);

	s([
		"Ion Cell",
		"+15% Speed, -25% EMP Resist",
		"At the heart of every Cerberus ship's reactor is an ion cell, a mysterious device the size of a water bottle that releases an enormous amount of energy. Interestingly, ion cells, without fail, lose their energy and die a few days after being harvested, rendering them useless as a long-term energy source.",
		(x, g) => { x.speed *= 1.15; x.empVuln *= 1.25; }
	]);

	s([
		"Emergency Repair Kit",
		"+4000 HP, -1000 Max HP",
		"",
		(x, g) => { x.mhp = Math.max(0, x.mhp - 1000); x.heal(4000); }
	]);

	s([
		"Blue Crystal",
		"+5% Damage, Blue Recolor",
		"",
		(x, g) => {
			for(let m of x.modules){
				if(m.color != null)
					m.color = [50, 100, 200];
			}

			x.dmgBoost *= 1.05;
		}
	]);
};

try{
	module.exports = { types: Artifacts.types, names: Artifacts.names };
}catch(e){}
