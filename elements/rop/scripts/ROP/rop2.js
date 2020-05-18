var drawingEdit2;
var stageLE = "0";
var zoneLE = "";
var plusStrng2 = "";
var prePlusStrng2 = "";


function clearLE() {
	var statusRadio = document.getElementsByName("statusL");
	for(var i=0;i<statusRadio.length;i++) statusRadio[i].checked = false;
}

/////
// Functions for form calculations
/////
function changeStateLE() {
    var plusAnz = 0;
    var isPls = false;
    var prePlusAnz = 0;
    var isPrPls = false;
    var isAPRP = false;
    var plusAnzb = 0;
    
    var INA = drawingEdit2.lastDoodleOfClass('InfNasalArcade');
    var ITA = drawingEdit2.lastDoodleOfClass('InfTempArcade');
    var SNA = drawingEdit2.lastDoodleOfClass('SupNasalArcade');
    var STA = drawingEdit2.lastDoodleOfClass('SupTempArcade');
    
    var arcades = [INA,ITA,SNA,STA];
    
    plusStrng = "";
    prePlusStrng = "";
    for (var i = 0; i < arcades.length; i++) {
        if (arcades[i].plus == "true") {
            plusAnz++;
//             plusStrng = plusStrng + ", " + arcades[i].title;
        }
        else if (arcades[i].ppBool == "true") {
            prePlusAnz++;
//             prePlusStrng = prePlusStrng + ", " + arcades[i].title;
        }
    }
    
    plusStrng = plusStrng.substring(2);
    prePlusStrng = prePlusStrng.substring(2);

// 	if (plusAnz==4) document.getElementById('APROPLE').checked = true;
    if (plusAnz>=2) document.getElementById('plusLE').checked = true;    
    else if (prePlusAnz>=2) document.getElementById('prePlusLE').checked = true;
    else {
	    var statusRadio = document.getElementsByName("statusR");
	    for(var i=0;i<statusRadio.length;i++) statusRadio[i].checked = false;
	}

/*
	if (plusAnz==4) document.getElementById('APROPLE').checked = true;
    
    if ((plusAnz>=2 && plusAnz<4)) document.getElementById('plusLE').checked = true; 
    else document.getElementById('plusLE').checked = false;
    
    if (prePlusAnz>=2) document.getElementById('prePlusLE').checked = true;
    else document.getElementById('prePlusLE').checked = false;
*/
    
/*
    else {
	    var statusRadio = document.getElementsByName("statusL");
	    for(var i=0;i<statusRadio.length;i++) statusRadio[i].checked = false;
	}
*/
}


function isAPROP2() {
    if (document.getElementById("APROPLE").checked == true) return true;
    else return false;
}

function isPlusD2() {
    if (document.getElementById("plusLE").checked == true) return true;
    else return false;
}

function isPrePlusD2() {
    if (document.getElementById("prePlusLE").checked == true) return true;
    else return false;
}


function changeStageLE() {
    stageLE = document.getElementById("stageLE").value;
        
    if (stageLE=="5") {
/*
        if (!drawingEdit2.hasDoodleOfClass('ROPRRD')) drawingEdit2.addDoodle('ROPRRD');
        var RRD = drawingEdit2.lastDoodleOfClass('ROPRRD');
        if (RRD.arc !== 2 * Math.PI) {
	        RRD.arc = 2 * Math.PI;
	        drawingEdit2.deselectDoodles();
	        ropCalculator2();
		}
*/
        document.getElementById("totalRDLE").style.display="block";
        stageLE = 5;
	}
    else {
        document.getElementById("openFunnelLE").checked=false;
        document.getElementById("closedFunnelLE").checked=false;
        document.getElementById("totalRDLE").style.display="none";
    }
    
/*
    if (stageLE=="4b (macula off)") {
	    var orgnX = (zoneLE-1) * 160;
        if (!drawingEdit2.hasDoodleOfClass('ROPRD')) {
	        if (!drawingEdit2.hasDoodleOfClass('ROPRRD')) drawingEdit2.addDoodle('ROPRD',{'originX':orgnX});
	    }
	}
	else if (stageLE=="4a (macula on)") {
		var orgnX = (zoneLE-1) * 160;
        if (!drawingEdit2.hasDoodleOfClass('ROPRD')) {
	        if (!drawingEdit2.hasDoodleOfClass('ROPRRD')) drawingEdit2.addDoodle('ROPRD',{'originX':orgnX});
	    }
	}
	else if (stageLE==3) {
		var orgnX = (zoneLE-1) * 160;
        if (!drawingEdit2.hasDoodleOfClass('ROPstage3')) drawingEdit2.addDoodle('ROPstage3',{'originX':orgnX});
	}
	else if (stageLE==2) {
		var orgnX = (zoneLE-1) * 160;
        if (!drawingEdit2.hasDoodleOfClass('ROPRidge')) drawingEdit2.addDoodle('ROPRidge',{'originX':orgnX});
	}
	else if (stageLE==1) {
		var orgnX = (zoneLE-1) * 160;
        if (!drawingEdit2.hasDoodleOfClass('ROPDemarcationLine')) drawingEdit2.addDoodle('ROPDemarcationLine',{'originX':orgnX});
	}
*/
    
    zoneLE = document.getElementById("zoneLE").value;
    addToReport2();
}

function changeZoneLE() {
    zoneLE = document.getElementById("zoneLE").value;
    addToReport2();
}


// calculate zone and stage
    // & push to form selectors 
    // also used in report function
