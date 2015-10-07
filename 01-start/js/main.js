var Main = function(game){

};

Main.prototype = {

	create: function() {

	},

	update: function() {

	},

	gameOver: function(){
		this.game.state.start('GameOver');
	}

};