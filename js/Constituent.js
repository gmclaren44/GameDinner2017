// Module to handle all the
// Constituent Demographic  
// Web App Elements and Events
//
// Author: Gina McLaren
// June 15, 2017
//

// Global Variable to determine which
// HTML Document is Loading this Javascript
var gHTMLDocType = undefined;

// In Process GIF
var gDlgProcess = null;

var HTML_INKIND     = 0;
var HTML_REG        = 1;
var HTML_CHECKIN    = 2;
var HTML_RECORD     = 3;
var HTML_CHECKOUT   = 4;

// Global Form Event Variable Information
// Constituent Fields
var IX_DONOR_ID =   0;
var IX_LAST_NAME =  1;
var IX_FIRST_NAME = 2;
var IX_ADDRESS =    3;
var IX_ADDRESS2 =   4;
var IX_CITY =       5;
var IX_STATE =      6;
var IX_ZIP =        7;
var IX_PHONE =      8;
var IX_MOBILE =     9;
var IX_EMAIL =      10;
var IX_ORG =        11;
var IX_NARRATIVE =  12;
var IX_PHONE =      13;
var IX_MOBILE =     14;
var IX_EMAIL =      15;
var IX_WEB =        16;
var IX_NOMAIL =     17;
var IX_LAST_CONST = 18;

var IX2_HTMLFIELD       = 0;
var IX2_IX              = 1;
var IX2_DEFAULT         = 2;
var IX2_EMAILFIELD_ORIG = 3;
var IX2_EMAILFIELD_NEW  = 4;

var gIX2ConstField = [ ["svsefID",           IX_DONOR_ID,       null,   "svsefID",          null],
                    ["svsefOrg",             IX_ORG,            'N',    "orgOrig",          "orgNew"],
                    ["svsefLastName",        IX_LAST_NAME,      null,   "lastnameOrig",     "lastnameNew"],
                    ["svsefFirstName",       IX_FIRST_NAME,     null,   "firstnameOrig",    "firstnameNew"],
                    ["svsefMailingAddress",  IX_ADDRESS,        null,   "addressOrig",      "addressNew"],
                    ["svsefMailingAddress2", IX_ADDRESS2,       null,   "address2Orig",     "address2New"],
                    ["svsefCity",            IX_CITY,           null,   "cityOrig",         "cityNew"],
                    ["svsefState",           IX_STATE,          "",     "stateOrig",        "stateNew"],
                    ["svsefZip",             IX_ZIP,            null,   "zipOrig",          "zipNew"],
                    ["svsefBusinessPhone",   IX_PHONE,          null,   "phoneOrig",        "phoneNew"],
                    ["svsefMobilePhone",     IX_MOBILE,         null,   "mobileOrig",       "mobileNew"],
                    ["svsefEmail",           IX_EMAIL,          null,   "emailOrig",        "emailNew"],
                    ["svsefWebsite",         IX_WEB,            null,   "websiteOrig",      "websiteNew"] ];

/*var gLabels = [ "labelID",
                    "labelLastName",
                    "labelFirstName",
                    "labelMailingAddress",
                    "labelMailingAddress2",
                    "labelCity",
                    "labelState",
                    "labelZip",
                    "labelBusinessPhone",
                    "labelMobilePhone",
                    "labelEmail",
                    "labelWebsite" ];
*/

var gReqConstituentFields = [ "svsefLastName",
                            "svsefMailingAddress",
                            "svsefCity",
                            "svsefState",
                            "svsefZip",
                            "svsefBusinessPhone",
                            "svsefMobilePhone",
                            "svsefEmail" ];

var gArrOrigFormData = [ ]; 

// Global Settings for the Multi Search
var IX_MULTISEARCH_LAST = 20;
var gArrayMultiSearchIds = [ ];

function funcSetHTMLDocType(iHTMLDocType)
{
    gHTMLDocType = iHTMLDocType;
    if (gHTMLDocType == HTML_REG)
    {
        if (!isEmpty(document.getElementById("lblWebsite")))
            document.getElementById("lblWebsite").hidden = true;
        if (!isEmpty(document.getElementById("svsefWebsite")))
            document.getElementById("svsefWebsite").hidden = true;
    }
}

