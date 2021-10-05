IDRegistry.genBlockID("photovoltaicCell");
Block.createBlock("photovoltaicCell", [
  {
    name: "Photovoltaic Cell",
    texture: [
	["solarPanelSide", 0], ["solarPanelTop", 0], ["solarPanelSide", 0]],
    inCreative: true
  }
]);
Block.setBlockShape(BlockID.photovoltaicCell, { x: 0, y: 0, z: 0 }, { x: 1, y: 0.2, z: 1 });

Callback.addCallback("PostLoaded", function() {
  Recipes.addShaped({ id: BlockID.photovoltaicCell, count: 1, data: 0 },
    ["aga",
     "sgs",
     "epe"],
  ['e', ItemID.electricalSteel, 0, 'a', ItemID.energeticAlloy, 0, 's', ItemID.silicon, 0, 'p', 151, 0, 'g', BlockID.fusedQuartz, 0]);
});

MachineRegistry.registerGenerator(BlockID.photovoltaicCell, {
  defaultValues: {
    canSeeSky: false
  },

  tick: function() {
    if (World.getThreadTime() % 100 == 0) {
      this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
    }
    if (this.data.canSeeSky && World.getLightLevel(this.x, this.y + 1, this.z) == 15) {
      this.data.energy += 40;
    }
  },

  getEnergyStorage: function() {
    return 80;
  },

  energyTick: function(type, src){
		var output = Math.min(40, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	
});


IDRegistry.genBlockID("advancedPhotovoltaicCell");
Block.createBlock("advancedPhotovoltaicCell", [
  {
    name: "Advanced Photovoltaic Cell",
    texture: [
	["solarPanelAdvancedSide", 0], ["solarPanelAdvancedTop", 0], ["solarPanelAdvancedSide", 0]],
    inCreative: true
  }
]);
Block.setBlockShape(BlockID.advancedPhotovoltaicCell, { x: 0, y: 0, z: 0 }, { x: 1, y: 0.2, z: 1 });

Callback.addCallback("PostLoaded", function() {
  Recipes.addShaped({ id: BlockID.advancedPhotovoltaicCell, count: 1, data: 0 },
    ["aga",
     "sgs",
     "epe"],
  ['e', ItemID.energeticAlloy, 0, 'a', ItemID.vibrantCrystal, 0, 's', ItemID.pulsatingIron, 0, 'p', 151, 0, 'g', BlockID.fusedQuartz, 0]);
});

MachineRegistry.registerGenerator(BlockID.photovoltaicCell, {
  defaultValues: {
    canSeeSky: false
  },

  tick: function() {
    if (World.getThreadTime() % 100 == 0) {
      this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
    }
    if (this.data.canSeeSky && World.getLightLevel(this.x, this.y + 1, this.z) == 15) {
      this.data.energy += 80;
    }
  },

  getEnergyStorage: function() {
    return 160;
  },

  energyTick: function(type, src) {
    if (this.data.energy) {
      src.add(80);
      this.data.energy = 0;
    }
  }
});





IDRegistry.genBlockID("vibrantPhotovoltaicCell");
Block.createBlock("vibrantPhotovoltaicCell", [
  {
    name: "Vibrant Photovoltaic Cell",
    texture: [
	["solarPanelVibrantSide", 0], ["solarPanelVibrantTop", 0], ["solarPanelVibrantSide", 0]],
    inCreative: true
  }
]);
Block.setBlockShape(BlockID.vibrantPhotovoltaicCell, { x: 0, y: 0, z: 0 }, { x: 1, y: 0.2, z: 1 });


MachineRegistry.registerGenerator(BlockID.photovoltaicCell, {
  defaultValues: {
    canSeeSky: false
  },

  tick: function() {
    if (World.getThreadTime() % 100 == 0) {
      this.data.canSeeSky = GenerationUtils.canSeeSky(this.x, this.y + 1, this.z);
    }
    if (this.data.canSeeSky && World.getLightLevel(this.x, this.y + 1, this.z) == 15) {
      this.data.energy += 160;
    }
  },

  getEnergyStorage: function() {
    return 320;
  },

  energyTick: function(type, src) {
    if (this.data.energy) {
      src.add(160);
      this.data.energy = 0;
    }
  }
});