//-------------------------------------------------------------------------------
// Provides player with protection agains enemy bullets and enemies
// Enemies and bullets are destroyed on collision
//-------------------------------------------------------------------------------
Crafty.c("SuperShield",
{
	required: "2D, Canvas, Image, Collision",

	SuperShield: function(x, y)
	{
		this.origin("Center");
		this.image("gfx/superShield.png");
		this.x = x;
		this.y = y;

		this._initHitBox();

		console.log(this);

		return this;
	},

	events: {"EnterFrame": "_onEnterFrame"},

	_onEnterFrame: function()
	{
		this._checkEnemiesHit();
		this._checkEnemyBulletsHit();
	},

	// destroy all enemies that hit the shield
	_checkEnemiesHit: function()
	{
		var enemies = this.hit("Enemy");

		if (enemies)
		{
			for (var i = 0; i < enemies.length; i++)
			{	
				enemies[i].obj.kill();
			}
		}
	},

	// destroy all bullets that hit the shield
	_checkEnemyBulletsHit: function()
	{
		var bullets = this.hit("EnemyBullet");

		if (bullets){
			for (var i = 0; i < bullets.length; i++)
			{	
				bullets[i].obj.destroy();
			}
		}
	},

	_initHitBox: function()
	{
		var N_POINTS = 10;

		var CX = 0.5 * SUPER_SHIELD_SIZE;
		var CY = 0.5 * SUPER_SHIELD_SIZE;
		console.log(CX);
		var r = 0.5 * SUPER_SHIELD_SIZE;
		var aStep = 2 * Math.PI / N_POINTS;

		var circle = [];

		// create circle like polygon
		for (var i = 0; i < N_POINTS; i++)
		{
			var x = Math.cos(aStep * i) * r + CX;
			var y = Math.sin(aStep * i) * r + CY;

			circle[2 * i] = x;
			circle[2 * i + 1] = y;
		}

		this.collision(new Crafty.polygon(circle));
	},
});