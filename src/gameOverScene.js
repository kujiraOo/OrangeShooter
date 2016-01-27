//-------------------------------------------------------------------------------
// GAME OVER SCENE
//-------------------------------------------------------------------------------

var GAME_OVER_OK_BUTTON_Y = 400;
var GAME_OVER_RESTART_BUTTON_Y = 370;
var GAME_OVER_MAIN_MENU_BUTTON_Y = 450;
var GAME_OVER_OK_BUTTON_Y = 300;
var GAME_OVER_INPUT_FIELD_Y = 200;

//-------------------------------------------------------------------------------
function initGameOverScene(score)
{
	Crafty.audio.play("gameover", -1); // game over bgm
	checkScore(score);	// check if player score is new high score
	newMuteHint(EDGE_BOTTOM); // show toggle sound hint on the bottom of the screen
}

//-------------------------------------------------------------------------------
function uninitGameOverScene()
{
	Crafty.audio.stop("gameover"); // stop game over bgm
}


//-------------------------------------------------------------------------------
// Check if the score is higher than top 10 scores
//-------------------------------------------------------------------------------
function checkScore(score) 
{
	var scores = Crafty.storage("highScores");

	for (var i = 0; i < scores.length; i++)
	{
		// If player's score is higher than at least one score from the scores' array
		// then ask for player's name and break the loop
		if (score > scores[i].score)
		{
			askPlayerName(i, score);
			return;
		}
	}

	newGameOverWindow(); // If player score is to low to be a new high score just show game over window
}

//-------------------------------------------------------------------------------
// Display input text field and button to save the score
//-------------------------------------------------------------------------------
function askPlayerName(index, score)
{
	// display game over text
	var gameOverText = Crafty.e("2D, Canvas, Text")
			.text("game over")
			.textFont({family: FONT_FAMILY, size:FONT_SIZE})
			.textColor(ENEMY_COLOR_STR);
	gameOverText.x = 0.5 * (WIDTH - gameOverText.w);
	gameOverText.y = 150;

	// Create html input field to allow player type his/her name in
	var inputField = Crafty.e("HTML")
	   .attr({w:200, h:200})
	   .append('<p style="color:'+ENEMY_COLOR_STR+';font-family:'+FONT_FAMILY+';text-align:center">'+
	   			"enter name:<input id=\"nameInput\" type=\"text\" autofocus></input>");
	inputField.x = 0.5 * (WIDTH - inputField.w);
	inputField.y = GAME_OVER_INPUT_FIELD_Y;

	// ok button
	var okButton = Crafty.e("LabelButton")
		.label(" ok ")
		.bind("Click", function () 
		{
			// get value from input field, name must be 3 character long
			// leave only three first characters and make them uppercase
			var name = document.getElementById("nameInput").value.slice(0, 3).toUpperCase();
			// if name is shorter add underscores so it will be 3 characters long
			for (var i = name.length; i < 3; i++)
				name += "_";

			saveScore(index, score, name);

			// remove all entities associated with asking for player's name
			this.destroy();
			gameOverText.destroy();
			inputField.destroy();

			// display game over window
			newGameOverWindow();
		});

	okButton.x = 0.5 * (WIDTH - okButton.w);
	okButton.y = GAME_OVER_OK_BUTTON_Y;
}

//-------------------------------------------------------------------------------
// Save score to Crafty storage
//-------------------------------------------------------------------------------
function saveScore(index, score, name)
{
	var highScores = Crafty.storage("highScores");

	highScores.splice(index, 0, {name: name, score:score}); // insert score into scores array
	highScores.pop(); // remove last score

	Crafty.storage("highScores", highScores); // save scores to Crafty storage
}

//-------------------------------------------------------------------------------
// game over label
// shows 3 top scores
// restart button
// main menu button
//-------------------------------------------------------------------------------
function newGameOverWindow()
{
	var N_SCORES = 3;

	var window = Crafty.e("MenuWindow")
		.label("game over");

	//Draw text for all high scores from gameState object
	displayHighScores(N_SCORES, window)

	window.attach(newRestartButton());
	window.attach(newMainMenuButton());

	return window;
}

//-------------------------------------------------------------------------------
// Button to go back to game
//-------------------------------------------------------------------------------
function newRestartButton()
{
	var button = Crafty.e("LabelButton")
		.label("try again")
		.bind("Click", function () 
		{
			Crafty.enterScene("Game");
		});

	button.x = 0.5 * (WIDTH - button.w);
	button.y = GAME_OVER_RESTART_BUTTON_Y;

	return button;
}

//-------------------------------------------------------------------------------
// Button to go to main menu
//-------------------------------------------------------------------------------
function newMainMenuButton()
{
	var button = Crafty.e("LabelButton")
		.label("main menu")
		.bind("Click", function () 
		{
			Crafty.enterScene("MainMenu");
		});

	button.x = 0.5 * (WIDTH - button.w);
	button.y = GAME_OVER_MAIN_MENU_BUTTON_Y;

	return button;
}