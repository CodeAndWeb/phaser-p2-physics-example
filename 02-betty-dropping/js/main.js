var Main = function(game){

};

Main.prototype = {

	create: function() {
	    var me = this;

	    // Set the background colour to blue
	    me.game.stage.backgroundColor = '#ccddff';

	    // Start the P2 Physics Engine
	    me.game.physics.startSystem(Phaser.Physics.P2JS);

	    // Set the gravity
	    me.game.physics.p2.gravity.y = 1000;

	    // Create a random generator
	    var seed = Date.now();
	    me.random = new Phaser.RandomDataGenerator([seed]);

	    // Create the ceiling
	    me.createBlock();

	    // Create the player
	    me.createPlayer();
	},

	update: function() {

	},

	createBlock: function() {
	    var me = this;

	    // Define a block using bitmap data rather than an image sprite
	    var blockShape = me.game.add.bitmapData(me.game.world.width, 200);

	    // Fill the block with black color
	    blockShape.ctx.rect(0, 0, me.game.world.width, 200);
	    blockShape.ctx.fillStyle = '000';
	    blockShape.ctx.fill();

	    // Create a new sprite using the bitmap data
	    me.block = me.game.add.sprite(0, 0, blockShape);

	    // Enable P2 Physics and set the block not to move
	    me.game.physics.p2.enable(me.block);
	    me.block.body.static = true;
	    me.block.anchor.setTo(0, 0);
	},

	createPlayer: function() {
	    var me = this;

	    // Add the player to the game
	    me.player = me.game.add.sprite(200, 400, 'betty');

	    // Enable physics, use "true" to enable debug drawing
	    me.game.physics.p2.enable([me.player], false);

	    // Get rid of current bounding box
	    me.player.body.clearShapes();

	    // Add our PhysicsEditor bounding shape
	    me.player.body.loadPolygon("sprite_physics", "betty");
	},

	gameOver: function(){
		this.game.state.start('GameOver');
	},
};