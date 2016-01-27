//-------------------------------------------------------------------------------
// Game Manager
//-------------------------------------------------------------------------------
Crafty.c("GameManager",
{
	required: "Delay, Keyboard",

	LIFE_SCORE: 100000,

	SPEED_TIMER_DELAY: 20000,

	DEFAULT_ENEMY_SPAWN_DELAY: 1000,
	MIN_ENEMY_SPAWN_DELAY: 200,
	SPAWN_DELAY_STEP: 100,

	MAX_SPEED_MULT: 3,
	SPEED_MULT_STEP: 0.1,

	BULLET_TIME_SPEED_MULT: 0.1,

	ENEMY_SPAWN_Y: -50,

	BGM_DELAY: 5000,

	// chance of spawning different enemy types
	CHANCE_ONE_SHOOTER: 0.4, // 60%
	CHANCE_BURST_SHOOTER: 0.15, // 25%
	CHANCE_SPREAD_SHOOTER: 0.05, // 10%

	init: function()
	{
		this._speedMult = 1;
		this._enemySpawnDelay = this.DEFAULT_ENEMY_SPAWN_DELAY; // rate at which enemies are spawned in ms
		this._score = 0;
		this._lifeScore = 0; // every 1000000 player gains a life
		this._bulletTimeActive = false;

		// init timer to increase speed mult of the game and spawn rate of enemies
		this.delay(this._increaseSpeed, this.SPEED_TIMER_DELAY, -1); 
		this.delay(this._spawnEnemy, this._enemySpawnDelay, -1); // init spawn timer

		this._muteHint = newMuteHint(0.5 * HEIGHT);
		this._muteHint.visible = false;

		// bgm timer
		this.delay(this._checkBgm, this.BGM_DELAY, -1);
	},

	events: {"KeyDown": "_onKeyDown"},

	_onKeyDown: function()
	{
		if (this.isDown("ESC"))
		{
			if (!Crafty.isPaused())
			{
				// show mute hint
				this._muteHint.visible = true;

				// use delay so some frames will be drawn before crafty is paused
				//and the hint will appear on the screen
				Crafty.e("Delay")
					.delay(function() {Crafty.pause();}, 1);
			}
			else
			{
				// hide mute hint
				this._muteHint.visible = false;
				Crafty.pause();
			}
		}
	},

	_spawnEnemy: function()
	{
		// Make sure that enemy doesn't leave the bounds of the screen while strafing
		var x = ENEMY_STRAFE_DISTANCE + EDGE_LEFT + Math.floor(Math.random() * (EDGE_RIGHT - 2 * ENEMY_STRAFE_DISTANCE - ENEMY_MAX_W - EDGE_LEFT));
		var y = this.ENEMY_SPAWN_Y; // spawn above the top edge of the screen

		// Randomize enemy type
		var dice = Math.random();

		if (dice >= this.CHANCE_ONE_SHOOTER)
			Crafty.e("OneShooter").OneShooter(x, y, this._speedMult);
		else if (dice >= this.CHANCE_BURST_SHOOTER)
			Crafty.e("BurstShooter").BurstShooter(x, y, this._speedMult);
		else if (dice >= this.CHANCE_SPREAD_SHOOTER)
			Crafty.e("SpreadShooter").SpreadShooter(x, y, this._speedMult);
		else
			Crafty.e("ArcShooter").ArcShooter(x, y, this._speedMult);

		// debug info
		// console.log("enemies: " + Crafty("Enemy").get().length);
		// console.log("enemy bullets " + Crafty("EnemyBullet").get().length);
		// console.log("player bullets " + Crafty("PlayerBullet").get().length);
		// console.log("particle systems: " + Crafty("Particles").get().length);
		// console.log("images: " + Crafty("Image").get().length);

		console.log("bgm is playing: " + Crafty.audio.isPlaying("game"));
	},

	_increaseSpeed: function () 
	{
		if (!this._bulletTimeActive)
		{
			// if maximum value of the mult not reached then increase the multiplier
			if (this._speedMult < this.MAX_SPEED_MULT)
			{
				this._speedMult += this.SPEED_MULT_STEP;
			}

			// if minimum value of the enemy spawn delay is not reached then decrease delay
			if (this._enemySpawnDelay > this.MIN_ENEMY_SPAWN_DELAY)
			{
				this._enemySpawnDelay -= this.SPAWN_DELAY_STEP;
				this._updateSpawnDelay(this._enemySpawnDelay);
			}
		}
	},

	_checkBgm: function()
	{
		if (!Crafty.audio.isPlaying("game"))
		{
			Crafty.audio.play("game");
		}
	},

	// update rate of enemy spawn
	_updateSpawnDelay: function(delay)
	{
		// reset enemy spawn timer with new delay
		this.cancelDelay(this._spawnEnemy);
		this.delay(this._spawnEnemy, delay, -1);
	},

	_setEnemiesSpeed: function(speedMult)
	{
		Crafty("Enemy").each(function () 
		{
			this.setSpeed(speedMult);
		});
	},

	_setEnemyBulletsSpeed: function(speedMult)
	{
		Crafty("EnemyBullet").each(function () 
		{
			this.setSpeed(speedMult);
		});
	},

	toggleBulletTime: function(flag)
	{	
		var spawnDelay;

		if (flag)
		{	
			this._lastSpeedMult = this._speedMult; // save current speed mult
			this._speedMult = this.BULLET_TIME_SPEED_MULT; 

			spawnDelay = this._enemySpawnDelay / this.BULLET_TIME_SPEED_MULT;

			// show video effect
			this._bulletTimeEffect = Crafty.e("BulletTimeEffect");

			Crafty("EdgeAnimation").setSpeed(this.BULLET_TIME_SPEED_MULT);
		}
		else
		{
			this._speedMult = this._lastSpeedMult;
			spawnDelay = this._enemySpawnDelay;

			// disable video effect
			this._bulletTimeEffect.destroy();

			Crafty("EdgeAnimation").setSpeed(1);
		}

		this._bulletTimeActive = flag;
		this._setEnemiesSpeed(this._speedMult);
		this._setEnemyBulletsSpeed(this._speedMult);
		this._updateSpawnDelay(spawnDelay);
	},

	toggleMuteHint: function()
	{
		this._muteHint.visible = !this._muteHint.visible;
	},

	updateScore: function(score)
	{
		this._score += score;
		Crafty("HUD").setScore(this._score);

		this._lifeScore += score;
		if (this._lifeScore >= this.LIFE_SCORE)
		{
			Crafty("Player").updateLives(1);
			this._lifeScore -= this.LIFE_SCORE;
		}
	},

	gameOver: function()
	{
		this.delay(function ()
		{
			Crafty.enterScene("GameOver", this._score);
		}, 3000);
	}

});