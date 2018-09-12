/* eslint-disable */
$views = [];
$permissions = new Map();
$newPermissions = new Map();
$removedPermissions = new Map();
$selectedView = undefined;

$counter = 0;
$schema = JSON.parse(schema);

var renderTreeView = function(view) {
  if (typeof $selectedView !== 'undefined') {
    $selectedView.rendered = false;
    hideTreeView($selectedView);
  }
  view.$container.append(view.$tree);//.show();
  view.rendered = true;
  $selectedView = view;
}
var hideTreeView = function(view) {
  if ($selectedView === view) {
    view.$container.contents().detach();
    view.rendered = false;
    $selectedView = undefined;
    return;
  }
}
var propagateCheckUncheck = function(view) {
  var $tree = view.$tree;
  $tree.on('nodeChecked', function(event, node) {
    $( '#submit-desc' ).removeAttr('disabled');
    $tree.treeview('expandNode', [ node.nodeId, { silent: true } ]);
    if (typeof node.parentId != "undefined") {
      $tree.treeview('checkNode', [node.parentId, { silent: false }]);
    }
  });
  $tree.on('nodeUnchecked', function(event, node) {
    $( '#submit-desc' ).removeAttr('disabled');
    $tree.treeview('collapseNode', [ node.nodeId, { silent: true } ]);
    if (typeof node['nodes'] != "undefined") {
      for (i in node.nodes) {
        $tree.treeview('uncheckNode', [node.nodes[i].nodeId, { silent: false } ]);
      }
    }
  });
}
var dynamicPermissionRow = function(permission, options, done) {
  var row = '<div class="form-inline">'
              +'<div class="form-group">'
                +'<label for="'+permission.id+'" class="sr-only">'+permission.id+'</label>'
                +'<input id="'+permission.id+'" class="form-control" type="text" value="'+permission.id+'" '+options.readOnly+'>'
               +'</div>'
              +'<div class="form-group">'
                +'<span class="btn glyphicon glyphicon-trash delete-permission white" id="'+permission.id+'">'
                +'</span>'
              +'</div>'
              +'<div class="form-group">'
                +'<span class="btn glyphicon glyphicon-ok validate-permission white" id="'+permission.id+'"'+options.disabledOK+'>'
                +'</span>'
              +'</div>'
              +'<div class="form-group">'
                +'<span class="btn glyphicon glyphicon-pencil edit-permission white" id="'+permission.id+'" '+options.disabledEdit+'>'
                +'</span>'
              +'</div>'
            +'</div>'
            +'<br>'
  done(null, row);
}
var dynamicPermissionList = function() {
  var rows = '';
  for (let permission of $permissions.values()) {
    dynamicPermissionRow(permission, {readOnly: 'readonly', disabledOK: 'disabled' }, (err, row) => {
      rows = rows + row;
    });  
  }
  for (let permission of $newPermissions.values()) {
    dynamicPermissionRow(permission, {disabledEdit: 'disabled'}, (err, row) => {
      rows = rows + row;
    });  
  }
  $( '#dynamic-permission-list' ).contents().detach();
  $( '#dynamic-permission-list' ).append(rows);

  $( '.delete-permission' ).click(function() {
    if ($newPermissions.get(this.id) || $permissions.get(this.id)) {
      var desc = $newPermissions.get(this.id) || $permissions.get(this.id);
      if (desc) {
        hideTreeView(desc.view);
      }
      if ($newPermissions.get(this.id)) {
        $newPermissions.delete(this.id);
      } else if ($permissions.get(this.id)) {
        $( '#submit-desc' ).removeAttr('disabled');
        $removedPermissions.set(this.id, $permissions.get(this.id));
        $permissions.delete(this.id);
      }
      dynamicPermissionList();
    }
  });
  $( '.edit-permission' ).click(function() {
    var desc = $newPermissions.get(this.id) || $permissions.get(this.id);
    if (desc) {
        var view = desc.view;
        if (view.rendered) {
            return hideTreeView(view);
        }
        return renderTreeView(view);
    }
  });
  $( '.validate-permission' ).click(function() {
    // if new permission add to standard permissions
    if ($newPermissions.get(this.id) && $( 'input[type=text][id='+this.id+']' ).val().length > 0) {
        var newPermission = $newPermissions.get(this.id);
        newPermission.id = $( 'input[type=text][id='+this.id+']' ).val();// change id
        $permissions.set(newPermission.id, newPermission);// put in standard permission set
        $newPermissions.delete(this.id);// remove from new permissions
        dynamicPermissionList();
    }
  });
}
$(function() {
  $('#input-check-node').on('keyup', function (e) {
    if ($selectedView && $selectedView.rendered) {
      $selectedView.$tree.treeview('search', [ $('#input-check-node').val(), { ignoreCase: false, exactMatch: false } ]);
    }
  });
  // Check/uncheck all
  $('#btn-check-selected').on('click', function (e) {
    var nodes = $selectedView.$tree.treeview('search', [ $('#input-check-node').val(), { ignoreCase: false, exactMatch: false } ]);
    console.log(nodes);
    for (let node of nodes) {
      $selectedView.$tree.treeview('checkNode', [ node.nodeId, { silent: false } ]);
    }
  });
      
  $('#btn-uncheck-selected').on('click', function (e) {
    var nodes = $selectedView.$tree.treeview('search', [ $('#input-check-node').val(), { ignoreCase: false, exactMatch: false } ]);
    for (let node of nodes) {
      $selectedView.$tree.treeview('uncheckNode', [ node.nodeId, { silent: false } ]);
    }
  });
  $( '#add-permission' ).click(function() {
    $counter += 1;
    var desc = {id: 'tempPermission-'+$counter, tree: JSON.parse(JSON.stringify($schema.permissionsSchema)) };
    // create tree view
    var $tree = $( '<div>' ).treeview({
      data: desc.tree,// copy
      showIcon: true,
      showCheckbox: true,
    });
    desc.view = {$container: $( '#dynamic-permission-grants' ), $tree, rendered: false };
    propagateCheckUncheck(desc.view);
    // add to permission list
    $newPermissions.set(desc.id, desc);

    // update list
    dynamicPermissionList();
  });
});