function funcClearAllConstituentInfo()
{
    // Reset Global Variables
    globalIdSVSEF = null;
    //globalIdGift = null;
    bNewConstituent = false;

    var i;
    for (i = 0; i < gIX2ConstField.length; ++i)
    {
        if (gIX2ConstField[i][IX2_IX] == IX_ORG)
            funcSetOrg(gIX2ConstField[i][IX2_DEFAULT]);
        else
            document.getElementById(gIX2ConstField[i][IX2_HTMLFIELD]).value = gIX2ConstField[i][IX2_DEFAULT];
    }
    
    for (i = 0; i < gArrOrigFormData.length; ++i)
    {
        gArrOrigFormData[i] = null;
    }
    
    // Make sure Update Btn is enabled/disabled appropriately
    funcEnableConstituentBtns();
}

function funcSetFields2OrigArray()
{
    var emailParams = null;
    var i;
    for (i = 0; i < gIX2ConstField.length; ++i)
    {
        if (i == 0)
            emailParams = gIX2ConstField[i][IX2_EMAILFIELD_ORIG] + "=" + encodeURIComponent(gArrOrigFormData[(gIX2ConstField[i][IX2_IX])]);
        else
        {
            emailParams += "&" + gIX2ConstField[i][IX2_EMAILFIELD_ORIG] + "=" + encodeURIComponent(gArrOrigFormData[(gIX2ConstField[i][IX2_IX])]);
            if (gIX2ConstField[i][IX2_IX] == IX_ORG)
                emailParams += "&" + gIX2ConstField[i][IX2_EMAILFIELD_NEW] + "=" + encodeURIComponent(funcGetOrg());
            else
                emailParams += "&" + gIX2ConstField[i][IX2_EMAILFIELD_NEW] + "=" + encodeURIComponent(document.getElementById(gIX2ConstField[i][IX2_HTMLFIELD]).value);
        }
        
        if (gIX2ConstField[i][IX2_IX] == IX_ORG)
            gArrOrigFormData[(gIX2ConstField[i][IX2_IX])] = funcGetOrg();
        else
            gArrOrigFormData[(gIX2ConstField[i][IX2_IX])] = document.getElementById(gIX2ConstField[i][IX2_HTMLFIELD]).value;
    }

    // Make sure Update Btn is enabled/disabled appropriately
    funcEnableConstituentBtns();

    return(emailParams);
}

function funcSetFieldsConstituent(resNode)
{
    var arrXML2Field = [ ["donor_id",   "svsefID",          IX_DONOR_ID],
                        ["last_name",   "svsefLastName",    IX_LAST_NAME],
                        ["first_name",  "svsefFirstName",   IX_FIRST_NAME],
                        ["address",     "svsefMailingAddress",  IX_ADDRESS],
                        ["address2",    "svsefMailingAddress2", IX_ADDRESS2],
                        ["city",        "svsefCity",            IX_CITY],
                        ["state",       "svsefState",           IX_STATE],
                        ["zip",         "svsefZip",             IX_ZIP] ];

    if (!resNode.hasChildNodes())
    {
        console.log("funcSetArrayConstituent ERROR: resNode doesn't have child elements");
        return;
    }

    funcFillFields(resNode, arrXML2Field);
}

function funcSetFieldsConstituentAddtl(resNode)
{
    var arrXML2Field = [ ["business_phone",     "svsefBusinessPhone",   IX_PHONE],
                        ["mobile_phone",        "svsefMobilePhone",     IX_MOBILE],
                        ["email",               "svsefEmail",           IX_EMAIL],
                        ["org_rec",             "svsefOrg",             IX_ORG],
                        ["narrative",           "",                     IX_NARRATIVE] ];

    if (!resNode.hasChildNodes())
    {
        console.log("funcSetFieldsConstituentAddtl ERROR: resNode doesn't have child elements");
        return;
    }

    funcFillFields(resNode, arrXML2Field);
}

