function nWin() {
  var w = window.open("", "", "width=600, height=200");
  var html = $("#toNewWindow").html();

    $(w.document.body).html(html);
}

$(function() {
    $("a#patientDetails").click(nWin);
});

var stageRE="0";
var zoneRE="";
var drawingEdit;
var plusStrng = "";
var prePlusStrng = "";

function Patient(ID,NHS,firstName,lastName,dyDOB,mnthDOB,yrDOB,gestWks,gestDys,weight,gender,ethnicity,pregnancy,conception) {
	this.HospitalID = ID;
	this.NHSNumber = NHS;
	this.FirstName = firstName;
	this.LastName = lastName;
	this.DOBday = dyDOB;
	this.DOBmnth = mnthDOB;
	this.DOByear = yrDOB;
	this.GestationWeeks = gestWks;
	this.GestationDays = gestDys;
	this.Weight = weight;
	this.Gender = gender;
	this.Ethnicity = ethnicity;
	this.PregnancyType = pregnancy;
	this.ConceptionType = conception;
	this.examNo = 2;
}

var patient1 = new Patient("100001","200001","aaa","bbb","21","7","2015","24","5","710","1","1","1");

function zoomIN() {
   var zmdOut = document.getElementById('popout1');
   var zmdIn = document.getElementById('popout2');
   zmdOut.style.display = 'none';
   zmdIn.style.display = 'block';
}

function zoomOUT() {
   var zmdOut = document.getElementById('popout1');
   var zmdIn = document.getElementById('popout2');
   zmdOut.style.display = 'block';
   zmdIn.style.display = 'none';
}

function ropPopF() {
	var toggler = document.getElementById('popToggler');
	var popper = document.getElementById('ropPop');
	var formS = document.getElementById('frm-input-sctn');
	
	toggler.classList.toggle('closed');
	popper.classList.toggle('closed');
	
	if (toggler.classList.contains('closed')) {
		toggler.innerHTML="&larr; Show previous records";
		formS.style.width="100%";
	}
	else {
		toggler.innerHTML="&rarr; Hide previous records";
		formS.style.width="50%";
	}
}

