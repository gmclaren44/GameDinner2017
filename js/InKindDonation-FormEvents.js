// Module to handle all the
// In-Kind Donation Web App 
// Elements and Events
//
// Author: Gina McLaren
// June 15, 2017
//


// Gift Fields
var IX_GIFT_ITEMTYPE =      0;
var IX_GIFT_DESC =          1;
var IX_GIFT_RESTRICT =      2;
var IX_GIFT_VALUE =         3;
var IX_GIFT_EXPDATE =       4;
var IX_GIFT_DELIVERY =      5;
var IX_GIFT_LOGO_YN =       6;
var IX_GIFT_CONTACT =       7;  
var IX_GIFT_RECOTHER_YN =   8;
var IX_GIFT_OTHERDESC =     9;
var IX_GIFT_LAST =          10;

/*                      Form Field ID               Index                   Set Value   Set/Unset (Radio Button)    # of Options to Unset
//                                                                                      0 == Set Default Value          -OR-
//                                                                                      1 == Set the Radio Button   Index of Radio Button to Set
//                                                                                     -1 == Unset the Group                                    */
var gIX2GiftField = [ ["svgftItemType",             IX_GIFT_ITEMTYPE,       undefined, -1,                          4],
                        ["svgftDescription",        IX_GIFT_DESC,           "",         0,                          0],
                        ["svgftRestrictions",       IX_GIFT_RESTRICT,       "",         0,                          0],
                        ["svgftValue",              IX_GIFT_VALUE,          "$",        0,                          0],
                        ["svgftExpirationDate",     IX_GIFT_EXPDATE,   "2018-11-18",    0,                          0],
                        ["svgftDelivery",           IX_GIFT_DELIVERY,       "",         0,                          0],
                        ["svgftLogo",               IX_GIFT_LOGO_YN,        undefined,  1,                          2], 
                        ["svgftContact",            IX_GIFT_CONTACT,        "",         0,                          0],
                        ["svgftRecognizeOther",     IX_GIFT_RECOTHER_YN,    'N',        0,                          0], 
                        ["svgftOtherDesc",          IX_GIFT_OTHERDESC,      null,       0,                          0]  ];

/*                      Form Field ID               Check Validity Type       */
var CHECK_RADIO = 0;
var CHECK_INPUT = 1;
var gReqGiftFields = [ ["svgftItemType",                    0],
                        ["svgftDescription",                1],
                        ["svgftValue",                      1],
                        ["svgftDelivery",                   1] ];

// Global Gift Entry Setting
var bGiftEntryDisplayed = false;
var bLogoUploaded = false;

// In Process GIF
var gDlgProcess = null;



function funcCreateNewGiftStr()
{
    var emailParams = null;
    emailParams = "donationDesc=" + encodeURIComponent(funcGetDonationDesc());
    emailParams += "&needLogo=" + (funcSendingLogo() ? "true" : "false");
    emailParams += "&sendToEmail=" + encodeURIComponent(funcGetSVSEFEmail());
    emailParams += "&sendToName=" + encodeURIComponent(funcCreateEmailName());

    return(emailParams);
}

function funcCreateEmailName()
{
    var strFirstName = funcGetSVSEFFirstName();
    var strLastName = funcGetSVSEFLastName();
    var strEmailName = "";

    if (!isEmpty(strFirstName) && !isEmpty(strLastName))
        strEmailName = strFirstName + " " + strLastName;
    else if(!isEmpty(strLastName))
        strEmailName = strLastName;

    return(strEmailName);
}

function funcOnLoadDonationForm()
{   // Loading the INKIND DONATION FORM
    var HTML_INKIND     = 0;
    window.iFrameConstituentForm.funcSetHTMLDocType(HTML_INKIND);
    window.iFrameConstituentForm.funcClearAllConstituentInfo();
    window.iFrameConstituentForm.funcSetNextActionDescription("Contribution", "Please select 'Contribution', to enter your donation");

    // Make sure Update Btn is enabled/disabled appropriately
    window.iFrameConstituentForm.funcEnableConstituentBtns(); 

    var strURL = window.location.protocol + "//" + window.location.host + "/GameDinner2017/InKindDonationForm.html";
    window.history.pushState(null, "SVSEF Game Dinner Donation", strURL);

    funcScrollTo("topOfPage", -20);
}

