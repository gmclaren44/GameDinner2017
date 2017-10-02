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
$protocol_raw = $_SERVER['SERVER_PROTOCOL'];
$protocol = substr($protocol_raw, 0, strpos ($protocol_raw, "/"));
$host = $_SERVER['SERVER_NAME'];
$docroot = $_SERVER['DOCUMENT_ROOT'];

if ($host == 'localhost')
{
    $GDlogorootlocation = $docroot . "\\GameDinner2017\\images\\GDEmailLogo.jpg";
    $Jodylogolocation = $docroot . "\\GameDinner2017\\images\\JodySignTransparent.png";
} 
else
{
    $GDlogorootlocation = $docroot . "/GameDinner2017/images/GDTransparentWGray.png";
    $Jodylogolocation = $docroot . "/GameDinner2017/images/JodySignTransparent.png";
}
    

$fname = "SVSEF Events";
$subject = "Thank you for your donation!";

$body = "<!DOCTYPE HTML>" .
                "<html lang=\"en-US\">" .
                "<head>" .
                    "<meta http-equiv=\"Content-Type\" content=\"text/xml\">" .
                    "<meta charset='utf-8'>" .
                "</head>" .
                "<body>" .
                    "<table>" .  
                        "<tr>" . 
                            "<td><img height=\"100\" width=\"135\" src=\"cid:svsefGDIcon\" /></td><td style=\"font-size:18px;font-weight:bold;padding-left:10\">$subject</td>" .
                            /*"<td><img height=\"100\" width=\"135\" src=\"$GDlogolocation\" /></td><td style=\"font-size:18px;font-weight:bold;padding-left:10\">$subject</td>" .*/
                        "</tr>" . 
                    "</table>" .
                    "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" . 
                        "Thank you for your contribution to our 41st annual Wild West Game Dinner " .
                        "and your support of the Sun Valley Ski Education Foundation." . 
                    "</p>" .
                    "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" . 
                        "We appreciate your generous contribution:" . 
                    "</p>" .
                    "<p align=\"center\" margin-left=\"25%\" margin-right=\"25%\" style=\"font-size:18px;font-weight:bold\">" . 
                        "$donationDesc" .  
                    "</p>";
if ($needLogo == "true")
{
    $body .=        "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" . 
                        "If you need to send your logo, please attach and reply to this email." .  
                    "</p>";
}
else
{
    $body .=        "<br/>";
}

$body .=            "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" .
                        "Your generosity is greatly appreciated.<br/><br/><br/>" . 
                    "</p>" .
                    "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" .
                        "<img height=\"100\" width=\"135\" src=\"cid:jodyIcon\" /><br/>" . 
                        "Jody Zarkos<br/>" . 
                        "Sun Valley Ski Education Foundation<br/>" . 
                        "Director of Events and Community Relations<br/>" . 
                        "208.726.4129 ext. 102<br/><br/>" .  
                    "</p>" .
                    "<p align=\"center\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:14px\">" . 
                        "<i>SVSEF is a 501(c)3 non-profit organization.  Tax ID #82-0264946.</i>" . 
                    "</p>" .  
                "</body>" .
                "</html>";

if ($host == 'localhost')
{   // running at home
    $arrTo = array(array('email' => $sendToEmail, 'name' => $sendToName),
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                /*array('email' => "jody@svsef.org", 'name' => "Jody Zarkos"),*/
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}
else
{
    $arrTo = array(array('email' => $sendToEmail, 'name' => $sendToName),
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                array('email' => "jody@svsef.org", 'name' => "Jody Zarkos"),
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}

$arrEmbeddedImage = array(array('path' => $GDlogorootlocation, 'cid' => 'svsefGDIcon'),
                        array('path' => $Jodylogolocation, 'cid' => 'jodyIcon'));

$arrXML = funcSendEmail($arrTo, $fname, $subject, $body, $arrEmbeddedImage, null);

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