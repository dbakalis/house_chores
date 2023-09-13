<?php
	function openConnectionToDatabase(){
        global $glob, $areWeLive;

		// production / test cases
		if($areWeLive == 1){
        	$dbConnection = mysqli_connect($glob["dbhost"], $glob["dbusername"], $glob["dbpassword"], $glob["dbdatabase"]);
		}elseif($areWeLive == 0){
			$dbConnection = mysqli_connect($glob["dbhost"], $glob["dbusername"], $glob["dbpassword"], $glob["dbdatabase"], $glob['dbport']);
		}
		
		mysqli_set_charset($dbConnection,"utf8");
		
		// Check connection
		if (mysqli_connect_errno()) {
			exit();
		}else{
		}
		
		return $dbConnection;
	}

	function closeConnectionToDatabase($dbConnection){
		mysqli_close($dbConnection);
		unset($dbConnection);
	}

	function dbSelect($query = ""){
		global $dbConnection;

		// set some variables
		$record = array();

		// if parameters are not empty
		if($query!=""){
			// execute the query
			$r = mysqli_query($dbConnection, $query);
			
			//if the query get results then store them in array
			if (mysqli_num_rows($r) > 0){	

				$i	= 0;
				while ($row = mysqli_fetch_assoc($r)) {	
					// create multidimensional array of data
					foreach($row as $row_key => $row_val){
						$record[$i][$row_key] = $row_val;
					}
					
					$i++;
				}	
			}
			unset($r);
			unset($row);
		}

		// return the array of sql data
		return $record;
	}

    function dbSelectFirst($query = ""){
		global $dbConnection;

		// set some variables
		$record = array();

		// if parameters are not empty
		if($query!=""){
			
			// execute the query
			$r = mysqli_query($dbConnection, $query);

			//if the query get results then store them in array
			if (mysqli_num_rows($r) > 0){	
				if ($row = mysqli_fetch_assoc($r)) {	
					$record = $row;
				}	
			}
			unset($r);
			unset($row);
		}

		// return the array of sql data
		return $record;
	}

	function dbSelectPaginateAdmin($fields, $table, $innerJoin, $where, $gourpby, $orderby, $page_no, $total_records_per_page){
		global $glob;

		$paginanationData = array();

		// Calculate OFFSET Value and SET other Variables
		$offset         = ($page_no-1) * $total_records_per_page;
		$previous_page  = $page_no - 1;
		$next_page      = $page_no + 1;
		$adjacents      = "2";
		$fieldsSQL		= ( (isset($fields)) && ($fields!="") )? $fields : "*";
		$whereSQL		= ( (isset($where)) && ($where!="") )? "where ".$where : "";
		$gourpbySql		= ( (isset($gourpby)) && ($gourpby!="") )? "group by ".$gourpby : "";
		$orderbySql		= ( (isset($orderby)) && ($orderby!="") )? $orderby : "";

		// Get the Total Number of Pages for Pagination
		$totalNumPagesPagination    = dbSelect("select count(*) as total_record from ".$glob["dbPrefix"].$table." ".$innerJoin." ".$whereSQL);

		$total_records              = $totalNumPagesPagination[0]["total_record"];
		$total_no_of_pages          = ceil($total_records / $total_records_per_page);
		$second_last                = $total_no_of_pages - 1;
	
		// get the data paginated
		$paginanationData["data"]  	= dbSelect("select ".$fieldsSQL." from ".$glob["dbPrefix"].$table." ".$innerJoin." ".$whereSQL." ".$gourpbySql." ".$orderbySql." LIMIT ".$total_records_per_page." OFFSET ".$offset);
		
		// get the pagination buttons variables
		$paginanationData["total_no_of_pages"]  = $total_no_of_pages;
		$paginanationData["previous_page"]  	= $previous_page;
		$paginanationData["next_page"]  		= $next_page;
		$paginanationData["adjacents"]  		= $adjacents;
		$paginanationData["second_last"]  		= $second_last;

		// return the data
		return $paginanationData;
	}

	function dbUpdate($record, $table= "", $where = ""){
		global $dbConnection;

		// if parameters are not mepty
		if( ($table!="") && (!empty($record)) ){

			// set some variables
			$fieldsToUpdate = "";
			$sqlUpdate 		= "update ".$table." set ";

			// create update fields sql
			foreach($record as $record_key => $record_val){
				if(is_array($record_val)){
					$fieldsToUpdate .= (!empty($record_val))? $record_key." = ".serialize($record_val).", " : $record_key." = '', ";
				}else{
					$fieldsToUpdate .= ($record_val != "")? $record_key." = ".$record_val.", " : $record_key." = '', ";
				}
			}
			// trim fields 
			$fieldsToUpdate = rtrim($fieldsToUpdate, ", ");

			// concatenate them with full sql
			$sqlUpdate 	.= $fieldsToUpdate;
			
			// add the condition if exists
			if($where!=""){
				$sqlUpdate .= " where ".$where;
			}

			// execute sql and get the state
			$r 			 = mysqli_query($dbConnection, $sqlUpdate);
			$updateState = ($r)? 1 : 0;

			unset($r);
		}else{
			$updateState = 9;
		}

		// return the status
		return $updateState;
	}

	function dbInsert($record, $table = ""){
		global $dbConnection;

		// if parameters are not mepty
		if( ($table!="") && (!empty($record)) ){

			// set some variables
			$fieldsToinsert = "";
			$dataToinsert 	= "";
			$sqlInsert 		= "insert into ".$table."( ";
	
			// create insert fields sql
			foreach($record as $record_key => $record_val){
				$fieldsToinsert .= $record_key.", ";

				if(is_array($record_val)){
					$dataToinsert 	.= serialize($record_val).", ";
				}else{
					$dataToinsert 	.= ($record_val != "")? $record_val.", " : "'',";
				}
			}

			// trim and concatenate them with full sql
			$fieldsToinsert  = rtrim($fieldsToinsert, ", ");
			$dataToinsert  	 = rtrim($dataToinsert, ", ");
			$sqlInsert 		.= $fieldsToinsert.") values (".$dataToinsert.")";

			// execute sql and get the state
			$r 			 = mysqli_query($dbConnection, $sqlInsert);
			$insertState = ($r)? 1 : 0;
			unset($r);
		}else{
			$insertState = 9;
		}
		
		// return the status
		return $insertState;
	}

	function dbDelete($table = "", $where = ""){
		global $dbConnection;

		// if parameters are not mepty
		if($table!=""){

			// set some variables
			$sqlDelete 	= "delete from ".$table;

			// add the condition if exists
			if($where!=""){
				$sqlDelete .= " where ".$where;
			}

			// execute sql and get the state
			$r 			 = mysqli_query($dbConnection, $sqlDelete);
			$deleteState = ($r)? 1 : 0;
			unset($r);

		}else{
			$deleteState = 9;
		}

		// return the status
		return $deleteState;
		
	}
	
	function dbMisc($query){
		global $dbConnection;

		if($query != ""){
			$r 			= mysqli_query($dbConnection, $query);
			$sqlStatus 	= ($r)? 1 : 0;
			unset($r);
		}else{
			$sqlStatus = 9;
		}

		return $sqlStatus;
	}

	function numrows($query) {
		global $dbConnection;
		if($query!= ""){
			$result = mysqli_query($dbConnection, $query);
			return mysqli_num_rows($result);
		}else{
			return 0;
		}

	}

	function dbBlocker($user, $max_block_level, $time, $login_event, $loc){
      	global $glob;
      
		// delete from blocker table
      	$expireTime = time()-($time*5);
      	dbDelete($glob['dbPrefix']."cubecart_blocker","lastTime<".$expireTime);
      
      	$block_list_arr = dbSelect("
			select 
				id,
				blockTime,
				blockLevel,
				lastTime
			FROM ".$glob['dbPrefix']."cubecart_blocker 
			WHERE 
				`browser` = ".mySQLSafe($_SERVER['HTTP_USER_AGENT'])." and 
				`ip` = ".mySQLSafe($_SERVER['REMOTE_ADDR'])." and 
				`loc`= ".mySQLSafe($loc)."
		");

      	if( (!empty($block_list_arr)) && ($block_list_arr[0]['blockTime'] > time()) ){
         	// do nothing the user is still banned
         	return TRUE;   
      	}elseif( (!empty($block_list_arr)) && ($block_list_arr[0]['blockTime'] > 0) && ($block_list_arr[0]['blockTime'] < time()) && ($block_list_arr[0]['blockLevel'] == $max_block_level) ){
         	// delete the db row as user is no longer banned
        	dbDelete($glob['dbPrefix']."cubecart_blocker", "id=".$block_list_arr[0]['id']);
         
         	return FALSE;
      	}elseif( (!empty($block_list_arr)) && (!$login_event) && ($block_list_arr[0]['blockTime'] == 0) ){
         
			// If last attempt was more than the time limit ago we need to set the level to one
			// This stops a consecutive fail weeks later blocking on first attempt
			$timeAgo 				= time() - $time;
			$newdata['blockLevel'] 	= ($block_list_arr[0]['lastTime'] < $timeAgo)? 1 : $block_list_arr[0]['blockLevel']+1;
			$newdata['blockTime'] 	= ($newdata['blockLevel'] == $max_block_level)? time() + $time : 0;
			$newdata['lastTime'] 	= time();

			if($newdata['blockLevel'] == $max_block_level){
				dbUpdate($newdata, $glob['dbPrefix']."cubecart_blocker", "id=".$block_list_arr[0]['id']);
				return TRUE;
			}else{
				dbUpdate($newdata, $glob['dbPrefix']."cubecart_blocker", "id=".$block_list_arr[0]['id']);
				return FALSE;
			}
      	}elseif(empty($block_list_arr) && (!$login_event)){
			// insert
			$newdata['blockLevel'] 	= mySQLSafe(1);
			$newdata['blockTime'] 	= mySQLSafe(0);
			$newdata['browser'] 	= mySQLSafe($_SERVER['HTTP_USER_AGENT']);
			$newdata['ip'] 			= mySQLSafe($_SERVER['REMOTE_ADDR']);
			$newdata['username'] 	= mySQLSafe($user);
			$newdata['loc'] 		= mySQLSafe($loc);
			$newdata['lastTime'] 	= time();
			
			dbInsert($newdata, $glob['dbPrefix']."cubecart_blocker");
         	return FALSE;
      	}
   	}

	function replaceBadChars($givenString) {

		$badChars = array("select", "create", "alter", "update", "drop", ";", "--", "insert", "group", "union", "script", "delete", "xp_", "#", "%", "&", "'", "(", ")", "/", "\\", ":", ";", "<", ">", "=", "[", "]", "?", "`", "|");
		$newString = str_replace($badChars,"",$givenString);
		return $newString;
	}
	
	function replaceBadCharsSQLSafe($givenString) {

		$badChars  = array("select", "create", "alter", "update", "drop",  "insert", "group", "union", "script", "delete", "xp_", "/", "`");
		$newString = str_replace($badChars,"",$givenString);
		
		return $newString;
	}

	function mySQLSafe($value, $quote="'"){
		global $dbConnection;

		if( ($value != "") && ($value == "NULL") ){
			$value = $value; 
		}elseif($value != ""){
			// strip quotes if already in and include the string in single quotes
			$value = str_replace(array("\'","'"),"&#39;",$value);
			$value = mysqli_real_escape_string($dbConnection, $value);
			$value = $quote . trim($value) . $quote; 
		}
		
		return replaceBadCharsSQLSafe($value);
	}
?>