function funcOnLoadAdjustIFrame(strIFrame)
{
    document.getElementById(strIFrame).style.height = document.getElementById(strIFrame).contentWindow.document.body.scrollHeight + "px";
}

function funcAdjustIFrame(strIFrame, i) 
{ 
    document.getElementById(strIFrame).style.height = parseInt(i) + "px"; 
}



function funcSetGiftBtns()
{
    if (isGiftDataComplete())
    {
        // Enable the Update Gift Button
        document.getElementById("btnUpdateGift").disabled = false;
        document.getElementById("btnUpdateGift").editable = true;
    }
    else
    {
        // Disable the Update Gift Button
        document.getElementById("btnUpdateGift").disabled = true;
        document.getElementById("btnUpdateGift").editable = false;
    }
}

function isGiftDataComplete()
{
    // TO DO: Validity checking of the Gift Data
    return(true);
}


function funcScrollTo(formID, yOffset)
{
    // Scroll the window so that the appropriate Form is prominent
    window.scrollTo(0, document.getElementById(formID).offsetTop + yOffset);
} 

function funcOffSetToIFrameConstituentForm()
{
    return(document.getElementById("iFrameConstituentForm").offsetTop);
}   

function funcClearAllGiftInfo()
{
    // Reset Global Variable
    globalIdGift = null;
    bLogoUploaded = false;

    // This should only be enabled *IF* the user  
    // selects to upload their logo now.
    document.getElementById("iFrameUploadFileForm").hidden = true;

    for (var i = 0; i < gIX2GiftField.length; ++i) 
    {
        if (gIX2GiftField[i][3] == 1)   // Set Selected Radio Button
        {
            var sRadioButtonId = gIX2GiftField[i][0] + gIX2GiftField[i][4];
            document.getElementById(sRadioButtonId).checked = true;
        }
        else if (gIX2GiftField[i][3] == -1)     // Unset the whole Group of Radio Buttons
        {
            var cntRadioButtons = gIX2GiftField[i][4];
            for (var j = 0; j < cntRadioButtons; ++j)
            {
                var sRadioButtonId = gIX2GiftField[i][0] + j;
                document.getElementById(sRadioButtonId).checked = false;
            } 
            
        }  
        else
            document.getElementById(gIX2GiftField[i][0]).value = gIX2GiftField[i][2];
    } 

    // Reset Any Error Highlights
    for (var i = 0; i < gReqGiftFields.length; ++i)
    {
        if (gReqGiftFields[i][1] == CHECK_RADIO)
            funcResetElementValidity(gReqGiftFields[i][0], null);
        else if (gReqGiftFields[i][1] == CHECK_INPUT)
            funcResetElementValidity(gReqGiftFields[i][0], document.getElementById(gReqGiftFields[i][0]));
    }
}

function funcOnBlurRadioChecked(fieldModified, bSetFocus)
{
    if (fieldModified == null)
        return(false);

    var bSelection = false;
    for (var i = 0; i < fieldModified.length; ++i)
    {
        if (fieldModified[i].checked)
            bSelection = true;
    }
    
    var errName = "error" + fieldModified[0].name.substr(5, fieldModified[0].name.length);
    if (!bSelection)
    {
        // Display error message
        document.getElementById(errName).hidden = false;
        if (bSetFocus)
            fieldModified[0].focus();
    }
    else
    {
        // Hide error message
        if (document.getElementById(errName))
            document.getElementById(errName).hidden = true;
    }

    funcSetGiftBtns();
    return(bSelection);
}



