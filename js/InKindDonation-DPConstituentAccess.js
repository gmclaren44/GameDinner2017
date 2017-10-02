// Module to communicate with 
// DonorPerfect Database Server for
// the Constituent Demographic Data
//
// Author: Gina McLaren
// June 15, 2017
//

// Global DB Connection Information
var remUserID = "API Online Donation Form";
var globalIdSVSEF = 0;
var bNewConstituent = false;
var bSendNewConstituentEmail = false;


// Global Save UDF Variable Information
// params=@donor_id || @gift_id,@field_name,@data_type,@char_value,@date_value,@number_value,@user_id
var SAVEUDF_ID =            0;
var SAVEUDF_FIELD =         1; 
var SAVEUDF_TYPE =          2;  // 'C' - Character, 'D' - Date, 'N' - Numeric  
var SAVEUDF_CHARVALUE =     3;
var SAVEUDF_DATEVALUE =     4;
var SAVEUDF_NUMVALUE =      5;
var SAVEUDF_USERID =        6;
var SAVEUDF_CALLBACK =      7;
var SAVEUDF_LAST =          8;
                           

////////////////////////////////////////////////////////////////////////////
// Function Calls to Get/Set CONSTITUENT Data from Donor Perfect Web Service
////////////////////////////////////////////////////////////////////////////
function funcGetConstituent() 
{
    var remAction = "dp_donorsearch";
    // params=@donor_id,@last_name,@first_name,@opt_line,@address,
    //          @city,@state,@zip,@country,@filter_id,@user_id
    var fields = ["searchID", "searchLastName", "searchFirstName", "", "",
                    "", "", "", "", "", ""];   

    //Build the param list
    // Ex: https://ZZZ/xmlrequest.asp?login=xxx&pass=yyy&action=dp_donorsearch&params=8506,null,null,null,null,null,null,null,null,null,null
    //
    // login=xxx&pass=yyy  will be appended in server-side code

    var params = "action=" + remAction;
    params += "&params=";
    
    var val = "";
    for (var i = 0; i < fields.length; i++) 
    {
        if (i > 0)
            params += ",";

        val = "";
        if (!isEmpty(fields[i]))
            val = document.getElementById(fields[i]).value;

        if (!isEmpty(val) && (i == 1 || i == 2))
            params += "'" + val + "'";    // Search Names with Wildcards?
        else if (!isEmpty(val))
            params += val;
        else
            params += "null"; 
    } 


    console.log("funcSearchConstituent: query = " + params);
    getDPXML(params, funcParseXMLConstituentSearch);
}

function funcGetAddtlConstituent()
{
    if (isEmpty(globalIdSVSEF))
        return;

    // Send a query string to request business_phone, mobile_phone, email, and org_rec, nomail
    // Always include the donor_id first!
    //var query = "Select donor_id, business_phone, mobile_phone, email, org_rec, nomail from dp where donor_id = " + globalIdSVSEF;  
    var query = "Select donor_id, business_phone, mobile_phone, email, org_rec, nomail from dp where donor_id = " + globalIdSVSEF;  

    //Build the param list
    // Ex: https://ZZZ/xmlrequest.asp?login=xxx&pass=yyy&action= Select donor_id, business_phone, mobile_phone, email, org_rec, nomail from dp where donor_id = 8506";   
    //
    // login=xxx&pass=yyy  will be appended in server-side code

    var params = "action=" + query;
    
    console.log("funcGetAddtlConstituent: query = " + params);
    getDPXML(params, funcParseXMLConstituentAddtl);
}

function funcGetUDFConstituent()
{
    if (isEmpty(globalIdSVSEF))
        return;

    // Send a query string to request web
    // Always include the donor_id first!
    var query = "Select donor_id, web from DPUDF where donor_id = " + globalIdSVSEF;   

    //Build the param list
    // Ex: https://ZZZ/xmlrequest.asp?login=xxx&pass=yyy&action= Select donor_id, web from DPUDF where donor_id = 8506";   
    //
    // login=xxx&pass=yyy  will be appended in server-side code

    var params = "action=" + query;
    
    console.log("funcGetUDFConstituent: query = " + params);
    getDPXML(params, funcParseXMLConstituentUDF);
}

