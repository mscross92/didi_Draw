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
 * Ridge - ROP
 *
 * @class ROPRidge
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ROPRidge = function(_drawing, _parameterJSON) {
	this.className = "ROPRidge";
	
	this.savedParameterArray = ['originX','originY','rotation'];

	// private parameters
	this.numberOfAnchors = 2;
	this.numberOfHandles = 4;
	this.anz = 4;
	this.dblFluid = false;
	
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

ED.ROPRidge.prototype = new ED.Doodle;
ED.ROPRidge.prototype.constructor = ED.ROPRidge;
ED.ROPRidge.superclass = ED.Doodle.prototype;

ED.ROPRidge.prototype.setHandles = function() {
    // Array of handles
        // loop making each anchor point a handle -- multiply by 3 when want to add control points :)
    for (var i = 0; i < this.numberOfHandles; i++) {
        this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
    }
    // The first anchor point / handle will also rotate the doodle
	this.handleArray[0].isRotatable = true;
}

ED.ROPRidge.prototype.setPropertyDefaults = function() {
	this.isSelectable = true;
	this.isFilled = false;
	this.isRotatable = true;
	this.isMoveable = true;
	this.addAtBack = true;
	
	this.parameterValidationArray['originX']['range'].setMinAndMax(-1000, +1000);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-1000, +1000);
}

ED.ROPRidge.prototype.setParameterDefaults = function() {
	if (this.drawing.eye != ED.eye.Right) {
		this.dir = -1;
	}
	else if (this.drawing.eye != ED.eye.Left){
		this.dir = +1;
	}
	
	this.zone = "";
		
	// create a squiggle to store points along the curve, and 2 control points for each point
	    // points are needed so can show tortuosity for plus disease (with alter y values for the control points, making the curves wiggly)
	var squiggle = new ED.Squiggle(this, new ED.Colour(100,100,100,1), 4, true);
	
	// add the squiggle to the squiggle array!
	this.squiggleArray.push(squiggle);
	
	// predefine start and end point of bezier
	var point1 = new ED.Point(-480 * this.dir,0);
	this.addPointToSquiggle(point1);
	var point2 = new ED.Point(339.41 * this.dir,339.41);
	this.addPointToSquiggle(point2);

	
	// predefine control points
	var c11 = new ED.Point(-339.41*this.dir,339.41);
	this.addPointToSquiggle(c11);
	
	var c12 = new ED.Point(169.7*this.dir,169.7);
	this.addPointToSquiggle(c12);

}


ED.ROPRidge.prototype.draw = function(_point) {
	var ctx = this.drawing.context;
	
	ED.SupNasalArcade.superclass.draw.call(this, _point);
	
	// bezier points - to, control point 1, control point 2
    var startPnt = this.squiggleArray[0].pointsArray[0];
    var ctrlP1 = this.squiggleArray[0].pointsArray[2];
    var ctrlP2 = this.squiggleArray[0].pointsArray[3];
    var endPnt = this.squiggleArray[0].pointsArray[1];    

    // draw blue line with shadow
    ctx.beginPath();
    ctx.moveTo(startPnt.x,startPnt.y);
    ctx.bezierCurveTo(2*ctrlP1.x-startPnt.x, 2*ctrlP1.y-startPnt.y, 2*ctrlP2.x-endPnt.x, 2*ctrlP2.y-endPnt.y, endPnt.x, endPnt.y);
    ctx.moveTo(endPnt.x,endPnt.y);
    ctx.lineWidth = 25;
//     ctx.lineCap="round";
    ctx.strokeStyle = "rgba(0,70, 255, 0.3)";
    ctx.stroke();
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.closePath();  

    // draw white stripe down centre
    ctx.beginPath();
    ctx.moveTo(startPnt.x,startPnt.y);
    ctx.bezierCurveTo(2*ctrlP1.x-startPnt.x, 2*ctrlP1.y-startPnt.y, 2*ctrlP2.x-endPnt.x, 2*ctrlP2.y-endPnt.y, endPnt.x, endPnt.y);
    ctx.moveTo(endPnt.x,endPnt.y);
    ctx.lineWidth = 8;
//     ctx.lineCap="round";
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.stroke();
    ctx.closePath();
    
    
    
    this.drawBoundary(_point);     

    // if shape is selected, draw control lines
	    // loop for each anchor point
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		if (this.isSelected) {
		    ctx.lineWidth = 4;
            ctx.strokeStyle = "#C00";
            ctx.beginPath();
            for (var i = 0; i < this.numberOfAnchors; i++) {
                ctx.moveTo(this.squiggleArray[0].pointsArray[i + this.numberOfAnchors].x, this.squiggleArray[0].pointsArray[i + this.numberOfAnchors].y);
                ctx.lineTo(this.squiggleArray[0].pointsArray[i].x, this.squiggleArray[0].pointsArray[i].y);
            }
            if (this.fluid) {
                ctx.moveTo(this.squiggleArray[0].pointsArray[5].x, this.squiggleArray[0].pointsArray[5].y);
                ctx.lineTo(this.squiggleArray[0].pointsArray[4].x, this.squiggleArray[0].pointsArray[4].y);
                ctx.lineTo(this.squiggleArray[0].pointsArray[6].x, this.squiggleArray[0].pointsArray[6].y);
            }
            if (this.dblFluid) {
                ctx.moveTo(this.squiggleArray[0].pointsArray[8].x, this.squiggleArray[0].pointsArray[8].y);
                ctx.lineTo(this.squiggleArray[0].pointsArray[7].x, this.squiggleArray[0].pointsArray[7].y);
                ctx.lineTo(this.squiggleArray[0].pointsArray[9].x, this.squiggleArray[0].pointsArray[9].y);
            }
            ctx.stroke();
        }
    }
    
	
	// coordinates for anchor and control points (in canvas plane)
	var noHndles = this.squiggleArray[0].pointsArray.length;
    for (var i = 0; i < this.numberOfHandles; i++) {
        this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
    }

	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	
	
	return this.isClicked;
}

