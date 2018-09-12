/* eslint-disable */
function detach(id) {
    $( id ).contents().detach();   
}

function loadAppDescription() {
    $.ajax({
        type        :   'GET'  ,
        url         :   '/account/app/profile/description',
        success     :   function(result) {
            $( '#app-edit-desc' ).contents().detach();
            $( '#app-edit-desc' ).append(result);
        }
       });
}

function loadAppGrants() {
    $.ajax({
        type        :   'GET'  ,
        url         :   '/account/app/settings/grants',
        success     :   function(result) {
            $( '#app-edit-grants' ).contents().detach();
            $( '#app-edit-grants' ).append(result);
        }
       });
}

function loadAppSettingsOAuth() {
    $.ajax({
        type        :   'GET'  ,
        url         :   '/account/app/settings/oauth',
        success     :   function(result) {
            $( '#app-edit-settings-oauth' ).contents().detach();
            $( '#app-edit-settings-oauth' ).append(result);
        }
       });
}

$(function() {
    $( '#edit-desc' ).click(function() {
      if ($( '#app-edit-desc' ).contents().length > 0) {
        return detach('#app-edit-desc');
      }
      return loadAppDescription();
    });
    $( '#edit-grants' ).click(function() {
      if ($( '#app-edit-grants' ).contents().length > 0) {
        return detach('#app-edit-grants')
      } 
      return loadAppGrants();
    });
    $( '#edit-settings-oauth' ).click(function() {
      if ($( '#app-edit-settings-oauth' ).contents().length > 0) {
        return detach('#app-edit-settings-oauth')
      } 
      return loadAppSettingsOAuth();
    });
});