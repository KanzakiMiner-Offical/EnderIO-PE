/*
BUILD INFO:
  dir: dev
  target: main.js
  files: 25
*/



// file: header.js

importLib("energylib", "*");
importLib("ChargeItem", "*");

function rnd(min, max){
	 return Math.floor(Math.random() * (max - min + 1)) + min;
}

LiquidRegistry.registerLiquid("nutrientDistillation", "Nutrient Distillation", ["nutrientDistillation_fluid"]);
LiquidRegistry.registerLiquid("hootch", "Hootch", ["hootch_fluid"]);
LiquidRegistry.registerLiquid("rocketFuel", "Rocket fuel", ["rocketFuel_fluid"]);
LiquidRegistry.registerLiquid("fireWater", "Fire water", ["fireWater_fluid"]);

IDRegistry.genItemID("bucketHootch");
Item.createItem("bucketHootch", "Hootch bucket", {name: "bucketHootch"}, {stack: 1});
LiquidRegistry.registerItem("hootch", {id: 325, data: 0}, {id: ItemID.bucketHootch, data: 0});

IDRegistry.genItemID("bucketNutrient_distillation");
Item.createItem("bucketNutrient_distillation", "Nutrient Distillation", {name: "bucketNutrient_distillation"}, {stack: 1});
LiquidRegistry.registerItem("nutrientDistillation", {id: 325, data: 0}, {id: ItemID.bucketNutrient_distillation, data: 0});

IDRegistry.genItemID("bucketFire_water");
Item.createItem("bucketFire_water", "Fire water bucket", {name: "bucketFire_water"}, {stack: 1});
LiquidRegistry.registerItem("fireWater", {id: 325, data: 0}, {id: ItemID.bucketFire_water, data: 0});

IDRegistry.genItemID("bucketRocket_fuel");
Item.createItem("bucketRocket_fuel", "Rocket fuel bucket", {name: "bucketRocket_fuel"}, {stack: 1});
LiquidRegistry.registerItem("rocketFuel", {id: 325, data: 0}, {id: ItemID.bucketRocket_fuel, data: 0});

function clearAll(from){
  from.id = 0;
  from.count = 0;
  from.data = 0;
}




// file: api/machine.js

const RF = EnergyTypeRegistry.assureEnergyType("RF", 1/4);

var MachineRegistry = {
	 machineIDs: {},
	 isMachine: function(id){
		 return this.machineIDs[id];
  	},
	 registerPrototype: function(id, Prototype){
  ICRender.getGroup("rf-wire").add(id, -1);
	 this.machineIDs[id] = true;
	   	if (Prototype.defaultValues){
			   Prototype.defaultValues.energy = 0;
		  } else {
			   Prototype.defaultValues = {
				  energy: 0
			 };
		}
		  ToolAPI.registerBlockMaterial(id, "stone", 1);
		  Block.setDestroyTime(id, 3);
		  TileEntity.registerPrototype(id, Prototype);
		  EnergyTileRegistry.addEnergyTypeForId(id, RF);
	 },
	 basicEnergyReceiveFunc: function(type, src){
		  var energyNeed = this.getEnergyStorage() - this.data.energy;
		  this.data.energy += src.getAll(energyNeed);
	 }
};




// file: api/machine_recipe.js

const MachineRecipe = {
  crusher: [],
  smelter: {},
  sliceAndSlice: {},
  theVat: {},
  soulBinder: {},
  addCrusher: function(src, res){
    this.crusher.push({
      id: src.id, data: src.data, time: src.time,
      result0: {id: res[0][0], data: res[0][1], chance: res[0][2]},
      result1: {id: res[1][0], data: res[1][1], chance: res[1][2]},
      result2: {id: res[2][0], data: res[2][1], chance: res[2][2]},
      result3: {id: res[3][0], data: res[3][1], chance: res[3][2]},
    });
  },
  getCrusher: function(id,data){
    for(key in this.crusher){
      if(this.crusher[key].id==id&&this.crusher[key].data==data){
        return this.crusher[key];
      }
    }
  },
  addSmelter: function(src, result){
    this.smelter[src[0]+":"+src[1]+":"+src[2]] = {id: result.id, count: result.count, data: result.data, time: result.time}
  },
  getSmelter: function(src1,src2,src3){
    return this.smelter[src1+":"+src2+":"+src3];
  },
  addSliceAndSpliceRecipe: function(src, result){
    this.sliceAndSlice[src[0]+":"+src[1]+":"+src[2]+":"+src[3]+":"+src[4]+":"+src[5]] = {id: result.id, data: result.data}
  },
  getSliceAndSpliceRecipe: function(src){
    return this.sliceAndSlice[src[0]+":"+src[1]+":"+src[2]+":"+src[3]+":"+src[4]+":"+src[5]]
  },
  addVatRecipe: function(src, result){
    this.theVat[src[0][0]+":"+src[0][1]+":"+src[1][0]+":"+src[1][1]] = {liquid: result.liquid, usedLiquid: result.usedLiquid};
  },
  getVatRecipe: function(src0, src1, src2, src3){
    return this.theVat[src0+":"+src1+":"+src2+":"+src3]
  },
  addSoulBinderRecipe: function(src, result){
    this.soulBinder[src[0]+":"+src[1]] = {result: result.id, second: result.second}
  },
  getSoulBinderRecipe: function(src){
    return this.soulBinder[src[0]+":"+src[1]]
  },
};




// file: api/upgrade_api.js

var UpgradeAPI = {
  upgradeItems: {},
  registerUpgradeItem: function(item, values){
    this.upgradeItems[item] = values;
  },
  getUpgradeData: function(id){
    return this.upgradeItems[id];
  }
};




// file: basic/items.js

Item.setItems = function(id, types){
  for(i in types){
    IDRegistry.genItemID(id+types[i]);
    Item.createItem(id+types[i], types[i]+" "+id, {name: id+types[i]}, {stack: 64});
  }
}

IDRegistry.genItemID("basicGear");
Item.createItem("basicGear", "Basic gear", {name: "basicGear"}, {stack: 64});

IDRegistry.genItemID("basicCapacitor");
Item.createItem("basicCapacitor", "Basic capacitor", {name: "basicCapacitor"}, {stack: 64});

Item.setItems("dust", ["Copper", "Iron", "Tin", "Coal", "Gold", "Ender", "Obsidian"]);

Recipes.addIngotRecipe = function(src, out){
  if(ItemID[out]){
    Recipes.addFurnace(src, ItemID[out], 0);
  }
}

IDRegistry.genItemID("binderComposite");
Item.createItem("binderComposite", "Binder composite", {name: "binderComposite"}, {stack: 64});

IDRegistry.genItemID("conduitBinder");
Item.createItem("conduitBinder", "Conduit binder", {name: "conduitBinder"}, {stack: 64});

IDRegistry.genItemID("itemYetaWrench");
Item.createItem("itemYetaWrench", "Yeta wrench", {name: "itemYetaWrench"}, {stack: 1});

IDRegistry.genItemID("silicon");
Item.createItem("silicon", "Silicon", {name: "silicon"}, {stack: 64});

IDRegistry.genItemID("conductiveIron");
Item.createItem("conductiveIron", "Conductive iron", {name: "conductiveIron"}, {stack: 64});

IDRegistry.genItemID("darkSteel");
Item.createItem("darkSteel", "Dark steel", {name: "darkSteel"}, {stack: 64});

IDRegistry.genItemID("electricalSteel");
Item.createItem("electricalSteel", "Electrical steel", {name: "electricalSteel"}, {stack: 64});

IDRegistry.genItemID("energeticAlloy");
Item.createItem("energeticAlloy", "Energetic alloy", {name: "energeticAlloy"}, {stack: 64});

IDRegistry.genItemID("pulsatingIron");
Item.createItem("pulsatingIron", "Pulsating iron", {name: "pulsatingIron"}, {stack: 64});

IDRegistry.genItemID("redstoneAlloy");
Item.createItem("redstoneAlloy", "Redstone alloy", {name: "redstoneAlloy"}, {stack: 64});

IDRegistry.genItemID("soulariumIngot");
Item.createItem("soulariumIngot", "Soularium", {name: "soularium"}, {stack: 64});

IDRegistry.genItemID("vibrantAlloy");
Item.createItem("vibrantAlloy", "Vibrant alloy", {name: "vibrantAlloy"}, {stack: 64});

IDRegistry.genItemID("vibrantNugget");
Item.createItem("vibrantNugget", "Vibrant nugget", {name: "vibrantNugget"}, {stack: 64});

IDRegistry.genItemID("vibrantCrystal");
Item.createItem("vibrantCrystal", "Vibrant crystal", {name: "vibrantCrystal"}, {stack: 64});

IDRegistry.genItemID("enderCrystal");
Item.createItem("enderCrystal", "Ender crystal", {name: "enderCrystal"}, {stack: 64});
Item.setGlint(ItemID.enderCrystal, true);

IDRegistry.genItemID("zombieSkull");
Item.createItem("zombieSkull", "Zombie skull", {name: "zombieSkull"}, {stack: 64});

IDRegistry.genItemID("endermanSkull");
Item.createItem("endermanSkull", "Enderman skull", {name: "endermanSkull"}, {stack: 64});

IDRegistry.genItemID("creeperSkull");
Item.createItem("creeperSkull", "Creeper skull", {name: "creeperSkull"}, {stack: 64});

IDRegistry.genItemID("skeletonSkull");
Item.createItem("skeletonSkull", "Skeleton skull", {name: "skeletonSkull"}, {stack: 64});

IDRegistry.genItemID("doublelayerCapacitor");
Item.createItem("doublelayerCapacitor", "Double-layer capacitor", {name: "doublelayerCapacitor"}, {stack: 64});

IDRegistry.genItemID("octadicCapacitor");
Item.createItem("octadicCapacitor", "Octadic capacitor", {name: "octadicCapacitor"}, {stack: 64});

UpgradeAPI.registerUpgradeItem(ItemID.doublelayerCapacitor, {
  speed: 2, storage: 200000, usage: 80, energyBonus: 2
});

UpgradeAPI.registerUpgradeItem(ItemID.octadicCapacitor, {
  speed: 4, storage: 500000, usage: 160, energyBonus: 4
});

