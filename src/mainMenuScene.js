//-------------------------------------------------------------------------------
// MAIN MENU SCENE
//-------------------------------------------------------------------------------

var MENU_BUTTONS_Y_OFFSET = 100;
var MENU_BTN1_Y = 0.2 * MENU_WINDOW_HEIGHT + MENU_BUTTONS_Y_OFFSET;
var MENU_BTN2_Y = 0.35 * MENU_WINDOW_HEIGHT + MENU_BUTTONS_Y_OFFSET;
var MENU_BTN3_Y = 0.5 * MENU_WINDOW_HEIGHT + MENU_BUTTONS_Y_OFFSET;
var MENU_BTN4_Y = 0.65 * MENU_WINDOW_HEIGHT + MENU_BUTTONS_Y_OFFSET;

//-------------------------------------------------------------------------------
function initMainMenuScene () 
{
	var menuStruct = {} // holds structure of the menu

  if (!Crafty.audio.muted) {
    Crafty.audio.play("intro", -1);
  }

	menuStruct.highScoreWindow = newHighScoreWindow(); // displays high scores
	menuStruct.helpWindow = newHelpWindow(); // display information about controls and abilities
	menuStruct.mainMenuWindow = newMainMenuWindow(menuStruct); // contains navigation buttons

	menuStruct.backButton = newBackButton(menuStruct); // leads back to main menu window from every other window
}

//-------------------------------------------------------------------------------
function uninitMainMenuScene() 
{
	Crafty.audio.stop("intro"); // stop bgm
}


function hideAllMenuWindows()
{
	Crafty("MenuWindow").each(function(i)
	{
		this.show(false);
	});
}

//-------------------------------------------------------------------------------
// return to main menu window from high scores or help window
//-------------------------------------------------------------------------------
function newBackButton(menuStruct)
{
	var button = Crafty.e("LabelButton")
		.label("BACK")
		.bind("Click", function () 
		{
			hideAllMenuWindows();
			menuStruct.mainMenuWindow.show(true);
			this.show(false);
		})
		.show(false);

	button.x = MENU_WINDOW_X;
	button.y = MENU_WINDOW_Y;

	return button;
}

//-------------------------------------------------------------------------------
// starts the game
//-------------------------------------------------------------------------------
function newStartButton()
{
	var button = Crafty.e("LabelButton")
		.label("start")
		.bind("Click", function () 
		{
			Crafty.enterScene("Game");
		});

	button.x = 0.5 * (WIDTH - button.w);
	button.y = MENU_BTN1_Y;

	return button;
}

//-------------------------------------------------------------------------------
// shows high scores window
//-------------------------------------------------------------------------------
function newHighScoreButton(menuStruct)
{
	var button = Crafty.e("LabelButton")
		.label("high scores")
		.bind("Click", function () 
		{
			hideAllMenuWindows();
			menuStruct.highScoreWindow.show(true);
			menuStruct.backButton.show(true);
		});

	button.x = 0.5 * (WIDTH - button.w);
	button.y = MENU_BTN2_Y;

	return button;
}

//-------------------------------------------------------------------------------
// shows help window
//-------------------------------------------------------------------------------
function newHelpButton(menuStruct)
{
	var button = Crafty.e("LabelButton")
		.label("help")
		.bind("Click", function () 
		{
			hideAllMenuWindows();
			menuStruct.helpWindow.show(true);
			menuStruct.backButton.show(true);
		});

	button.x = 0.5 * (WIDTH - button.w);
	button.y = MENU_BTN3_Y;

	return button;
}

function newMainMenuWindow(menuStruct)
{
	var window = Crafty.e("MenuWindow")
		.label("orange shooter", PLAYER_COLOR_STR);

	menuStruct.startButton = newStartButton();
	menuStruct.highScoreButton = newHighScoreButton(menuStruct);
	menuStruct.helpButton = newHelpButton(menuStruct);
  const toggleSoundButton = newToggleSoundButton();

	window.attach(menuStruct.startButton);
	window.attach(menuStruct.highScoreButton);
	window.attach(menuStruct.helpButton);
  window.attach(toggleSoundButton);

	return window;
}

