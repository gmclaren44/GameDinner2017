<?php 
// PHP Connecting to GMAIL service
// and sending HTML Message
// when an Error has occurred
// with a Customer Vault Entry
//
// Author: Gina McLaren
// Sept 17, 2017
//

header("Content-type: text/xml");

require_once 'AuthGmail.php';

$params = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
parse_str($params);
$server_name = $_SERVER['SERVER_NAME'];

$fname = "SVSEF Events";
$subject = "ERROR Customer Vault Entry - SVSEFID $svsefID";

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
                        "<th align=\"right\" style=\"padding-right:20px\">Field</th><th align=\"left\">Value</th>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Vault Entry Result</td><td>$strResultText</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Vault ID</td><td>$strVaultID</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">CC Type</td><td>$ccType</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">CC Num</td><td>$ccNum</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Last Name</td><td>$lastname</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">First Name</td><td>$firstname</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Mailing Address</td><td>$address</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Mailing Address2</td><td>$address2</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">City</td><td>$city</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">State</td><td>$state</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Zip</td><td>$zip</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Email</td><td>$email</td>" .
                    "</tr>" .

                "</table>" .
                "<br/><br/>" .
                "Research the Customer Vault Issue with this CC" .
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
                array('email' => "gmclaren44@gmail.com", 'name' => "Gina McLaren"),
                array('email' => "svsefITProgramming@gmail.com", 'name' => null));
}
else
{
    $arrTo = array(
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