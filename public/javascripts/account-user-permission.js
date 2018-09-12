/* eslint-disable */
$table = [];

function revoke(id) {
  // remove any previous confirmation
  $( '#info-edit-permission' ).remove();
  
  if ($table[id]) {
    $.ajax({
      type        :   'POST'  ,
      url         :   '/account/user/permission/revoke',
      data        :   JSON.stringify({ revoke: $table[id] }),
      contentType :   'application/json',
      success     :   function(result) {
        if (result === 'OK') {
          $table[id].active = false;
          drawTable();
          $( '#edit-permission-table' ).append('<div id="info-edit-permission" class="alert alert-success"><strong>Success!</strong> Updated Permission: '+ $table[id].appName +'/'+ $table[id].permName +'.</div>')
        } else {
          $( '#edit-permission-table' ).append('<div id="info-edit-permission" class="alert alert-warning"><strong>Failed!</strong> Some changes have not been saved.</div>')
        }
      }
    });
  }
}

function drawTable() {
  var header = '<tr><th>#</th><th>Application Name</th><th>Permission Name</th><th>Permission Path</th><th>Last Used</th><th>Active</th><th>Action</th></tr>'
  var rows   = '';
  for (let p of $table) {
    var colorCode = 'class="danger"';
    if (p.active) {
      colorCode = '';
    }
    rows = rows + '<tr '+colorCode+' >'
                  +'<td>'+p.id+'</td>'
                  +'<td> <span class="fa fa-user"></span>  '+p.appName+'</td>'
                  +'<td>'+p.permName+'</td>'
                  +'<td style="word-break:break-all;" >'+p.permPath+'</td>'
                  +'<td>'+p.lastAccess+'</td>'
                  +'<td>'+p.active+'</td>'
                  +'<td><span id="'+p.id+'" class="btn glyphicon glyphicon-trash revoke"></span></td>'
                  +'</tr>'
  }
  var tableBody = '<tbody>'+ header + rows + '</tbody>';
  $( '.table' ).contents().detach();
  $( '.table' ).append(tableBody);
  $(function() {
    $( '.revoke' ).click(function() {
      if ($table[this.id] && $table[this.id].active) {
        revoke(this.id);        
      }
    });
  });
}

// parse permission
let count = 0;
for (let p of JSON.parse(permissions)) {
  p.id = count;
  $table[p.id] = p;
  count += 1;
}
drawTable();

$(function() {
  $( '#createDefaultPermission' ).click(function() {
     // remove any previous confirmation
    $( '#info-edit-permission' ).remove();
    $.ajax({
      type        :   'POST'  ,
      url         :   '/account/user/permission/default/create',
      data        :   JSON.stringify({}),
      contentType :   'application/json',
      success     :   function(result) {
        let count = 0;
        $table = [];
        for (let p of result) {
          p.id = count;
          $table[p.id] = p;
          count += 1;
        }
        drawTable();
      }
    });
  });
});