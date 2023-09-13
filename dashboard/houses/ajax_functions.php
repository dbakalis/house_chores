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
				case 'houseActivityChange'  : houseActivityChange(); break;
				case 'deleteHouse'          : deleteHouse(); break;
			}
		}
	}

	///////////////////////////////////AVAILABILITIES///////////////////////////////////////

    /** Enable / Disable a house
	 * 
	 * @return void
	 */
	function houseActivityChange(){
		// prepare the record
		$record				= array();
		$record["active"] 	= mySQLSafe($_POST["newStatus"]);

		// update the category
		dbUpdate($record, "houses", "id = ".mySQLSafe($_POST["house_id"]));
		unset($record);
	}

    /** Delete a house
	 * 
	 * @return void
	 */
    function deleteHouse(){
		dbDelete("houses", "id = ".mySQLSafe($_POST["house_id"]));
    }





    closeConnectionToDatabase($dbConnection);
?>