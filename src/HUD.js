//-------------------------------------------------------------------------------
// Displays information about player state
// amount of points, lives remaining, charge of the ability gauge, 
// if the abilities are readye to be used
// also displays a hint how to pause the game
//-------------------------------------------------------------------------------

Crafty.c("HUD", 
{
	required: "Delay",

	AG_W_MULT: 1.5, // proportion between width of the ability gauge in px and quantity of player's ap

	init: function()
	{
		this._animateIconFrames = false;
		this._initAbilitySection();

		this._initGauge();
		this._initScore();
		this._initLives();
		this._initPauseText();
	},

	events: {"EnterFrame": "_onEnterFrame"},

	_onEnterFrame: function()
	{
		this._iconFramesAnimation();
	},

	// rotate ability icons' frames
	_iconFramesAnimation: function()
	{
		if (this._animateIconFrames)
		{
			for (var i = 0; i < this._iconFrames.length; i++)
			{
				this._iconFrames[i].rotation++;
			}
		}
	},

	_initAbilitySection: function()
	{
		var ICON_Y = HEIGHT - 42;

		// Bullet time icon
		Crafty.e("2D, Canvas, Image")
			.image(BULLET_TIME_ICON)
			.attr({x: WIDTH / 8, y: ICON_Y, z: 1});

		// Super shield icon
		Crafty.e("2D, Canvas, Image")
			.image(SUPER_SHIELD_ICON)
			.attr({x: 2 * WIDTH / 8, y: ICON_Y, z: 1});

		// Big bang icon
		Crafty.e("2D, Canvas, Image")
			.image(BIG_BANG_ICON)
			.attr({x: 3 * WIDTH / 8, y: ICON_Y, z: 1});

		this._iconFrames = [];

		var i = 0;

		// must use delay instead of for loop to create entities
		// from the same image, because for some reason Crafty 
		// draws only one image if there is no delay between
		// drawing calls
		this.delay(function ()
		{
			this._iconFrames[i] = Crafty.e("2D, Canvas, Image");

			this._iconFrames[i].x = (i + 1) * WIDTH / 8;
			this._iconFrames[i].y = ICON_Y;
			this._iconFrames[i].w = 32;
			this._iconFrames[i].h = 32;
			this._iconFrames[i].z = 1;

			this._iconFrames[i].image("gfx/iconFrame.png");
			this._iconFrames[i].origin("Center");

			i++;

		}, 100, 2);

	},

	// displays how much ability pouints player has
	_initGauge: function()
	{
		var H = 15;
		var X = 0.5 * WIDTH;
		var Y = HEIGHT - 30;

		Crafty.e("2D, Canvas, Color") // left "limiter" of the gauge
			.attr(
				{
					x: X, 
					y: Y,
					w: 3,
					h: H,
					z: 1,
				})
			.color(PLAYER_COLOR_STR);

		this._abilityGauge = Crafty.e("2D, Canvas, Color") // gauge itself
			.attr(
				{
					x: X, 
					y: Y, 
					w: this.AG_W_MULT * Crafty("Player").getAp(), // depends on current player ap
					h: H,
					z: 1,
				})
			.color(PLAYER_COLOR_STR);

		Crafty.e("2D, Canvas, Color") // right "limiter of the gauge"
			.attr(
				{
					x: X + this.AG_W_MULT * 100, 
					y: Y,
					w: 3,
					h: H,
					z: 1,
				})
			.color(PLAYER_COLOR_STR);
	},

	// displays current player's score
	_initScore: function()
	{
		this._scoreText = Crafty.e("2D, Canvas, Text")
			.textColor(PLAYER_COLOR_STR)
			.textFont({family: FONT_FAMILY, size: MENU_WINDOW_LABEL_FONT_SIZE})
			.text("0");

		this._scoreText.x = 0.5*(WIDTH - this._scoreText.w);
		this._scoreText.z = 1;
	},

	// displays number of remaning player's lives
	_initLives: function()
	{
		var OFFSET = 50;

		this._livesText = Crafty.e("2D, Canvas, Text")
			.textColor(PLAYER_COLOR_STR)
			.textFont({family: FONT_FAMILY, size: MENU_WINDOW_LABEL_FONT_SIZE})
			.text("LIVES: 3");

		this._livesText.x = WIDTH - this._livesText.w - OFFSET;
		this._livesText.z = 1;
	},

	// pause hint, press esc to pause the game
	_initPauseText: function()
	{
		var OFFSET = 50;

		Crafty.e("2D, Canvas, Text")
			.textColor(PLAYER_COLOR_STR)
			.textFont({family: FONT_FAMILY, size: MENU_WINDOW_LABEL_FONT_SIZE})
			.text("ESC:PAUSE")
			.attr({x: OFFSET, z: 1});
	},

	// updates the size of the gauge
	updateAbilityGauge: function(ap)
	{
		this._abilityGauge.w = this.AG_W_MULT * ap;
	},

	// updates player's score shown on the screen
	setScore: function(score)
	{
		this._scoreText.text(score);
		this._scoreText.w = 0.5 * (WIDTH - this._scoreText.w);
	},

	// updates the amount of lives shown on the screen
	setLives: function(lives)
	{
		if (lives >= 0 )
			this._livesText.text("LIVES: "+lives);
	},

	// turn on or off animation of the frames around the ability icons
	toggleIconFramesAnimation: function(flag)
	{
		this._animateIconFrames = flag;
	},
});
