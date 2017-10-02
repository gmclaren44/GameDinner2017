// Module to handle all the
// Registration Web App 
// Elements and Events
//
// Author: Gina McLaren
// July 27, 2017
//

// In Progress GIF
var gDlgProcess = null;

var REG_TICKETS    = 0;
var REG_SVSEFID    = 1;
var REG_PAYMENT    = 2;
var REG_SUBMIT     = 3;
var REG_FINISHED   = 4;

var strMenus        = [ "menuSelectTickets",
                        "menuFindSVSEFID",
                        "menuPaymentInfo",
                        "menuReviewSubmit"];

var TIXDEFN_ELEMENT      = 0;
var TIXDEFN_DESC         = 1;
var TIXDEFN_PRICE        = 2;
var TIXDEFN_FMV          = 3;
var TIXDEFN_RESTRICT     = 4;
var TIXDEFN_STORAGE      = 5;
var TIXDEFN_ADDTL        = 6;
var TIXDEFN_SUBSOLICIT   = 7;

var TIXADDTL_8SEATS      = 8;
var TIXADDTL_10SEATS     = 10;
var TIXADDTL_12SEATS     = 12;
var TIXADDTL_16SEATS     = 16;


var TIXSPONSOR_FIRSTIDX = 5;
var TIXSPONSOR_LASTIDX  = 8;

var strTableSponsorAddlTickets = "additional seats at Sponsorship Table";

                        //Element           Description                     Price   FMV     Restriction                     SessionStorage              Additional                  Sub_Solicit_Code
var gTixDefinition  = [ ["tixEarly",        "Dinner Tickets",               125,     85,    "through Oct. 20",              "CNT_TIXEARLY",                 null,                       "DINNER_TIX"],
                        ["tixRegular",      "Dinner Tickets",               150,     85,    null /*"after Oct. 20"*/,       "CNT_TIXREGULAR",               null,                       "DINNER_TIX"],
                        ["tixCoach",        "Host a SVSEF Coach",           100,      0,    null,                           "CNT_TIXCOACH",                 null,                       "COACHES_FUND"],
                        ["tixCoachGuest",   "Coach's Guest Tickets",        100,     85,    null,                           "CNT_TIXCOACHGUEST",            null,                       "DINNER_TIX"],
                        ["tixComp",         "Comp Tickets",                   0,     85,    null,                           "CNT_TIXCOMP",                  null,                       "DINNER_TIX"],
                        ["tixSponsor8",     "Table of 8",                  2000,    680,    null,                           "CNT_TIXSPONSOR8",              TIXADDTL_8SEATS,            "TABLESPONSOR"],
                        ["tixSponsor10",    "Table of 10",                 2500,    850,    null,                           "CNT_TIXSPONSOR10",             TIXADDTL_10SEATS,           "TABLESPONSOR"],
                        ["tixSponsor12",    "Table of 12",                 3000,   1020,    null,                           "CNT_TIXSPONSOR12",             TIXADDTL_12SEATS,           "TABLESPONSOR"],
                        ["tixSponsor16",    "Table of 16",                 4000,   1360,    null,                           "CNT_TIXSPONSOR16",             TIXADDTL_16SEATS,           "TABLESPONSOR"],
                        ["tixSponsor",      "Table Sponsorship Tickets",    250,     85,    strTableSponsorAddlTickets,     "CNT_TIXSPONSOR",               null,                       "TABLESPONSOR"],
                        ["regDonation",     "",                              -1,     -1,    null,                           "AMT_DONATION",                 null,                       "DONATION"],
                        ["regRaffle0",      "Single Raffle Ticket",          10,     10,    null,                           "CNT_TIXSINGLERAFFLE",          null,                       "RAFFLE"],
                        ["regRaffle1",      "Group of 6 Raffle Tickets",     50,     50,    null,                           "CNT_TIXGROUPRAFFLE",           null,                       "RAFFLE"]];

var gPGFormURL = null;


var REGDEFN_ELEMENT     = 0;
var REGDEFN_STORAGE     = 1;

var REG_FIRSTNAME       = 0;
var REG_LASTNAME        = 1;

                // Element              SessionStorage
var gRegInfo = [["regFirstName",        "REG_FIRSTNAME"],       
                ["regLastName",         "REG_LASTNAME"]];


/////////////////////////////////////////////////////////////////////////
// BILLING Information
/////////////////////////////////////////////////////////////////////////

var gstrVaultID = null;
var gidxCCVaultInfo = -1;   // idx is 0 based, even though DB fields start with 1

var CCDEFN_TYPE = 0;
var CCDEFN_LEN  = 1;
                // CC Type      CC Length       CVV Length
var gCCType = [ ["VISA",        16,                 3],
                ["MC",          16,                 3],
                ["AMEX",        15,                 4]];

var CCEXP_CHECK_MONTH     = 0;
var CCEXP_CHECK_YEAR      = 1;
var CCEXP_CHECK_BOTH      = 2;


var IDX2_HTMLFIELD    = 0;
var IDX2_REQUIRED     = 1;
var IDX2_SESSSTOR     = 2;
                            // HTML Field               // Not Required         // Session Storage
var gReqBillingFields = [   ["svsefLastName",               false,              "BILLING_LASTNAME"],
                            ["svsefFirstName",              true,               "BILLING_FIRSTNAME"],
                            ["svsefMailingAddress",         false,              "BILLING_MAILINGADDR"],
                            ["svsefMailingAddress2",        true,               "BILLING_MAILINGADDR2"],
                            ["svsefCity",                   false,              "BILLING_CITY"],
                            ["svsefState",                  false,              "BILLING_STATE"],
                            ["svsefZip",                    false,              "BILLING_ZIP"] ];

var BILLING_NAME        = 0;
var BILLING_ADDRESS1    = 1;
var BILLING_ADDRESS2    = 2;
var BILLING_ADDRESS3    = 3;

var REG_NAME            = 0;
var BILL_NAME           = 1;

var gbUserInitiated     = false;
var gLastKey            = 0;


var IDX_RADIO_GRP       = 0;
var IDX_RADIO_ELEM      = 1;
                            // Radio Group      // Radio Element
var gTabStopAssist      = [ ["regRSVP",             "regRSVP0"],
                            ["optTickets",          "optTicket0"],

]



function funcReset(bUserInitiated)
{
    gbUserInitiated     = true;
    gUDFGiftFields[GIFTUDF_TRANSID].value = null;
    gPGFormURL = null;
    window.iFrameConstituentForm.funcClearAllConstituentInfo();

    funcClearRegSessionStorage();
    funcEnableSectionGuestList(false);
    funcEnableSponsorshipGuestsSection(false);


    // Make all the fields in REG_TICKETS clear
    document.getElementById("regFirstName").value = "";
    document.getElementById("regLastName").value = "";
    for (var i = 0; i < gTixDefinition.length; ++i)
    {
        var strElementName = gTixDefinition[i][TIXDEFN_ELEMENT];
        if ( (gTixDefinition[i][TIXDEFN_ELEMENT] == "regRaffle0") || (gTixDefinition[i][TIXDEFN_ELEMENT] == "regRaffle1") )
            continue;
        if (gTixDefinition[i][TIXDEFN_ELEMENT] != "AMT_DONATION")
            strElementName = "sv" + strElementName;

        if (document.getElementById(strElementName) != null)
            document.getElementById(strElementName).value = "";
    }

    var fields = document.getElementsByName("svPaymentType");
    for (var i = 0; i < fields.length; ++i)
    {
        if (isEmpty(fields[i].value))
        {
            fields[i].selected = true;
            break;
        }
    }

    document.getElementById("svPaymentCC").value = "";
    document.getElementById("svPaymentExpMonth").value = "";
    document.getElementById("svPaymentExpYear").value = "";
    document.getElementById("svPaymentCVV").value = "";
    document.getElementById("svSendCheck").checked = false;

    for (var i = 0; i < gReqBillingFields.length; ++i)
    {
        document.getElementById(gReqBillingFields[i][IDX2_HTMLFIELD]).value = "";
    }

    funcEnableDonationOnlySection(false);
    funcEnableTicketOptionsSection(false);

    // Reset UI until next Thank You!
    document.getElementById("lblReviewMsg").innerHTML = "Review Game Dinner Tickets";
    document.getElementById("lblReview").hidden = false;
    document.getElementById("lblSeatOption").value = "";

    document.getElementById("lblThankYou1").hidden = true;
    document.getElementById("lblThankYou2").hidden = true;
    document.getElementById("lblThankYou2").innerHTML = "";

    document.getElementById("btnSubmit").hidden = false;
    document.getElementById("btnReset").hidden = true;
    funcOnLoadMenuCanvas(REG_TICKETS);
    gbUserInitiated = false;
}

function funcSetFormURL(strFormURL)
{   // Called from the iFrame regPG_SubmitTarget
    gPGFormURL = strFormURL;
    parent.funcSetCCFormAction(gPGFormURL);
    console.log("Success gPGFormURL == > " + gPGFormURL);
}

function funcReportError(strError)
{   // Called from the iFrame regPG_SubmitTarget
    console.log(strError);
    var strErrorResult = "There was a Transaction Error: " + strError;
    strErrorResult += "<br/><br/>Please check the Credit Card number and try again."
    funcCloseProgressDlg();

    // Send an EMAIL to SVSEFIT about the Transaction Error
    sendEmail(funcCreateTransErrorStr(strErrorResult, ""), EMAIL_REPORT_TRANS_ERR, funcParseXMLSendEmail);
    sendEmail(funcCreateTransError2Str(strErrorResult, ""), EMAIL_REPORT_TRANS_ERR2, funcParseXMLSendEmail);
    funcSetMsgSubmitResult(strErrorResult);

    funcOnLoadMenuCanvas(REG_PAYMENT);
}

function funcSetCCFormAction(strFormURL)
{
    document.getElementById("regCCForm").action = strFormURL;
    document.getElementById("regCCForm").submit();
}

function funcReceiveTransactionApprovedResult(strResultText,strTransID)
{
    var strApprovedResult = "The Transaction Approved Result: " + strResultText + " Transaction ID: " + strTransID;
    console.log("funcReceiveTransactionApprovedResult - " + strApprovedResult);
    gUDFGiftFields[GIFTUDF_TRANSID].value = "SafeSave: " + strTransID;

    // Download Gift to DP & Send Email
    funcDownloadDPGiftORPledgeEntries();
}

function funcGeneralError(strResultText, strID)
{
    if ( (window.sessionStorage.getItem("VAULT_COMMAND") != null) && (window.sessionStorage.getItem("VAULT_COMMAND") == "sale") )
        funcReceiveTransactionDeclinedResult(strResultText,strID);
    else
        funcReceiveVaultError(strResultText, strID);
}

function funcReceiveTransactionDeclinedResult(strResultText,strTransID)
{
    var strDeclinedResult = "The Transaction was Declined: " + strResultText + "<br/>Transaction ID: " + strTransID;
    strDeclinedResult += "<br/><br/>Please check the Credit Card number and try again."
    funcCloseProgressDlg();

    // Send an EMAIL to SVSEFIT about the Transaction Error
    sendEmail(funcCreateTransErrorStr(strDeclinedResult, ""), EMAIL_REPORT_TRANS_ERR, funcParseXMLSendEmail);
    sendEmail(funcCreateTransError2Str(strDeclinedResult, ""), EMAIL_REPORT_TRANS_ERR2, funcParseXMLSendEmail);
    funcSetMsgSubmitResult(strDeclinedResult);

    funcOnLoadMenuCanvas(REG_PAYMENT);
}

function funcReceiveTransactionErrorResult(strResultText,strTransID)
{
    var strErrorResult = "There was a Transaction Error: " + strResultText + "<br/>Transaction ID: " + strTransID;
    strErrorResult += "<br/><br/>Please check the Credit Card number and try again."
    funcCloseProgressDlg();

    // Send an EMAIL to SVSEFIT about the Transaction Error
    sendEmail(funcCreateTransErrorStr(strErrorResult, ""), EMAIL_REPORT_TRANS_ERR, funcParseXMLSendEmail);
    sendEmail(funcCreateTransError2Str(strErrorResult, ""), EMAIL_REPORT_TRANS_ERR2, funcParseXMLSendEmail);
    funcSetMsgSubmitResult(strErrorResult);

    funcOnLoadMenuCanvas(REG_PAYMENT);
}

function funcReceiveVaultError(strResultText,strVaultID)
{
    var strVaultResult = "The Vault Entry Error: " + strResultText + " Vault ID: " + strVaultID;
    //funcSetMsgSubmitResult(strVaultResult);

    // Send an EMAIL to SVSEFIT about the Vault Error
    sendEmail(funcCreateVaultErrorStr(strResultText, strVaultID), EMAIL_REPORT_VAULT_ERR, funcParseXMLSendEmail);
    sendEmail(funcCreateVaultError2Str(strResultText, strVaultID), EMAIL_REPORT_VAULT_ERR2, funcParseXMLSendEmail);

    // We tried to add CC to Vault and it failed.
    // Message was sent to SVSEFIT for investigating,
    // now continue to Review and Submit
    gstrVaultID = "ERROR";
    funcContinueToReviewNSubmit();
}

function funcReceiveVaultResult(strResultText,strVaultID)
{
    var strVaultResult = "The Vault Entry Result: " + strResultText + " Vault ID: " + strVaultID;
    //funcSetMsgSubmitResult(strVaultResult);

    gstrVaultID = strVaultID;
    funcAddCCVaultInfo(gstrVaultID);
}

function funcLookupCCInVault()
{
    var strLastName = window.sessionStorage.getItem("BILLING_LASTNAME");
    var strCC = "xxxx" + funcGetCCVaultLookupStr();
    document.getElementById("lookuplastname").value = window.sessionStorage.getItem("BILLING_LASTNAME");
    document.getElementById("lookupcc").value = "xxxx" + funcGetCCVaultLookupStr();

    document.getElementById("regLUpForm").submit();
}

function funcSetVaultID(strLastname,strVaultID,strCCRet)
{
    var strVaultResult = "Found CC in Vault for Lastname: " + strLastname + " CC: " + strCCRet + " Vault ID: " + strVaultID;
    //funcSetMsgSubmitResult(strVaultResult);

    gstrVaultID = strVaultID;
    if (isEmpty(gstrVaultID))
    {   // CC is not already in the Vault, 
        // add the CC to the Vault
        funcPrepareNSubmitTransaction(true);
    }
    else if (gstrVaultID == "ERROR")
    {
        // We tried to query the Vault for the CC and it failed.
        funcContinueToReviewNSubmit();
    }
    else
    {   // CC *IS* already in the Vault, 
        // but make sure its up-to-date
        funcPrepareNSubmitTransaction(true);
    }
}

function funcSetMsgSubmitResult(strMsg)
{
    document.getElementById("dialogAlertNoCallback").innerHTML = strMsg;
    $( "#dialogAlertNoCallback" ).dialog( "option", "title", "Submit Billing Info Results" );
    $( "#dialogAlertNoCallback" ).dialog( "open" );
    return;
}

function funcSetMsgCCResult(strMsg)
{
    document.getElementById("msgCCResult").innerHTML = strMsg;
}

/////////////////////////////////////////////////////////////////////////
// GUESTS Linked List 
/////////////////////////////////////////////////////////////////////////
var gGuestHighestAdded = null;
var gGuestLastAdded = null;
var gGuestStart = null;
var TIXGUEST = 0;

var gSPGuestHighestAdded = null;
var gSPGuestLastAdded = null;
var gSPGuestStart = null;
var SPGUEST = 1;

function guest(idx = 0, bAutoAssign = true)
{
    this.index = idx;
    if ( bAutoAssign && (gGuestHighestAdded != null) && ((parseInt(gGuestHighestAdded.index) + 1) > this.index) )
        this.index = parseInt(gGuestHighestAdded.index) + 1;

    this.next = null;

    gGuestLastAdded = this;
    if (gGuestHighestAdded == null)
        gGuestHighestAdded = this;
    if (gGuestLastAdded.index > gGuestHighestAdded.index)
        gGuestHighestAdded = gGuestLastAdded;
    window.sessionStorage.setItem("guestLastAddedIdx", gGuestLastAdded.index.toString());
    window.sessionStorage.setItem("guestHighestAddedIdx", gGuestHighestAdded.index.toString());
    if (gGuestStart == null)
    {
        gGuestStart = this;
        window.sessionStorage.setItem("guestStartIdx", this.index.toString());
    }   
}

