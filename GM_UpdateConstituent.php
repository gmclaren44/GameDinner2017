<?php 
// PHP Connecting to GMAIL service
// and sending HTML Message
// when a Constituent Demographic
// data has been Updated
//
// Author: Gina McLaren
// July 9, 2017
//

header("Content-type: text/xml");

require_once 'AuthGmail.php';

$params = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
parse_str($params);
$server_name = $_SERVER['SERVER_NAME'];

$fname = "SVSEF Events";
$subject = "DP Constituent Demographic Changes";

$body = "<!DOCTYPE HTML>" .
        "<html lang=\"en-US\">" .
        "<head>" .
            "<meta http-equiv=\"Content-Type\" content=\"text/xml\">" .
            "<meta charset='utf-8'>" .
        "</head>" .
        "<body>" .
            "<h2>DP Constituent Demographic Changes</h2>" .
            "<h3>SVSEF ID " . $svsefID . "</h3>" .
            "<table style=\"width:100%\" text-align=\"center\">" .
            "<tr>" .
                "<th align=\"right\" style=\"padding-right:20px\">Field Name</th><th align=\"left\">Original Data</th><th align=\"left\">Updated Data</th>" .
            "</tr>";

        if ( (strcasecmp($orgOrig, $orgNew) == 0) || ((strcasecmp($orgOrig, "Y") != 0) && (strcasecmp($orgNew, "Y") != 0)) )
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Organization Setting</td><td>" . ((strcasecmp($orgOrig, "Y") == 0) ? "&#10004;" : "") . "</td><td>" .  ((strcasecmp($orgNew, "Y") == 0) ? "&#10004;" : "") . "</td>";
$body .=    "</tr>";

        if (strcasecmp($lastnameOrig, $lastnameNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Organization/Last Name</td><td>$lastnameOrig</td><td>$lastnameNew</td>";
$body .=    "</tr>";

        if (strcasecmp($firstnameOrig, $firstnameNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">First Name</td><td>$firstnameOrig</td><td>$firstnameNew</td>";
$body .=    "</tr>";

        if (strcasecmp($addressOrig, $addressNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Mailing Address</td><td>$addressOrig</td><td>$addressNew</td>";
$body .=    "</tr>";

        if (strcasecmp($address2Orig, $address2New) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Mailing Address2</td><td>$address2Orig</td><td>$address2New</td>";
$body .=    "</tr>";

        if (strcasecmp($cityOrig, $cityNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">City</td><td>$cityOrig</td><td>$cityNew</td>";
$body .=    "</tr>";

        if (strcasecmp($stateOrig, $stateNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">State</td><td>$stateOrig</td><td>$stateNew</td>";
$body .=    "</tr>";

        if (strcasecmp($zipOrig, $zipNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Zip</td><td>$zipOrig</td><td>$zipNew</td>";
$body .=    "</tr>";

        if (strcasecmp($phoneOrig, $phoneNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Phone</td><td>$phoneOrig</td><td>$phoneNew</td>";
$body .=    "</tr>";

        if (strcasecmp($mobileOrig, $mobileNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Mobile</td><td>$mobileOrig</td><td>$mobileNew</td>";
$body .=    "</tr>";

        if (strcasecmp($emailOrig, $emailNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Email</td><td>$emailOrig</td><td>$emailNew</td>";
$body .=    "</tr>";

        if (strcasecmp($websiteOrig, $websiteNew) == 0)
$body .=    "<tr>";
        else
$body .=    "<tr style=\"background-color:#f1f1c1\">";
$body .=        "<td align=\"right\" style=\"padding-right:20px\">Website</td><td>$websiteOrig</td><td>$websiteNew</td>";
$body .=    "</tr>";

$body .=  "</table>" .
            "<br/><br/>" .
            "Kelly,<br/><br/>This constituent has UPDATED their information BUT it is <b>NOT</b> in DonorPerfect.  Please confirm it's valid information and update in DonorPerfect!<br/><br/>Thank you!" .
            "<p>" .
                "Gina McLaren<br/>" . 
                "cell (949) 212-8967<br/>" . 
                "gmclaren44@gmail.com<br/>" .   
            "</p>" .
            "</body>" .
            "</html>";

if ($server_name == 'localhost')
{   // Running at home
        $arrTo = array(
                /*array('email' => "kroberts@svsef.org", 'name' => "Kelly Roberts"),*/
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}
else
{
        $arrTo = array(array('email' => "kroberts@svsef.org", 'name' => "Kelly Roberts"),
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}

$arrXML = funcSendEmail($arrTo, $fname, $subject, $body, null, null);

for ($i = 0; $i < sizeof($arrXML); $i++)    
{
    if (!funcIsEmpty($arrXML[$i]))
        echo $arrXML[$i];
}


function funcIsEmpty($strData)
{
    if (isset($strData) == false || is_null($strData) == true || empty($strData) == true)
        return(true);

    return(false);
}

?>