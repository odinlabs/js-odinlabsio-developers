/* eslint-disable */
$uris = [];
var saveNewUri = function(id, uri) {
  $( '#di-info-app-edit-settings-oauth' ).remove();
  if ($uris[id] && uri) {
    $uris[id].uri = uri;
    $.ajax({
      type        :   'POST'  ,
      url         :   '/account/app/settings/oauth/adduri',
      data        :   JSON.stringify({ add: [$uris[id].uri] }),
      contentType :   'application/json',
      success     :   function(result) {
        if (result === 'OK') {
          $uris[id].new = false;
          $( '#di-app-edit-settings-oauth' ).append('<div id="di-info-app-edit-settings-oauth" class="alert alert-success"><strong>Success!</strong> Saved new URI.</div>')
        } else {
          $( '#di-app-edit-settings-oauth' ).append('<div id="di-info-app-edit-settings-oauth" class="alert alert-warning"><strong>Failed!</strong> Some changes have not been saved.</div>')
        }
        $uris[id].new = false;
        drawUris();
      }
    });
  }
}
var deleteUri = function(id) {
  $( '#di-info-app-edit-settings-oauth' ).remove();
  if ($uris[id]) {
    $.ajax({
      type        :   'POST'  ,
      url         :   '/account/app/settings/oauth/removeuri',
      data        :   JSON.stringify({ remove: [$uris[id].uri] }),
      contentType :   'application/json',
      success     :   function(result) {
        if (result === 'OK') {
          $uris[id].show = false;
          $( '#di-app-edit-settings-oauth' ).append('<div id="di-info-app-edit-settings-oauth" class="alert alert-success"><strong>Success!</strong> Removed uri.</div>')
        } else {
          $( '#di-app-edit-settings-oauth' ).append('<div id="di-info-app-edit-settings-oauth" class="alert alert-warning"><strong>Failed!</strong> Some changes have not been saved.</div>')
        }
        $uris[id].new = false;
        drawUris();
      }
    });
  }
}
function drawUris() {
  var rows = ''
  var index = 0;
  for (let u of $uris) {
      if (u.show) {
        var readonly = '';
        if (!u.new) {
          readonly = 'readonly="readonly" ';
        }
        rows = rows 
                   +'<div class="col-sm-10">'
                   +  '<div class="input-group">'
                   +    '<div class="input-group-addon">'
                   +      '<span>url-'+index+'</span>'
                   +    '</div>'
                   +    '<input name="'+u.id+'" value="'+u.uri+'" '+readonly+'class="form-control" type="url">'
                   +  '</div>'
                   +'</div>'
        index += 1;
        rows = rows
                   +'<div class="col-sm-1">'
                   +  '<span class="btn glyphicon glyphicon-trash red remove-uri" id="'+u.id+'"></span>'
                   +'</div>'
        if (u.new) {
          rows = rows
                   +'<div class="col-sm-1">'
                   +  '<span class="btn glyphicon glyphicon-ok green validate-uri" id="'+u.id+'"></span>'
                   +'</div>'
        }
      }
  }
  $( '#uris' ).contents().detach();
  $( '#uris' ).append(rows);
  $( '.remove-uri').click(function() {
    if($uris[this.id]) {
      deleteUri(this.id);
    }
  });
  $( '.validate-uri' ).click(function() {
    if($uris[this.id]) {
      saveNewUri(this.id, $( 'input[type=url][name='+this.id+']' ).val());
    }
  });
}

$(function() {
    // parse uris
    for (let uri of JSON.parse(redirectUris)) {
      var id = $uris.length;
      $uris.push({ id, uri, new: false, show: true });
    }
    drawUris();
    $( '#add-uri' ).click(function() {
      var id = $uris.length;
      $uris.push({ id, uri: '', new:true, show:true});
      drawUris();
    });
});
