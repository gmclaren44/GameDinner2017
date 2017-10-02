// Web Proxy for DonorPerfect Database Server 
// Responds to HTTP GET requests
//
// Author: Gina McLaren
// June 15, 2017
//

if (window.location.hostname == "localhost")
    var proxyURL = "http://localhost/GameDinner2017/DP_PHP.php";
else  // Running on SVSEF Server
    var proxyURL = "https://svsef.org/GameDinner2017/DP_PHP.php";
    

function getDPXML(params, callback) 
{
    var errString = null;

/*
    if (acceptedURL.localeCompare(url) != 0)
    {
        resXMLDocument = null; 
        errString = "getDPXML() ERROR: Not an accepted url(" + url + ")";
        console.log(errString);
        return(errString);
    }
*/

    // The full path + params to the PHP proxy
    var url = proxyURL +  "?" + params;
    console.log("getDPXML() Defined URL: " + url);

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
                    console.log(xhr.responseText);

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
        console.log("getDPXML() with XDomainRequest");
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
        console.log("getDPXML() with ActiveXObject(Microsoft.XMLHTTP)");
        console.log("additional code/debug necessary");
    } 
}

