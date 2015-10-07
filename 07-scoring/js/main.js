var Main = function(game){

};

Main.prototype = {

	create: function() {
	    var me = this;

		me.timesHit = 0;

	    // Set the background colour to blue
	    me.game.stage.backgroundColor = '#ccddff';

	    // Start the P2 Physics Engine
	    me.game.physics.startSystem(Phaser.Physics.P2JS);

	    // Set the gravity
	    me.game.physics.p2.gravity.y = 1000;

	    // Create a random generator
	    var seed = Date.now();
	    me.random = new Phaser.RandomDataGenerator([seed]);

	    // Create collision groups
	    me.playerCollisionGroup = me.game.physics.p2.createCollisionGroup();
	    me.blockCollisionGroup = me.game.physics.p2.createCollisionGroup();
	    me.bananasCollisionGroup = me.game.physics.p2.createCollisionGroup();
	    me.cherriesCollisionGroup = me.game.physics.p2.createCollisionGroup();
	    me.pineapplesCollisionGroup = me.game.physics.p2.createCollisionGroup();

	    // Create the ceiling
	    me.createBlock();

	    // Create the player
	    me.createPlayer();

	    // Create rope
	    me.createRope();

		// Create a bunch of fruit
		me.bananas = me.createObjects("banana");
		me.pineapples = me.createObjects("pineapple");
		me.cherries = me.createObjects("cherries");

		// Create score Label
		me.createScore();

		// This is required so that the groups will collide with the world bounds
		me.game.physics.p2.updateBoundsCollisionGroup();

	    // Spawn bananas every 600ms
	    me.timer = game.time.events.loop(600, function() {
	        me.spawnObjectLeft();
	        me.spawnObjectRight();
	    });

	    // Enable collision callbacks
	    me.game.physics.p2.setImpactEvents(true);
	},

	createScore: function() {
	    var me = this;

	    var scoreFont = "100px Arial";

	    me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
	    me.scoreLabel.anchor.setTo(0.5, 0.5);
	    me.scoreLabel.align = 'center';
	},

	createObjects: function(objectName) {
		var me = this;

		// Create a group to hold the collision shapes
		var objects = game.add.group();
		objects.enableBody = true;
		objects.physicsBodyType = Phaser.Physics.P2JS;
		objects.createMultiple(40, objectName);

	    objects.forEach(function(child){
	        child.body.clearShapes();
			child.body.loadPolygon('sprite_physics', objectName);
	    }, me);   

	    return objects;
	},

	update: function() {
	    var me = this;

	    //Update the position of the rope
	    me.drawRope();
	},

	spawnObjectLeft: function() {
	    var me = this;

	    // Spawn new object
	    var object = me.spawnObject();

	    // Set object's position and velocity
	    object.reset(1, 600);
	    object.body.velocity.x = me.random.integerInRange(100, 800);
	    object.body.velocity.y = -me.random.integerInRange(1000, 1500);
	},

	spawnObjectRight: function() {
	    var me = this;

	    // Spawn new object
	    var object = me.spawnObject();

	    // Set object's position and velocity
	    object.reset(me.game.world.width, 600);
	    object.body.velocity.x = -me.random.integerInRange(100, 800);
	    object.body.velocity.y = -me.random.integerInRange(1000, 1500);
	},

	spawnObject: function() {
	    var me = this;

	    // Create random object
	    var objectToSpawn = me.random.integerInRange(1,3);
	    console.log(objectToSpawn);

	    if(objectToSpawn == 1){
	        var object = me.bananas.getFirstDead();
	        object.body.setCollisionGroup(me.bananasCollisionGroup);
	    }
	    else if (objectToSpawn == 2){
	        var object = me.pineapples.getFirstDead();
	        object.body.setCollisionGroup(me.pineapplesCollisionGroup);
	        object.body.data.gravityScale = 1.5;
	    }
	    else {
	        var object = me.cherries.getFirstDead();
	        object.body.setCollisionGroup(me.cherriesCollisionGroup);
	        object.body.data.gravityScale = 0.5;
	    }

	    // set the lifespan
	    object.lifespan = 6000;

		// Fruits collide with fruit and the player
		object.body.collides([
	        me.blockCollisionGroup,
	        me.playerCollisionGroup,
	        me.bananasCollisionGroup,
	        me.cherriesCollisionGroup,
	        me.pineapplesCollisionGroup
		]);

	    return object;
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

	    // Enable the blocks collisions
	    me.block.body.setCollisionGroup(me.blockCollisionGroup);
	    me.block.body.collides([me.playerCollisionGroup]);
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

	    // Define the players collision group and make it collide with the block and fruits
	    me.player.body.setCollisionGroup(me.playerCollisionGroup);

	    me.player.body.collides([
	        me.blockCollisionGroup,
	        me.bananasCollisionGroup,
	        me.cherriesCollisionGroup,
	        me.pineapplesCollisionGroup
			], me.playerCollision, me);
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

    playerCollision: function() {
	    var me = this;

	    if(!me.hitCooldown) {
	        me.hitCooldown = true;
	        me.timesHit++;
	        me.scoreLabel.text = me.timesHit;

	        me.game.time.events.add(1000, function(){
	            me.hitCooldown = false;
	        }, me);
	    }
	},

	gameOver: function(){
		this.game.state.start('GameOver');
	},
};