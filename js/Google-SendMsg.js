// Module to handle sending
// an email through a gmail account
//
// Author: Gina McLaren
// July 6, 2017
//

// Global Email Settings
var EMAIL_CONSTITUENT_UPDATE    = 0;
var EMAIL_CONSTITUENT_ADD       = 1;
var EMAIL_GIFT_ADD              = 2;
var EMAIL_LOGO_ADD              = 3;
var EMAIL_REGISTRATION_ADD      = 4;
var EMAIL_REPORT_VAULT_ERR      = 5;
var EMAIL_REPORT_VAULT_ERR2     = 6;
var EMAIL_REPORT_TRANS_ERR      = 7;
var EMAIL_REPORT_TRANS_ERR2     = 8;

if (window.location.hostname == "localhost")
{
    var updateConstituentURL    = "http://localhost/GameDinner2017/GM_UpdateConstituent.php";
    var addConstituentURL       = "http://localhost/GameDinner2017/GM_AddConstituent.php";
    var addGiftURL              = "http://localhost/GameDinner2017/GM_AddGift.php";
    var addLogoURL              = "http://localhost/GameDinner2017/GM_AddLogo.php";
    var addRegistration         = "http://localhost/GameDinner2017/GM_AddRegistration.php";
    var reportVaultError        = "http://localhost/GameDinner2017/GM_ReportVaultError.php";
    var reportVaultError2       = "http://localhost/GameDinner2017/GM_ReportVaultError2.php";
    var reportTransError        = "http://localhost/GameDinner2017/GM_ReportTransactionError.php";
    var reportTransError2       = "http://localhost/GameDinner2017/GM_ReportTransactionError2.php";
}
else // Running on SVSEF Server  
{
    var updateConstituentURL    = "https://svsef.org/GameDinner2017/GM_UpdateConstituent.php";
    var addConstituentURL       = "https://svsef.org/GameDinner2017/GM_AddConstituent.php";
    var addGiftURL              = "https://svsef.org/GameDinner2017/GM_AddGift.php";
    var addLogoURL              = "https://svsef.org/GameDinner2017/GM_AddLogo.php";
    var addRegistration         = "https://svsef.org/GameDinner2017/GM_AddRegistration.php";
    var reportVaultError        = "https://svsef.org/GameDinner2017/GM_ReportVaultError.php";
    var reportVaultError2       = "https://svsef.org/GameDinner2017/GM_ReportVaultError2.php";
    var reportTransError        = "https://svsef.org/GameDinner2017/GM_ReportTransactionError.php";
    var reportTransError2       = "https://svsef.org/GameDinner2017/GM_ReportTransactionError2.php";
}

function sendEmail(strMsg, emailType, callback) 
{
    var errString = null;
    var url = null;

    if (emailType == EMAIL_CONSTITUENT_UPDATE)
        url = updateConstituentURL;
    else if (emailType == EMAIL_CONSTITUENT_ADD)
        url = addConstituentURL;
    else if (emailType == EMAIL_GIFT_ADD)
        url = addGiftURL;
    else if (emailType == EMAIL_LOGO_ADD)
        url = addLogoURL;
    else if (emailType == EMAIL_REGISTRATION_ADD)
        url = addRegistration;
    else if (emailType == EMAIL_REPORT_VAULT_ERR)
        url = reportVaultError;
    else if (emailType == EMAIL_REPORT_VAULT_ERR2)
        url = reportVaultError2;
    else if (emailType == EMAIL_REPORT_TRANS_ERR)
        url = reportTransError;
    else if (emailType == EMAIL_REPORT_TRANS_ERR2)
        url = reportTransError2;
    

    if (strMsg.length)
    {   // Make sure message is URL encoded
        url += "?" + strMsg;
    }
    console.log("sendEmail() Defined URL: " + url);

    if (window.XMLHttpRequest) 
    {
        // Code for the modern browser
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) 
        {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.onreadystatechange = function()
            {
                // Callback for when the readyState changes
                if (xhr.readyState == 4)
                {
                    console.log("RESPONSETEXT");
                    console.log(xhr.responseText.trim);

                    console.log("RESPONSEXML");
                    console.log(xhr.responseXML);

                    console.log("RESPONSE");
                    console.log(xhr.resResponse);

                    // Callback to handle the XML
                    callback(xhr.responseXML);
                }
            };

            xhr.open("GET", url, true); 
            xhr.send();
        } 
        else 
        {
            // Otherwise, CORS is not supported by the browser.
            console.log("CORS is not supported by the browser.");
            xhr = null;
        }
    }
    else if (window.XDomainRequest)
    {
        // Supports IE 8 and 9
        var xhr = new XDomainRequest(); // Create a new XDR object.
        console.log("sendEmail() with XDomainRequest");
        console.log("additional code/debug necessary");

        xhr.onload = function()
        {
            console.log("We received the XML");
            callback(xhr.responseText);
        };
        xhr.open("GET", url);
        xhr.send();
    } 
    else 
    {
        // Supports IE 5 and 6
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        console.log("sendEmail() with ActiveXObject(Microsoft.XMLHTTP)");
        console.log("additional code/debug necessary");
    } 
}















/**
 * Send Message.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 * @param  {Function} callback Function to call when the request is complete.
 */
function funcSendMessage(userId, email, callback) {
    // Using the js-base64 library for encoding:
    // https://www.npmjs.com/package/js-base64
    var base64EncodedEmail = Base64.encodeURI(email);
    var request = gapi.client.gmail.users.messages.send({'userId': userId,
                                                        'resource': {'raw': base64EncodedEmail},
                                                        'payload' : {'headers' : [ { 'To' : 'gmclaren44@gmail.com'} ] }
                                                       });
    request.execute(callback);
}

function funcSendMessageResults()
{
    window.alert("Made it into funcSendMessageResults!");

}