function funcSetConstituent()
{
    var remAction = "dp_savedonor";
    // params=@donor_id,@first_name,@last_name,@middle_name,@suffix,@title,
    //      @salutation,@prof_title,@opt_line,@address,@address2,
    //      @city,@state,@zip,@country,@address_type,@home_phone,@business_phone,
    //      @fax_phone,@mobile_phone,@email,@org_rec,@donor_type,@nomail,@nomail_reason,
    //      @narrative,@user_id
    var fields = ["svsefID", "svsefFirstName", "svsefLastName",  "", "", "", 
                "", "", "", "svsefMailingAddress", "svsefMailingAddress2",
                "svsefCity", "svsefState", "svsefZip", "", "", "", "svsefBusinessPhone",
                "", "svsefMobilePhone", "svsefEmail", IX_ORG, "", IX_NOMAIL, "", 
                "", remUserID];   

    //Build the param list
    // Ex: https://ZZZ/xmlrequest.asp?action=dp_savedonor&login=xxx&pass=yyy 
    //  &params=0,'Orianthi', 'Panagaris', null, null, null, null, null, null, '4240 Main St.', 
    // null, 'North Woodstock', 'NH', '12345', 'US', null, '205-555-1212', null, null, 
    // '205-987-6543', 'orianthi@bigstar.com', 'N', null,'N', null, null,'API User' 
    //
    // login=xxx&pass=yyy  will be appended in server-side code

    var params = "action=" + remAction;
    params += "&params=";
    
    for (var i = 0; i < fields.length - 1; i++) 
    {
        if (i > 0)
            params += ",";

        var val = "";
        if (!isEmpty(fields[i]) && fields[i] == IX_NOMAIL)
        {
            if  (bNewConstituent)
               gArrOrigFormData[IX_NOMAIL] = 'N'; 
            val = gArrOrigFormData[IX_NOMAIL];
        }
        else if (!isEmpty(fields[i]) && fields[i] == IX_ORG)
            val = funcGetOrg();
        else if (!isEmpty(fields[i]))
            val = document.getElementById(fields[i]).value;

        if (i == 0 && isEmpty(val))
        {
            params += "0";          // New Constituent being Added
            bNewConstituent = true;
        }    
        else if (i == 0 && !isEmpty(val))
            params += val;          // DP Constituent ID is an integer
        else if (!isEmpty(val))
            params += "'" + funcEscapeQuotes(val) + "'";
        else
            params += "null"; 
    } 

    params += ",'" + fields[i] + "'";    // Specifying Online Form as @user_id

    console.log("funcSetConstituent: query = " + params);
    getDPXML(params, funcParseXMLSetConstituent);
}

function funcSetUDFConstituent(fields)
{
    var params = funcSetUDFparams(fields);
    console.log("funcSetUDFConstituent: query = " + params);
    getDPXML(params, funcParseXMLSetConstituentUDF);
}

function funcSetUDFparams(fields)
{
    var remAction = "dp_save_udf_xml";
    // params=@donor_id || @gift_id,@field_name,@data_type,@char_value,@date_value,@number_value,@user_id
     
    //Build the param list
    //Ex: https://ZZZ/xmlrequest.asp?action=dp_ save_udf_xml
    //  &login=xxx&pass=yyy&params=16013,'WEB','C','www.svsef.org',null,null,'API User'
    //
    //  &login=xxx&pass=yyy  will be appended in server-side code

    var params = "action=" + remAction;
    params += "&params=";
    
    for (var i = 0; i < fields.length; i++) 
    {
        if (i > 0)
            params += ",";

        if (isEmpty(fields[i]))
        {
            params += "null";
            continue;
        }
                
        if ( (i == SAVEUDF_ID) || (i == SAVEUDF_NUMVALUE) || (i == SAVEUDF_DATEVALUE) )
            params += fields[i];    // Numeric Data    
        else if ( (i == SAVEUDF_FIELD) || (i == SAVEUDF_TYPE) || (i == SAVEUDF_CHARVALUE) || (i == SAVEUDF_USERID) )
            params += "'" + funcEscapeQuotes(fields[i]) + "'";  // Char Data
        else
            params += "null";       // Unknown Data
    } 

    return(params);
}

