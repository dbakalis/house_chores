<?php
	// basic includes
    include("../../includes/basic_dashboard_includes.php");

    // local functions
    require_once('functions.php');

    // get rooms
    $rooms_arr = getRooms();

    // get rooms counters
    $rooms_counters = getRoomsCounters();
?>

<!DOCTYPE html>
<html lang="gr-GR" dir="ltr">
  	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo $lang['rooms']['title']; ?></title>

		<!-- favicos -->
		<link rel="apple-touch-icon" sizes="180x180" href="../../assets/img/favicons/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="../../assets/img/favicons/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="../../assets/img/favicons/favicon-16x16.png">
		<link rel="shortcut icon" type="image/x-icon" href="../../assets/img/favicons/favicon.ico">
		<link rel="manifest" href="../../assets/img/favicons/manifest.json">
		<meta name="msapplication-TileImage" content="../../assets/img/favicons/mstile-150x150.png">
		<meta name="theme-color" content="#ffffff">
        
		<!-- bootstrap icons CDN -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

		<link href="../../assets/css/theme.min.css" type="text/css" rel="stylesheet" id="style-default">
		<link href="../../assets/css/user.min.css" type="text/css" rel="stylesheet" id="user-style-default">
  	</head>
  	<body>
		<main class="main bg-soft-yellow" id="top">
			<div class="container-fluid px-0" data-layout="container">

				<?php require_once('../layouts/sidebar.php'); ?>
				<?php require_once('../layouts/topbar.php'); ?>

				<div class="content">

                    <!-- title -->
                    <div class="row g-3 mb-2">
                        <div class="col-auto">
                            <span class="text-dark-blue fs-3 fw-100"><?php echo $lang["rooms"]["title"]; ?></span>
                        </div>
                    </div>

                    <!-- rooms counters -->
                    <div class="row border-bottom border-top border-grey bg-grey-1 py-2 mb-4">
                        <!-- all rooms -->
                        <div class="col-12 col-sm-auto text-center">
                            <span class="fs-5 text-dark-blue fw-500"><?php echo $rooms_counters["all_rooms"]; ?></span>
                            <span class="text-grey"><?php echo $lang["rooms"]["all_rooms"]; ?></span>
                        </div>
                    
                        <!-- rooms with pending chores -->
                        <div class="col-12 col-sm-auto text-center">
                            <span class="fs-5 text-dark-blue fw-500"><?php echo $rooms_counters["pending_chores"]; ?></span>
                            <span class="text-grey"><?php echo $lang["rooms"]["pending_chores"]; ?></span>
                        </div>
                    </div>

                    <!-- rooms table -->
                    <div class="table-responsive scrollbar">
                        <table class="table fs--1 table-hover no-more-tables table-striped">
                            <thead>
                                <tr class="text-center align-middle bg-grey-1">
                                    <th scope="col" class="fw-500"><?php echo $lang["general"]["id"]; ?></th>
                                    <th scope="col" class="fw-500"><?php echo $lang["rooms"]["name"]; ?></th>
                                    <th scope="col" class="fw-500"><?php echo $lang["general"]["edit"]; ?></th>
                                </tr>
                            </thead>
                            <tbody class="border border-grey">
                                <?php
                                    if(!empty($rooms_arr)){
                                        foreach($rooms_arr as $room){
                                ?>
                                            <tr class='bg-white text-center align-middle'>
                                                <!-- id + active -->
                                                <td data-title='<?php echo $lang["general"]["id"]; ?>'>
                                                    <?php echo $room["id"]; ?>
                                                </td>
                                                
                                                <!-- room -->
                                                <td data-title='<?php echo $lang["rooms"]["name"]; ?>'>
                                                    <?php echo $room["room"]; ?>
                                                </td>

                                                <!-- edit / delete -->
                                                <td data-title='<?php echo $lang["general"]["edit"]; ?>'>
                                                    <div class="row mx-0 justify-content-center">
                                                        <div class="col-auto">
                                                            <a class="bi bi-pencil-fill text-grey fs-1 cursor-pointer" href="edit.php?id=<?php echo $room["id"]; ?>" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["general"]["edit"]; ?>"></a>
                                                        </div>

                                                        <div class="col-auto">
                                                            <a class="bi bi-trash text-grey fs-1 cursor-pointer delete-room" data-room-id="<?php echo $room["id"]; ?>" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["general"]["delete"]; ?>"></a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                <?php
                                        }
                                    }else{
                                ?>
                                        <tr>
                                            <td colspan='3' class="text-center"><?php echo $lang['errors']['no_records_found']; ?></td>
                                        </tr>
                                <?php
                                    }
                                ?>
                            </tbody>
                        </table>
                    </div> 

				</div>
			</div>
		</main>

		<script src="../../vendors/popper/popper.min.js"></script>
        <script src="../../vendors/bootstrap/bootstrap.min.js"></script>
        <script src="../../vendors/anchorjs/anchor.min.js"></script>
        <script src="../../vendors/lodash/lodash.min.js"></script>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=window.scroll"></script>
        <script src="../../assets/js/phoenix.js"></script>
        <script src="../../assets/js/jquery3_6_0.min.js"></script>
        <script src="../../assets/js/customScripts/rooms.js"></script>
	</body>
</html>

<?php
    closeConnectionToDatabase($dbConnection);
?>