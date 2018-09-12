/* eslint-disable */

$views = [];
$selectedView = undefined;
$schema = JSON.parse(schema);
$authorization = $schema.permission;

var renderTreeView = function(view) {
  if (typeof $selectedView !== 'undefined') {
    $selectedView.rendered = false;
    hideTreeView($selectedView);
  }

  $(view.id).append(view.$tree);//.show();
  view.rendered = true;
  $selectedView = view;
}
var hideTreeView = function(view) {
  if ($selectedView === view) {
    $(view.id).contents().detach();
    view.rendered = false;
    $selectedView = undefined;
    return;
  }
}
var hideRenderTreeViewBtn = function(view) {
  var thisView = view;
  return $(thisView.btnId).on('click', function (e) {
    e.stopPropagation();
    if (thisView.rendered) {
      return hideTreeView(thisView);
    }
    return renderTreeView(thisView);
  });
}

var propagateCheckUncheck = function(view) {
  var $tree = view.$tree;
  $tree.on('nodeChecked', function(event, node) {
    $tree.treeview('expandNode', [ node.nodeId, { silent: true } ]);
    if (typeof node.parentId != "undefined") {
      $tree.treeview('checkNode', [node.parentId, { silent: false }]);
    }
  });
  $tree.on('nodeUnchecked', function(event, node) {
    $tree.treeview('collapseNode', [ node.nodeId, { silent: true } ]);
    if (typeof node['nodes'] != "undefined") {
      for (i in node.nodes) {
        $tree.treeview('uncheckNode', [node.nodes[i].nodeId, { silent: false } ]);
      }
    }
  });
}

// create views for each tree
for (let underlyingTree of $authorization) {
  var treeviewId = '#treeview'
  var btntreeviewId = '#btn-show-tree-' + underlyingTree.id;
  var $tree = $('<div>').treeview({
    data: underlyingTree.tree,
    showIcon: true,
    showCheckbox: true,
  });
  $views[underlyingTree.id] = { id: treeviewId, btnId: btntreeviewId, $tree, rendered: false };
  propagateCheckUncheck($views[underlyingTree.id]);
  hideRenderTreeViewBtn($views[underlyingTree.id]);
}
// create controls for search, check, uncheck, checkAll, uncheckAll
// search 
$(function() {
  // enable disable check/uncheck
  $('#input-check-node').on('keyup', function (e) {
    for (i in $views) { 
      var nodes = $views[i].$tree.treeview('search', [ $('#input-check-node').val(), { ignoreCase: false, exactMatch: false } ]);
      if (nodes.length >= 1) {
        $($views[i].btnId).removeClass('btn-default').addClass('btn-info');
      } else {
        $($views[i].btnId).removeClass('btn-info').addClass('btn-default');
      }
    }
  });
  // Check/uncheck all
  $('#btn-check-all').on('click', function (e) {
    $selectedView.$tree.treeview('checkAll', { silent: false });
  });
      
  $('#btn-uncheck-all').on('click', function (e) {
    $selectedView.$tree.treeview('uncheckAll', { silent: false });
  });
});

function postSubmit(transaction_id, permissions) {
  $.ajax({
    type        :   'POST'  ,
    url         :   '/oauth/authorization/data',
    data        :   JSON.stringify({ allow: true, transaction_id, permissions }),
    contentType :   'application/json',
    success     :   function(result) {
      $('#permission').append("<input type='hidden' name='success' value='ok'/>");
      $('#permission').submit();
    }
  });
}

// submit
$(function() {
  $('#permission').submit(function (e) {
    if ($('#permission input[name="success"]').val() == "ok") {
      console.log($('#permission input[name="success"]').val())
      return;
    }
    e.preventDefault();
    const permissions = [];
    for (i in $views) {
      const view = $views[i];
      const data = view.$tree.data('treeview');
      const name = i;
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
    postSubmit($('#permission input[name="transaction_id"]').val(), permissions)
  });
});
