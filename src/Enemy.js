//-------------------------------------------------------------------------------
// Enemy
//-------------------------------------------------------------------------------
Crafty.c("Enemy",
{
	required: "2D, Canvas, Image, Collision, Delay",

	COLOR: [11, 123, 255, 1],
	SHOOTING_DELAY: 2500,
	NUM_MOVE_TYPES: 4,
	DEFAULT_SPEED: 40,

	MOVE_STRAFE: 1,
	MOVE_DIAGONAL: 2,
	MOVE_STRAFE_INTERVAL: 3,

	DEFAULT_STRAFE_SPEED: 80,
	STRAFE_INTERVAL_DELAY: 500,

	Enemy: function(x, y, speedMult)
	{
		this.x = x;
		this.y = y;
		this._moveType = Math.floor(this.NUM_MOVE_TYPES * Math.random());
		this._strafeAnchor = this.x; // for strafe movement

		this.setSpeed(speedMult);
		this._rndXDir(); // randomize x direction of movement
	},

	events: 
	{
		"EnterFrame": "_onEnterFrame",
	},

	_onEnterFrame: function(e)
	{
		this._updatePosition(e.dt);
		this._checkHit();
	},

	_updatePosition: function(dt)
	{
		this.y += this._vy / dt; // always moves downward

		// if has any different type of movement than simple downward movement then call corresponding function
		if (this._moveType == this.MOVE_STRAFE || this._moveType == this.MOVE_STRAFE_INTERVAL)
			this._strafe(dt);
		else if (this._moveType == this.MOVE_DIAGONAL)
			this._diagonal(dt);

		// destroy when reached the bottom edge
		if (this.y > HEIGHT)
			this.destroy();
	}, 

	// moves a short distance from side to side
	_strafe: function(dt)
	{
		this.x += this._vx / dt;

		if (this.x > this._strafeAnchor + ENEMY_STRAFE_DISTANCE - ENEMY_MAX_W)
		{
			this.x = this._strafeAnchor + ENEMY_STRAFE_DISTANCE - ENEMY_MAX_W; // keep inside the bounds
			this._strafeOnBounds(); // check if the right bound of the movement is reached
		}
		else if (this.x < this._strafeAnchor - ENEMY_STRAFE_DISTANCE)
		{
			this.x = this._strafeAnchor - ENEMY_STRAFE_DISTANCE; // keep inside the bounds
			this._strafeOnBounds(); // check if the left bound of the movement is reached
		}
	},

	_strafeOnBounds: function()
	{
		// in case of simple strafe just invert x velocity
		if (this._moveType == this.MOVE_STRAFE)
		{
			this._vx = -this._vx;
		}
		// in case of strafe with interval stop x movement for a moment
		else if (this._moveType == this.MOVE_STRAFE_INTERVAL)
		{
			this._intervalVx = this._vx; // keep previous x velocity
			this._vx = 0; // stop moving
			this.delay(this._strafeIntervalEnd, this._strafeIntervalDelay); // set timer to start moving again
		}
	},

	_strafeIntervalEnd: function()
	{
		this._vx = -this._intervalVx; // invert the velocity that it had before the interval
	},

	_diagonal: function(dt)
	{
		this.x += this._vx / dt;

		if (this.x > EDGE_RIGHT - this.w)
		{
			this.x = EDGE_RIGHT - this.w;
			this._vx = -this._vx;
		}
		else if (this.x < EDGE_LEFT)
		{
			this.x = EDGE_LEFT;
			this._vx = -this._vx;
		}
	},

	_checkHit: function()
	{
		var bullets = this.hit("PlayerBullet");

		if (bullets) {

			bullets[0].obj.destroy();

			this._hp--;

			// visual effect
			this._hitEffect();

			// sound effect
			Crafty.audio.play("hit", 1, 0.5);

			this._checkDeath();
		}
	},

	// if hp reaches 0 destroy, update score, update player's ability gauge
	_checkDeath: function()
	{
		if (this._hp <= 0)
		{
			this.kill();
		}
	},

	_explosionEffect: function()
	{
		explosionEffect(this.x + 0.5*this.w, this.y + 0.5*this.h, this.COLOR);
	},

	// rnd inital x direction
	_rndXDir: function()
	{
		if (Math.random() > 0.5)
			this._vx = -this._vx;
	},

	_setShootingDelay: function(speedMult)
	{
		this.cancelDelay(this._shoot);
		this.delay(this._shoot, this.SHOOTING_DELAY / speedMult, -1);
	}, 

	_setMoveSpeed: function(speedMult)
	{
		this._vy = this.DEFAULT_SPEED * speedMult;

		if (this._moveType == this.MOVE_STRAFE || this._moveType == this.MOVE_STRAFE_INTERVAL)
		{
			if (this._vx)
				// get sign of current x velocity to avoid change of direction when setting new speed
				this._vx = this._vx / Math.abs(this._vx) * this.DEFAULT_STRAFE_SPEED * speedMult;
			else
				this._vx = this.DEFAULT_STRAFE_SPEED * speedMult;

			// get the sign of saved interval vx and set its value with new multiplier
			// to avoid unexcpected change of direction and speed after the enemy starts
			// moving horizontally again
			if (this._intervalVx)
				this._intervalVx = this._intervalVx / Math.abs(this._intervalVx) * this.DEFAULT_STRAFE_SPEED * speedMult;

			this._strafeIntervalDelay = this.STRAFE_INTERVAL_DELAY / speedMult;
		}
		else if (this._moveType == this.MOVE_DIAGONAL)
		{	
			// get sign of current speed to avoid change of direction when setting new speed
			if (this._vx)
				this._vx = this._vx / Math.abs(this._vx) * this.DEFAULT_SPEED * speedMult;
			else
				this._vx = this.DEFAULT_SPEED * speedMult;
		}
	},

	// create hit image for hit animation
	_initHitImg: function(imgPath)
	{
		this._hitImg = Crafty.e("2D, Canvas, Image, Tween")
			.image(imgPath)
			.attr({x: this.x, y: this.y, alpha:0});

		this.attach(this._hitImg);
	},

	_hitEffect: function()
	{
		this._hitImg.alpha = 1;
		this._hitImg.tween({alpha: 0.0}, 100);
	},

	// Update enemy's speed
	setSpeed: function(speedMult)
	{
		this._speedMult = speedMult;
		this._setMoveSpeed(speedMult);
		this._setShootingDelay(speedMult);
	},

	// count points, show explosion effect, destroy the object
	kill: function()
	{
		// visual effect
		this._explosionEffect();

		// sound effect
		Crafty.audio.play("enemyExplosion", 1, 0.5);

		// if player still exists update ability gauge
		var player = Crafty("Player").get();
		if (player.length != 0)
			player[0].updateAbilityGauge(this._ap);

		Crafty("GameManager").updateScore(this.score);
		this.destroy();
	},

});