function funcSetFlagConstituent(strFlag)
{
    var remAction = "dp_saveflag_xml";
    // params=@donor_id || @gift_id,@flag,@user_id
     
    //Build the param list
    //Ex: https://ZZZ/xmlrequest.asp?action=dp_saveflag_xml
    //  &login=xxx&pass=yyy&params=9334,'GAMEDINNER','API Online Donation Form'
    //
    //  &login=xxx&pass=yyy  will be appended in server-side code

    var params = "action=" + remAction;
    params += "&params=" + globalIdSVSEF + ",";
    params += "'" + strFlag + "',";
    params += "'" + remUserID + "'";

    console.log("funcSetFlagConstituent: query = " + params);
    getDPXML(params, funcParseXMLSetFlagConstituent);

}




///////////////////////////////////////////////////////////////////////
// Utility Functions
///////////////////////////////////////////////////////////////////////
function getTodaysDate()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    return(today);
}

function isEmpty(val)
{
    if (val == null || val == "" || val == undefined)
        return true;
    return false;
}

function funcEscapeQuotes(val)
{
    var newVal = val.replace(/'/g, "''");

    return(newVal);
}

function isGiftFieldNumeric(i)
{
    
    if ((i == GIFT_ID) ||
        (i == GIFT_DONORID) ||
        (i == GIFT_AMOUNT) ||
        (i == GIFT_FMV) ||
        (i == GIFT_BATCHNO) ||
        /*(i == GIFT_GLINK) ||
        (i == GIFT_PLINK) ||*/
        (i == GIFT_OLDAMOUNT) ||
        (i == GIFT_MEM_LINKID) ||
        (i == GIFT_ADDR_ID))
        return(true);

    return(false);
}

function funcDonorIDMatch(resNode)
{
    var i;
    for (i = 0; i < resNode.childNodes.length; ++i)
    {
        if (resNode.childNodes[i].getAttribute("id") == "donor_id")
        {
            if (resNode.childNodes[i].getAttribute("value") != globalIdSVSEF)
            {
                console.log("funcDonorIDMatch ERROR: Returned data doesn't match.  globalIdSVSEF: " + globalIdSVSEF + " returned query id: " + resNode.childNodes[i].getAttribute("value"));
                return false;
            }
            else
                return true;
        } 
    }

    console.log("funcDonorIDMatch ERROR: donor_id wasn't queried!");

    return false;
}

///////////////////////////////////////////////////////////////////////
// Callback Function to Parse CONSTITUENT XML returned by Donor Perfect Web Service
///////////////////////////////////////////////////////////////////////
function funcSearchCleanup(bComplete = false)
{   // Call Search is an AUTO Search that sets a 
    // InProcess Dialog and it must be ended gracefully
    funcEndCallSearch();
}

function funcParseXMLConstituentSearch(resXMLDocument)
{
    console.log("funcParseXMLConstituentSearch: RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log("funcParseXMLConstituentSearch ERROR: resXMLDocument is Null");
        funcSearchCleanup();
        return;
    }

    // Check to see if more than one record was returned
    var cntRecords = 0;
    if (resXMLDocument.getElementsByTagName("result") && 
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record") &&
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length)
        cntRecords = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length;

    if (cntRecords < 1)
    {
        console.log("funcParseXMLConstituentSearch ERROR: cnt of XML records: " + cntRecords);
        funcSearchCleanup();
        return;
    }

    if (cntRecords > 1)
    {
        // We need to load the multiple records and allow them to be selectable
        funcLoadMultiSearchForm(resXMLDocument);
        funcSearchCleanup();
        return;
    }
        
    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];
    
    // Grab globalIdSVSEF aka donor_id
    var i;
    for (i = 0; i < resNode.childNodes.length; ++i)
    {
        var nodeID = resNode.childNodes[i].getAttribute("id");
        if (nodeID == "donor_id")
        {
            globalIdSVSEF = resNode.childNodes[i].getAttribute("value");
            break;
        }
    }
    if (isEmpty(globalIdSVSEF))
    {
        console.log("funcParseXMLConstituentSearch ERROR: globalIdSVSEF not valid: " + globalIdSVSEF);
        funcSearchCleanup();
        return;
    }

    funcLoadConstituentForm();
    funcEnableConstituentFields(false);
    funcSetFieldsConstituent(resNode);

    funcGetAddtlConstituent();
}

