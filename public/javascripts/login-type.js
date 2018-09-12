/* eslint-disable */
function loadUserForm() {
  $.ajax({
    type        :   'GET'  ,
    url         :   '/login/form/user',
    success     :   function(result) {
        $( "#role-user").addClass("active");
        $( "#role-app").removeClass("active");
        $( "#login" ).contents().detach();
        $( "#login" ).append(result);
    }
   });
}
function loadAppForm() {
  $.ajax({
    type        :   'GET'  ,
    url         :   '/login/form/app',
    success     :   function(result) {
      $( "#role-user" ).removeClass("active");
      $( "#role-app" ).addClass("active");
      $( "#login" ).contents().detach();
      $( "#login" ).append(result);
    }
  });
}
// change role
$(function() {
    $('#role-user').click(function() {
      loadUserForm()
    });
    $('#role-app').click(function() {
      loadAppForm()
    });
});