Callback.addCallback("PostLoaded", function(){

Recipes.addShapeless({id: 397, count: 1, data: 0}, [{id: ItemID.skeletonSkull, data: 0}]);
Recipes.addShapeless({id: 397, count: 1, data: 2}, [{id: ItemID.zombieSkull, data: 0}]);
Recipes.addShapeless({id: 397, count: 1, data: 4}, [{id: ItemID.creeperSkull, data: 0}]);

Recipes.addShapeless({id: ItemID.skeletonSkull, count: 1, data: 0}, [{id: 397, data: 0}]);
Recipes.addShapeless({id: ItemID.zombieSkull, count: 1, data: 0}, [{id: 397, data: 2}]);
Recipes.addShapeless({id: ItemID.creeperSkull, count: 1, data: 0}, [{id: 397, data: 4}]);



Recipes.addShapeless({id: ItemID.vibrantNugget, count: 9, data: 0}, [{id: ItemID.vibrantAlloy, data: 0}]);

Recipes.addShaped({id: ItemID.vibrantCrystal, count: 1, data: 0}, [
  	"aaa",
  	"aea",
	 "aaa"
], ['a', ItemID.vibrantNugget, 0, 'e', 388, 0]);

Recipes.addShaped({id: ItemID.vibrantAlloy, count: 1, data: 0}, [
  	"aaa",
  	"aaa",
	 "aaa"
], ['a', ItemID.vibrantNugget, 0]);


Recipes.addShaped({id: ItemID.doublelayerCapacitor, count: 1, data: 0}, [
  	" a ",
  	"cpc",
	 " a "
], ['a', ItemID.energeticAlloy, 0, 'c', ItemID.basicCapacitor, 0, 'p', ItemID.dustCoal, 0]);
  
Recipes.addShaped({id: ItemID.octadicCapacitor, count: 1, data: 0}, [
  	" a ",
  	"cpc",
	 " a "
], ['a', ItemID.vibrantAlloy, 0, 'c', ItemID.doublelayerCapacitor, 0, 'p', 89, 0]);

Recipes.addShaped({id: ItemID.basicGear, count: 1, data: 0}, [
  	"aba",
  	"b b",
	 "aba"
], ['a', 280, 0, 'b', 4, 0]);


Recipes.addShaped({id: ItemID.basicCapacitor, count: 1, data: 0}, [
  	" rn",
  	"rir",
	 "nr "
], ['r', 371, 0, 'n', 331, 0, 'i', 265, 0]);

Recipes.addShaped({id: ItemID.binderComposite, count: 8, data: 0}, [
  	"csc",
  	"scs",
	 "csc"
], ['c', 337, 0, 's', 12, 0]);
Recipes.addFurnace(ItemID.binderComposite, ItemID.conduitBinder, 0);

Recipes.addIngotRecipe(ItemID.dustCopper, "ingotCopper");
Recipes.addIngotRecipe(ItemID.dustTin, "ingotTin");
Recipes.addFurnace(ItemID.dustIron, 265, 0);
Recipes.addFurnace(ItemID.dustGold, 266, 0);

});

IDRegistry.genItemID("skullZombieController");
Item.createItem("skullZombieController", "Zombie controller", {name: "skullZombieController"}, {stack: 64});






// file: basic/glasses.js

importLib("bakeModel","*");

IDRegistry.genBlockID("fusedGlass");
Block.createBlock("fusedGlass", [
  	{name: "Fused glass", texture: [
	 ["fusedGlassItem",0]],
	 inCreative: true}
]);

bakeModel(BlockID.fusedGlass, 0, "fusedGlassItem");

IDRegistry.genBlockID("fusedQuartz");
Block.createBlock("fusedQuartz", [
  	{name: "Fused quartz", texture: [
	 ["fusedQuartzItem",0]],
	 inCreative: true}
]);

bakeModel(BlockID.fusedQuartz, 0, "fusedQuartzItem");


Callback.addCallback("PostLoaded", function(){

  MachineRecipe.addSmelter(
    [12, 12, 12], {id: BlockID.fusedGlass, data: 0, count: 3, time: 800} 
  );
  
  MachineRecipe.addSmelter(
    [406, 406, 406], {id: BlockID.fusedQuartz, data: 0, count: 3, time: 800} 
  );
  
});




// file: basic/resource_blocks.js

Block.createResourceBlock = function(id, name){
  IDRegistry.genBlockID(id+"Block");
  Block.createBlock(id+"Block", [
	   {name: name+" block", texture: [[id+"Block", 0]], inCreative: true}
	 ], "opaque");
	 
	 Callback.addCallback("PostLoaded", function(){
	 Recipes.addShaped({id: BlockID[id+"Block"], count: 1, data: 0}, [
	  "bbb",
	  "bbb",
	  "bbb"
  ], ['b', ItemID[id], 0]);
  Recipes.addShapeless({id: ItemID[id], count: 9, data: 0}, [{id: BlockID[id+"Block"], data: 0}]);
  });
};

Block.createResourceBlock("conductiveIron", "Conductive iron");
Block.createResourceBlock("darkSteel", "Dark steel");
Block.createResourceBlock("electricalSteel", "Electrical steel");
Block.createResourceBlock("soulariumIngot", "Soularium");

IDRegistry.genBlockID("machineChassi");
Block.createBlock("machineChassi", [
  {name: "Machine chassis", texture: [
	   ["machineChassi", 0]
  ], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
Recipes.addShaped({id: BlockID.machineChassi, count: 1, data: 0}, [
  	"aba",
  	"bcb",
	 "aba"
], ['a', 101, -1, 'b', 265, 0, 'c', ItemID.basicCapacitor, 0]);
});





// file: basic/dark_steel.js

importLib("ToolType", "*");

IDRegistry.genItemID("darkSteelHelmet");
IDRegistry.genItemID("darkSteelChestplate");
IDRegistry.genItemID("darkSteelLeggings");
IDRegistry.genItemID("darkSteelBoots");

Item.createArmorItem("darkSteelHelmet", "Dark steel helmet", {name: "darkSteel_helmet", meta: 0}, {type: "helmet", armor: 3, durability: 753, texture: "armor/darkSteel_layer_1.png"});
Item.createArmorItem("darkSteelChestplate", "Dark steel chestplate", {name: "darkSteel_chestplate", meta: 0}, {type: "chestplate", armor: 8, durability: 865, texture: "armor/darkSteel_layer_1.png"});
Item.createArmorItem("darkSteelLeggings", "Dark steel leggings", {name: "darkSteel_leggings", meta: 0}, {type: "leggings", armor: 6, durability: 798, texture: "armor/darkSteel_layer_2.png"});
Item.createArmorItem("darkSteelBoots", "Dark steel boots", {name: "darkSteel_boots", meta: 0}, {type: "boots", armor: 3, durability: 763, texture: "armor/darkSteel_layer_1.png"});


//PICKAXE
ToolType.darkPick = {
	isWeapon: false,
	damage: 3,
	baseDamage: 4,
	blockTypes: ["stone"],
	 onDestroy: function(item){
	   item.data+=80;
  },
  onBroke: function(item){
    return true;
  },
  calcDestroyTime: function(item, coords, block, params, destroyTime, enchant){
    let energy = ChargeItemRegistry.getEnergyStored(item)
    if(energy>=80){
      if(block.id == 49){
        return 2
      }
      let material = ToolAPI.getBlockMaterial(block.id) || {};
		   	 material = material.name;
			   if(material == "stone"){
			     return params.base/2.5
			   }
    }
    return destroyTime
  }
};

ToolAPI.addToolMaterial("darkSteel", {durability: 765, level: 5, efficiency: 5, damage: 7});

IDRegistry.genItemID("pickaxeDarkSteel");
Item.createItem("pickaxeDarkSteel", "Dark pick", {name: "darkSteel_pickaxe"}, {stack: 1});
ToolAPI.setTool(ItemID.pickaxeDarkSteel, "darkSteel",  ToolType.pickaxe);

Item.registerNameOverrideFunction(ItemID.pickaxeDarkSteel, function(item,name){
  return name+"\n"+"§7You can empower this\nwith Vibrant Crystal in Dark Anvil"
});

//empowered

IDRegistry.genItemID("pickaxeDarkSteelEmpowered");
Item.createItem("pickaxeDarkSteelEmpowered", "Dark pick", {name: "darkSteel_pickaxe"}, {stack: 1});
ToolAPI.setTool(ItemID.pickaxeDarkSteelEmpowered, "darkSteel",  ToolType.darkPick);

ChargeItemRegistry.registerItem(ItemID.pickaxeDarkSteelEmpowered, RF, 50000, 0);

Item.registerNameOverrideFunction(ItemID.pickaxeDarkSteelEmpowered, function(item,name){
  return name+"\n"+"§7Empowered: breaks obisdian faster.\nRF:"+ChargeItemRegistry.getEnergyStored(item)+"/"+(Item.getMaxDamage(item.id)-1)
});


//THE ENDER

IDRegistry.genItemID("swordDarkSteel");
Item.createItem("swordDarkSteel", "The ender", {name: "darkSteel_sword"}, {stack: 1});
ToolAPI.setTool(ItemID.swordDarkSteel, "darkSteel",  ToolType.sword);

Item.registerNameOverrideFunction(ItemID.pickaxeDarkSteel, function(item,name){
  return name+"\n"+"§7Increases the chance of \ndropping the head from the mob"
});

Callback.addCallback("EntityDeath", function(ent,attacker,damageType){
  let c = Entity.getPosition(ent);
  let item = Player.getCarriedItem();
  if(item.id==ItemID.swordDarkSteel && Entity.getType(attacker) == 63){
    if(Entity.getType(ent)==32 && Math.random()<=0.4){
      World.drop(c.x+.5,c.y+.5,c.z+.5,ItemID.zombieSkull, 1, 0);
    }
    if(Entity.getType(ent)==33 && Math.random()<=0.4){
      World.drop(c.x+.5,c.y+.5,c.z+.5,ItemID.creeperSkull, 1, 0);
    }
    if(Entity.getType(ent)==34 && Math.random()<=0.4){
      World.drop(c.x+.5,c.y+.5,c.z+.5,ItemID.skeletonSkull, 1, 0);
    }
    if(Entity.getType(ent)==38 && Math.random()<=0.8){
      World.drop(c.x+.5,c.y+.5,c.z+.5,ItemID.endermanSkull, 1, 0);
    }
    if(Entity.getType(ent)==48 && Math.random()<=0.6){
      World.drop(c.x+.5,c.y+.5,c.z+.5,397, 1, 1);
    }
  }
});




// file: misc/soul_vessel.js

IDRegistry.genItemID("soulVesselEmpty");
Item.createItem("soulVesselEmpty", "Soul vessel", {name: "itemSoulVessel"}, {stack: 1});
var SoulVessel = {
  values: {},
  addVesselMob: function(id, mob){
    this.values[id] = mob
  },
  getVesselMob: function(id){
    return this.values[id]
  }
}

var setVessel = function(arg){
  
  IDRegistry.genItemID("soulVessel"+ arg.id);
  Item.createItem("soulVessel"+ arg.id, "Soul vessel ", {name: "itemSoulVesselFull"}, {stack: 1, isTech: true});
  Item.setGlint(ItemID["soulVessel"+arg.id], true);
  
  Item.registerNameOverrideFunction(ItemID["soulVessel"+arg.id], function(item, name){
    return name+"\n§7"+arg.id;
  });
  
  SoulVessel.addVesselMob(ItemID["soulVessel"+arg.id], arg.mob.id)
  
  Callback.addCallback("PlayerAttack",function(player,victim){
    item=Player.getCarriedItem();
    if(item.id==ItemID.soulVesselEmpty&&Entity.getType(victim)==arg.mob.id){
      Entity.remove(victim);
      Player.setCarriedItem(ItemID["soulVessel"+arg.id],1,0);
    }
  });
  
  Callback.addCallback("ItemUse",function(coords){
    item=Player.getCarriedItem();
    if(item.id==ItemID["soulVessel"+arg.id]){
      Entity.spawn(coords.relative.x+.5, coords.relative.y+.5, coords.relative.z+.5, arg.mob.id);
      Player.setCarriedItem(ItemID.soulVesselEmpty,1,0);
    }
  });
}
setVessel({id: "Chicken", mob: {id: 10}}); 
setVessel({id: "Cow", mob: {id: 11}}); 
setVessel({id: "Pig", mob: {id: 12}}); 
setVessel({id: "Sheep", mob: {id: 13}}); 
setVessel({id: "Wolf", mob: {id: 14}}); 
setVessel({id: "Villager", mob: {id: 15}});
setVessel({id: "Moooshrom", mob: {id: 16}});
setVessel({id: "Squid", mob: {id: 17}});
setVessel({id: "Rabbit", mob: {id: 18}});
setVessel({id: "Bat", mob: {id: 19}});
setVessel({id: "Golem", mob: {id: 20}});
setVessel({id: "Snowman", mob: {id: 21}});
setVessel({id: "Ocelot", mob: {id: 22}});
setVessel({id: "Skeleton-horse", mob: {id: 26}});
setVessel({id: "Zombie-horse", mob: {id: 27}});
setVessel({id: "Zombie", mob: {id: 32}});
setVessel({id: "Creeper", mob: {id: 33}});
setVessel({id: "Skeleton", mob: {id: 34}});
setVessel({id: "Spider", mob: {id: 35}});
setVessel({id: "Pigman", mob: {id: 36}});
setVessel({id: "Slime", mob: {id: 37}});
setVessel({id: "Enderman", mob: {id: 38}});
setVessel({id: "Silverfish", mob: {id: 39}});
setVessel({id: "CaveSpider", mob: {id: 40}});
setVessel({id: "Ghast", mob: {id: 41}});
setVessel({id: "Magmacube", mob: {id: 42}});
setVessel({id: "Blaze", mob: {id: 43}});
setVessel({id: "Zombie-villager", mob: {id: 44}});
setVessel({id: "Husk", mob: {id: 47}});
setVessel({id: "Wither-skeleton", mob: {id: 48}});
setVessel({id: "Guardian", mob: {id: 49}});
setVessel({id: "Elder-guardian", mob: {id: 50}});
setVessel({id: "Shulker", mob: {id: 54}});
setVessel({id: "Endermite", mob: {id: 55}});




// file: misc/anvil.js

var Anvil = {
  repairValues: {},
  toolMaterials: {},
  recipes: {},
  addRepairItem: function(id, data, value, material){
    this.repairValues[id+":"+data] = {value: value, material: material}
  },
  getRepairValue: function(id, data){
    return this.repairValues[id+":"+data]
  },
  registerToolMaterial: function(id, material){
    this.toolMaterials[id] = material
  },
  getToolMaterial: function(id){
    return this.toolMaterials[id]
  },
  addRecipe: function(input, item, result, data){
    this.recipes[input] = {item: item, id: result, data: data}
  },
  getRecipe: function(id){
    return this.recipes[id]
  }
};

Anvil.addRepairItem(280, 0, 5, "wood");
Anvil.addRepairItem(264, 0, 80, "diamond");
Anvil.addRepairItem(265, 0, 70, "iron");
Anvil.addRepairItem(266, 0, 30, "gold");
Anvil.addRepairItem(ItemID.darkSteel, 0, 200, "dark_steel");
Anvil.addRecipe(ItemID.pickaxeDarkSteel, ItemID.vibrantCrystal, ItemID.pickaxeDarkSteelEmpowered, Item.getMaxDamage(ItemID.pickaxeDarkSteelEmpowered)-1);
var woodenTools = [268, 269, 270, 271, 290];

for(let i in woodenTools){
  Anvil.registerToolMaterial(woodenTools[i], "wood");
}

var stoneTools = [272, 273, 274, 275, 291];

for(let i in stoneTools){
  Anvil.registerToolMaterial(stoneTools[i], "stone");
}

var ironTools = [256, 257, 258, 267, 292];

for(let i in ironTools){
  Anvil.registerToolMaterial(ironTools[i], "iron");
}

var goldenTools = [283, 284, 285, 286, 294];

for(let i in goldenTools){
  Anvil.registerToolMaterial(goldenTools[i], "gold");
}

var diamondTools = [276, 277, 278, 279, 293];

for(let i in diamondTools){
  Anvil.registerToolMaterial(diamondTools[i], "diamond");
}

IDRegistry.genBlockID("darkSteelAnvil");
Block.createBlock("darkSteelAnvil", [{"name":"Dark anvil","texture":[["darkSteelBlock",0]],"inCreative":true}]);

function setDarkAnvilRender(id, tex){
  var anvilRender = new ICRender.Model();
  BlockRenderer.setStaticICRender(id, 0, anvilRender);
  var model = BlockRenderer.createModel();
  
  model.addBox(2/16, 0/16, 1/16, 14/16, 4/16, 15/16, tex, 0);
  model.addBox(4/16, 4/16, 2/16, 12/16, 5/16, 14/16, tex, 0);
  model.addBox(7/16, 5/16, 3/16, 10/16, 10/16, 13/16, tex, 0);
  model.addBox(3/16, 10/16, 0/16, 13/16, 16/16, 16/16, tex, 0);
  
  anvilRender.addEntry(model);
}

setDarkAnvilRender(BlockID.darkSteelAnvil, "darkSteelBlock");

var darkAnvilGUI = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Dark anvil"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
	  	{type: "bitmap", x: 500, y: 180, bitmap: "anvil_plus", scale: 3.2},
	  	{type: "bitmap", x: 700, y: 180, bitmap: "bar_progress1", scale: 3.2}
	],
	
	elements: {
	   "slotItem": {type: "slot", x: 400, y: 180},
	   "slotSecond": {type: "slot", x: 600, y: 180},
	   "slotOutput": {type: "slot", x: 800, y: 180},
  	}
});

