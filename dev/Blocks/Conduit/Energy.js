IDRegistry.genBlockID("powerConduit");
Block.createBlock("powerConduit", [
  { name: "Conductive Iron Conduit", texture: [["powerConduitCore", 0]], inCreative: true }
]);
/*
RF.registerWire(BlockID.powerConduit);

setupConduitRender(BlockID.powerConduit, "conduitOther", "rf-wire", 0.15);
*/
Block.setBlockShape(BlockID.powerConduit, { x: 0.2, y: 0.2, z: 0.2 }, { x: 0.8, y: 0.8, z: 0.8 });

CableRegistry.registerCable("powerConduit", 640);
CableRegistry.setupModel(BlockID.powerConduit, 0.15);