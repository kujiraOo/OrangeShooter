//-------------------------------------------------------------------------------
// GAME SCENE
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
function initGameScene()
{
	Crafty.audio.play("game"); // play bgm
	Crafty.e("GameManager"); // create game manager
	Crafty.e("Player"); // spawn new player
	Crafty.e("EdgeAnimation"); // add animation on edges of the screen
	Crafty.e("HUD"); // create player's hud
}

//-------------------------------------------------------------------------------
function uninitGameScene()
{
	Crafty.audio.stop("game"); // stop bgm

	// destroy objects that don't have 2D component
	Crafty("GameManager").destroy();
	Crafty("HUD").destroy(); 
}
