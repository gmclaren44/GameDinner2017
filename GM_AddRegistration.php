<?php 
// PHP Connecting to GMAIL service
// and sending HTML Message
// when a New Registration has been Completed
//
// Author: Gina McLaren
// September 7, 2017
//

$filename = null;
$linenum = null;

if (!headers_sent($filename, $linenum))
    header("Content-type: text/xml");
else 
{
    echo "Headers already sent in $filename : $linenum\n";
    exit;
}
    

require_once 'AuthGmail.php';

$params = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
parse_str($params);
$server_name = $_SERVER['SERVER_NAME'];
$docroot = $_SERVER['DOCUMENT_ROOT'];
// formatting the data
$gray = "#CBCBCB";
$blue = "#AAD2E4";

if ($server_name == 'localhost')
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
$subject = "2017 Wild West Game Dinner Registration";

if (strcmp($rsvp, 'Y') == 0)
    $strRSVP = "Yes, I/we would love to come";
else
    $strRSVP = "No, sorry I/we cannot make it, but we would like to support SVSEF";

$body = "<!DOCTYPE HTML>" .
                "<html lang=\"en-US\">" .
                "<head>" .
                    "<meta http-equiv=\"Content-Type\" content=\"text/xml\">" .
                    "<meta charset='utf-8'>" .
                "</head>" .
                "<body>" .
                    "<h2>$subject</h2>" .
                    "<table style=\"width:100%\" text-align=\"center\" >" .
                    "<tr>" . 
                            "<td><img height=\"100\" width=\"135\" src=\"cid:svsefGDIcon\" />" .
                    "</tr>" . 
                    "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">Name</th>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"left\" style=\"padding-left:25px\">$name</td>" .
                    "</tr>" .
                    "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">SVSEF ID</th>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"left\" style=\"padding-left:25px\">$svsefID</td>" .
                    "</tr>" .
                    "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">RSVP</th>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"left\" style=\"padding-left:25px\">$strRSVP</td>" .
                    "</tr>" .
                    "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">Email</th>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"left\" style=\"padding-left:25px\">$sendToEmail</td>" .
                    "</tr>" .
                    "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">Phone</th>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"left\" style=\"padding-left:25px\">$phone</td>" .
                    "</tr>";
                    
                    if (isset($gL) && strlen(trim($gL)) > 0)
                    {
$body .=            "<tr style=\"background-color:$gray\">" .
                        "<th align=\"left\" style=\"padding-left:10px\"><b>Dinner Tickets<b/></th>" .
                    "</tr>" .
                    "<tr style=\"background-color:$blue\">" .
                        "<th align=\"center\" style=\"padding-left:10px\">List people receiving a Dinner Ticket</th>" .
                    "</tr>";
                    $gL = trim($gL);
                    $tok = strtok($gL, "|");

$body .=             "<tr>". 
                        "<td style=\"padding-left:10%\"><table style=\"width:80% \" text-align=\"center\">" .
                            "<tr style=\"background-color:$gray\">" .  
                                "<th align=\"center\">First Name</th>" .
                                "<th align=\"center\">Last Name</th>" .
                                "<th align=\"center\">Vegetarian Meal?</th>" . 
                            "</tr>";
                        
                        $bGray = FALSE;
                        while ($tok !== FALSE)
                        {
                            $fName = substr($tok, strpos($tok, "f:")+2);    // first name
                            $tok = strtok("|");
                            $lName = substr($tok, strpos($tok, "l:")+2);    // last name
                            $tok = strtok("|");
                            $veg = substr($tok, strpos($tok, "v:")+2);      // vegetarian meal?
$body .=                    "<tr" . ($bGray == TRUE ? " style=\"background-color:$gray\">" : ">") .  
                                "<td align=\"left\" style=\"padding-left:10px\">$fName</td>" .
                                "<td align=\"left\" style=\"padding-left:10px\">$lName</td>" .
                                "<td align=\"left\" style=\"padding-left:10px\">$veg</td>" . 
                            "</tr>";

                            $tok = strtok("|");
                            $bGray = !$bGray;
                        }

$body .=                "</table></td>" .
                    "<tr/>";  
                    }

                    if (isset($seat) && strlen(trim($seat)) > 0)
                    {
$body .=            "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">Seating Options</th>" .
                    "</tr>";
                    
                        if (strcmp($seat, "CHOOSE") == 0)
                        {
$body .=            "<tr>" . 
                        "<td align=\"left\" style=\"padding-left:25px\">Please choose a table for us</td>" . 
                    "</tr>";
                        }
                        else if (strcmp($seat, "SEATWITH") == 0 && isset($seatwith))
                        {
$body .=            "<tr>" . 
                        "<td align=\"left\" style=\"padding-left:25px\">Please seat us with $seatwith</td>" .
                    "</tr>";
                        }
                        else if ( (strcmp($seat, "SPONSOR8") == 0) ||
                                (strcmp($seat, "SPONSOR10") == 0) ||
                                (strcmp($seat, "SPONSOR12") == 0) ||
                                (strcmp($seat, "SPONSOR16") == 0) )
                        {
$body .=            "<tr>" . 
                        "<td align=\"left\" style=\"padding-left:25px\">I would like to sponsor a Table of " . substr($seat, 7) . "</td>" . 
                    "</tr>"; 
// TABLE SPONSORSHIP SUPPORT
                        if (isset($spL) && strlen($spL) > 0)
                        {
$body .=                "<tr style=\"background-color:$gray\">" .
                            "<th align=\"left\" style=\"padding-left:10px\"><b>Table of " . substr($seat, 7) . "<b/></th>" .
                        "</tr>" .
                        "<tr style=\"background-color:$blue\">" .
                            "<th align=\"center\" style=\"padding-left:10px\">List guests for sponsored table</th>" .
                        "</tr>";
                        $spL = trim($spL);
                        $tok = strtok($spL, "|");

$body .=                "<tr>". 
                            "<td style=\"padding-left:10%\"><table style=\"width:80% \" text-align=\"center\">" .
                                "<tr style=\"background-color:$gray\">" .  
                                    "<th align=\"center\">First Name</th>" .
                                    "<th align=\"center\">Last Name</th>" .
                                    "<th align=\"center\">Vegetarian Meal?</th>" . 
                                "</tr>";
                            
                            $bGray = FALSE;
                            while ($tok !== FALSE)
                            {
                                $fName = substr($tok, strpos($tok, "f:")+2);    // first name
                                $tok = strtok("|");
                                $lName = substr($tok, strpos($tok, "l:")+2);    // last name
                                $tok = strtok("|");
                                $veg = substr($tok, strpos($tok, "v:")+2);      // vegetarian meal?
$body .=                        "<tr" . ($bGray == TRUE ? " style=\"background-color:$gray\">" : ">") .  
                                    "<td align=\"left\" style=\"padding-left:10px\">$fName</td>" .
                                    "<td align=\"left\" style=\"padding-left:10px\">$lName</td>" .
                                    "<td align=\"left\" style=\"padding-left:10px\">$veg</td>" . 
                                "</tr>";

                                $tok = strtok("|");
                                $bGray = !$bGray;
                            }

$body .=                    "</table></td>" .
                        "<tr/>";  
                        }  // END $spL
// END TABLE SPONSORSHIP SUPPORT   
                        }  // END $seat == SPONSOR
                    }

