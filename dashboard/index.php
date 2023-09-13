<?php
	// includes
    include("../includes/global.php");
    require_once('../database/dbFunctions.php');
    require_once('../language/'.$lang_folder.'/lang.php');
    require_once('../includes/global_functions.php');

	// start or continue session
	session_start();

	// open connection to the database
	$dbConnection = openConnectionToDatabase();
?>

<!DOCTYPE html>
<html lang="gr-GR" dir="ltr">
  	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo $lang['dashboard']['title']; ?></title>

		<!-- favicos -->
		<link rel="apple-touch-icon" sizes="180x180" href="../assets/img/favicons/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="../assets/img/favicons/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="../assets/img/favicons/favicon-16x16.png">
		<link rel="shortcut icon" type="image/x-icon" href="../assets/img/favicons/favicon.ico">
		<link rel="manifest" href="../assets/img/favicons/manifest.json">
		<meta name="msapplication-TileImage" content="../assets/img/favicons/mstile-150x150.png">
		<meta name="theme-color" content="#ffffff">
        
		<!-- bootstrap icons CDN -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

		<link href="../assets/css/theme.min.css" type="text/css" rel="stylesheet" id="style-default">
		<link href="../assets/css/user.min.css" type="text/css" rel="stylesheet" id="user-style-default">
  	</head>
  	<body>
		<main class="main bg-soft-yellow" id="top">
			<div class="container-fluid px-0" data-layout="container">

				<?php require_once('layouts/sidebar.php'); ?>
				<?php require_once('layouts/topbar.php'); ?>

				<div class="content">

					

				</div>
			</div>
		</main>

		<script src="../vendors/popper/popper.min.js"></script>
        <script src="../vendors/bootstrap/bootstrap.min.js"></script>
        <script src="../vendors/anchorjs/anchor.min.js"></script>
        <script src="../vendors/lodash/lodash.min.js"></script>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=window.scroll"></script>
        <script src="../assets/js/phoenix.js"></script>
	</body>
</html>

<?php
    closeConnectionToDatabase($dbConnection);
?>