<?php 
// PHP File Upload for
// Uploading and emailing
// the Constituent's Logo
// to Jody@svsef.org
//
// Author: Gina McLaren
// July 16, 2017
//

$destination_path = getcwd() . DIRECTORY_SEPARATOR . 'logos' . DIRECTORY_SEPARATOR . 
    htmlspecialchars($_POST["svsefID"]) . '-' . htmlspecialchars($_POST["svsefLastName"]) . '-';
$target_path = $destination_path . basename( $_FILES['fileLogo']['name']);

$result = false;
if(move_uploaded_file($_FILES['fileLogo']['tmp_name'], $target_path)) 
{
    //echo "About to call chmod: $target_path";
    if (chmod($target_path, 0755))
    {
        $result = true;
    }
}

$return = "<script language=\"javascript\" type=\"text/javascript\">" . 
                "parent.funcStopFileUpload($result);" .
            "</script>";
sleep(1);

echo $return;

?>