function spguest(idx = 0, bAutoAssign = true)
{
    this.index = idx;
    if ( bAutoAssign && (gSPGuestHighestAdded != null) && ((parseInt(gSPGuestHighestAdded.index) + 1) > this.index) )
        this.index = parseInt(gSPGuestHighestAdded.index) + 1;

    this.next = null;

    gSPGuestLastAdded = this;
    if (gSPGuestHighestAdded == null)
        gSPGuestHighestAdded = this;
    if (gSPGuestLastAdded.index > gSPGuestHighestAdded.index)
        gSPGuestHighestAdded = gSPGuestLastAdded;
    window.sessionStorage.setItem("spguestLastAddedIdx", gSPGuestLastAdded.index.toString());
    window.sessionStorage.setItem("spguestHighestAddedIdx", gSPGuestHighestAdded.index.toString());
    if (gSPGuestStart == null)
    {
        gSPGuestStart = this;
        window.sessionStorage.setItem("spguestStartIdx", this.index.toString());
    }   
}

function funcRebuildGuestRows(iType = TIXGUEST)
{
    if ( (iType == TIXGUEST && gGuestStart != null) || (iType == SPGUEST && gSPGuestStart != null) )
        return;

    var strPre = "";
    if (iType == SPGUEST)
        strPre = "sp";

    var iStartIdx = window.sessionStorage.getItem(strPre + "guestStartIdx");
    if (iStartIdx == null)
        return;

    var curRow = null;
    if (iType == TIXGUEST)
    {
        gGuestLastAdded = null;
        curRow = new guest(iStartIdx, false);
    }
    else if (iType == SPGUEST)
    {
        gSPGuestLastAdded = null;
        curRow = new spguest(iStartIdx, false);
    }  

    var iNextIdx = window.sessionStorage.getItem(strPre + "guestNextIdx" + iStartIdx.toString());
    while (curRow != null & iNextIdx != null && iNextIdx > -1)
    {
        if (iType == TIXGUEST)
            curRow.next = new guest(iNextIdx, false);
        else if (iType == SPGUEST)
            curRow.next = new spguest(iNextIdx, false);
            
        curRow = curRow.next;
        iNextIdx = window.sessionStorage.getItem(strPre + "guestNextIdx" + iNextIdx.toString());
    }
}

function funcAddGuestRow(idxFollow, iType = TIXGUEST)
{
    var curRow = null;
    var strPre = "";
    if (iType == TIXGUEST)
        curRow = gGuestStart;
    else if (iType == SPGUEST)
    {
        curRow = gSPGuestStart;
        strPre = "sp";
    }

    while (curRow != null) 
    {
        if (curRow.index == idxFollow)
        {
            var newRow = null;
            if (iType == TIXGUEST)
                newRow = new guest();
            else if  (iType == SPGUEST)
                newRow = new spguest();

            if (newRow == null)
                break;

            newRow.next = curRow.next;
            window.sessionStorage.setItem(strPre + "guestNextIdx" + newRow.index.toString(), (newRow.next != null ? newRow.next.index.toString() : "-1"));
            curRow.next = newRow;
            window.sessionStorage.setItem(strPre + "guestNextIdx" + curRow.index.toString(), (curRow.next != null ? curRow.next.index.toString() : "-1"));
            break;
        }
        curRow = curRow.next;
    }
}

function funcRemoveGuestRow(idxRemove, iType = TIXGUEST)
{
    var curRow = null;
    var strPre = "";
    if (iType == TIXGUEST)
        curRow = gGuestStart;
    else if (iType == SPGUEST)
    {
        curRow = gSPGuestStart;
        strPre = "sp";
    }
        

    var prevRow = curRow;
    while (curRow != null)
    {
        if (curRow.index == idxRemove)
        {
            if (curRow.index == prevRow.index)
            {   // Removing Start of List
                if (iType == TIXGUEST)
                {
                    gGuestStart = curRow.next;
                    if (gGuestStart == null)
                        window.sessionStorage.removeItem("guestStartIdx");
                    else
                        window.sessionStorage.setItem("guestStartIdx", gGuestStart.index.toString());
                }
                else if (iType == SPGUEST)
                {
                    gSPGuestStart = curRow.next;
                    if (gSPGuestStart == null)
                        window.sessionStorage.removeItem("spguestStartIdx");
                    else
                        window.sessionStorage.setItem("spguestStartIdx", gSPGuestStart.index.toString());
                }
                break;
            }
            else
            {
                prevRow.next = curRow.next;
                window.sessionStorage.setItem(strPre + "guestNextIdx" + prevRow.index.toString(), (prevRow.next != null ? prevRow.next.index.toString() : "-1"));
                break;
            }
        }

        prevRow = curRow;
        curRow = curRow.next;
    } 
}

function funcGetGuestRowCnt(iType = TIXGUEST)
{
    var curRow = gGuestStart;
    if (iType == SPGUEST)
        curRow = gSPGuestStart;

    var iCnt = 0;
    while (curRow != null)
    {
        iCnt++;
        curRow = curRow.next;
    }

    return(iCnt);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Event Handling
//////////////////////////////////////////////////////////////////////////////////////////////////

function funcOnLoadRegistrationForm()
{   // Loading the REGISTRATION FORM
    var HTML_REG        = 1;
    window.iFrameConstituentForm.funcSetHTMLDocType(HTML_REG);
    window.iFrameConstituentForm.funcClearAllConstituentInfo();
    window.iFrameConstituentForm.funcSetNextActionDescription("Payment", "Please select 'Payment', to enter your payment information");
    window.iFrameConstituentForm.funcSetSearchDescription("Search for your SVSEF Information", "New Patron", "Please select 'New Patron', if you are a new SVSEF Patron");
    window.iFrameConstituentForm.funcSetConstituentDescription("SVSEF Patron Information", "Update Patron", "Patron Changes");

    // Make sure Update Btn is enabled/disabled appropriately
    window.iFrameConstituentForm.funcEnableConstituentBtns(); 

    // Must Add the Event Listener to *ALL* the tabable elements first 
    // and then remove 'tabable' from the tabhideable elements
    var tabableElems = document.getElementsByClassName("tabable");
    for (var i = 0; i < tabableElems.length; ++i)
    {
        tabableElems[i].addEventListener("keydown", function()
        {
            funcOnKeyDown();
        }, true);
    }

    var tabhideableElems = document.getElementsByClassName("tabhideable");
    var strDebug = "Removed tabable from the following: ";
    for (var i = 0; i < tabhideableElems.length; ++i)
    {
        document.getElementById(tabhideableElems[i].id).classList.remove("tabable");
        if (i)
            strDebug +=  ", ";
        strDebug += tabhideableElems[i].id;
    }
    console.log(strDebug);
    //alert(strDebug);

    var strURL = window.location.protocol + "//" + window.location.host + "/GameDinner2017/RegistrationForm.html";
    window.history.pushState(null, "SVSEF Game Dinner Registration", strURL);

    // Create the menu
    funcOnLoadMenuCanvas(funcGetRegistrationPhase());

    funcScrollTo("topOfPage", -20);
}

function funcOnKeyDown()
{
    gLastKey = window.event.keyCode;
}

function funcOnFocusOut(curElemName)
{
    if (gLastKey != 9)
        return;
    
    gLastKey = 0;
    // We got here by the tab being selected!
    var tabableElems = document.getElementsByClassName("tabable");
    for (var i = 0; i < tabableElems.length; ++i)
    {
        if (i == (tabableElems.length - 1))
        {
            //document.getElementById("btnContinueReg").focus();
            break;
        }

        //if (curElem == tabableElems[i].children[0].name)
        if (curElemName == tabableElems[i].name)
        {
            var nextElem = document.getElementById(tabableElems[i+1].id);
            //alert(strDebug);
            /*
            while ((nextElem != null) && (nextElem.hidden == true) && (i < tabableElems.length))
            {
                 ++i;
                nextElem = document.getElementById(tabableElems[i+1].name);
            }

            if (nextElem == null) 
            {
                for (var j = 0; j < gTabStopAssist.length; ++j)
                {
                    if (tabableElems[i+1].name == gTabStopAssist[j][IDX_RADIO_GRP])
                    {
                        nextElem = document.getElementById(gTabStopAssist[j][IDX_RADIO_ELEM]);
                        break;
                    }
                }
            }
            */
            if (nextElem != null)
            {
                nextElem.focus();
                var strDebug = "Tab Selected in Element: " + curElemName + " Heading to  Element: " + (nextElem != null ? nextElem.name : "");
                console.log(strDebug);

                var e = this.event || window.event;

                if (e.stopPropagation)
                    e.stopPropagation();
                else
                    e.cancelBubble = true;
                //this.stopPropagation();

                
            }
                
                
            break;
        }    
    }

}

function funcCVVCodeExplanation()
{
    document.getElementById("dialogAlertNoCallback").innerHTML = 'Please enter the 3 or 4 digit ID Number of your<br/>Credit Card as shown on the cards below:<br/><br/><table width="100%" border="0"><tr><td align="center"><img src="images/CVVCode.jpg" class="imgCVVHelp"/></td></tr></table><br/><br/>';
    $( "#dialogAlertNoCallback" ).dialog( "option", "title", "What's the CVV Code?" );
    $( "#dialogAlertNoCallback" ).dialog( "open" );
    return;
}

function funcNextAction()
{
    // Check to make sure there's a valid svsefID
    if (isEmpty(funcGetRegSVSEFID(true)))
    {
        document.getElementById("dialogAlertNoCallback").innerHTML = "Please find your SVSEF ID and contact information first!";
        $( "#dialogAlertNoCallback" ).dialog( "option", "title", "SVSEF Patron Information" );
        $( "#dialogAlertNoCallback" ).dialog( "open" );
        return;
    }

    if (isDataDirty())
    {
        document.getElementById("dialogAlertNoCallback").innerHTML = "Your Patron Information has been modified.<br/>Please save that information first by selecting 'Update Patron'!";
        $( "#dialogAlertNoCallback" ).dialog( "option", "title", "SVSEF Patron Information" );
        $( "#dialogAlertNoCallback" ).dialog( "open" );
        return;
    }
    
    if (!funcIsRegistrationPhaseComplete(REG_SVSEFID))
        return;

    funcOnLoadMenuCanvas(REG_PAYMENT);
    funcScrollTo("menuCanvas", -10);
}

function funcClearMenuCanvas()
{
    var menuCanvas = document.getElementById("menuCanvas");
    var curHeight = menuCanvas.height;
    var curWidth = menuCanvas.width;
    var context = menuCanvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, curWidth, curHeight);
}

function funcOnLoadMenuCanvas(idxMenu, strElement = null)
{
    var idxToLoad = funcRegistrationPhaseToComplete();
    if (idxToLoad == -1)
        return;

    idxMenu = (idxToLoad < idxMenu ? idxToLoad : idxMenu);

    funcClearMenuCanvas();

    funcLoadMenu(REG_SUBMIT, (idxMenu == REG_SUBMIT) ? true : false);
    funcLoadMenu(REG_PAYMENT, (idxMenu == REG_PAYMENT) ? true : false);
    funcLoadMenu(REG_SVSEFID, (idxMenu == REG_SVSEFID) ? true : false);
    funcLoadMenu(REG_TICKETS, (idxMenu == REG_TICKETS) ? true : false);

    funcLoadForm(idxMenu);

    if (!isEmpty(strElement))
        funcScrollTo(strElement, -10);
}

function funcLoadMenu(idxMenu, bActive)
{
    var menuCanvas = document.getElementById("menuCanvas");
    
    var curHeight = menuCanvas.height;
    var curWidth = menuCanvas.width;
    var iconWidth = (curWidth-5)/4;
    var iconHeight = curHeight;
    
    iconLHS = (idxMenu * iconWidth) + 5;
    if (idxMenu == REG_SUBMIT)
        iconWidth -= 1;
    iconRHS = iconLHS + iconWidth;
    
    console.log("Menu: " + iconLHS + ", " + iconRHS);
    var context = menuCanvas.getContext("2d");
    var grd=context.createLinearGradient(iconLHS,0,iconRHS-20,0);
    if (bActive)
        grd.addColorStop(0,"#FF8205");  // orange
    else
        grd.addColorStop(0,"#888888");  // gray
    grd.addColorStop(1,"#462300");  // gd brown
    context.fillStyle=grd;
    context.fillRect(iconLHS,0,iconWidth-20,iconHeight);

    if (iconLHS > 20)
    {
        var grd2=context.createLinearGradient(iconLHS-20,0,iconLHS+1,0);
        if (bActive)
        {   // To Determine
            grd2.addColorStop(0,"#FFFFFF");  // light gray
            grd2.addColorStop(1,"#FF8205");  // orange
        }
        else
        {
            grd2.addColorStop(0,"#FFFFFF");  // light gray
            grd2.addColorStop(1,"#888888");  // gray
        }
        context.fillStyle=grd2;
        context.fillRect(iconLHS-20,0,21,iconHeight);
    }
    else
    {
        var grd2=context.createLinearGradient(iconLHS-5,0,iconLHS+1,0);
        if (bActive)
        {   // To Determine
            grd2.addColorStop(0,"#FFFFFF");  // light gray
            grd2.addColorStop(1,"#FF8205");  // orange
        }
        else
        {
            grd2.addColorStop(0,"#FFFFFF");  // light gray
            grd2.addColorStop(1,"#888888");  // gray
        }
        context.fillStyle=grd2;
        context.fillRect(iconLHS-5,0,6,iconHeight);

    }
    
   
    context.beginPath();
    context.strokeStyle = "#462300";
    context.fillStyle = "#462300";
    context.lineWidth = 2;

    context.moveTo(iconRHS-20,0);
    context.lineTo(iconRHS,curHeight/2);
    context.lineTo(iconRHS-20,curHeight);
    context.lineTo(iconRHS-20,0);
    context.fill();   
    context.beginPath();
    context.moveTo(iconRHS-20,2);
    context.lineTo(iconRHS-20,iconHeight-2);
    context.stroke(); 
    
}

function funcLoadForm(idxMenu)
{
    funcSetRegistrationPhase(idxMenu);

    switch(idxMenu)
    {
        case REG_TICKETS:
            funcLoadSelectTicketsForm();
            document.getElementById("iFrameConstituentForm").hidden = true;

            // Preliminary Payment Info
            document.getElementById("regPG_SubmitTarget").hidden = true;
            document.getElementById("regPGFields").style.display = "none";
            document.getElementById("regPG_CCTarget").hidden = true;

            document.getElementById("infoReviewFields").style.display = "none";
            document.getElementById("infoPaymentFields").style.display = "none";
            break;
        case REG_SVSEFID:
            document.getElementById("infoTixFields").style.display = "none";
            funcLoadPatronForm();

            // Preliminary Payment Info
            document.getElementById("regPG_SubmitTarget").hidden = true;
            document.getElementById("regPGFields").style.display = "none";
            document.getElementById("regPG_CCTarget").hidden = true;

            document.getElementById("infoReviewFields").style.display = "none";
            document.getElementById("infoPaymentFields").style.display = "none";
            break;
        case REG_PAYMENT:
            document.getElementById("infoTixFields").style.display = "none";
            document.getElementById("iFrameConstituentForm").hidden = true;

            // Preliminary Payment Info
            document.getElementById("regPG_SubmitTarget").hidden = false;
            document.getElementById("regPGFields").style.display = "none";
            document.getElementById("regPG_CCTarget").hidden = false;

            document.getElementById("infoReviewFields").style.display = "none";
            funcLoadInfoPaymentForm();
            break;
        case REG_SUBMIT:
            document.getElementById("infoTixFields").style.display = "none";
            document.getElementById("iFrameConstituentForm").hidden = true;

            // Preliminary Payment Info
            document.getElementById("regPG_SubmitTarget").hidden = true;
            document.getElementById("regPGFields").style.display = "none";
            document.getElementById("regPG_CCTarget").hidden = true;

            funcLoadReviewSubmitForm();
            document.getElementById("infoPaymentFields").style.display = "none";
            break;
    }

    funcScrollTo("menuCanvas", -10);
}

