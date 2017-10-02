<?php 
// PHP Connecting to GMAIL service
// and sending HTML Message
// when a New Gift has been Added
//
// Author: Gina McLaren
// July 15, 2017
//

header("Content-type: text/xml");

require_once 'AuthGmail.php';

$params = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
parse_str($params);
$server_name = $_SERVER['SERVER_NAME'];

$fname = "SVSEF Events";
$subject = "Uploaded Logo from $lastname (SVSEF ID $svsefID)";

$body = "<!DOCTYPE HTML>" .
                "<html lang=\"en-US\">" .
                "<head>" .
                    "<meta http-equiv=\"Content-Type\" content=\"text/xml\">" .
                    "<meta charset='utf-8'>" .
                "</head>" .
                "<body>" .
                    "<table>" .  
                        "<tr>" . 
                            "<td style=\"font-size:18px;font-weight:bold;padding-left:10\">$subject</td>" .
                        "</tr>" . 
                    "</table>" .
                    "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" . 
                        "Here's a logo uploaded from Constituent:" . 
                    "</p>" .
                    "<table style=\"font-size:18px\">" .
                        "<tr>" .
                            "<td align=\"right\" style=\"padding-right:20px\">SVSEF ID</td><td>$svsefID</td>" .
                        "</tr>" .
                        "<tr>" .
                            "<td align=\"right\" style=\"padding-right:20px\">Organization/Last Name</td><td>$lastname</td>" .
                        "</tr>" .
                        "<tr>" .
                            "<td align=\"right\" style=\"padding-right:20px\">First Name</td><td>$firstname</td>" .
                        "</tr>" .
                    "</table>" . 
                "</body>" .
                "</html>";

if ($server_name == 'localhost')
{   // Running at home
    $arrTo = array(
                /*array('email' => "jody@svsef.org", 'name' => "Jody Zarkos"),*/
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}
else
{
    $arrTo = array(array('email' => "jody@svsef.org", 'name' => "Jody Zarkos"),
                array('email' => "jseyferth@svsef.org", 'name' => "Julia Seyferth"),
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}

$arrXML = funcSendEmail($arrTo, $fname, $subject, $body, null, $attachFileName);

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