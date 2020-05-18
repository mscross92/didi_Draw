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
 * Nasal Arcade - inferior
 *
 * @class InfNasalArcade
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.InfNasalArcade = function(_drawing, _parameterJSON) {
	this.className = "InfNasalArcade";
	this.title = "inferonasal";
		
	this.savedParameterArray = ['originX','originY','scaleX','scaleY','nvBool2'];
	
	this.controlParameterArray = {
		'tortuosity':'Tortuosity',
		'nvBool2' : 'Neovascularisation',
		};
	
	//derived parameters
	this.prePlus = false;
	this.plus = false;
	this.neoVasc = false;
	this.nvBool = false;
	this.nvBool2 = false;
	this.plusFactor = 0;
	this.plusWidth = 1;
	this.APROP = false;
	this.tortuosity = 0;
	
	// private parameters
	this.numberOfPoints = 7;
	this.numberOfCurves = 6;
	this.plusWidth = +1;
	
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

ED.InfNasalArcade.prototype = new ED.Doodle;
ED.InfNasalArcade.prototype.constructor = ED.InfNasalArcade;
ED.InfNasalArcade.superclass = ED.Doodle.prototype;

ED.InfNasalArcade.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

ED.InfNasalArcade.prototype.setPropertyDefaults = function() {
	this.isSelectable = true;
	this.isDeletable = false;
	this.isFilled = false;
	this.isSqueezable = true;
	this.isRotatable = true;
	this.isMoveable = false;

	
	this.parameterValidationArray['neoVasc'] = {
		kind: 'derived',
		type: 'string',
		list: ['true','false'],
		animate: true
	};
	
	this.parameterValidationArray['nvBool'] = {
	    kind: 'derived',
		type: 'bool',
		animate: false
	};
	this.parameterValidationArray['nvBool2'] = {
	    kind: 'derived',
		type: 'bool',
		animate: false
	};
	
	this.parameterValidationArray['prePlus'] = {
		kind: 'derived',
		type: 'string',
		list: ['true','false'],
		animate: true
	};
	
	this.parameterValidationArray['plusFactor'] = {
	    kind: 'derived',
		type: 'int',
		animate: false
	};
	
	this.parameterValidationArray['plus'] = {
		kind: 'derived',
		type: 'string',
		list: ['true','false'],
		animate: true
	};
	
	this.parameterValidationArray['plusWidth'] = {
	    kind: 'derived',
		type: 'int',
		animate: false
	};
	
	this.parameterValidationArray['APROP'] = {
		kind: 'derived',
		type: 'string',
		list: ['true','false'],
		animate: true
	};
	
	this.parameterValidationArray['tortuosity'] = {
		kind: 'derived',
		type: 'range',
		animate: false
	};
	this.parameterValidationArray['tortuosity2'] = {
		kind: 'derived',
		type: 'int',
		range: new ED.Range(0, 100),
		animate: true
	};
}


ED.InfNasalArcade.prototype.setParameterDefaults = function() {
    
    // Set the edge of the otic disc as the centre for doodle
        // ensures handle in correct position on rotation!
    // Position different in each eye!
	if (this.drawing.eye != ED.eye.Right) {
		this.originX = -69;
		this.dir = -1;
	}
	else if (this.drawing.eye != ED.eye.Left){
		this.originX = +69;
		this.dir = +1;
	}
	this.originY = +17;
	
	
	// create a squiggle to store points along the curve, and 2 control points for each point
	    // points are needed so can show tortuosity for plus disease (alter y values for the control points, making the curves wiggly)
	var squiggle = new ED.Squiggle(this, new ED.Colour(100,100,100,1), 4, true);
	
	// add the squiggle to the squiggle array!
	this.squiggleArray.push(squiggle);
	
	// predefine 5 points along arcade, and push to points array
	    // points are not evenly spaced just so looks fun when tortuous...
	var point1 = new ED.Point(170 * this.dir,40);
	this.addPointToSquiggle(point1);
	var point2 = new ED.Point(142 * this.dir,77);
	this.addPointToSquiggle(point2);
	var point3 = new ED.Point(85 * this.dir,70);
	this.addPointToSquiggle(point3);
	var point4 = new ED.Point(40 * this.dir,48);
	this.addPointToSquiggle(point4);
	var point5 = new ED.Point(18 * this.dir,28);
	this.addPointToSquiggle(point5);
	var point6 = new ED.Point(13 * this.dir,22);
	this.addPointToSquiggle(point6);
	var point7 = new ED.Point(0 * this.dir,0);
	this.addPointToSquiggle(point7);
	
	
	// predefine control points - 2 for each bezier, and push to points array
	    // points defined in order, starting furthest away from the optic disc
	var c11 = new ED.Point(164*this.dir,75);
	this.addPointToSquiggle(c11);
	var c21 = new ED.Point(121*this.dir,77);
	this.addPointToSquiggle(c21);
	var c31 = new ED.Point(69*this.dir,66);
	this.addPointToSquiggle(c31);
	var c41 = new ED.Point(30*this.dir,41);
	this.addPointToSquiggle(c41);
	var c51 = new ED.Point(16*this.dir,26);
	this.addPointToSquiggle(c51);
	var c61 = new ED.Point(7*this.dir,13);
	this.addPointToSquiggle(c61);
	var c71 = new ED.Point(0,0);
	this.addPointToSquiggle(c71);
	
	var c12 = new ED.Point(158*this.dir,77);
	this.addPointToSquiggle(c12);
	var c22 = new ED.Point(108*this.dir,76);
	this.addPointToSquiggle(c22);
	var c32 = new ED.Point(54*this.dir,58);
	this.addPointToSquiggle(c32);
	var c42 = new ED.Point(26*this.dir,36);
	this.addPointToSquiggle(c42);
	var c52 = new ED.Point(15*this.dir,24);
	this.addPointToSquiggle(c52);
	var c62 = new ED.Point(3*this.dir,9);
	this.addPointToSquiggle(c62);
	var c72 = new ED.Point(0,0);
	this.addPointToSquiggle(c72);
}


ED.InfNasalArcade.prototype.dependentParameterValues = function(_parameter, _value) {
    var returnArray = new Array();
    
	switch (_parameter) {
		case 'neoVasc':
			if (_value =="false") {
			    returnArray['nvBool'] = false;
			    returnArray['nvBool2'] = false;
			}
			else if (_value == "true") {
			    returnArray['nvBool'] = true;
			    returnArray['nvBool2'] = true;
			}
			break;
		case 'nvBool2':
			if (_value == true) {
			    returnArray['nvBool'] = true;
			    returnArray['neoVasc'] = "true";
			}
			else if (_value == false){
			    returnArray['nvBool'] = false;
			    returnArray['neoVasc'] = "false";
			}
			break;

		case 'prePlus':
			if (_value =="false") {
			    returnArray['plusFactor'] = 0;
			    returnArray['plusWidth'] = 1;
			    returnArray['tortuosity'] = 0;
			}
			else  {
			    returnArray['plusFactor'] = 30;
			    returnArray['tortuosity'] = 30;
			    returnArray['plusWidth'] = 1.5;
			}
			break;
		case 'plus':
			if (_value =="false") {
			    returnArray['plusFactor'] = 0;
			    returnArray['plusWidth'] = 1;
			    returnArray['tortuosity'] = 0;
			    returnArray['plus'] = "false";
			}
			else {
			    returnArray['plusFactor'] = 70;
			    returnArray['tortuosity'] = 70;
			    returnArray['plusWidth'] = 3;
			    returnArray['plus'] = "true";
			}
			break;
		case 'APROP':
			if (_value =="false") {
			    returnArray['plusFactor'] = 0;
			    returnArray['plusWidth'] = 1;
			    returnArray['tortuosity'] = 0;
			    returnArray['plus'] = "false";
			}
			else {
			    returnArray['plusFactor'] = 70;
			    returnArray['tortuosity'] = 70;
			    returnArray['plusWidth'] = 3;
			    returnArray['plus'] = "true";
			}
			break;
			
		case 'tortuosity':
		    returnArray['tortuosity2'] = _value * 1;
			break;
		case 'tortuosity2':
		    returnArray['plusFactor'] = _value * 1.2;
		    returnArray['plusWidth'] = 1 + _value * 0.02;
		    
		    if (_value < 30) {
		        returnArray['prePlus'] = "false";
		        returnArray['plus'] = "false";
		    }
		    if (_value > 29 && _value < 70) {
		        returnArray['prePlus'] = "true";
		        returnArray['plus'] = "false";
		    }
		    if (_value >= 70) {
		        returnArray['prePlus'] = "false";
		        returnArray['plus'] = "true";
		    }
			break;
	}

	return returnArray;
}


ED.InfNasalArcade.prototype.draw = function(_point) {	
	var ctx = this.drawing.context;
	
	ED.SupNasalArcade.superclass.draw.call(this, _point);
	
	
	// bezier points - to, control point 1, control point 2
    var toIndex;
    var toAnch;
    var ctrlP1;
    var ctrlP2;
    
    // start curve at the first anchor point, anterior to the disc
    ctx.beginPath();
    ctx.moveTo(170*this.dir,40);
    
    
	// bezier curves between all other points
        // some control points +/- plusFactor in y direction
            // used to indicate presence tortuous vessels observed in plus disease
            // different for loops used to differentiate which control points change
    for (var i = 1; i < 3; i++) {
        toIndex = i + 1;
        toAnch = this.squiggleArray[0].pointsArray[toIndex];
        ctrlP1 = this.squiggleArray[0].pointsArray[i + this.numberOfPoints];
        ctrlP2 = this.squiggleArray[0].pointsArray[toIndex + this.numberOfPoints + this.numberOfCurves];
        ctx.bezierCurveTo(ctrlP1.x, ctrlP1.y - this.plusFactor, ctrlP2.x, ctrlP2.y + this.plusFactor, toAnch.x, toAnch.y);
    }

    toAnch = this.squiggleArray[0].pointsArray[4];
    ctrlP1 = this.squiggleArray[0].pointsArray[3 + this.numberOfPoints];
    ctrlP2 = this.squiggleArray[0].pointsArray[4 + this.numberOfPoints + this.numberOfCurves];
    ctx.bezierCurveTo(ctrlP1.x, ctrlP1.y - this.plusFactor, ctrlP2.x, ctrlP2.y, toAnch.x, toAnch.y);

    for (var i = 4; i < this.numberOfCurves; i++) {
        var toIndex = i + 1;
        toAnch = this.squiggleArray[0].pointsArray[toIndex];
        ctrlP1 = this.squiggleArray[0].pointsArray[i + this.numberOfPoints];
        ctrlP2 = this.squiggleArray[0].pointsArray[toIndex + this.numberOfPoints + this.numberOfCurves];
        ctx.bezierCurveTo(ctrlP1.x, ctrlP1.y, ctrlP2.x, ctrlP2.y, toAnch.x, toAnch.y);
    }
    
    ctx.moveTo(0,0);
    ctx.lineWidth = 4 * this.plusWidth / this.scaleY;
	ctx.strokeStyle = "red";
	ctx.stroke();
    ctx.closePath();

	this.drawBoundary(_point);
	
	if (this.nvBool) {
        ctx.beginPath();
        ctx.moveTo(this.squiggleArray[0].pointsArray[1].x-(10*this.dir),this.squiggleArray[0].pointsArray[1].y-7);
        ctx.lineTo(this.squiggleArray[0].pointsArray[1].x+(50*this.dir),this.squiggleArray[0].pointsArray[1].y + 50);
        ctx.moveTo(this.squiggleArray[0].pointsArray[1].x+(20*this.dir),this.squiggleArray[0].pointsArray[1].y+20);
        ctx.lineTo(this.squiggleArray[0].pointsArray[1].x+(60*this.dir),this.squiggleArray[0].pointsArray[1].y + 25);
        ctx.moveTo(this.squiggleArray[0].pointsArray[1].x+(20*this.dir),this.squiggleArray[0].pointsArray[1].y+20);
        ctx.lineTo(this.squiggleArray[0].pointsArray[1].x,this.squiggleArray[0].pointsArray[1].y + 50);
        ctx.moveTo(this.squiggleArray[0].pointsArray[0].x+(25*this.dir),this.squiggleArray[0].pointsArray[0].y + 30);
        ctx.lineTo(this.squiggleArray[0].pointsArray[1].x+(10*this.dir),this.squiggleArray[0].pointsArray[1].y-18);
        if (this.plus || this.prePlus) ctx.lineWidth = 7 / this.scaleY;
        else ctx.lineWidth = 4 / this.scaleY;
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
    }
	this.handleArray[0].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[0]);

	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);
	return this.isClicked;
}

ED.InfNasalArcade.prototype.isPlus = function() {
	if (this.plus=="true") return true;
	else return false;
}
