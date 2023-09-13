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
?>