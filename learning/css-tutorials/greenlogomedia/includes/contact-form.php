<!-- BEGIN FORM -->
<fieldset id="contact-menu">

<?php echo
"<form action='/contact-function.php' method='post' id='contact'>
<p><label>your email</label><input type='text' class='field' name='email'></p>
<p><label>kind of work</label><input type='text' class='field' name='subject'></p>
<p><label>how can we help?</label><textarea cols='31' rows='10' class='text-field' name='message'></textarea></p>
<p><input type='submit' value='Submit' class='form-submit-button'></p>
</form>";
?>

</fieldset>
<!-- END FORM -->