function funcSetFieldsConstituentUDF(resNode)
{
    var arrXML2Field = [ ["web",     "svsefWebsite",   IX_WEB] ];

    if (!resNode.hasChildNodes())
    {
        console.log("funcSetFieldsConstituentUDF ERROR: resNode doesn't have child elements");
        return;
    }

    funcFillFields(resNode, arrXML2Field);
}

function funcFillFields(resNode, arrXML2Field)
{
    if (!resNode.hasChildNodes())
        return;

    var i;
    var j;
    for (i = 0; i < resNode.childNodes.length; ++i)
    {
        var nodeID = resNode.childNodes[i].getAttribute("id");
        for (j = 0; j < arrXML2Field.length; ++j)
        {
            if (nodeID == arrXML2Field[j][0])
            {
                if (!isEmpty(arrXML2Field[j][1]))
                {   // Only set to the FORM, is there's a field for it.
                    if (arrXML2Field[j][2] == IX_ORG)
                        funcSetOrg(resNode.childNodes[i].getAttribute("value"));
                    else
                    {
                        document.getElementById(arrXML2Field[j][1]).value = 
                            resNode.childNodes[i].getAttribute("value");
                    } 
                }
                // Always set the data to Orig Array
                gArrOrigFormData[(arrXML2Field[j][2])] = 
                    resNode.childNodes[i].getAttribute("value");
                break;
            }
        }
    }
}


function funcEnableConstituentBtns()
{
    if (isDataDirty())
    {
        // Enable the Update Donor Information Button
        funcEnableBtn("btnUpdateConstituent", true);
        // Disable the New Donor Information Button
        funcEnableBtn("btnNewConstituent", false);
    }
    else
    {
        // Disable the Update Donor Information Button
        funcEnableBtn("btnUpdateConstituent", false);
        // Enable the New Donor Information Button
        funcEnableBtn("btnNewConstituent", true);
    }

    // This needs to hide/show the NEXT ACTION button
    // NOT Add Gift necessarily
    if (!isEmpty(globalIdSVSEF))
    {
        // Enable the New Gift Button
        document.getElementById("btnNextAction").hidden = false;
        document.getElementById("lblNextAction").hidden = false;
    }
    else
    {
        // Disable the New Gift Button
        document.getElementById("btnNextAction").hidden = true;
        document.getElementById("lblNextAction").hidden = true;
    }

}

function funcUpdateConstituentApproved()
{
    // Make sure funcUpdateConstituentApproved is called 
    // as a Callback to the dialog that asks
    // the user if they want to download the 
    // Constituent Information Entered.

    if (isEmpty(globalIdSVSEF) && isEmpty(document.getElementById("svsefID").value))
    {
        // Download data to DonorPerfect
        funcSetConstituent();
    }
    else
    {
        var strUpdateConstituent = funcSetFields2OrigArray();
        sendEmail(strUpdateConstituent, EMAIL_CONSTITUENT_UPDATE, funcParseXMLSendEmailReConstituent);
    }
        
    // Disable the Constituent Fields and enable btnEnableChgConstituent
    funcLoadConstituentForm(false);

    // Make sure Update Btn is enabled/disabled appropriately
    funcEnableConstituentBtns();
}

function funcParseXMLSendEmailReConstituent(resXMLDocument)
{
    console.log("funcParseXMLSendEmailReConstituent: RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log("funcParseXMLSendEmailReConstituent ERROR: resXMLDocument is Null");
        return;
    }

    if (resXMLDocument.getElementsByTagName("message"))
    {
        var idMsg = resXMLDocument.getElementsByTagName("message")[0].getAttribute("id");
        var strValue = resXMLDocument.getElementsByTagName("message")[0].getAttribute("value");
        console.log("funcParseXMLSendEmailReConstituent - Message ID: " + idMsg);
        console.log("funcParseXMLSendEmailReConstituent - Returned Value: " + strValue);
        return;
    }
}

