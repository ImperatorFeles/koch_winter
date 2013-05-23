/*
 * This file defines properties of a "snowflake" class
 */

function Snowflake(startLoc, size, speed, rotSpeed, dir, depth)
{
	this.loc = startLoc;
	this.size = size;
	this.speed = speed;
	this.rotSpeed = rotSpeed;
	this.dir = dir;
	this.theta = 0;
	this.depth = depth;
	this.points = this.generateSnowflake();
}

/*
 * Updates the snowflake's position based on the direction,
 * the velocity, and the rotational velocity
 */
Snowflake.prototype.update = function()
{
	// update position
	this.loc[0] += Math.sin(this.theta) * this.dir;
	this.loc[1] += this.speed;

	if (this.loc[1] > H + 50)
	{
		this.loc[1] = -50;
	}

	// update rotation
	this.theta += this.rotSpeed;
};

/*
 * Renders the snowflake to the screen applied with transformations
 */
Snowflake.prototype.render = function()
{
	var x = this.loc[0];
	var y = this.loc[1];
	var rot = this.theta;

	context.translate(x, y);
	context.rotate(rot);
	this.drawSnowflake();
	context.rotate(-rot);
	context.translate(-x, -y);
	this.drawDebugInfo();
};

/*
 * Draws the actual lines of the snowflake
 */
Snowflake.prototype.drawSnowflake = function()
{
	// make sure snowflake exists before drawing it
	if (!this.points)
	{
		return;
	}

	context.beginPath();
	context.moveTo(this.points[0][0], this.points[0][1]);

	for (var i = 1; i < this.points.length; i++)
	{
		context.lineTo(this.points[i][0], this.points[i][1]);
	}

	context.lineTo(this.points[0][0], this.points[0][1]);
	context.fill();
	context.stroke();

};

Snowflake.prototype.drawDebugInfo = function()
{
	context.strokeStyle = "#00BB00";
	context.beginPath();
	context.moveTo(this.loc[0], this.loc[1]);
	context.lineTo(this.loc[0], this.loc[1] + this.speed * 50)
	context.lineTo(this.loc[0] + 3, this.loc[1] + this.speed * 50 - 3);
	context.moveTo(this.loc[0], this.loc[1] + this.speed * 50);
	context.lineTo(this.loc[0] - 3, this.loc[1] + this.speed * 50 - 3);
	context.stroke();
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
	var start = [0, heightP]; // starting point
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
			if (i+1 >= points.length)
			{
				newPoints = newPoints.concat(this.kochRecurse(points[i], points[0]));
			}
			else
			{
				newPoints = newPoints.concat(this.kochRecurse(points[i], points[i+1]));
			}
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
};
