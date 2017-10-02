// Module to communicate with 
// DonorPerfect Database Server for
// the In-Kind Gift Data
//
// Author: Gina McLaren
// June 15, 2017
//

// Global DB Connection Information
var remUserID = "API Online Donation Form";
var globalIdGift =          0;

var GIFT_ID =               0;      // Numeric Field
var GIFT_DONORID =          1;      // Numeric Field
var GIFT_RECORDTYPE =       2;
var GIFT_DATE =             3;      // Get Today's Date
var GIFT_AMOUNT =           4;      // Numeric Field
var GIFT_GLCODE =           5;
var GIFT_SOLICITCODE =      6;
var GIFT_SUBSOLICITCODE =   7;
var GIFT_GIFTTYPE =         8;
var GIFT_SPLITGIFT =        9;
var GIFT_PLEDGEPAYMENT =    10;

var GIFT_FMV =              15;     // Numeric Field
var GIFT_BATCHNO =          16;     // Numeric Field
var GIFT_NARRATIVE =        17;     // Flag to prepend the Event Description

var GIFT_GLINK =            19;     // Numeric Field
var GIFT_PLINK =            20;     // Numeric Field
var GIFT_NOCALC =           21;
var GIFT_RECEIPT =          22;
var GIFT_OLDAMOUNT =        23;     // Numeric Field

var GIFT_CAMPAIGN =         25;

var GIFT_MEM_LINKID =       30;     // Numeric Field
var GIFT_ADDR_ID =          31;     // Numeric Field
var GIFT_LAST =             32;

var gGiftDefaultValues = [  null,
                            null,
                            "G",
                            "",
                            0.00,
                            "GAMEDINNER",
                            "GAMEDINNER2017",
                            "DONATION",
                            "IK",
                            "N",
                            "N" ];
gGiftDefaultValues[GIFT_BATCHNO] = 0; 
gGiftDefaultValues[GIFT_NOCALC] = "N";
gGiftDefaultValues[GIFT_RECEIPT] = "N";
gGiftDefaultValues[GIFT_CAMPAIGN] = "EVENTS";

//////////////////////////////////////////////////////////
// Global UDF Gift Fields
//////////////////////////////////////////////////////////
var GIFTUDF_IK_ITEMTYPE =           0;
var GIFTUDF_IK_RESTRICTIONS =       1;
var GIFTUDF_IK_EXPIRATION_DATE =    2;
var GIFTUDF_IK_DELIVERY =           3;
var GIFTUDF_IK_LOGO =               4;
var GIFTUDF_IK_CONTACT =            5;
var GIFTUDF_IK_RECOGNIZE_OTHER =    6;
var GIFTUDF_IK_RECOGNIZE_DESC =     7;
var GIFTUDF_GSOLIC =                8;
var GIFTUDF_CLASS =                 9;
var GIFTUDF_EVENTID =               10;
var GIFTUDF_LAST =                  11;