TileEntity.registerPrototype(BlockID.darkSteelAnvil, {
  defaultValues: {
    canTake: false
  },
  getGuiScreen: function(){
    return darkAnvilGUI;
  },
  tick: function(){
    let slotItem = this.container.getSlot("slotItem");
    let slotSecond = this.container.getSlot("slotSecond");
    let slotOutput = this.container.getSlot("slotOutput");
    let toolMaterial = Anvil.getToolMaterial(slotItem.id);
    let repair = Anvil.getRepairValue(slotSecond.id, slotSecond.data);
    let recipe = Anvil.getRecipe(slotItem.id)
    if(toolMaterial && repair && slotOutput.id == 0 && slotItem.count == 1 && slotItem.data > 0 && toolMaterial == repair.material && !this.data.canTake){
      slotOutput.id = slotItem.id
      slotOutput.count = 1;
      slotOutput.data = slotItem.data-repair.value
      this.data.canTake = true;
    } else if(!recipe){
      slotOutput.id = 0
    }
    
    if(toolMaterial && repair && slotOutput.count == 0 && this.data.canTake){
      slotItem.id = 0;
      slotSecond.count--;
      this.container.validateAll();
      this.data.canTake = false;
    }
    
    if(slotOutput.data < 0){
      slotOutput.data = 0
    }
    
    if(recipe){
      if(slotSecond.id == recipe.item && slotOutput.id == 0 && !this.data.canTake){
        this.data.canTake = true
        slotOutput.id = recipe.id
        slotOutput.count = 1
        slotOutput.data = recipe.data
      } else if(slotOutput.id!=0){
        slotOutput.id = 0
      }
      if(World.getThreadTime()%2 == 0 && (slotOutput.id != recipe.id || slotOutput.id == 0) && this.data.canTake){
        slotItem.id = 0;
        slotSecond.count--;
        this.container.validateAll();
        this.data.canTake = false;
      }
    }
  }
});




// file: misc/staff_of_traveling.js

IDRegistry.genItemID("itemTravelStaff");
Item.createItem("itemTravelStaff", "Staff of traveling", {name: "itemTravelStaff"}, {stack: 1});

ChargeItemRegistry.registerItem(ItemID.itemTravelStaff, RF, 250000, 0);

Item.registerNameOverrideFunction(ItemID.itemTravelStaff, function(item,name){
  return name+"\n"+"§7RF:"+ChargeItemRegistry.getEnergyStored(item)+"/"+(Item.getMaxDamage(item.id)-1)
});

Item.registerNoTargetUseFunction("itemTravelStaff", function(item){
  if(ChargeItemRegistry.getEnergyStored(item)>=1500){
    let pos = Player.getPosition();
    let vec = Entity.getLookVector(Player.get());
    let crd = {};
    for(let t = 0; t <= 64; t++){
      crd.x = pos.x + vec.x * t;
      crd.y = pos.y + vec.y * t;
      crd.z = pos.z + vec.z * t;
        if(!GenerationUtils.isTransparentBlock(World.getBlockID(crd.x, crd.y, crd.z))){
          Game.tipMessage("X: "+Math.round(crd.x)+" Y: "+Math.round(crd.y+2)+" Z: "+Math.round(crd.z));
          Entity.setPosition(Player.get(), crd.x, crd.y+2, crd.z);
          Player.setCarriedItem(ItemID.itemTravelStaff, 1, item.data+1500);
        break;
      }
    }
  }
});




// file: misc/reinforced_obsidian.js

var BLOCK_TYPE_WITHERPROOF = Block.createSpecialType({
	 destroytime: 20,
	 explosionres: 1000000,
  	base: 7
}, "opaque");

IDRegistry.genBlockID("blockReinforcedObsidian");
Block.createBlock("blockReinforcedObsidian", [
  {name: "Reinforced obsidian\n§7Witherproof", texture: [
	   ["blockReinforcedObsidian", 0]
  ], inCreative: true}
], BLOCK_TYPE_WITHERPROOF);




// file: machines/generators/stirling.js

IDRegistry.genBlockID("stirlingGen");
Block.createBlockWithRotation("stirlingGen", [
	{name: "Stirling generator", texture: [
	["machineBottom",0] , 	["machineTop",0] , 	["machineSide",0] ,
	["stirlingGenFrontOn",0] , 	["machineSide",0] , 	["machineSide",0]],
	 inCreative: true}
],"opaque");
ICRender.getGroup("item-pipe").add(BlockID.stirlingGen, -1);
ICRender.getGroup("bc-container").add(BlockID.stirlingGen, -1);

Callback.addCallback("PostLoaded",function(){
  Recipes.addShaped({id: BlockID.stirlingGen, count: 1, data: 0}, 
    ["sss",
     "sfs",
     "gpg"],
    ['s', 4, 0, 'f', 61, 0, 'g', ItemID.basicGear, 0, "p", 33, 0]);
});

var stirlingGenGUI = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Stirling Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
	  	{type: "bitmap", x: 450, y: 135, bitmap: "fire_scale0", scale: 3.2},
	  	{type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
	],
	
	elements: {
	 "energyScale": {type: "scale", x: 335, y: 140, direction: 1, value: 0.5, bitmap: "redflux_bar1", scale: 3.2},
		"burningScale": {type: "scale", x: 450, y: 135, direction: 1, bitmap: "fire_scale1", scale: 3.2},
		"slotFuel": {type: "slot", x: 441, y: 180},
  "text": {type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF"},
  "capacitorSlot": {type: "slot", x: 325, y: 320}
	}
});



