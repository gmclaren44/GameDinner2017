<?php 
// PHP Connecting to GMAIL service
// and sending HTML Message
// when an Error has occurred
// with a Customer Transaction
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
$subject = "ERROR Customer Transaction - SVSEFID $svsefID";

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
                        "<td align=\"right\" style=\"padding-right:20px\">Transaction Result</td><td>$strResultText</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Transaction ID</td><td>$strTransID</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">Transaction Total</td><td>$strTransTotal</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">CC Code</td><td>$ccCVV</td>" .
                    "</tr>" .
                    "<tr>" .
                        "<td align=\"right\" style=\"padding-right:20px\">CC Exp</td><td>$ccExp</td>" .
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