/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * The optic disc
 *
 * @class ROPRD
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ROPRD = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ROPRD";

	// Private parameters
	this.numberOfHandles = 7;
	this.initialRadius = 170;
	this.zone = "";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation','zone'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ROPRD.prototype = new ED.Doodle;
ED.ROPRD.prototype.constructor = ED.ROPRD;
ED.ROPRD.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.ROPRD.prototype.setHandles = function() {
	// Array of handles
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}

	// Allow top handle to rotate doodle
	this.handleArray[0].isRotatable = true;
}

/**
 * Sets default properties
 */
ED.ROPRD.prototype.setPropertyDefaults = function() {
	this.addAtBack = true;
	
	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		var n = this.numberOfHandles;
		var range = new Object;
		range.length = new ED.Range(-980, +980);
		range.angle = new ED.Range(0, 2*Math.PI);
		this.handleVectorRangeArray[i] = range;
	}
}

/**
 * Sets default parameters
 */
ED.ROPRD.prototype.setParameterDefaults = function() {
	if (this.drawing.eye != ED.eye.Right) {
		this.dir = -1;
	}
	else if (this.drawing.eye != ED.eye.Left){
		this.dir = +1;
	}
	
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var np = new ED.Point(doodle.originX + 100, 0);
		this.move(np.x, np.y);
	} else {
		this.move((this.drawing.eye == ED.eye.Right ? -1 : 1) * 300, 0);
	}

	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		if (i%2==0) point.setWithPolars(this.initialRadius - 100, i * 2 * Math.PI / this.numberOfHandles);
		else point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ROPRD.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ROPRD.superclass.draw.call(this, _point);

	// Boundary path
	ctx.lineJoin="round";
	ctx.lineEnd = "butt";
	ctx.beginPath();

	// Start curve
	ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);

	// Complete curve segments
	for (var i = 0; i < this.numberOfHandles; i++) {
		//define points to draw curve
			// with tangential control points
	    var startPnt = this.squiggleArray[0].pointsArray[i];
	    var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
	    var endPnt = this.squiggleArray[0].pointsArray[toIndex];
		if (i == 0 || (i >=2 && i<=4)) {
		    var ctrlP1 = new ED.Point((endPnt.x - startPnt.x) * 0.5 + startPnt.x,startPnt.y);
			var ctrlP2 = new ED.Point(endPnt.x,startPnt.y + (endPnt.y - startPnt.y) * 0.5);
	    }
	    else {
		    var ctrlP1 = new ED.Point(startPnt.x,(endPnt.y - startPnt.y) * 0.5 + startPnt.y);
			var ctrlP2 = new ED.Point((endPnt.x - startPnt.x) * 0.5 + startPnt.x,endPnt.y);
	    }
	    
	    // draw bezier curve
	    ctx.bezierCurveTo(ctrlP1.x, ctrlP1.y, ctrlP2.x, ctrlP2.y, endPnt.x, endPnt.y);
	}

	ctx.moveTo(this.squiggleArray[0].pointsArray[this.numberOfHandles-1].x, this.squiggleArray[0].pointsArray[this.numberOfHandles-1].y);
	ctx.lineWidth = 0;
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
	ctx.fill();
// 	ctx.stroke();
	ctx.closePath();

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		ctx.lineWidth = 25;
	    ctx.strokeStyle = "rgba(0,70, 255, 0.3)";
	    ctx.shadowColor = "rgba(0,0,0,0.7)";
	    ctx.shadowBlur = 5;
	    ctx.shadowOffsetX = 0;
	    ctx.shadowOffsetY = 2;
		ctx.beginPath();
		ctx.moveTo(this.squiggleArray[0].pointsArray[0].x,this.squiggleArray[0].pointsArray[0].y);
		for (var i=0; i<2; i++) {
		    var startPnt = this.squiggleArray[0].pointsArray[i];
		    var endPnt = this.squiggleArray[0].pointsArray[i+1];
			if (i == 0) {
			    var ctrlP1 = new ED.Point((endPnt.x - startPnt.x) * 0.5 + startPnt.x,startPnt.y);
				var ctrlP2 = new ED.Point(endPnt.x,startPnt.y + (endPnt.y - startPnt.y) * 0.5);
		    }
		    else {
			    var ctrlP1 = new ED.Point(startPnt.x,(endPnt.y - startPnt.y) * 0.5 + startPnt.y);
				var ctrlP2 = new ED.Point((endPnt.x - startPnt.x) * 0.5 + startPnt.x,endPnt.y);
		    }
		    ctx.bezierCurveTo(ctrlP1.x, ctrlP1.y, ctrlP2.x, ctrlP2.y, endPnt.x, endPnt.y);
	    }
	    ctx.moveTo(this.squiggleArray[0].pointsArray[2].x,this.squiggleArray[0].pointsArray[2].y)
		ctx.stroke();
		
		//draw white stripe along ridge
		ctx.lineWidth = 8;
    	ctx.strokeStyle = "rgba(255,255,255,0.7)";
		ctx.beginPath();
		ctx.moveTo(this.squiggleArray[0].pointsArray[0].x,this.squiggleArray[0].pointsArray[0].y);
		for (var i=0; i<2; i++) {
		    var startPnt = this.squiggleArray[0].pointsArray[i];
		    var endPnt = this.squiggleArray[0].pointsArray[i+1];
			if (i == 0) {
			    var ctrlP1 = new ED.Point((endPnt.x - startPnt.x) * 0.5 + startPnt.x,startPnt.y);
				var ctrlP2 = new ED.Point(endPnt.x,startPnt.y + (endPnt.y - startPnt.y) * 0.5);
		    }
		    else {
			    var ctrlP1 = new ED.Point(startPnt.x,(endPnt.y - startPnt.y) * 0.5 + startPnt.y);
				var ctrlP2 = new ED.Point((endPnt.x - startPnt.x) * 0.5 + startPnt.x,endPnt.y);
		    }
		    
		    // draw bezier curve
		    ctx.bezierCurveTo(ctrlP1.x, ctrlP1.y, ctrlP2.x, ctrlP2.y, endPnt.x, endPnt.y);
	    }
	    ctx.moveTo(this.squiggleArray[0].pointsArray[2].x,this.squiggleArray[0].pointsArray[2].y)
		ctx.stroke();
	}
	
	// Coordinates of expert handles (in canvas plane)
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}