function funcOnClickLogoRadio()
{
    // Check if the user wants to upload logo now
    document.getElementById("iFrameUploadFileForm").hidden = !(document.getElementById("svgftLogo0").checked);
    funcOnLoadAdjustIFrame("iFrameUploadFileForm");

}

function funcOnBlurCheckValidity(fieldModified,bNullOK)
{
    if (!funcCheckElementValidity(fieldModified, true, bNullOK,true))
        return;

    // Make sure Update Btn is enabled/disabled appropriately
    funcSetGiftBtns();
}

function funcOnChangeRecognize()
{
    var val = document.getElementById("svgftRecognizeOther").value;
    if (val == 'Y')
    {
        // Enable the Recognize Other Field
        document.getElementById("lblRecognizeOther").hidden = false;
        document.getElementById("svgftOtherDesc").hidden = false;
    }
    else
    {
        // Disable the Recognize Other Field
        document.getElementById("lblRecognizeOther").hidden = true;
        document.getElementById("svgftOtherDesc").hidden = true;
        document.getElementById("svgftOtherDesc").value = "";
    }
}



function funcCheckElementValidity(fieldModified, bSetFocus, bNullOK, bUnsetOnly)
{
    if (fieldModified == null)
        return(false);

    if (fieldModified.value.length > 0)
    {   // Trim leading and trailing spaces
        fieldModified.innerHTML.trim();
    }

    var errName = "error" + fieldModified.name.substr(5, fieldModified.name.length);

    if (bUnsetOnly)
    {   // This will only UNSET the red-highlights, if a field is set correctly.
        if ( (fieldModified.value.length == 0) ||
            (fieldModified.value.length > 0 && fieldModified.checkValidity()) )
            funcResetElementValidity(fieldModified.name, fieldModified);

        return(true);
    }

    if (fieldModified.value.length == 0 && !bNullOK)
    {
        console.log("errName: " + errName + " hidden attribute being set to: FALSE");
        document.getElementById(errName).hidden = false;
        fieldModified.style.border = "thick solid red";
        if (bSetFocus)
            fieldModified.focus();
        return(false);
    }
    else if (fieldModified.value.length > 0 && !fieldModified.checkValidity())
    {
        console.log("errName: " + errName + " hidden attribute being set to: FALSE");
        document.getElementById(errName).hidden = false;
        fieldModified.style.border = "thick solid red";
        if (bSetFocus)
            fieldModified.focus();
        return(false);
    }
    else
        funcResetElementValidity(fieldModified.name, fieldModified);
    
    return(true);
}

function funcResetElementValidity(fieldName, fieldModified)
{
    if (fieldName == null)
        return(false);

    var errName = "error" + fieldName.substr(5, fieldName.length);
    console.log("errName: " + errName + " hidden attribute being set to: TRUE");
    document.getElementById(errName).hidden = true;
    if (fieldModified)
    {
        fieldModified.style.borderColor = "#909090";
        fieldModified.style.borderWidth = "thin";
        fieldModified.style.boxShadow = "-1px -1px 6px #888888;"
    }
}

function funcCheckGiftFormValidity()
{
    var bValid = true;
    for (var i = 0; i < gReqGiftFields.length; ++i)
    {
        if (gReqGiftFields[i][1] == CHECK_RADIO)
        {
            if (!funcOnBlurRadioChecked(document.getElementsByName(gReqGiftFields[i][0]), bValid))
                bValid = false;
        }
        else if (gReqGiftFields[i][1] == CHECK_INPUT)
        {
            if ( !funcCheckElementValidity(document.getElementById(gReqGiftFields[i][0]),bValid,false,false) )
                bValid = false;
        }
    }
    return(bValid);
}

function funcSendingLogo()
{
    var val = funcGetCheckedValue(GIFTUDF_IK_LOGO);
    if (val == "YwDELAY" || ((val == "YwUPLOAD") && !bLogoUploaded))
        return(true);

    return(false);
}

