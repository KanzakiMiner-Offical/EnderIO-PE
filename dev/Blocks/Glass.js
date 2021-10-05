IDRegistry.genBlockID("fusedGlass");
Block.createBlock("fusedGlass", [
  {
    name: "Fused Glass",
    texture: [
	 ["fusedGlassItem", 0]],
    inCreative: true
  }
]);

bakeModel(BlockID.fusedGlass, 0, "fusedGlassItem");

IDRegistry.genBlockID("fusedQuartz");
Block.createBlock("fusedQuartz", [
  {
    name: "Fused Quartz",
    texture: [
	 ["fusedQuartzItem", 0]],
    inCreative: true
  }
]);

bakeModel(BlockID.fusedQuartz, 0, "fusedQuartzItem");


Callback.addCallback("PostLoaded", function() {
  RecipeRegistry.addSmelter({
    ingridient1: { id: 12, data: 0 },
    ingridient2: { id: 12, data: 0 },
    ingridient3: { id: 12, data: 0 },
    result: { id: BlockID.fusedGlass, count: 1, data: 0 },
    time: 800
  });
  RecipeRegistry.addSmelter({
    ingridient1: { id: 406, data: 0 },
    ingridient2: { id: 406, data: 0 },
    ingridient3: { id: 406, data: 0 },
    result: { id: BlockID.fusedQuartz, count: 1, data: 0 },
    time: 800
  });
});