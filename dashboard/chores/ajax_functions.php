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
				case 'deleteChore' 				: deleteChore(); break;
				case 'populateRoomsByHouseId' 	: populateRoomsByHouseId(); break;
			}
		}
	}

	///////////////////////////////////AVAILABILITIES///////////////////////////////////////

    /** Delete a chore
	 * 
	 * @return void
	 */
    function deleteChore(){
		dbDelete("chores", "id = ".mySQLSafe($_POST["chore_id"]));
    }

	/** Fill with option tags the room_id select tag
	 * 
	 * @return string
	 */
	function populateRoomsByHouseId(){
		$rooms_arr = dbSelect("select id, room from rooms where house_id = ".mySQLSafe($_POST['house_id']));

		if(!empty($rooms_arr)){
			foreach ($rooms_arr as $room) {
				echo "<option value='".$room['id']."'>".$room['room']."</option>";
			}
		}
	}

    closeConnectionToDatabase($dbConnection);
?>