function funcLoadSelectTicketsForm()
{
    document.getElementById("infoTixFields").style.display = "inline";
    window.sessionStorage.removeItem("INIT_TIXFORM");

    if (!funcIsRegNameValid())
    {   // Clear the sessionStorage
        funcClearRegSessionStorage();
    }

    for (i = 0; i < gTixDefinition.length; i++)
    {
        // Do the labels need to be set?
        if (window.sessionStorage.getItem("INIT_TIXFORM") == null || window.sessionStorage.getItem("INIT_TIXFORM") == "false")
        {
            var strTixCnt = "sv" + gTixDefinition[i][TIXDEFN_ELEMENT];
            if (document.getElementById(strTixCnt) != null)
            {
                document.getElementById(strTixCnt).title = gTixDefinition[i][TIXDEFN_DESC];
                if (gTixDefinition[i][TIXDEFN_RESTRICT] != null)
                    document.getElementById(strTixCnt).title += " (" + gTixDefinition[i][TIXDEFN_RESTRICT] + ")";
            }
            
            
            var strTixLbl = "lbl" + gTixDefinition[i][TIXDEFN_ELEMENT];
            if (document.getElementById(strTixLbl) != null)
            {
                document.getElementById(strTixLbl).innerHTML = gTixDefinition[i][TIXDEFN_DESC];
                if (gTixDefinition[i][TIXDEFN_RESTRICT] != null)
                    document.getElementById(strTixLbl).innerHTML += " (" + gTixDefinition[i][TIXDEFN_RESTRICT] + ")";
            }

            // Set Price
            var strPriceLbl = "price" + gTixDefinition[i][TIXDEFN_ELEMENT];
            if (document.getElementById(strPriceLbl) != null)
            {
                document.getElementById(strPriceLbl).innerHTML = "$" + gTixDefinition[i][TIXDEFN_PRICE];
            }

            // Set Tax Deductible Label
            funcSetTaxDeductible(i);
            
        }

        var strTixCnt = "sv" + gTixDefinition[i][TIXDEFN_ELEMENT];

        if (window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]) == null)
            window.sessionStorage.setItem(gTixDefinition[i][TIXDEFN_STORAGE], "0");

        if ((document.getElementById(strTixCnt) != null) && (parseInt(window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE])) > 0))
        {
            if ((gTixDefinition[i][TIXDEFN_ELEMENT] == "regRaffle0") || (gTixDefinition[i][TIXDEFN_ELEMENT] == "regRaffle1"))
                document.getElementById(strTixCnt).checked = true;
            else
                document.getElementById(strTixCnt).value = window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]);

            if (gTixDefinition[i][TIXDEFN_ELEMENT] == "regDonation")
                document.getElementById(strTixCnt).value = "$" + funcFormatSubTotal(document.getElementById(strTixCnt).value);
        }
            
    }

    funcLoadRegInfo();
    funcCalculateTixTotal();
    
    window.sessionStorage.setItem("INIT_TIXFORM", "true");
}

function funcSetTaxDeductible(index)
{
    var strTaxLbl = "taxlbl" + gTixDefinition[index][TIXDEFN_ELEMENT];
    if (document.getElementById(strTaxLbl) != null)
    {
        var iCntTix = (!isEmpty(window.sessionStorage.getItem(gTixDefinition[index][TIXDEFN_STORAGE])) ? parseInt(window.sessionStorage.getItem(gTixDefinition[index][TIXDEFN_STORAGE])) : 0);
        if (!iCntTix)
            ++iCntTix;
        var iDonation = (parseInt(gTixDefinition[index][TIXDEFN_PRICE]) - parseInt(gTixDefinition[index][TIXDEFN_FMV])) * iCntTix;
        document.getElementById(strTaxLbl).innerHTML = "Tax-deductible donation: $" + iDonation.toString();
    }
}

function funcLoadPatronForm()
{
    if (window.sessionStorage.getItem("REG_SVSEFID") != null && parseInt(window.sessionStorage.getItem("REG_SVSEFID")) > 0)
        window.iFrameConstituentForm.funcSetSearchSVSEFID(window.sessionStorage.getItem("REG_SVSEFID"));
    else if (window.sessionStorage.getItem("REG_FIRSTNAME") != null && window.sessionStorage.getItem("REG_LASTNAME") != null)
    {
        window.iFrameConstituentForm.funcSetSearchFirstName(window.sessionStorage.getItem("REG_FIRSTNAME"));
        window.iFrameConstituentForm.funcSetSearchLastName(window.sessionStorage.getItem("REG_LASTNAME"));
    }
    funcLoadProgressDlg();
    window.iFrameConstituentForm.funcCallSearch();
    document.getElementById("iFrameConstituentForm").hidden = false;       
}        

function funcLoadRegInfo()
{
    document.getElementById("regFirstName").value = (!isEmpty(window.sessionStorage.getItem("REG_FIRSTNAME")) ? window.sessionStorage.getItem("REG_FIRSTNAME").trim() : "");
    document.getElementById("regLastName").value = (!isEmpty(window.sessionStorage.getItem("REG_LASTNAME")) ? window.sessionStorage.getItem("REG_LASTNAME").trim() : "");

    // Load RSVP, if defined
    if (funcIsRegNameValid() && window.sessionStorage.getItem("RSVP") != null)
    {
        fields = document.getElementsByName("regRSVP");
        for (var i = 0; i < fields.length; i++)
        {
            if (window.sessionStorage.getItem("RSVP") == fields[i].value)
            {
                fields[i].checked = true;
                funcOnChangeRSVP(fields);
                break;
            }
        }
    }
}

function funcClearRegSessionStorage()
{
    window.sessionStorage.removeItem("RSVP");
    window.sessionStorage.removeItem("optSeatWith");
    window.sessionStorage.removeItem("SENDCHECK");

    for (var i = 0; i < gTixDefinition.length; i++)
    {
        window.sessionStorage.setItem(gTixDefinition[i][TIXDEFN_STORAGE], "0");
    }

    // Make sure the RSVP, Raffle, Sponsor, SeatWith, and Ticket radio buttons are unset
    funcResetRadioGroup("regRSVP");
    funcResetRadioGroup("regRaffle");
    funcResetRadioGroup("tixSponsor");
    funcResetRadioGroup("optSeating");
    funcResetRadioGroup("optTickets");

    funcRemoveGuestSessionStor(-1, TIXGUEST);
    funcRemoveGuestSessionStor(-1, SPGUEST);
}

function funcLoadReviewSubmitForm()
{
    document.getElementById("infoReviewFields").style.display = "inline";

    //////////////////////////////////////////////////////////////
    // TICKET INFORMATION ITEMIZED
    //////////////////////////////////////////////////////////////
    var elem = document.getElementById("tblReviewFields");
    // First clear the current contents in the review form 
    elem.innerHTML = "";

    // Then regenerate the contents in the review form
    var bHeaders = false;
    var iSubTotal = 0;
    for (i = 0; i < gTixDefinition.length; i++)
    {
        var strCnt = window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]);
        if (parseInt(strCnt) > 0)
        {
            if (!bHeaders)
            {
                elem.innerHTML += "<tr>" +
                                    "<th class=\"tdReviewFieldsLeft\">Ordered</th>" +
                                    "<th class=\"tdReviewFieldsMiddle\">Description</th>" +
                                    "<th class=\"tdReviewFieldsRight\">Subtotal</th>" +
                                "</tr>";
                bHeaders = true;
            }

            if (gTixDefinition[i][TIXDEFN_STORAGE] == "AMT_DONATION")
            {
                elem.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewFieldsMiddle\">SVSEF Donation</td>" +
                                "<td class=\"tdReviewFieldsRight\">$" + funcFormatSubTotal(parseInt(strCnt)) + "</td>" +
                            "</tr>";
                iSubTotal += parseInt(strCnt);
            }
            else
            {
                elem.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\">" + strCnt + "</td>" +
                                "<td class=\"tdReviewFieldsMiddle\">" + gTixDefinition[i][TIXDEFN_DESC] + " $" + gTixDefinition[i][TIXDEFN_PRICE] + "</td>" +
                                "<td class=\"tdReviewFieldsRight\">$" + funcFormatSubTotal(parseInt(gTixDefinition[i][TIXDEFN_PRICE]) * parseInt(strCnt)) + "</td>" +
                            "</tr>";
                iSubTotal += parseInt(gTixDefinition[i][TIXDEFN_PRICE]) * parseInt(strCnt);
            }

            
        } 
    }

    if (iSubTotal > 0)
    {
        elem.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewFieldsTotal\" ><b>Total: </b></td>" +
                                "<td class=\"tdReviewFieldsTotalRight\" ><b>" + "$" + funcFormatSubTotal(iSubTotal) + "</b></td>" +
                            "</tr>";
    }

    //////////////////////////////////////////////////////////////
    // DINNER TABLE INFORMATION REITERATED
    //////////////////////////////////////////////////////////////
    // First clear the current contents in the Review Tix Guests table 
    var elem3 = document.getElementById("tblReviewTixGuests");
    elem3.innerHTML = "";
    // First clear the current contents in the Review Sponsored Guests table 
    var elem4 = document.getElementById("tblReviewSPGuests");
    elem4.innerHTML = "";
    
    bReviewTableInfoExists = false;
    if (funcGetTixCnt())
    {
        if (window.sessionStorage.getItem("optSeating") == "SEATING_CHOOSE")
        {
            document.getElementById("lblSeatOption").hidden = false;
            document.getElementById("lblSeatOption").innerHTML = "Seating Option: Please choose a table for us.";
            funcRebuildGuestRows(TIXGUEST);
            bReviewTableInfoExists = true;
        }
        
        if (window.sessionStorage.getItem("optSeating") == "SEATING_SEATWITH")
        {
            document.getElementById("lblSeatOption").hidden = false;
            document.getElementById("lblSeatOption").innerHTML = "Seating Option: Please seat us with " + (window.sessionStorage.getItem("optSeatWith") != null ? window.sessionStorage.getItem("optSeatWith") : "...");
            funcRebuildGuestRows(TIXGUEST);
            bReviewTableInfoExists = true;
        }

        if ((gGuestStart != null) && funcFillReviewTable(elem3, TIXGUEST))
        {
            document.getElementById("lblReviewTixGuests").hidden = false;
            bReviewTableInfoExists = true; 
        }
        else
            document.getElementById("lblReviewTixGuests").hidden = true;

        
        if ((window.sessionStorage.getItem("optTickets") == "TICKETS_SPONSOR") && (funcSponsorshipTableSize() > 0))
        {   
            document.getElementById("lblSeatOption").hidden = false;
            document.getElementById("lblSeatOption").innerHTML = "Seating Option: I would like to Sponsor a Table of " + funcSponsorshipTableSize().toString();
            funcRebuildGuestRows(SPGUEST);
            bReviewTableInfoExists = true;
        }

        if ((gSPGuestStart != null) && funcFillReviewTable(elem4, SPGUEST))
        { 
            document.getElementById("lblReviewSPGuests").hidden = false;
            bReviewTableInfoExists = true;
        }
        else
            document.getElementById("lblReviewSPGuests").hidden = true;
    }


    document.getElementById("lblReviewDinnerTableInfo").hidden = !(bReviewTableInfoExists);


    //////////////////////////////////////////////////////////////
    // PAYMENT INFORMATION REITERATED
    //////////////////////////////////////////////////////////////
    var elem2 = document.getElementById("tblPaymentInfo");
    document.getElementById("lblPayment").hidden = false;

    // First clear the current contents in the payment info table 
    elem2.innerHTML = "";

    if ((window.sessionStorage.getItem("SENDCHECK") != null) && (window.sessionStorage.getItem("SENDCHECK") == "true"))
    {   // CHECK
        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" ><i>Mail</i> check to: </td>" +
                                "<td class=\"tdReviewBillingRight\" ><i>Drop-off</i> check to: </td>" +
                            "</tr>";
        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" >SVSEF / Jody Zarkos</td>" +
                                "<td class=\"tdReviewBillingRight\" >SVSEF Office</td>" +
                            "</tr>";

        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" >PO Box 203</td>" +
                                "<td class=\"tdReviewBillingRight\" >215 Picabo Street</td>" +
                            "</tr>";

        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" >Sun Valley, ID 83353</td>" +
                                "<td class=\"tdReviewBillingRight\" >Ketchum, ID 83340</td>" +
                            "</tr>";
        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" ><button class=\"styleBtnHelpSm\" type=\"button\" onclick=\"funcOnLoadMenuCanvas(2)\">Modify</button></td>" +
                                "<td class=\"tdReviewBillingRight\" ></td>" +
                            "</tr>";

    }
    else
    {   // CC PAYMENT
        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" >" + window.sessionStorage.getItem("CCTYPE") + "</td>" +
                                "<td class=\"tdReviewBillingRight\" >Billing Address:</td>" +
                            "</tr>";
        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" >" + funcDisplayCCNumber(true) + "</td>" +
                                "<td class=\"tdReviewBillingRight\" >" + funcGetBillingName() + "</td>" +
                            "</tr>";

        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" >Exp: " + funcGet2DigitMonth() + "/" + window.sessionStorage.getItem("CCEXP_YEAR") + "</td>" +
                                "<td class=\"tdReviewBillingRight\" >" + funcGetBillingAddress(BILLING_ADDRESS1) + "</td>" +
                            "</tr>";

        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" >CVV: " + window.sessionStorage.getItem("CVVNUM") + "</td>" +
                                "<td class=\"tdReviewBillingRight\" >" + funcGetBillingAddress(BILLING_ADDRESS2) + "</td>" +
                            "</tr>";

        if (funcGetBillingAddress(BILLING_ADDRESS3))
        {
            elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" ></td>" +
                                "<td class=\"tdReviewBillingRight\" >" + funcGetBillingAddress(BILLING_ADDRESS3) + "</td>" +
                            "</tr>";
        }
        elem2.innerHTML += "<tr>" +
                                "<td class=\"tdReviewFieldsLeft\"></td>" +
                                "<td class=\"tdReviewBillingMiddle\" ><button class=\"styleBtnHelpSm\" type=\"button\" onclick=\"funcOnLoadMenuCanvas(2)\">Modify</button></td>" +
                                "<td class=\"tdReviewBillingRight\" ><button class=\"styleBtnHelpSm\" type=\"button\" onclick=\"funcOnLoadMenuCanvas(2)\">Modify</button></td>" +
                            "</tr>";

    }
}

function funcFillReviewTable(elem, iType = TIXGUEST)
{
    var iCntRow = 0;
    var curRow = gGuestStart;
    var strPre =  "";
    if (iType == SPGUEST)
    {
        curRow = gSPGuestStart;
        strPre = "sp";
    }
        
    while (curRow != null)
    {
        var strFirstName = "";
        var strLastName = "";
        var strVegetarian = "";
        if (window.sessionStorage.getItem(strPre + "guestFirstName" + curRow.index.toString()) != null)
            strFirstName = window.sessionStorage.getItem(strPre + "guestFirstName" + curRow.index.toString());
        if (window.sessionStorage.getItem(strPre + "guestLastName" + curRow.index.toString()) != null)
            strLastName = window.sessionStorage.getItem(strPre + "guestLastName" + curRow.index.toString());
        if (window.sessionStorage.getItem(strPre + "guestVegetarian" + curRow.index.toString()) != null)
            strVegetarian = window.sessionStorage.getItem(strPre + "guestVegetarian" + curRow.index.toString());

        if (!isEmpty(strFirstName) || !isEmpty(strLastName) || !isEmpty(strVegetarian))
        {
            if  (iCntRow == 0)
            {
                elem.innerHTML += "<tr>" +
                                    "<td class=\"tdReviewGuestLabel\"><label><b>First&nbsp;Name</b></label></td>" +
                                    "<td class=\"tdReviewGuestLabel\"><label><b>Last&nbsp;Name</b></label></td>" +
                                    "<td class=\"tdReviewGuestLabel\"><label><b>Vegetarian&nbsp;Meal?</b></label></td>" +
                            "</tr>";
            }

            elem.innerHTML += "<tr>" +
                                "<td class=\"tdReviewGuestFields\"><label>" + strFirstName + "</label></td>" +
                                "<td class=\"tdReviewGuestFields\"><label>" + strLastName + "</label></td>" +
                                "<td class=\"tdReviewGuestFields\"><label>" + strVegetarian + "</label></td>" +
                            "</tr>";
            iCntRow++;
        }

        curRow = curRow.next;  
    }
    return(iCntRow);
}

function funcDefinedDinnerTableInfo()
{
    if ( (window.sessionStorage.getItem("") != null) || (gSPGuestStart != null) )
        return(true);

    return(false);
}

function funcGet2DigitMonth()
{
    var iExpMonth = parseInt(window.sessionStorage.getItem("CCEXP_MONTH")) + 1;
    var strExpMonth = "";

    if (iExpMonth < 10)
        strExpMonth += "0";

    strExpMonth += iExpMonth;

    return(strExpMonth);
}

function funcGet2DigitYear()
{
    var strExpYear = window.sessionStorage.getItem("CCEXP_YEAR").substr(2);
    return(strExpYear);
}