ED.ROPRidge.prototype.description = function() {
	var returnString = "";
	returnString = returnString + "Elevated ridge";
	if (this.fluid) returnString = returnString + " with subretinal fluid";
	return returnString;
}

ED.ROPRidge.prototype.zoning = function() {
    this.zone = "";
    // points used to define bezier
    var startPnt = this.squiggleArray[0].pointsArray[0];
    var cp1 = this.squiggleArray[0].pointsArray[2];
    var cp2 = this.squiggleArray[0].pointsArray[3];
    var endPnt = this.squiggleArray[0].pointsArray[1];
    
    var ctrlP1 = new Object();
    var ctrlP2 = new Object();
    ctrlP1.x = (cp1.x * 2) - startPnt.x;
    ctrlP1.y = (cp1.y * 2) - startPnt.y;
    ctrlP2.x = (cp2.x * 2) - endPnt.x;
    ctrlP2.y = (cp2.y * 2) - endPnt.y;

    // calculate adjusted coordinates of optic disc in doodle plane, given any translations
    var discX = 69 * this.dir - this.originX;
	var discY = 0 - this.originY;
    // then translation matrix, adjusting for rotation transformation
        // nb do not need to adjust for scale of doodle only because you can't change the scale of the ridge...
    var theta = this.rotation;
    var aX = (Math.cos(theta) * discX) + (Math.sin(theta) * discY);
    var aY = (Math.cos(theta) * discY) - (Math.sin(theta) * discX);
    
    if (((startPnt.x - aX)*(startPnt.x - aX) + (startPnt.y - aY)*(startPnt.y - aY)) < (206*206)) this.zone = "1";
    else if (((endPnt.x - aX)*(endPnt.x - aX) + (endPnt.y - aY)*(endPnt.y - aY)) < (206*206)) this.zone = "1";
    // else do some sick math to find the most posterior point (== closest to the optic disc)
        // if postPoint is within circle 1, zone 1 else if within circle 2, zone 2, else zone 3.
        // for reference: Chen et al. 2007 https://hal.archives-ouvertes.fr/file/index/docid/518379/filename/Xiao-DiaoChen2007c.pdf
    
    else {
        // uses equation of bezier to estimate point closest to the optic disc
            // this point to defines which zone is in
            // zone is therefore defined by the most posterior point
        var allPoints = new Array();
        // define x and y coordinates for 5 points evenly spaced out in time along curve, and push to allPoints array
            // start and end points are known... the middle 3 are calculated below in the pntsRry
        allPoints.push(startPnt);
        allPoints[0].pcnt = 1;

        var pntsRry = [0.125,0.25,0.375,0.5,0.625,0.75,0.875];
        for (var i = 0; i < pntsRry.length; i++) {
            var t = pntsRry[i];
            var B1 = t*t*t;
            var B2 = 3*t*t*(1-t);
            var B3 = 3*t*(1-t)*(1-t);
            var B4 = (1-t)*(1-t)*(1-t);

            pos = {
                x : startPnt.x*B1 + ctrlP1.x*B2 + ctrlP2.x*B3 + endPnt.x*B4,
                y : startPnt.y*B1 + ctrlP1.y*B2 + ctrlP2.y*B3 + endPnt.y*B4,
                pcnt : pntsRry[i]
            };
            allPoints.push(pos);
        }
        allPoints.push(endPnt);
        allPoints[7].pcnt = 0;

        var currentR = "";
        var closestR = "";
        var closestPnt = "";

        // calculate which of the points is closest to the optic disc
        for (var i = 0; i < allPoints.length; i++) {
            var pnt = allPoints[i];
            currentR = currentR = Math.sqrt(((pnt.x-aX)*(pnt.x-aX))+((pnt.y-aY)*(pnt.y-aY)));
            if ((currentR < closestR) || closestR=="") {
                closestR = currentR;
                closestPnt = allPoints[i];
            }
        }
    
        var count = 3;
        var ft;
    
        // now have a starting estimate, loop using a binary search, until reach a point of accuracy... **TODO TWEAK ACCURACY**
        do {
            count++;
            // this will increase with each looping, narrowing the search and becoming more accurate
            ft = 1 / (Math.pow(2, count)); 
            var pntsARry = [closestPnt.pcnt - ft, closestPnt.pcnt, closestPnt.pcnt + ft];
        
            currentR = "";
            closestR = "";
            closestPnt = "";
            var results = new Object();
            for (var i = 0; i < pntsARry.length; i++) {
                var t = pntsARry[i];
                // t cannot excede limits as defined in bezier function (0 and 1!)...
                if (t < 0) t = 0;
                if (t > 1) t = 1;

                var B1 = t*t*t;
                var B2 = 3*t*t*(1-t);
                var B3 = 3*t*(1-t)*(1-t);
                var B4 = (1-t)*(1-t)*(1-t);

                pos = {
                    x : startPnt.x*B1 + ctrlP1.x*B2 + ctrlP2.x*B3 + endPnt.x*B4,
                    y : startPnt.y*B1 + ctrlP1.y*B2 + ctrlP2.y*B3 + endPnt.y*B4,
                    pcnt : t
                };
                allPoints.push(pos);
            }
            for (var i = 0; i < allPoints.length; i++) {
                var pnt = allPoints[i];
                currentR = Math.sqrt(((pnt.x-aX)*(pnt.x-aX)) + ((pnt.y-aY)*(pnt.y-aY)));
                if ((currentR < closestR) || closestR=="") {
                    closestR = currentR;
                    closestPnt = allPoints[i];
                }
            }
        } while (ft >= 0.001);
        
        // reverse the translation matrix...
        var theta = this.rotation;
        var pstPX = (Math.cos(theta) * closestPnt.x) - (Math.sin(theta) * closestPnt.y) + this.originX;
        var pstPY = (Math.cos(theta) * closestPnt.y) + (Math.sin(theta) * closestPnt.x) + this.originY;
        var dist = Math.sqrt(((pstPX - 69 * this.dir)*(pstPX - 69 * this.dir)) + ((pstPY)*(pstPY)));
        
        results = {
            postPoint : new ED.Point(pstPX,pstPY),
            distance : dist,
            accuracyFactor : ft
        }
        
        if (results.distance < 206) this.zone = "1";
        else if (results.distance < 411) this.zone = "2";
        else this.zone = 3;
    }
//     var pX = results.postPoint.x;
// 	var pY = results.postPoint.y;
//     
//     var ctx = this.drawing.context;
//     ctx.beginPath();
//     ctx.moveTo(69,0);
//     ctx.lineTo(pX, pY);
//     ctx.moveTo(pX+5,pY);
//     ctx.arc(pX,pY,5,0,2*Math.PI);
//     ctx.lineWidth = 5;
//     ctx.fill();
//     ctx.stroke();
//     ctx.closePath();
    
//     document.getElementById("REcomments").value = results.distance;
}
