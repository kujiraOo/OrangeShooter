//-------------------------------------------------------------------------------
// Init crafty engine
// Load sounds and saved game data
// Register game scenes
// Go to main menu scene
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// If no data recorded then set default values 
//-------------------------------------------------------------------------------
function initCraftyStorage()
{
	Crafty.storage("mute", Crafty.storage("mute") || false);

	Crafty.storage("highScores", Crafty.storage("highScores") || 
	[
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
		{name: "AAA", score: 0},
	]);

	if (Crafty.storage("mute"))
		Crafty.audio.mute(); // mute all sounds if game was muted on previous session
}

//-------------------------------------------------------------------------------
function loadSounds()
{
	Crafty.audio.add({
		explosion: ["sound/explosion.wav",
					"sound/explosion.mp3",
					"sound/explosion.ogg"],

		enemyExplosion: ["sound/enemyexplosion.wav",
					"sound/enemyexplosion.mp3",
					"sound/enemyexplosion.ogg"],

		hit: ["sound/hit.wav",
			"sound/hit.mp3",
			"sound/hit.ogg"],

		shot: ["sound/shot.wav",
			"sound/shot.mp3",
			"sound/shot.ogg"],

		bulletTime: ["sound/bullettime.wav",
				"sound/bullettime.mp3",
				"sound/bullettime.ogg"],

		bulletTimeEnd: ["sound/bullettimeend.wav",
				"sound/bullettimeend.mp3",
				"sound/bullettimeend.ogg"],

		superShield: ["sound/supershield.wav",
				"sound/supershield.mp3",
				"sound/supershield.ogg"],

		gaugeFull: ["sound/gaugefull.wav",
				"sound/gaugefull.mp3",
				"sound/gaugefull.ogg"],

		intro: ["sound/intro.mp3",
				"sound/intro.ogg"],

		game: ["sound/game.mp3",
			"sound/game.ogg"],

		gameover: ["sound/gameover.mp3",
			"sound/gameover.ogg"],
	});
}

//-------------------------------------------------------------------------------
function initGame()
{
	Crafty.init(WIDTH,HEIGHT, document.getElementById('game')); // init crafty

	initCraftyStorage(); // get saved data

	loadSounds(); // load sound effects and music

  Crafty.audio.mute();
	Crafty.audio.setChannels(99); // make sure that all sounds are played

	// Register game scenes, function definitions are in gameScene.js file
	Crafty.defineScene("MainMenu", initMainMenuScene, uninitMainMenuScene);
	Crafty.defineScene("Game", initGameScene, uninitGameScene);
	Crafty.defineScene("GameOver", initGameOverScene, uninitGameOverScene);

	Crafty.enterScene("MainMenu");
}

initGame();