$body .=            "<tr style=\"background-color:$gray\">" .
                        "<th align=\"left\" style=\"padding-left:10px\"><b>Billing Information<b/></th>" .
                    "</tr>";

                    if (isset($bill) && strcmp($bill, "check") == 0)
                    {
$body .=            "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">I will send a check to SVSEF</th>" .
                    "</tr>" . 
                    "<tr>" .
                        "<td style=\"padding-left:10%\"><table style=\"width:80% \" text-align=\"center\"><tr>" .
                            "<td align=\"left\" style=\"padding-left:25px width:50%\" ><i>Mail</i> check to:<br/>SVSEF / Jody Zarkos<br/>PO Box 203<br/>Sun Valley, ID 83353</td>" .
                            "<td align=\"left\" style=\"padding-left:25px width:50%\" ><i>Drop-off</i> check to:<br/>SVSEF Office<br/>215 Picabo Street<br/>Ketchum, ID 83340</td>" .
                        "</tr></table></td>" .
                    "</tr>";
                    }   // END $bill == check
                    else if (isset($bill) && 
                            ( (strcmp($bill, "VISA") == 0) ||
                              (strcmp($bill, "MC") == 0) ||
                              (strcmp($bill, "AMEX") == 0) ) )
                    {
                    $strCCType = "Visa";
                    if (strcmp($bill, "MC") == 0)
                        $strCCType = "Mastercard";
                    else if (strcmp($bill, "AMEX") == 0)
                        $strCCType = "American Express";

$body .=            "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">Billing Address</th>" .
                    "</tr>" . 
                    "<tr>" .
                        "<td style=\"padding-left:10%\"><table style=\"width:80% \" text-align=\"center\"><tr>" .
                            "<td align=\"left\" style=\"padding-left:10px\" >$bill1<br/>$bill2<br/>$bill3" . (isset($bill4) && strlen($bill4) > 0 ? "<br/>$bill4</td>" : "</td>") .
                        "</tr></table></td>" .
                    "</tr>" .
                    "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\">Credit Card</th>" .
                    "</tr>" . 
                    "<tr>" .
                        "<td style=\"padding-left:10%\"><table style=\"width:80% \" text-align=\"center\"><tr>" .
                            "<td align=\"left\" style=\"padding-left:10px\" >$strCCType<br/>$ccnum</td>" .
                        "</tr></table></td>" .
                    "</tr>";
                    }  // END $bill == CC

                    if (isset($order) && strlen($order) > 0)
                    {
$body .=            "<tr style=\"background-color:$blue\">" .
                        "<th align=\"left\" style=\"padding-left:10px\"><b>Order<b/></th>" .
                    "</tr>";

$body .=             "<tr>". 
                        "<td style=\"padding-left:10%\"><table style=\"width:80% \" text-align=\"center\">" .
                            "<tr style=\"background-color:$gray\">" .  
                                "<th align=\"center\" style=\"padding-left:10px;width:40%\">Product</th>" .
                                "<th align=\"center\" style=\"padding-left:10px;width:10%\">Qty</th>" .
                                "<th align=\"center\" style=\"padding-left:10px;width:25%\">Unit</th>" .
                                "<th align=\"center\" style=\"padding-left:10px;width:25%\">Price</th>" . 
                            "</tr>";

                    $order = trim($order);
                    $tok = strtok($order, "|");
                    $grandTotal = 0;
                    $bGray = FALSE;
                    while ($tok !== FALSE)
                    {
                        $orderType = substr($tok, 0, strpos($tok, ":"));
                        $orderQty = intval(substr($tok, strpos($tok, ":")+1, strlen($tok) - (strpos($tok, ":")+1)));
                        $desc = "";
                        $unit = "";
                        $price = 0;

                        switch($orderType)
                        {
                            case "CNT_TIXEARLY":
                                $desc = "Dinner Ticket" . ($orderQty > 1 ? "(s)" : "") . " (through Oct. 20)";
                                $unit = 125;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXREGULAR":
                                $desc = "Dinner Ticket" . ($orderQty > 1 ? "(s)" : "");
                                $unit = 150;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXCOACH":
                                $desc = "Host a SVSEF Coach";
                                $unit = 100;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXCOACHGUEST":
                                $desc = "Coach's Guest Ticket"  . ($orderQty > 1 ? "(s)" : "");
                                $unit = 100;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXSPONSOR8":
                                $desc = "Table of 8 Sponsorship";
                                $unit = 2000;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXSPONSOR10":
                                $desc = "Table of 10 Sponsorship";
                                $unit = 2500;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXSPONSOR12":
                                $desc = "Table of 12 Sponsorship";
                                $unit = 3000;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXSPONSOR16":
                                $desc = "Table of 16 Sponsorship";
                                $unit = 4000;
                                $price = $unit * $orderQty;
                                break;
                            case "AMT_DONATION":
                                $desc = "SVSEF Donation Amount";
                                $unit = "";
                                $price = $orderQty;
                                $orderQty = "";
                                break;
                            case "CNT_TIXSINGLERAFFLE":
                                $desc = "Single Raffle Ticket";
                                $unit = 10;
                                $price = $unit * $orderQty;
                                break;
                            case "CNT_TIXGROUPRAFFLE":
                                $desc = "Group of 6 Raffle Tickets";
                                $unit = 50;
                                $price = $unit * $orderQty;
                                break;
                            default:
                                $desc = "";
                                $unit = "";
                                $price = 0;
                                break;
                        }    

                        if ($price > 0)
                            $grandTotal += $price;

                        if (strlen($desc) > 0)
                        {
 $body .=                   "<tr" . ($bGray == TRUE ? " style=\"background-color:$gray\">" : ">") . 
                                "<td align=\"left\" style=\"padding-left:10px;width:40%\">$desc</td>" .
                                "<td align=\"center\" style=\"width:10%\">$orderQty</td>" .
                                "<td align=\"right\" style=\"padding-right:20px;width:25%\">" . funcFormatSubTotal($unit) . "</td>" .
                                "<td align=\"right\" style=\"padding-right:20px;width:25%\">" . funcFormatSubTotal($price) . "</td>" . 
                            "</tr>";
                            
                            $bGray = !$bGray;
                        }
                        $tok = strtok("|");

                    }

$body .=                "<tr style=\"background-color:$blue\">" . 
                            "<th align=\"right\" colspan=\"3\" style=\"padding-right:20px\">Total:</th>" .
                            "<th align=\"right\" style=\"padding-right:20px;width:25%\">" . funcFormatSubTotal($grandTotal) . "</th>" .
                        "</tr>" .
                    "</table></td>" .
                    "</tr>";

                    }   // END $order 