function identifyPatient(searchItem) {
	var formS = document.getElementById('frm-input-sctn');
	var identifier = document.getElementById(searchItem);
	if ((identifier.value==patient1.HospitalID && searchItem=="hospNoInput") || (identifier.value==patient1.NHSNumber && searchItem=="nhsNoInput")) {
		identifier.style.background = "white";
		var fieldsShow = document.getElementsByClassName('oldP');
		var fieldsHide = document.getElementsByClassName('startP');
		var fieldsHide2 = document.getElementsByClassName('newP');
		for (var i=0;i<fieldsHide.length;i++) {
			fieldsHide[i].style.display="none";
		}
		for (var l=0;l<fieldsHide2.length;l++) {
			fieldsHide2[l].style.display="none";
		}
		for (var j=0;j<fieldsShow.length;j++) {
			fieldsShow[j].style.display="block";
		}
		document.getElementById('patientDetails').style.display="inline-block";
		formS.style.width="50%";
		
		var calculatedFields = document.getElementsByClassName('calcOutputBox');
		for (var k=0;k<calculatedFields.length;k++) {
			calculatedFields[k].style.color="black";
		}
		
		document.getElementById('hospNoInput').value = patient1.HospitalID;
		document.getElementById('nhsNoInput').value = patient1.NHSNumber;
		document.getElementById('firstInput').value = patient1.FirstName;
		document.getElementById('lastInput').value = patient1.LastName;
		document.getElementById('dobDay').value = patient1.DOBday;
		document.getElementById('dobMonth').value = patient1.DOBmnth;
		document.getElementById('dobYear').value = patient1.DOByear;
		document.getElementById('estimatedGestAge').value = patient1.GestationWeeks;
		document.getElementById('estimatedGestAgeDays').value = patient1.GestationDays;
		document.getElementById('weightInput').value = patient1.Weight;
		document.getElementById('sexM').checked = true;
		document.getElementById('ethncty').value = patient1.Ethnicity;
		document.getElementById('p0').checked = true;
		document.getElementById('c0').checked = true;
		document.getElementById('examNoInput').value = patient1.examNo;
		
		calculateCorrectedAge();
				
	}
	else if (identifier.value=="" || isNaN(identifier.value)) {
		identifier.style.background = "rgba(255,0,0,0.2)";
		formS.style.width="100%";
	}
	else {
		var ider=identifier.value;
		identifier.style.background = "white";
		formS.style.width="100%";
		
		var fieldsShow = document.getElementsByClassName('newP');
		var fieldsHide1 = document.getElementsByClassName('startP');
		for (var i=0;i<fieldsHide1.length;i++) {
			fieldsHide1[i].style.display="none";
		}
		var fieldsHide2 = document.getElementsByClassName('oldP');
		for (var k=0;k<fieldsHide2.length;k++) {
			fieldsHide2[k].style.display="none";
		}
		for (var j=0;j<fieldsShow.length;j++) {
			fieldsShow[j].style.display="block";
		}
		
		document.getElementById('hospNoInput').value = "";
		document.getElementById('nhsNoInput').value = "";
		document.getElementById('firstInput').value = "";
		document.getElementById('lastInput').value = "";
		document.getElementById('dobDay').value = 99;
		document.getElementById('dobMonth').value = 99;
		document.getElementById('dobYear').value = 2015;
		document.getElementById('estimatedGestAge').value = "";
		document.getElementById('estimatedGestAgeDays').value = "";
		document.getElementById('weightInput').value = "";
		document.getElementById('sexM').checked = false;
		document.getElementById('ethncty').value = 99;
		document.getElementById('p0').checked = false;
		document.getElementById('c0').checked = false;
		document.getElementById('examNoInput').value = 1;
		
		var calculators = document.getElementsByClassName('calculatedFieldLabel');
		for (var l=0;l<calculators.length;l++) {
			calculators[l].style.color="gray";
		}
		
		identifier.value = ider;
	}
}
/////
// Functions for corrected age calculator
/////
function changeDecider() {
	var decider = document.getElementById('calculationType').value;
	if (decider == 'estGestAge') {
		document.getElementById('defineGestAge').style.display="inline";
		document.getElementById('defineDueDate').style.display="none";
	}
	else if (decider == 'estDueDate') {
		document.getElementById('defineGestAge').style.display="none";
		document.getElementById('defineDueDate').style.display="inline";
	}
	else {
		document.getElementById('defineGestAge').style.display="none";
		document.getElementById('defineDueDate').style.display="none";
	}
}

function getDateNow() {
		// get todays date
	var today = new Date();
	var dayNow = today.getDate();
	var monthNow = today.getMonth();
	var actualMonthNow = monthNow + 1;
	var yearNow = today.getYear();
	if (yearNow<200) yearNow= yearNow+1900;
	
	document.getElementById('today').innerHTML=dayNow + ' / ' + actualMonthNow + ' / ' + yearNow;
}

function setBoxLength(){
	var stringLength = document.getElementById('correctedAgeString').value.length;
	if (stringLength >= 20) document.getElementById('correctedAgeString').size = stringLength;
	else document.getElementById('correctedAgeString').size = 20;
}

