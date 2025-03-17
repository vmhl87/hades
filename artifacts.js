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
		(x, g) => { x.hp += 500; x.mhp += 500; }
	]);

	s([
		"Heavy Alloy Plating",
		"+1500 Max HP, -25% Speed",
		"Synthesized from some form of supercompressed carbon, this material comprises the hull of Cerberus ships, granting supreme protection at the cost of greatly increasing the ship’s mass.",
		(x, g) => { x.hp += 1500; x.mhp += 1500; x.speed *= 0.75; }
	]);

	s([
		"Ion Cell",
		"+15% Speed, -25% EMP Resist",
		"At the heart of every Cerberus ship's reactor is an ion cell, a mysterious device the size of a water bottle that releases an enormous amount of energy by generating polarized magnetic fields which mysteriously deteriorate a few days after the cell is harvested. Although useful for significantly boosting the Battleship engine’s performance for a little while, the properties of the Ion Cell make it especially susceptible to EMP disruption.",
		(x, g) => { x.speed *= 1.15; x.empVuln *= 1.25; }
	]);

	s([
		"Quantum Redistributor",
		"+4000 HP, -1000 Max HP",
		"The first traces of Quantum manipulation were discovered on a Cerberus Colossus three years after the outbreak of the First Cosmic War. Shortly after the Yan Conjecture for Determinate Quantum Shifts was proven, engineers learned to modify the Cerberus Quantum Engines for a variety of purposes, one of which is to reallocate parts of the ship’s hull armor to patch up critical damage in other areas.",
		(x, g) => { x.mhp = Math.max(0, x.mhp - 1000); x.heal(4000); }
	]);

	s([
		"Ionic Amplifier",
		"+5% Damage",
		"Partially derived from technologies discovered in Cerberus Ion Cells, the Ionic Amplifier creates a temporary molecular field around outgoing weaponry, weakening molecular bonds around the area of impact and slightly improving the damage done to enemy ships.",
		(x, g) => {
			for(let m of x.modules){
				if(m.color != null)
					m.color = [50, 100, 200];
			}

			x.dmgBoost *= 1.05;
		}
	]);

	s([
		"Gamma Shield",
		"-50% Sector Damage",
		"",
		(x, g) => { x.sectorDmg *= 0.5; }
	]);

	s([
		"Surge Protector",
		"+25% EMP/Disrupt Resist",
		"",
		(x, g) => { x.empVuln *= 0.8; x.disruptVuln *= 0.8; }
	]);
};

try{
	module.exports = { types: Artifacts.types, names: Artifacts.names };
}catch(e){}
