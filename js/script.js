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
	if (e.which == 187 && snowDepth < 5)
	{
		snowDepth += 1;
	}
	else if (e.which == 189 && snowDepth > 0)
	{
		snowDepth -= 1;
	}
}

var snowflakes = []

function loop()
{
	drawBackground();

	// add a new snowflake if we don't have enough and rng says we should
	if (snowflakes.length < 50 && Math.random() * 100 < 2)
	{
		addSnowflake();
	}
	// update the snowflakes
	for (var i = 0; i < snowflakes.length; i ++)
	{
		snowflakes[i].update();
	}

	// draw the snowflakes
	context.fillStyle = "white";
	context.strokeStyle = "black";
	context.lineWidth = 1;
	for (var i = 0; i < snowflakes.length; i ++)
	{
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
	var depth = Math.floor(generateRandomNormal() + 1.5);

	// make sure depth was generated correctly
	while (depth < 0 || depth > 4)
	{
		depth = Math.floor(generateRandomNormal() + 1.5);
	}

	// make flakes besides 1 more rare
	if (depth != 1 && Math.random() * 100 < 50)
	{
		depth = 1;
	}

	// create the snowflake
	snowflakes.push(new Snowflake(loc, size, speed, rotSpeed, dir, depth));
}

/**
 * Draws a Koch snowflake at the location with recursion depth 'depth'
 */
function drawSnowflake(loc, depth, size)
{
	var triSize = size; // length of a side
	var radius = Math.sqrt(3)/6 * triSize; // radius of inscribed circle
	var height = Math.sqrt(3)/2 * triSize; // height of triangle
	var heightP = height - radius; // distance from center to vertex
	var start = [loc[0], loc[1] - heightP]; // starting point
	var point2 = [start[0] + triSize / 2, start[1] + height];
	var point3 = [point2[0] - triSize, point2[1]];

	var points = [start, point2, point3];
	var newPoints = [];

	// just draw a triangle
	if (depth == 0)
	{
		context.beginPath();
		context.moveTo(start[0], start[1]);
		context.lineTo(point2[0], point2[1]);
		context.lineTo(point3[0], point3[1]);
		context.closePath();
		context.stroke();
		context.fill();
		return;
	}

	while (depth > 0)
	{
		newPoints = [];	
		for (var i = 0; i < points.length; i++)
		{
			if (i+1 >= points.length)
			{
				newPoints = newPoints.concat(kochRecurse(points[i], points[0]));
			}
			else
			{
				newPoints = newPoints.concat(kochRecurse(points[i], points[i+1]));
			}
		}
		points = newPoints.slice(0);
		depth = depth - 1;
	}

	context.beginPath();
	context.moveTo(points[0]);
	for (var i = 0; i < points.length; i++)
	{
		context.lineTo(points[i][0], points[i][1]);
	}

	context.closePath();
	//context.lineTo(points[0][0], points[0][1]);
	context.stroke();
	context.fill();
}

/**
 * Returns all points of the path making up the next koch snowflake
 */
function kochRecurse(start, end)
{
	// a list of points used, to return
	var points = [];

	// delta from start to end
	var dx = end[0] - start[0];
	var dy = end[1] - start[1];

	// length of a segment of the line (1/3 length)
	var segmentLen = Math.sqrt(Math.pow(dx, 2) + 
						  Math.pow(dy, 2)) / 3;

	// center of the segment of the line
	var segmentCenter = [start[0] + dx/2, start[1] + dy/2];

	// distance from the center of the line to the tip of the new triangle
	var tipHeight = Math.sqrt(3)/2 * segmentLen;

	// calculate location of tip
	var angle = Math.atan(dy/dx);

	// sign correction if we are going right, else triangle will point wrong way
	var sign = dx < 0 ? -1 : 1;
	//sign *= (Math.random() * 2 - 1);

	var tip = [segmentCenter[0] + sign * Math.sin(angle) * tipHeight, 
	    		 segmentCenter[1] - sign * Math.cos(angle) * tipHeight];


	// push the 5 vertices and return them
	points.push(start);
	points.push([start[0] + dx/3, start[1] + dy/3]);
	points.push(tip);
	points.push([end[0] - dx/3, end[1] - dy/3]);
	points.push(end);

	return points;
}
