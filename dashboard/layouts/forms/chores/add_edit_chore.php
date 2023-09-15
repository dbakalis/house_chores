<div class="row g-4 mt-3 mb-3">

    <!-- chore -->
    <div class="col-12 col-md-4">
        <div class="mb-2 fs-1">
			<i class="bi bi-info-square-fill fs-0" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["chores"]["chore"]; ?>"></i>
			<?php echo $lang["chores"]["chore"]; ?>
		</div>
		
		<?php $chore = ( (isset($chore_info["chore"])) && ($chore_info["chore"]!="") )? $chore_info["chore"] : ""; ?>
		<input type="text" name="chore" id="chore" class="form-control" value="<?php echo $chore; ?>" maxlength="255" required>
	</div>

	<!-- house_id -->
	<div class="col-12 col-md-4">
		<div class="mb-2 fs-1">
			<i class="bi bi-info-square-fill fs-0" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["chores"]["house"]; ?>"></i>
			<?php echo $lang["chores"]["house"]; ?>
		</div>

		<select class="form-select" name="house_id" required>
			<option value=""><?php echo $lang["general"]["choose"]; ?></option>
			<?php
				if(!empty($houses_arr)){
					foreach ($houses_arr as $house) {
						$house_id_selected = ( (isset($room_info)) && ($house['id'] == $room_info['house_id']) )? 'selected' : '';
			?>
			            <option value="<?php echo $house['id']; ?>" <?php echo $house_id_selected; ?>><?php echo $house['house']; ?></option>
			<?php
					}
				}
			?>
        </select>
	</div>
    
    <!-- days_of_week -->
	<div class="col-12 col-md-4">
		<div class="mb-2 fs-1">
			<i class="bi bi-info-square-fill fs-0" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["chores"]["days"]; ?>"></i>
			<?php echo $lang["chores"]["days"]; ?>
		</div>
            
		<?php
			if( (isset($lang['days_of_week'])) && (!empty($lang['days_of_week'])) ){
				foreach ($lang['days_of_week'] as $day_key => $day_name) {
		?>
				<div class="row g-3 my-1">
					<div class="col-12 col-md-4">
						<input type="checkbox" id="chk-day-<?php echo $day_key; ?>" class="form-check-input" name="days[<?php echo $day_key; ?>]">
						<label for="chk-day-<?php echo $day_key; ?>"><?php echo $day_name; ?></label>
					</div>

					<div class="col-12 col-md-8">
						<select class="form-select" name="user[<?php echo $day_key; ?>]">
							<option value=""><?php echo $lang["general"]["choose"]; ?></option>
							<?php
								if(!empty($users_arr)){
									foreach ($users_arr as $user) {
							?>
										<option value="<?php echo $user['id']; ?>"><?php echo $user['username']; ?></option>								
							<?php
									}
								}
							?>
						</select>
					</div>
				</div>
		<?php
				}
			}
		?>
	</div>
	

</div>