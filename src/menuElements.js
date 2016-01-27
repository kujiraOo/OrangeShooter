var MENU_BG_ALPHA = 0.2;

//-------------------------------------------------------------------------------
// GFX Group
// Component that helps to hide and show attached entinies
//-------------------------------------------------------------------------------
Crafty.c("GFXGroup", {

	show: function(toShow)
	{
		this.visible = toShow; // hide the parent entity

		// hide all attached entities
		for (var i = 0; i < this._children.length; i++)
		{
			var child = this._children[i];
			
			// if child has show method use it to show or hide it
			if (child.show)
				child.show(toShow);
			else
				child.visible = toShow;
		}

		return this;
	}
});

//-------------------------------------------------------------------------------
// Label Button
// Button with text label and colored rect background 
//-------------------------------------------------------------------------------
Crafty.c("LabelButton",
{
	required: "2D, Canvas, Color, Mouse, GFXGroup",

	init: function () 
	{
		// init label
		var textE = Crafty.e("2D, Canvas, Text")
			.text("button")
			.textFont({family: FONT_FAMILY, size:FONT_SIZE})
			.textColor(ENEMY_COLOR_STR);

		this.w = textE.w;
		this.h = textE.h;

		this.attach(textE)
		this._textE = textE

		this.color(ENEMY_COLOR_STR, MENU_BG_ALPHA);
	},

	// set new label, adjust width and height of bg
	label: function(text)
	{
		this._textE.text(text);
		this.w = this._textE.w; // change width of the button depending on the width of new text

		return this;
	},
});

//-------------------------------------------------------------------------------
// Icon Button
// Shortcut for creating buttons with images
//-------------------------------------------------------------------------------
Crafty.c("IconButton",
{
	required: "2D, Canvas, Image, Mouse",
});

//-------------------------------------------------------------------------------
// Menu Window 
// Window entity that has background color and label
//-------------------------------------------------------------------------------
Crafty.c("MenuWindow",
{
	required: "2D, Canvas, Color, GFXGroup",

	init: function()
	{
		var LABEL_OFFSET_Y = 30; // label offset from the top of the window

		this.w = MENU_WINDOW_WIDTH;
		this.h = MENU_WINDOW_HEIGHT;
		this.x = MENU_WINDOW_X;
		this.y = MENU_WINDOW_Y;
		this.color(ENEMY_COLOR_STR, MENU_BG_ALPHA);

		//Init window's label
		var textE = Crafty.e("2D, Canvas, Text")
			.text("window")
			.textFont({family: FONT_FAMILY, size:FONT_SIZE})
			.textColor(ENEMY_COLOR_STR);

		textE.x = this.x + 0.5 * (this.w - textE.w); // center the label
		textE.y = this.y + LABEL_OFFSET_Y;

		this.attach(textE);
		this._textE = textE;
	},

	// change the text [and color] of window's label
	label: function(text, color)
	{
		this._textE.text(text);
		this._textE.x = this.x + 0.5 * (this.w - this._textE.w); // center the label

		// change color if it passed as arguments
		if (color) this._textE.textColor(color);

		return this;
	},

});