function funcParseXMLConstituentAddtl(resXMLDocument)
{
    console.log("funcParseXMLConstituentAddtl: RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if ( (resXMLDocument == null) || (isEmpty(globalIdSVSEF)) )
    {
        console.log("funcParseXMLConstituentAddtl ERROR: resXMLDocument is Null OR globalIdSVSEF not valid: " + globalIdSVSEF);
        funcSearchCleanup();
        return;
    }

    // Check to see if more than one record was returned
    var cntRecords = 0;
    if (resXMLDocument.getElementsByTagName("result") && 
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record") &&
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length)
        cntRecords = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length;

    if (cntRecords < 1)
    {
        console.log("funcParseXMLConstituentAddtl ERROR: cnt of XML records: " + cntRecords);
        funcSearchCleanup();
        return;
    }
        
    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];

    // Verify that globalIdSVSEF matches donor_id returned
    if (!funcDonorIDMatch(resNode))
    {
        console.log("funcParseXMLConstituentAddtl ERROR: Returned data doesn't match.  globalIdSVSEF: " + globalIdSVSEF + " returned query id: " + resNode.childNodes[i].getAttribute("value"));
        funcSearchCleanup();
        return;
    }
    
    funcSetFieldsConstituentAddtl(resNode);

    funcGetUDFConstituent();
}

function funcParseXMLConstituentUDF(resXMLDocument)
{
    console.log("funcParseXMLConstituentUDF: RESPONSEXML");
    console.log(resXMLDocument);

    // If no XML data was returned, then end this function
    if ( (resXMLDocument == null) || (isEmpty(globalIdSVSEF)) )
    {
        console.log("funcParseXMLConstituentUDF ERROR: resXMLDocument is Null OR globalIdSVSEF not valid: " + globalIdSVSEF);
        funcSearchCleanup();
        return;
    }

    // Check to see if more than one record was returned
    var cntRecords = 0;
    if (resXMLDocument.getElementsByTagName("result") && 
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record") &&
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length)
        cntRecords = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length;

    if (cntRecords < 1)
    {
        console.log("funcParseXMLConstituentUDF ERROR: cnt of XML records: " + cntRecords);
        funcSearchCleanup();
        return;
    }
        
    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];

    // Verify that globalIdSVSEF matches donor_id returned
    if (!funcDonorIDMatch(resNode))
    {
        console.log("funcParseXMLConstituentUDF ERROR: Returned data doesn't match.  globalIdSVSEF: " + globalIdSVSEF + " returned query id: " + resNode.childNodes[i].getAttribute("value"));
        funcSearchCleanup();
        return;
    }
    
    funcSetFieldsConstituentUDF(resNode);

    // Make sure all fields are ready for new-edits
    if (!funcCheckConstituentFormValidity())
    {   // A field is invalid and is highlighted in RED
        funcEnableChgConstituent();
    }   
    else
    {   // Make sure Update Btn is enabled/disabled appropriately
        funcEnableConstituentBtns();
    }

    funcSearchCleanup(true);
}

function funcParseXMLSetConstituent(resXMLDocument)
{
    // reset bSendNewConstituentEmail in case its info is stale
    bSendNewConstituentEmail = false;

    console.log("funcParseXMLSetConstituent: RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log("funcParseXMLSetConstituent ERROR: resXMLDocument is Null");
        return;
    }

    // Check to see if more than one record was returned
    var cntRecords = 0;
    if (resXMLDocument.getElementsByTagName("result") && 
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record") &&
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length)
        cntRecords = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length;

    if (cntRecords < 1)
    {
        console.log("funcParseXMLSetConstituent ERROR: cnt of XML records: " + cntRecords);
        return;
    }
        
    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];
    if (!resNode.hasChildNodes() || resNode.childNodes.length < 1)
    {
        console.log("funcParseXMLSetConstituent ERROR: <record> doesn't have children");
        return;
    }    

    // Grab globalIdSVSEF aka donor_id
    var errMsg = '';
    if (bNewConstituent)
    {   // A new SVSEF ID should have been obtained
        globalIdSVSEF = resNode.childNodes[0].getAttribute("value");
        bNewConstituent = false;
        bSendNewConstituentEmail = true;
    }
    else if ( (resNode.childNodes[0].getAttribute("value") != '0') && resNode.childNodes.length > 1)
    {
        errMsg = resNode.childNodes[1].textContent;
    }
           
    if (isEmpty(globalIdSVSEF) || !isEmpty(errMsg))
    {
        console.log("funcParseXMLSetConstituent ERROR: globalIdSVSEF not valid: " + globalIdSVSEF + " errMsg: " + errMsg);
        return;
    }

    document.getElementById("svsefID").value = globalIdSVSEF;

    funcSetFields2OrigArray();

    // Set up the Query String for the UDF WEBSITE Field
    var fields = [ ];
    fields[SAVEUDF_ID]      = globalIdSVSEF;
    fields[SAVEUDF_FIELD]   = "web";
    fields[SAVEUDF_TYPE]    = 'C';
    fields[SAVEUDF_CHARVALUE] = document.getElementById("svsefWebsite").value;
    fields[SAVEUDF_DATEVALUE] = "";
    fields[SAVEUDF_NUMVALUE] = "";
    fields[SAVEUDF_USERID] = remUserID;
     
    funcSetUDFConstituent(fields);
}

