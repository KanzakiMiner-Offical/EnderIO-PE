IDRegistry.genBlockID("alloySmelter");
Block.createBlockWithRotation("alloySmelter", [
  {
    name: "Alloy smelter",
    texture: [
	   ["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["alloySmelterFrontOn", 0], ["machineSide", 0], ["machineSide", 0]
	 ],
    inCreative: true
  }
], "opaque");
/*
ICRender.getGroup("item-pipe").add(BlockID.alloySmelter, -1);
ICRender.getGroup("bc-container").add(BlockID.alloySmelter, -1);
*/

var smelterGUI = new UI.StandartWindow({
  standart: {
    header: { text: { text: "Alloy smelter" } },
    inventory: { standart: true },
    background: { standart: true }
  },
  drawing: [
    { type: "bitmap", x: 527, y: 235, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 687, y: 235, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
        //{type: "bitmap", x: 600, y: 170, bitmap: "bar_alloy", scale: 4.5},
    ],
  elements: {
    "progressScale0": { type: "scale", x: 527, y: 235, direction: 1, bitmap: "fire_scale1", scale: 3.2 },
    "progressScale1": { type: "scale", x: 687, y: 235, direction: 1, bitmap: "fire_scale1", scale: 3.2 },
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
    "ingridient1": { type: "slot", x: 520, y: 170 },
    "ingridient2": { type: "slot", x: 600, y: 140 },
    "ingridient3": { type: "slot", x: 680, y: 170 },
    "text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    "slotCapacitor": { type: "slot", x: 325, y: 320 },
    "resultSlot": { type: "slot", x: 600, y: 320 },
    "changeMode": {
      type: "button",
      x: 787,
      y: 300,
      bitmap: "alloy0",
      scale: 2.2,
      clicker: {
        onClick: function(container, tile) {
          tile.data.progress = 0;
          tile.data.mode = (tile.data.mode + 1) % 2;
        }
      }
    }
  }
});

RecipeRegistry.addSmelter({
  ingridient1: { id: 331, data: 0 },
  ingridient2: { id: 265, data: 0 },
  ingridient3: { id: 0, data: 0 },
  result: { id: ItemID.conductiveIron, count: 1, data: 0 },
  time: 500
});
RecipeRegistry.addSmelter({
  ingridient1: { id: 266, data: 0 },
  ingridient2: { id: 331, data: 0 },
  ingridient3: { id: 348, data: 0 },
  result: { id: ItemID.energeticAlloy, count: 1, data: 0 },
  time: 500
});
RecipeRegistry.addSmelter({
  ingridient1: { id: ItemID.energeticAlloy, data: 0 },
  ingridient2: { id: 368, data: 0 },
  ingridient3: { id: 0, data: 0 },
  result: { id: ItemID.vibrantAlloy, count: 1, data: 0 },
  time: 550
});
RecipeRegistry.addSmelter({
  ingridient1: { id: 265, data: 0 },
  ingridient2: { id: 368, data: 0 },
  ingridient3: { id: 0, data: 0 },
  result: { id: ItemID.pulsatingIron, count: 1, data: 0 },
  time: 500
});

Recipes.addShaped({ id: BlockID.alloySmelter, count: 1, data: 0 }, [
    	"ifi",
    	"fmf",
	   "ici"
  ], ['i', 265, 0, 'f', 61, 0, "m", BlockID.machineChassi, 0, "c", 380, 0]);
MachineRegistry.registerPrototype(BlockID.alloySmelter, {
  defaultValues: {
    progress: 0,
    mode: 0,
    work_time: 0,
    speed: 1,
    energy_consumption: 20,
    energy_storage: 100000,
    isActive: false
  },
  oldValues: {
    speed: 1,
    energy_consumption: 20,
    energy_storage: 100000
  },

  upgrades: ["capacitor"],

  getGuiScreen: function() {
    return smelterGUI;
  },

  alloy: function() {
    let ingridient1 = this.container.getSlot("ingridient1");
    let ingridient2 = this.container.getSlot("ingridient2");
    let ingridient3 = this.container.getSlot("ingridient3");
    let resultSlot = this.container.getSlot("resultSlot");

    for (let i in RecipeRegistry.smelter) {
      var Recipe = RecipeRegistry.smelter[i];
      var ingri1 = Recipe.ingridient1;
      var ingri2 = Recipe.ingridient2;
      var ingri3 = Recipe.ingridient3;
      var time = Recipe.time
      var result = Recipe.result
      if (ingridient1.id == ingri1.id && ingridient1.data == ingri1.data && ingridient2.id == ingri2.id && ingridient2.data == ingri2.data && ingridient3.id == ingri3.id && ingridient3.data == ingri3.data) {
        this.data.work_time = time;
        if (this.data.energy >= this.data.energy_consumption) {
          newActive = true;
          this.data.energy -= this.data.energy_consumption;
          this.data.progress += this.data.speed;
          if (this.data.progress >= this.data.work_time) {
            resultSlot.id = result.id;
            resultSlot.data = result.data;
            resultSlot.count += result.count;
            this.data.progress = 0;
            ingridient1.count--;
            ingridient2.count--;
            ingridient3.count--;
          }
        } else {
          this.data.progress = 0;
        }
        if (!newActive)
          // this.stopPlaySound(true);
          this.setActive(newActive);
      }

    }
    this.container.setScale("progressScale0", this.data.progress / result.time);
    this.container.setScale("progressScale1", this.data.progress / result.time);
  },

  furnace: function() {
    let ingridient1 = this.container.getSlot("ingridient1");
    let ingridient2 = this.container.getSlot("ingridient2");
    let ingridient3 = this.container.getSlot("ingridient3");
    let result = this.container.getSlot("result");
    let rec = Recipes.getFurnaceRecipeResult(ingridient1.id, "iron");

    this.container.setScale("progressScale0", this.data.progress / 100 || 0);
    this.container.setScale("progressScale1", this.data.progress / 100 || 0);

    if (rec) {
      if ((result.id == rec.id && result.data == rec.data && result.count <= 64 || result.id == 0)) {
        if (this.data.energy >= this.data.energy_consumption) {
          this.data.energy -= this.data.energy_consumption;
          this.data.progress += this.data.speed;
        }
        if (this.data.progress >= 100) {
          result.id = rec.id;
          result.data = rec.data;
          result.count++;
          this.data.progress = 0;
          ingridient1.count--;
        }
      }
    } else if (this.data.progress > 0) {
      this.data.progress = 0;
      this.container.setScale("progressScale0", 0);
      this.container.setScale("progressScale1", 0);
    }
  },

  resetValues: function() {
    this.data.energy_storage = this.oldValues.energy_storage;
    this.data.energy_consumption = this.oldValues.energy_consumption;
    this.data.speed = this.oldValues.speed;
  },

  tick: function() {
    this.resetValues();
    UpgradeAPI.executeUpgrades(this);

    this.container.validateAll();
    this.container.setScale("energyScale", this.data.energy / this.data.maxEnergyStorage);
    if (this.data.mode === 0) this.alloy();
    if (this.data.mode === 1) this.furnace();

    if (this.container.getGuiContent()) {
      this.container.getGuiContent().elements["changeMode"].bitmap = "alloy" + this.data.mode;
    }
    /*
    let slotCapacitor = this.container.getSlot("capacitorSlot");
    let upgrade = UpgradeAPI.getUpgradeData(slotCapacitor.id);

    if (upgrade) {
      this.data.speed = this.oldValues.speed
      this.data.energy_consumption = this.oldValues.energy_consumption
      this.data.energy_storage = this.oldValues.energyUsage
    }*/
    this.container.setText("text", this.data.energy + "/" + this.data.maxEnergyStorage);

    if (this.data.energy > this.data.maxEnergyStorage) {
      this.data.energy = this.data.maxEnergyStorage
    }

  },
  getEnergyStorage: function() {
    return this.data.maxEnergyStorage;
  },
  energyTick: MachineRegistry.basicEnergyReceiveFunc

});