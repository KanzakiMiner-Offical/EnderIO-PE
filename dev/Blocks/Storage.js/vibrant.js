IDRegistry.genBlockID("vibrantCapacitorBank");
Block.createBlockWithRotation("vibrantCapacitorBank", [
	{name: "Vibrant Capacitor Bank", texture: [["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrantFront", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0]], inCreative: true}
], "opaque");

Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.vibrantCapacitorBank, count: 1, data: 0}, [
    	"scs",
    	"crc",
	   "scs"
  ], ['s', ItemID.electricalSteel, 0, 'c', ItemID.octadicCapacitor, 0, "r", 152, 0]);
});
var VibrantUI = new UI.StandartWindow({
  standart: {
    header: {text: {text: "Vibrant Capacitor Bank" }},
    inventory: {standart: true},
    background: {standart: true}
  },
  drawing: [
    {type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
  ],
  elements: {
    "energyScale": {type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2},
    "textInfo": {type: "text", x: 500, y: 140, width: 350, height: 30, text: "0/"},
    "slotCharge0": {type: "slot", x: 480, y: 300, bitmap: "chargeSlot"},
    "slotCharge1": {type: "slot", x: 580, y: 300, bitmap: "chargeSlot"},
    "slotCharge2": {type: "slot", x: 680, y: 300, bitmap: "chargeSlot"},
    "slotCharge3": {type: "slot", x: 780, y: 300, bitmap: "chargeSlot"},
  }
});

MachineRegistry.registerPrototype(BlockID.vibrantCapacitorBank, {
  defaultValues: {
    meta: 0
  },
  getGuiScreen: function(){
    return VibrantUI;
  },
  tick: function(){
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    this.container.setText("textInfo", this.data.energy+"/"+this.getEnergyStorage()+" RF");
    
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge0"), "RF", this.data.energy, 2048, 1);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge1"), "RF", this.data.energy, 2048, 1);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge2"), "RF", this.data.energy, 2048, 1);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge3"), "RF", this.data.energy, 2048, 1);
  },
  getEnergyStorage: function(){
    return 25000000;
  },
  energyTick: function(type, src){
		var output = Math.min(25000, this.data.energy);
		this.data.energy += src.add(output) - output;
	},
	destroyBlock: function(coords, player) {
	  var extra;
	  if (this.data.energy > 0) {
	    extra = new ItemExtraData();
	    extra.putInt("energy", this.data.energy);
	  }
	  World.drop(coords.x + .5, coords.y + .5, coords.z + .5, BlockID.vibrantCapacitorBank, 1, 0, extra);
	}
});