MachineRegistry.registerPrototype(BlockID.stirlingGen, {
  defaultValues: {
    burn: 0, 	burnMax: 0, bonus: 1
  	},
  oldValues: {
    bonus: 1
  },
  getTransportSlots: function(){
	 	  return {
	 	    input: ["slotFuel"]
	 	  }
  },
	 getGuiScreen: function(){
		  return stirlingGenGUI;
	 },
	 getFuel: function(slotName){
	   	var fuelSlot = this.container.getSlot(slotName);
	     	if (fuelSlot.id > 0){
		  	    let burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
			     if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)){
				      fuelSlot.count--;
				      this.container.validateSlot(slotName);
				      return burn;
			    }
		   }
		 return 0;
	},
	
	tick: function(){
	  let slotCapacitor = this.container.getSlot("capacitorSlot");
   let upgrade = UpgradeAPI.getUpgradeData(slotCapacitor.id);
    
   if(upgrade){
     this.data.bonus = upgrade.energyBonus
   } else {
      this.data.bonus = this.oldValues.bonus
   }
   this.container.setText("text", "RF: "+this.data.energy+"/"+this.getEnergyStorage()+". Bonus energy: x"+this.data.bonus+".0");
    
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
		if(this.data.burn <= 0){
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel") / 4;
		}
		if(this.data.burn > 0){
		  this.data.burn--;
		  if(this.data.energy < energyStorage){
			   this.data.energy = Math.min(this.data.energy + 20*this.data.bonus, energyStorage);
			 }
		}
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
		},
  	isGenerator: function() {
	   	return true;
  	},
	 getEnergyStorage: function(){
	   	return 100000;
  	},
  	energyTick: function(type, src){
		  let output = Math.min(20*this.data.bonus, this.data.energy);
		  this.data.energy += src.add(output) - output;
	 }
});




// file: machines/generators/cells.js

IDRegistry.genBlockID("photovoltaicCell");
Block.createBlock("photovoltaicCell", [
	{name: "Photovoltaic cell", texture: [
	["solarPanelSide",0] , 	["solarPanelTop",0] , 	["solarPanelSide",0]],
	 inCreative: true}
]);
Block.setBlockShape(BlockID.photovoltaicCell, {x: 0, y: 0, z: 0}, {x: 1, y: 0.2, z: 1});

Callback.addCallback("PostLoaded",function(){
  Recipes.addShaped({id: BlockID.photovoltaicCell, count: 1, data: 0}, 
    ["aga",
     "sgs",
     "epe"],
  ['e', ItemID.electricalSteel, 0, 'a', ItemID.energeticAlloy, 0, 's', ItemID.silicon, 0, 'p', 151, 0, 'g', BlockID.fusedQuartz, 0]);
});


MachineRegistry.registerPrototype(BlockID.photovoltaicCell, {
  	isGenerator: function() {
	   	return true;
  	},
  	energyTick: function(type, src){
		  let output = 10;
		  
		  if(World.getLightLevel(this.x, this.y + 1, this.z)==15){
		    src.add(output);
		  }
	 }
});



IDRegistry.genBlockID("advancedPhotovoltaicCell");
Block.createBlock("advancedPhotovoltaicCell", [
	{name: "Advanced photovoltaic cell", texture: [
	["solarPanelAdvancedSide",0] , 	["solarPanelAdvancedTop",0] , 	["solarPanelAdvancedSide",0]],
	 inCreative: true}
]);
Block.setBlockShape(BlockID.advancedPhotovoltaicCell, {x: 0, y: 0, z: 0}, {x: 1, y: 0.2, z: 1});

Callback.addCallback("PostLoaded",function(){
  Recipes.addShaped({id: BlockID.advancedPhotovoltaicCell, count: 1, data: 0}, 
    ["aga",
     "sgs",
     "epe"],
  ['e', ItemID.energeticAlloy, 0, 'a', ItemID.vibrantCrystal, 0, 's', ItemID.pulsatingIron, 0, 'p', 151, 0, 'g', BlockID.fusedQuartz, 0]);
});


MachineRegistry.registerPrototype(BlockID.advancedPhotovoltaicCell, {
  	isGenerator: function() {
	   	return true;
  	},
  	energyTick: function(type, src){
		  let output = 40;
		  
		  if(World.getLightLevel(this.x, this.y + 1, this.z)==15){
		    src.add(output);
		  }
	 }
});



IDRegistry.genBlockID("vibrantPhotovoltaicCell");
Block.createBlock("vibrantPhotovoltaicCell", [
	{name: "Advanced photovoltaic cell", texture: [
	["solarPanelVibrantSide",0] , 	["solarPanelVibrantTop",0] , 	["solarPanelVibrantSide",0]],
	 inCreative: true}
]);
Block.setBlockShape(BlockID.vibrantPhotovoltaicCell, {x: 0, y: 0, z: 0}, {x: 1, y: 0.2, z: 1});


MachineRegistry.registerPrototype(BlockID.vibrantPhotovoltaicCell, {
  	isGenerator: function() {
	   	return true;
  	},
  	energyTick: function(type, src){
		  let output = 160;
		  
		  if(World.getLightLevel(this.x, this.y + 1, this.z)==15){
		    src.add(output);
		  }
	 }
});




// file: machines/SAGMill.js