var gUDFGiftFields = [ ];
// UDF G_IK_ITEM_TYPE == 0
var newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_ITEM_TYPE",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftItemType",
                    checked_value:  function() { return(funcGetCheckedValue(GIFTUDF_IK_ITEMTYPE)); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_ItemType(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);

// UDF G_IK_RESTRICTIONS == 1
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_RESTRICTIONS",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftRestrictions",
                    checked_value:  function() { return(null); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Restrictions(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField); 

// UDF G_IK_EXPIRATION_DATE == 2
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_EXPIRATION_DATE",
                    udf_type:       'D',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftExpirationDate",
                    checked_value:  function() { return(null); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_ExpirationDate(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField); 

// UDF G_IK_DELIVERY == 3
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_DELIVERY",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftDelivery",
                    checked_value:  function() { return(funcGetCheckedValue(GIFTUDF_IK_DELIVERY)); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Delivery(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField); 

// UDF G_IK_LOGO == 4
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_LOGO",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftLogo",
                    checked_value:  function() { return(funcGetCheckedValue(GIFTUDF_IK_LOGO)); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Logo(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField); 

// UDF G_IK_CONTACT == 5
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_CONTACT",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftContact",
                    checked_value:  function() { return(null); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Contact(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);

// UDF G_IK_RECOGNIZE_OTHER == 6
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_RECOGNIZE_OTHER",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftRecognizeOther",
                    checked_value:  function() { return(null); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_RecognizeOther(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);

// UDF G_IK_RECOGNIZE_DESC == 7
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_RECOGNIZE_DESC",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftOtherDesc",
                    checked_value:  function() { return(null); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_RecognizeDesc(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);

// UDF GIFTUDF_GSOLIC == 8
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "GSOLIC",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: null,
                    checked_value:  function() { return(null); },
                    value:          "JODYZARKOS",
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_GSolic(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);

// UDF GIFTUDF_CLASS == 9
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "CLASS",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: null,
                    checked_value:  function() { return(null); },
                    value:          "ADMIN",
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Class(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);

// UDF GIFTUDF_EVENTID == 10
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "EVENT_ID",
                    udf_type:       'N',
                    pre_fieldvalue: "",
                    form_fieldname: null,
                    checked_value:  function() { return(null); },
                    value:          5,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_EventID(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);


////////////////////////////////////////////////////////////////////////////
// Function Calls to Get/Set GIFT Data from Donor Perfect Web Service
////////////////////////////////////////////////////////////////////////////

function funcSetGift() 
{
    var remAction = "dp_savegift";
    // params=@gift_id,@donor_id,@record_type,@gift_date,@amount,@gl_code,
    //      @solicit_code,@sub_solicit_code,@gift_type,@split_gift,@pledge_payment,@reference,
    //      @memory_honor,@gfname,@glname,@fmv,@batch_no,@gift_narrative,
    //      @ty_letter_no,@glink,@plink,@nocalc,@receipt,@old_amount,@user_id,
    //      @campaign,@membership_type,@membership_level,@membership_enr_date, 
    //      @membership_exp_date,@membership_link_ID @address_id
    var fields = ["", "svsefID", GIFT_RECORDTYPE, GIFT_DATE,GIFT_AMOUNT,GIFT_GLCODE,
                GIFT_SOLICITCODE, GIFT_SUBSOLICITCODE, GIFT_GIFTTYPE, GIFT_SPLITGIFT, GIFT_PLEDGEPAYMENT, "",
                "", "", "", "svgftValue", GIFT_BATCHNO, "svgftDescription",
                "", "", "", GIFT_NOCALC, GIFT_RECEIPT, "", remUserID, 
                GIFT_CAMPAIGN, "","","",
                "","",""];   

    //Build the param list
    // Ex:  https://ZZZ/xmlrequest.asp?action=dp_savegift&
    //      login=xxx&pass=yyy&params=0,9256,'G','06/12/2017',0.00,
    //      'GAMEDINNER','GAMEDINNER2017','DONATION','IK','N','N',null,null,null,
    //      null,100,0,'2017-11-18 2017 Wild West Game Dinner donation: Red Shoes sz 12',
    //      null,null,null,'N','N',null,'API Online Donation Form','EVENTS',null,null,null,
    //      null,null,null
    //
    //      &login=xxx&pass=yyy   will be appended within PHP code

    var params = "action=" + remAction;
    params += "&params=";

    for (var i = 0; i < fields.length - 1; i++) 
    {
        if (i > 0)
            params += ",";

        var val = null;
        if (!isEmpty(fields[i]) && fields[i] == GIFT_DATE)
            val = getTodaysDate();
        else if (!isEmpty(fields[i]) && 
            (   (fields[i] == GIFT_RECORDTYPE) ||
                (fields[i] == GIFT_AMOUNT) ||
                (fields[i] == GIFT_GLCODE) ||
                (fields[i] == GIFT_SOLICITCODE) ||
                (fields[i] == GIFT_SUBSOLICITCODE) ||
                (fields[i] == GIFT_GIFTTYPE) ||
                (fields[i] == GIFT_SPLITGIFT) ||
                (fields[i] == GIFT_PLEDGEPAYMENT) ||
                (fields[i] == GIFT_BATCHNO) ||
                (fields[i] == GIFT_NOCALC) ||
                (fields[i] == GIFT_RECEIPT) ||
                (fields[i] == GIFT_CAMPAIGN) ))
        {    
            val = gGiftDefaultValues[fields[i]];
        }
        else if (!isEmpty(fields[i]) && (fields[i] == remUserID))
            val = remUserID;    // Specifying Online Form as @user_id
        else if (fields[i] == "svgftValue")
            val = funcStripCommas(funcStripDollarSign(document.getElementById(fields[i]).value)); // Currency needs to be straight numerical
        else if (fields[i] == "svsefID")
            val = funcGetSVSEFID();
        else if (!isEmpty(fields[i]))
            val = document.getElementById(fields[i]).value;


        if (i == 0 && isEmpty(val))
        {
            params += "0";          // New Gift being Added
        }   
        else if ( (!isEmpty(val) || val == 0) && isGiftFieldNumeric(i) )
            params += val;          // Numeric Fields, not in quotes
        else if (!isEmpty(val))  
            params += "'" + funcEscapeQuotes(val) + "'";
        else
            params += "null"; 
    } 

    console.log("funcSetGift: query = " + params);
    getDPXML(params, funcParseXMLSetGift);

}

function funcSetAllUDF4Gift()
{
    var params = "";
    for (var i= 0; i < gUDFGiftFields.length; ++i)
    {
        params = funcSetUDFparamsWObj(gUDFGiftFields[i]);
        console.log("funcSetAllUDF4Gift: query = " + params);
        getDPXML(params, gUDFGiftFields[i].callback);
    }
    
}

newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "G_IK_LOGO",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: "svgftLogo",
                    checked_value:  function() { return(funcGetCheckedValue(GIFTUDF_IK_LOGO)); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Logo(resXMLDocument); }
                };
                
function funcSetUDFparamsWObj(field)
{
    var remAction = "dp_save_udf_xml";
    // params=@donor_id || @gift_id,@field_name,@data_type,@char_value,@date_value,@number_value,@user_id
     
    //Build the param list
    //Ex: https://ZZZ/xmlrequest.asp?action=dp_save_udf_xml
    //  &login=xxx &pass=yyy&params=16013,'WEB','C','www.svsef.org',null,null,'API User'
    //
    //  &login=xxx&pass=yyy  will be appended within PHP code

    var params = "action=" + remAction;
    params += "&params=" + field.udf_id + ",'" + field.udf_fieldname + "','" + field.udf_type + "',";

    if (field.udf_type == 'C')  // Charset Data
    {
        var storeChar = field.value;
        if (!isEmpty(field.form_fieldname))
        {
            storeChar = field.checked_value();
            if ( field.udf_fieldname == "G_IK_LOGO" && ((storeChar == 'YwUPLOAD') || (storeChar == 'YwDELAY')) )
                storeChar = 'Y';

            if (isEmpty(storeChar))
                storeChar = field.pre_fieldvalue + funcEscapeQuotes(document.getElementById(field.form_fieldname).value);      
        }
            
        params += "'" + storeChar + "',null,null,";
    }
    else if (field.udf_type == 'D')  // Date Data
    {
        var strDate = field.value;
        if (!isEmpty(field.form_fieldname))
            strDate = document.getElementById(field.form_fieldname).value;

        if (!isEmpty(strDate))
        {
            var storeDate = new Date(strDate);
            var dd = storeDate.getDate()+1; // The 1st is 0!
            var mm = storeDate.getMonth()+1; //January is 0!
            var yyyy = storeDate.getFullYear();

            storeDate = mm + "/" + dd + "/" + yyyy;
            params += "null,'" + storeDate + "',null,"
        }
        else
            params += "null,null,null,";
    }
    else if (field.udf_type == 'N') // Numeric Data
    {
        var storeNum = field.value;
        if (!isEmpty(field.form_fieldname))
            storeNum = document.getElementById(field.form_fieldname).value;
        params += "null,null," + storeNum + ",";
    }
    else
    {
        params += "null,null,null,";
    }

    params += "'" + remUserID + "'";
    
    return(params);
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

function funcSet_GiftIDinArray()
{
    if (isEmpty(globalIdGift) || globalIdGift == 0)
    {
        console.log("funcSet_GiftIDinArray ERROR: globalIdGift is not set - " + globalIdGift);
        return;
    }

    for (var i= 0; i < gUDFGiftFields.length; ++i)
    {
        gUDFGiftFields[i].udf_id = globalIdGift;
    }
}

function funcGetCheckedValue(index)
{
    var fieldModified = document.getElementsByName(gUDFGiftFields[index].form_fieldname);
    
    for (var i = 0;  i < fieldModified.length; ++i)
    {
        if (fieldModified[i].checked || fieldModified[i].selected)
            return(fieldModified[i].value);
    }
    
    return(null);
}

function funcGetDonationDesc()
{
    var strDonation;
    var a = document.getElementById("svgftDescription").value;
    var b = document.getElementById("svgftValue").value;
    strDonation = a + " (Value: $" + funcStripDollarSign(b) + ")";
    return(strDonation);
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

///////////////////////////////////////////////////////////////////////
// Callback Functions to Parse GIFT XML returned by Donor Perfect Web Service
///////////////////////////////////////////////////////////////////////

function funcParseXMLSetGift(resXMLDocument)
{
    console.log("funcParseXMLSetGift: RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log("funcParseXMLSetGift ERROR: resXMLDocument is Null");
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
        console.log("funcParseXMLSetGift ERROR: cnt of XML records: " + cntRecords);
        console.log("funcParseXMLSetGift ERROR: " + resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("error")[0].textContent);
        return;
    }
        
    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];
    if (!resNode.hasChildNodes() || resNode.childNodes.length < 1)
    {
        console.log("funcParseXMLSetGift ERROR: <record> doesn't have children");
        console.log("funcParseXMLSetGift ERROR: " + resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("error")[0].textContent);
        return;
    }    

    // Grab globalIdGift aka gift_id
    var errMsg = '';
    globalIdGift = resNode.childNodes[0].getAttribute("value");
           
    if (isEmpty(globalIdGift) || globalIdGift == "0")
    {
        console.log("funcParseXMLSetGift ERROR: globalIdGift not valid: " + globalIdGift + " errMsg: " + resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("error")[0].textContent);
        return;
    }

    funcSet_GiftIDinArray();
    funcSetAllUDF4Gift();
}

function funcParseXMLGiftUDF_ItemType(resXMLDocument)
{
	var fieldObj = gUDFGiftFields[GIFTUDF_IK_ITEMTYPE];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);		
}
function funcParseXMLGiftUDF_Restrictions(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_IK_RESTRICTIONS];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);
}
function funcParseXMLGiftUDF_ExpirationDate(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_IK_EXPIRATION_DATE];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);
}
function funcParseXMLGiftUDF_Delivery(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_IK_DELIVERY];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);
}
function funcParseXMLGiftUDF_Logo(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_IK_LOGO];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);
}
function funcParseXMLGiftUDF_Contact(resXMLDocument)
{
	var fieldObj = gUDFGiftFields[GIFTUDF_IK_CONTACT];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);	
}
function funcParseXMLGiftUDF_RecognizeOther(resXMLDocument)
{
	var fieldObj = gUDFGiftFields[GIFTUDF_IK_RECOGNIZE_OTHER];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);	
}
function funcParseXMLGiftUDF_RecognizeDesc(resXMLDocument)
{
	var fieldObj = gUDFGiftFields[GIFTUDF_IK_RECOGNIZE_DESC];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);	
}
function funcParseXMLGiftUDF_GSolic(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_GSOLIC];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);
}
function funcParseXMLGiftUDF_Class(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_CLASS];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj);    
}
function funcParseXMLGiftUDF_EventID(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_EVENTID];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj); 

    // The final field results were parsed
    // so let's show the appreciation message
    funcShowThankYou();   
}