for (let desc of $schema.permission) {
  // create tree view
  var $tree = $( '<div>' ).treeview({
    data: desc.tree,
    showIcon: true,
    showCheckbox: true,
  });
  desc.view = {$container: $( '#dynamic-permission-grants' ), $tree, rendered: false };
  propagateCheckUncheck(desc.view);
  // add to permissions list
  $permissions.set(desc.id, desc);
}
dynamicPermissionList();

var postSubmit = function(permissions) {
    $( '#di-info-app-edit-grants' ).remove();
    $.ajax({
      type        :   'POST'  ,
      url         :   '/account/app/settings/grants',
      data        :   JSON.stringify({ permissions }),
      contentType :   'application/json',
      success     :   function(result) {
        if ( result == 'OK') {
          $( '#submit-desc' ).attr('disabled', true);
          $( '#di-app-edit-grants' ).append('<div id="di-info-app-edit-grants" class="alert alert-success"><strong>Success!</strong> Updated Permission Grants.</div>')
        } else {
          $( '#di-app-edit-grants' ).append('<div id="di-info-app-edit-grants" class="alert alert-warning"><strong>Failed!</strong> Some changes have not been saved.</div>')
        }
      }
    });
  }
// submit
$(function() {
    $('#submit-desc').click(function() {
      const permissions = [];
      for (let desc of $permissions.values()) {
        const view = desc.view;
        const data = view.$tree.data('treeview');
        const name = desc.id;
        const permission = {name, group: []};
        const checkedchildren = [];
        const s = {};
        for (let root of $schema.permissionsSchema) {
          const nodes = data.search(root.text, {exactMatch: true, revealResults: false});
          if (nodes[0].state.checked) {
            checkedchildren.push(nodes[0]);
            s[nodes[0].text] = [nodes[0].text];
          }
        }
        let parent = checkedchildren.pop();
        while(parent) {// checked parent
          if (parent.nodes) {
            let branched = false;
            for (let child of parent.nodes) {
              if (child.state.checked) {
                branched = true;
                const branch = Array.from(s[parent.text]);
                branch.push(child.text);
                s[child.text] = branch;
                checkedchildren.push(child);
              }
            }
            if (!branched) {// checked node
              permission.group.push(s[parent.text]);
            }
          } else {// checked leaf
            permission.group.push(s[parent.text]);
          }
          parent = checkedchildren.pop();
        }
        permissions.push(permission);
      }
      postSubmit(permissions)
    });
  });