IDRegistry.genBlockID("sagmill");
Block.createBlockWithRotation("sagmill", [
	 {name: "SAG mill", texture: [
	   ["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["crusherFront", 0], ["machineSide", 0], ["machineSide", 0]
	 ], inCreative: true}
], "opaque");
ICRender.getGroup("bc-container").add(BlockID.sagmill, -1);
ICRender.getGroup("item-pipe").add(BlockID.sagmill, -1);


var SAGGui = new UI.StandartWindow({
  standart: {
    header: {text: {text: "SAG Mill" }},
    inventory: {standart: true},
    background: {standart: true}
  },
    drawing: [
        {type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
        {type: "bitmap", x: 595, y: 250, bitmap: "bar_progress_down0", scale: 4.2},
        {type: "bitmap", x: 765, y: 165, bitmap: "bar_silicon0", scale: 6.8},
    ],
    elements: {
        "progressScale": {type: "scale", x: 595, y: 250, direction: 3, bitmap: "bar_progress_down1", scale: 4.2},
        "energyScale": {type: "scale", x: 335, y: 140, direction: 1, value: 0.5, bitmap: "redflux_bar1", scale: 3.2},
        "siliconScale": {type: "scale", x: 765, y: 165, direction: 1, value: 0.5, bitmap: "bar_silicon1", scale: 6.8},
        "text": {type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF"},
        "ingridient": {type: "slot", x: 602, y: 170},
        "slotSilicon": {type: "slot", x: 700, y: 170},
        "capacitorSlot": {type: "slot", x: 325, y: 310},
        "result0": {type: "slot", x: 505, y: 340},
        "result1": {type: "slot", x: 570, y: 340},
        "result2": {type: "slot", x: 635, y: 340},
        "result3": {type: "slot", x: 700, y: 340}
    }
});

MachineRegistry.registerPrototype(BlockID.sagmill, {
  getGuiScreen: function(){ 
    return SAGGui;
  },
  defaultValues: {
    progress: 0, silicon: 0, standartSpeed: 1, energyUsage: 20, maxEnergyStorage: 100000
  },
  oldValues: {
    standartSpeed: 1, energyUsage: 20, maxEnergyStorage: 100000
  },
  getTransportSlots: function(){
	 	  return {
	 	    input: ["ingridient"],
      output: ["result0","result1","result2","result3"]
	 	  }
	 	},
  tick: function(){
    let ingridient = this.container.getSlot("ingridient");
    let res0 = this.container.getSlot("result0");
    let res1 = this.container.getSlot("result1");
    let res2 = this.container.getSlot("result2");
    let res3 = this.container.getSlot("result3");
    this.container.validateAll();
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    this.container.setScale("siliconScale", this.data.silicon/10);

    let slotCapacitor = this.container.getSlot("capacitorSlot");
    let upgrade = UpgradeAPI.getUpgradeData(slotCapacitor.id);
    
    if(upgrade){
      this.data.standartSpeed = upgrade.speed
      this.data.energyUsage = upgrade.usage
      this.data.maxEnergyStorage = upgrade.storage
    } else {
      this.data.standartSpeed = this.oldValues.standartSpeed
      this.data.energyUsage = this.oldValues.energyUsage
      this.data.maxEnergyStorage = this.oldValues.maxEnergyStorage
    }
    this.container.setText("text", "RF: "+this.data.energy+"/"+this.data.maxEnergyStorage);
    
    if(this.data.energy>this.data.maxEnergyStorage){
      this.data.energy=this.data.maxEnergyStorage
    }
    
    let silicon = this.container.getSlot("slotSilicon");
    if(silicon.id==318&&this.data.silicon==0){
      silicon.count--;
      this.data.silicon+=10;
    }
    
    let rec = MachineRecipe.getCrusher(ingridient.id,ingridient.data);
    if(rec){
      this.container.setScale("progressScale", this.data.progress/rec.time);
      if(this.data.energy>=this.data.energyUsage){
        this.data.progress+=this.data.standartSpeed;
        this.data.energy-=this.data.energyUsage;
      }
      if(this.data.progress>=rec.time && 
        (res0.id == rec.result0.id && res0.count<64 || res0.id == 0) &&
        (res1.id == rec.result1.id && res1.count<64 || res1.id == 0) &&
        (res2.id == rec.result2.id && res2.count<64 || res2.id == 0) &&
        (res3.id == rec.result3.id && res3.count<64 || res3.id == 0) ){
        ingridient.count--;
          if(Math.random()*1<=rec.result0.chance){
            res0.id = rec.result0.id;
            res0.data = rec.result0.data;
            if(res0.id!=0) res0.count++;
          }
          if(Math.random()*1<=rec.result1.chance){
            res1.id = rec.result1.id;
            res1.data = rec.result1.data;
            if(res1.id!=0) res1.count++;
          }
          if(Math.random()*1<=rec.result2.chance){
            res2.id = rec.result2.id;
            res2.data = rec.result2.data;
            if(res2.id!=0) res2.count++;
          }
          if(Math.random()*1<=rec.result3.chance){
            res3.id = rec.result3.id;
            res3.data = rec.result3.data;
            if(res3.id!=0) res3.count++;
          }
          this.container.setScale("progressScale",0/1);
          this.data.progress = 0;
          if(this.data.silicon>0) this.data.silicon--;
        }
      } else { 
        this.data.progress=0;
        this.container.setScale("progressScale",0/1);
      }
  },
  getEnergyStorage: function(){
    return this.data.maxEnergyStorage;
  },
  energyTick: MachineRegistry.basicEnergyReceiveFunc,
});

Callback.addCallback("PostLoaded", function(){
  MachineRecipe.addCrusher(
    {id: 14, data: 0, time: 180},
    [[ItemID.dustGold,0,1], [ItemID.dustGold,0,1], [ItemID.dustCopper,0,.2], [0,0,0]]
  );
  
  MachineRecipe.addCrusher(
    {id: ItemID.ore_sapling_gold, data: 0, time: 80},
    [[ItemID.ore_resin_gold,0,1], [ItemID.ore_acorn_gold,0,1], [ItemID.dustGold,0,.1], [0,0,0]]
  );
  MachineRecipe.addCrusher(
    {id: 15, data: 0, time: 180},
    [[ItemID.dustIron,0,1], [ItemID.dustIron,0,1], [ItemID.dustTin,0,.05], [ItemID.dustNickel,0,.1]]
  );
  MachineRecipe.addCrusher(
    {id: 16, data: 0, time: 180},
    [[263,0,1], [263,0,1], [ItemID.dustCoal,0,.6], [264,0,.001]]
  );
  MachineRecipe.addCrusher(
    {id: 1, data: 0, time: 180},
    [[4,0,1], [13,0,.5], [12,0,.05], [0,0,0]]
  );
  MachineRecipe.addCrusher(
    {id: 4, data: 0, time: 180},
    [[12,0,1], [13,0,.1], [0,0,0], [0,0,0]]
  );
  MachineRecipe.addCrusher(
    {id: 13, data: 0, time: 140},
    [[318,0,1], [12,0,.05], [0,0,0], [0,0,0]]
  );
  MachineRecipe.addCrusher(
    {id: 12, data: 0, time: 80},
    [[ItemID.silicon,0,.5], [0,0,0], [0,0,0], [0,0,0]]
  );


  MachineRecipe.addCrusher(
    {id: 263, data: 0, time: 120},
    [[ItemID.dustCoal,0,1], [ItemID.dustCoal,0,0.1], [ItemID.dustSulfur,0,.1], [0,0,0]]
  );
  
  MachineRecipe.addCrusher(
    {id: BlockID.oreCopper, data: 0, time: 180},
    [[ItemID.dustCopper,0,1], [ItemID.dustCopper,0,1], [ItemID.dustGold,0,.05], [4,0,.15]]
  );
  
  MachineRecipe.addCrusher(
    {id: BlockID.oreTin, data: 0, time: 180},
    [[ItemID.dustTin,0,1], [ItemID.dustTin,0,1], [ItemID.dustIron,0,.05], [4,0,.15]]
  );
  
  MachineRecipe.addCrusher(
    {id: BlockID.oreLead, data: 0, time: 180},
    [[ItemID.dustLead,0,1], [ItemID.dustLead,0,1], [ItemID.dustSilver,0,.1], [4,0,.15]]
  );
  
  MachineRecipe.addCrusher(
    {id: BlockID.oreSilver, data: 0, time: 180},
    [[ItemID.dustSilver,0,1], [ItemID.dustSilver,0,1], [ItemID.dustLead,0,.1], [4,0,.15]]
  );
  
  MachineRecipe.addCrusher(
    {id: BlockID.oreNickel, data: 0, time: 180},
    [[ItemID.dustNick,0,1], [ItemID.dustNickel,0,1], [ItemID.dustPlatinum,0,.1], [4,0,.15]]
  );
  
  MachineRecipe.addCrusher(
    {id: BlockID.oreAluminum, data: 0, time: 180},
    [[ItemID.dustAluminum,0,1], [ItemID.dustAluminum,0,1], [0,0,0], [4,0,.15]]
  );
  
  MachineRecipe.addCrusher(
    {id: BlockID.oreSilver, data: 0, time: 180},
    [[ItemID.dustSilver,0,1], [ItemID.dustSilver,0,1], [ItemID.dustLead,0,.1], [4,0,.15]]
  );
  
  MachineRecipe.addCrusher(
    {id: 49, data: 0, time: 200},
    [[ItemID.dustObsidian,0,1], [ItemID.dustObsidian,0,1], [ItemID.dustObsidian,0,1], [ItemID.dustObsidian,0,1]]
  );
  Recipes.addShaped({id: BlockID.sagmill, count: 1, data: 0}, [
    	"fff",
    	"imi",
	   "ipi"
  ], ['i', 265, 0, 'f', 318, 0, "m", BlockID.machineChassi, 0, "p", 33, 0]);
});




// file: machines/alloy_smelter.js

IDRegistry.genBlockID("alloySmelter");
Block.createBlockWithRotation("alloySmelter", [
	 {name: "Alloy smelter", texture: [
	   ["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["alloySmelterFrontOn", 0], ["machineSide", 0], ["machineSide", 0]
	 ], inCreative: true}
], "opaque");
ICRender.getGroup("item-pipe").add(BlockID.alloySmelter, -1);
ICRender.getGroup("bc-container").add(BlockID.alloySmelter, -1);


var smelterGUI = new UI.StandartWindow({
  standart: {
    header: {text: {text: "Alloy smelter" }},
    inventory: {standart: true},
    background: {standart: true}
  },
    drawing: [
        {type: "bitmap", x: 527, y: 235, bitmap: "fire_scale0", scale: 3.2},
        {type: "bitmap", x: 687, y: 235, bitmap: "fire_scale0", scale: 3.2},
        {type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
        //{type: "bitmap", x: 600, y: 170, bitmap: "bar_alloy", scale: 4.5},
    ],
  elements: {
    "progressScale0": {type: "scale", x: 527, y: 235, direction: 1, bitmap: "fire_scale1", scale: 3.2},
    "progressScale1": {type: "scale", x: 687, y: 235, direction: 1, bitmap: "fire_scale1", scale: 3.2},
    "energyScale": {type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2},
    "ingridient1": {type: "slot", x: 520, y: 170},
    "ingridient2": {type: "slot", x: 600, y: 140},
    "ingridient3": {type: "slot", x: 680, y: 170},
    "text": {type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF"},
    "capacitorSlot": {type: "slot", x: 325, y: 320},
    "result": {type: "slot", x: 600, y: 320},
    "changeMode": {type: "button", x: 787, y: 300, bitmap: "alloy0",scale: 2.2,
		    clicker: {
		      onClick: function(container, tile){
		        tile.data.progress = 0;
		        tile.data.mode = (tile.data.mode + 1) % 2;
			     	}
		    }
    }
  }
});


MachineRegistry.registerPrototype(BlockID.alloySmelter, {
  defaultValues: {
    progress: 0, mode: 0, standartSpeed: 1, energyUsage: 20, maxEnergyStorage: 100000
  },
  oldValues: {
    standartSpeed: 1, energyUsage: 20, maxEnergyStorage: 100000
  },
  	getTransportSlots: function(){
	   	return {
	   	  input: ["ingridient1","ingridient2","ingridient3"],
      output: ["result"]
    }
	 	},
  getGuiScreen: function(){ 
    return smelterGUI;
  },
  alloy: function(){
    let ingridient1 = this.container.getSlot("ingridient1");
    let ingridient2 = this.container.getSlot("ingridient2");
    let ingridient3 = this.container.getSlot("ingridient3");
    let result = this.container.getSlot("result");
    let rec = MachineRecipe.getSmelter(ingridient1.id, ingridient2.id, ingridient3.id);
    
    if(rec){
      this.container.setScale("progressScale0", this.data.progress/rec.time);
      this.container.setScale("progressScale1", this.data.progress/rec.time);
      if((result.id==rec.id&&result.data==rec.data&&result.count+rec.count<=64||result.id==0)){
        if(this.data.energy>=this.data.energyUsage){
          this.data.energy-=this.data.energyUsage;
          this.data.progress+=this.data.standartSpeed;
        }
        if(this.data.progress>=rec.time){
          result.id=rec.id; result.data=rec.data; result.count+=rec.count;
          this.data.progress=0; 
          ingridient1.count--;
          ingridient2.count--;
          ingridient3.count--;
        }
      }
    } else if(this.data.progress>0){
      this.data.progress=0;
      this.container.setScale("progressScale0", 0);
      this.container.setScale("progressScale1", 0);
    }
  },
  furnace: function(){
    let ingridient1 = this.container.getSlot("ingridient1");
    let ingridient2 = this.container.getSlot("ingridient2");
    let ingridient3 = this.container.getSlot("ingridient3");
    let result = this.container.getSlot("result");
    let rec = Recipes.getFurnaceRecipeResult(ingridient1.id, "iron");
    
    this.container.setScale("progressScale0", this.data.progress/100 || 0);
    this.container.setScale("progressScale1", this.data.progress/100 || 0);
    
    if(rec){
      if((result.id==rec.id&&result.data==rec.data&&result.count<=64||result.id==0)){
        if(this.data.energy>=this.data.energyUsage){
          this.data.energy-=this.data.energyUsage;
          this.data.progress+=this.data.standartSpeed;
        }
        if(this.data.progress>=100){
          result.id=rec.id; result.data=rec.data; result.count++;
          this.data.progress=0; 
          ingridient1.count--;
        }
      }
    } else if(this.data.progress>0){
      this.data.progress=0;
      this.container.setScale("progressScale0", 0);
      this.container.setScale("progressScale1", 0);
    }
  },
  tick: function(){
    this.container.validateAll();
    this.container.setScale("energyScale", this.data.energy/this.data.maxEnergyStorage);
    if(this.data.mode === 0) this.alloy();
    if(this.data.mode === 1) this.furnace();
    
    if(this.container.getGuiContent()){
			   this.container.getGuiContent().elements["changeMode"].bitmap="alloy"+this.data.mode;
    }
    
    let slotCapacitor = this.container.getSlot("capacitorSlot");
    let upgrade = UpgradeAPI.getUpgradeData(slotCapacitor.id);
    
    if(upgrade){
      this.data.standartSpeed = upgrade.speed
      this.data.energyUsage = upgrade.usage
      this.data.maxEnergyStorage = upgrade.storage
    } else {
      this.data.standartSpeed = this.oldValues.standartSpeed
      this.data.energyUsage = this.oldValues.energyUsage
      this.data.maxEnergyStorage = this.oldValues.maxEnergyStorage
    }
    this.container.setText("text", this.data.energy+"/"+this.data.maxEnergyStorage);
    
    if(this.data.energy>this.data.maxEnergyStorage){
      this.data.energy=this.data.maxEnergyStorage
    }
    
  },
  getEnergyStorage: function(){
    return this.data.maxEnergyStorage;
  },
  energyTick: MachineRegistry.basicEnergyReceiveFunc,
});

Callback.addCallback("PostLoaded", function(){

  MachineRecipe.addSmelter(
    [331, 265, 0], {id: ItemID.conductiveIron, data: 0, count: 1, time: 500} 
  );
  
  MachineRecipe.addSmelter(
    [266, 331, 348], {id: ItemID.energeticAlloy, data: 0, count: 1, time: 500} 
  );
  
  MachineRecipe.addSmelter(
    [ItemID.energeticAlloy, 368, 0], {id: ItemID.vibrantAlloy, data: 0, count: 1, time: 500} 
  );
  
  MachineRecipe.addSmelter(
    [265, 368, 0], {id: ItemID.pulsatingIron, data: 0, count: 1, time: 500} 
  );
  
  MachineRecipe.addSmelter(
    [265, ItemID.powderCoal, ItemID.silicon], {id: ItemID.electricalSteel, data: 0, count: 1, time: 500} 
  );
  
  MachineRecipe.addSmelter(
    [265, ItemID.powderCoal, 49], {id: ItemID.darkSteel, data: 0, count: 1, time: 1000} 
  );
  
  MachineRecipe.addSmelter(
    [88, 266, 0], {id: ItemID.soulariumIngot, data: 0, count: 1, time: 500} 
  );
  
  MachineRecipe.addSmelter(
    [331, ItemID.silicon, 0], {id: ItemID.redstoneAlloy, data: 0, count: 1, time: 500} 
  );

  Recipes.addShaped({id: BlockID.alloySmelter, count: 1, data: 0}, [
    	"ifi",
    	"fmf",
	   "ici"
  ], ['i', 265, 0, 'f', 61, 0, "m", BlockID.machineChassi, 0, "c", 380, 0]);
});




// file: machines/reservoir.js


IDRegistry.genBlockID("reservoir");
Block.createBlock("reservoir", [
	 {name: "Water reservoir", texture: [
	   ["reservoir", 0]
	 ], inCreative: true}
]);


Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.reservoir, count: 1, data: 0}, [
    	"ggg",
    	"gcg",
	   "ggg"
  ], ['g', 20, 0, 'c', 380, 0
]);
});

//bakeModel(BlockID.reservoir, 0, "reservoir");

TileEntity.registerPrototype(BlockID.reservoir, {
  setBox:function(texture,dataa){
  this.breakAnim();
  this.anim = new Animation.Base(this.x+.5, this.y, this.z+.5)
  let render = new Render(); 
    render.setPart("body", [ 
      {type: "box", 
        coords: {x: 0, y: 0, z: 0}, 
        size: {x: 15, y: dataa, z: 15}
      }
    ]); 
    this.anim.describe({ 
      render:render.getRenderType(),
      skin:texture
    }); 
   
    this.anim.load()
  },
  breakAnim:function(){
    if(this.anim){
      this.anim.destroy();
    }
  },
  destroy: function(){
		  this.breakAnim();
	 },
  created: function(){
    this.liquidStorage.setLimit("water", 16);
  },
  tick: function(){
    if(this.liquidStorage.getAmount("water")>4&&this.liquidStorage.getAmount("water")<16&&World.getThreadTime()%80==0){
      this.liquidStorage.addLiquid("water", 1);
    }
    
    if(World.getThreadTime()%5==0&&this.liquidStorage.getAmount("water")>=1){
      this.setBox("model/water_model.png", this.liquidStorage.getAmount("water"));
    }
  },
  click: function(){
    let item = Player.getCarriedItem();
    let liquid = LiquidRegistry.getItemLiquid(item.id,item.data);
    let empty = LiquidRegistry.getEmptyItem(item.id,item.data);
    
    if(liquid=="water"&&this.liquidStorage.getAmount("water")<16&&!Entity.getSneaking(Player.get())){
      this.liquidStorage.addLiquid("water", 1);
      Player.addItemToInventory(empty.id, 1, empty.data);
      Player.decreaseCarriedItem();
    }
    
    if(LiquidRegistry.getFullItem(item.id,item.data,"water")&&this.liquidStorage.getAmount("water")>0&&Entity.getSneaking(Player.get())){
      this.liquidStorage.getLiquid("water", 1);
      Player.addItemToInventory(LiquidRegistry.getFullItem(item.id,item.data,"water").id, 1, LiquidRegistry.getFullItem(item.id,item.data,"water").data);
      Player.decreaseCarriedItem();
    }
    
    if(Entity.getSneaking(Player.get())) Game.tipMessage(" amount: "+(this.liquidStorage.getAmount("water")*1000)+"/16000");
    Game.prevent();
  }
});




// file: machines/vat.js

IDRegistry.genBlockID("theVat");
Block.createBlock("theVat", [{"name":"The Vat","texture":[["machineBottom",0]],"inCreative":true}]);

function setVatRender(){
var vatRender = new ICRender.Model();
BlockRenderer.setStaticICRender(BlockID.theVat, 0, vatRender);
var model = BlockRenderer.createModel();

  model.addBox(0/16, 0/16, 0/16, 16/16, 4/16, 16/16, "machineBottom", 0);
  model.addBox(9/16, 4/16, 0/16, 16/16, 16/16, 16/16, "machineBottom", 0);
  model.addBox(0/16, 4/16, 0/16, 7/16, 16/16, 16/16, "machineBottom", 0);
  model.addBox(7/16, 4/16, 4/16, 9/16, 11/16, 12/16, "machineBottom", 0);
  model.addBox(7/16, 8/16, 4/16, 9/16, 10/16, 18/16, "machineBottom", 0);
  model.addBox(7/16, 12/16, 4/16, 9/16, 14/16, 12/16, "machineBottom", 0);

  vatRender.addEntry(model);
}

Block.setBlockShape(BlockID.theVat, {"x":0,"y":0,"z":0}, {"x":1,"y":1,"z":1});

setVatRender()

var VatGUI = new UI.StandartWindow({
  standart: {
    header: {text: {text: "The Vat" }},
    inventory: {standart: true},
    background: {standart: true}
  },
  drawing: [
    {type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
    {type: "bitmap", x: 550, y: 130, bitmap: "vat_gui", scale: 4},
    {type: "bitmap", x: 663, y: 440, bitmap: "fire_scale0", scale: 3.2},
  ],
  elements: {
    "energyScale": {type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2},
    "slotInput0": {type: "slot", x: 555, y: 140, bitmap: "empty", isTransparentBackground: true},
    "slotInput1": {type: "slot", x: 753, y: 140, bitmap: "empty", isTransparentBackground: true},
    "liquidScale": {type: "scale", x: 657, y: 225, direction: 1, bitmap: "fluid_scale", scale: 3},
    "progressScale": {type: "scale", x: 663, y: 440, direction: 1, bitmap: "fire_scale1", scale: 3.2},
    "slot2": {type: "slot", x: 740, y: 400, bitmap: "slot_fluid_full"},
    "slot1": {type: "slot", x: 800, y: 400, bitmap: "slot_fluid_empty"},
  }
});

Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.theVat, count: 1, data: 0}, [
      	"ici",
      	"rmr",
	     "ifi"
    ], ['i', ItemID.electricalSteel, 0, 'c', 380, 0, "r", BlockID.reservoir, 0, 'f', 61, 0, "m", BlockID.machineChassi, 0
  ]);
  MachineRecipe.addVatRecipe([[363, 0], [376, 0]], {liquid: "nutrientDistillation", usedLiquid: "water"});
  MachineRecipe.addVatRecipe([[365, 0], [376, 0]], {liquid: "nutrientDistillation", usedLiquid: "water"});
  MachineRecipe.addVatRecipe([[319, 0], [376, 0]], {liquid: "nutrientDistillation", usedLiquid: "water"});
  MachineRecipe.addVatRecipe([[367, 0], [353, 0]], {liquid: "nutrientDistillation", usedLiquid: "water"});
  
  MachineRecipe.addVatRecipe([[296, 0], [353, 0]], {liquid: "hootch", usedLiquid: "water"});
  MachineRecipe.addVatRecipe([[295, 0], [353, 0]], {liquid: "hootch", usedLiquid: "water"});
  MachineRecipe.addVatRecipe([[392, 0], [353, 0]], {liquid: "hootch", usedLiquid: "water"});
  
  MachineRecipe.addVatRecipe([[377, 0], [331, 0]], {liquid: "fireWater", usedLiquid: "hootch"});
  
  MachineRecipe.addVatRecipe([[289, 0], [331, 0]], {liquid: "rocketFuel", usedLiquid: "hootch"});
});

