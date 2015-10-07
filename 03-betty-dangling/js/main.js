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

	    // Create rope
	    me.createRope();
	},

	update: function() {
	    var me = this;

	    //Update the position of the rope
	    me.drawRope();
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

	    // Enable clicking on block and trigger a function when it is clicked
    	me.block.inputEnabled = true;
	    me.block.events.onInputDown.add(me.changeRope, this);
	},

	changeRope: function(sprite, pointer) {
	    var me = this;

	    //Remove last spring
	    me.game.physics.p2.removeSpring(me.rope);

	    //Create new spring at pointer x and y
	    me.rope = me.game.physics.p2.createSpring(me.block, me.player, 200, 10, 3, [-pointer.x, -pointer.y]);
	    me.ropeAnchorX = pointer.x;
	    me.ropeAnchorY = pointer.y
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

	createRope: function() {
	    var me = this;

	    // Add bitmap data to draw the rope
	    me.ropeBitmapData = game.add.bitmapData(me.game.world.width, me.game.world.height);

	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.lineWidth = "4";
	    me.ropeBitmapData.ctx.strokeStyle = "#ffffff";
	    me.ropeBitmapData.ctx.stroke();

	    // Create a new sprite using the bitmap data
	    me.line = game.add.sprite(0, 0, me.ropeBitmapData);

	    // Keep track of where the rope is anchored
	    me.ropeAnchorX = (me.block.world.x + 500);
	    me.ropeAnchorY = (me.block.world.y + me.block.height);

	    // Create a spring between the player and block to act as the rope
	    me.rope = me.game.physics.p2.createSpring(
	        me.block,  // sprite 1
	        me.player, // sprite 2
	        300,       // length of the rope
	        10,        // stiffness
	        3,         // damping
	        [-(me.block.world.x + 500), -(me.block.world.y + me.block.height)]
	    );

	    // Draw a line from the player to the block to visually represent the spring
	    me.line = new Phaser.Line(me.player.x, me.player.y,
	        (me.block.world.x + 500), (me.block.world.y + me.block.height));
	},

	drawRope: function() {
	    var me = this;

	    // Change the bitmap data to reflect the new rope position
	    me.ropeBitmapData.clear();
	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.moveTo(me.player.x, me.player.y);
	    me.ropeBitmapData.ctx.lineTo(me.ropeAnchorX, me.ropeAnchorY);
	    me.ropeBitmapData.ctx.lineWidth = 4;
	    me.ropeBitmapData.ctx.stroke();
	    me.ropeBitmapData.ctx.closePath();
	    me.ropeBitmapData.render();
    },

	gameOver: function(){
		this.game.state.start('GameOver');
	},
};