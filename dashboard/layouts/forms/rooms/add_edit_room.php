<div class="row g-4 mt-3 mb-3">

	<!-- house_id -->
	<div class="col-12 col-sm-6">
		<div class="mb-2 fs-1">
			<i class="bi bi-info-square-fill fs-0" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["rooms"]["house"]; ?>"></i>
			<?php echo $lang["rooms"]["house"]; ?>
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

	<!-- room -->
	<div class="col-12 col-sm-6">
		<div class="mb-2 fs-1">
			<i class="bi bi-info-square-fill fs-0" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["rooms"]["name"]; ?>"></i>
			<?php echo $lang["rooms"]["name"]; ?>
		</div>
		
		<?php $room = ( (isset($room_info["room"])) && ($room_info["room"]!="") )? $room_info["room"] : ""; ?>
		<input type="text" name="room" id="room" class="form-control" value="<?php echo $room; ?>" maxlength="255" required>
	</div>

</div>