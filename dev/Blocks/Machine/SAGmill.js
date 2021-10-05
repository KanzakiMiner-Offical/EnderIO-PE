IDRegistry.genBlockID("sagmill");
Block.createBlockWithRotation("sagmill", [
  {
    name: "SAG Mill",
    texture: [
	   ["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["crusherFront", 0], ["machineSide", 0], ["machineSide", 0]
	 ],
    inCreative: true
  }
], "opaque");
/*
ICRender.getGroup("bc-container").add(BlockID.sagmill, -1);
ICRender.getGroup("item-pipe").add(BlockID.sagmill, -1);

*/
var SAGGui = new UI.StandartWindow({
  standart: {
    header: { text: { text: "SAG Mill" } },
    inventory: { standart: true },
    background: { standart: true }
  },
  drawing: [
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
    { type: "bitmap", x: 595, y: 250, bitmap: "bar_progress_down0", scale: 4.2 },
    { type: "bitmap", x: 765, y: 165, bitmap: "bar_silicon0", scale: 6.8 },
    ],
  elements: {
    "progressScale": { type: "scale", x: 595, y: 250, direction: 3, bitmap: "bar_progress_down1", scale: 4.2 },
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, value: 0.5, bitmap: "redflux_bar1", scale: 3.2 },
    "siliconScale": { type: "scale", x: 765, y: 165, direction: 1, value: 0.5, bitmap: "bar_silicon1", scale: 6.8 },
    "text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    "ingridient": { type: "slot", x: 602, y: 170 },
    "slotSilicon": { type: "slot", x: 700, y: 170 },
    "capacitorSlot": { type: "slot", x: 325, y: 310 },
    "result0": { type: "slot", x: 505, y: 340 },
    "result1": { type: "slot", x: 570, y: 340 },
    "result2": { type: "slot", x: 635, y: 340 },
    "result3": { type: "slot", x: 700, y: 340 }
  }
});

MachineRegistry.registerElectricMachine(BlockID.sagmill, {

  defaultValues: {
    power_tier: 1,
    progress: 0,
    silicon: 0,
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
    return SAGGui;
  },

  getTier: function() {
    return this.data.power_tier;
  },

  resetValues: function() {
    this.data.energy_storage = this.oldValues.energy_storage;
    this.data.energy_consumption = this.oldValues.energy_consumption;
    this.data.speed = this.oldValues.speed;
  },

  tick: function() {
    this.resetValues();
    UpgradeAPI.executeUpgrades(this);

    let ingridient = this.container.getSlot("ingridient");
    let res0 = this.container.getSlot("result0");
    let res1 = this.container.getSlot("result1");
    let res2 = this.container.getSlot("result2");
    let res3 = this.container.getSlot("result3");
    this.container.validateAll();
    this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
    this.container.setScale("siliconScale", this.data.silicon / 10);

    this.container.setText("text", "RF: " + this.data.energy + "/" + this.data.maxEnergyStorage);

    if (this.data.energy > this.data.maxEnergyStorage) {
      this.data.energy = this.data.maxEnergyStorage
    }

    let silicon = this.container.getSlot("slotSilicon");
    if (silicon.id == 318 && this.data.silicon == 0) {
      silicon.count--;
      this.data.silicon += 10;
    }

    for (let i in RecipeRegistry.crusher) {
      let rec = RecipeRegistry.crusher[i];
      this.container.setScale("progressScale", this.data.progress / rec.time);
      // KTRA ĐIỆN NĂNG VÀ OUTPUT
      if (this.data.silicon > 0) {
        if (this.data.energy >= this.data.energy_consumption &&
          (res0.id == rec.result0.id && res0.count < 64 || res0.id == 0) &&
          (res1.id == rec.result1.id && res1.count < 64 || res1.id == 0) &&
          (res2.id == rec.result2.id && res2.count < 64 || res2.id == 0) &&
          (res3.id == rec.result3.id && res3.count < 64 || res3.id == 0) &&
          (ingridient.id == rec.ingridient.id && ingridient.data == rec.ingridient.data)) {

          this.data.progress += this.data.speed;
          this.data.energy -= this.data.energy_consumption;
        }
        if (this.data.progress >= rec.time) {
          ingridient.count--;
          if (Math.random() * 1 <= rec.result0.chance) {
            res0.id = rec.result0.id;
            res0.data = rec.result0.data;
            if (res0.id != 0) res0.count++;
          }
          if (Math.random() * 1 <= rec.result1.chance) {
            res1.id = rec.result1.id;
            res1.data = rec.result1.data;
            if (res1.id != 0) res1.count++;
          }
          if (Math.random() * 1 <= rec.result2.chance) {
            res2.id = rec.result2.id;
            res2.data = rec.result2.data;
            if (res2.id != 0) res2.count++;
          }
          if (Math.random() * 1 <= rec.result3.chance) {
            res3.id = rec.result3.id;
            res3.data = rec.result3.data;
            if (res3.id != 0) res3.count++;
          }

          this.data.progress = 0;
          this.data.silicon--;

        } else {
          this.data.progress = 0;

        }
      }
    }
  },
  getEnergyStorage: function() {
    return this.data.maxEnergyStorage;
  },

  energyTick: MachineRegistry.basicEnergyReceiveFunc
});

