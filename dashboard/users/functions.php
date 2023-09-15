<?php
    function getUsers(){
        return dbSelect("select * from users order by username");
    }
?>