<?php
    // includes
    include("../../includes/global.php");
    require_once('../../database/dbFunctions.php');
    require_once('../../language/'.$lang_folder.'/lang.php');
    require_once('../../includes/global_functions.php');

    // open connection to the database
	$dbConnection = openConnectionToDatabase();

    // start or continue session
    session_start();
?>