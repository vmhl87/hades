class Ship{
	constructor(type, hp, team, modules, loc){
		this.type = type;
		this.hp = hp;
		this.team = team;
		this.modules = modules;
		this.loc = loc;
	}
}

class Game{
	constructor(players){
		this.players = players;
		this.ships = [];
		this.time = 0;
	}

	addShip(type, hp, team, modules, loc){
		this.ships.push(new Ship(type, hp, team, modules, loc));
	}

	alive(type){
		return this.ships.filter(x => x.type == type).length;
	}

	kill(){
		this.ships = this.ships.filter(x => x.hp > 0);
	}
}

module.exports = { Ship, Game };