MachineRegistry.registerPrototype(BlockID.theVat, {
  defaultValues: {
    progress: 0
  },
  getGuiScreen: function(){
    return VatGUI;
  },
  getTransportSlots: function(){
	 	  return {
	 	    input: ["slotInput0, slotInput1"],
    }
	 	},
  init: function(){
    this.liquidStorage.setLimit(null, 1);
  },
  tick: function(){
    this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
    
    let input0 = this.container.getSlot("slotInput0")
    let input1 = this.container.getSlot("slotInput1")
    let storage = this.liquidStorage;
    
    let recipe = MachineRecipe.getVatRecipe(input0.id, input0.data, input1.id, input1.data);
    
    this.container.setScale("progressScale", this.data.progress/1000);
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    
    if(recipe && storage.getLiquidStored() == recipe.usedLiquid && this.data.energy>=40){
      this.data.energy-=40;
      this.data.progress++;
      if(this.data.progress>=1000){
        storage.getLiquid(recipe.usedLiquid, 1);
        storage.addLiquid(recipe.liquid, 1);
        this.data.progress=0;
        
        input0.count--;
        input1.count--;
        
        this.container.validateAll();
      }
    } else this.data.progress=0;



  var liquid = storage.getLiquidStored();
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		
		var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		if(empty && this.data.progress==0 && (!liquid || empty.liquid == liquid)){
			if(storage.getAmount(empty.liquid) <= 15 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
				storage.addLiquid(empty.liquid, 1);
				slot1.count--;
				slot2.id = empty.id;
				slot2.data = empty.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		if(liquid){
			var full = LiquidRegistry.getFullItem(slot1.id, slot1.data, liquid);
			if(full && this.data.progress==0 && storage.getAmount(liquid) >= 1 && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id, full.data) || slot2.id == 0)){
				storage.getLiquid(liquid, 1);
				slot1.count--;
				slot2.id = full.id;
				slot2.data = full.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
  },
  getEnergyStorage: function(){
    return 1000000;
  },
  energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machines/powered_spawner.js

IDRegistry.genBlockID("poweredSpawner");
Block.createBlockWithRotation("poweredSpawner", [{"name":"Powered spawner","texture":[["machineBottom",0], ["machineTop",0], ["machineSide",0], ["poweredSpawnerFront",0], ["machineSide",0], ["machineSide",0]],"inCreative":true}]);

var PoweredSpawnerGUI = new UI.StandartWindow({
  standart: {
    header: {text: {text: "Powered spawner" }},
    inventory: {standart: true},
    background: {standart: true}
  },
  drawing: [
    {type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
    {type: "bitmap", x: 510, y: 260, bitmap: "fire_scale0", scale: 3.2},
  ],
  elements: {
    "energyScale": {type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2},
    "progressScale": {type: "scale", x: 510, y: 260, direction: 1, bitmap: "fire_scale1", scale: 3.2},
    "slotVessel": {type: "slot", x: 500, y: 200},
    "capacitorSlot": {type: "slot", x: 325, y: 320},
    "text": {type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF"},
  }
});

Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.poweredSpawner, count: 1, data: 0}, [
    	"ehe",
    	"ece",
	   "vzv"
  ], ['e', ItemID.electricalSteel, 0, 'c', BlockID.machineChassi, 0, "v", ItemID.vibrantCrystal, 0, "z", ItemID.skullZombieController, 0, "h", 397, -1]);
});

MachineRegistry.registerPrototype(BlockID.poweredSpawner, {
  defaultValues: {
    progress: 0, standartSpeed: 1, energyUsage: 20, maxEnergyStorage: 100000
  },
  oldValues: {
    standartSpeed: 1, energyUsage: 160, maxEnergyStorage: 100000
  },
  getGuiScreen: function(){
    return PoweredSpawnerGUI;
  },
  getSpawnCoords(){
    let X = rnd(this.x, this.x+4);
    let Z = rnd(this.z, this.z+4);
    
    if(GenerationUtils.isTransparentBlock(World.getBlockID(X, this.y, Z))){
      return {x: X, z: Z, canSpawn: true}
    } else return {canSpawn: false}
  },
  tick: function(){
    let slotVessel = this.container.getSlot("slotVessel");
    let vesselMob = SoulVessel.getVesselMob(slotVessel.id);
    this.container.setScale("progressScale", this.data.progress/500)
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    
    if(vesselMob && this.data.energy>=this.data.energyUsage){
      this.data.progress+=this.data.standartSpeed;
      this.data.energy-=this.data.energyUsage;
      if(this.data.progress>=500 && this.getSpawnCoords().canSpawn){
        if(this.getSpawnCoords().canSpawn) Entity.spawn(this.getSpawnCoords().x, this.y, this.getSpawnCoords().z, vesselMob);
        this.data.progress = 0;
      }
    }
    
    if(!vesselMob && this.data.progress>0){
      this.data.progress = 0;
    }
    
    let slotCapacitor = this.container.getSlot("capacitorSlot");
    let upgrade = UpgradeAPI.getUpgradeData(slotCapacitor.id);
    
    if(upgrade){
      this.data.standartSpeed = upgrade.speed
      this.data.energyUsage = upgrade.usage*3
      this.data.maxEnergyStorage = upgrade.storage
    } else {
      this.data.standartSpeed = this.oldValues.standartSpeed
      this.data.energyUsage = this.oldValues.energyUsage
      this.data.maxEnergyStorage = this.oldValues.maxEnergyStorage
    }
    this.container.setText("text", this.data.energy+"/"+this.data.maxEnergyStorage);
    
    if(this.data.energy>this.data.maxEnergyStorage){
      this.data.energy=this.data.maxEnergyStorage
    }
  },
  getEnergyStorage: function(){
    return this.data.maxEnergyStorage;
  },
  energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machines/slice'n'splice.js

IDRegistry.genBlockID("sliceAndSplice");
Block.createBlockWithRotation("sliceAndSplice", [{"name":"Slice 'n' splice","texture":[["blockSoulMachineBottom",0], ["blockSoulMachineTop",0], ["blockSoulMachineSide",0], ["sliceAndSpliceFront",0], ["blockSoulMachineSide",0], ["blockSoulMachineSide",0]],"inCreative":true}]);

var SliceAndSpliceGUI = new UI.StandartWindow({
  standart: {
    header: {text: {text: "Slice 'n' splice" }},
    inventory: {standart: true},
    background: {standart: true}
  },
  drawing: [
    {type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
    {type: "bitmap", x: 630, y: 235, bitmap: "bar_progress0", scale: 3.2},
  ],
  elements: {
    "energyScale": {type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2},
    "progressScale": {type: "scale", x: 630, y: 235, bitmap: "bar_progress2", scale: 3.2},
    "slotInput0": {type: "slot", x: 400, y: 200},
    "slotInput1": {type: "slot", x: 460, y: 200},
    "slotInput2": {type: "slot", x: 520, y: 200},
    "slotInput3": {type: "slot", x: 400, y: 260},
    "slotInput4": {type: "slot", x: 460, y: 260},
    "slotInput5": {type: "slot", x: 520, y: 260},
    "slotOutput": {type: "slot", x: 720, y: 230},
    "slotAxe": {type: "slot", x: 430, y: 140},
    "slotShears": {type: "slot", x: 490, y: 140},
    "capacitorSlot": {type: "slot", x: 325, y: 320},
    "text": {type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF"},
  }
});

Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.sliceAndSplice, count: 1, data: 0}, [
    	"shs",
    	"amc",
	   "sss"
  ], ['s', ItemID.soulariumIngot, 0, 'h', 397, -1, "a", 258, 0, "c", 359, 0, "m", BlockID.machineChassi, 0]);
  
  MachineRecipe.addSliceAndSpliceRecipe(
  [ItemID.soulariumIngot, ItemID.zombieSkull, ItemID.soulariumIngot,
   ItemID.silicon, 331, ItemID.silicon], {id: ItemID.skullZombieController, data: 0}
  );
});

var AXES = {258: true, 271: true, 274: true, 279: true, 286: true}

MachineRegistry.registerPrototype(BlockID.sliceAndSplice, {
  defaultValues: {
    progress: 0, progressMax: 1000, standartSpeed: 1, energyUsage: 80, maxEnergyStorage: 100000
  },
  oldValues: {
    standartSpeed: 1, energyUsage: 160, maxEnergyStorage: 100000
  },
  getGuiScreen: function(){
    return SliceAndSpliceGUI;
  },
  tick: function(){
    this.container.setScale("progressScale", this.data.progress/this.data.progressMax)
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    
    let input0 = this.container.getSlot("slotInput0");
    let input1 = this.container.getSlot("slotInput1");
    let input2 = this.container.getSlot("slotInput2");
    let input3 = this.container.getSlot("slotInput3");
    let input4 = this.container.getSlot("slotInput4");
    let input5 = this.container.getSlot("slotInput5");
    let output = this.container.getSlot("slotOutput");
    let slotAxe = this.container.getSlot("slotAxe");
    let slotShears = this.container.getSlot("slotShears");
    
    let recipe = MachineRecipe.getSliceAndSpliceRecipe([input0.id, input1.id, input2.id, input3.id, input4.id, input5.id])
    
    if(recipe && AXES[slotAxe.id] && slotShears.id == 359 && (output.id == recipe.id && output.count < 64 && output.data == recipe.data || output.id == 0)){
      if(this.data.energy>=this.data.energyUsage){
        this.data.progress+=this.data.standartSpeed;
        this.data.energy-=this.data.energyUsage;
      }
      if(this.data.progress>=this.data.progressMax){
        input0.count--; input1.count--; input2.count--;
        input3.count--; input4.count--; input5.count--;
        output.id = recipe.id;
        output.data = recipe.data;
        output.count++;
        slotAxe.data++;
        slotShears.data++;
        this.data.progress = 0;
        if(Math.random()<=0.05){
          if(rnd(0, 1)==0){
            slotAxe.id = 0
          } else slotShears.id = 0;
        }
        this.container.validateAll();
      }
    } else if(this.data.progress>0) this.data.progress = 0
    
    let slotCapacitor = this.container.getSlot("capacitorSlot");
    let upgrade = UpgradeAPI.getUpgradeData(slotCapacitor.id);
    
    if(upgrade){
      this.data.standartSpeed = upgrade.speed
      this.data.energyUsage = upgrade.usage*2
      this.data.maxEnergyStorage = upgrade.storage
    } else {
      this.data.standartSpeed = this.oldValues.standartSpeed
      this.data.energyUsage = this.oldValues.energyUsage
      this.data.maxEnergyStorage = this.oldValues.maxEnergyStorage
    }
    this.container.setText("text", this.data.energy+"/"+this.data.maxEnergyStorage);
    
    if(this.data.energy>this.data.maxEnergyStorage){
      this.data.energy=this.data.maxEnergyStorage
    }
  },
  getEnergyStorage: function(){
    return this.data.maxEnergyStorage;
  },
  energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machines/soul_binder.js

IDRegistry.genBlockID("soulBinder");
Block.createBlock("soulBinder", [{"name":"Soul binder","texture":[["blockSoulMachineBottom",0], ["blockSoulMachineBottom",0], ["blockSoulBinder",0], ["blockSoulBinder",1], ["blockSoulBinder",2], ["blockSoulBinder",3]],"inCreative":true}]);

function setSoulBinderRender(){
var soulBinderRender = new ICRender.Model();
var model = BlockRenderer.createModel();
  model.addBox(0/16, 0/16, 0/16, 16/16, 3/16, 16/16, "blockSoulMachineBottom", 0);
  model.addBox(14.5/16, 3/16, 14.5/16, 15.5/16, 14/16, 15.5/16, "blockSoulMachineBottom", 0);
  model.addBox(0/16, 14/16, 0/16, 16/16, 16/16, 16/16, "blockSoulMachineBottom", 0);
  model.addBox(0.5/16, 3/16, 14.5/16, 1.5/16, 14/16, 15.5/16, "blockSoulMachineBottom", 0);
  model.addBox(14.5/16, 3/16, 0.5/16, 15.5/16, 14/16, 1.5/16, "blockSoulMachineBottom", 0);
  model.addBox(0.5/16, 3/16, 0.5/16, 1.5/16, 14/16, 1.5/16, "blockSoulMachineBottom", 0);
  model.addBox(2/16, 3/16, 2/16, 14/16, 14/16, 14/16, "blockSoulMachineBottom", 0);

  model.addBox(14/16, 5/16, 4/16, 15/16, 13/16, 12/16, "creeperSkull", 0);
  model.addBox(4/16, 5/16, 14/16, 12/16, 13/16, 15/16, "zombieSkull", 0);
  model.addBox(4/16, 5/16, 1/16, 12/16, 13/16, 2/16, "skeletonSkull", 0);
  model.addBox(1/16, 5/16, 4/16, 2/16, 13/16, 12/16, "endermanSkull", 0);

  soulBinderRender.addEntry(model);
  BlockRenderer.setStaticICRender(BlockID.soulBinder, -1, soulBinderRender);
}

setSoulBinderRender()

Block.setBlockShape(BlockID.soulBinder, {"x":0,"y":0,"z":0}, {"x":1,"y":1,"z":1});

var SoulBinderGUI = new UI.StandartWindow({
  standart: {
    header: {text: {text: "Soul binder" }},
    inventory: {standart: true},
    background: {standart: true}
  },
  drawing: [
    {type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2},
    {type: "bitmap", x: 600, y: 205, bitmap: "bar_progress0", scale: 3.2},
  ],
  elements: {
    "energyScale": {type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2},
    "progressScale": {type: "scale", x: 600, y: 205, bitmap: "bar_progress1", scale: 3.2},
    "slotInput0": {type: "slot", x: 450, y: 200},
    "slotInput1": {type: "slot", x: 510, y: 200},
    "slotOutput0": {type: "slot", x: 700, y: 200},
    "slotOutput1": {type: "slot", x: 760, y: 200},
    "capacitorSlot": {type: "slot", x: 325, y: 320},
    "text": {type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF"},
  }
});

Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.soulBinder, count: 1, data: 0}, [
    	"shs",
    	"hmh",
	   "shs"
  ], ['s', ItemID.soulariumIngot, 0, 'h', 397, -1, "a", 258, 0, "c", 359, 0, "m", BlockID.machineChassi, 0]);
  
  MachineRecipe.addSoulBinderRecipe([ItemID.soulVesselEnderman, ItemID.vibrantCrystal], {id: ItemID.soulVesselEmpty, second: ItemID.enderCrystal});
});

MachineRegistry.registerPrototype(BlockID.soulBinder, {
  defaultValues: {
    progress: 0, progressMax: 700, standartSpeed: 1, energyUsage: 80, maxEnergyStorage: 100000
  },
  oldValues: {
    standartSpeed: 1, energyUsage: 80, maxEnergyStorage: 100000
  },
  getGuiScreen: function(){
    return SoulBinderGUI;
  },
  tick: function(){
    this.container.setScale("progressScale", this.data.progress/this.data.progressMax)
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    
    let input0 = this.container.getSlot("slotInput0");
    let input1 = this.container.getSlot("slotInput1");
    let output0 = this.container.getSlot("slotOutput0");
    let output1 = this.container.getSlot("slotOutput1");
    
    let recipe = MachineRecipe.getSoulBinderRecipe([input0.id, input1.id]);
    
    if(recipe && (output0.id == recipe.result && output0.count < 64 && output1.id == recipe.second && output1.count < 64 || output0.id == 0 && output1.id == 0)){
      if(this.data.energy>=this.data.energyUsage){
        this.data.progress+=this.data.standartSpeed;
        this.data.energy-=this.data.energyUsage;
      }
      if(this.data.progress>=this.data.progressMax){
        input0.count--; 
        input1.count--;
        
        output0.id = recipe.result;
        output1.id = recipe.second;
        
        output0.count++;
        output1.count++;
        
        this.data.progress = 0;
        this.container.validateAll();
      }
    } else if(this.data.progress > 0) this.data.progress = 0;
    
    let slotCapacitor = this.container.getSlot("capacitorSlot");
    let upgrade = UpgradeAPI.getUpgradeData(slotCapacitor.id);
    
    if(upgrade){
      this.data.standartSpeed = upgrade.speed
      this.data.energyUsage = upgrade.usage*3
      this.data.maxEnergyStorage = upgrade.storage
    } else {
      this.data.standartSpeed = this.oldValues.standartSpeed
      this.data.energyUsage = this.oldValues.energyUsage
      this.data.maxEnergyStorage = this.oldValues.maxEnergyStorage
    }
    this.container.setText("text", this.data.energy+"/"+this.data.maxEnergyStorage);
    
    if(this.data.energy>this.data.maxEnergyStorage){
      this.data.energy=this.data.maxEnergyStorage
    }
  },
  getEnergyStorage: function(){
    return this.data.maxEnergyStorage;
  },
  energyTick: MachineRegistry.basicEnergyReceiveFunc
});




// file: machines/killer_joe.js

IDRegistry.genBlockID("killerJoe");
Block.createBlock("killerJoe", [{"name":"Killer Joe","texture":[["machineBottom",0]],"inCreative":true}]);

function setKillerJoeRender(){
var killerJoeRender = new ICRender.Model();
var model = BlockRenderer.createModel();

model.addBox(1/16, 0/16, 1/16, 15/16, 1/16, 15/16, "machineBottom", 0);
model.addBox(1/16, 1/16, 14/16, 2/16, 13/16, 15/16, "machineBottom", 0);
model.addBox(14/16, 1/16, 14/16, 15/16, 13/16, 15/16, "machineBottom", 0);
model.addBox(14/16, 1/16, 1/16, 15/16, 13/16, 2/16, "machineBottom", 0);
model.addBox(1/16, 1/16, 1/16, 2/16, 13/16, 2/16, "machineBottom", 0);
model.addBox(1/16, 13/16, 1/16, 15/16, 14/16, 15/16, "machineBottom", 0);

model.addBox(4/16, 2/16, 3/16, 13/16, 12/16, 13/16, "killerJoeZombieOther", 0);
model.addBox(3/16, 2/16, 3/16, 4/16, 12/16, 13/16, "killerJoeZombie", 0);

model.addBox(1/16, 1/16, 2/16, 2/16, 13/16, 14/16, 20, 0);
model.addBox(2/16, 1/16, 1/16, 14/16, 13/16, 2/16, 20, 0);
model.addBox(2/16, 1/16, 14/16, 14/16, 13/16, 15/16, 20, 0);
model.addBox(14/16, 1/16, 2/16, 15/16, 13/16, 14/16, 20, 0);

killerJoeRender.addEntry(model);
BlockRenderer.setStaticICRender(BlockID.killerJoe, -1, killerJoeRender);
}
setKillerJoeRender()

Block.setBlockShape(BlockID.killerJoe, {"x":0,"y":0,"z":0}, {"x":1,"y":1,"z":1});

var guiKillerJoe = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Killer Joe"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 470, y: 66, bitmap: "fluid_scale", scale: 3.2},
	],
	
	elements: {
	   	"liquidScale": {type: "scale", x: 470, y: 66, direction: 1, bitmap: "fluid_scale", scale: 3.2},
	   	"slotSword": {type: "slot", x: 600, y: 60},
		  "slotLiquid1": {type: "slot", x: 600, y: 240},
		  "slotLiquid0": {type: "slot", x: 600, y: 180},
  	}
});

