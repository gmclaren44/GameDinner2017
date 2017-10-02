<?php 
// PHP Connecting to GMAIL service
// and sending HTML Messages
//
// Author: Gina McLaren
// July 9, 2017
//

require_once 'class.phpmailer.php';
require_once './google-api-php-client/vendor/autoload.php';


function funcSendEmail($arrTo, $fname, $subject, $body, $arrEmbeddedImage, $attachFileName)
{
    $arrXML = array(); 
    /*if (!headers_sent())
        $arrXML[0] = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";*/
    $arrXML[sizeof($arrXML)] = "<result>\n";    

    $params = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
    parse_str($params);

    $server_name = $_SERVER['SERVER_NAME'];
    $script_filename = $_SERVER['SCRIPT_FILENAME'];
    $request_url = $_SERVER['REQUEST_URI'];
    $host = $_SERVER['SERVER_NAME'];

    if ($server_name == "localhost")
    {   // Running at home
        $index = strrpos($script_filename, '\\');
        $json_filename = substr($script_filename, 0, $index) . '\\json\\SVSEF Online Forms-3d08ada95a16.json';
        $attachFilePath = substr($script_filename, 0, $index) . '\\logos\\' . $attachFileName;
    }
    else
    {   // Running on SVSEF
        $index = strrpos($script_filename, '/');
        $json_filename = substr($script_filename, 0, $index) . '/json/SVSEF Online Forms-3d08ada95a16.json';
        $attachFilePath = substr($script_filename, 0, $index) . "/logos/". $attachFileName;
    }

    putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $json_filename);

    try
    {
        $client = new Google_Client();
        $client->useApplicationDefaultCredentials();
        $client->addScope(array(Google_Service_Gmail::GMAIL_COMPOSE,
                                Google_Service_Gmail::GMAIL_SEND,
                                Google_Service_Gmail::MAIL_GOOGLE_COM));
        $user_to_impersonate = "svsefIT@svsefonlineforms.org";
        $client->setSubject($user_to_impersonate);

        $gmail = new Google_Service_Gmail($client); 
        $userId = "svsefit@svsef-online-forms-2017.iam.gserviceaccount.com";
        
        /*$mail = new \PHPMailer();*/
        $mail = new PHPMailer();
        $mail->CharSet = "UTF-8";
        $mail->Encoding = 'base64';
        
        $from = $user_to_impersonate;
        $mail->From = $from;
        $mail->Sender = $from;
        $mail->FromName = $fname;

        if ($arrEmbeddedImage !== null)
        {
            for ($i = 0; $i < sizeof($arrEmbeddedImage); $i++)
            {
                $mail->AddEmbeddedImage($arrEmbeddedImage[$i]['path'], $arrEmbeddedImage[$i]['cid']);
            }
        }
            

        if ($attachFileName !== null && $attachFilePath !== null)
            $mail->AddAttachment($attachFilePath);

        for ($i = 0; $i < sizeof($arrTo); $i++)
        {
            if ($i == 0)
                $mail->AddAddress($arrTo[$i]['email'], $arrTo[$i]['name']);
            else
                $mail->addBCC($arrTo[$i]['email'], $arrTo[$i]['name']);
        }
        
        $mail->AddReplyTo($from,$fname);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->IsHTML(true); 
        

        $mail->preSend();
        $mime = $mail->getSentMIMEMessage();

        $msg = new Google_Service_Gmail_Message();
        $data = base64_encode($mime);
        $data = str_replace(array('+','/','='),array('-','_',''),$data); // url safe
        $msg->setRaw($data);
        $msg->setSizeEstimate(strlen($data));
        $msg->setInternalDate(time()-(60*60*12));
        $msg->setId(30);
    } 
    catch (Exception $e) 
    {
        $arrXML[sizeof($arrXML)] = "<message id=\"0\" value=\"" . $e->getMessage() . "\"/>\n";
        $arrXML[sizeof($arrXML)] = "</result>\n";
        return($arrXML);
    }

    funcSendMessage($gmail, $user_to_impersonate, $msg, $arrXML);
    return($arrXML);
}

function funcSendMessage($service, $userId, $message, &$arrXML) 
{
    try 
    {
        $message = $service->users_messages->send($userId, $message);
        $arrXML[sizeof($arrXML)] = "<message id=\"" . $message->getId() . "\" value=\"sent\"/>\n";
        $arrXML[sizeof($arrXML)] = "</result>\n";
    } catch (Exception $e) {
        $arrXML[sizeof($arrXML)] = "<message id=\"0\" value=\"" . urlencode($e->getMessage()) . "\"/>\n";
        $arrXML[sizeof($arrXML)] = "</result>\n";
    }
}

?>

