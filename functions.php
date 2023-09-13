<?php
    /** Keep a log for whoever logs in
     * 
     * @param int $user_id
     * @param int $success
     * @return void
     */
    function loginLog($user_id, $success){
        $login_log_arr 				    = array();
        $login_log_arr["user_id"] 	    = mySQLSafe($user_id);
        $login_log_arr["IP"] 			= mySQLSafe(getIpOfClient());
        $login_log_arr["login_status"]  = mySQLSafe($success);

        // insert the log in the database
        dbInsert($login_log_arr, 'login_log');

        // free memory
        unset($login_log_arr);
    }

    /** Check if user is loged in
     * 
     * If the user session exists then redirect him to the dashboard.
     * 
     * @return void
     */
    function checkUserIsLogedIn(){
        // check session key if exists and is valid
        if( (isset($_SESSION['sessionUserId'])) && ($_SESSION["sessionUserId"] != "") && ($_SESSION["sessionUserId"] > 0) ){
            header("Location: dashboard/");
        }else{
            return "";
        }
    }

    /** Handles the post of the login form
     * 
     * @return string $message
     */
    function login(){
        global $lang;

        // define a success variable and set it to 0
        $success = 0;

        // required fields backend check
		$reqFields		= array('username','password');
		$reqStatusArr	= checkRequiredFields($reqFields, $_POST);

        // if all required fields are filled (status = 1)
        if($reqStatusArr["requiredStatus"] == 1){

            // check if user exists in database
            $userExist = dbSelectFirst("select id, active from users where username = ".mySQLSafe($_POST["username"])." and password = ".mySQLSafe(md5($_POST["password"])));

            // check if user exists and is active or not (1 is active)
            if( (isset($userExist)) && (!empty($userExist)) && ($userExist["active"] == 0) ){

                $message = createErrorMessage($lang["login"]["account_not_active"]);
                $success = 9;

            }elseif( (isset($userExist)) && (!empty($userExist)) && ($userExist["active"] == 1) ){
                
                $_SESSION["user_id"]   = $userExist["id"];
                $_SESSION["username"]  = $_POST["username"];
                $success               = 1;

            }else{
                $message = createErrorMessage($lang['login']["account_not_exist"]);
                $success = 0;
            }

        }else{
            $message = createErrorMessage($reqStatusArr["emptyFields"]);
			$success = 0;
        }

        // save login try to log (keep even failures)
        $log_user_id = ( (isset($_SESSION["user_id"])) && ($_SESSION["user_id"] > 0) )? $_SESSION["user_id"] : "NULL";
        loginLog($log_user_id, $success);

        // based on the login success result do some actions (and keep a log too)
        if($success == 1){
			header("Location: dashboard/");
            die();
		}elseif($success==9){
			return $message;
		}else{
			return $message;
		}
    }
?>