function funcGetCCVaultTypeNum()
{
    var strCCType = window.sessionStorage.getItem("CCTYPE");
    var strCCNum = window.sessionStorage.getItem("CCNUM");
    return(strCCType + "|" + strCCNum.substr(strCCNum.length - 4));
}

function funcGetCCVaultLookupStr()
{
    var strCCNum = window.sessionStorage.getItem("CCNUM");
    return(strCCNum.substr(strCCNum.length - 4));
}

function funcGetBillingName()
{
    var strBillingName = "";

    if (window.sessionStorage.getItem("BILLING_FIRSTNAME") != null)
        strBillingName += window.sessionStorage.getItem("BILLING_FIRSTNAME") + " ";

    strBillingName += window.sessionStorage.getItem("BILLING_LASTNAME");

    return(strBillingName);
}

function funcIncludesAddress2()
{
    if (isEmpty(window.sessionStorage.getItem("BILLING_MAILINGADDR2")))
        return(false);

    return(true);
}

function funcGetCityStateZip()
{
    var strCityStateZip = "";
    if (window.sessionStorage.getItem("BILLING_CITY") != null)
        strCityStateZip += window.sessionStorage.getItem("BILLING_CITY") + ", ";
    
    if (window.sessionStorage.getItem("BILLING_STATE") != null)
        strCityStateZip += window.sessionStorage.getItem("BILLING_STATE") + "  ";

    if (window.sessionStorage.getItem("BILLING_ZIP") != null)
        strCityStateZip += window.sessionStorage.getItem("BILLING_ZIP");
    
    return(strCityStateZip);
}

function funcGetBillingAddress(iLineNo)
{
    if (iLineNo == BILLING_NAME)
        return(funcGetBillingName());
    else if (iLineNo == BILLING_ADDRESS1)
        return(window.sessionStorage.getItem("BILLING_MAILINGADDR"));
    else if (iLineNo == BILLING_ADDRESS2 && funcIncludesAddress2())
        return(window.sessionStorage.getItem("BILLING_MAILINGADDR2"));
    else if (iLineNo == BILLING_ADDRESS2)
        return(funcGetCityStateZip());
    else if (iLineNo == BILLING_ADDRESS3 && funcIncludesAddress2())
        return(funcGetCityStateZip());
    else
        return("");

}

function funcLoadInfoPaymentForm()
{
    document.getElementById("infoPaymentFields").style.display = "inline";

    for (var i = 0; i < gReqBillingFields.length; i++)
    {     
        if (window.sessionStorage.getItem(gReqBillingFields[i][IDX2_SESSSTOR]) != null)
            document.getElementById(gReqBillingFields[i][IDX2_HTMLFIELD]).value = window.sessionStorage.getItem(gReqBillingFields[i][IDX2_SESSSTOR]);
        else if (gReqBillingFields[i][IDX2_HTMLFIELD] == "svsefLastName")
            document.getElementById("svsefLastName").value = window.iFrameConstituentForm.funcGetSVSEFLastName();
        else if (gReqBillingFields[i][IDX2_HTMLFIELD] == "svsefFirstName")
            document.getElementById("svsefFirstName").value = window.iFrameConstituentForm.funcGetSVSEFFirstName();
        else if (gReqBillingFields[i][IDX2_HTMLFIELD] == "svsefMailingAddress")
            document.getElementById("svsefMailingAddress").value = window.iFrameConstituentForm.funcGetSVSEFMailingAddress();
        else if (gReqBillingFields[i][IDX2_HTMLFIELD] == "svsefMailingAddress2")
            document.getElementById("svsefMailingAddress2").value = window.iFrameConstituentForm.funcGetSVSEFMailingAddress2();
        else if (gReqBillingFields[i][IDX2_HTMLFIELD] == "svsefCity")
            document.getElementById("svsefCity").value = window.iFrameConstituentForm.funcGetSVSEFCity();
        else if (gReqBillingFields[i][IDX2_HTMLFIELD] == "svsefState")
            document.getElementById("svsefState").value = window.iFrameConstituentForm.funcGetSVSEFState();
        else if (gReqBillingFields[i][IDX2_HTMLFIELD] == "svsefZip")
            document.getElementById("svsefZip").value = window.iFrameConstituentForm.funcGetSVSEFZip();   
    }
     
    if (window.sessionStorage.getItem("SENDCHECK") == "true")
    {
        document.getElementById("svSendCheck").checked = true;
        funcOnChangeSendCheck();
        return;
    }
    else
        document.getElementById("svSendCheck").checked = false;
        
    
    if (window.sessionStorage.getItem("CCTYPE") != null)
        funcOnClickSelectType(window.sessionStorage.getItem("CCTYPE"));

    if (window.sessionStorage.getItem("CCNUM") != null)
    {
        document.getElementById("svPaymentCC").value = window.sessionStorage.getItem("CCNUM");
        funcReformatCCNumber();
    }

    if (window.sessionStorage.getItem("CCEXP_MONTH") != null)
    {
        var fields = document.getElementsByName("svPaymentExpMonth");
        var iExpMonth = parseInt(window.sessionStorage.getItem("CCEXP_MONTH"));
        for (var i = 0; i < fields.length; i++)
        {
            if (parseInt(fields[i].value) == iExpMonth)
            {
                fields[i].selected = true;
                funcCheckCCExp(CCEXP_CHECK_MONTH);
                break;
            }  
        }  
    }

    if (window.sessionStorage.getItem("CCEXP_YEAR") != null)
    {
        var fields = document.getElementsByName("svPaymentExpYear");
        var iExpYear = parseInt(window.sessionStorage.getItem("CCEXP_YEAR"));
        for (var i = 0; i < fields.length; i++)
        {
            if (parseInt(fields[i].value) == iExpYear)
            {
                fields[i].selected = true;
                funcCheckCCExp(CCEXP_CHECK_YEAR);
                break;
            }  
        }  
    }

    if (window.sessionStorage.getItem("CVVNUM") != null)
    {
        document.getElementById("svPaymentCVV").value = window.sessionStorage.getItem("CVVNUM");
        funcCheckCVVNumber();
    }

}
            

function funcFormatSubTotal(iSubTotal)
{
    var sFormattedSubTotal = iSubTotal.toString();

    if (sFormattedSubTotal.length >= 4)
        sFormattedSubTotal = sFormattedSubTotal.substr(0, (sFormattedSubTotal.length - 3)) + "," + sFormattedSubTotal.substr((sFormattedSubTotal.length - 3), 3);

    if (sFormattedSubTotal.length >= 8)
        sFormattedSubTotal = sFormattedSubTotal.substr(0, (sFormattedSubTotal.length - 7)) + "," + sFormattedSubTotal.substr((sFormattedSubTotal.length - 7), 7);

    return(sFormattedSubTotal);
}

function funcCalculateTixTotalFromSessionStor()
{
    var iSubTotal = 0;
    for (var i = 0; i < gTixDefinition.length; i++)
    {
        var iValue = parseInt(window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]));
        if (iValue > 0)
        {
            if (gTixDefinition[i][TIXDEFN_ELEMENT] == "regDonation") 
            {   // Stored Flat Donation
                iSubTotal += iValue;
            }  
            else
            {   // Stored Quanitity of Tix
                iSubTotal += parseInt(gTixDefinition[i][TIXDEFN_PRICE]) * iValue;
            }
        } 
    }
    return(iSubTotal);
}

function funcCalculateTixTotal()
{
    var iSubTotal = funcCalculateTixTotalFromSessionStor();
    document.getElementById("lblTotal").innerHTML = "$" + funcFormatSubTotal(iSubTotal) + ".00";

    funcEnableBtn("btnContinueReg", funcIsRegistrationPhaseComplete(REG_TICKETS));
    document.getElementById("lblWarning").hidden = funcIsRegistrationPhaseComplete(REG_TICKETS);
}

function funcIsRegistrationPhaseComplete(iPhase)
{
    if (iPhase < funcRegistrationPhaseToComplete())
        return(true);

    return(false);
}

