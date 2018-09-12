/* eslint-disable */

function submitProfileForm() {
  var profile = {};
  profile.id = {};
  profile.address = {};
  profile.eaddress = {};
  
  profile.id.fullname = $('#form-profile input[name="fullname"]').val();
  profile.address.street = $('#form-profile input[name="street"]').val();
  profile.address.city = $('#form-profile input[name="city"]').val();
  profile.address.code = $('#form-profile input[name="code"]').val();
  profile.address.departement = $('#form-profile input[name="departement"]').val();
  profile.address.country = $('#form-profile input[name="country"]').val();
  profile.eaddress.email = $('#form-profile input[name="email"]').val();
  profile.eaddress.tel = $('#form-profile input[name="tel"]').val();
  
  $( '#submit-profile' ).attr('disabled', true);

  $( '#info-edit-profile' ).remove();
  
  $.ajax({
    type        :   'POST'  ,
    url         :   '/account/user/profile/edit',
    data        :   JSON.stringify({ profile }),
    contentType :   'application/json',
    success     :   function(result) {
      if (result === 'OK') {
        $( '#edit-profile-form' ).append('<div id="info-edit-profile" class="alert alert-success"><strong>Success!</strong> Saved Profile.</div>')
      } else {
        $( '#edit-profile-form' ).append('<div id="info-edit-profile" class="alert alert-warning"><strong>Failed!</strong> Some changes have not been saved.</div>')
      }
    }
  });
}

$(function() {
  $( '#form-profile' ).submit(function(event) {
    event.preventDefault();
    submitProfileForm();
  });
  $( '#form-profile' ).change(function() {
    $( '#submit-profile' ).removeAttr('disabled');
  });
});