//-------------------------------------------------------------------------------
// OneShooter
//-------------------------------------------------------------------------------
Crafty.c("OneShooter",
{
	required: "Enemy",

	HP: 3,
	AP: 3,
	SCORE_MULT: 100,

	OneShooter: function(x, y, speedMult)
	{
		this.Enemy(x, y, speedMult);

		this.image("gfx/oneShooter.png");
		this._initHitImg("gfx/oneShooterHit.png");
		this._hp = this.HP;
		this._ap = this.AP;
		this.score = this.SCORE_MULT * this.HP;

		return this;
	},

	_shoot: function()
	{
		var x = this.x + 0.5 * (this.w - BULLET_HITBOX_W);
		var y = this.y + this.h;

		Crafty.e("EnemyBullet").EnemyBullet(x, y, this._speedMult);
	},
});


//-------------------------------------------------------------------------------
// BurstShooter
//-------------------------------------------------------------------------------
Crafty.c("BurstShooter",
{
	required: "Enemy",

	HP: 5,
	AP: 6,
	SCORE_MULT: 100,
	NUM_SHOTS: 10,
	SHOTS_DELAY: 150,

	BurstShooter: function(x, y, speedMult)
	{
		this.Enemy(x, y, speedMult); // call super constructor

		this.image("gfx/burstShooter.png");
		this._initHitImg("gfx/burstShooterHit.png");
		this._hp = this.HP;
		this._ap = this.AP;
		this.score = this.SCORE_MULT * this.HP;

		this._nShots = 0; // holds number of bullets emited by this entity in current burst

		// override set speed method
		this.setSpeed = function(speedMult)
		{
			this._speedMult = speedMult;
			this._setMoveSpeed(speedMult);
			this._setShootingDelay(speedMult);
			this._updateShotsDelay();
		}


		return this;
	},

	_shoot: function()
	{
		this.delay(this._oneShot, this.SHOTS_DELAY / this._speedMult, this.NUM_SHOTS - this._nShots,
			function()
			{
				this._nShots = 0;
			});

	},

	_oneShot: function()
	{
		var x = this.x + 0.5 * (this.w - BULLET_HITBOX_W);
		var y = this.y + this.h;

		Crafty.e("EnemyBullet").EnemyBullet(x, y, this._speedMult);

		this._nShots++;
	},

	_updateShotsDelay: function()
	{
		this.cancelDelay(this._oneShot);
		this._shoot();
	},

});

