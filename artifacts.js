let _ct = 0;

let Artifacts = {
	names: {
		LIGHTALLOYPLATING: _ct++,
		IONCELL: _ct++,
	}, types: new Array(_ct)
};

{
	function s(name, arg){
		Artifacts.types[Artifacts.names[name]] = arg;
	}

	s("LIGHTALLOYPLATING", [
		"Light Alloy Plating",
		"+500 HP",
		x => { x.hp += 500; x.mhp += 500; }
	]);

	s("IONCELL", [
		"Ion Cell",
		"+15% Speed, -25% EMP Resist",
		x => { x.speed *= 1.15; x.empVuln *= 1.25; }
	]);
};

try{
	module.exports = { types: Artifacts.types, names: Artifacts.names };
}catch(e){}
