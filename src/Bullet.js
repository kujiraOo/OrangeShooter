//-------------------------------------------------------------------------------
// Bullet 
//-------------------------------------------------------------------------------
Crafty.c("Bullet",
{
	required: "2D, Canvas, Collision, Color",

	DEFAULT_SPEED: 80,

	init: function()
	{
		this.w = BULLET_HITBOX_W;
		this.h = BULLET_HITBOX_H;
		this.origin("Center"); // for rotation around the center 
	},

	events: 
	{
		"EnterFrame": "_onEnterFrame",
	},

	// on enter frame
	_onEnterFrame: function(e)
	{
		this._updatePosition(e.dt);
		this._checkBounds();
	},

	_updatePosition: function(dt)
	{
		this.x += this._vx / dt;
		this.y += this._vy / dt;
	},

	// destroy the bullet if it leaves the bounds of the screen
	_checkBounds: function()
	{
		if (this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT)
			this.destroy();
	},

	// rotate the bullet and change its velocity
	angle: function(angle)
	{
		//this.rotation = angle;
		this._vx = Math.cos(Crafty.math.degToRad(angle)) * this.DEFAULT_SPEED * this._speedMult;
		this._vy = Math.sin(Crafty.math.degToRad(angle)) * this.DEFAULT_SPEED * this._speedMult;

		this._a = angle;

		return this;
	},
});

Crafty.c("PlayerBullet", 
{
	required: "Bullet",

	SPEED: 200,

	PlayerBullet: function(x, y)
	{
		this.x = x;
		this.y = y;
		this._vx = 0;
		this._vy = -this.SPEED;
		this.color(PLAYER_COLOR_STR);
	}
});

Crafty.c("EnemyBullet", 
{
	required: "Bullet",

	EnemyBullet: function(x, y, speedMult)
	{
		this.x = x;
		this.y = y;

		//var speedMult = Crafty("GameManager")[0].speedMult;

		this._vx = 0;
		this._vy = this.DEFAULT_SPEED;
		this.color(ENEMY_COLOR_STR);

		this.setSpeed(speedMult);
		//this.updateSpeed(speedMult);

		return this;
	},

	setSpeed: function (speedMult) {

		this._speedMult = speedMult;

		if (this._a)
			this.angle(this._a);
		else
			this._vy = this.DEFAULT_SPEED * speedMult;
	},
});
