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
 * ROP MaculaMark template with disc and fovea, and marked zones for classification. Natively right eye, flip for left eye
 *
 * @class MaculaMark
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.MaculaMark = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "MaculaMark";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.MaculaMark.prototype = new ED.Doodle;
ED.MaculaMark.prototype.constructor = ED.MaculaMark;
ED.MaculaMark.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.MaculaMark.prototype.setPropertyDefaults = function() {
	this.isSelectable = true;
	this.isDeletable = false;
	this.isFilled = false;
	this.showsToolTip = false;
	this.addAtBack = true;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.MaculaMark.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.MaculaMark.superclass.draw.call(this, _point);

    if (this.drawing.eye != ED.eye.Right) {
		var cX = 10;
	} else if (this.drawing.eye != ED.eye.Left){
		var cX = -10;
	}
	
	// Fovea
//     ctx.beginPath();
// 	ctx.moveTo(cX,11);
// 	ctx.arc(cX,0,15,0,2*Math.PI);
// 	ctx.fillStyle = "white";
// 	ctx.strokeStyle = "white";
// 	ctx.fill();
// 	ctx.stroke();

	ctx.moveTo(cX,11);
	ctx.lineTo(cX,-11);
	ctx.moveTo(11+cX,0);
	ctx.lineTo(-11+cX,0);
	ctx.strokeStyle = "red";
	ctx.lineWidth=4;
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.moveTo(cX,11);
	ctx.arc(cX,0,15,0,2*Math.PI);
	ctx.fillStyle = "rgba(255, 255, 255, 0)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0)";
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	
	
	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Non boundary paths
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	}


	// Return value indicating successful hittest
	return this.isClicked;
}