function calculateCorrectedAge() {
	// get todays date
	var todayWtz = new Date();
	var dayNow = todayWtz.getDate();
	var monthNow = todayWtz.getMonth();
	var actualMonthNow = monthNow + 1;
	var yearNow = todayWtz.getYear();
	if (yearNow<200) yearNow = yearNow+1900;
	document.getElementById('today').innerHTML=dayNow + ' / ' + actualMonthNow + ' / ' + yearNow;

	// create a new date element so it will be in the same timezone & at same time as the defined due date, making calculations accurate!
	var today = new Date(yearNow,monthNow,dayNow,0,0,0,0);
	
	// get date of birth from form
	var dayDOB = document.getElementById('dobDay').value;
	var monthDOB = document.getElementById('dobMonth').value;
	var yearDOB = document.getElementById('dobYear').value;
		
	// & check dob is set!
	if (dayDOB>0 && dayDOB<32 && monthDOB>=0 && monthDOB<12) {
		// calculate actual age in days
		var DOB = new Date(yearDOB, monthDOB, dayDOB,0,0,0,0);
		var aDayInMilliseconds = 24*60*60*1000;
		var actualAgeInDays = Math.round((today-DOB)/aDayInMilliseconds);		
		
		if (DOB>today) {
			document.getElementById('calculatorWarning1').innerHTML = "*This date has not happened yet!"
		}
		else {
			document.getElementById('calculatorWarning1').innerHTML = "";
			var decider = 'estGestAge';
			var aDays = "";
			var aWeeks = "";
			var aMonths = "";
			
			if (actualAgeInDays<7) aDays = actualAgeInDays;
			
			// if less than 3 months (+ 40 weeks!) convert to weeks and days;
			else if (actualAgeInDays<532 && actualAgeInDays>=7) {
				var ageInWeeks = actualAgeInDays / 7;
				aWeeks = Math.floor(ageInWeeks);
				var rWeeks = ageInWeeks-aWeeks;
				var rDays =rWeeks * 7;
				aDays = Math.round(rDays);
			}
			
			// if less than 2 years do in months and weeks and days;
			else { 
				if (actualAgeInDays<0) preterm = true;
				var ageInMonths = actualAgeInDays / 30.4368;
				aMonths = parseInt(ageInMonths);
				var rMonths = ageInMonths-aMonths;
				var rWeeks = rMonths * 4.34812;
				aWeeks = parseInt(rMonths * 4.34812);
				if (rWeeks>4.34812) {
					aWeeks = 0;
					aMonths = aMonths + 1;
				}
				var rDays = (rWeeks-aWeeks) * 7;
				aDays = Math.round(rDays);
				// have set limit to 3 months, so below if is a bit pointless ie it will never be just 1 month...!
			}

		}

		var correctedAgeInDays = "";
		
		var correctedDays = "";
		var correctedWeeks = "";
		var correctedMonths = "";
		var correctedYears = "";
		var preterm = false;
		
		// either using estimated due date
		if (decider == 'estDueDate') {
			var dayDue = document.getElementById('dueDay').value;
			var monthDue = document.getElementById('dueMonth').value;
			var yearDue = document.getElementById('dueYear').value;
			if (dayDue>0 && dayDue<32 && monthDue>=0 && monthDue<12) {
				var dueDate = new Date(yearDue, monthDue, dayDue);
				if (dueDate<=DOB) {
					correctedAgeInDays = "";
					document.getElementById('calculatorWarning2').innerHTML = "*The estimated delivery date is before the date of birth."
				}
				else {
					correctedAgeInDays  = parseInt((today-dueDate)/aDayInMilliseconds);
					correctedAgeInDays = correctedAgeInDays + 40*7;
				}
			}
			else correctedAgeInDays = "";
		}
		
		// or using estimated gestaional age
		else if (decider == 'estGestAge') {
			if (document.getElementById('estimatedGestAge').value < 40 && document.getElementById('estimatedGestAge').value > 18 && document.getElementById('estimatedGestAgeDays').value < 7) {
				var gestationInDays = (document.getElementById('estimatedGestAge').value * 7);
				var normGestationInDays = 7 * 40; 
				var noDaysPreterm = normGestationInDays - gestationInDays - document.getElementById('estimatedGestAgeDays').value;
				correctedAgeInDays = actualAgeInDays - noDaysPreterm + 40*7;
			}
			else correctedAgeInDays = "";
		}
		
		if (correctedAgeInDays !== "") {
			document.getElementById('calculatorWarning1').innerHTML = "";
			document.getElementById('calculatorWarning2').innerHTML = "";

			// convert age to suitable units!
				// if less than 1 week, keep value in days
				// if still preterm, convert to absolute and state!
			if (correctedAgeInDays<7 && correctedAgeInDays>-7) {
				if (correctedAgeInDays<0) preterm = true;
				correctedAgeInDays = Math.abs(correctedAgeInDays);
				correctedDays = correctedAgeInDays;
			}
			
			// if less than 3 months (+ 40 weeks!) convert to weeks and days;
			else if ((correctedAgeInDays<532 && correctedAgeInDays>=7) || (correctedAgeInDays<=-7 && correctedAgeInDays>-532)) {
				if (correctedAgeInDays<0) preterm = true;
				correctedAgeInDays = Math.abs(correctedAgeInDays);
				var correctedAgeInWeeks = correctedAgeInDays / 7;
				correctedWeeks = Math.floor(correctedAgeInWeeks);
				var remainderWeeks = correctedAgeInWeeks-correctedWeeks;
				var remainderDays =remainderWeeks * 7;
				correctedDays = Math.round(remainderDays);
			}
			
			// if less than 2 years do in months and weeks and days;
			else { 
				if (correctedAgeInDays<0) preterm = true;
				correctedAgeInDays = Math.abs(correctedAgeInDays);
				var correctedAgeInMonths = correctedAgeInDays / 30.4368;
				correctedMonths = parseInt(correctedAgeInMonths);
				var remainderMonths = correctedAgeInMonths-correctedMonths;
				var remainderWeeks = remainderMonths * 4.34812;
				correctedWeeks = parseInt(remainderMonths * 4.34812);
				if (remainderWeeks>4.34812) {
					correctedWeeks = 0;
					correctedMonths = correctedMonths + 1;
				}
				var remainderDays = (remainderWeeks-correctedWeeks) * 7;
				correctedDays = Math.round(remainderDays);
				// have set limit to 3 months, so below if is a bit pointless ie it will never be just 1 month...!
			}
			
			// if more than 2 do in years and months, definitely can't be more than 2 years preterm, but hey ho. It's there...!
/*
			else {
				if (correctedAgeInDays>=0) {
					var correctedAgeInYears = correctedAgeInDays / 365.242;
					var correctedYears = parseInt(correctedAgeInYears);
					var remainderYears = correctedAgeInYears-correctedYears;
					var remainderMonths = remainderYears * 12;
					var correctedMonths = parseInt(remainderYears * 12);
					if (remainderMonths>=12) {
						correctedYears = correctedYears + 1;
						correctedMonths = 0;
					}
					if (correctedYears==1) convertedAge = convertedAge + correctedYears + ' year';
					else convertedAge = convertedAge + correctedYears + ' years';
					if (correctedMonths==1) convertedAge = convertedAge + ' and ' + correctedMonths + ' month';
					else convertedAge = convertedAge + ' and ' + correctedMonths + ' months'; 
					if (correctedWeeks!==0 && correctedWeeks!==undefined) {
						if (correctedWeeks==1) convertedAge = convertedAge + ' and ' + correctedWeeks + ' week';
						else convertedAge = convertedAge + ' and ' + correctedWeeks + ' weeks';
					}
				}
				else {
					correctedAgeInDays = Math.abs(correctedAgeInDays);
					var correctedAgeInYears = correctedAgeInDays / 365.242;
					var correctedYears = parseInt(correctedAgeInYears);
					var remainderYears = correctedAgeInYears-correctedYears;
					var remainderMonths = remainderYears * 12;
					var correctedMonths = parseInt(remainderYears * 12);
					if (remainderMonths>=12) {
						correctedYears = correctedYears + 1;
						correctedMonths = 0;
					}
					if (correctedYears==1) convertedAge = convertedAge + correctedYears + ' year';
					else convertedAge = convertedAge + correctedYears + ' years';
					if (correctedMonths==1) convertedAge = convertedAge + ' and ' + correctedMonths + ' month';
					else convertedAge = convertedAge + ' and ' + correctedMonths + ' months'; 
					if (correctedWeeks!==0 && correctedWeeks!==undefined) {
						if (correctedWeeks==1) convertedAge = convertedAge + ' and ' + correctedWeeks + ' week';
						else convertedAge = convertedAge + ' and ' + correctedWeeks + ' weeks';
					}
					convertedAge = convertedAge + ' preterm';
				}
*/
// 			}
// 			document.getElementById("correctedAgeString").value = convertedAge;
			if (correctedMonths!=="") {
				document.getElementById("correctedAgeStringMonths").value = correctedMonths;
				document.getElementById("mnthsPMAoutput").style.display="inline-block";
			}
			else document.getElementById("mnthsPMAoutput").style.display="none";
			
			if (correctedWeeks==1) document.getElementById("calcWeeksLabel").innerHTML = "week";
			else document.getElementById("calcWeeksLabel").innerHTML = "weeks";
			if (correctedDays==1) document.getElementById("calcDaysLabel").innerHTML = "day";
			else document.getElementById("calcDaysLabel").innerHTML = "days";
			
			document.getElementById("correctedAgeStringWeeks").value = correctedWeeks;
			document.getElementById("correctedAgeStringDays").value = correctedDays;
			
			
			
		}
// 		else document.getElementById("correctedAgeString").value = "";
		if (aMonths!=="") {
			document.getElementById("ageStringMonths").value = aMonths;
			document.getElementById("mnthsAoutput").style.display="inline-block";
		}
		else document.getElementById("mnthsAoutput").style.display="none";
		
		if (aWeeks==1) document.getElementById("calcWeeksLabelA").innerHTML = "week";
		else document.getElementById("calcWeeksLabelA").innerHTML = "weeks";
		if (aDays==1) document.getElementById("calcDaysLabelA").innerHTML = "day";
		else document.getElementById("calcDaysLabelA").innerHTML = "days";
		
		document.getElementById("ageStringWeeks").value = aWeeks;
		document.getElementById("ageStringDays").value = aDays;
	}
// 	else document.getElementById("correctedAgeString").value = "";
}