Recipes.addShaped({ id: BlockID.sagmill, count: 1, data: 0 }, [
    	"fff",
    	"imi",
	     "ipi"
  ], ['i', 265, 0, 'f', 318, 0, "m", BlockID.machineChassi, 0, "p", 33, 0]);

RecipeRegistry.addCrusher({
  ingridient: { id: BlockID.oreAluminum, data: 0 },
  result0: { id: ItemID.dustAluminum, data: 0, chance: 1 },
  result1: { id: ItemID.dustAluminum, data: 0, chance: 1 },
  result2: { id: 0, data: 0, chance: 0 },
  result3: { id: 4, data: 0, chance: 0.15 },
  time: 180
});

RecipeRegistry.addCrusher({
  ingridient: { id: 49, data: 0 },
  result0: { id: ItemID.dustObsidian, data: 0, chance: 1 },
  result1: { id: ItemID.dustObsidian, data: 0, chance: 1 },
  result2: { id: ItemID.dustObsidian, data: 0, chance: 1 },
  result3: { id: ItemID.dustObsidian, data: 0, chance: 1 },
  time: 200
});

RecipeRegistry.addCrusher({
  ingridient: { id: 14, data: 0 },
  result0: { id: ItemID.dustGold, data: 0, chance: 1 },
  result1: { id: ItemID.dustGold, data: 0, chance: 1 },
  result2: { id: 0, data: 0, chance: 1 },
  result3: { id: ItemID.dustCopper, data: 0, chance: 0.2 },
  time: 180
});

RecipeRegistry.addCrusher({
  ingridient: { id: 15, data: 0 },
  result0: { id: ItemID.dustIron, data: 0, chance: 1 },
  result1: { id: ItemID.dustIron, data: 0, chance: 1 },
  result2: { id: ItemID.dustTin, data: 0, chance: 0.05 },
  result3: { id: ItemID.dustNickel, data: 0, chance: 1 },
  time: 180
});

RecipeRegistry.addCrusher({
  ingridient: { id: 16, data: 0 },
  result0: { id: 263, data: 0, chance: 1 },
  result1: { id: 263, data: 0, chance: 1 },
  result2: { id: 264, data: 0, chance: 0.001 },
  result3: { id: ItemID.dustCoal, data: 0, chance: 0.6 },
  time: 180
});

RecipeRegistry.addCrusher({
  ingridient: { id: 14, data: 0 },
  result0: { id: ItemID.silicon, data: 0, chance: 0.5 },
  result1: { id: 0, data: 0, chance: 1 },
  result2: { id: 0, data: 0, chance: 1 },
  result3: { id: 0, data: 0, chance: 1 },
  time: 80
});

RecipeRegistry.addCrusher({
  ingridient: { id: 4, data: 0 },
  result0: { id: 13, data: 0, chance: 0.7 },
  result1: { id: 13, data: 0, chance: 0.3 },
  result2: { id: 12, data: 0, chance: 0.1 },
  result3: { id: 318, data: 0, chance: 0.05 },
  time: 180
});