function funcRegistrationPhaseToComplete()
{
    if ((document.getElementById("btnReset").hidden == false) && !gbUserInitiated)
    {   // We have a THANK YOU message up if this button is not hidden
        // and therefore our only action is RESET
        funcReset();
    }

    // Confirm we have a First and Last Name and a Total to
    // progress passed REG_TICKETS
    if (!funcIsRegNameValid() || funcCalculateTixTotalFromSessionStor() <= 0)
        return(REG_TICKETS);
    
    // Confirm we have a complete SVSEF ID and Email Address
    if (isEmpty(funcGetRegSVSEFID(true)) || isEmpty(funcGetRegSVSEFEmail(true)))
        return(REG_SVSEFID);
    
    // Confirm Card Info -OR- Send Check for Payment Verification
    if (!funcCheckPaymentFormSessStor())
        return(REG_PAYMENT);

    // If there was an error with loading CC in
    // vault, we don't want to stop the user 
    // from buying registration tix, therefore,
    // gstrVaultID == ERROR in that case and is not empty
    if (window.sessionStorage.getItem("SENDCHECK") != "true" && isEmpty(gstrVaultID))
    {
        funcCheckPaymentFormValidity();
        return(-1);
    }
        
    // Confirm Submit
    if (REG_SUBMIT)
    {

    }

    return(REG_FINISHED);
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

function funcOnChangeRaffle(fieldsModified)
{
    if (fieldsModified == null)
        return(false);

    var bSelection = false;
    for (var i = 0; i < fieldsModified.length; i++)
    {
        if (fieldsModified[i].checked && fieldsModified[i].value == "RAFFLE_SINGLE")
        {
            window.sessionStorage.setItem("CNT_TIXSINGLERAFFLE", "1");
            window.sessionStorage.setItem("CNT_TIXGROUPRAFFLE", "0");
        }
        else if (fieldsModified[i].checked && fieldsModified[i].value == "RAFFLE_GROUP")
        {
            window.sessionStorage.setItem("CNT_TIXGROUPRAFFLE", "1");
            window.sessionStorage.setItem("CNT_TIXSINGLERAFFLE", "0");
        }
    }
    
    funcCalculateTixTotal();
}

function funcIsRegNameValid()
{
    if (isEmpty(window.sessionStorage.getItem("REG_FIRSTNAME")) || isEmpty(window.sessionStorage.getItem("REG_LASTNAME")))
        return(false);
        
    return(true);
}

function funcOnChangeRSVP(fieldsModified)
{
    if (fieldsModified == null)
        return(false);

    var bUnset = false;
    if (!funcIsRegNameValid())
    {
        document.getElementById("dialogAlertNoCallback").innerHTML = '<img src="images/CautionTransparent.png" class="imgCaution"/>&nbsp;&nbsp;Please enter your First and Last Name first!';
        $( "#dialogAlertNoCallback" ).dialog( "option", "title", "Wild West Game Dinner Registration" );
        $( "#dialogAlertNoCallback" ).dialog( "open" );
        bUnset = true;
    }

    var bSelection = false;
    for (var i = 0; i < fieldsModified.length; i++)
    {
        if (!bUnset & fieldsModified[i].checked && fieldsModified[i].value == "REG_YES")
        {
            window.sessionStorage.setItem("RSVP", "REG_YES");
            funcEnableDonationOnlySection(false);
            funcEnableTicketOptionsSection(true);
            break;
        }    
        else if (!bUnset & fieldsModified[i].checked && fieldsModified[i].value == "REG_NO")
        {
            window.sessionStorage.setItem("RSVP", "REG_NO");
            funcEnableDonationOnlySection(true);
            funcEnableTicketOptionsSection(false);
            break;
        } 
        else if (bUnset && fieldsModified[i].value == "UNKNOWN") 
        {
            fieldsModified[i].checked = true;
            window.sessionStorage.removeItem("RSVP");
            funcEnableDonationOnlySection(false);
            funcEnableTicketOptionsSection(false);
            break;
        }
    }
}

function funcOnBlurDonation(fieldModified)
{
    if (fieldModified == null)
        return(false);

    if (isEmpty(fieldModified.value))
    {
        window.sessionStorage.removeItem("AMT_DONATION");
    }
    else
    {
        var strAmount = funcStripCommas(funcStripDollarSign(fieldModified.value));
        strAmount = parseInt(strAmount).toString(); // Convert to int and back to string to remove unwanted chars
        window.sessionStorage.setItem("AMT_DONATION", strAmount);
        strAmount = "$" + funcFormatSubTotal(parseInt(strAmount));
        fieldModified.value = strAmount; 
    }

    funcCalculateTixTotal();
} 

function funcStripDollarSign(str)
{
    var index = -1;
    index = str.indexOf("$");
    while (index < str.length && index >= 0)
    {
        str = str.substring(index + 1, str.length);
        index = str.indexOf("$");
    }

    return(str);
}

function funcStripCommas(str)
{
    var index = -1;
    index = str.indexOf(",");
    while (index < str.length && index >= 0)
    {
        str = str.substring(0, index) + str.substring(index + 1, str.length);
        index = str.indexOf(",");
    }

    return(str);
}

function funcEnableSectionGuestList(bEnable)
{
    if (document.getElementById("sectionGuestList") == null)
        return;
        
    document.getElementById("sectionGuestList").style.display = (bEnable ? "block" : "none");

    if (bEnable)
    {
        funcRebuildGuestRows(TIXGUEST);
        funcGenerateGuestRowHTML(TIXGUEST);
    }
    else
    {   // Reset the HTML, Linked List, and SessionStorage
        funcRemoveGuestSessionStor(-1, TIXGUEST);
        funcGenerateGuestRowHTML(TIXGUEST);    
        if (document.getElementById("guestFirstName0") != null)
            document.getElementById("guestFirstName0").classList.remove("tabable");
        if (document.getElementById("guestLastName0") != null)
            document.getElementById("guestLastName0").classList.remove("tabable");
        if (document.getElementById("guestVegetarian0") != null)
            document.getElementById("guestVegetarian0").classList.remove("tabable");
    }
}

function funcGenerateGuestRowHTML(iType = TIXGUEST)
{
    var strTable = "tblGuests";
    if (iType == SPGUEST)
        strTable = "tblSPGuests";

    if (document.getElementById(strTable) == null)
        return;

    document.getElementById(strTable).innerHTML = "<tr>" +
                                                            "<td class=\"tdGuestsLabel\"><label>First&nbsp;Name</label></td>" +
                                                            "<td class=\"tdGuestsLabel\"><label>Last&nbsp;Name</label></td>" +
                                                            "<td class=\"tdGuestsLabel\"><label>Vegetarian&nbsp;Meal?</label></td>" +
                                                            "<td class=\"tdGuestsLabel\"><label class=\"labelHiddenHolder\">HIDDEN</label></td>" +
                                                    "</tr>";
    var curRow = null;
    var strPre = "";
    if (iType == TIXGUEST)
    {
        if (gGuestStart == null) // Check for First Row in List
            gGuestStart = new guest();
        curRow = gGuestStart;
    } 
    else if (iType == SPGUEST)  
    {
        if (gSPGuestStart == null) // Check for First Row in List
            gSPGuestStart = new spguest();
        curRow = gSPGuestStart;
        strPre = "sp";
    }
        
    while (curRow != null)
    {
        var strFirstName = "";
        var strLastName = "";
        var strVegetarian = "";
        if (window.sessionStorage.getItem(strPre + "guestFirstName" + curRow.index.toString()) != null)
            strFirstName = window.sessionStorage.getItem(strPre + "guestFirstName" + curRow.index.toString());
        if (window.sessionStorage.getItem(strPre + "guestLastName" + curRow.index.toString()) != null)
            strLastName = window.sessionStorage.getItem(strPre + "guestLastName" + curRow.index.toString());
        if (window.sessionStorage.getItem(strPre + "guestVegetarian" + curRow.index.toString()) != null)
            strVegetarian = window.sessionStorage.getItem(strPre + "guestVegetarian" + curRow.index.toString());

        document.getElementById(strTable).innerHTML += "<tr>" +
                            "<td class=\"tdRegInput\"><input class=\"inputField flexwidth tabable tabhideable\" id=\"" + strPre + "guestFirstName" + curRow.index.toString() + "\" type=\"text\" pattern=\"*\" title=\"First Name\" onblur=\"funcOnBlurGuestFirstName(" + curRow.index.toString() + ", " + iType.toString() + ")\" onfocusout=\"funcOnFocusOut('" + strPre + "guestFirstName" + curRow.index.toString() + "')\" onkeydown=\"funcOnKeyDown()\" name=\"" + strPre + "guestFirstName" + curRow.index.toString() + "\" value=\"" + strFirstName + "\"  /></td>" +
                            "<td class=\"tdRegInput\"><input class=\"inputField flexwidth tabable tabhideable\" id=\"" + strPre + "guestLastName" + curRow.index.toString() + "\" type=\"text\" pattern=\"*\" title=\"Last Name\" onblur=\"funcOnBlurGuestLastName(" + curRow.index.toString() + ", " + iType.toString() + ")\" onfocusout=\"funcOnFocusOut('" + strPre + "guestLastName" + curRow.index.toString() + "')\" onkeydown=\"funcOnKeyDown()\" name=\"" + strPre + "guestLastName" + curRow.index.toString() + "\" value=\"" + strLastName + "\"  /></td>" +
                            "<td class=\"tdRegInput\"><input class=\"inputField flexwidth tabable tabhideable\" id=\"" + strPre + "guestVegetarian" + curRow.index.toString() + "\" type=\"text\" pattern=\"*\" title=\"Vegetarian Meal?\" onblur=\"funcOnBlurGuestVegetarian(" + curRow.index.toString() + ", " + iType.toString() + ")\" onfocusout=\"funcOnFocusOut('" + strPre + "guestVegetarian" + curRow.index.toString() + "')\" onkeydown=\"funcOnKeyDown()\" name=\"" + strPre + "guestVegetarian" + curRow.index.toString() + "\" value=\"" + strVegetarian + "\"  /></td>" +
                            "<td class=\"tdRegSubLabel flexwidth\"><img id=\"imgAddGuest" + curRow.index.toString() + "\" class=\"imgGuest\" src=\"images/list-add-gray-trans.png\" onclick=\"funcOnClickAddGuestRow(" + curRow.index.toString() + ", " + iType.toString() + ")\" onmouseover=\"this.src='images/list-add-black-trans2.png'\" onmouseout=\"this.src='images/list-add-gray-trans.png'\" title=\"Add another row\"/>&nbsp;" +
                                "<img id=\"imgRemoveGuest" + curRow.index.toString() + "\" class=\"imgGuest\" src=\"images/list-remove-gray-trans.png\" onclick=\"funcOnClickRemoveGuestRow(" + curRow.index.toString() + ", " + iType.toString() + ")\" onmouseover=\"this.src='images/list-remove-black-trans2.png'\" onmouseout=\"this.src='images/list-remove-gray-trans.png'\" title=\"Remove this row\"/></td>" +
                        "</tr>";
        curRow = curRow.next;
    }

    document.getElementById(strTable).innerHTML += "<tr><td class=\"tdRegSubLabel blueFont\" colspan=\"4\"><label>click + sign on the right to add more guests</label></td></tr>";

}

function funcGenerateGuestListEmailParam(iType = TIXGUEST)
{
    funcRebuildGuestRows(iType);
    var strList = "&gL=";
    var strPre = "";

    var curRow = null;
    if (iType == TIXGUEST)
    {
        if (gGuestStart == null)
            return(strList);
        curRow = gGuestStart;
    } 
    else if (iType == SPGUEST)  
    {
        strList = "&spL=";
        strPre = "sp";

        if (gSPGuestStart == null)
            return(strList);
        curRow = gSPGuestStart;
    }
        
    while (curRow != null)
    {
        var strFirstName = "";
        var strLastName = "";
        var strVegetarian = "";
        if (window.sessionStorage.getItem(strPre + "guestFirstName" + curRow.index.toString()) != null)
            strFirstName = encodeURIComponent(window.sessionStorage.getItem(strPre + "guestFirstName" + curRow.index.toString()));
        if (window.sessionStorage.getItem(strPre + "guestLastName" + curRow.index.toString()) != null)
            strLastName = encodeURIComponent(window.sessionStorage.getItem(strPre + "guestLastName" + curRow.index.toString()));
        if (window.sessionStorage.getItem(strPre + "guestVegetarian" + curRow.index.toString()) != null)
            strVegetarian = encodeURIComponent(window.sessionStorage.getItem(strPre + "guestVegetarian" + curRow.index.toString()));

        strList += "f:" + strFirstName + "|l:" + strLastName + "|v:" + strVegetarian + "|";
        
        curRow = curRow.next;
    }

    return(strList);
}

function funcEnableEarlyBirdDinnerTicketsSection(bEnable)
{
    if (document.getElementById("sectionEarlyBirdDinnerTickets") == null)
        return;
    
    // To enable/disable 'sectionEarlyBirdDinnerTickets', we must add and remove
    // 'svtixEarly' from the 'tabable' classlist
    document.getElementById("sectionEarlyBirdDinnerTickets").style.display = (bEnable ? "block" : "none");
    if (bEnable)
    {
        document.getElementById("svtixEarly").value = "";
        document.getElementById("svtixEarly").classList.add("tabable");
        if ((window.sessionStorage.getItem("CNT_TIXEARLY") != null) && (parseInt(window.sessionStorage.getItem("CNT_TIXEARLY")) > 0))
        {
            var strCnt = window.sessionStorage.getItem("CNT_TIXEARLY");
            document.getElementById("svtixEarly").value = strCnt;
        } 
    }
    else
    {
        document.getElementById("svtixEarly").value = "";
        document.getElementById("svtixEarly").classList.remove("tabable");
        window.sessionStorage.setItem("CNT_TIXEARLY", "0");

        // Loop through and remove guests?
    }

    funcCalculateTixTotal();
}

function funcEnableRegularDinnerTicketsSection(bEnable)
{
    if (document.getElementById("sectionRegularDinnerTickets") == null)
        return;

    // To enable/disable 'sectionRegularDinnerTickets', we must add and remove
    // 'svtixRegular' from the 'tabable' classlist
    document.getElementById("sectionRegularDinnerTickets").style.display = (bEnable ? "block" : "none");
    if (bEnable)  
    {
        document.getElementById("svtixRegular").value = "";
        document.getElementById("svtixRegular").classList.add("tabable");
        if ((window.sessionStorage.getItem("CNT_TIXREGULAR") != null) && (parseInt(window.sessionStorage.getItem("CNT_TIXREGULAR")) > 0))
        {
            var strCnt = window.sessionStorage.getItem("CNT_TIXREGULAR");
            document.getElementById("svtixRegular").value = strCnt; 
        }
    }
    else
    {
        document.getElementById("svtixRegular").value = "";
        document.getElementById("svtixRegular").classList.remove("tabable");
        window.sessionStorage.setItem("CNT_TIXREGULAR", "0");

        // Loop through and remove guests?
    }

    funcCalculateTixTotal();
}



function funcEnableTicketOptionsSection(bEnable)
{
    if (document.getElementById("sectionTicketOptions") == null)
        return;

    // To enable/disable 'sectionTicketOptions', we must add and remove
    // 'optTicket0' from the 'tabable' classlist
    document.getElementById("sectionTicketOptions").style.display = (bEnable ? "block" : "none");

    if (!bEnable)
    {
        funcOnChangeTicketOption(funcResetRadioGroup("optTickets"));
        document.getElementById("optTicket0").classList.remove("tabable");
    } 
    else if ( (window.sessionStorage.getItem("optTickets") != null) && (document.getElementsByName("optTickets") != null) )
    {
        funcOnChangeTicketOption(funcSetRadioGroupFromSessStor("optTickets"));
        document.getElementById("optTicket0").classList.add("tabable");
    }
        

}

function funcEnableSeatingOptionsSection(bEnable)
{
    if (document.getElementById("sectionSeatingOptions") == null)
        return;

    // To enable/disable 'sectionSeatingOptions', we must add and remove
    // 'optSeating0' from the 'tabable' classlist
    document.getElementById("sectionSeatingOptions").style.display = (bEnable ? "block" : "none");
    
    if (!bEnable)
    {
        funcEnableSeatWithSection(bEnable);
        document.getElementById("optSeating0").classList.remove("tabable");
    }
    else 
    {
       document.getElementById("optSeating0").classList.add("tabable"); 
       if ( (window.sessionStorage.getItem("optSeating") != null) && (document.getElementsByName("optSeating") != null) )
        {
            var fields = document.getElementsByName("optSeating");
            for (var i = 0; i < fields.length; i++)
            {
                if (fields[i].value == window.sessionStorage.getItem("optSeating"))
                {
                    fields[i].checked = true;
                    funcOnChangeSeating(fields);
                }     
            }
        }
    } 
}

function funcOnChangeTicketOption(fieldsModified)
{
    if (fieldsModified == null)
        return;

    var bEarlyBirdTix = true;
    for (var i = 0; i < fieldsModified.length; i++)
    {
        if (fieldsModified[i].checked)
        {
            window.sessionStorage.setItem("optTickets", fieldsModified[i].value);
            funcEnableEarlyBirdDinnerTicketsSection(bEarlyBirdTix && (fieldsModified[i].value == "TICKETS_PURCHASE") ? true : false);
            funcEnableRegularDinnerTicketsSection(!bEarlyBirdTix && (fieldsModified[i].value == "TICKETS_PURCHASE") ? true : false);
            funcEnableSeatingOptionsSection((fieldsModified[i].value == "TICKETS_PURCHASE") ? true : false);
            funcEnableSectionGuestList((fieldsModified[i].value == "TICKETS_PURCHASE") ? true : false);

            funcEnableTableSponsorshipSection((fieldsModified[i].value == "TICKETS_SPONSOR") ? true : false);
            break;
        }
    }
}

function funcOnChangeSeating(fieldsModified)
{
    if (fieldsModified == null)
        return;

    for (var i = 0; i < fieldsModified.length; i++)
    {
        if (fieldsModified[i].checked)
        {
            window.sessionStorage.setItem("optSeating", fieldsModified[i].value);
            funcEnableSeatWithSection((fieldsModified[i].value == "SEATING_SEATWITH") ? true : false);
            break;
        }
    }
}

function funcEnableSeatWithSection(bEnable)
{
    if (document.getElementById("sectionSeatWith") == null)
        return;

    // To enable/disable 'sectionSeatWith', we must add and remove
    // 'optSeatWith' from the 'tabable' classlist
    document.getElementById("sectionSeatWith").style.display = (bEnable ? "block" : "none");
    if (bEnable)
    {
        document.getElementById("optSeatWith").classList.add("tabable");
        if (document.getElementById("optSeatWith") != null)
            document.getElementById("optSeatWith").value = ((window.sessionStorage.getItem("optSeatWith") != null) ? window.sessionStorage.getItem("optSeatWith") : "");
    }
    else
    {   // Cleanup Session Storage
        window.sessionStorage.removeItem("optSeatWith");
        document.getElementById("optSeatWith").value = "";
        document.getElementById("optSeatWith").classList.remove("tabable");
    }
}

function funcOnBlurSeatWith(fieldModified)
{
    if (fieldModified == null)
        return(false);

    funcSaveSessionStorage(fieldModified);
}

function funcOnChangeTableSponsorship(fieldsModified)
{
    if (fieldsModified == null)
        return;

    var bEnableGuests = false;
    for (var i = 0; i < fieldsModified.length; i++)
    {
        if (fieldsModified[i].value == "UNKNOWN")
            continue;
        
        window.sessionStorage.setItem(fieldsModified[i].value, (fieldsModified[i].checked ? "1" : "0"));
        if (fieldsModified[i].checked)
            bEnableGuests = true;
    }

    funcEnableSponsorshipGuestsSection(bEnableGuests);
    funcCalculateTixTotal();
}

function funcSponsorshipTableSize()
{
    for (var i = TIXSPONSOR_FIRSTIDX; i <= TIXSPONSOR_LASTIDX; i++)
    {
        if (window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]) == "1")
            return(gTixDefinition[i][TIXDEFN_ADDTL]);
    }
    return(-1);
}

function funcSponsorshipTableLbl()
{
    for (var i = TIXSPONSOR_FIRSTIDX; i <= TIXSPONSOR_LASTIDX; i++)
    {
        if (window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]) == "1")
            return(gTixDefinition[i][TIXDEFN_DESC]);
    }
    return(null);
}

function funcEnableTableSponsorshipSection(bEnable)
{
    if (document.getElementById("sectionTableSponsorship") == null)
        return;

    // To enable/disable 'sectionTableSponsorship', we must add and remove
    // 'tixSponsor8' from the 'tabable' classlist
    document.getElementById("sectionTableSponsorship").style.display = (bEnable ? "block" : "none");
    if (bEnable)
    {   // Load Info from Session Storage
        var fields = document.getElementsByName("tixSponsor");
        for (var i = 0; i < fields.length; i++)
        {
            if (window.sessionStorage.getItem(fields[i].value) == "1")
            {
                fields[i].checked = true;
                break;
            }
        }
        document.getElementById("tixSponsor8").classList.add("tabable");
        funcOnChangeTableSponsorship(fields);
    }
    else
    {   // Cleanup Session Storage
        var fields = funcResetRadioGroup("tixSponsor");
        document.getElementById("tixSponsor8").classList.remove("tabable");
        funcOnChangeTableSponsorship(fields);
    }

    funcCalculateTixTotal();
}

function funcEnableSponsorshipGuestsSection(bEnable)
{
    if (document.getElementById("sectionSponsorshipGuests") == null)
        return;

    var iMaxRows = funcSponsorshipTableSize();
    if (iMaxRows < 0)
        bEnable = false;
    document.getElementById("sectionSponsorshipGuests").style.display = (bEnable ? "block" : "none");
    if (bEnable)
    {   // Load Info from Session Storage
        // Determine the max guest rows - loosely following it
        if (document.getElementById("lblSponsorshipGuests") != null)
            document.getElementById("lblSponsorshipGuests").innerHTML = funcSponsorshipTableLbl() + " Guests";

        funcRebuildGuestRows(SPGUEST);
        funcGenerateGuestRowHTML(SPGUEST);

        // Fill in first row with the Patron purchasing tix *IF* it doesn't currently have values
        if ( (funcGetGuestRowCnt(SPGUEST) == 1) && 
            (document.getElementById("spguestFirstName0") != null) && (document.getElementById("spguestFirstName0").value == "") &&
            (document.getElementById("spguestLastName0") != null) && (document.getElementById("spguestLastName0").value == "") &&
            (document.getElementById("spguestVegetarian0") != null) && (document.getElementById("spguestVegetarian0").value == "") )
        {
            document.getElementById("spguestFirstName0").value = window.sessionStorage.getItem("REG_FIRSTNAME").toString();
            funcOnBlurGuestFirstName(0, SPGUEST);
            document.getElementById("spguestLastName0").value = window.sessionStorage.getItem("REG_LASTNAME").toString();
            funcOnBlurGuestLastName(0, SPGUEST);

            funcOnClickAddGuestRow(0, SPGUEST, false);
        }
    }
    else
    {   // Reset the HTML, Linked List, and SessionStorage
        funcRemoveGuestSessionStor(-1, SPGUEST);
        funcGenerateGuestRowHTML(SPGUEST); 
        if (document.getElementById("spguestFirstName0") != null)
            document.getElementById("spguestFirstName0").classList.remove("tabable");
        if (document.getElementById("spguestLastName0") != null)
            document.getElementById("spguestLastName0").classList.remove("tabable");
        if (document.getElementById("spguestVegetarian0") != null)
            document.getElementById("spguestVegetarian0").classList.remove("tabable");   
    }
    
}

function funcSaveSessionStorage(fieldModified)
{
    if (fieldModified == null)
        return(false);

    window.sessionStorage.setItem(fieldModified.name, fieldModified.value);
}

function funcEnableDonationOnlySection(bEnable)
{
    if (document.getElementById("sectionDonationOnly") == null)
        return;
   
   // To enable/disable 'sectionDonationOnly', we must add and remove
   // 'svregDonation' from the 'tabable' classlist
   document.getElementById("sectionDonationOnly").style.display = (bEnable ? "flex" : "none");
   if (bEnable)
   {
       document.getElementById("svregDonation").classList.add('tabable');
       document.getElementById("svregDonation").value = "";
       if ((window.sessionStorage.getItem("AMT_DONATION") != null) && (parseInt(window.sessionStorage.getItem("AMT_DONATION")) > 0))
       {
            var strAmount = window.sessionStorage.getItem("AMT_DONATION");
            strAmount = "$" + funcFormatSubTotal(parseInt(strAmount));
            document.getElementById("svregDonation").value = strAmount; 
       }
    }
    else
    {
        document.getElementById("svregDonation").value = "";
        document.getElementById("svregDonation").classList.remove('tabable');
        window.sessionStorage.setItem("AMT_DONATION", "0");
    }

    funcCalculateTixTotal();
}

