/* eslint-disable */
function detach(id) {
    $( id ).contents().detach();   
}
function loadPreviewPermission() {
    $.ajax({
        type        :   'GET'  ,
        url         :   '/account/user/permission/view',
        success     :   function(result) {
            $( '#user-review-permission' ).contents().detach();
            $( '#user-review-permission' ).append(result);
        }
       });
}

function loadEditProfile() {
    $.ajax({
        type        :   'GET'  ,
        url         :   '/account/user/profile/edit',
        success     :   function(result) {
            $( '#user-edit-profile' ).contents().detach();
            $( '#user-edit-profile' ).append(result);
        }
       });
}

function loadImportProfile() {
    $.ajax({
        type        :   'GET'  ,
        url         :   '/account/user/profile/import',
        success     :   function(result) {
            $( '#user-import-profile' ).contents().detach();
            $( '#user-import-profile' ).append(result);
        }
       });
}

$(function() {
    $( '#review-permission' ).click(function() {
      if ($( '#user-review-permission' ).contents().length > 0) {
        return detach('#user-review-permission');
      }
      return loadPreviewPermission();
    });
    $( '#edit-profile' ).click(function() {
      if ($( '#user-edit-profile' ).contents().length > 0) {
        return detach('#user-edit-profile')
      } 
      return loadEditProfile();
    });
    $( '#import-profile' ).click(function() {
      if ($( '#user-import-profile' ).contents().length > 0) {
        return detach('#user-import-profile');
      }
      return loadImportProfile();
    });
});