/////////////////////////////////////////////////////////////////////////
// ONCLICK functions
////////////////////////////////////////////////////////////////////////

function funcParseXMLSendEmail(resXMLDocument)
{
    console.log("funcParseXMLSendEmail: RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log("funcParseXMLSendEmail ERROR: resXMLDocument is Null");
        return;
    }

    if (resXMLDocument.getElementsByTagName("message"))
    {
        var idMsg = resXMLDocument.getElementsByTagName("message")[0].getAttribute("id");
        var strValue = resXMLDocument.getElementsByTagName("message")[0].getAttribute("value");
        console.log("funcParseXMLSendEmail - Message ID: " + idMsg);
        console.log("funcParseXMLSendEmail - Returned Value: " + strValue);
        return;
    }
}

function Reset()
{
    // Clear/Disable the Gift Entry Form
    funcClearAllGiftInfo();
    document.getElementById("infoGiftFields").style.display = "none";
    bGiftEntryDisplayed = false;

    // Disable the followUpForm in case 
    // they're entering more than one Gift
    document.getElementById("msgThanks").style.display = "none";
    document.getElementById("lblSendLogo").hidden = true;

}

function funcNextAction()
{
    // Check to make sure there's a valid svsefID
    if (isEmpty(funcGetSVSEFID()))
    {
        document.getElementById("dialogAlertNoCallback").innerHTML = "Please find your SVSEF ID and contact information first!";
        $( "#dialogAlertNoCallback" ).dialog( "option", "title", "SVSEF Donor Information" );
        $( "#dialogAlertNoCallback" ).dialog( "open" );
        return;
    }

    if (isDataDirty())
    {
        document.getElementById("dialogAlertNoCallback").innerHTML = "Your Donor Information has been modified.<br/>Please save that information first by selecting 'Update Donor'!";
        $( "#dialogAlertNoCallback" ).dialog( "option", "title", "SVSEF Donor Information" );
        $( "#dialogAlertNoCallback" ).dialog( "open" );
        return;
    }
    
    funcNewGift();
}

function funcNewGift()
{

    if (bGiftEntryDisplayed)
    {
        funcScrollTo("infoGiftForm", -10);
        return;
    }
        
    // Reset the infoGiftFields to Blank
    funcClearAllGiftInfo();

    // Enable the infoGiftForm for entry
    document.getElementById("infoGiftFields").style.display = "inline"; 
    bGiftEntryDisplayed = true;

    // Set the Recognize Donor Name
    var sLastName = window.iFrameConstituentForm.funcGetSVSEFLastName();
    var sFirstName = window.iFrameConstituentForm.funcGetSVSEFFirstName();
    var sDonorName = null;
    if (!isEmpty(sFirstName) && !isEmpty(sLastName))
        sDonorName = sFirstName + " " + sLastName;
    else if (!isEmpty(sLastName))
        sDonorName = sLastName;
    else
        sDonorName = "Donor Name Listed Above";
    document.getElementById("optDonorName").innerHTML = sDonorName;

    // Disable the followUpForm in case 
    // they're entering more than one Gift
    document.getElementById("msgThanks").style.display = "none";
    document.getElementById("lblSendLogo").hidden = true;
    // Disable the Other Recognition Field  
    // in case it was used in previous gift
    funcOnChangeRecognize();

    funcScrollTo("infoGiftForm", -10);
}

function funcUpdateGift()
{
    // Check that all required fields are valid
    if (!funcCheckGiftFormValidity())
        return;
    
    funcVerifyGiftWUser();
}

function funcUpdateGiftApproved()
{
    // Make sure funcUpdateGiftApproved is called 
    // as a Callback to the dialog that asks
    // the user if they want to download the 
    // Gift Information Entered.

    // Set the Process Image
    funcLoadProgressDlg();

    // Download data to DonorPerfect
    funcSetGift();

    // Make sure Update Gift Btn is disabled
    funcSetGiftBtns();
}