$body .=        "</table>" .
                "<br/><br/>" .
                "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" . 
                (strcmp($rsvp, 'Y') == 0 ? 
                    "We look forward to seeing you at the 41st annual Wild West Game Dinner.  Thank you for " : 
                    "Sincere thanks for ") .
                    "your support of the Sun Valley Ski Education Foundation." . 
                "</p>" .
                "<p align=\"left\" margin-left=\"0%\" margin-right=\"60%\" style=\"font-size:18px\">" .
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

if ($server_name == 'localhost')
{   // Running at home
    $arrTo = array(array('email' => $sendToEmail, 'name' => $sendToName),
                /*array('email' => "kroberts@svsef.org", 'name' => "Kelly Roberts"),*/
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}
else
{
    $arrTo = array(array('email' => $sendToEmail, 'name' => $sendToName),
                array('email' => "kroberts@svsef.org", 'name' => "Kelly Roberts"),
                array('email' => "jody@svsef.org", 'name' => "Jody Zarkos"),
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
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

function funcFormatSubTotal($iSubTotal)
{
    $sFormattedSubTotal = strval($iSubTotal);

    if (strlen($sFormattedSubTotal) >= 4)
        $sFormattedSubTotal = substr($sFormattedSubTotal, 0, (strlen($sFormattedSubTotal) - 3)) . "," . substr($sFormattedSubTotal, (strlen($sFormattedSubTotal) - 3), 3);

    if (strlen($sFormattedSubTotal) >= 8)
        $sFormattedSubTotal = substr($sFormattedSubTotal, 0, (strlen($sFormattedSubTotal) - 7)) . "," . substr($sFormattedSubTotal, (strlen($sFormattedSubTotal) - 7), 7);

    if (strlen($sFormattedSubTotal) > 0)
        $sFormattedSubTotal = "$" . $sFormattedSubTotal;

    return($sFormattedSubTotal);
}

?>