function funcOnBlurName(fieldModified,iName)
{
    if (fieldModified == null || fieldModified.value == null)
        return(false);

    window.sessionStorage.setItem(gRegInfo[iName][REGDEFN_STORAGE], fieldModified.value);

    // Reset the SVSEF ID, as a NEW NAME is being entered
    window.sessionStorage.removeItem("REG_SVSEFID");
    window.iFrameConstituentForm.funcSetSearchSVSEFID("");
    // Reset the previous payment information, as a NEW NAME is being entered
    funcClearCCPaymentInfo();
    funcClearBillingAddrSessionStor();

    funcCalculateTixTotal();
}

function funcOnBlurTicketsCheckValidity(fieldModified)
{
    if (fieldModified == null)
        return(false);

    if (fieldModified.value.length > 0)
    {   // Trim leading and trailing spaces
        fieldModified.innerHTML.trim();
    }

    var strName = fieldModified.name.substr(2, fieldModified.name.length);
    for (i = 0; i < gTixDefinition.length; i++)
    {
        if (gTixDefinition[i][TIXDEFN_ELEMENT] == strName)
        {
            if (isEmpty(fieldModified.value))
            {
                window.sessionStorage.setItem(gTixDefinition[i][TIXDEFN_STORAGE], "0");
            }
            else
            {
                fieldModified.value = parseInt(fieldModified.value).toString(); // Convert to int and back to string to remove unwanted chars
                window.sessionStorage.setItem(gTixDefinition[i][TIXDEFN_STORAGE], fieldModified.value);
            }

            if ( (gTixDefinition[i][TIXDEFN_ELEMENT] == "tixEarly") || (gTixDefinition[i][TIXDEFN_ELEMENT] == "tixRegular"))
            {
                if (parseInt(window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE])) > 0)
                {
                    // Fill in first row with the Patron purchasing tix *IF* it doesn't currently have values
                    if ( (funcGetGuestRowCnt(TIXGUEST) == 1) && 
                        (document.getElementById("guestFirstName0") != null) && (document.getElementById("guestFirstName0").value == "") &&
                        (document.getElementById("guestLastName0") != null) && (document.getElementById("guestLastName0").value == "") &&
                        (document.getElementById("guestVegetarian0") != null) && (document.getElementById("guestVegetarian0").value == "") )
                    {
                        document.getElementById("guestFirstName0").value = (window.sessionStorage.getItem("REG_FIRSTNAME") != null ? window.sessionStorage.getItem("REG_FIRSTNAME").toString() : "" );
                        funcOnBlurGuestFirstName(0);
                        document.getElementById("guestLastName0").value = (window.sessionStorage.getItem("REG_LASTNAME") != null ? window.sessionStorage.getItem("REG_LASTNAME").toString() : "" );
                        funcOnBlurGuestLastName(0);

                        funcOnClickAddGuestRow(0, TIXGUEST, false);
                    }
                }

                // Update the Tax-Deductible Portion
                funcSetTaxDeductible(i);
            }
            break;
        }
    }

    funcCalculateTixTotal();
}  

function funcOnBlurGuestFirstName(idx, iType = TIXGUEST)
{
    var strID = "guestFirstName" + idx.toString();
    if (iType == SPGUEST)
        strID = "sp" + strID;

    if(document.getElementById(strID) != null)
        window.sessionStorage.setItem(strID, document.getElementById(strID).value);
}

function funcOnBlurGuestLastName(idx, iType = TIXGUEST)
{
    var strID = "guestLastName" + idx.toString();
    if (iType == SPGUEST)
        strID = "sp" + strID;

    if(document.getElementById(strID) != null)
        window.sessionStorage.setItem(strID, document.getElementById(strID).value);
}
    
function funcOnBlurGuestVegetarian(idx, iType = TIXGUEST)
{
    var strID = "guestVegetarian" + idx.toString();
    if (iType == SPGUEST)
        strID = "sp" + strID;

    if(document.getElementById(strID) != null)
        window.sessionStorage.setItem(strID, document.getElementById(strID).value);
}

function funcOnClickAddGuestRow(idxFollow, iType = TIXGUEST, bFocus = true)
{
    if ( (iType == SPGUEST) && (funcGetGuestRowCnt(SPGUEST) >= funcSponsorshipTableSize()) )
    {
        var sBeep = document.getElementById("beep");
        sBeep.play();
        return;
    }
    funcAddGuestRow(idxFollow, iType);
    funcGenerateGuestRowHTML(iType);

    if (bFocus)
    {
        if ( (iType == TIXGUEST) && (gGuestLastAdded != null) && (document.getElementById("guestFirstName" + gGuestLastAdded.index) != null) )
            document.getElementById("guestFirstName" + gGuestLastAdded.index).focus();
        else if ( (iType == SPGUEST) && (gSPGuestLastAdded != null) && (document.getElementById("spguestFirstName" + gSPGuestLastAdded.index) != null) )
            document.getElementById("spguestFirstName" + gSPGuestLastAdded.index).focus();
    }
}

function funcOnClickRemoveGuestRow(idxRemove, iType = TIXGUEST)
{
    if (funcGetGuestRowCnt(iType) == 1)
    {
        var strFirstName = "guestFirstName" + idxRemove.toString();
        var strLastName = "guestLastName" + idxRemove.toString();
        var strVegetarian = "guestVegetarian" + idxRemove.toString();
        if (iType == SPGUEST)
        {
            strFirstName = "sp" + strFirstName;
            strLastName = "sp" + strLastName;
            strVegetarian = "sp" + strVegetarian;
        }

        if (document.getElementById(strFirstName) != null)
        {
            document.getElementById(strFirstName).value = "";
            window.sessionStorage.setItem(strFirstName, "");
        }
        if (document.getElementById(strLastName) != null)
        {
            document.getElementById(strLastName).value = "";
            window.sessionStorage.setItem(strLastName, "");
        }
        if (document.getElementById(strVegetarian) != null)
        {
            document.getElementById(strVegetarian).value = "";
            window.sessionStorage.setItem(strVegetarian, "");
        }
    }
    else
    {
        funcRemoveGuestSessionStor(idxRemove, iType);
        funcRemoveGuestRow(idxRemove, iType);
        funcGenerateGuestRowHTML(iType);
    }
}

function funcRemoveGuestSessionStor(idx = -1, iType = TIXGUEST)
{
    var strPre = "";
    if (iType == SPGUEST)
        strPre = "sp";

    if (idx > -1)
    {   // Remove just one row
        window.sessionStorage.removeItem(strPre + "guestFirstName" + idx.toString());
        window.sessionStorage.removeItem(strPre + "guestLastName" + idx.toString());
        window.sessionStorage.removeItem(strPre + "guestVegetarian" + idx.toString());
        window.sessionStorage.removeItem(strPre + "guestNextIdx" + idx.toString());
    }
    else
    {   // Remove the whole linked list
        var curRow = gGuestStart;
        if (iType == SPGUEST)
            curRow = gSPGuestStart;

        while (curRow != null)
        {
            window.sessionStorage.removeItem(strPre + "guestFirstName" + curRow.index.toString());
            window.sessionStorage.removeItem(strPre + "guestLastName" + curRow.index.toString());
            window.sessionStorage.removeItem(strPre + "guestVegetarian" + curRow.index.toString());
            window.sessionStorage.removeItem(strPre + "guestNextIdx" + curRow.index.toString());

            curRow = curRow.next;
        }

        // Reset linked list pointers
        if (iType == TIXGUEST)
        {
            gGuestStart = null;
            gGuestLastAdded = null;
            gGuestHighestAdded = null;
        }
        else if (iType == SPGUEST)
        {
            gSPGuestStart = null;
            gSPGuestLastAdded = null;
            gSPGuestHighestAdded = null;
        }
        
        window.sessionStorage.removeItem(strPre + "guestStartIdx");
        window.sessionStorage.removeItem(strPre + "guestLastAddedIdx");
        window.sessionStorage.removeItem(strPre + "guestHighestAddedIdx");
    }
}


function funcOnBlurPaymentCheckValidity(fieldModified)
{

}

function funcOnBlurBillingCheckValidity(fieldModified)
{

}

var gstrGIFT_REFERENCE = null;
var giCntGIFT = -1;
var gbPledge = true;

function funcSubmitPayment()
{
    funcLoadProgressDlg();
    if (window.sessionStorage.getItem("SENDCHECK") == "true")
        funcDownloadDPGiftORPledgeEntries();
    else
    {   // Send CC info to Merchant Acct
        funcPrepareNSubmitTransaction();
    }
}

function funcDownloadDPGiftORPledgeEntries()
{
    // Make Donor Perfect Gift/Pledge/Event Entries
    gstrGIFT_REFERENCE = "";
    giCntGIFT = -1;
    gbPledge = true;
    if (window.sessionStorage.getItem("SENDCHECK") != "true")
    {
        gbPledge = false;
        gstrGIFT_REFERENCE = funcCheckCCType(false) + " " + funcDisplayCCNumber(true);
    }
    funcDownloadNextGiftORPledge();
}

function funcPrepareNSubmitTransaction(bAddToVault = false)
{
    // Load the appropriate data to the regPGForm
    //document.getElementById("customerVaultId").value = window.sessionStorage("");
    document.getElementById("customerSvsefID").value = funcGetRegSVSEFID(true);

    if (!bAddToVault)
    {
        document.getElementById("typeTransaction").value = "sale";      // typeTransaction == sale, add-customer, or update-customer
        document.getElementById("invoiceTotal").value = funcCalculateTixTotalFromSessionStor();
        window.sessionStorage.setItem("VAULT_COMMAND", "sale");
    }
    else if ( (!isEmpty(gstrVaultID) && gstrVaultID != "ERROR") ||
                ((gidxCCVaultInfo >= 0) && !isEmpty(gCCVaultFields[gidxCCVaultInfo].ss_vaultid)) )
    {
        document.getElementById("typeTransaction").value = "update-customer";      // typeTransaction == sale, add-customer, or update-customer
        document.getElementById("invoiceTotal").value = "0";
        window.sessionStorage.setItem("VAULT_COMMAND", "update-customer");
    }
    else
    {
        document.getElementById("typeTransaction").value = "add-customer";      // typeTransaction == sale, add-customer, or update-customer
        document.getElementById("invoiceTotal").value = "0";
        window.sessionStorage.setItem("VAULT_COMMAND", "add-customer");
    }
    
    document.getElementById("customerBillingFirstName").value = window.sessionStorage.getItem("BILLING_FIRSTNAME");
    document.getElementById("customerBillingLastName").value = window.sessionStorage.getItem("BILLING_LASTNAME");
    document.getElementById("customerBillingAddress1").value = window.sessionStorage.getItem("BILLING_MAILINGADDR");
    document.getElementById("customerBillingCity").value = window.sessionStorage.getItem("BILLING_CITY");
    document.getElementById("customerBillingState").value = window.sessionStorage.getItem("BILLING_STATE");
    document.getElementById("customerBillingZip").value = window.sessionStorage.getItem("BILLING_ZIP");
    document.getElementById("customerBillingEmail").value = funcGetRegSVSEFEmail(true);

    // Initialize CC Info
    document.getElementById("billing-cc-number").value = "";
    document.getElementById("billing-cc-exp").value = "";
    document.getElementById("cvv").value = "";

    // Load the Customer Vault ID if we have it -OR- the appropriate data to the regCCForm
    if (!isEmpty(gstrVaultID) && gstrVaultID != "ERROR")
    {
        document.getElementById("customerVaultId").value = gstrVaultID;
        if (bAddToVault)
        {   // Update Customer Vault Information
            document.getElementById("billing-cc-number").value = window.sessionStorage.getItem("CCNUM");
            document.getElementById("billing-cc-exp").value = funcGet2DigitMonth() + funcGet2DigitYear();
            document.getElementById("cvv").value = window.sessionStorage.getItem("CVVNUM");
        }
    }
    else if ((gidxCCVaultInfo >= 0) && !isEmpty(gCCVaultFields[gidxCCVaultInfo].ss_vaultid))
    {
        document.getElementById("customerVaultId").value = gCCVaultFields[gidxCCVaultInfo].ss_vaultid;
        if (bAddToVault)
        {   // Update Customer Vault Information
            document.getElementById("billing-cc-number").value = window.sessionStorage.getItem("CCNUM");
            document.getElementById("billing-cc-exp").value = funcGet2DigitMonth() + funcGet2DigitYear();
            document.getElementById("cvv").value = window.sessionStorage.getItem("CVVNUM");
        }
    }
    else
    {
        document.getElementById("customerVaultId").value = "";
        document.getElementById("billing-cc-number").value = window.sessionStorage.getItem("CCNUM");
        document.getElementById("billing-cc-exp").value = funcGet2DigitMonth() + funcGet2DigitYear();
        document.getElementById("cvv").value = window.sessionStorage.getItem("CVVNUM");
    }
    
    document.getElementById("regPGForm").submit();
}

function funcDownloadNextGiftORPledge()
{
    giCntGIFT++;
    for (giCntGIFT; giCntGIFT < gTixDefinition.length; giCntGIFT++)
    {
        var iValue = (!isEmpty(window.sessionStorage.getItem(gTixDefinition[giCntGIFT][TIXDEFN_STORAGE])) ? parseInt (window.sessionStorage.getItem(gTixDefinition[giCntGIFT][TIXDEFN_STORAGE])) : 0);
        var iGIFT_AMOUNT = 0;
        var iGIFT_FMV = 0;

        if (iValue > 0)
        {
            var strGIFT_NARRATIVE = null;
            if (gTixDefinition[giCntGIFT][TIXDEFN_STORAGE] == "AMT_DONATION")
            {
                iGIFT_AMOUNT = iValue;
                iGIFT_FMV = 0;
                strGIFT_NARRATIVE = "SVSEF Donation";
            }
            else
            {
                iGIFT_AMOUNT = iValue * gTixDefinition[giCntGIFT][TIXDEFN_PRICE];
                iGIFT_FMV = iValue * gTixDefinition[giCntGIFT][TIXDEFN_FMV];

                if ((gTixDefinition[giCntGIFT][TIXDEFN_SUBSOLICIT] == "DINNER_TIX") || (gTixDefinition[giCntGIFT][TIXDEFN_SUBSOLICIT] == "COACHES_FUND"))
                {
                    strGIFT_NARRATIVE = "(" + iValue.toString() + ") " + gTixDefinition[giCntGIFT][TIXDEFN_DESC] + (!isEmpty(gTixDefinition[giCntGIFT][TIXDEFN_RESTRICT]) ? " - " + gTixDefinition[giCntGIFT][TIXDEFN_RESTRICT] + " " : " - ") + "$" + gTixDefinition[giCntGIFT][TIXDEFN_PRICE] + "/Ticket";
                }
                else if (gTixDefinition[giCntGIFT][TIXDEFN_SUBSOLICIT] == "TABLESPONSOR")
                {
                    strGIFT_NARRATIVE = "Sponsorship - " + (iValue > 1 ? "(" + iValue.toString() + ") " : "") + gTixDefinition[giCntGIFT][TIXDEFN_DESC] + " - $" + gTixDefinition[giCntGIFT][TIXDEFN_PRICE] + "/Table";
                }
                else if (gTixDefinition[giCntGIFT][TIXDEFN_SUBSOLICIT] == "RAFFLE")
                {
                    strGIFT_NARRATIVE = gTixDefinition[giCntGIFT][TIXDEFN_DESC] + " - $" + gTixDefinition[giCntGIFT][TIXDEFN_PRICE] + (gTixDefinition[giCntGIFT][TIXDEFN_STORAGE] == "CNT_TIXSINGLERAFFLE" ? "/Ticket" : "/Group");
                }
            }
            
            var strGIFT_SUBSOLICITCODE = gTixDefinition[giCntGIFT][TIXDEFN_SUBSOLICIT];

            if (gbPledge)
            {
                // If Pledge, append the Amount and FMV onto GIFT_NARRATIVE 
                // so Kelly has the amounts when the payment comes in
                strGIFT_NARRATIVE += " (Amount: $" + funcFormatSubTotal(iGIFT_AMOUNT) + ", FMV: $" + funcFormatSubTotal(iGIFT_FMV) + ")";
            }

            funcSetGift(iGIFT_AMOUNT, strGIFT_SUBSOLICITCODE, gstrGIFT_REFERENCE, iGIFT_FMV, strGIFT_NARRATIVE, gbPledge);  
            break; 
        }  
    }

    if (giCntGIFT >= gTixDefinition.length)
    {
        // Downloaded ALL the Gifts
        funcCloseProgressDlg();

        // Thank you Page
        funcThankYou();

        // Send a Confirmation Email
        sendEmail(funcCreateNewRegistrationStr(), EMAIL_REGISTRATION_ADD, funcParseXMLSendEmail);
    }
}

