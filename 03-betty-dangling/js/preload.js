var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
	    this.game.load.image("betty", "assets/betty.png");
	    this.game.load.physics("sprite_physics", "assets/sprite_physics.json");
	},

	create: function(){
		this.game.state.start("Main");
	}
}