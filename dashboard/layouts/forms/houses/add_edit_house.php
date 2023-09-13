<div class="row g-4 mt-3 mb-3">

	<!-- house -->
	<div class="col-12 col-sm-6">
		<div class="mb-2 fs-1">
			<i class="bi bi-info-square-fill fs-0" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["houses"]["name"]; ?>"></i>
			<?php echo $lang["houses"]["name"]; ?>
		</div>
		
		<?php $house = ( (isset($house_info["house"])) && ($house_info["house"]!="") )? $house_info["house"] : ""; ?>
		<input type="text" name="house" id="house" class="form-control" value="<?php echo $house; ?>" maxlength="255" required>
	</div>
    
    <!-- activity -->
	<div class="col-12 col-sm-6">
		<div class="mb-2 fs-1">
			<i class="bi bi-info-square-fill fs-0" data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo $lang["houses"]["activity"]; ?>"></i>
			<?php echo $lang["houses"]["activity"]; ?>
		</div>

		<?php $active = ( (isset($house_info['active'])) && ($house_info['active'] == 1) )? 'selected' : '';?>

		<select class="form-select" name="active">
            <option value="0"><?php echo $lang["general"]["no"]; ?></option>
            <option value="1" <?php echo $active; ?>><?php echo $lang["general"]["yes"]; ?></option>
        </select>
	</div>

</div>