<?php
    // setting up the enviroment
	switch ($areWeLive = 0) {
		case 0:
			$glob = array(
                "dbhost"        => 'localhost',
				"dbdatabase"    => 'house',
				"dbusername"    => 'root',
				"dbpassword"    => '',
				"dbport"        => 3310,
				'root'  		=> '/house',
				'root_admin'  	=> '/house/dashboard'
			);
		break;

		case 1:
			$glob = array(
                "dbhost"        => 'localhost',
				"dbdatabase"    => 'house',
				"dbusername"    => '',
				"dbpassword"    => '',
				'root'  		=> '/house',
				'root_admin'  	=> '/house/dashboard'
			);
		break;
	}

	// global language by default
	$lang_folder = 'gr';
?>