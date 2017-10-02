// Module to communicate with 
// DonorPerfect Database Server for
// the In-Kind Gift Data
//
// Author: Gina McLaren
// Sept 10, 2017
//

// Global DB Connection Information
var remUserID = "API Online Registration Form";
var globalIdGift =          0;
var globalBPledge =         false;

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
var GIFT_REFERENCE =        11;

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
                            "G",    // Gift Records
                            "",
                            0.00,
                            "GAMEDINNER",
                            "GAMEDINNER2017",
                            "",
                            "CK",
                            "N",
                            "N" ];
gGiftDefaultValues[GIFT_BATCHNO] = 0; 
gGiftDefaultValues[GIFT_NOCALC] = "N";
gGiftDefaultValues[GIFT_RECEIPT] = "N";
gGiftDefaultValues[GIFT_CAMPAIGN] = "EVENTS";

//////////////////////////////////////////////////////////
// Global UDF Gift Fields
//////////////////////////////////////////////////////////
var GIFTUDF_GSOLIC =                0;
var GIFTUDF_CLASS =                 1;
var GIFTUDF_TRANSID =               2;
//var GIFTUDF_EVENTID =             2;
var GIFTUDF_LAST =                  3;

var gUDFGiftFields = [ ];

// UDF GIFTUDF_GSOLIC == 0
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

// UDF GIFTUDF_CLASS == 1
newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "CLASS",
                    udf_type:       'C',
                    pre_fieldvalue: "",
                    form_fieldname: null,
                    checked_value:  function() { return(null); },
                    value:          "DEVELOPMENT",
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Class(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);

// UDF GIFTUDF_TRANSID == 2

newGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "TRANSACTION_ID",
                    udf_type:       'CU',    // Char Value with an UPDATE QUERY
                    pre_fieldvalue: "",
                    form_fieldname: null,
                    checked_value:  function() { return(null); },
                    value:          null,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_TransID(resXMLDocument); }
                    };
gUDFGiftFields.push(newGiftField);


// UDF GIFTUDF_FREQ
freqGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "FREQUENCY",
                    udf_type:       'CU',    // Char Value with an UPDATE QUERY
                    pre_fieldvalue: "",
                    form_fieldname: null,
                    checked_value:  function() { return(null); },
                    value:          "U",
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Frequency(resXMLDocument); }
                };

// UDF GIFTUDF_TOTAL
totalGiftField = {udf_id:         globalIdGift,
                    udf_fieldname:  "TOTAL",
                    udf_type:       'NU',    // Numeric Value with an UPDATE QUERY
                    pre_fieldvalue: "",
                    form_fieldname: null,
                    checked_value:  function() { return(null); },
                    value:          0,
                    callback:       function(resXMLDocument) { funcParseXMLGiftUDF_Total(resXMLDocument); }
                };

//////////////////////////////////////////////////////////
// Global CC Vault Fields (in UDF Table)
//////////////////////////////////////////////////////////
var gCCVaultFields  = [ ];
var SS_VAULTID_LEN  = 10;
var SS_CCNO_LEN     = 7;
var SS_CCEXP_LEN    = 8;
var SS_CCCVV_LEN    = 8;
var SS_CCZIP_LEN    = 8;      

CC1 = {     svsefID:    0,
            ss_vaultid: null,
            ss_ccno:    null,
            ss_ccexp:   null,
            ss_cccvv:   null,
            ss_cczip:   null,
            ss_preferred:   -1 };
gCCVaultFields.push(CC1);

CC2 = {     svsefID:    0,
            ss_vaultid: null,
            ss_ccno:    null,
            ss_ccexp:   null,
            ss_cccvv:   null,
            ss_cczip:   null,
            ss_preferred:   -1 };
gCCVaultFields.push(CC2);

CC3 = {     svsefID:    0,
            ss_vaultid: null,
            ss_ccno:    null,
            ss_ccexp:   null,
            ss_cccvv:   null,
            ss_cczip:   null,
            ss_preferred:   -1 };
gCCVaultFields.push(CC3);

