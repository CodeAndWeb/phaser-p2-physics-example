var GameOver = function(game){};

GameOver.prototype = {

  	create: function(){

	},

	restartGame: function(){
		this.game.state.start("GameTitle");
	}
	
}