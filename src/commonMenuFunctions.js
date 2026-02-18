//-------------------------------------------------------------------------------
// Functions that are used in different game scenes to create menu elements
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
function displayHighScores(numScores, window)
{
	var highScores = Crafty.storage("highScores");

	// numScores shouldn't be bigger than num of scores in highScores array
	if (numScores > highScores.length) 
		numScores = highScores.length;

	for (var i = 0; i < numScores; i++)
	{

		var scoreRecord = highScores[i];

		// make first three porisions orange
		var color;
		if (i < 3)
			color = PLAYER_COLOR_STR;
		else 
			color = ENEMY_COLOR_STR;

		// create text entiry for each position
		var nameText = Crafty.e("2D, Canvas, Text")
			.textColor(color)
			.textFont({family: FONT_FAMILY, size: MENU_WINDOW_LABEL_FONT_SIZE})
			.text(scoreRecord.name);

		var scoreText = Crafty.e("2D, Canvas, Text")
			.textColor(color)
			.textFont({family: FONT_FAMILY, size: MENU_WINDOW_LABEL_FONT_SIZE})
			.text(scoreRecord.score);

		window.attach(nameText);
		window.attach(scoreText);

		nameText.x = 0.33 * (WIDTH);
		nameText.y = MENU_WINDOW_LABEL_Y + 2 * i * 15;

		scoreText.x = 0.5 * (WIDTH);
		scoreText.y = MENU_WINDOW_LABEL_Y + 2 * i * 15;
	}
}
