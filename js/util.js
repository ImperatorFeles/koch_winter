
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
 * Generates a random number on a normal distribution
 */
function generateRandomNormal()
{
	// two random numbers
	var U1 = Math.random();
	var U2 = Math.random();
	var c1 = Math.sqrt(-2 * Math.log(U1));
	var c2 = Math.cos(2 * Math.PI * U2);

	return c1 * c2;
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
