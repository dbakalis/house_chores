<?php
    // basic includes
    include("../../includes/basic_dashboard_includes.php");

    // local functions
    require_once('functions.php');

	///////////////////////////////////AJAX SELECTOR///////////////////////////////////////////

	//Decide wich function will be executed based on the AJAX "values" field. 
	if(isset($_POST['values'])) {
		if(!empty($_POST['values'])) {
			switch($_POST['values']) {
				case 'deleteRoom' : deleteRoom(); break;
			}
		}
	}

	///////////////////////////////////AVAILABILITIES///////////////////////////////////////

    /** Delete a room
	 * 
	 * @return void
	 */
    function deleteRoom(){
		dbDelete("rooms", "id = ".mySQLSafe($_POST["room_id"]));
    }

    closeConnectionToDatabase($dbConnection);
?>