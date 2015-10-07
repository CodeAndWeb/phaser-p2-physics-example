var GameTitle = function(game){};

GameTitle.prototype = {

	create: function(){

	},

	startGame: function(){
		this.game.state.start("Main");
	}

}