/////
// Functions for form calculations
/////
function addAntSegFeatures(eyeSelector) {
	if (eyeSelector =="antSegL") {
		var frmSction = document.getElementById('LantSegDeets')
		if (frmSction.style.display=="inline-block") frmSction.style.display = "none";
		else frmSction.style.display="inline-block";
	}
	else if (eyeSelector =="antSegR") {
		var frmSction = document.getElementById('RantSegDeets')
		if (frmSction.style.display=="inline-block") frmSction.style.display = "none";
		else frmSction.style.display="inline-block";
	}
	
}


function whichQuadrant() {   // for both eyes...
    var prePlusRBOOL = document.getElementById("prePlusRE");
    var plusRBOOL = document.getElementById("plusRE");
    var prePlusLBOOL = document.getElementById("prePlusLE");
    var plusLBOOL = document.getElementById("plusLE");
    var rAPROPbool = document.getElementById("APROPRE");
	var lAPROPbool = document.getElementById("APROPLE");
	    
    if (prePlusRBOOL.checked) document.getElementById("prePlusQuadrantRE").style.display="block";
    else {
	    document.getElementById("prePlusQuadrantRE").style.display="none";
/*
	    document.getElementById("prePlusSTRE").checked = false;
	    document.getElementById("prePlusSNRE").checked = false;
	    document.getElementById("prePlusITRE").checked = false;
	    document.getElementById("prePlusINRE").checked = false;
*/
	}
                
    if (plusRBOOL.checked) document.getElementById("plusQuadrantRE").style.display="block";
    else document.getElementById("plusQuadrantRE").style.display="none";

// 	if (rAPROPbool.checked) document.getElementById("plusQuadrantRE").style.display="none";
    
    //LE    
    if (prePlusLBOOL.checked) document.getElementById("prePlusQuadrantLE").style.display="block";
    else {
	    document.getElementById("prePlusQuadrantLE").style.display="none";
	    document.getElementById("prePlusSTLE").checked = false;
	    document.getElementById("prePlusSNLE").checked = false;
	    document.getElementById("prePlusITLE").checked = false;
	    document.getElementById("prePlusINLE").checked = false;
	}
                
    if (plusLBOOL.checked) document.getElementById("plusQuadrantLE").style.display="block";
    else document.getElementById("plusQuadrantLE").style.display="none";
    
/*
    if (lAPROPbool.checked) {
	    document.getElementById("plusQuadrantLE").style.display="none";
	    document.getElementById("plusLE").checked = false;
	}
*/
    
    addToReport1();
    addToReport2();
}

