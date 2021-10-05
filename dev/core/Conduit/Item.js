var FactAPI = {}

FactAPI.render = {
  addStandartWireConnections: function(id) {
    ICRender.getGroup("ic-wire").add(id, -1);
    ICRender.getGroup("rf-wire").add(id, -1);
  },
  addPipeConnections: function(id, item, liquid) {
    if (item) ICRender.getGroup("item-pipe").add(id, -1);
    if (liquid) ICRender.getGroup("liquid-pipe").add(id, -1);
  },
  setupWireasRender: function(id, width, groups) {
    var render = new ICRender.Model();
    BlockRenderer.setStaticICRender(id, 0, render);
    var boxes = [
      { side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2] },
      { side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2] },
      { side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2] },
      { side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2] },
      { side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1] },
      { side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2] },
        ]
    for (var i in groups) {
      var gn = groups[i];
      var group = ICRender.getGroup(gn.name);
      if (gn.add) group.add(id, -1);
      for (var i in boxes) {
        var box = boxes[i];
        var model = BlockRenderer.createModel();
        model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, 0);
        render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], group, 0);
      }
    }
    var model = BlockRenderer.createModel();
    model.addBox(0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, id, 0);
    render.addEntry(model);
    width = Math.max(width, 0.5);
    Block.setBlockShape(id, { x: 0.5 - width / 2, y: 0.5 - width / 2, z: 0.5 - width / 2 }, { x: 0.5 + width / 2, y: 0.5 + width / 2, z: 0.5 + width / 2 });

  }
}

FactAPI.render.addPipeConnections(54, 1);
FactAPI.render.addPipeConnections(61, 1);
FactAPI.render.addPipeConnections(62, 1);
FactAPI.render.addPipeConnections(154, 1);