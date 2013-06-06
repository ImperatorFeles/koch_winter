
/** 
 * Rotates whatever is drawn in 'drawFunc' around (x, y) by 'rot' radians
 */
function drawRotated(x, y, rot, drawFunc)
{
	context.translate(x, y);
	context.rotate(rot);
	context.translate(-x, -y);
	drawFunc();
	context.translate(x, y);
	context.rotate(-rot);
	context.translate(-x, -y);
}

/**
 * Translates whatever is drawn in 'drawFunc' to (x, y)
 */
function drawTranslated(x, y, drawFunc)
{
	context.translate(x, y);
	drawFunc();
	context.translate(-x, -y);
}

/**
 * Draws a line from 'start' to 'end'
 */
function drawLine(start, end)
{
	context.beginPath();
	context.moveTo(start[0], start[1]);
	context.lineTo(end[0], end[1]);
	context.stroke();
}

/**
 * Draws a vector from start to end as an arrow
 */
function drawVector(start, end, drawMag)
{
	// default arrow size
	var arrowSize = 5;
	// default drawing magnitude off
	drawMag = drawMag || false;

	var dx = end[0] - start[0];
	var dy = -(end[1] - start[1]);
	var theta = Math.PI / 4 - Math.atan(dy/dx);
	var sign = dx >= 0 ? 1 : -1; // sign correction for negative dx

	// calculate locations of arrow tips
	var tip1 = [end[0] - sign * arrowSize * Math.sin(theta), 
	    end[1] + sign * arrowSize * Math.cos(theta)];
	var tip2 = [end[0] - sign * arrowSize * Math.cos(theta), 
	    end[1] - sign * arrowSize * Math.sin(theta)]; 

	context.beginPath();
	context.moveTo(start[0], start[1]);
	context.lineTo(end[0], end[1]);
	context.lineTo(tip1[0], tip1[1]);
	context.moveTo(end[0], end[1]);
	context.lineTo(tip2[0], tip2[1]);
	context.stroke();

	
	if (drawMag)
	{
		var mag = Math.sqrt(dx * dx + dy * dy);
		var center = [start[0] + dx / 2.0, start[1] - dy / 2.0];

		context.font = "10px Arial";
		context.fillText(mag.toFixed(1), center[0], center[1]);
	}
	

}

/**
 * Rotates a point about the origin theta radians and returns
 * the rotated point
 */
function rotatePoint(point, theta)
{
	var x = point[0] * Math.cos(theta) - point[1] * Math.sin(theta);
	var y = point[0] * Math.sin(theta) + point[1] * Math.cos(theta);
	return [x, y];
}

/**
 * Generates a random number on a normal distribution
 */
function generateRandomNormal()
{
	var U1 = Math.random();
	var U2 = Math.random();

	var c1 = Math.sqrt(-2 * Math.log(U1));
	var c2 = Math.cos(2 * Math.PI * U2);

	return c1 * c2;
}

/**
 * Returns the cube root of the number x
 */
Math.cbrt = function(x)
{
	var sign = x === 0 ? 0 : x > 0 ? 1 : -1;

	return sign * Math.pow(Math.abs(x), 1 / 3);
}

/**
 * Returns a random color
 */
function randomColor()
{
	return "rgb(" + Math.floor(Math.random()*255)+","+
				 Math.floor(Math.random()*255)+","+
				 Math.floor(Math.random()*255)+")";
}

/**
 * Generates a color based on r, g, b
 */
function generateColor(r, g, b)
{
	return "rgb(" + r + "," + g + "," + b + ")";
}

/**
 * Returns a partial function with 'args' arguments
 */
function partial(func /*, 0..n args */) {

	var args = Array.prototype.slice.call(arguments, 1);
	return function() 
	{
		var allArguments = args.concat(Array.prototype.slice.call(arguments));
		return func.apply(this, allArguments);
	};
}
