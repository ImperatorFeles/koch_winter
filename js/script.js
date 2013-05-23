// correctly use animation frames
requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000/60);
	};
})();

var canvas, context, W, H;
var snowDepth = 1;

$(document).ready(function()
{
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	W = window.innerWidth;
	H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;

	$(document).keydown(keyPressed);

	requestAnimFrame(loop);

});

function keyPressed(e)
{
	if (e.which == 'E'.charCodeAt(0))
	{
		for (var i = 0; i < snowflakes.length; i++)
		{
			snowflakes[i].addWind([Math.random() * 50 - 25, Math.random() * 50 - 25]);
		}
	}
}

var snowflakes = []

function loop()
{
	drawBackground();

	// add a new snowflake if we don't have enough and rng says we should
	if (snowflakes.length < 100 && Math.random() * 100 < 9)
	{
		addSnowflake();
	}
	// update the snowflakes
	for (var i = 0; i < snowflakes.length; i ++)
	{
		snowflakes[i].update();
	}

	// draw the snowflakes
	for (var i = 0; i < snowflakes.length; i ++)
	{
		context.fillStyle = "white";
		context.strokeStyle = "black";
		context.lineWidth = 1;
		snowflakes[i].render();
	}

	/*
	context.fillStyle = "black";
	context.font = "30px Arial";
	context.fillText("Count = " + snowflakes.length, 80, 80);
	*/

	requestAnimFrame(loop);
}

/*
 * Draws the background of the scene
 */
function drawBackground()
{
	var gradient = context.createLinearGradient(0, 0, 0, H);

	gradient.addColorStop(0.0, "#999999");
	gradient.addColorStop(0.1, "#CCCCCC");
	gradient.addColorStop(0.4, "#E0E0E0");
	context.fillStyle = gradient;
	context.fillRect(0, 0, W, H);
}

function addSnowflake()
{

	// randomize snowflake properties
	var loc = [Math.random() * W, -50];
	var size = Math.random() * 40 + 10;
	var speed = Math.random() + 0.2;
	var rotSpeed = Math.random() * 0.05 + 0.005;
	var dir = Math.random() * 2 - 1;
	var depth = Math.floor(generateRandomNormal() + 1.65);

	// make sure depth was generated correctly
	while (depth < 0 || depth > 4)
	{
		depth = Math.floor(generateRandomNormal() + 1.65);
	}

	// make flakes besides 1 more rare
	if (depth != 1 && Math.random() * 100 < 40)
	{
		depth = 1;
	}

	// create the snowflake
	snowflakes.push(new Snowflake(loc, size, speed, rotSpeed, dir, depth));
}

