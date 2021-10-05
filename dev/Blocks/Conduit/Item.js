IDRegistry.genBlockID("itemConduit");
Block.createBlock("itemConduit", [
  { name: "Item Conduit", texture: [["item_conduit_core", 0]], inCreative: true }
]);

IDRegistry.genBlockID("itemConduitEx");
Block.createBlock("itemConduitEx", [
  { name: "Item Conduit Extractor", texture: [["item_conduit_core_ex", 0]], inCreative: false }
]);

Callback.addCallback("ItemUse", function(coords, item, block) {
  if (item.id == ItemID.itemYetaWrench && block.id == BlockID.itemConduit && Entity.getSneaking(Player.get())) {

    World.setBlock(coords.x, coords.y, coords.z, BlockID.itemConduitEx, 0);

  }
});;
Callback.addCallback("ItemUse", function(coords, item, block) {
  if (item.id == ItemID.itemYetaWrench && block.id == BlockID.itemConduitEx && Entity.getSneaking(Player.get())) {

    World.setBlock(coords.x, coords.y, coords.z, BlockID.itemConduit, 0);

  }
});