function funcParseXMLGiftUDF(resXMLDocument, fieldObj)
{
    console.log("funcParseXMLGiftUDF: RESPONSEXML");
    console.log(resXMLDocument);
    funcReportFieldInfo(fieldObj);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log("funcParseXMLGiftUDF ERROR: resXMLDocument is Null");
        funcReportFieldInfo(fieldObj);

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
        console.log("funcParseXMLGiftUDF ERROR: cnt of XML records: " + cntRecords);
        funcReportFieldInfo(fieldObj);
        return;
    }

    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];
    if (!resNode.hasChildNodes() || resNode.childNodes.length < 1)
    {
        console.log("funcParseXMLGiftUDF ERROR: <record> doesn't have children");
        funcReportFieldInfo(fieldObj);
        return;
    }   

    // Verify that the ID returned is the same as ours 
    if (globalIdGift != resNode.childNodes[0].getAttribute("value"))
    {
        console.log("funcParseXMLGiftUDF ERROR: returned record: " + resNode.childNodes[0].getAttribute("value") + " GIFT_ID: " +  globalIdGift);
        funcReportFieldInfo(fieldObj);
    
        if (resNode.childNodes.length > 1)
        {
            errMsg = resNode.childNodes[1].textContent;
            console.log("funcParseXMLGiftUDF ERROR: errMsg: " + errMsg);
        }

    }
}

function funcReportFieldInfo(fieldObj)
{
    var val = fieldObj.value;
    if (!isEmpty(fieldObj.form_fieldname))
    {
        val = fieldObj.checked_value();
        if (isEmpty(val))
            val = document.getElementById(fieldObj.form_fieldname).value;
    }
        
    console.log("FYI! GIFT_ID: " + fieldObj.udf_id + " FIELD: " + fieldObj.udf_fieldname + " was set to the following VALUE: " + val);
}

