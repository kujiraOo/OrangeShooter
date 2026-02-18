//-------------------------------------------------------------------------------
// Player 
//-------------------------------------------------------------------------------
Crafty.c("Player",
{
	required: "2D, Canvas, Image, Collision, Fourway, Keyboard, Delay",

	COLOR: [255, 88, 23, 1],
	LIVES: 3,
	W: 34,
	H: 74,
	SPAWN_X: 0.5 * WIDTH,
	SPAWN_Y: 500,

	SPEED: 370,
	HITBOX_SIZE: 20,

	SHIELD_DUR: 5000,
	BULLET_TIME_DUR: 5000,
	INVINCIBILITY_DUR: 2000,

	SHOOTING_DELAY: 80,
	GAUGE_FULL: 100,

	BULLET_TIME_AP_COST: 33,
	SUPER_SHIELD_AP_COST: 66,
	BIG_BANG_AP_COST: 100,

	init: function()
	{
		var INV_ANIM_SPEED = -0.07; // invicibility animation speed

		this._lives = this.LIVES;
		this._abilityGauge = 0;
		this.x = this.SPAWN_X;
		this.y = this.SPAWN_Y;
		this.image("gfx/player.png"); // set picture
		this.fourway(this.SPEED); // set movement speed

		this._invAnimSpeed = INV_ANIM_SPEED; // speed for invincibility animation

		this._invincible = false;
		this._isShooting = false;
		this._superShieldActive = false;
		this._bulletTimeActive = false;
		this._apFull = false;

		this._initHitBox();
	},

	events: 
	{
		"Moved": "_checkBounds",
		"EnterFrame": "_onEnterFrame",
		"KeyDown": "_onKeyDown",
		"KeyUp": "_onKeyUp",
	},

	//Doesn't let the player leave the bounds of the screen
	_checkBounds: function()
	{
		if (this.x < EDGE_LEFT)
			this.x = EDGE_LEFT;
		else if (this.x > EDGE_RIGHT - this.W)
			this.x = EDGE_RIGHT - this.W;

		if (this.y < 0)
			this.y = 0;
		else if (this.y > EDGE_BOTTOM - this.H)
			this.y = EDGE_BOTTOM - this.H;
	},

	_onEnterFrame: function()
	{
		this._invincibilityAnimation();
		this._checkHit();
	},

	// player flashes while invincible
	_invincibilityAnimation: function() 
	{
		if (this._invincible)
		{
			// if alpha reaches its upper or lower limit reverse a_speed
			if (this.alpha < 0.3 || this.alpha > 1)
				this._invAnimSpeed = -this._invAnimSpeed;

			this.alpha = this.alpha + this._invAnimSpeed; // update alpha
		}
	},

	// check hit with bullet or enemy
	_checkHit: function()
	{
		// get all bullets and enemies that hit player
		var bullets = this.hit("EnemyBullet");
		var enemies = this.hit("Enemy");

		// if some bullets hit player destoy them
		if ((bullets || enemies) && !this._invincible)
		{
			// destroy all bullets that hit player
			for (var i = 0; i < bullets.length; i++)
			{
				bullets[i].obj.destroy();
			}

			// destroy all enemies that hit player
			for (var i = 0; i < enemies.length; i++)
			{
				enemies[i].obj.kill();
			}

			this.updateLives(-1);

			// visual effect
			this._explosionEffect();

			//sound effect
			Crafty.audio.play("explosion", 1, 0.5);

			if (this._lives < 0)
			{
				this.destroy();
				Crafty("GameManager").gameOver(); 
			}
			else
			{
				this._respawn();
			}
		}
	},

	_explosionEffect: function()
	{
 		explosionEffect(this.x + 0.5 * this.w, this.y + 0.5 * this.h, this.COLOR);
	},

	// move player to initial position and toggle invincibility
	_respawn: function()
	{
		this.x = this.SPAWN_X;
		this.y = this.SPAWN_Y;

		// make invincible for a short time
		this._toggleInvincibility(true);
	},

	// conroller 
	// spacebar - shoot
	// 1 - bullet time
	// 2 - super shield
	// 3 - bing bang
	_onKeyDown: function()
	{

		if (!Crafty.isPaused())
		{
			if (this.isDown("SPACE"))
				this._toggleShooting(true);

			if (this.isDown("1"))
				this._activateBulletTime();

			if (this.isDown("2"))
				this._activateSuperShield();

			if (this.isDown("3"))
				this._bigBang();
		}
	},

	// slow down all enemies and bullets
	_activateBulletTime: function()
	{
		if (!this._bulletTimeActive && this._abilityGauge == this.GAUGE_FULL)
		{
			// sound effect
			Crafty.audio.play("bulletTime");

			this._bulletTimeActive = true;
			
			this._resetAbilityGauge(this.BULLET_TIME_AP_COST);

			Crafty("GameManager").toggleBulletTime(true);

			// set timer for disabling bullet time
			this.delay(this._disableBulletTime, this.BULLET_TIME_DUR);
		}
	},

	// disable bullet time
	_disableBulletTime: function()
	{
		if (this._bulletTimeActive)
		{
			// sound effect
			Crafty.audio.play("bulletTimeEnd");

			this._bulletTimeActive = false;

			Crafty("GameManager").toggleBulletTime(false);
		}
	},

	// make player invincible for a period of time
	_activateSuperShield: function()
	{
		if (!this._superShieldActive && this._abilityGauge == this.GAUGE_FULL)
		{
			// sound effect
			Crafty.audio.play("superShield");

			this._superShieldActive = true;
			
			this._resetAbilityGauge(this.SUPER_SHIELD_AP_COST);

			var x = this.x + 0.5 * (this.w - SUPER_SHIELD_SIZE);
			var y = this.y + 0.5 * (this.h - SUPER_SHIELD_SIZE);

			this._superShield = Crafty.e("SuperShield").SuperShield(x, y);
			this.attach(this._superShield);

			// set timer for disabling super shield 
			this.delay(this._disableSuperShield, this.SHIELD_DUR);
		}
	},

	// disable super shield
	_disableSuperShield: function()
	{
		if (this._superShieldActive)
		{
			this._superShieldActive = false;

			this._superShield.destroy();
		}
	},

	// destoy all enemies and enemy bullets on the screen
	_bigBang: function()
	{
		if (this._abilityGauge == this.GAUGE_FULL)
		{
			this._resetAbilityGauge(this.BIG_BANG_AP_COST);

			Crafty("Enemy").each(function() 
			{
				Crafty("GameManager").updateScore(this.score);
				this.kill();
			});

			Crafty("EnemyBullet").each(function() 
			{
				this.destroy();
			});
		}
	},

	// reset ability gauge and stop ability icon frames animation
	_resetAbilityGauge: function(apCost)
	{
		var hud = Crafty("HUD");

		this._abilityGauge -= apCost;
		this._apFull = false;
		hud.toggleIconFramesAnimation(false);
		hud.updateAbilityGauge(this._abilityGauge);
	},

	_onKeyUp: function()
	{
		//if spacebar is released the stop shooting
		if (!this.isDown("SPACE"))
		{
			this._toggleShooting(false);
		}
	},

	// toggle shooting
	_toggleShooting: function(toShoot)
	{
		// Start shooting if not shooting already and is told to shoot
		if (toShoot && !this._isShooting)
		{
			this._isShooting = true;
			this._shoot();
			this.delay(this._shoot, this.SHOOTING_DELAY, -1)
		}

		// Stop shooting if shooting right now and is told to stop
		else if(!toShoot && this._isShooting)
		{
			this._isShooting = false;
			this.cancelDelay(this._shoot);
		}
	},

	//Player's hitbox is a small square positioned in the center of the player's image
	_initHitBox: function()
	{
		var X1 = 0.5 * (this.W - this.HITBOX_SIZE);
		var X2 = X1 + this.HITBOX_SIZE;
		var Y1 = 0.5 * (this.H - this.HITBOX_SIZE);
		var Y2 = Y1 + this.HITBOX_SIZE;

		this.collision(new Crafty.polygon([X1, Y1, X2, Y1, X2, Y2, X1, Y2]));
	},

	// shoot one time
	_shoot: function()
	{
		Crafty.e("PlayerBullet")
			.PlayerBullet(this.x + 0.5 * (this.W - BULLET_HITBOX_W), this.y);

		// sound effect
		//Crafty.audio.play("shot");
	},

	// Toggles player's invincibility
	_toggleInvincibility: function()
	{
		this._invincible = !this._invincible;
		this.alpha = 1; //reset alpha

		if (this._invincible)
			this.delay(this._toggleInvincibility, this.INVINCIBILITY_DUR);
	},

	updateAbilityGauge: function(ap)
	{
		if (!this._apFull)
		{
			var hud = Crafty("HUD");
			this._abilityGauge += ap;

			if (this._abilityGauge >= this.GAUGE_FULL)
			{
				this._abilityGauge = this.GAUGE_FULL;
				this._apFull = true;
				hud.toggleIconFramesAnimation(true);
				Crafty.audio.play("gaugeFull");
			}

			hud.updateAbilityGauge(this._abilityGauge);
		}
	},

	updateLives: function(lives)
	{
		this._lives += lives; // decrease number of lives
		Crafty("HUD").setLives(this._lives);
	},

	getAp: function()
	{
		return this._abilityGauge;
	}
});