function funcResetGift()
{
    document.getElementById("dialogResetGiftConfirmation").innerHTML = '<img src="images/CautionTransparent.png" class="imgCaution"/>&nbsp;There may be Contribution Information entered that will be LOST if you proceed with the Reset.<br/><br/>' +
                    "Select 'OK' to continue with the Reset!<br/>Select 'Cancel' to quit the reset.";
        $( "#dialogResetGiftConfirmation" ).dialog( "open" );
        return;
}

function funcResetGiftApproved()
{
    // Make sure funcResetGiftApproved is called 
    // as a Callback to the dialog that asks
    // the user if they want to clear the 
    // Gift Information Entered.

    // Reset the infoGiftFields to Blank
    funcClearAllGiftInfo();
}

function funcShowThankYou()
{
    // Disable infoGiftForm for entry
    // and the Process Image
    funcCloseProgressDlg();
    document.getElementById("infoGiftFields").style.display = "none";
    bGiftEntryDisplayed = false;

    // Enable followUpForm
    document.getElementById("msgThanks").style.display = "inline";

    var strDonation = funcGetDonationDesc();
    document.getElementById("lblDonationDesc").innerHTML = strDonation;

    if (funcSendingLogo())
        document.getElementById("lblSendLogo").hidden = false;

    // Send Thank You Email
    sendEmail(funcCreateNewGiftStr(), EMAIL_GIFT_ADD, funcParseXMLSendEmail);

    // Update the Contribution String
    window.iFrameConstituentForm.funcSetNextActionDescription("Contribution", "Please select 'Contribution', to enter another donation");

    funcScrollTo("followUpForm", 0);
}

function funcVerifyGiftWUser()
{
    var strDialog = funcBuildVerifyGiftStr();
    document.getElementById("dialogGiftConfirmation").innerHTML = strDialog;
    $( "#dialogGiftConfirmation" ).dialog( "open" );
    return;
}

function funcBuildVerifyGiftStr()
{
    var strVerifyGift = "Please confirm the following Contribution:<br/><br/>" + funcGetGiftItemString() + funcGetDonationDesc() + "<br/>";

    if (!isEmpty(document.getElementById("svgftRestrictions").value))
        strVerifyGift += "<b>Restrictions:&nbsp</b>" + document.getElementById("svgftRestrictions").value.trim() + "<br/>";

    if (!isEmpty(document.getElementById("svgftExpirationDate").value))
        strVerifyGift += "<b>Expiration Date:&nbsp</b>" + document.getElementById("svgftExpirationDate").value.trim() + "<br/>";
        
    strVerifyGift += "<br/>";
    strVerifyGift += "<b>Delivery:&nbsp</b>" + funcGetDeliveryString() + "<br/>";
    strVerifyGift += "<b>Logo:&nbsp</b>" + funcGetLogoString() + "<br/>";

    if (!isEmpty(document.getElementById("svgftContact").value))
        strVerifyGift += "<b>Specific Contact:&nbsp</b>" + document.getElementById("svgftContact").value + "<br/>";

    strVerifyGift += "<br/><b>Recognize Donation as given by:&nbsp</b><br/>" + funcGetRecognizeString() + "<br/>";

    strVerifyGift += "<br/>Please select 'OK' if you would like to record this Contribution with SVSEF?";

    return(strVerifyGift);
}

function funcGetGiftItemString()
{
    var strVal = "";

    var fields = document.getElementsByName("svgftItemType");
    for (var i = 0;  i < fields.length; ++i)
    {
        if (fields[i].checked)
        {
            strVal = fields[i].title;
            break;
        }   
    }

    if (strVal == "Other")
        strVal = "Description";

    strVal = "<b>" + strVal + ":&nbsp</b>";
    
    return(strVal);
}

