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
var debug = false;
var snowflakes = [];
var prevMousePos;
var mouseDown = false;
var wind = [0.0, 0.0];
var maxWind = 50.0;

$(document).ready(function()
{
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	W = window.innerWidth;
	H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;

	$(document).keydown(keyPressed);
	$(document).mousemove(mouseMoved);
	$(document).mousedown(function()
		{ mouseDown = true; });

	$(document).mouseup(function()
		{ 
			prevMousePos = null;
			wind = [0.0, 0.0]
			mouseDown = false; 
		});

	requestAnimFrame(loop);

});

function keyPressed(e)
{
	if (e.which == 'W'.charCodeAt(0))
	{
		for (var i = 0; i < snowflakes.length; i++)
		{
			snowflakes[i].setWind([Math.random() * 50 - 25, Math.random() * 50 - 25]);
		}
	}
	if (e.which == 'D'.charCodeAt(0))
	{
		debug = !debug;
		for (var i = 0; i < snowflakes.length; i++)
		{
			snowflakes[i].setDebug(debug);
		}
	}
}

function mouseMoved(e)
{
	// don't do anything if mouse isn't down
	if (!mouseDown)
	{
		return;
	}

	// make sure the previous position exists
	if (!prevMousePos)
	{
		prevMousePos = [e.pageX, e.pageY];
	}

	var dx = e.pageX - prevMousePos[0];
	var dy = e.pageY - prevMousePos[1];

	wind[0] += dx/10.0;
	wind[1] += dy/10.0;

	if (wind[0] > maxWind) wind[0] = maxWind;
	if (wind[1] > maxWind) wind[1] = maxWind;

	for (var i = 0; i < snowflakes.length; i++)
	{
		snowflakes[i].setWind(wind);
	}

	prevMousePos = [e.pageX, e.pageY];
}
	


function loop()
{
	context.globalAlpha = 1.0;
	drawBackground();

	// add a new snowflake if we don't have enough and rng says we should
	if (snowflakes.length < 100 && Math.random() * 100 < 8)
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
		context.globalAlpha = 0.8;
		context.lineWidth = 1;
		snowflakes[i].render();
	}

	if (debug)
	{
		drawDebugInfo();
	}

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

/*
 * Draws some useful debug information
 */
function drawDebugInfo()
{
	var averageDepth = 0.0;

	for (var i = 0; i < snowflakes.length; i++)
	{
		averageDepth += snowflakes[i].depth;
	}

	averageDepth /= snowflakes.length;

	context.globalAlpha = 0.5;
	context.fillStyle = "#555555";
	context.fillRect(10, H - 110, 500, 100);

	context.globalAlpha = 0.8;
	context.fillStyle = "#000000";
	context.font = "20px Arial";
	context.fillText("Count = " + snowflakes.length, 20, H - 90);
	context.fillText("Average Depth = " + averageDepth.toFixed(3), 20, H - 70);
}

/*
 * Adds a snowflake with randomized parameters to the scene
 */
function addSnowflake()
{

	// randomize snowflake properties
	var loc = [Math.random() * W, -50];
	var size = Math.random() * 40 + 10;
	var speed = Math.random() + 0.3;
	var rotSpeed = Math.random() * 0.05 + 0.005;
	var dir = Math.random() * 2 - 1;
	var depth = Math.floor(generateRandomNormal() + 1.85);

	// make sure depth was generated correctly
	while (depth < 0 || depth > 4)
	{
		depth = Math.floor(generateRandomNormal() + 1.85);
	}

	// make flakes besides 1 and 2 more rare
	if (depth != 1 && depth != 2 && Math.random() * 100 < 40)
	{
		depth = 1;
	}

	// create the snowflake
	var snowflake = new Snowflake(loc, size, speed, rotSpeed, dir, depth);
	snowflake.setDebug(debug);

	// take wind from previous snowflake if there is one
	if (snowflakes.length > 0)
	{
		snowflake.setWind(snowflakes[snowflakes.length-1].wind);
	}

	snowflakes.push(snowflake);
}

