/*
 * This file defines properties of a "snowflake" class
 */

function Snowflake(startLoc, size, speed, rotSpeed, dir, depth)
{
	this.loc = startLoc;
	this.size = size;
	this.velocity = [0.0, 0.0];
	this.speed = speed;
	this.rotSpeed = rotSpeed;
	this.dir = dir;
	this.theta = 0;
	this.depth = depth;
	this.offsets = this.generateSnowflake();
	this.velocity[0] = Math.sin(this.theta) * this.dir;
	this.velocity[1] = this.speed;
	this.wind = [0, 0];
	this.damping = 0.01; // damping factor so wind dies down
	this.debug = false;
	this.blue = Math.floor(Math.random() * 20);
	this.strokeColor = 155 - Math.floor(size * 3);
}

/*
 * Updates the snowflake's position based on the direction,
 * the velocity, and the rotational velocity
 */
Snowflake.prototype.update = function(time)
{
	// update position
	this.loc[0] += (time / 1000.0) * (this.velocity[0] + this.wind[0]) * this.size / 50;
	this.loc[1] += (time / 1000.0) * (this.velocity[1] + this.wind[1]) * this.size / 50;

	if (this.wind[0] < 0.001 || this.wind[0] > 0.001)
		this.wind[0] -= this.wind[0] * this.damping;
	if (this.wind[1] < 0.001 || this.wind[1] > 0.001)
		this.wind[1] -= this.wind[1] * this.damping;

	// bring snowflake to other side of screen outside of screen\
	// in a way proportional to how far out it is
	if (this.loc[1] > H + 50 || this.loc[1] < -50)
	{
		this.loc[1] = -(this.loc[1] - H);
	}
	if (this.loc[0] > W + 50 || this.loc[0] < -50)
	{
		this.loc[0] = -(this.loc[0] - W);
	}

	// update rotation
	this.theta += (this.rotSpeed + this.wind[1] / 200 + Math.random()) * (time / 1000.0);
	this.velocity[0] = 100 * Math.sin(this.theta) * this.dir;
};

/*
 * Renders the snowflake to the screen applied with transformations
 */
Snowflake.prototype.render = function()
{
	var x = this.loc[0];
	var y = this.loc[1];
	var rot = this.theta;

	this.drawSnowflake();

	if (this.debug)
	{
		this.drawDebugInfo();
	}
};

/**
 * Sets the wind to be a specific value
 */
Snowflake.prototype.setWind = function(windVelocity)
{
	this.wind = windVelocity.slice(0);
};

/**
 * Adds wind to the wind of the snowflake
 */
Snowflake.prototype.addWind = function(windVelocity)
{
	this.wind[0] += windVelocity[0];
	this.wind[1] += windVelocity[1];
};

/*
 * Draws the actual lines of the snowflake
 */
Snowflake.prototype.drawSnowflake = function()
{
	var cosTheta = Math.cos(this.theta);
	var sinTheta = Math.sin(this.theta);

	context.fillStyle = generateColor(255 - this.blue, 255 - this.blue, 255);
	context.strokeStyle = generateColor(this.strokeColor, this.strokeColor, this.strokeColor);

	context.beginPath();

	for (var i = 0; i < this.offsets.length; i++)
	{
		var point = [];
		point[0] = this.offsets[i][0];
		point[1] = this.offsets[i][1];

		// rotate the point
		point[0] = this.offsets[i][0] * cosTheta - this.offsets[i][1] * sinTheta;
		point[1] = this.offsets[i][0] * sinTheta + this.offsets[i][1] * cosTheta;

		// convert the offset to a location
		point[0] += this.loc[0];
		point[1] += this.loc[1];

		// draw the point
		// don't draw a line for the first point
		if (i == 0)
		{
			context.moveTo(point[0], point[1]);
		}
		else
		{
			context.lineTo(point[0], point[1]);
		}

	}

	context.closePath();
	context.fill();
	context.stroke();
};

Snowflake.prototype.drawDebugInfo = function()
{
	var scale = 20;
	var totalVelocity = [0, 0];
	totalVelocity[0] = this.velocity[0] + this.wind[0];
	totalVelocity[1] = this.velocity[1] + this.wind[1];
	// we draw the vectors using cube roots to better show small and large values
	// draw x vector
	context.strokeStyle = "#0000BB";
	context.fillStyle = "#0000BB";
	drawVector(this.loc, [this.loc[0] + totalVelocity[0], this.loc[1]], true);
	// draw y vector
	context.strokeStyle = "#00BB00";
	context.fillStyle = "#00BB00";
	drawVector(this.loc, [this.loc[0], this.loc[1] + totalVelocity[1]], true);
	// draw full vector
	context.strokeStyle = "#BB0000";
	context.fillStyle = "#BB0000";
	drawVector(this.loc, [this.loc[0] + totalVelocity[0], this.loc[1] + totalVelocity[1]], true);
};


/**
 * Returns the points that are used to draw a kock snowflake of the specified
 * depth and size
 */
Snowflake.prototype.generateSnowflake = function()
{
	var triSize = this.size; // length of a side
	var radius = Math.sqrt(3)/6 * triSize; // radius of inscribed circle
	var height = Math.sqrt(3)/2 * triSize; // height of triangle
	var heightP = height - radius; // distance from center to vertex
	var start = [0, -heightP]; // starting point
	var point2 = [start[0] + triSize / 2, start[1] + height];
	var point3 = [point2[0] - triSize, point2[1]];

	var points = [start, point2, point3];
	var newPoints = [];

	var depth = this.depth;

	while (depth > 0)
	{
		newPoints = [];	
		for (var i = 0; i < points.length; i++)
		{
			var kochPoints;
			if (i+1 >= points.length)
			{
				kochPoints = this.kochRecurse(points[i], points[0]);
			}
			else
			{
				kochPoints = this.kochRecurse(points[i], points[i+1]);
			}
			// remove last point to avoid duplicates
			kochPoints = kochPoints.slice(0, kochPoints.length - 1);
			newPoints = newPoints.concat(kochPoints);
		}
		points = newPoints.slice(0);
		depth = depth - 1;
	}

	return points;
};

/**
 * Returns all points of the path making up the next koch snowflake
 */
Snowflake.prototype.kochRecurse = function(start, end)
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

	var tip = [segmentCenter[0] + sign * Math.sin(angle) * tipHeight, 
	    		 segmentCenter[1] - sign * Math.cos(angle) * tipHeight];


	// push the 5 vertices and return them
	points.push(start);
	points.push([start[0] + dx/3, start[1] + dy/3]);
	points.push(tip);
	points.push([end[0] - dx/3, end[1] - dy/3]);
	points.push(end);

	return points;
};

Snowflake.prototype.setDebug = function(debug)
{
	this.debug = debug;
};

Snowflake.prototype.toggleDebug = function()
{
	this.debug = !this.debug;
};