CC4 = {     svsefID:    0,
            ss_vaultid: null,
            ss_ccno:    null,
            ss_ccexp:   null,
            ss_cccvv:   null,
            ss_cczip:   null,
            ss_preferred:   -1 };
gCCVaultFields.push(CC4);

CC5 = {     svsefID:    0,
            ss_vaultid: null,
            ss_ccno:    null,
            ss_ccexp:   null,
            ss_cccvv:   null,
            ss_cczip:   null,
            ss_preferred:   -1 };
gCCVaultFields.push(CC5);
                
////////////////////////////////////////////////////////////////////////////
// Function Calls to Get/Set GIFT Data from Donor Perfect Web Service
////////////////////////////////////////////////////////////////////////////

function funcSetGift(iGIFT_AMOUNT, strGIFT_SUBSOLICITCODE, strGIFT_REFERENCE, iGIFT_FMV, strGIFT_NARRATIVE, bPledge = false) 
{
    var remAction = "dp_savegift";
    // params=@gift_id,@donor_id,@record_type,@gift_date,@amount,@gl_code,
    //      @solicit_code,@sub_solicit_code,@gift_type,@split_gift,@pledge_payment,@reference,
    //      @memory_honor,@gfname,@glname,@fmv,@batch_no,@gift_narrative,
    //      @ty_letter_no,@glink,@plink,@nocalc,@receipt,@old_amount,@user_id,
    //      @campaign,@membership_type,@membership_level,@membership_enr_date, 
    //      @membership_exp_date,@membership_link_ID, @address_id
    var fields = ["", "svsefID", GIFT_RECORDTYPE, GIFT_DATE,iGIFT_AMOUNT,GIFT_GLCODE,
                GIFT_SOLICITCODE, strGIFT_SUBSOLICITCODE, GIFT_GIFTTYPE, GIFT_SPLITGIFT, GIFT_PLEDGEPAYMENT, strGIFT_REFERENCE,
                "", "", "", iGIFT_FMV, GIFT_BATCHNO, strGIFT_NARRATIVE,
                "", "", "", GIFT_NOCALC, GIFT_RECEIPT, "", remUserID, 
                GIFT_CAMPAIGN, "","","",
                "","",""]; 
    // Is this a Pledge?
    globalBPledge = bPledge; 
    if (bPledge)
    {
        totalGiftField.value = iGIFT_AMOUNT;
    }

    //Build the param list
    // Ex:  https://ZZZ/xmlrequest.asp?action=dp_savegift&
    //      login=xxx&pass=yyy&params=0,9256,'G','06/12/2017',150.00,
    //      'GAMEDINNER','GAMEDINNER2017','DINNER_TIX','CK','N','N','Visa XXXX-XXXX-XXXX-3716',null,null,
    //      null,80,0,'(1) Dinner Ticket @ $150.00/Unit',
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
        else if ( (i == GIFT_AMOUNT) ||
                (i == GIFT_SUBSOLICITCODE) ||
                (i == GIFT_REFERENCE) ||
                (i == GIFT_FMV) ||
                (i == GIFT_NARRATIVE) )
        {
           val = fields[i]; 
        }
        else if (!isEmpty(fields[i]) && 
               ((fields[i] == GIFT_RECORDTYPE && !bPledge) ||
                (fields[i] == GIFT_GLCODE) ||
                (fields[i] == GIFT_SOLICITCODE) ||
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
        else if (fields[i] == GIFT_RECORDTYPE && bPledge)
            val = "P";  // Pledge records
        else if (!isEmpty(fields[i]) && (fields[i] == remUserID))
            val = remUserID;    // Specifying Online Form as @user_id
        else if (fields[i] == "svsefID")
            val = funcGetRegSVSEFID(true);

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

function funcSetUDFparamsWObj(field)
{
    var remAction = null;
    var params = null;

    if (field.udf_type == 'CU')
    {   // UPDATE QUERY with Char Data
        remAction = "UPDATE DPGIFT SET [" + field.udf_fieldname + "] = '" + field.value + "' WHERE GIFT_ID = " + field.udf_id;
        params = "action=" + remAction;
    }
    else if (field.udf_type == 'NU')
    {   // UPDATE QUERY with Numeric Data
        remAction = "UPDATE DPGIFT SET [" + field.udf_fieldname + "] = " + field.value + " WHERE GIFT_ID = " + field.udf_id;
        params = "action=" + remAction;
    }
    else
    {
        // params=@donor_id || @gift_id,@field_name,@data_type,@char_value,@date_value,@number_value,@user_id
        
        //Build the param list
        //Ex: https://ZZZ/xmlrequest.asp?action=dp_save_udf_xml
        //  &login=xxx &pass=yyy&params=16013,'WEB','C','www.svsef.org',null,null,'API User'
        //
        //  &login=xxx&pass=yyy  will be appended within PHP code
        remAction = "dp_save_udf_xml";
        params = "action=" + remAction;
        params += "&params=" + field.udf_id + ",'" + field.udf_fieldname + "','" + field.udf_type + "',";

        if (field.udf_type == 'C')  // Charset Data
        {
            var storeChar = field.value;    
            params += "'" + storeChar + "',null,null,";
        }
        else if (field.udf_type == 'D')  // Date Data
        {
            var strDate = field.value;
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
            params += "null,null," + storeNum + ",";
        }
        else
        {
            params += "null,null,null,";
        }

        params += "'" + remUserID + "'";
    }
    
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

    freqGiftField.udf_id = globalIdGift;
    totalGiftField.udf_id = globalIdGift;
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
function funcParseXMLGiftUDF_TransID(resXMLDocument)
{
    var fieldObj = gUDFGiftFields[GIFTUDF_TRANSID];
	funcParseXMLGiftUDF(resXMLDocument, fieldObj); 

    if (!globalBPledge)
    {   // Pause and Download Next Gift
        window.setTimeout(funcDownloadNextGiftORPledge, 500);
    }
    else
    {   // This is a Pledge, so set FREQUENCY field
        var params = funcSetUDFparamsWObj(freqGiftField);
        console.log("funcSetAllUDF4Gift: query = " + params);
        getDPXML(params, freqGiftField.callback);
    }
}
function funcParseXMLGiftUDF_Frequency(resXMLDocument)
{
    var fieldObj = freqGiftField;
	funcParseXMLGiftUDF(resXMLDocument, fieldObj); 

    // UPDATE [TOTAL] field
    var params = funcSetUDFparamsWObj(totalGiftField);
    console.log("funcSetAllUDF4Gift: query = " + params);
    getDPXML(params, totalGiftField.callback);
}
function funcParseXMLGiftUDF_Total(resXMLDocument)
{
    var fieldObj = totalGiftField;
	funcParseXMLGiftUDF(resXMLDocument, fieldObj); 

    // Pause and Download Next Pledge
    window.setTimeout(funcDownloadNextGiftORPledge, 500);
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


////////////////////////////////////////////////////////////////////////////
// Function Calls to Get/Set CC Vault Data from Donor Perfect Web Service
////////////////////////////////////////////////////////////////////////////

function funcGetCCVaultInfo()
{
    var remAction = "SELECT  SS_VAULTID_1, SS_CCNO_1, SS_CCEXP_1, SS_CCCVV_1, SS_CCZIP_1, " +
                            "SS_VAULTID_2, SS_CCNO_2, SS_CCEXP_2, SS_CCCVV_2, SS_CCZIP_2, " +
                            "SS_VAULTID_3, SS_CCNO_3, SS_CCEXP_3, SS_CCCVV_3, SS_CCZIP_3, " +
                            "SS_VAULTID_4, SS_CCNO_4, SS_CCEXP_4, SS_CCCVV_4, SS_CCZIP_4, " +
                            "SS_VAULTID_5, SS_CCNO_5, SS_CCEXP_5, SS_CCCVV_5, SS_CCZIP_5, " +
                            "SS_PREFERRED_CARD FROM DPUDF WHERE donor_id = " + funcGetRegSVSEFID(true);

    //Build the param list
    // Ex: https://ZZZ/xmlrequest.asp?login=xxx&pass=yyy&action=select ... (statement as defined above)
    //
    // login=xxx&pass=yyy  will be appended in server-side code

    var params = "action=" + remAction;
    
    console.log("funcGetCCVaultInfo: query = " + params);
    getDPXML(params, funcParseXMLCCVaultInfo);
}

function funcParseXMLCCVaultInfo(resXMLDocument)
{
    console.log("funcParseXMLCCVaultInfo: RESPONSEXML");
    console.log(resXMLDocument);
    
    // If no XML data was returned, then end this function
    if (resXMLDocument == null)
    {
        console.log("funcParseXMLCCVaultInfo ERROR: resXMLDocument is Null");
        funcCloseProgressDlg();
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
        console.log("funcParseXMLCCVaultInfo ERROR: cnt of XML records: " + cntRecords);
        funcCloseProgressDlg();
        return;
    }

    if (cntRecords > 1)
    {
        // How do we want to handle more than one record of CC data being returned? 
        // Currently the code will just use the first one (index 0) within the list.
    }
        
    // Determine Node for Filling Fields
    var resNode = resXMLDocument.getElementsByTagName("result")[0].getElementsByTagName("record")[0];

    if (resNode.hasChildNodes())
    {
        for (var i = 0; i < resNode.childNodes.length; ++i)
        {
            var nodeName = resNode.childNodes[i].getAttribute("id");
            if (nodeName.substr(0, SS_VAULTID_LEN) == "SS_VAULTID")
            {
                var idx = parseInt(nodeName.substr(SS_VAULTID_LEN + 1)) - 1;
                gCCVaultFields[idx].svsefID = funcGetRegSVSEFID();
                gCCVaultFields[idx].ss_vaultid = resNode.childNodes[i].getAttribute("value");
            }
            else if (nodeName.substr(0, SS_CCNO_LEN) == "SS_CCNO")
            {
                var idx = parseInt(nodeName.substr(SS_CCNO_LEN + 1)) - 1;
                gCCVaultFields[idx].ss_ccno = resNode.childNodes[i].getAttribute("value");
            }
            else if (nodeName.substr(0, SS_CCEXP_LEN) == "SS_CCEXP")
            {
                var idx = parseInt(nodeName.substr(SS_CCEXP_LEN + 1)) - 1;
                gCCVaultFields[idx].ss_ccexp = resNode.childNodes[i].getAttribute("value");
            }
            else if (nodeName.substr(0, SS_CCCVV_LEN) == "SS_CCCVV")
            {
                var idx = parseInt(nodeName.substr(SS_CCCVV_LEN + 1)) - 1;
                gCCVaultFields[idx].ss_cccvv = resNode.childNodes[i].getAttribute("value");
            }
            else if (nodeName.substr(0, SS_CCZIP_LEN) == "SS_CCZIP")
            {
                var idx = parseInt(nodeName.substr(SS_CCZIP_LEN + 1)) - 1;
                gCCVaultFields[idx].ss_cczip = resNode.childNodes[i].getAttribute("value");
            }
            else if (nodeName == "SS_PREFERRED_CARD")
            {
                gCCVaultFields[0].ss_preferred = resNode.childNodes[i].getAttribute("value");
            }
        }
    }

    funcSyncCCVaultInfo();
}

function funcSyncCCVaultInfo()
{
    var strCCType = window.sessionStorage.getItem("CCTYPE");
    var strCCNum = window.sessionStorage.getItem("CCNUM");
    if (isEmpty(strCCType) || isEmpty(strCCNum))
    {
        // Cleanup Gracefully
        funcCloseProgressDlg();
        return;
    }
    
    var strCCTypeNum = funcGetCCVaultTypeNum();
    var strCCExp = funcGet2DigitMonth() + funcGet2DigitYear();
    var strCCCVV = window.sessionStorage.getItem("CVVNUM");
    var strCCZip = window.sessionStorage.getItem("BILLING_ZIP");
        
    // First See *IF* the CC is already stored in the DB and return gracefully!
    for (var i = 0; i < gCCVaultFields.length; ++i)
    {
        if ( !isEmpty(gCCVaultFields[i].ss_vaultid) &&
                    (gCCVaultFields[i].ss_ccno == strCCTypeNum) &&
                    (gCCVaultFields[i].ss_ccexp == strCCExp) &&
                    (gCCVaultFields[i].ss_cccvv == strCCCVV) &&
                    (gCCVaultFields[i].ss_cczip == strCCZip) )
                    {
                        // CC is already in the DB w Vault ID
                        gCCVaultFields[0].ss_preferred = i + 1;
                        gidxCCVaultInfo = i; 
                        gstrVaultID = gCCVaultFields[i].ss_vaultid;
                        // Update the Vault Info as it 
                        // could be stale from last year
                        //funcContinueToReviewNSubmit();
                        funcPrepareNSubmitTransaction(true);
                        return;
                    }
    }

    gidxCCVaultInfo = -1; 
    // Second, See *IF* there's an entry in the DB that isn't being used yet.
    for (i = 0; i < gCCVaultFields.length; ++i)
    {
        if (isEmpty(gCCVaultFields[i].ss_vaultid))
        {
            // Open CC field in the DB
            gCCVaultFields[0].ss_preferred = i + 1;
            gidxCCVaultInfo = i; 
            break;
        }
    }

    if (gidxCCVaultInfo == -1)
    {
        gidxCCVaultInfo = 0;
        gCCVaultFields[0].ss_preferred = 1;
    }
    // See if the CC Info is in the Vault already
    funcLookupCCInVault();
}

function funcAddCCVaultInfo(gstrVaultID)
{
    var strCCTypeNum = funcGetCCVaultTypeNum();
    var strCCExp = funcGet2DigitMonth() + funcGet2DigitYear();
    var strCCCVV = window.sessionStorage.getItem("CVVNUM");
    var strCCZip = window.sessionStorage.getItem("BILLING_ZIP");
    var strSVSEFID = funcGetRegSVSEFID();

    var idx = (gidxCCVaultInfo >= 0 ? gidxCCVaultInfo + 1 : 1);

    // Example: https://www.donorperfect.net/prod/xmlrequest.asp?login=xxx&pass=yyy
    // &action= UPDATE DPUDF SET SS_VAULTID_1 = ‘XX’, SS_CCNO_1 = ‘VISA|2802’, SS_CCEXP_1 = ‘0120’, SS_CCCVV_1 = ‘623’, SS_CCZIP_1 = ‘83340’,  
    // SS_PREFERRED_CARD = ‘CCNO_1’ WHERE donor_id = YYY

    var params = "action=UPDATE DPUDF SET SS_VAULTID_" + idx + " = '" + gstrVaultID + "', " +
                                         "SS_CCNO_" + idx + " = '" + strCCTypeNum + "', " +
                                         "SS_CCEXP_" + idx + " = '" + strCCExp + "', " +
                                         "SS_CCCVV_" + idx + " = '" + strCCCVV + "', " +
                                         "SS_CCZIP_" + idx + " = '" + strCCZip + "', " +  
                                         "SS_PREFERRED_CARD = 'CCNO_" + idx + "' WHERE donor_id = " + strSVSEFID;
    
    
    console.log("funcAddCCVaultInfo: query = " + params);
    getDPXML(params, funcParseXMLAddCCVaultInfo);
}

function funcParseXMLAddCCVaultInfo(resXMLDocument)
{
    console.log("funcParseXMLAddCCVaultInfo: RESPONSEXML");
    console.log(resXMLDocument);
    
    // Set the Global Data Structure
    gCCVaultFields[gidxCCVaultInfo].svsefID = funcGetRegSVSEFID();
    gCCVaultFields[gidxCCVaultInfo].ss_vaultid = gstrVaultID;
    gCCVaultFields[gidxCCVaultInfo].ss_ccno = funcGetCCVaultTypeNum();
    gCCVaultFields[gidxCCVaultInfo].ss_ccexp = funcGet2DigitMonth() + funcGet2DigitYear();
    gCCVaultFields[gidxCCVaultInfo].ss_cccvv = window.sessionStorage.getItem("CVVNUM");
    gCCVaultFields[gidxCCVaultInfo].ss_cczip = window.sessionStorage.getItem("BILLING_ZIP");

    funcContinueToReviewNSubmit();
}









