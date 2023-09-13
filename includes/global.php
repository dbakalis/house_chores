<?php
    // setting up the enviroment
	switch ($areWeLive = 0) {
		case 0:
			$glob = array(
                "dbhost"        => 'localhost',
				"dbdatabase"    => 'house',
				"dbusername"    => '',
				"dbpassword"    => '',
				"dbport"        => 3310
			);
		break;

		case 1:
			$glob = array(
                "dbhost"        => 'localhost',
				"dbdatabase"    => 'house',
				"dbusername"    => '',
				"dbpassword"    => ''
			);
		break;
	}

	// global language by default
	$lang_folder = 'gr';
?>