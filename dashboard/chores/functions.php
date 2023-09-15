<?php

    /** Get chores in an array
     * 
     * @return array
     */
    function getChores(){
        return dbSelect("
            select 
                chores.id, 
                chores.chore, 
                chores.house_id, 
                houses.house
            from chores 
            inner join houses on chores.house_id = houses.id
            order by 
                chores.house_id, 
                chores.chore
        ");
    }

    /** Get the chore ids on calendar
     * 
     * Searches 2 months in the future of current day
     * 
     * @return array
     */
    function getFutureCalendarChores(){
        return dbSelect("select chore_id from calendar where the_date between ".mySQLSafe(date("Y-m-d"))." and ".mySQLSafe(date('Y-m-d', strtotime(date("Y-m-d").' + 2 month')))." group by chore_id");
    }

    /** Add a new chore
     * 
     * @return string $message
     */
    function addChore(){
        global $lang, $dbConnection;

        // simple success variable
        $success = 0;

        // exlude fields of $_POST that we dont want in $record
        $excluded_post_fields = array("days", "user");
        
        // set the required fields for backend validation
        $required_fields = array("chore");

        // check if required fields are filled
        $required_status_arr = checkRequiredFields($_POST, $required_fields);

        // if required status is 1 then everything is fine
        if($required_status_arr["requiredStatus"] == 1){

            // create record from post
            $record = array();
            foreach($_POST as $post_key => $post_val){
                if(!in_array($post_key, $excluded_post_fields)){
                    $record[$post_key] = mySQLSafe($post_val);
                }
            }

            // do the insert
            $success = dbInsert($record, "chores");

            // get the ID of the insert
			$chore_id = mysqli_insert_id($dbConnection);

        }elseif($required_status_arr["requiredStatus"] == 0){
            $success = 8;
        }

        // clean some memory
        unset($record);

        // depending the success value do a result
        if($success == 1){

            // id days are selected create the calendar
            if( (isset($_POST['days'])) && (!empty($_POST['days'])) ){
                archiveChoreDays($chore_id, $_POST['days']);
                createdChoreCalendar($chore_id, $_POST['days'], $_POST['user']);
            }

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

    /** Edit a chore
     * 
     * @return string $message
     */
    function editChore(){

    }

    /** Keep an archive of chore days
     * 
     * @param int $chore_id
     * @param array $days_arr
     * @return void
     */
    function archiveChoreDays($chore_id, $days_arr){
        foreach ($days_arr as $day_key => $day_on) {
            $record_chdays               = array();
            $record_chdays['chore_id']   = mySQLSafe($chore_id);
            $record_chdays['day_number'] = mySQLSafe($day_key);

            dbInsert($record_chdays, "chores_days");
            unset($record_chdays);
        }
    }

    /** Create the calendar of chores
     * 
     * @param int $chore_id
     * @param array $days_arr
     * @param array $posted_users_arr
     * @return void
     */
    function createdChoreCalendar($chore_id, $days_arr, $posted_users_arr){
        // get days week indexes of posted days
        $days_indexes_arr = array();
        foreach ($days_arr as $day_key => $day_on) {
            $days_indexes_arr[] = $day_key;
        }

        // get the year now and the next year
        $year_now   = date("Y-m-d");
        $year_next  = date('Y-m-d', strtotime($year_now.' + 1 years'));

        // get all dates between the time period
        $period = new DatePeriod(
            new DateTime($year_now),
            new DateInterval('P1D'),
            new DateTime($year_next)
        );

        // for each date in time period
        foreach ($period as $date) {
            $date_week_index = $date->format('w');

            // if index of date in posted days indexes
            if(in_array($date_week_index, $days_indexes_arr)){
                $calendar               = array();
                $calendar['the_date']   = mySQLSafe($date->format('Y-m-d'));
                $calendar['chore_id']   = mySQLSafe($chore_id);
                $calendar['user_id']    = mySQLSafe($posted_users_arr[$date_week_index]);

                dbInsert($calendar, "calendar");
                unset($calendar);
            }
        }
    }
?>