function funcEnableChgConstituent()
{
    // Enable the editing of the Constituent fields
    funcEnableConstituentFields(true);

    // Hide Enable Chg Constituent Btn now
    document.getElementById("btnEnableChgConstituent").hidden = true;
    // Show Update Constituent Btn now
    document.getElementById("btnUpdateConstituent").hidden = false;

    // Make sure Update Btn is enabled/disabled appropriately
    funcEnableConstituentBtns();
}

function funcBuildVerifyConstituentStr()
{
    var strVerifyConstituent = "";
    if (isEmpty(globalIdSVSEF))
        strVerifyConstituent = "Please confirm the New Donor Information to be sent to SVSEF:<br/><br/>";
    else 
        strVerifyConstituent = "Please confirm the Donor Information changes to be sent to SVSEF:<br/><br/>";

    if (!funcGetOrg().localeCompare("Y"))
        strVerifyConstituent += "<b>Organization Name:&nbsp</b>" + document.getElementById("svsefLastName").value + "<br/>";
    else
    {
        strVerifyConstituent += "<b>Last Name:&nbsp</b>" + document.getElementById("svsefLastName").value + "<br/>";

        if (!isEmpty(document.getElementById("svsefFirstName").value))
            strVerifyConstituent += "<b>First Name:&nbsp</b>" + document.getElementById("svsefFirstName").value + "<br/>";
    }
    
    strVerifyConstituent += "<b>Mailing Address:&nbsp</b>" + document.getElementById("svsefMailingAddress").value + "<br/>";

    if (!isEmpty(document.getElementById("svsefMailingAddress2").value))
        strVerifyConstituent += "<b>Mailing Address2:&nbsp</b>" + document.getElementById("svsefMailingAddress2").value + "<br/>";

    strVerifyConstituent += "<b>City:&nbsp</b>" + document.getElementById("svsefCity").value + "<br/>";

    strVerifyConstituent += "<b>State:&nbsp</b>" + funcGetStateName() + "<br/>";

    strVerifyConstituent += "<b>Zip:&nbsp</b>" + document.getElementById("svsefZip").value + "<br/>";

    //if (!isEmpty(document.getElementById("svsefBusinessPhone").value))
    strVerifyConstituent += "<b>Phone:&nbsp</b>" + document.getElementById("svsefBusinessPhone").value + "<br/>";

    //strVerifyConstituent += "<b>Mobile:&nbsp</b>" + document.getElementById("svsefMobilePhone").value + "<br/>";

    strVerifyConstituent += "<b>Email:&nbsp</b>" + document.getElementById("svsefEmail").value + "<br/>";

    strVerifyConstituent += "<b>Website:&nbsp</b>" + document.getElementById("svsefWebsite").value + "<br/>";

    return(strVerifyConstituent);
}

