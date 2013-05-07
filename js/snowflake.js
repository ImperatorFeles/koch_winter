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
}

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

Snowflake.prototype.render = function()
{
	drawRotated(this.loc[0], this.loc[1], this.theta, 
			  partial(drawSnowflake, this.loc, this.depth, this.size));
};
