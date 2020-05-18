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
 * ROP ROPFundus template with disc and fovea, and marked zones for classification. Natively right eye, flip for left eye
 *
 * @class ROPFundus
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ROPFundus = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ROPFundus";

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ROPFundus.prototype = new ED.Doodle;
ED.ROPFundus.prototype.constructor = ED.ROPFundus;
ED.ROPFundus.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.ROPFundus.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
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
ED.ROPFundus.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ROPFundus.superclass.draw.call(this, _point);

	// Ora / Zone 3 boundary
	ctx.beginPath();
	ctx.arc(0, 0, 480, 0, Math.PI * 2, true);
	ctx.closePath();

	// Set line attributes for zones
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = "grey";
	ctx.setLineDash([20,15]);
	ctx.fillStyle = "white";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

    // Non boundary paths
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// These values different for right and left side - X coordinate of optic disc
		if (this.drawing.eye != ED.eye.Right) {
			var cX = -69;
		} else if (this.drawing.eye != ED.eye.Left){
			var cX = 69;
		}

    // Zone 2 boundary
	ctx.moveTo(cX+411, 0);
	ctx.arc(cX, 0, 411, 0, Math.PI * 2, true);
	
    // Zone 1 boundary
	ctx.moveTo(cX+206, 0);
	ctx.arc(cX, 0, 206, 0, Math.PI * 2, true);
	
	// Draw Zones 1-3
	ctx.stroke();

	// Optic disc
	ctx.beginPath();
	ctx.arc(cX, 0, 17, 0, Math.PI * 2, true);
	ctx.fill();
	
	
// Fovea
// 	ctx.moveTo(0,11);
// 	ctx.lineTo(0,-11);
// 	ctx.moveTo(11,0);
// 	ctx.lineTo(-11,0);
// 	ctx.strokeStyle = "red";
// 	ctx.lineWidth=3;
// 	ctx.setLineDash([]);
// 	ctx.stroke();
// 	ctx.closePath();
// 	
// 	ctx.beginPath();
// 	ctx.arc(0,10,10,0,Math.PI * 2, true);
// 	ctx.fill();
// 	ctx.closePath();
	
	}


	// Return value indicating successful hittest
	return this.isClicked;
}
