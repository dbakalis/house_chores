<nav class="navbar navbar-light navbar-top navbar-expand vertical-navbar">

	<!-- sidebar logo -->
	<div class="navbar-logo border-0 border-right-white">
		<button class="btn navbar-toggler navbar-toggler-humburger-icon" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation"><span class="navbar-toggle-icon"><span class="toggle-line"></span></span></button>
		
		<span class="text-center text-white w-100">
			<a class="navbar-brand" href="index.php">
				<?php echo $lang['topbar']['title']; ?>
			</a>
		</span>
	</div>

	<!-- top bar items -->
	<div class="collapse navbar-collapse pt-2  border-bottom-black">
		<ul class="navbar-nav navbar-nav-icons ms-auto flex-row gap-2 gap-md-4">

			<!-- home dashboard -->
			<li class="nav-item">
				<a href="<?php echo $glob["root_admin"]; ?>/index.php" class="text-decoration-none">
					<i class="bi bi-house fs-2 text-grey"></i>

					<!-- session username -->
					<span class="pt-2">
						<span class="text-grey fs-0 fw-500">Dashboard</span>
					</span>	
				</a>
			</li>

			<!-- username dropdown -->
			<li class="nav-item dropdown">
				<!-- session username + user icon -->
				<a class="nav-link lh-1 px-0" id="navbarDropdownUser" href="#!" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<!-- user icon -->
					<span class="bi bi-person-fill fs-2 text-grey"></span>

					<!-- session username -->
					<span class="pt-2">
						<span class="text-grey fs-0 fw-500"><?php echo $_SESSION["username"]; ?></span>
						<i class="bi bi-chevron-down"></i>
					</span>		
				</a>
				
				<!-- user dropdown menu -->
				<div class="dropdown-menu dropdown-menu-end py-0 dropdown-profile shadow border border-300" aria-labelledby="navbarDropdownUser">
					<div class="card bg-white position-relative border-0">
						
						<!-- dropdown items -->
						<div class="overflow-auto scrollbar">
							<ul class="nav d-flex flex-column py-1">
								<li class="nav-item">
									<a class="nav-link p-3" href="users/login_log.php"> 
										<i class="bi bi-person-lines-fill fs-2 me-2 text-grey"></i>
										<?php echo $lang["topbar"]["log_sessions"]; ?>
									</a>
								</li>
							</ul>
						</div>

						<!-- log out button -->
						<div class="card-footer p-2 border-0 mb-1">
							<a class="btn btn-secondary d-flex flex-center w-100" href="logout.php">
								<span class="bi bi-box-arrow-left fs-1 me-2"></span> <?php echo $lang["topbar"]["logout"]; ?>
							</a>
						</div>

					</div>
				</div>
			</li>
		</ul>
	</div>
</nav>