function isPlusD() {
	if (document.getElementById("plusRE").checked == true) document.getElementById("plusQuadrantRE").style.display="block";
    else document.getElementById("plusQuadrantRE").style.display="none";
    
    if (document.getElementById("plusRE").checked == true) return true;
    else return false;
}

function isPrePlusD() {
	if (document.getElementById("prePlusRE").checked == true) document.getElementById("prePlusQuadrantRE").style.display="block";
    else document.getElementById("prePlusQuadrantRE").style.display="none";
    
    if (document.getElementById("prePlusRE").checked == true) return true;
    else return false;
}


function isAPROP() {
    if (document.getElementById("APROPRE").checked == true) return true;
    else return false;
}


function changeStageRE() {
    stageRE = document.getElementById("stageRE").value;
        
    if (stageRE=="5") {
        if (!drawingEdit.hasDoodleOfClass('ROPRRD')) drawingEdit.addDoodle('ROPRRD');
/*
        var RRD = drawingEdit.lastDoodleOfClass('ROPRRD');
        if (RRD.arc !== 2 * Math.PI) {
	        RRD.arc = 2 * Math.PI;
	        drawingEdit.deselectDoodles();
	        ropCalculator();
		}
*/
        document.getElementById("totalRDRE").style.display="block";
//         document.getElementById("zoneLE").selectedIndex = 1;
        stageLE = 5;
	}
    else {
        document.getElementById("openFunnelRE").checked=false;
        document.getElementById("closedFunnelRE").checked=false;
        document.getElementById("totalRDRE").style.display="none";
    }
    zoneRE = document.getElementById("zoneRE").value;
    addToReport1();
}

