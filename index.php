<?php
    // includes
    include("includes/global.php");
    require_once('database/dbFunctions.php');
    require_once('language/'.$lang_folder.'/lang.php');
    require_once('includes/global_functions.php');
    require_once('functions.php');

    // start or continue session
    session_start();

    // open database connection
    $dbConnection = openConnectionToDatabase();

    // handle post
    $message = ($_POST)? login() : "";
?>

<!DOCTYPE html>
<html lang="<?php echo $lang_folder; ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title><?php echo $lang["login"]["title"]; ?></title>

        <!-- favicons -->
        <link rel="apple-touch-icon" sizes="180x180" href="assets/img/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicons/favicon-16x16.png">
        <link rel="shortcut icon" type="image/x-icon" href="assets/img/favicons/favicon.ico">
        <meta name="theme-color" content="#ffffff">

        <!-- bootstrap icons CDN -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

        <!-- main css -->
        <link href="assets/css/theme.min.css" type="text/css" rel="stylesheet" id="style-default">
        <link href="assets/css/user.min.css" type="text/css" rel="stylesheet" id="style-default">
		
		<!-- animate library-->
		<link href="assets/css/animate.css" type="text/css" rel="stylesheet" id="style-default">
    </head>
	<body>
        <main class="main bg-soft-yellow" id="top">
            <div class="container-fluid bg-login" data-layout="container" data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="0" data-aos-duration="300" class="aos-init aos-animate">
                <div class="container" >
                    <div class="row flex-center min-vh-100">
                        <div class="col-12 w-max-380px">

							<div class="login-form-container card py-4 px-3" data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="200" data-aos-duration="500" class="aos-init aos-animate">
                                <div class="card-body">
                                    <!-- subtitle -->
                                    <div class="text-center mb-4" data-aos="fade-up" data-aos-delay="300" data-aos-duration="600" class="aos-init aos-animate">
                                        <p class="fs-2 fw-600"><?php echo $lang["login"]["subtitle"]; ?></p>
                                    </div>

                                    <form method="post" action="">
                                        <!-- username -->
                                        <div class="form-floating mb-5 inputbox" class="text-center mb-7" data-aos="fade-up" data-aos-delay="400" data-aos-duration="700" class="aos-init aos-animate">
                                            <input type="text" class="form-control bg-transparent border-0 border-botttom-grey rounded-0 px-0" id="username" name="username" placeholder="<?php echo $lang["login"]["username"]; ?>:" autocomplete="off" required>
                                            <label for="username" class="fs-0"><?php echo $lang["login"]["username"]; ?></label>
                                        </div>

                                        <!-- password -->
                                        <div class="form-floating mb-8" class="text-center mb-7" data-aos="fade-up" data-aos-delay="500" data-aos-duration="600" class="aos-init aos-animate">
                                            <input type="password" class="form-control bg-transparent border-0 border-botttom-grey rounded-0 px-0" id="password" name="password" placeholder="<?php echo $lang["login"]["password"]; ?>:" autocomplete="off" required>
                                            <label for="password" class="fs-0"><?php echo $lang["login"]["password"]; ?></label>
                                        </div>
                                
                                        <!-- submit button -->
                                        <div class="text-center" data-aos="fade-up"  data-aos-delay="600" data-aos-duration="600" class="aos-init aos-animate">
                                            <button type="submit" class="btn btn-secondary mb-3 w-100 bg-effect-orange py-2">
                                                <span class="h4 text-white"><?php echo $lang["login"]["loginBtn"]; ?></span>
                                            </button>
                                        </div>

                                        <?php
                                            if($message != ""){
                                                echo $message;
                                            }
                                        ?>
                                    </form>
                                </div>
							</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
		
		<!-- animate background -->
        <script src="vendors/popper/popper.min.js"></script>
        <script src="vendors/bootstrap/bootstrap.min.js"></script>
        <script src="vendors/anchorjs/anchor.min.js"></script>
        <script src="vendors/lodash/lodash.min.js"></script>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=window.scroll"></script>
        <script src="assets/js/phoenix.js"></script>
		
		<script type="text/javascript" src="assets/js/animate.js"></script>
		<script>
			AOS.init({
				easing: 'ease-out-back',
				duration: 1000
			});
		</script>
	</body>
</html>

<?php
    closeConnectionToDatabase($dbConnection);
?>