//-------------------------------------------------------------------------------
// SpreadShooter
//-------------------------------------------------------------------------------
Crafty.c("SpreadShooter",
{
	required: "Enemy",

	HP: 7,
	AP: 9,
	SCORE_MULT: 100,
	N_BULLETS: 5,

	SpreadShooter: function(x, y, speedMult)
	{
		this.Enemy(x, y, speedMult); // call super constructor

		this.image("gfx/spreadShooter.png");
		this._initHitImg("gfx/spreadShooterHit.png");
		this._hp = this.HP;
		this._ap = this.AP;
		this.score = this.SCORE_MULT * this.HP;

		return this;
	},

	_shoot: function()
	{
		var SPREAD_ANGLE = 45
		var INITIAL_ANGLE = 0.5 * (180 - SPREAD_ANGLE); 

		var x = this.x + 0.5 * (this.w - BULLET_HITBOX_W);
		var y = this.y + this.h;
		var angleStep = SPREAD_ANGLE / (this.N_BULLETS - 1);

		for (var i = 0; i < this.N_BULLETS; i++)
		{
			var a = INITIAL_ANGLE + angleStep * i;
			Crafty.e("EnemyBullet").EnemyBullet(x, y, this._speedMult).angle(a);
		}
	},
});

//-------------------------------------------------------------------------------
// ArcShooter
//-------------------------------------------------------------------------------
Crafty.c("ArcShooter",
{
	required: "Enemy",

	HP: 10,
	AP: 15,
	SCORE_MULT: 100,
	ARC_R: 150,
	ARC_A: 90,

	ArcShooter: function(x, y, speedMult)
	{
		this.Enemy(x, y, speedMult); // call super constructor

		this.image("gfx/arcShooter.png");
		this._initHitImg("gfx/arcShooterHit.png");
		this._hp = this.HP;
		this._ap = this.AP;
		this.score = this.HP * this.SCORE_MULT;

		return this;
	},

	_shoot: function()
	{
		// length of the chord divided bu bullet width
		var nBullets = Math.floor(this.ARC_R * Math.cos(0.5 * Crafty.math.degToRad(this.ARC_A)) / BULLET_HITBOX_W);

		var initAngle = 0.5 * (180 - this.ARC_A);
		var angleStep = this.ARC_A / (nBullets - 1);

		var centerX = this.x + 0.5 * (this.w - BULLET_HITBOX_W);
		var centerY = this.y + this.h - this.ARC_R;

		// arrange buttons in arc shape 
		for (var i = 0; i < nBullets; i++)
		{
			var a = Crafty.math.degToRad(initAngle + i * angleStep);
			var x = Math.cos(a) * this.ARC_R + centerX;
			var y = Math.sin(a) * this.ARC_R + centerY;

			Crafty.e("EnemyBullet").EnemyBullet(x, y, this._speedMult);
		}
	},
});