function changeZoneRE() {
    zoneRE = document.getElementById("zoneRE").value;
    addToReport1();
}

function changeStateRE() {
    var plusAnz = 0;
    var isPls = false;
    var prePlusAnz = 0;
    var isPrPls = false;
    var isAPRP = false;
    
    var INA = drawingEdit.lastDoodleOfClass('InfNasalArcade');
    var ITA = drawingEdit.lastDoodleOfClass('InfTempArcade');
    var SNA = drawingEdit.lastDoodleOfClass('SupNasalArcade');
    var STA = drawingEdit.lastDoodleOfClass('SupTempArcade');
    
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

// 	if (plusAnz==4) document.getElementById('APROPRE').checked = true;
    if (plusAnz>=2) document.getElementById('plusRE').checked = true;    
    else if (prePlusAnz>=2) document.getElementById('prePlusRE').checked = true;
    else {
	    var statusRadio = document.getElementsByName("statusR");
	    for(var i=0;i<statusRadio.length;i++) statusRadio[i].checked = false;
	}
}


// calculate zone and stage
    // & push to form selectors 
    // also used in report function
function ropCalculator() {	
    var INA = drawingEdit.lastDoodleOfClass('InfNasalArcade');
    var ITA = drawingEdit.lastDoodleOfClass('InfTempArcade');
    var SNA = drawingEdit.lastDoodleOfClass('SupNasalArcade');
    var STA = drawingEdit.lastDoodleOfClass('SupTempArcade');
    
    var stg = document.getElementById("stageRE");
    var zn = document.getElementById("zoneRE");
    
    var doodleArray = drawingEdit.doodleArray;
    
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
        var RRD = drawingEdit.lastDoodleOfClass('ROPRRD');
        if (RRD.isTotalDetach()) stageRE = "5";
        else if (RRD.isMacOff()) stageRE = "4b (macula off)";
        else stageRE = "4a (macula on)";
    }
    else if (countArray['ROPRD'] > 0) {
        var TRD = drawingEdit.lastDoodleOfClass('ROPRD');
        if (TRD.isMacOff()) stageRE = "4b (macula off)";
        else stageRE = "4a (macula on)";
    }
    else if (countArray['ROPstage3'] > 0) stageRE = "3";
    else if (countArray['ROPRidge'] > 0) stageRE = "2";
    else if (countArray['ROPDemarcationLine'] > 0) stageRE = "1";
    else stageRE = "0";
    
    stg.value = stageRE;
    
    
    // calculate the zone from drawing
    if (countArray['ROPRRD'] > 0) {
//         var RRD = drawingEdit.lastDoodleOfClass('ROPRRD');
//         RRD.zoning();
//         zoneRE = RRD.zone;
		zoneRE = "1";
    }
    else if (countArray['ROPRD'] > 0) {
        var TRD = drawingEdit.lastDoodleOfClass('ROPRD');
        TRD.zoning();
        zoneRE = TRD.zone;
    }
    else if (countArray['ROPstage3'] > 0) {
        var neovasc = drawingEdit.lastDoodleOfClass('ROPstage3');
        neovasc.zoning();
        zoneRE = neovasc.zone;
    }
    else if (countArray['ROPRidge'] > 0) {
        var ridge = drawingEdit.lastDoodleOfClass('ROPRidge');
        ridge.zoning();
        zoneRE = ridge.zone;
    }
    else if (countArray['ROPDemarcationLine'] > 0) {
        var line = drawingEdit.lastDoodleOfClass('ROPDemarcationLine');
        line.zoning();
        zoneRE = line.zone;
    }
    
    zn.value = zoneRE;
    changeStageRE();
}


