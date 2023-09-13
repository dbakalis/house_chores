<!-- class show makes them OPEN -->
<nav class="navbar navbar-light navbar-vertical navbar-vibrant navbar-expand-lg">
	<div class="collapse navbar-collapse" id="navbarVerticalCollapse">
		
		<!-- sidebar contents -->
		<div class="navbar-vertical-content scrollbar">
			<ul class="navbar-nav flex-column" id="navbarVerticalNav">
				
				<!-- rooms dropdown -->
				<li class="nav-item">
					<a class="nav-link dropdown-indicator fs-0 fw-normal py-2" href="#houses-sidebar" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="houses-sidebar">
						<div class="d-flex align-items-center">
							<!-- arrow down area -->
							<div class="dropdown-indicator-icon d-flex flex-center"></div>

							<!-- houses icon -->
							<span class="nav-link-icon">
								<span class="bi bi-house"></span>
							</span>

							<!-- text -->
							<span class="nav-link-text"><?php echo $lang["sidebar"]["houses"]; ?></span>
						</div>
					</a>
					<ul class="nav collapse parent" id="houses-sidebar">
						<!-- manage houses -->
						<li class="nav-item">
							<a class="nav-link fs-0 fw-normal my-2" href="<?php echo $glob["root_admin"]; ?>/houses/"  data-bs-toggle="" aria-expanded="false">
								<div class="d-flex align-items-center"><span class="nav-link-text"><?php echo $lang["general"]["view"]; ?></span></div>
							</a>
						</li>

						<!-- add houses -->
						<li class="nav-item">
							<a class="nav-link fs-0 fw-normal my-2" href="<?php echo $glob["root_admin"]; ?>/rooms/add.php"  data-bs-toggle="" aria-expanded="false">
								<div class="d-flex align-items-center"><span class="nav-link-text"><?php echo $lang["general"]["add"]; ?></span></div>
							</a>
						</li>


					</ul>
				</li>
				
				<!-- rooms dropdown -->
				<li class="nav-item">
					<a class="nav-link dropdown-indicator fs-0 fw-normal py-2" href="#rooms-sidebar" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="rooms-sidebar">
						<div class="d-flex align-items-center">
							<!-- arrow down area -->
							<div class="dropdown-indicator-icon d-flex flex-center"></div>

							<!-- categories icon -->
							<span class="nav-link-icon">
								<span class="bi bi-slash-square"></span>
							</span>

							<!-- text -->
							<span class="nav-link-text"><?php echo $lang["sidebar"]["rooms"]; ?></span>
						</div>
					</a>
					<ul class="nav collapse parent" id="rooms-sidebar">
						<!-- manage rooms -->
						<li class="nav-item">
							<a class="nav-link fs-0 fw-normal my-2" href="<?php echo $glob["root_admin"]; ?>/rooms/"  data-bs-toggle="" aria-expanded="false">
								<div class="d-flex align-items-center"><span class="nav-link-text"><?php echo $lang["general"]["view"]; ?></span></div>
							</a>
						</li>

						<!-- add rooms -->
						<li class="nav-item">
							<a class="nav-link fs-0 fw-normal my-2" href="<?php echo $glob["root_admin"]; ?>/rooms/add.php"  data-bs-toggle="" aria-expanded="false">
								<div class="d-flex align-items-center"><span class="nav-link-text"><?php echo $lang["general"]["add"]; ?></span></div>
							</a>
						</li>


					</ul>
				</li>

				<hr class="text-grey">

			</ul>
		</div>

		<!-- copyright (bottom) -->
		<div class="navbar-vertical-footer">
			<a class="btn btn-link border-0 fw-semi-bold d-flex ps-0">
				<span class="navbar-vertical-footer-icon" data-feather="copyright"></span>
				<span>Ⓒ Dimitris 01.2024</span>
			</a>
		</div>

	</div>
</nav>