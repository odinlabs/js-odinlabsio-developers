/* eslint-disable */
var submitDescForm = function(description, logo) {
  $( '#di-info-app-edit-desc-form' ).remove();
  $.ajax({
      type        :   'POST'  ,
      url         :   '/account/app/profile/description',
      data        :   JSON.stringify({ description, logo}),
      contentType :   'application/json',
      success     :   function(result) {
        if (result === 'OK') {
          $( '#di-app-edit-desc-form' ).append('<div id="di-info-app-edit-desc-form" class="alert alert-success"><strong>Success!</strong> Saved App description.</div>')
        } else {
          $( '#di-app-edit-desc-form' ).append('<div id="di-info-app-edit-desc-form" class="alert alert-warning"><strong>Failed!</strong> Some changes have not been saved.</div>')
        }
      }
  });
}
$(function() {
    $( '#form-desc' ).submit(function(event) {
      event.preventDefault();
      var description = $('#form-desc textarea[name="description"]').val();
      if (description && description.length > 0) {
        submitDescForm(description);
      }
    });
});