// Controller class
function eyeDrawController()
{
   drawingEdit = ED.Checker.getInstanceByIdSuffix('ROPre');
    this.drawing = drawingEdit;
    
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
                ropCalculator();
                break;
                
            case 'doodleAdded':
                //console.log('doodle added');
                ropCalculator();
                break;					

            case 'doodleDeleted':
                //console.log('doodle deleted');
                ropCalculator();
                break;	
                                        
            case 'parameterChanged':
                //console.log('parameterChanged');
                break;
                
            case 'mouseup':
                //console.log('mouseUp');
                ropCalculator();
                break;
                
            case 'setParameterWithAnimationComplete':
                //console.log('setParameterWithAnimationComplete');
                ropCalculator();
                break;	
        }
    }
    addToReport1();
    calculateCorrectedAge();
}




/////
// Functions for reports
/////

function addToReport1() { 
    var reports = drawingEdit.report();
    reports = reports.replace(/, +$/, '');
        
    var text = "";
    if (zoneRE !== "") text = text + "Zone " + zoneRE + '. ';
    text = text + "Stage " + stageRE;
    if (stageRE =="5") {
        var type = document.getElementsByName('totalDetachmentRE');
        var typeValue = null;
        for(var i = 0; i < type.length; i++){
            if(type[i].checked){
                typeValue = type[i].value;
            }
        }             
        if (typeValue !== null ) text = text + typeValue;
    }
    if (isAPROP()) text = text + ". APROP"
    else if (isPlusD()) {
	    text = text + ". Plus disease";
		if (plusStrng!=="") text = text + " (" + plusStrng + ")";
	}
	else if (isPrePlusD()) {
	    text = text + ". Pre plus disease";
		if (prePlusStrng!=="") text = text + " (" + prePlusStrng + ")";
	}
    text = text + ". " + reports;
    
    // Get reference to report textarea
    var repText = document.getElementById('report1');
    // Add to existing text in text area
    repText.innerHTML = text;
}