/**
 * Determines whether the macula is off or not
 * Uses point in polygon method, to determine the number of times the shape crosses a straight line that terminates at the point
 ** if it is even, it is not in the shape, if odd it is.
 *
 * Maria Cross
 *
 * @returns {Bool} True if macula is off
 */
ED.ROPRD.prototype.isMacOff = function() {
    var intersectCounter = 0;
    var xIntercepts = [];
    var yIntercepts = [];
   
    // center of macula gives end point for horizontal line
    var mac = drawingEdit.lastDoodleOfClass('MaculaMark');
    var ly = mac.originY;
    var lx = mac.originX;
    
    // define points in each bezier curves and push to array
	var phi = 2 * Math.PI / (3 * this.numberOfHandles);
	var bezierArray = [];
    for (var i = 0; i < this.numberOfHandles; i++) {
		var fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		var tp = this.squiggleArray[0].pointsArray[toIndex];
		var cp1 = fp.tangentialControlPoint(+phi);
		var cp2 = tp.tangentialControlPoint(-phi);
		var newBezier = [fp.x, fp.y, cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y];
		bezierArray.push(newBezier);
	}


    for (var i=0; i<bezierArray.length; i++) {
	    // translate coordinates from doodle plane to drawing plane
        var x1 = Math.cos(this.rotation) * (bezierArray[i][0]) - Math.sin(this.rotation) * (bezierArray[i][1]) + this.originX;
        var y1 = Math.cos(this.rotation) * (bezierArray[i][1]) + Math.sin(this.rotation) * (bezierArray[i][0]) + this.originY;
        var x2 = Math.cos(this.rotation) * (bezierArray[i][2]) - Math.sin(this.rotation) * (bezierArray[i][3]) + this.originX;
        var y2 = Math.cos(this.rotation) * (bezierArray[i][3]) + Math.sin(this.rotation) * (bezierArray[i][2]) + this.originY;
        var x3 = Math.cos(this.rotation) * (bezierArray[i][4]) - Math.sin(this.rotation) * (bezierArray[i][5]) + this.originX;
        var y3 = Math.cos(this.rotation) * (bezierArray[i][5]) + Math.sin(this.rotation) * (bezierArray[i][4]) + this.originY;
        var x4 = Math.cos(this.rotation) * (bezierArray[i][6]) - Math.sin(this.rotation) * (bezierArray[i][7]) + this.originX;
        var y4 = Math.cos(this.rotation) * (bezierArray[i][7]) + Math.sin(this.rotation) * (bezierArray[i][6]) + this.originY;
        
        var LUT_x = [], LUT_y = [];
        for(var n=0; n<100; n++) {
            var t = n/100;
            LUT_x.push( (1-t)*(1-t)*(1-t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4 );
            LUT_y.push( (1-t)*(1-t)*(1-t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4 );
        }
        
        var tPercent = [0,13,25,38,50,63,75,88,99];
        var counter = 0;
        var lowMatches = [];
        var highMatches =[];
        
        for (var j=0; j<tPercent.length;j++) {
            var low = tPercent[j];
            var high = tPercent[j+1];
            var mid = Math.round((low + high) / 2);
            if (LUT_x[high]<=lx+2) {
                if (LUT_y[low]<=ly && LUT_y[high]>=ly) {
                    lowMatches.push(low);
                    highMatches.push(high);
                }
                else if (LUT_y[high]<=ly && LUT_y[low]>=ly) {
                    lowMatches.push(low);
                    highMatches.push(high);
                }
            }
        }
        
        do {
            counter++;
            for (var k=0; k< lowMatches.length; k++) {
                var low = lowMatches[k];
                var high = highMatches[k];
                var mid = Math.round((low + high) / 2);
                if ((LUT_y[low]<=ly && LUT_y[mid]>=ly) || (LUT_y[mid]<=ly && LUT_y[low]>=ly)) {
                    highMatches.splice(k,1,mid);
                }
                else lowMatches.splice(k,1,mid);
            }
        } while (counter<=150);
        
        var closestMatch = '';
        var closestIntercept = '';
        for (var l=0; l< lowMatches.length; l++) {
            var low = lowMatches[l];
            var high = highMatches[l];
            var mid = Math.round((low + high) / 2);	            
            
            if (xIntercepts.indexOf(LUT_x[mid])<0 && yIntercepts.indexOf(LUT_y[mid])<0 && LUT_x[mid]<=lx+2)  {
                intersectCounter++;
                xIntercepts.push(LUT_x[mid]);
                yIntercepts.push(LUT_y[mid]);
                
/*
	            var ctx = this.drawing.context;
		        ctx.strokeStyle = "pink";
		        ctx.lineWidth = 3;
		        ctx.beginPath();
		        ctx.moveTo(LUT_x[mid],LUT_y[mid]);
		        ctx.arc(LUT_x[mid],LUT_y[mid],8,0,2*Math.PI);
		        ctx.lineTo(lx,ly)
		        ctx.closePath();
		        ctx.stroke();
*/
            }
        }
    }
    if (intersectCounter % 2 == 0) return false;
	else return true;
	
}


ED.ROPRD.prototype.zoning = function() {
    var dX = +69 * this.dir;
    var dY = 0;

    var closestPoints = [];
    // define points in each bezier curves and push to array
	var phi = 2 * Math.PI / (3 * this.numberOfHandles);
	var bezierArray = [];
    for (var i = 0; i < this.numberOfHandles; i++) {
		var fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		var tp = this.squiggleArray[0].pointsArray[toIndex];
		var cp1 = fp.tangentialControlPoint(+phi);
		var cp2 = tp.tangentialControlPoint(-phi);
		var newBezier = [fp.x, fp.y, cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y];
		bezierArray.push(newBezier);
	}
	
	for (var i=0; i<bezierArray.length; i++) {
	    // translate coordinates from doodle plane to drawing plane
        var x1 = Math.cos(this.rotation) * (bezierArray[i][0]) - Math.sin(this.rotation) * (bezierArray[i][1]) + this.originX;
        var y1 = Math.cos(this.rotation) * (bezierArray[i][1]) + Math.sin(this.rotation) * (bezierArray[i][0]) + this.originY;
        var x2 = Math.cos(this.rotation) * (bezierArray[i][2]) - Math.sin(this.rotation) * (bezierArray[i][3]) + this.originX;
        var y2 = Math.cos(this.rotation) * (bezierArray[i][3]) + Math.sin(this.rotation) * (bezierArray[i][2]) + this.originY;
        var x3 = Math.cos(this.rotation) * (bezierArray[i][4]) - Math.sin(this.rotation) * (bezierArray[i][5]) + this.originX;
        var y3 = Math.cos(this.rotation) * (bezierArray[i][5]) + Math.sin(this.rotation) * (bezierArray[i][4]) + this.originY;
        var x4 = Math.cos(this.rotation) * (bezierArray[i][6]) - Math.sin(this.rotation) * (bezierArray[i][7]) + this.originX;
        var y4 = Math.cos(this.rotation) * (bezierArray[i][7]) + Math.sin(this.rotation) * (bezierArray[i][6]) + this.originY;
        
        var T = [0.0,0.125,0.25,0.375,0.50,0.625,0.75,0.875,1];
            var closestD = '';
            var closestP = new Object();
            
            for (var j=0; j<T.length; j++) {
                var t = T[j];
                var x = (1-t)*(1-t)*(1-t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4;
                var y = (1-t)*(1-t)*(1-t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4;				
                var d = Math.sqrt((x-dX)*(x-dX) + (y-dY)*(y-dY));
                if (closestD=='' || d < closestD) {
                    closestD = d;
                    closestP = {
                        x: x,
                        y: y,
                        t: t,
                        d: d
                    }
                }
            }
            closestPoints.push(closestP);
        }
        
        var postPoint = new Object();
        var distanceToPostPoint = 500;
        for (var k=0; k<closestPoints.length; k++) {
            currentD = closestPoints[k].d;
            if (currentD < distanceToPostPoint) {
                distanceToPostPoint = currentD;
                postPoint = closestPoints[k];
            }
        }
        if (distanceToPostPoint < 206) this.zone = "1";
        else if (distanceToPostPoint < 411) this.zone = "2";
        else this.zone = 3;
}


/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ROPRD.prototype.description = function() {
	// Construct description
	var returnString = "";
	returnString = returnString + "Retinal detachment";
	returnString = returnString + (this.isMacOff() ? " (macula off)" : " (macula on)");
	// Return description
	return returnString;
}
