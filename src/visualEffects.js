//-------------------------------------------------------------------------------
// Various visual effects for the game
// explosion effect
// bullet time effect
// edges animation effect
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Visual effect for killed enemy or player
//-------------------------------------------------------------------------------
function explosionEffect(x, y, color)
{
	var options = {
		maxParticles: 30,
		size: 10,
		sizeRandom:0,
		speed: 5,
		speedRandom: 0,
		// Lifespan in frames
		lifeSpan: 20,
		lifeSpanRandom: 0,
		// Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
		angle: 0,
		angleRandom: 360,
		startColour: color,
		startColourRandom: [0, 0, 0, 0],
		endColour: color,
		endColourRandom: [0, 0, 0, 0],

		// Random spread from origin
		spread: 0,
		// How many frames should this last
		duration: 10,
		// Will draw squares instead of circle gradients
		fastMode: true,
		gravity: { x: 0, y: 0 },
		// sensible values are 0-3
		jitter: 0,
		// Offset for the origin of the particles
		originOffset: {x: 0, y: 0}
	};

	Crafty.e("2D,Canvas,Particles,Delay")
		.particles(options)
		.attr({x: x, y: y})
		.delay(function() {this.destroy()}, 1000);
}

//-------------------------------------------------------------------------------
// Visual effect for bullet time
// Puts a black transparent filter on the screen and creates threes horizontal
// lines with y axis animation, each line moves with random speed
//-------------------------------------------------------------------------------
Crafty.c("BulletTimeEffect",
{
	required: "2D, Canvas, Color",

	init: function()
	{	
		// create filter
		this.w = WIDTH;
		this.h = HEIGHT;
		this.color("black", 0.1);

		this._initLines(); // create lines
	}, 

	events: {"EnterFrame": "_animateLines"},

	_initLines: function()
	{
		var NUM_LINES = 3;
		var MIN_VY = 30;
		var MAX_VY = 150;

		for (var i = 0; i < NUM_LINES; i++)
		{

			var y = rnd(0, HEIGHT);

			// line is a white rectangle with 1px height
			var line = Crafty.e("2D, Canvas, Color")
				.color("white")
				.attr(
				{
					w: WIDTH, h: 1, 
					x: 0, y: y, 
					_vy: rnd(MIN_VY, MAX_VY) // randomize speed
				});

			this.attach(line);
		}
	},

	// Move lines vertically with different speed from top to bottom of the screen
	_animateLines: function(e)
	{
		for (var i = 0; i < this._children.length; i++)
		{
			var line = this._children[i];
			line.y += line._vy / e.dt;

			if (line.y > HEIGHT) line.y = 0;
		}
	}

});

//-------------------------------------------------------------------------------
// Edge Animation
//-------------------------------------------------------------------------------
Crafty.c("EdgeAnimation",
{
	required: "2D, Canvas",

	init: function()
	{
		this._TILE_SIZE = 32;
		this._VY = 120;

		this._vy = this._VY;
		this._leftEdge = this._initEdge(0, "gfx/leftEdge.png"); // draw left edge
		this._rightEdge = this._initEdge(WIDTH - this._TILE_SIZE, "gfx/rightEdge.png"); // draw right edge
	},

	events: {"EnterFrame": "_onEnterFrame"},

	_onEnterFrame: function(e)
	{
		this._updateEdge(this._leftEdge, e.dt);
		this._updateEdge(this._rightEdge, e.dt);
	},

	_updateEdge: function(edge, dt)
	{
		edge.y += this._vy/ dt;

		if (edge.y > 0) edge.y = -this._TILE_SIZE; // reset edge position if it goes out of the bounds of the screen
	},

	// edge is an object with image component, image is displayed several times using repeat pattern
	_initEdge: function(x, path)
	{
		return Crafty.e("2D, Canvas, Image")
			.attr({x: x, y:-this._TILE_SIZE, w: this._TILE_SIZE, h: HEIGHT + this._TILE_SIZE})
			.image(path, "repeat");
	},

	setSpeed: function(speedMult)
	{
		this._vy = this._VY * speedMult;
	},
});