function newToggleSoundButton()
{
	var button = Crafty.e("LabelButton")
		.label("toggle sound")
		.bind("Click", function () 
		{
		  if (Crafty.audio.muted) {
        Crafty.audio.unmute();

        if (!Crafty.audio.isPlaying("intro")) {
          Crafty.audio.play("intro", -1);
        }
      } else {
        Crafty.audio.mute();
      }
		});

	button.x = 0.5 * (WIDTH - button.w);
	button.y = MENU_BTN4_Y;

	return button;
}

//-------------------------------------------------------------------------------
// displays 10 high scores from Crafty.storage
//-------------------------------------------------------------------------------
function newHighScoreWindow()
{
	var N_SCORES = 10;

	var window = Crafty.e("MenuWindow")
		.label("high scores");

	//Draw text for all high scores from gameState object
	displayHighScores(N_SCORES, window)

	window.show(false);

	return window;
}

//-------------------------------------------------------------------------------
// New line of text
//-------------------------------------------------------------------------------
function newTextLine(text, y)
{
	var line = Crafty.e("2D, Canvas, Text")
			.textColor(ENEMY_COLOR_STR)
			.textFont({family: FONT_FAMILY, size: MENU_WINDOW_LABEL_FONT_SIZE})
			.text(text);

	line.x = 0.5 * (WIDTH - line.w);
	line.y = y;

	return line;
}

//-------------------------------------------------------------------------------
// displays information about controls and abilities
//-------------------------------------------------------------------------------
function newHelpWindow()
{
	var F_SIZE = 15;
	var Y_OFFSET = 180;

	var window = Crafty.e("MenuWindow")
		.label("help");

	var line1 = newTextLine("WASD move", MENU_WINDOW_LABEL_Y);
	window.attach(line1);
	window.attach(newTextLine("SPACE shoot", MENU_WINDOW_LABEL_Y + line1.h));
	window.attach(newTextLine("1 2 3 speacial abilities", MENU_WINDOW_LABEL_Y + 2 * line1.h));

	window.attach(
		Crafty.e("2D, Canvas, Image")
			.image(BULLET_TIME_ICON)
			.attr(
			{
				x: 0.5 * (WIDTH - ICON_SIZE),
				y: MENU_WINDOW_LABEL_Y + 4 * line1.h
			})
	);

	window.attach(newTextLine("slows down all enemies", MENU_WINDOW_LABEL_Y + 5 * line1.h + ICON_SIZE));
	window.attach(newTextLine("and enemy bullets", MENU_WINDOW_LABEL_Y + 6 * line1.h + ICON_SIZE));

	window.attach(
		Crafty.e("2D, Canvas, Image")
			.image(SUPER_SHIELD_ICON)
			.attr(
			{
				x: 0.5 * (WIDTH - ICON_SIZE),
				y: MENU_WINDOW_LABEL_Y + 7 * line1.h + ICON_SIZE
			})
	);

	window.attach(newTextLine("makes you invincible and", MENU_WINDOW_LABEL_Y + 7 * line1.h + 2 * ICON_SIZE));
	window.attach(newTextLine("destroys enemies on collision", MENU_WINDOW_LABEL_Y + 8 * line1.h + 2 * ICON_SIZE));

	window.attach(
		Crafty.e("2D, Canvas, Image")
			.image(BIG_BANG_ICON)
			.attr(
			{
				x: 0.5 * (WIDTH - ICON_SIZE),
				y: MENU_WINDOW_LABEL_Y + 9 * line1.h + 2 * ICON_SIZE
			})
	);

	window.attach(newTextLine("destroys all enemies and ", MENU_WINDOW_LABEL_Y + 9 * line1.h + 3 * ICON_SIZE));
	window.attach(newTextLine("enemy bullets on the screen", MENU_WINDOW_LABEL_Y + 10 * line1.h + 3 * ICON_SIZE));

	window.show(false);

	return window;
}