function funcGetDeliveryString()
{
    var strVal = "";

    var fields = document.getElementsByName("svgftDelivery");
    for (var i = 0;  i < fields.length; ++i)
    {
        if (fields[i].selected)
        {
            strVal = fields[i].label;
            break;
        }
    }

    return(strVal);
}

function funcGetLogoString()
{
    var strVal = "";

    var fields = document.getElementsByName("svgftLogo");
    for (var i = 0;  i < fields.length; ++i)
    {
        if (fields[i].checked)
        {
            if (fields[i].value == "N")
                strVal = "No, I do not wish my logo to be featured on any collateral."
            else if (fields[i].value == "YwDELAY" || !bLogoUploaded)
                strVal = "Please include my logo on SVSEF collateral and I will submit by 9/8/2017.";
            else
                strVal = "Please include my uploaded logo on SVSEF collateral."

            break;
        }
    }

    return(strVal);
}

function funcGetRecognizeString()
{
    var strVal = "";

    var fields = document.getElementsByName("svgftRecognizeOther");

    for (var i = 0;  i < fields.length; ++i)
    {
        if (fields[i].selected)
        {
            if (fields[i].value == "N")
                strVal = fields[i].label;
            else
                strVal = document.getElementById("svgftOtherDesc").value;

            break;
        }
    }

    return(strVal);
}

function funcPrintThankYou()
{
    window.print();
}

function funcGetSVSEFID()
{
    return(window.iFrameConstituentForm.funcGetSVSEFID());
}

function funcGetSVSEFLastName()
{
    return(window.iFrameConstituentForm.funcGetSVSEFLastName());
}

function funcGetSVSEFFirstName()
{
    return(window.iFrameConstituentForm.funcGetSVSEFFirstName());
}

function funcGetSVSEFEmail()
{
    return(window.iFrameConstituentForm.funcGetSVSEFEmail());
}

function isDataDirty()
{
    return(window.iFrameConstituentForm.isDataDirty());
}

function funcSetLogoUploaded()
{
    bLogoUploaded = true;
}

function funcSetIFrameHeight(strIFrame)
{
    var height = document.getElementById(strIFrame).contentWindow.funcGetClientHeight();
    if (strIFrame == "iFrameConstituentForm")
        height += 100;
    else if (strIFrame == "iFrameUploadFileForm")
        height += 20;

    funcAdjustIFrame(strIFrame, height); 
}

function funcSetIFrameWidth(strIFrame)
{
    var newwidth = document.getElementById(strIFrame).contentWindow.document.body.scrollWidth;
    var curwidth = document.getElementById(strIFrame).width;
    
    if ( (Number(newwidth) + 1) != Number(curwidth) )
    {
        document.getElementById(strIFrame).width = (Number(newwidth) + 1).toString();
    }
        
}

function funcLoadProgressDlg()
{
    document.getElementById("dialogInProcess").innerHTML = "<br/><img src=\"images/orange.gif\" height=100 width=100 />";
    if (gDlgProcess == null)
        gDlgProcess = $( "#dialogInProcess" ).dialog( "open" );
    else
        gDlgProcess.dialog("open");
    return;
}

function funcCloseProgressDlg()
{
    if (gDlgProcess)
        gDlgProcess.dialog("close");
    
    return;
}

function funcIsNextEventDisplayed()
{
    if (bGiftEntryDisplayed)
    {
        document.getElementById("dialogNewSearchChk").innerHTML = '<img src="images/CautionTransparent.png" class="imgCaution"/>&nbsp;There may be new Contribution Information entered that will be LOST if you proceed with the Search.<br/><br/>' +
                                    "Select 'OK' to continue with the search and lose Contribution changes! Select 'Cancel' to quit the Search.";
        $( "#dialogNewSearchChk" ).dialog( "open" );
    }

    return(bGiftEntryDisplayed);
}

function funcNewSearch()
{
    window.iFrameConstituentForm.funcNewSearch();
}

function funcEndCallSearch()
{
    // Need this for the support of the Constituent Module
}

            