function funcCheckConstituentFormValidity()
{
    var bValid = true;
    for (var i = 0; i < gReqConstituentFields.length; i++)
    {     
        var bNullOK = false;  
        if (!gReqConstituentFields[i].localeCompare("svsefBusinessPhone"))
        {
            //bNullOK = !funcGetPhoneRequired("BUSINESS");
            bNullOK = false;
        }
        else if (!gReqConstituentFields[i].localeCompare("svsefMobilePhone"))
        {
            //bNullOK = !funcGetPhoneRequired("MOBILE");
            bNullOK = true;
        }
            
        if (!funcCheckElementValidity(document.getElementById(gReqConstituentFields[i]),bValid,bNullOK,false) )
            bValid = false;
    }
    
    return(bValid);
}
function funcOnBlurCheckValidity(fieldModified,bNullOK)
{
    if (!funcCheckElementValidity(fieldModified, true, bNullOK,true))
        return;

    if (fieldModified.name == "svsefEmail")
    {   // Notify parent that the email was modified - note:  it's NOT in DP yet
        parent.funcSetContactEmail(fieldModified.value);
    }
    
    // Make sure Update Btn is enabled/disabled appropriately
    funcEnableConstituentBtns();
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

function funcSendNewConstituentEmail()
{
    sendEmail(funcCreateNewConstituentStr(), EMAIL_CONSTITUENT_ADD, funcParseXMLSendEmail);
}

function funcCreateNewConstituentStr()
{
    var emailParams = null;
    var i;
    for (i = 0; i < gIX2ConstField.length; ++i)
    {
        if (i == 0)
            emailParams = gIX2ConstField[i][IX2_EMAILFIELD_ORIG] + "=" + encodeURIComponent(document.getElementById(gIX2ConstField[i][IX2_HTMLFIELD]).value);
        else if (gIX2ConstField[i][IX2_IX] == IX_ORG)
            emailParams += "&" + gIX2ConstField[i][IX2_EMAILFIELD_NEW] + "=" + encodeURIComponent(funcGetOrg());
        else
            emailParams += "&" + gIX2ConstField[i][IX2_EMAILFIELD_NEW] + "=" + encodeURIComponent(document.getElementById(gIX2ConstField[i][IX2_HTMLFIELD]).value);
    }
    
    return(emailParams);
}

function funcShowConstituentForm(bEnableFields)
{
    // Enable the Constituent Entry Form
    document.getElementById("infoConstituentFields").style.display = "inline";

    // Enable or Disable the editing of the fields
    funcEnableConstituentFields(bEnableFields);

}

function funcEnableConstituentFields(bEnableFields)
{
    for (var i = 1; i < gIX2ConstField.length; ++i)
    {
        document.getElementById(gIX2ConstField[i][IX2_HTMLFIELD]).disabled = (bEnableFields ? false : true);
    }
}

function funcSetNextActionDescription(strBtn, strLabel)
{
    document.getElementById("btnNextAction").innerHTML = strBtn;
    document.getElementById("lblNextAction").innerHTML = "&nbsp;" + strLabel;
}

function funcSetSearchDescription(strTitle, strBtnNew, strBtnDesc)
{
    document.getElementById("titleSearch").innerHTML = strTitle;
    document.getElementById("btnNewConstituent").innerHTML = strBtnNew;
    document.getElementById("lblNewConstituent").innerHTML = "&nbsp;" + strBtnDesc;
}

function funcSetConstituentDescription(strTitle, strBtnUpdate, strBtnEnableChange)
{
    document.getElementById("titleConstituent").innerHTML = strTitle;
    document.getElementById("btnUpdateConstituent").innerHTML = strBtnUpdate;
    document.getElementById("btnEnableChgConstituent").innerHTML = strBtnEnableChange;
}


/////////////////////////////////////////////////////////////////////////
// ONCLICK functions
////////////////////////////////////////////////////////////////////////
function funcNextAction()
{
    parent.funcNextAction();
}

function funcNewSearch()
{
    // Clear/Disable the Constituent Entry Form
    funcClearAllConstituentInfo();
    document.getElementById("infoConstituentFields").style.display = "none";

    // Reset and Disable the Multi Search Form in case there's another search
    funcResetnDisableMultiSearch();

    // Clear the search fields from previous searches
    document.getElementById("searchID").value = "";
    document.getElementById("searchLastName").value = "";
    document.getElementById("searchFirstName").value = "";

    parent.Reset();

    parent.funcSetIFrameHeight("iFrameConstituentForm");

    var iOffset = parent.funcOffSetToIFrameConstituentForm();
    parent.funcScrollTo("topOfPage", (iOffset-25));
}

function funcNewConstituent()
{

    funcClearAllConstituentInfo();
    funcShowConstituentForm(true);

    
    // Hide Enable Chg Constituent Btn now
    document.getElementById("btnEnableChgConstituent").hidden = true;
    // Show Update Constituent Btn now
    document.getElementById("btnUpdateConstituent").hidden = false;

    // Make sure Update Btn is enabled/disabled appropriately
    funcEnableConstituentBtns();

    // Set the iFrame to the correct size
    parent.funcSetIFrameHeight("iFrameConstituentForm");

    var iOffset = funcOffsetToNamedForm("infoConstituentForm");
    parent.funcScrollTo("topOfPage", (iOffset-25));
}

function funcSearchConstituent()
{
    if (isDataDirty())
    {
        document.getElementById("dialogLoseConstituentChgs").innerHTML = '<img src="images/CautionTransparent.png" class="imgCaution"/>&nbsp;There is Donor Information entered that will be LOST if you proceed with the Search.<br/><br/>' +
                                    "Select 'OK' to continue with the search and lose changes! Select 'Cancel' to quit the Search.";
        $( "#dialogLoseConstituentChgs" ).dialog( "open" );
        return;
    }

    funcSearchConstituentApproved();
}

function funcSearchConstituentApproved()
{
    // Make sure funcSearchConstituentApproved is called 
    // as a Callback to the dialog that asks
    // the user if they want to lose their changes
    // that have been entered.

    funcClearAllConstituentInfo();

    if (!funcCheckConstituentSearch())
    {
        document.getElementById("dialogAlertNoCallback").innerHTML = "Please enter your SVSEF ID, Organization Name, or First and Last Name to search.";
        $( "#dialogAlertNoCallback" ).dialog( "option", "title", "Search for Donor Information" );
        $( "#dialogAlertNoCallback" ).dialog( "open" );
        return;
    }

    funcGetConstituent();
}

function funcNewSearchWCheck()
{
    if (isDataDirty())
    {
        document.getElementById("dialogNewSearchChk").innerHTML = '<img src="images/CautionTransparent.png" class="imgCaution"/>&nbsp;There is Donor Information entered that will be LOST if you proceed with the Search.<br/><br/>' +
                                    "Select 'OK' to continue with the search and lose changes! Select 'Cancel' to quit the Search.";
        $( "#dialogNewSearchChk" ).dialog( "open" );
        return;
    }

    // Check NEXT ACTION with the parent to see if there's information modified at that level!
    if (gHTMLDocType == HTML_INKIND && parent.funcIsNextEventDisplayed())
        return;
    
    funcNewSearch();
}

function funcVerifyConstituentWUser()
{
    var strDialog = funcBuildVerifyConstituentStr();
    document.getElementById("dialogConstituentConfirmation").innerHTML = strDialog;
    $( "#dialogConstituentConfirmation" ).dialog( "open" );
    return;
}

function funcSetSearchBtns()
{

}

function funcMultiSearchSelected(index)
{
    if (index >= gArrayMultiSearchIds.length || index >= IX_MULTISEARCH_LAST)
    {
        console.log("A mismatch between index: " + index + " and gArrayMultiSearchIds.length: " + gArrayMultiSearchIds.length);
        return;
    }
    if (isEmpty(gArrayMultiSearchIds[index]))
    {
        console.log("gArrayMultiSearchIds[" + index +  "]: " + gArrayMultiSearchIds[index]);
        return;
    }
    
    document.getElementById("searchID").value = gArrayMultiSearchIds[index];
    funcSearchConstituent();

    funcResetnDisableMultiSearch();

}

function funcEnableMultiSearch()
{
    document.getElementById("multiSearchFields").style.display = "inline";

    // Set the iFrame to the correct size
    parent.funcSetIFrameHeight("iFrameConstituentForm");

    var iOffset = funcOffsetToNamedForm("multiSearchForm");
    parent.funcScrollTo("topOfPage", (iOffset-25));
}

function funcResetnDisableMultiSearch()
{
    // Disable the Multi Search Form
    document.getElementById("multiSearchFields").style.display = "none";
    // Reset all the Search List Items in case there's another Multi Search
    for (var i = 0; i < IX_MULTISEARCH_LAST; ++i)
    {
        document.getElementById("searchListItem"+i).hidden = true;
        gArrayMultiSearchIds[i] = null;
    }
}

function funcEnableBtn(btnToSet, bSet)
{
    if (bSet)
    {
        // Enable the Button (btnToSet)
        document.getElementById(btnToSet).disabled = false;
        document.getElementById(btnToSet).editable = true;
        document.getElementById(btnToSet).style.backgroundColor = "#462300";
        document.getElementById(btnToSet).style.borderColor = "#462300";
        document.getElementById(btnToSet).style.color = "white";

    }
    else
    {
        // Disable the Update Donor Information Button
        document.getElementById(btnToSet).disabled = true;
        document.getElementById(btnToSet).editable = false;
        document.getElementById(btnToSet).style.backgroundColor = "#DDDDD9";
        document.getElementById(btnToSet).style.borderColor = "#DDDDD9";  
        document.getElementById(btnToSet).style.color = "#534F4F";
    }
}

function funcCheckConstituentSearch()
{
    var ID = document.getElementById("searchID").value;
    var firstName = document.getElementById("searchFirstName").value;
    var lastName = document.getElementById("searchLastName").value;

    if (!isEmpty(ID) || !isEmpty(firstName) || !isEmpty(lastName))
        return true;

    return false;
}

function funcLoadConstituentForm()
{
    funcShowConstituentForm(false);

    // Show Enable Chg Constituent Btn now
    document.getElementById("btnEnableChgConstituent").hidden = false;
    // Hide Update Constituent Btn now
    document.getElementById("btnUpdateConstituent").hidden = true;

    // Set the iFrame to the correct size
    parent.funcSetIFrameHeight("iFrameConstituentForm");

    var iOffset = funcOffsetToNamedForm("infoConstituentForm");
    parent.funcScrollTo("topOfPage", (iOffset-25));
}

function funcUpdateConstituent()
{
    // Check that all required fields are valid
    if (!funcCheckConstituentFormValidity())
        return;

    funcVerifyConstituentWUser();
}

function funcOnClickOrganization()
{
    if (document.getElementById("svsefOrg").checked)
    {
        document.getElementById("lblLastName").innerHTML = "Organization Name<label class=\"redFont\">*</label>: ";
        document.getElementById("svsefLastName").title = "Enter an Organization Name";
        document.getElementById("errorLastName").innerHTML = "&nbsp;Please enter an Organization Name";
        document.getElementById("lblFirstName").hidden = true;
        document.getElementById("svsefFirstName").hidden = true;
        document.getElementById("svsefFirstName").value = "";
        //document.getElementById("lblBusinessPhone").innerHTML = "Phone<label class=\"redFont\">*</label>: ";
        //document.getElementById("lblMobilePhone").innerHTML = "Mobile: ";
    }
    else
    {
        document.getElementById("lblLastName").innerHTML = "Last Name<label class=\"redFont\">*</label>: ";
        document.getElementById("svsefLastName").title = "Enter a Last Name";
        document.getElementById("errorLastName").innerHTML = "&nbsp;Please enter a Last Name";
        document.getElementById("lblFirstName").hidden = false;
        document.getElementById("svsefFirstName").hidden = false;
        //document.getElementById("lblBusinessPhone").innerHTML = "Phone: ";
        //document.getElementById("lblMobilePhone").innerHTML = "Mobile<label class=\"redFont\">*</label>: ";
    }

    // Make sure Update Btn is enabled/disabled appropriately
    funcEnableConstituentBtns();
}

function funcFillDashes(fieldModified)
{
    if (fieldModified == null)
        return(false);

    if (fieldModified.value.length > 0)
    {   // Trim leading and trailing spaces
        fieldModified.innerHTML.trim();
    }

    if (fieldModified.value.length == 3)
        fieldModified.value = fieldModified.value + "-";
    else if (fieldModified.value.length == 7)
        fieldModified.value =  fieldModified.value + "-";
    else if (fieldModified.value.length > 12)
    {
        fieldModified.value = fieldModified.value.substr(0, 12);
        var sBeep = document.getElementById("beep");
        sBeep.play();
    }

    return(true);
}



/////////////////////////////////////////////////////////////////////////
// GET-SET functions & Communicating with Parent Forms
////////////////////////////////////////////////////////////////////////
function isDataDirty()
{
    var i;
    for (i = 0; i < gIX2ConstField.length; ++i)
    {
        if ( funcGetConstituentFieldValue(i) != gArrOrigFormData[(gIX2ConstField[i][IX2_IX])] )
        {
            if (( isEmpty(funcGetConstituentFieldValue(i)) && isEmpty(gArrOrigFormData[(gIX2ConstField[i][IX2_IX])]) ) ||
                ( (gIX2ConstField[i][IX2_IX] == IX_ORG) && (!funcGetConstituentFieldValue(i).localeCompare("N")) ))
                continue;

            return(true);
        }
    }
    return(false);
}

function funcGetClientHeight()
{
    return(document.getElementById("bodyConstituentForm").clientHeight);
} 

function funcGetStateName()
{
    var fields = document.getElementsByName("svsefState");
    for (var i = 0;  i < fields.length; ++i)
    {
        if (fields[i].selected)
            return(fields[i].label);
    }

    return(null);
}

function funcGetSVSEFID()
{
    return(globalIdSVSEF);
}

function funcGetSVSEFLastName()
{
    return(document.getElementById("svsefLastName").value);
}

function funcGetSVSEFFirstName()
{
    return(document.getElementById("svsefFirstName").value);
}

function funcGetSVSEFMailingAddress()
{
    return(document.getElementById("svsefMailingAddress").value);
}

function funcGetSVSEFMailingAddress2()
{
    return(document.getElementById("svsefMailingAddress2").value);
}

function funcGetSVSEFCity()
{
    return(document.getElementById("svsefCity").value);
}

function funcGetSVSEFState()
{
    return(document.getElementById("svsefState").value);
}

function funcGetSVSEFZip()
{
    return(document.getElementById("svsefZip").value);
}

function funcGetSVSEFEmail()
{
    return(document.getElementById("svsefEmail").value);
}

function funcGetSVSEFMobilePhone()
{
    return(document.getElementById("svsefMobilePhone").value);
}

function funcGetConstituentFieldValue(iIndex)
{
    var val = "";
    if (gIX2ConstField[iIndex][IX2_IX] == IX_ORG)
        val = funcGetOrg();
    else
        val = document.getElementById(gIX2ConstField[iIndex][IX2_HTMLFIELD]).value;

    return(val);
}

function funcGetPhoneRequired(strType)
{
    if (!funcGetOrg().localeCompare("Y") && !strType.localeCompare("BUSINESS"))
        return(true);
    else if (!funcGetOrg().localeCompare("N") && !strType.localeCompare("MOBILE"))
        return (true);
    else
        return(false);
}

function funcGetOrg()
{
    if (document.getElementById("svsefOrg").checked)
        return('Y');
    else
        return('N');
}

function funcSetSearchSVSEFID(strValue)
{
    if (document.getElementById("searchID") != null)
    {
        document.getElementById("searchID").value = strValue;
        if (!isEmpty(strValue))
        {
            funcSetSearchLastName("");
            funcSetSearchFirstName("");
        }
    }
}

function funcSetSearchLastName(strValue)
{
    if (document.getElementById("searchLastName") != null)
    {
        document.getElementById("searchLastName").value = strValue;
        if (!isEmpty(strValue))
            funcSetSearchSVSEFID("");
    }    
}

function funcSetSearchFirstName(strValue)
{
    if (document.getElementById("searchFirstName") != null)
    {
        document.getElementById("searchFirstName").value = strValue;
        if (!isEmpty(strValue))
            funcSetSearchSVSEFID("");
    }  
}

function funcCallSearch()
{   // If this is called, but sure to have 
    // a funcEndCallSearch in parent defined
    funcClearAllConstituentInfo();
    funcGetConstituent();
}

function funcEndCallSearch()
{
    parent.funcEndCallSearch();
}

function funcSetOrg(strValue)
{
    if (!isEmpty(strValue) && strValue == 'Y')
        document.getElementById("svsefOrg").checked = true;
    else
        document.getElementById("svsefOrg").checked = false;

    funcOnClickOrganization();
}

function funcSetSearchListItem(i, sInnerHTML)
{
    var htmlObj = document.getElementById("searchListItem"+i);
    htmlObj.innerHTML = sInnerHTML;
    htmlObj.hidden = false;
}

function funcOffsetToNamedForm(strForm)
{
    var iOffset = parent.funcOffSetToIFrameConstituentForm();
    iOffset += Number(document.getElementById(strForm).offsetTop);
    return(iOffset);
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


        