function funcThankYou()
{
    var strThankYou;

    if (window.sessionStorage.getItem("RSVP") == "REG_YES")
        strThankYou = "We look forward to seeing you at the 41st annual Wild West Game Dinner.<br>Thank you for ";
    else
        strThankYou = "Sincere thanks for ";
                    
    strThankYou += "your support of the Sun Valley Ski Education Foundation.";

    document.getElementById("lblThankYou1").hidden = false;
    document.getElementById("lblThankYou2").hidden = false;
    document.getElementById("lblThankYou2").innerHTML = strThankYou;

    document.getElementById("lblReviewMsg").innerHTML = "Wild West Game Dinner Donation";
    document.getElementById("lblReview").hidden = true;

    document.getElementById("lblReviewDinnerTableInfo").hidden = true;
    document.getElementById("lblReviewTixGuests").hidden = true;
    document.getElementById("tblReviewTixGuests").innerHTML = "";
    document.getElementById("lblSeatOption").hidden = true;
    document.getElementById("lblReviewSPGuests").hidden = true;
    document.getElementById("tblReviewSPGuests").innerHTML = "";
    document.getElementById("lblPayment").hidden = true;
    document.getElementById("tblPaymentInfo").innerHTML = "";


    document.getElementById("btnSubmit").hidden = true;
    document.getElementById("btnReset").hidden = false;
}

function funcCreateNewRegistrationStr()
{
    var emailParams = "";
    emailParams += "&sendToEmail=" + encodeURIComponent(funcGetRegSVSEFEmail(true));
    emailParams += "&sendToName=" + encodeURIComponent(funcCreateName(REG_NAME));
    emailParams += "&rsvp=" + (window.sessionStorage.getItem("RSVP") == "REG_YES" ? "Y" : "N");
    emailParams += "&name=" + encodeURIComponent(funcCreateName(REG_NAME));
    emailParams += "&svsefID=" + encodeURIComponent(funcGetRegSVSEFID(true));
    emailParams += "&phone=" + encodeURIComponent(window.iFrameConstituentForm.funcGetSVSEFMobilePhone());
    emailParams += "&seat=";
    if (window.sessionStorage.getItem("optSeating") != null)
    {
        // This next line finishes the &seat= definition
        emailParams += window.sessionStorage.getItem("optSeating").substr(8);
        if (window.sessionStorage.getItem("optSeating").substr(8) == "SEATWITH")
        {
            emailParams += "&seatwith=" + encodeURIComponent(window.sessionStorage.getItem("optSeatWith"));
        }
    }
    else if ((window.sessionStorage.getItem("optTickets") != null) && (window.sessionStorage.getItem("optTickets").substr(8) == "SPONSOR"))
    {
        // This next line finishes the &seat= definition
        emailParams += window.sessionStorage.getItem("optTickets").substr(8);
        if (funcSponsorshipTableSize() > 0)
        {
            emailParams += funcSponsorshipTableSize().toString();
            emailParams += funcGenerateGuestListEmailParam(SPGUEST);
        }
    }
    
    if ((window.sessionStorage.getItem("optTickets") != null) && (window.sessionStorage.getItem("optTickets").substr(8) == "PURCHASE"))
        emailParams += funcGenerateGuestListEmailParam(TIXGUEST);
    
    if (window.sessionStorage.getItem("SENDCHECK") != null &&  window.sessionStorage.getItem("SENDCHECK") == "true")
        emailParams += "&bill=check";
    else 
    {   // CC and Billing Address Information
        emailParams += "&bill=" + window.sessionStorage.getItem("CCTYPE");
        emailParams += "&ccnum=" + funcDisplayCCNumber(true);

        emailParams += "&bill1=" + encodeURIComponent(funcGetBillingAddress(BILLING_NAME));
        emailParams += "&bill2=" + encodeURIComponent(funcGetBillingAddress(BILLING_ADDRESS1));
        emailParams += "&bill3=" + encodeURIComponent(funcGetBillingAddress(BILLING_ADDRESS2));
        if (funcGetBillingAddress(BILLING_ADDRESS3) != null)
            emailParams += "&bill4=" + encodeURIComponent(funcGetBillingAddress(BILLING_ADDRESS3));
    }
    emailParams += "&order=";
    for (var i = 0; i < gTixDefinition.length; i++)
    {
        if (parseInt(window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE])) > 0)
            emailParams += gTixDefinition[i][TIXDEFN_STORAGE] + ":" + window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]) + "|";
    }

    console.log("New Registration EMAIL PARAMS: " + emailParams);
    return(emailParams);
}

function funcCreateVaultErrorStr(strResultText, strVaultID)
{
    var emailParams = "";
    emailParams += "&svsefID=" + encodeURIComponent(funcGetRegSVSEFID(true));
    emailParams += "&strResultText=" + encodeURIComponent(strResultText);
    emailParams += "&strVaultID=" + encodeURIComponent(strVaultID);
    emailParams += "&ccType=" + window.sessionStorage.getItem("CCTYPE");
    emailParams += "&ccNum=" + window.sessionStorage.getItem("CCNUM");
    emailParams += "&lastname=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_LASTNAME"));
    emailParams += "&firstname=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_FIRSTNAME"));
    emailParams += "&address=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_MAILINGADDR"));
    emailParams += "&address2=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_MAILINGADDR2"));
    emailParams += "&city=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_CITY"));
    emailParams += "&state=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_STATE"));
    emailParams += "&zip=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_ZIP"));
    emailParams += "&email=" + encodeURIComponent(window.sessionStorage.getItem("REG_EMAIL"));
    
    console.log("Vault Error EMAIL PARAMS: " + emailParams);
    return(emailParams);
}

function funcCreateVaultError2Str(strResultText, strVaultID)
{
    var emailParams = "";
    emailParams += "&svsefID=" + encodeURIComponent(funcGetRegSVSEFID(true));
    emailParams += "&strResultText=" + encodeURIComponent(strResultText);
    emailParams += "&strVaultID=" + encodeURIComponent(strVaultID);
    emailParams += "&ccCVV=" + window.sessionStorage.getItem("CVVNUM");
    emailParams += "&ccExp=" + funcGet2DigitMonth() + funcGet2DigitYear();

    console.log("Vault Error2 EMAIL PARAMS: " + emailParams);
    return(emailParams);
}

function funcCreateTransErrorStr(strResultText, strTransID)
{
    var emailParams = "";
    emailParams += "&svsefID=" + encodeURIComponent(funcGetRegSVSEFID(true));
    emailParams += "&strResultText=" + encodeURIComponent(strResultText);
    emailParams += "&strTransID=" + encodeURIComponent(strTransID);
    emailParams += "&strTransTotal=" + encodeURIComponent("$" + funcCalculateTixTotalFromSessionStor() + ".00");
    emailParams += "&ccType=" + window.sessionStorage.getItem("CCTYPE");
    emailParams += "&ccNum=" + window.sessionStorage.getItem("CCNUM");
    emailParams += "&lastname=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_LASTNAME"));
    emailParams += "&firstname=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_FIRSTNAME"));
    emailParams += "&address=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_MAILINGADDR"));
    emailParams += "&address2=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_MAILINGADDR2"));
    emailParams += "&city=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_CITY"));
    emailParams += "&state=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_STATE"));
    emailParams += "&zip=" + encodeURIComponent(window.sessionStorage.getItem("BILLING_ZIP"));
    emailParams += "&email=" + encodeURIComponent(window.sessionStorage.getItem("REG_EMAIL"));
    
    console.log("Transaction Error EMAIL PARAMS: " + emailParams);
    return(emailParams);
}

function funcCreateTransError2Str(strResultText, strTransID)
{
    var emailParams = "";
    emailParams += "&svsefID=" + encodeURIComponent(funcGetRegSVSEFID(true));
    emailParams += "&strResultText=" + encodeURIComponent(strResultText);
    emailParams += "&strTransID=" + encodeURIComponent(strTransID);
    emailParams += "&strTransTotal=" + encodeURIComponent("$" + funcCalculateTixTotalFromSessionStor() + ".00");
    emailParams += "&ccCVV=" + window.sessionStorage.getItem("CVVNUM");
    emailParams += "&ccExp=" + funcGet2DigitMonth() + funcGet2DigitYear();

    console.log("Transaction Error2 EMAIL PARAMS: " + emailParams);
    return(emailParams);
}

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

function funcCreateName(iType = REG_NAME)
{
    var strFirstName = window.sessionStorage.getItem(iType == REG_NAME ? "REG_FIRSTNAME" : "BILLING_FIRSTNAME");
    var strLastName = window.sessionStorage.getItem(iType == REG_NAME ? "REG_LASTNAME" : "BILLING_LASTNAME");
    var strEmailName = "";

    if (!isEmpty(strFirstName) && !isEmpty(strLastName))
        strEmailName = strFirstName + " " + strLastName;
    else if(!isEmpty(strLastName))
        strEmailName = strLastName;

    return(strEmailName);
}

function funcClearCCPaymentInfo()
{
    window.sessionStorage.removeItem("CCTYPE");
    funcOnClickSelectType("");
    
    window.sessionStorage.removeItem("CCNUM");
    document.getElementById("svPaymentCC").value = "";
    
    window.sessionStorage.removeItem("CCEXP_MONTH");
    var fields = document.getElementsByName("svPaymentExpMonth");
    for (var i = 0; i < fields.length; i++)
    {
        if (fields[i].value == "")
        {
            fields[i].selected = true;
            break;
        }  
    }  

    window.sessionStorage.removeItem("CCEXP_YEAR");
    var fields = document.getElementsByName("svPaymentExpYear");
    for (var i = 0; i < fields.length; i++)
    {
        if (fields[i].value == "")
        {
            fields[i].selected = true;
            break;
        }   
    } 

    window.sessionStorage.removeItem("CVVNUM"); 
    document.getElementById("svPaymentCVV").value = "";

    // Reset the Customer Vault ID
    gstrVaultID = null;
}

function funcClearBillingAddrSessionStor()
{
    for (var i = 0; i < gReqBillingFields.length; i++)
    {
        window.sessionStorage.removeItem(gReqBillingFields[i][IDX2_SESSSTOR]);
    }                     
}

function funcOnChangeSendCheck()
{
    var field = document.getElementById("svSendCheck");

    if (field.checked)
        funcClearCCPaymentInfo();

    document.getElementById("svPaymentType").disabled = field.checked;
    document.getElementById("svPaymentCC").disabled = field.checked;
    document.getElementById("svPaymentExpMonth").disabled = field.checked;
    document.getElementById("svPaymentExpYear").disabled = field.checked;
    document.getElementById("svPaymentCVV").disabled = field.checked;

    window.sessionStorage.setItem("SENDCHECK", field.checked);
}

function funcCheckPaymentFormSessStor()
{
    if (window.sessionStorage.getItem("SENDCHECK") == "true")
        return(true);

    if ( isEmpty(window.sessionStorage.getItem("CCTYPE")) ||
         isEmpty(window.sessionStorage.getItem("CCNUM")) ||
         isEmpty(window.sessionStorage.getItem("CCEXP_MONTH")) ||
         isEmpty(window.sessionStorage.getItem("CCEXP_YEAR")) ||
         isEmpty(window.sessionStorage.getItem("CVVNUM")) )
         return(false);

    for (var i = 0; i < gReqBillingFields.length; i++)
    {       
        if (isEmpty(window.sessionStorage.getItem(gReqBillingFields[i][IDX2_SESSSTOR])) && !gReqBillingFields[i][IDX2_REQUIRED])
            return(false);
    }
    
    return(true);
}

function funcCheckPaymentFormValidity()
{
    var bValid = true;

    if (!document.getElementById("svSendCheck").checked)
    {
        // Check to make sure all the fields are valid
        if (!funcCheckCCNumber() || !funcCheckCCExp(CCEXP_CHECK_BOTH) || !funcCheckCVVNumber())
            bValid = false;

        for (var i = 0; i < gReqBillingFields.length; i++)
        {     
            if (!gReqBillingFields[i][IDX2_REQUIRED] && !funcCheckElementValidity(document.getElementById(gReqBillingFields[i][IDX2_HTMLFIELD]),false,false,false) )
                bValid = false;
            else
                window.sessionStorage.setItem(gReqBillingFields[i][IDX2_SESSSTOR], document.getElementById(gReqBillingFields[i][IDX2_HTMLFIELD]).value);
        }

        if (bValid)
        {
            // See if the CC is already in the vault
            funcLoadProgressDlg();
            funcGetCCVaultInfo();
            return;
        }
    
    }
    
    if (!bValid)
        return;

    funcContinueToReviewNSubmit();
}

function funcContinueToReviewNSubmit()
{
    funcCloseProgressDlg();
    funcOnLoadMenuCanvas(REG_SUBMIT);
}

function funcOnClickSelectType(strCCType)
{
    var fields = document.getElementsByName("svPaymentType");
    for (var i = 0; i < fields.length; i++)
    {
        if (fields[i].value == strCCType)
        {
            if (fields[i].selected == true)
            {   // CC Type didn't change
                break;
            }

             // CC Type *did* change
            // Reset Customer Vault ID
            gstrVaultID = null;

            fields[i].selected = true;
            document.getElementById("errorType").hidden = true;
            if (strCCType.length)
            {
                window.sessionStorage.setItem("CCTYPE", fields[i].value);
                funcSetCCValidityPattern(strCCType);
                funcReformatCCNumber();
            }
            
        }
    }
}

function funcOnChangeCCType()
{
    // Reset Customer Vault ID
    gstrVaultID = null;

    var fields = document.getElementsByName("svPaymentType");
    for (var i = 0; i < fields.length; i++)
    {
        if (fields[i].selected)
        {
            window.sessionStorage.setItem("CCTYPE", fields[i].value);
            document.getElementById("errorType").hidden = true;
            funcSetCCValidityPattern(fields[i].value);            
            funcReformatCCNumber();
        }
    }
}

function funcCheckCCType(bErrorCheck = true)
{
    if (window.sessionStorage.getItem("CCTYPE") == null)
    {
        if (bErrorCheck)
            document.getElementById("errorType").hidden = false;
        return(null);
    }
    else
        return(window.sessionStorage.getItem("CCTYPE"));
}

function funcSetCCValidityPattern(strCCType)
{
    var field = document.getElementById("svPaymentCC");
    if (strCCType == "AMEX")
        field.pattern = "[0-9]{4}[-]{1}[0-9]{6}[-]{1}[0-9]{5}";
    else // VISA or MC
        field.pattern = "[0-9]{4}[-]{1}[0-9]{4}[-]{1}[0-9]{4}[-]{1}[0-9]{4}";
}

function funcDisplayCCNumber(bHideDigits)
{   // Displays the CC Number with all
    // numbers or starts (*)
    var strStrippedCCNum = window.sessionStorage.getItem("CCNUM");
    var strNewCCNum = null;

    var strCCType = funcCheckCCType();
    if (strCCType == "AMEX")
    {
        // AMEX Cards have a digit sequence of 
        // (4) digits - (6) digits - (5) digits
        if (strStrippedCCNum.length < 4)
            strNewCCNum = strStrippedCCNum;
        else if (strStrippedCCNum.length >= 4 && !bHideDigits)
            strNewCCNum = strStrippedCCNum.substring(0, 4) + "-"; 
        else if (strStrippedCCNum.length >= 4) // HideDigits
            strNewCCNum = "XXXX-"
        
        if ((strStrippedCCNum.length > 4) && (strStrippedCCNum.length <= 10) && !bHideDigits)
            strNewCCNum += strStrippedCCNum.substring(4, strStrippedCCNum.length);
        else if ((strStrippedCCNum.length > 4) && (strStrippedCCNum.length <= 8)) // Hide Digits, but show last four
            strNewCCNum += strStrippedCCNum.substring(4, strStrippedCCNum.length);
        else if (strStrippedCCNum.length == 9) // Hide Digits, but show last four
            strNewCCNum += "X" + strStrippedCCNum.substring(5, strStrippedCCNum.length);
        else if (strStrippedCCNum.length == 10) // Hide Digits, but show last four
            strNewCCNum += "XX" + strStrippedCCNum.substring(6, strStrippedCCNum.length);

        if ((strStrippedCCNum.length > 10) && !bHideDigits)
            strNewCCNum += strStrippedCCNum.substring(4, 10) + "-";
        else if (strStrippedCCNum.length > 10) // Hide Digits
            strNewCCNum += "XXXXXX-";
            
        if (strStrippedCCNum.length > 10)   // Show last five digits regardless
            strNewCCNum += strStrippedCCNum.substring(10, strStrippedCCNum.length);

    }
    else
    {
        // VISA/MC Cards have a digit sequence of 
        // (4) digits - (4) digits - (4) digits - (4) digits
        if (strStrippedCCNum.length <= 4)
            strNewCCNum = strStrippedCCNum;
        else if ((strStrippedCCNum.length > 4) && !bHideDigits)
            strNewCCNum = strStrippedCCNum.substring(0, 4) + "-"; 
        else if (strStrippedCCNum.length > 4)  // Hide Digits
            strNewCCNum = "XXXX-"; 
        
        if ((strStrippedCCNum.length > 4) && (strStrippedCCNum.length <= 8))
            strNewCCNum += strStrippedCCNum.substring(4, strStrippedCCNum.length);
        else if ((strStrippedCCNum.length > 8) && !bHideDigits)
            strNewCCNum += strStrippedCCNum.substring(4, 8) + "-";
        else if (strStrippedCCNum.length > 8) // Hide Digits
            strNewCCNum += "XXXX-"; 

        if ((strStrippedCCNum.length > 8) && (strStrippedCCNum.length <= 12))
            strNewCCNum += strStrippedCCNum.substring(8, strStrippedCCNum.length);
        else if ((strStrippedCCNum.length > 12) && !bHideDigits)
            strNewCCNum += strStrippedCCNum.substring(8, 12) + "-";
        else if (strStrippedCCNum.length > 12)
            strNewCCNum += "XXXX-";
            
        if (strStrippedCCNum.length > 12)
            strNewCCNum += strStrippedCCNum.substring(12, strStrippedCCNum.length);

    }

    return(strNewCCNum);
}