var SWORD_DAMAGE = {
  "267": 6,
  "268": 4,
  "272": 5,
  "276": 7,
  "283": 4
}

var MOBS = [Native.EntityType.BAT, Native.EntityType.CHICKEN, Native.EntityType.COW, Native.EntityType.MUSHROOM_COW, Native.EntityType.OCELOT, Native.EntityType.PIG, Native.EntityType.RABBIT, Native.EntityType.SHEEP, Native.EntityType.SNOW_GOLEM, Native.EntityType.SQUID, Native.EntityType.VILLAGER, Native.EntityType.WOLF, 23, 24, 25, 26, 27, Native.EntityType.BLAZE, Native.EntityType.CAVE_SPIDER, Native.EntityType.CREEPER, Native.EntityType.ENDERMAN, Native.EntityType.GHAST, Native.EntityType.IRON_GOLEM, Native.EntityType.LAVA_SLIME, Native.EntityType.PIG_ZOMBIE, Native.EntityType.SILVERFISH, Native.EntityType.SKELETON, Native.EntityType.SLIME, Native.EntityType.SPIDER, Native.EntityType.ZOMBIE, Native.EntityType.ZOMBIE_VILLAGER, 45, 46, 47, 48, 49, 52, 55];



TileEntity.registerPrototype(BlockID.killerJoe, {
  getGuiScreen: function(){
    return guiKillerJoe;
  },
  init: function(){
    this.liquidStorage.setLimit("nutrientDistillation", 16);
  },
  tick: function(){
    this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
    let storage = this.liquidStorage;
		  let liquid = storage.getLiquidStored();
		  let slot0 = this.container.getSlot("slotLiquid0");
	   	let slot1 = this.container.getSlot("slotLiquid1");
	   	let slotSword = this.container.getSlot("slotSword");
		  
		  if(slot0.id == ItemID.bucketNutrient_distillation && storage.getAmount("nutrientDistillation") < 16 && (slot1.id == 325 && slot1.count < 16|| slot1.id == 0)){
		    slot1.id = 325
		    slot1.count++
		    slot0.count--;
		    this.container.validateAll();
		    storage.addLiquid("nutrientDistillation", 1);
		  }
		  
		  if(slotSword.data >= Item.getMaxDamage(slotSword.id)){
		    slotSword.id = 0;
		  }
		  
    for(i in MOBS){
		    let ent = Entity.findNearest({x: this.x, y: this.y, z: this.z}, MOBS[i], 6);
		    if(ent && storage.getAmount("nutrientDistillation") >= 0.02 && World.getThreadTime()%20==0){
				    Entity.damageEntity(ent, SWORD_DAMAGE[slotSword.id] || 1);
        slotSword.data++;
        storage.getLiquid("nutrientDistillation", 0.02);
      }
    }
  }
});


Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.killerJoe, count: 1, data: 0}, [
    	"sss",
    	"qzq",
	   "qqq"
  ], ['s', ItemID.darkSteel, 0, 'q', 20, 0, "z", ItemID.skullZombieController, 0]);
});




