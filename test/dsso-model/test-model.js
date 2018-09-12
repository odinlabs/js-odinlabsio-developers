const dssomodel = require('../../model').model;

const deliveryThirdParty = {
  name: 'Delivery',
  group: [['Profile', 'Contact', '**']],
};
// permission schema
const permissionSchema = [deliveryThirdParty];

dssomodel.tree(dssomodel.schema, (err, tree) => {
    const data = [];
    for (let desc of permissionSchema) {
        console.log(desc);
        tree.parsePermission(desc, (errParse, permission) => {
            data.push(permission);
        });
    }
    console.log(JSON.stringify(data));
    console.log(tree.root);
})