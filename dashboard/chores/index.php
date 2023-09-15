<?php
	// basic includes
    include("../../includes/basic_dashboard_includes.php");

    // local functions
    require_once('functions.php');

    // get chores
    $chores_arr = getChores();

    // get chores on calendar
    $calendar_chores_arr     = getFutureCalendarChores();
    $calendar_chores_ids_arr = (!empty($calendar_chores_arr))? array_column($calendar_chores_arr, "chore_id") : array();
?>

<!DOCTYPE html>
<html lang="gr-GR" dir="ltr">
  	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo $lang['chores']['title']; ?></title>

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
                            <span class="text-dark-blue fs-3 fw-100"><?php echo $lang["chores"]["title"]; ?></span>
                        </div>
                    </div>

                    <!-- chores table -->
                    <div class="table-responsive scrollbar">
                        <table class="table fs--1 table-hover no-more-tables table-striped">
                            <thead>
                                <tr class="text-center align-middle bg-grey-1">
                                    <th scope="col" class="fw-500"><?php echo $lang["general"]["id"]; ?></th>
                                    <th scope="col" class="fw-500"><?php echo $lang["chores"]["house"]; ?></th>
                                    <th scope="col" class="fw-500"><?php echo $lang["chores"]["chore"]; ?></th>
                                    <th scope="col" class="fw-500"><?php echo $lang["general"]["edit"]; ?></th>
                                </tr>
                            </thead>
                            <tbody class="border border-grey">
                                <?php
                                    if(!empty($chores_arr)){
                                        foreach($chores_arr as $chore){
                                            $calendar_chore_index = array_search($chore['id'], $calendar_chores_ids_arr);
                                ?>
                                            <tr class='bg-white text-center align-middle'>
                                                <!-- id -->
                                                <td data-title='<?php echo $lang["general"]["id"]; ?>'>
                                                    <?php echo $chore["id"]; ?>
                                                </td>
                                                
                                                <!-- house -->
                                                <td data-title='<?php echo $lang["chore"]["house"]; ?>'>
                                                    <?php echo $chore["house"]; ?>
                                                </td>
                                                
                                                <!-- chore -->
                                                <td data-title='<?php echo $lang["chore"]["chore"]; ?>'>
                                                    <?php echo $chore["chore"]; ?>
                                                </td>

                                                <!-- edit / delete -->
                                                <td data-title='<?php echo $lang["general"]["edit"]; ?>'>
                                                    <div class="row mx-0 justify-content-center">
                                                        <div class="col-auto">
                                                            <a class="bi bi-pencil-fill text-grey fs-1 cursor-pointer" href="edit.php?id=<?php echo $chore["id"]; ?>" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["general"]["edit"]; ?>"></a>
                                                        </div>

                                                        <?php
                                                            if($calendar_chore_index !== false){
                                                        ?>
                                                                <div class="col-auto">
                                                                    <a class="bi bi-calendar-week-fill text-grey fs-1 cursor-pointer" href="calendar.php?id=<?php echo $chore["id"]; ?>" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["general"]["edit"]; ?>"></a>
                                                                </div>
                                                        <?php  
                                                            }
                                                        ?>

                                                        <div class="col-auto">
                                                            <a class="bi bi-trash text-grey fs-1 cursor-pointer delete-chore" data-chore-id="<?php echo $chore["id"]; ?>" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["general"]["delete"]; ?>"></a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                <?php
                                        }
                                    }else{
                                ?>
                                        <tr>
                                            <td colspan='4' class="text-center"><?php echo $lang['errors']['no_records_found']; ?></td>
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
        <script src="../../assets/js/customScripts/chores.js"></script>
	</body>
</html>

<?php
    closeConnectionToDatabase($dbConnection);
?>