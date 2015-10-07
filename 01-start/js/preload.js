var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 

	},

	create: function(){
		this.game.state.start("GameTitle");
	}
}