function funcParseXMLSetConstituentUDF(resXMLDocument)
{
    funcParseNVerifyID(resXMLDocument, "funcParseXMLSetConstituentUDF");

    funcSetFlagConstituent("GAMEDINNER"); 

    // This function is only be called for the WEBSITE field
    // if it's ever called for additional fields, the below
    // logic will need to change.
    funcSendNewConstituentEmail();
}

function funcParseXMLSetFlagConstituent(resXMLDocument)
{
    funcParseNVerifyID(resXMLDocument, "funcParseXMLSetFlagConstituent");
}

function funcParseNVerifyID(resXMLDocument, strParent)
{
    console.log(strParent + ": RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log(strParent + " ERROR: resXMLDocument is Null");
        return;
    }

    // Check to see if more than one record was returned
    var cntRecords = 0;
    if (resXMLDocument.getElementsByTagName("result") && 
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record") &&
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length)
        cntRecords = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length;

    if (cntRecords < 1)
    {
        console.log(strParent + " ERROR: cnt of XML records: " + cntRecords);
        return;
    }

    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];
    if (!resNode.hasChildNodes() || resNode.childNodes.length < 1)
    {
        console.log(strParent + " ERROR: <record> doesn't have children");
        return;
    }   

    // Verify that the ID returned is the same as our 
    if (globalIdSVSEF != resNode.childNodes[0].getAttribute("value"))
    {
        console.log(strParent + " ERROR: returned record: " + resNode.childNodes[0].getAttribute("value") + " svsefID: " +  globalIdSVSEF);
        if (resNode.childNodes.length > 1)
        {
            errMsg = resNode.childNodes[1].textContent;
            console.log(strParent + " ERROR: errMsg: " + errMsg);
        }
    }    
}

function funcLoadMultiSearchForm(resXMLDocument)
{
    // Check to see if more than one record was returned
    var cntRecords = 0;
    if (resXMLDocument.getElementsByTagName("result") && 
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record") &&
        resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length)
        cntRecords = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record").length;

    if (cntRecords <= 1)
    {
        console.log("funcLoadMultiSearchForm ERROR: cnt of XML records: " + cntRecords);
        return;
    }

    // Loop through each node and set them to a List Item (Note:  Max of IX_MULTISEARCH_LAST)
    for (var i = 0; i < cntRecords && i < IX_MULTISEARCH_LAST; ++i)
    {
        var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[i];
    
        var svsefID = "";
        var svsefLastName = "";
        var svsefFirstName = "";

        // Grab each elements search information
        for (var j = 0; j < resNode.childNodes.length; ++j)
        {
            var nodeID = resNode.childNodes[j].getAttribute("id");

            if (nodeID == "donor_id")
                svsefID = resNode.childNodes[j].getAttribute("value");
            else if (nodeID == "first_name")
                svsefFirstName = resNode.childNodes[j].getAttribute("value");
            else if (nodeID == "last_name")
                svsefLastName = resNode.childNodes[j].getAttribute("value");  
        }

        gArrayMultiSearchIds[i] = svsefID;

        var sInnerHTML = "";
        if (!isEmpty(svsefLastName) && !isEmpty(svsefFirstName))
            sInnerHTML += svsefLastName + ", " + svsefFirstName;
        else if (!isEmpty(svsefLastName))
            sInnerHTML += svsefLastName;
        else if (!isEmpty(svsefFirstName))
            sInnerHTML += svsefFirstName;
        
        if (!isEmpty(sInnerHTML))
            sInnerHTML += " ";

        sInnerHTML +=  "(" + svsefID + ")";

        funcSetSearchListItem(i, sInnerHTML);
    }
    
    // Enable the Multi Search Form
    funcEnableMultiSearch();
}



