<?php

    /** Get houses in an array
     * 
     * @return array
     */
    function getHouses(){
        return dbSelect("select * from houses order by house");
    }

    /** Get houses counters
     * 
     * @return array $counters
     */
    function getHousesCounters(){
        // init an array to hold data
        $counters = array();

        // count all houses
        $all_houses             = dbSelectFirst("select count(*) as all_houses from houses");
        $counters['all_houses'] = $all_houses['all_houses'];
       
        // count houses without rooms
        $no_rooms               = dbSelect("select count(*) as no_rooms from rooms where house_id not in (select id from houses group by id)");
        $counters['no_rooms']   = $all_houses['all_houses'];

        // count houses that have pending chores
        $counters['pending_chores'] = 'TOBEDONE';

        return $counters;
    }

    /** Add a new house
     * 
     * @return string $message
     */
    function addHouse(){
        global $lang;

        // simple success variable
        $success = 0;

        // exlude fields of $_POST that we dont want in $record
        $excluded_post_fields = array();

        // set the required fields for backend validation
        $required_fields = array("house");

        // check if required fields are filled
        $required_status_arr = checkRequiredFields($_POST, $required_fields);

        // if required status is 1 then everything is fine
        if($required_status_arr["requiredStatus"] == 1){

            // create record from post
            $record = array();
            foreach($_POST as $post_key => $post_val){
                if(!in_array($post_key,$excluded_post_fields)){
                    $record[$post_key] = mySQLSafe($post_val);
                }
            }

            // do the insert
            $success = dbInsert($record, "houses");

        }elseif($required_status_arr["requiredStatus"] == 0){
            $success = 8;
        }

        // clean some memory
        unset($record);

        // depending the success value do a result
        if($success == 1){

            // everything went fine with the insert
            header("Location: index.php");
            die();

        }elseif($success == 0){

            // there was a problem in insert
            $message = createErrorMessage($lang["errors"]["sqlError"]);
            return $message;

        }elseif($success == 9){

            // there was a problem in insert
            $message = createErrorMessage($lang["errors"]["unknownError"]);
            return $message;

        }elseif($success == 8){

            // there was a problem in insert
            $message = createErrorMessage($lang["errors"]["required_fieldsError"].": ".$required_status_arr["missingFields"]);
            return $message;
        }

    }

    /** Edit a house
     * 
     * @return string $message
     */
    function editHouse(){
        global $glob, $lang, $config;

        // simple success variable
        $success = 0;

        // exlude fields of $_POST that we dont want in $record
        $excluded_post_fields = array("id");

        // set the required fields for backend validation
        $required_fields = array("house");

        // check if required fields are filled
        $required_status_arr = checkRequiredFields($_POST, $required_fields);

        // if required status is 1 then everything is fine
        if($required_status_arr["requiredStatus"] == 1){

            // create record from post
            $record = array();
            foreach($_POST as $post_key => $post_val){
                if(!in_array($post_key,$excluded_post_fields)){
                    $record[$post_key] = mySQLSafe($post_val);
                }
            }

            // do the update
            $success = dbUpdate($record, "houses", "id = ".mySQLSafe($_POST["id"]));

        }elseif($required_status_arr["requiredStatus"] == 0){
            $success = 8;
        }

        // clean some memory
        unset($record);

        // depending the success value do a result
        if($success == 1){
                
            // everything went fine with the insert
            header("Location: index.php?#editSuccess");
            die();

        }elseif($success == 0){

            // there was a problem in insert
            $message = createErrorMessage($lang["errors"]["sqlError"]);
            return $message;

        }elseif($success == 9){

            // there was a problem in insert
            $message = createErrorMessage($lang["errors"]["unknownError"]);
            return $message;

        }elseif($success == 8){

            // there was a problem in insert
            $message = createErrorMessage($lang["errors"]["requiredFieldsError"].": ".$required_status_arr["missingFields"]);
            return $message;
        }
    }
?>