// file: machines/storage/basic_capacitor_bank.js

IDRegistry.genBlockID("storageCapacitorBank");
Block.createBlockWithRotation("storageCapacitorBank", [
	{name: "Basic capacitor bank", texture: [["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBank", 0], ["capacitorBankFront", 0], ["capacitorBank", 0], ["capacitorBank", 0]], inCreative: true}
], "opaque");

var bankGUI = new UI.StandartWindow({
  standart: {
    header: {text: {text: "Capacitor bank" }},
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

Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.storageCapacitorBank, count: 1, data: 0}, [
    	"ici",
    	"crc",
	   "ici"
  ], ['i', 265, 0, 'c', ItemID.basicCapacitor, 0, "r", 152, 0]);
});

MachineRegistry.registerPrototype(BlockID.storageCapacitorBank, {
  defaultValues: {
    maxOutput: 1000
  },
  isStorage: true,
  getGuiScreen: function(){
    return bankGUI;
  },
  tick: function(){
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    this.container.setText("textInfo", this.data.energy+"/"+this.getEnergyStorage()+" RF");
    
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge0"), this.data.energy, 2048, 0);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge1"), this.data.energy, 2048, 0);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge2"), this.data.energy, 2048, 0);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge3"), this.data.energy, 2048, 0);
    
  },
  getEnergyStorage: function(){
    return 1000000;
  },
  energyTick: function(type, src){
	   	this.data.energy += src.storage(Math.min(this.data.maxOutput*4, this.getEnergyStorage() - this.data.energy), Math.min(this.data.maxOutput, this.data.energy));
	 }
});




// file: machines/storage/capacitor_bank.js

IDRegistry.genBlockID("capacitorBank");
Block.createBlockWithRotation("capacitorBank", [
	{name: "Vibrant capacitor bank", texture: [["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrantFront", 0], ["capacitorBankVibrant", 0], ["capacitorBankVibrant", 0]], inCreative: true}
], "opaque");

Callback.addCallback("PostLoaded", function(){
  Recipes.addShaped({id: BlockID.capacitorBank, count: 1, data: 0}, [
    	"scs",
    	"crc",
	   "scs"
  ], ['s', ItemID.electricalSteel, 0, 'c', ItemID.octadicCapacitor, 0, "r", 152, 0]);
});

MachineRegistry.registerPrototype(BlockID.capacitorBank, {
  defaultValues: {
    maxOutput: 1000
  },
  isStorage: true,
  getGuiScreen: function(){
    return bankGUI;
  },
  tick: function(){
    this.container.setScale("energyScale", this.data.energy/this.getEnergyStorage());
    this.container.setText("textInfo", this.data.energy+"/"+this.getEnergyStorage()+" RF");
    
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge0"), this.data.energy, 2048, 1);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge1"), this.data.energy, 2048, 1);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge2"), this.data.energy, 2048, 1);
    this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotCharge3"), this.data.energy, 2048, 1);
    
  },
  getEnergyStorage: function(){
    return 25000000;
  },
  energyTick: function(type, src){
	   	this.data.energy += src.storage(Math.min(this.data.maxOutput*4, this.getEnergyStorage() - this.data.energy), Math.min(this.data.maxOutput, this.data.energy));
	 }
});




// file: conduits/energy.js

function setupConduitRender(id, groupName, width, preventSelfAdd) {
    let render = new ICRender.Model();
    BlockRenderer.setStaticICRender(id, 0, render);

    let boxes = [
        {side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2]},
        {side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2]},
        {side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1]},
        {side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2]},
    ];

    let group = ICRender.getGroup(groupName);
    if (!preventSelfAdd) {
        group.add(id, -1);
    }

    for (let i in boxes) {
        let box = boxes[i];

        let model = BlockRenderer.createModel();
        model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, 0);

        render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], group, 0);
    }

    let modelOwn = BlockRenderer.createModel();
    modelOwn.addBox(0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, id, 0);
    render.addEntry(modelOwn);
}

IDRegistry.genBlockID("powerConduit");
Block.createBlock("powerConduit", [
    {name: "Conductive iron conduit", texture: [["powerConduitCore", 0]], inCreative: true}
]);

RF.registerWire(BlockID.powerConduit);

setupConduitRender(BlockID.powerConduit, "rf-wire", 0.25);

Block.setBlockShape(BlockID.powerConduit, {x: 0.2, y: 0.2, z: 0.2}, {x: 0.8, y: 0.8, z: 0.8});