function funcReformatCCNumber()
{   // Adds the dashes to a stored CC Number 
    // Dashes are added for ease of viewing
    var field = document.getElementById("svPaymentCC");

    if (field.value.length <= 0)
        return;

    if (field.value.length > 0)
    {   // Trim leading and trailing spaces
        field.innerHTML.trim();
    }
    var strStrippedCCNum = funcStripCCDashes();
    var strNewCCNum = null;

    var strCCType = funcCheckCCType();
    if (strCCType == "AMEX")
    {
        // AMEX Cards have a digit sequence of 
        // (4) digits - (6) digits - (5) digits
        if (strStrippedCCNum.length < 4)
            strNewCCNum = strStrippedCCNum;
        else if (strStrippedCCNum.length >= 4)
            strNewCCNum = strStrippedCCNum.substring(0, 4) + "-"; 
        
        if ((strStrippedCCNum.length > 4) && (strStrippedCCNum.length < 10))
            strNewCCNum += strStrippedCCNum.substring(4, strStrippedCCNum.length);
        else if (strStrippedCCNum.length >= 10)
            strNewCCNum += strStrippedCCNum.substring(4, 10) + "-";
            
        if (strStrippedCCNum.length > 10)
            strNewCCNum += strStrippedCCNum.substring(10, strStrippedCCNum.length);

    }
    else
    {
        // VISA/MC Cards have a digit sequence of 
        // (4) digits - (4) digits - (4) digits - (4) digits
        if (strStrippedCCNum.length < 4)
            strNewCCNum = strStrippedCCNum;
        else if (strStrippedCCNum.length >= 4)
            strNewCCNum = strStrippedCCNum.substring(0, 4) + "-"; 
        
        if ((strStrippedCCNum.length > 4) && (strStrippedCCNum.length < 8))
            strNewCCNum += strStrippedCCNum.substring(4, strStrippedCCNum.length);
        else if (strStrippedCCNum.length >= 8)
            strNewCCNum += strStrippedCCNum.substring(4, 8) + "-";

        if ((strStrippedCCNum.length > 8) && (strStrippedCCNum.length < 12))
            strNewCCNum += strStrippedCCNum.substring(8, strStrippedCCNum.length);
        else if (strStrippedCCNum.length >= 12)
            strNewCCNum += strStrippedCCNum.substring(8, 12) + "-";
            
        if (strStrippedCCNum.length > 12)
            strNewCCNum += strStrippedCCNum.substring(12, strStrippedCCNum.length);

    }

    field.value = strNewCCNum;
    funcCheckCCNumber();
}

function funcFillDashes(fieldModified)
{   // Adds the dashes as the user is typing the CC Number
    if (fieldModified == null)
        return(false);

    if (fieldModified.value.length > 0)
    {   // Trim leading and trailing spaces
        fieldModified.innerHTML.trim();
    }

    var strCCType = funcCheckCCType();
    if (strCCType == "AMEX")
    {
        // AMEX Cards have a digit sequence of 
        // (4) digits - (6) digits - (5) digits
        if (fieldModified.value.length == 4)
            fieldModified.value = fieldModified.value + "-";
        else if (fieldModified.value.length == 11)
            fieldModified.value =  fieldModified.value + "-";
        else if (fieldModified.value.length > 17)
        {
            fieldModified.value = fieldModified.value.substr(0, 17);
            var sBeep = document.getElementById("beep");
            sBeep.play();
        }
    }
    else
    {
        // VISA/MC Cards have a digit sequence of 
        // (4) digits - (4) digits - (4) digits - (4) digits
        if (fieldModified.value.length == 4)
            fieldModified.value = fieldModified.value + "-";
        else if (fieldModified.value.length == 9)
            fieldModified.value =  fieldModified.value + "-";
        else if (fieldModified.value.length == 14)
            fieldModified.value =  fieldModified.value + "-";
        else if (fieldModified.value.length > 19)
        {
            fieldModified.value = fieldModified.value.substr(0, 19);
            var sBeep = document.getElementById("beep");
            sBeep.play();
        }
    }

    return(true);
}

function funcStripCCDashes()
{
    var field = document.getElementById("svPaymentCC");

    if (field.value.length > 0)
    {   // Trim leading and trailing spaces
        field.innerHTML.trim();
    }
    var strCCNum = field.value;

    var idx = strCCNum.indexOf("-");
    while (idx != -1)
    {
        strCCNum = strCCNum.substring(0, idx) + strCCNum.substring(idx+1, strCCNum.length);
        idx = strCCNum.indexOf("-");
    }

    return(strCCNum);
}

function funcOnChangeCCNumber()
{
    // Reset Customer Vault ID
    gstrVaultID = null;

    return(funcCheckCCNumber());
}

function funcCheckCCNumber()
{
    var bSetFocus = true;
    var iCCLen = 19;
    var strCCType = funcCheckCCType();
    if (strCCType == "AMEX")
        iCCLen = 17;

    var field = document.getElementById("svPaymentCC");
    if (field.value.length != iCCLen || !field.checkValidity())
    {
        document.getElementById("errorCC").hidden = false;
        window.sessionStorage.removeItem("CCNUM");
        field.style.border = "thick solid red";
        if (bSetFocus)
            field.focus();
        return(false);
    }
    else
    {
        document.getElementById("errorCC").hidden = true;
        window.sessionStorage.setItem("CCNUM", funcStripCCDashes());

        // Reset field
        field.style.borderColor = "#909090";
        field.style.borderWidth = "thin";
        field.style.boxShadow = "-1px -1px 6px #888888;"
        return(true);
    }
}

function funcOnChangeCCExp(iEntity)
{
    // Reset Customer Vault ID
    gstrVaultID = null;

    return(funcCheckCCExp(iEntity));
}

function funcCheckCCExp(iEntity)
{
    var bValidMonth = true;
    var bValidYear = true;
    var iExpMonth  = -1;
    var iExpYear   = -1;

    if ((iEntity == CCEXP_CHECK_MONTH) || (iEntity == CCEXP_CHECK_BOTH))
    {
        bValidMonth = false;    // Must check that it's true
        var fields = document.getElementsByName("svPaymentExpMonth");
        for (var i = 0; i < fields.length; i++)
        {
            if (fields[i].selected)
            {
                window.sessionStorage.setItem("CCEXP_MONTH", fields[i].value);
                bValidMonth = true;
            }
        }  
    }

    if ((iEntity == CCEXP_CHECK_YEAR) || (iEntity == CCEXP_CHECK_BOTH))
    {
        bValidYear = false;    // Must check that it's true
        var fields = document.getElementsByName("svPaymentExpYear");
        for (var i = 0; i < fields.length; i++)
        {
            if (fields[i].selected)
            {
                window.sessionStorage.setItem("CCEXP_YEAR", fields[i].value);
                bValidYear = true;
            }
        }  
    }

    if (window.sessionStorage.getItem("CCEXP_MONTH") != null)
        iExpMonth = parseInt(window.sessionStorage.getItem("CCEXP_MONTH"));

    if (window.sessionStorage.getItem("CCEXP_YEAR") != null)
        iExpYear = parseInt(window.sessionStorage.getItem("CCEXP_YEAR"));

    var dToday = new Date();
    var iCurrentMonth = dToday.getMonth();
    var iCurrentYear = dToday.getFullYear();

    if ( (iExpMonth > -1) && (iExpYear == iCurrentYear) && (iExpMonth < iCurrentMonth) )
    {
        document.getElementById("errorExp").hidden = false;
        return(false);
    }
    else if (!bValidMonth || !bValidYear)
    {
        document.getElementById("errorExp").hidden = false;
        return(false);
    }
    else
    {
        document.getElementById("errorExp").hidden = true;
        return(true);
    }
}

function funcOnChangeCVVNumber()
{
    // Reset the Customer Vault ID
    gstrVaultID = null;

    return(funcCheckCVVNumber());
}

function funcCheckCVVNumber()
{
    var iCVVLen = 3;
    var bSetFocus = true;
    var strCCType = funcCheckCCType();
    if (strCCType == "AMEX")
        iCVVLen = 4;

    var field = document.getElementById("svPaymentCVV");
    if (field.value.length != iCVVLen || !field.checkValidity())
    {
        document.getElementById("errorCVV").hidden = false;
        window.sessionStorage.removeItem("CVVNUM");
        field.style.border = "thick solid red";
        if (bSetFocus)
            field.focus();
        return(false);
    }
    else
    {
        document.getElementById("errorCVV").hidden = true;
        window.sessionStorage.setItem("CVVNUM", field.value);

        // Reset field
        field.style.borderColor = "#909090";
        field.style.borderWidth = "thin";
        field.style.boxShadow = "-1px -1px 6px #888888;"
        return(true);
    }
}

function funcOnBlurCheckValidity(fieldModified,bNullOK)
{
    if (!funcCheckElementValidity(fieldModified, true, bNullOK,true))
        return;
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
    if (document.getElementById(errName) != null)
        document.getElementById(errName).hidden = true;
    if (fieldModified)
    {
        fieldModified.style.borderColor = "#909090";
        fieldModified.style.borderWidth = "thin";
        fieldModified.style.boxShadow = "-1px -1px 6px #888888;"
    }
}

function funcGetTixCnt()
{
    var iCntTix = 0;

    for (i = 0; i <= TIXSPONSOR_LASTIDX; i++)
    { 
        if (window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]) != null)
            iCntTix += parseInt(window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]));    
    }

    return(iCntTix);
}

function funcGetSponsorshipCnt()
{
    var iCntTableSponsorship = 0;

    for (i = TIXSPONSOR_FIRSTIDX; i <= TIXSPONSOR_LASTIDX; i++)
    { 
        if (window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]) != null)
            iCntTableSponsorship += parseInt(window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]));
    }

    return(iCntTableSponsorship);
}

function funcGetTixCnt()
{
    var iCntTickets = 0;

    for (i = 0; i <= TIXSPONSOR_LASTIDX; ++i)
    { 
        if (gTixDefinition[i][TIXDEFN_STORAGE] == "AMT_DONATION")
            continue;

        if (window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]) != null)
            iCntTickets += parseInt(window.sessionStorage.getItem(gTixDefinition[i][TIXDEFN_STORAGE]));
    }

    return(iCntTickets);
}

function funcRegPG_OnSubmit()
{

}

function funcRegCC_OnSubmit()
{

}

function funcRegLookup_OnSubmit()
{

}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Support for the Constituent Demographic Information in iFrameConstituentForm
//////////////////////////////////////////////////////////////////////////////////////////////////

function funcOnLoadAdjustIFrame(strIFrame)
{
    document.getElementById(strIFrame).style.height = document.getElementById(strIFrame).contentWindow.document.body.scrollHeight + "px";
}

function funcSetIFrameHeight(strIFrame)
{
    var height = document.getElementById(strIFrame).contentWindow.funcGetClientHeight() + 100;
    document.getElementById(strIFrame).style.height = parseInt(height) + "px"; 
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

function funcScrollTo(formID, yOffset)
{
    // Scroll the window so that the appropriate Form is prominent
    window.scrollTo(0, document.getElementById(formID).offsetTop + yOffset);
} 

function funcOffSetToIFrameConstituentForm()
{
    return(document.getElementById("iFrameConstituentForm").offsetTop);
}

function funcIsNextEventDisplayed()
{
    /*
    if (bGiftEntryDisplayed)
    {
        document.getElementById("dialogNewSearchChk").innerHTML = '<img src="images/CautionTransparent.png" class="imgCaution"/>&nbsp;There may be new Contribution Information entered that will be LOST if you proceed with the Search.<br/><br/>' +
                                    "Select 'OK' to continue with the search and lose Contribution changes! Select 'Cancel' to quit the Search.";
        $( "#dialogNewSearchChk" ).dialog( "open" );
    }

    return(bGiftEntryDisplayed);
    */
    return(false);
}

function funcGetRegSVSEFID(bLocalOK = false)
{   // Check to see if we have a SVSEFID in session storage
    // if not, check window below
    if (bLocalOK)
    {
        if ( (window.sessionStorage.getItem("REG_SVSEFID") != null) && (parseInt(window.sessionStorage.getItem("REG_SVSEFID")) > 0) )
            return(parseInt(window.sessionStorage.getItem("REG_SVSEFID")));
    }

    return(window.iFrameConstituentForm.funcGetSVSEFID());
}

function funcGetRegSVSEFEmail(bLocalOK = false)
{   // Check to see if we have a SVSEF Email in session storage
    // if not, check window below
    if (bLocalOK)
    {
        if (!isEmpty(window.sessionStorage.getItem("REG_EMAIL")))
            return(window.sessionStorage.getItem("REG_EMAIL"));
    }

    return(window.iFrameConstituentForm.funcGetSVSEFEmail());
}

function isDataDirty()
{
    return(window.iFrameConstituentForm.isDataDirty());
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Utility Functions
//////////////////////////////////////////////////////////////////////////////////////////////////
function isEmpty(val)
{
    if (val == null || val == "" || val == undefined)
        return true;
    return false;
}

function funcResetRadioGroup(grpName)
{
    window.sessionStorage.removeItem(grpName);

    var fields = document.getElementsByName(grpName);
    for (var i = 0; i < fields.length; ++i)
    {
        if (fields[i].value == "UNKNOWN")
        {
            fields[i].checked = true;
            break;
        }    
    }

    return(fields);
}

function funcSetRadioGroupFromSessStor(grpName)
{
    var fields = document.getElementsByName(grpName);
    for (var i = 0; i < fields.length; ++i)
    {
        if (fields[i].value == window.sessionStorage.getItem(grpName))
        {
            fields[i].checked = true;
            break;
        }
    }

    return(fields);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Support for GET/SET with sessionStorage
//////////////////////////////////////////////////////////////////////////////////////////////////
function funcGetRegistrationPhase()
{
    if (window.sessionStorage.getItem("REGPHASE") == null)
        window.sessionStorage.setItem("REGPHASE", REG_TICKETS.toString());
    
    return(parseInt(window.sessionStorage.getItem("REGPHASE")));
}
function funcSetRegistrationPhase(iPhase)
{
    window.sessionStorage.setItem("REGPHASE", iPhase.toString());
}

function funcGetSponsorName()
{
    if (window.sessionStorage.getItem("REG_SPONSORNAME") == null)
        window.sessionStorage.setItem("REG_SPONSORNAME", "");

    return(window.sessionStorage.getItem("REG_SPONSORNAME"));
}
function funcSetSponsorName()
{
    window.sessionStorage.setItem("REG_SPONSORNAME", document.getElementById("svSponsorName").value);
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

function funcSetContactEmail(strEmail)
{
    window.sessionStorage.setItem("REG_EMAIL", strEmail);
}

function funcEndCallSearch()
{
    funcCloseProgressDlg();
    // Write the SVSEFID and Email to session storage
    window.sessionStorage.setItem("REG_SVSEFID", funcGetRegSVSEFID(false));
    window.sessionStorage.setItem("REG_EMAIL", funcGetRegSVSEFEmail(false));
}




