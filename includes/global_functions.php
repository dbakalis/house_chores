<?php

    /**Check form required fields
     * 
     * Checks the form posted fields that are set
     * as required and returns the missing fields if 
     * they exist in an array along with the 
     * status of required failure or success (0/1).
     */
	function checkRequiredFields($request, $requiredFields){
        global $lang;

		$requiredStatusArr 	= array();
		$missingFields 		= "";

		// loop post and check required fields
		foreach($request as $req_key => $req_val){
			if( (in_array($req_key, $requiredFields)) && ($req_val == "") ){
				$missingFields .= $lang["requireFields"][$req_key];
			}
		}

		// 1 is ok // 0 is not ok
		$requiredStatusArr["requiredStatus"] 	= ($missingFields == "")? 1 : 0;
		$requiredStatusArr["missingFields"]		= $missingFields;

		return $requiredStatusArr;
    }

    /** Create an error message and return it in a variable */
    function createErrorMessage($message){
        global $lang;

        $messageError = '<div class="alert alert-soft-danger" role="alert">'.$message.'</div>';
        return $messageError;
    }
    
    /** Create a success message and return it in a variable */
    function createSuccessMessage($message){
        global $lang;

        $messageSuccess = '<div class="alert alert-soft-success" role="alert">'.$message.'</div>';
        return $messageSuccess;
    }

    /**Get the cliends IP address */
    function getIpOfClient(){
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    /////////////////////////////// SESSION AND PERMISSIONS FUNTIONS ////////////////////////////////

    /**Check if session is alive
     * Compares a session variabled called
     * sessionUserId
     */
    function checkSessionIsAlive(){
        global $glob;

        if( (isset($_SESSION['sessionUserId'])) && ($_SESSION["sessionUserId"] != "") && ($_SESSION["sessionUserId"] > 0) ){
            // everything is fine
        }else{
            header('Location: '.$glob['rootRelAdmin']."/logout.php");
            die();
        }
    }

?>