function ropCalculator2() {
    var INA = drawingEdit2.lastDoodleOfClass('InfNasalArcade');
    var ITA = drawingEdit2.lastDoodleOfClass('InfTempArcade');
    var SNA = drawingEdit2.lastDoodleOfClass('SupNasalArcade');
    var STA = drawingEdit2.lastDoodleOfClass('SupTempArcade');
    
    var stg = document.getElementById("stageLE");
    var zn = document.getElementById("zoneLE");
    
    var doodleArray = drawingEdit2.doodleArray;
    
    var countArray = [];
    countArray['ROPDemarcationLine'] = 0;
    countArray['ROPRidge'] = 0;
    countArray['ROPstage3'] = 0;
    countArray['ROPRD'] = 0;
    countArray['ROPRRD'] = 0;
    
    for (var i = 0; i < doodleArray.length; i++) {
        doodle = doodleArray[i];
        countArray[doodle.className]++;
    }
    
    // calculate the stage from drawing
    if (countArray['ROPRRD'] > 0) {
        var RRD = drawingEdit2.lastDoodleOfClass('ROPRRD');
        if (RRD.isTotalDetach()) stageLE = "5";
        else if (RRD.isMacOff()) stageLE = "4b (macula off)";
        else stageLE = "4a (macula on)";
    }
    else if (countArray['ROPRD'] > 0) {
        var TRD = drawingEdit2.lastDoodleOfClass('ROPRD');
        if (TRD.isMacOff()) stageLE = "4b (macula off)";
        else stageLE = "4a (macula on)";
    }
    else if (countArray['ROPstage3'] > 0) stageLE = "3";
    else if (countArray['ROPRidge'] > 0) stageLE = "2";
    else if (countArray['ROPDemarcationLine'] > 0) stageLE = "1";
    else stageLE = "0";
    
    stg.value = stageLE;
    
    
    // calculate the zone from drawing
    if (countArray['ROPRRD'] > 0) {
//         var RRD = drawingEdit2.lastDoodleOfClass('ROPRRD');
//         RRD.zoning();
        zoneLE = "1";
    }
    else if (countArray['ROPRD'] > 0) {
        var TRD = drawingEdit2.lastDoodleOfClass('ROPRD');
        TRD.zoning();
        zoneLE = TRD.zone;
    }
    else if (countArray['ROPstage3'] > 0) {
        var neovasc = drawingEdit2.lastDoodleOfClass('ROPstage3');
        neovasc.zoning();
        zoneLE = neovasc.zone;
    }
    else if (countArray['ROPRidge'] > 0) {
        var ridge = drawingEdit2.lastDoodleOfClass('ROPRidge');
        ridge.zoning();
        zoneLE = ridge.zone;
    }
    else if (countArray['ROPDemarcationLine'] > 0) {
        var line = drawingEdit2.lastDoodleOfClass('ROPDemarcationLine');
        line.zoning();
        zoneLE = line.zone;
    }
    
    zn.value = zoneLE;
    changeStageLE();
}


/////
// Functions for reports
/////
function addToReport2() { 
    var reports = drawingEdit2.report();
    reports = reports.replace(/, +$/, '');
        
    var text = "";
    if (zoneLE !== "") text = text + "Zone " + zoneLE + '. ';
    text = text + "Stage " + stageLE;
    if (stageLE =="5") {
        var type = document.getElementsByName('totalDetachmentLE');
        var typeValue = null;
        for(var i = 0; i < type.length; i++){
            if(type[i].checked){
                typeValue = type[i].value;
            }
        }             
        if (typeValue !== null ) text = text + typeValue;
    }
    if (isAPROP2()) text = text + ". APROP"
    else if (isPlusD2()) {
	    text = text + ". Plus disease";
		if (plusStrng2!=="") text = text + " (" + plusStrng2 + ")";
	}
	else if (isPrePlusD2()) {
	    text = text + ". Pre plus disease";
		if (prePlusStrng2!=="") text = text + " (" + prePlusStrng2 + ")";
	}
    text = text + ". " + reports;
    
    // Get reference to report textarea
    var repText = document.getElementById('report2');
    // Add to existing text in text area
    repText.innerHTML = text;
}


function eyeDrawController2() {
    drawingEdit2 = ED.Checker.getInstanceByIdSuffix('ROPle');
    this.drawing = drawingEdit2;
    
    // Specify call back function
     this.callBack = callBack;
    
    // Register for notifications with drawing object
     this.drawing.registerForNotifications(this, 'callBack', []);

    // Method called for notification
    function callBack(_messageArray)
    {
        switch (_messageArray['eventName'])
        {
            // Eye draw image files all loaded
            case 'ready':
                 ropCalculator2();
                 ropCalculator();
                break;
                
            case 'doodleAdded':
                //console.log('doodle added');
                 ropCalculator2();
                 ropCalculator();
                break;					

            case 'doodleDeleted':
                //console.log('doodle deleted');
                 ropCalculator2();
                 ropCalculator();
                break;	
                                        
            case 'parameterChanged':
                //console.log('parameterChanged');
                changeStateLE();
                changeStateRE();
                ropCalculator2();
                ropCalculator();
                break;
                
            case 'mouseup':
                //console.log('mouseUp');
                ropCalculator2();
                ropCalculator();
                break;
                
            case 'setParameterWithAnimationComplete':
                //console.log('setParameterWithAnimationComplete');
                changeStateLE();
                changeStateRE();
                ropCalculator2();
                ropCalculator();
                break;	
        }
    }
    addToReport1();
    addToReport2();
}