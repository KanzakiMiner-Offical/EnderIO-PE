IDRegistry.genBlockID("stirlingGen");
Block.createBlockWithRotation("stirlingGen", [
  {
    name: "Stirling Generator",
    texture: [
	["machineBottom", 0], ["machineTop", 0], ["machineSide", 0],
	["stirlingGenFrontOn", 0], ["machineSide", 0], ["machineSide", 0]],
    inCreative: true
  }
], "opaque");

Callback.addCallback("PostLoaded", function() {
  Recipes.addShaped({ id: BlockID.stirlingGen, count: 1, data: 0 },
    ["sss",
     "sfs",
     "gpg"],
    ['s', 4, 0, 'f', 61, 0, 'g', ItemID.basicGear, 0, "p", 33, 0]);
});

var stirlingGenGUI = new UI.StandartWindow({
  standart: {
    header: { text: { text: "Stirling Generator" } },
    inventory: { standart: true },
    background: { standart: true }
  },

  drawing: [
    { type: "bitmap", x: 450, y: 135, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
	],

  elements: {
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, value: 0.5, bitmap: "redflux_bar1", scale: 3.2 },
    "burningScale": { type: "scale", x: 450, y: 135, direction: 1, bitmap: "fire_scale1", scale: 3.2 },
    "slotFuel": { type: "slot", x: 441, y: 180 },
    "text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    "slotCapacitor": { type: "slot", x: 325, y: 320 }
  }
});



MachineRegistry.registerGenerator(BlockID.stirlingGen, {
  defaultValues: {
    burn: 0,
    burnMax: 0,
    bonus: 1,
    isActive: false
  },
  oldValues: {
    bonus: 1
  },
  
  upgrades: ["capacitor"],
  
  getGuiScreen: function() {
    return stirlingGenGUI;
  },
  
  getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if (fuelSlot.id > 0){
			var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				
				return burn;
			}
		}
		return 0;
	},

  resetValues: function(){

		//this.data.energy_storage = 100000
		this.data.bonus = this.oldValues.bonus;
	},
	
	tick: function(){
		this.resetValues();
		UpgradeAPI.executeUpgrades(this);
		  let slotCapacitor = this.container.getSlot("capacitorSlot");
		for(let i in capacitorObj){
			var capac = capacitorObj[i];
    if (slotCapacitor.id != capac) {
      this.data.bonus = this.oldValues.bonus
    }
    }
    this.container.setText("text", "RF: " + this.data.energy + "/" + this.getEnergyStorage() + ". Bonus energy: x" + this.data.bonus + ".0");

    var energyStorage = this.getEnergyStorage();
    this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
    if (this.data.burn <= 0 && this.data.energy + 20 * this.data.bonus < energyStorage) {
      this.data.burn = this.data.burnMax = this.getFuel("slotFuel") / 4;
    }
    if (this.data.burn > 0 && this.data.energy + 20 * this.data.bonus < energyStorage) {
        this.data.energy += 20 * this.data.bonus;
            this.data.burn--;
      this.activate();
    } else{
    	this.deactivate();
    }
    this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
    this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
  },
  getEnergyStorage: function() {
    return 100000;
  },
  energyTick: function(type, src) {
    let output = Math.min(20 * this.data.bonus, this.data.energy);
    this.data.energy += src.add(output) - output;
  }
});


