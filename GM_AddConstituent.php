<?php 
// PHP Connecting to GMAIL service
// and sending HTML Message
// when a New Constituent has been Added
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
$subject = "New DP Constituent Added";

$body = "<!DOCTYPE HTML>" .
                "<html lang=\"en-US\">" .
                "<head>" .
                    "<meta http-equiv=\"Content-Type\" content=\"text/xml\">" .
                    "<meta charset='utf-8'>" .
                "</head>" .
                "<body>" .
                    "<h2>$subject</h2>" .
                    "<h3>SVSEF ID $svsefID</h3>" .
                    "<table style=\"width:100%\" text-align=\"center\">" .
                    "<tr>" .
                        "<th align=\"right\" style=\"padding-right:20px\">Field Name</th><th align=\"left\">New Data</th>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Organization Setting</td><td>" .  ((strcasecmp($orgNew, "Y") == 0) ? "&#10004;" : "") . "</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Organization/Last Name</td><td>$lastnameNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">First Name</td><td>$firstnameNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Mailing Address</td><td>$addressNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Mailing Address2</td><td>$address2New</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">City</td><td>$cityNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">State</td><td>$stateNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Zip</td><td>$zipNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Phone</td><td>$phoneNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Mobile</td><td>$mobileNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Email</td><td>$emailNew</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Website</td><td>$websiteNew</td>" .
                    "</tr>" .

                "</table>" .
                "<br/><br/>" .
                "Kelly,<br/><br/>This NEW constituent has been ADDED to DonorPerfect.  Please confirm it's valid information!<br/><br/>Thank you!" .
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