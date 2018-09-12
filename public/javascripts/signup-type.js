/* eslint-disable */
function loadUserForm() {
    $.ajax({
      type        :   'GET'  ,
      url         :   '/signup/form/user',
      success     :   function(result) {
          $( "#role-user").addClass("active");
          $( "#role-app").removeClass("active");
          $( "#signup" ).contents().detach();
          $( "#signup" ).append(result);
      }
     });
  }
  function loadAppForm() {
    $.ajax({
      type        :   'GET'  ,
      url         :   '/signup/form/app',
      success     :   function(result) {
        $( "#role-user").removeClass("active");
        $( "#role-app").addClass("active");
        $( "#signup" ).contents().detach();
        $( "#signup" ).append(result);
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