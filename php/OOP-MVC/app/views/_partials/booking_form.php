<?php 
	$form = new Form('bookingform', []);
	
	$serviceOptions = $form->getServiceOptions();
	$locations = $form->getLocations();
?>


<form id="bookingform" name="bookingform"  class="form--section form--dark" method="post">
	<input type="hidden" value="send" name="task" />
	<input type="hidden" value="bookingform" name="formName" />
	<input type="hidden" value="default" name="view" />

	<input type="hidden" value="view=general&id=11" name="redirect" />

	<h1 class="form__heading section__heading">Request a Booking</h1>

	<div class="form__group">
		<fieldset>
			<div class="field">
				<label for="input" class="field__label">Name</label>
				<input name="Name" id="input" type="text" class="field__input" data-constraints="@Required">


			</div>

			<div class="field">
				<label for="input2" class="field__label">Email</label>
				<input name="Email" id="input2" type="email" class="field__input" data-constraints="@Required @Email">
			</div>

			<div class="field-group fg-1-2">
				<div class="field">
					<label for="input3" class="field__label">Phone</label>
					<input name="Phone" id="input3" type="number" class="field__input">
				</div>

				<div class="field">
					<label for="datepicker" class="field__label">Date</label>
					<input name="Date" type="text" class="field__input" placeholder="dd/mm/yyyy">

					<i class="icon-calendar-1 field__control"></i>
				</div>
			</div>

			<div class="field">
				<label for="form__location" class="field__label">Location</label>
				
				<select name="form__location" id="form__location" class="field__input" data-constraints="@Selected">
					<option value="n/a">Select your location...</option>

					<?php foreach($locations as $key=>$value): ?>
						<option value="<?php echo $value['location']; ?>"><?php echo $value['location']; ?></option>
					<?php endforeach;?>
				</select>
			</div>
		</fieldset>
		
		<fieldset>
			<div class="field">
				<label for="input5" class="field__label">Type of booking</label>
				
				<select name="Type" id="input5" class="field__input" data-constraints="@Selected">
					<option value="n/a">Select type of booking...</option>
					
					<?php foreach($serviceOptions as $key=>$value): ?>
						<?php 
							$selected = false;

							if($_GET['id'] == $value['id']) {
								$selected = true;
							}
						?>

						<option <?php echo $selected == true ? 'selected': ''; ?> value="<?php echo $value['title']; ?>"><?php echo $value['title']; ?></option>
						}
					<?php endforeach;?>
				</select>
			</div>	
						
			<div class="field">
				<label class="field__label" for="textarea">Details</label>
				
				<textarea name="Details" class="field__input" name="" id="textarea" cols="30" rows="10" placeholder="Please enter some basic details; venue, special requests etc."></textarea>
			</div>				

			<div class="field-group fg-1-3">
				<label class="field__label">Extras</label>

				<ul>
				    <li class="field field--checkbox">
				    	<label class="field__input" for="check1">
							<input name="Extras-Pearls" id="check1" type="checkbox" value="Yes"> Pearls
						</label>
				    </li>
				    <li class="field field--checkbox">
				    	<label class="field__input" for="check2">
							<input name="Extras-Pole" id="check2" type="checkbox" value="Yes"> Pole
						</label>
				    </li>
				    <li class="field field--checkbox">
				    	<label class="field__input" for="check3">
							<input name="Extras-+10" id="check3" type="checkbox" value="Yes"> +10min
						</label>
				    </li>
				</ul>
			</div>
		</fieldset>
	</div>

	<div class="form__submit">
		<button class="btn--submit">
			<input value="send" type="submit">
			<i class="icon-send"></i>
		</button>		
	</div>
</form>