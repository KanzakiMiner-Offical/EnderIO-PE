IDRegistry.genBlockID("fluidConduit");
Block.createBlock("fluidConduit", [
  { name: "Fluid Conduit", texture: [["liquidConduitCore", 0]], inCreative: true }
]);

IDRegistry.genBlockID("fluidConduitEx");
Block.createBlock("fluidConduitEx", [
  { name: "Fluid Conduit Extractor", texture: [["liquidConduitExtract", 0]], inCreative: false }
]);

Callback.addCallback("ItemUse", function(coords, item, block) {
  if (item.id == ItemID.itemYetaWrench && block.id == BlockID.fluidConduit && Entity.getSneaking(Player.get())) {

    World.setBlock(coords.x, coords.y, coords.z, BlockID.fluidConduitEx, 0);

  }
});;
Callback.addCallback("ItemUse", function(coords, item, block) {
  if (item.id == ItemID.itemYetaWrench && block.id == BlockID.fluidConduitEx && Entity.getSneaking(Player.get())) {

    World.setBlock(coords.x, coords.y, coords.z, BlockID.fluidConduit, 0);

  }
});

Block.registerDropFunction("fluidConduitEx", function() {
  return [[BlockID.fluidConduit, 1, 0]];
});

PAPI.registerPipe(BlockID.fluidConduit, 200, 0.15, ["liquid-pipe"], true, -1, true, 50)

PAPI.registerPipe(BlockID.fluidConduitEx, 50, 0.15, PAPI.groups, true)
TileEntity.registerPrototype(BlockID.fluidConduitEx, PAPI.registerExtractor(BlockID.fluidConduitEx, 2))