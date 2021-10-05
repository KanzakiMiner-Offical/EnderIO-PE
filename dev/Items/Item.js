Item.setItems = function(id, types) {
  for (i in types) {
    IDRegistry.genItemID(id + types[i]);
    Item.createItem(id + types[i], types[i] + " " + id, { name: id + types[i] }, { stack: 64 });
    var this_id = id +types[i];
    mod_tip(ItemId[this_id])
  }
}

IDRegistry.genItemID("basicGear");
Item.createItem("basicGear", "Basic gear", { name: "basicGear" }, { stack: 64 });

IDRegistry.genItemID("basicCapacitor");
Item.createItem("basicCapacitor", "Basic capacitor", { name: "basicCapacitor" }, { stack: 64 });

Item.setItems("dust", ["Copper", "Iron", "Tin", "Coal", "Gold", "Ender", "Obsidian"]);

Recipes.addIngotRecipe = function(src, out) {
  if (ItemID[out]) {
    Recipes.addFurnace(src, ItemID[out], 0);
  }
}

IDRegistry.genItemID("binderComposite");
Item.createItem("binderComposite", "Binder Composite", { name: "binderComposite" }, { stack: 64 });

IDRegistry.genItemID("conduitBinder");
Item.createItem("conduitBinder", "Conduit Binder", { name: "conduitBinder" }, { stack: 64 });

IDRegistry.genItemID("itemYetaWrench");
Item.createItem("itemYetaWrench", "Yeta Wrench", { name: "itemYetaWrench" }, { stack: 1 });

IDRegistry.genItemID("silicon");
Item.createItem("silicon", "Silicon", { name: "silicon" }, { stack: 64 });

IDRegistry.genItemID("conductiveIron");
Item.createItem("conductiveIron", "Conductive Iron", { name: "conductiveIron" }, { stack: 64 });

IDRegistry.genItemID("darkSteel");
Item.createItem("darkSteel", "Dark Steel", { name: "darkSteel" }, { stack: 64 });

IDRegistry.genItemID("electricalSteel");
Item.createItem("electricalSteel", "Electrical Steel", { name: "electricalSteel" }, { stack: 64 });

IDRegistry.genItemID("energeticAlloy");
Item.createItem("energeticAlloy", "Energetic Alloy", { name: "energeticAlloy" }, { stack: 64 });

IDRegistry.genItemID("pulsatingIron");
Item.createItem("pulsatingIron", "Pulsating Iron", { name: "pulsatingIron" }, { stack: 64 });

IDRegistry.genItemID("redstoneAlloy");
Item.createItem("redstoneAlloy", "Redstone Alloy", { name: "redstoneAlloy" }, { stack: 64 });

IDRegistry.genItemID("soulariumIngot");
Item.createItem("soulariumIngot", "Soularium", { name: "soularium" }, { stack: 64 });

IDRegistry.genItemID("vibrantAlloy");
Item.createItem("vibrantAlloy", "Vibrant Alloy", { name: "vibrantAlloy" }, { stack: 64 });

IDRegistry.genItemID("vibrantNugget");
Item.createItem("vibrantNugget", "Vibrant Nugget", { name: "vibrantNugget" }, { stack: 64 });

IDRegistry.genItemID("vibrantCrystal");
Item.createItem("vibrantCrystal", "Vibrant Crystal", { name: "vibrantCrystal" }, { stack: 64 });

IDRegistry.genItemID("enderCrystal");
Item.createItem("enderCrystal", "Ender Crystal", { name: "enderCrystal" }, { stack: 64 });
Item.setGlint(ItemID.enderCrystal, true);

IDRegistry.genItemID("zombieSkull");
Item.createItem("zombieSkull", "Zombie Skull", { name: "zombieSkull" }, { stack: 64 });

IDRegistry.genItemID("endermanSkull");
Item.createItem("endermanSkull", "Enderman Skull", { name: "endermanSkull" }, { stack: 64 });

IDRegistry.genItemID("creeperSkull");
Item.createItem("creeperSkull", "Creeper Skull", { name: "creeperSkull" }, { stack: 64 });

IDRegistry.genItemID("skeletonSkull");
Item.createItem("skeletonSkull", "Skeleton Skull", { name: "skeletonSkull" }, { stack: 64 });

IDRegistry.genItemID("doublelayerCapacitor");
Item.createItem("doublelayerCapacitor", "Double-layer Capacitor", { name: "doublelayerCapacitor" }, { stack: 64 });

IDRegistry.genItemID("octadicCapacitor");
Item.createItem("octadicCapacitor", "Octadic Capacitor", { name: "octadicCapacitor" }, { stack: 64 });
var capacitorObj = {};
function regUpgrade(id, type, storage, usage, speed, bonus) {
  UpgradeAPI.registerUpgrade(id, type, function(item, machine, container, data) {
    data.energy_storage += storage;
    data.work_time = Math.round(data.work_time / speed);
    data.energy_consumption += usage;
    data.bonus += bonus;
  });
  
  capacitorObj.push(id);
}
regUpgrade(ItemID.basicCapacitor, "capacitor", 100000, 40, 1.15, 1);
regUpgrade(ItemID.doublelayerCapacitor, "capacitor", 200000, 80, 2, 2);
regUpgrade(ItemID.octadicCapacitor, "capacitor", 400000, 160, 4, 4);


/*
UpgradeAPI.registerUpgradeItem(ItemID.doublelayerCapacitor, {
  speed: 2, storage: 200000, usage: 80, energyBonus: 2
});

UpgradeAPI.registerUpgradeItem(ItemID.octadicCapacitor, {
  speed: 4, storage: 500000, usage: 160, energyBonus: 4
});
*/
Callback.addCallback("PostLoaded", function() {

  Recipes.addShapeless({ id: 397, count: 1, data: 0 }, [{ id: ItemID.skeletonSkull, data: 0 }]);
  Recipes.addShapeless({ id: 397, count: 1, data: 2 }, [{ id: ItemID.zombieSkull, data: 0 }]);
  Recipes.addShapeless({ id: 397, count: 1, data: 4 }, [{ id: ItemID.creeperSkull, data: 0 }]);

  Recipes.addShapeless({ id: ItemID.skeletonSkull, count: 1, data: 0 }, [{ id: 397, data: 0 }]);
  Recipes.addShapeless({ id: ItemID.zombieSkull, count: 1, data: 0 }, [{ id: 397, data: 2 }]);
  Recipes.addShapeless({ id: ItemID.creeperSkull, count: 1, data: 0 }, [{ id: 397, data: 4 }]);



  Recipes.addShapeless({ id: ItemID.vibrantNugget, count: 9, data: 0 }, [{ id: ItemID.vibrantAlloy, data: 0 }]);

  Recipes.addShaped({ id: ItemID.vibrantCrystal, count: 1, data: 0 }, [
  	"aaa",
  	"aea",
	 "aaa"
], ['a', ItemID.vibrantNugget, 0, 'e', 388, 0]);

  Recipes.addShaped({ id: ItemID.vibrantAlloy, count: 1, data: 0 }, [
  	"aaa",
  	"aaa",
	 "aaa"
], ['a', ItemID.vibrantNugget, 0]);


  Recipes.addShaped({ id: ItemID.doublelayerCapacitor, count: 1, data: 0 }, [
  	" a ",
  	"cpc",
	 " a "
], ['a', ItemID.energeticAlloy, 0, 'c', ItemID.basicCapacitor, 0, 'p', ItemID.dustCoal, 0]);

  Recipes.addShaped({ id: ItemID.octadicCapacitor, count: 1, data: 0 }, [
  	" a ",
  	"cpc",
	 " a "
], ['a', ItemID.vibrantAlloy, 0, 'c', ItemID.doublelayerCapacitor, 0, 'p', 89, 0]);

  Recipes.addShaped({ id: ItemID.basicGear, count: 1, data: 0 }, [
  	"aba",
  	"b b",
	 "aba"
], ['a', 280, 0, 'b', 4, 0]);


  Recipes.addShaped({ id: ItemID.basicCapacitor, count: 1, data: 0 }, [
  	" rn",
  	"rir",
	 "nr "
], ['r', 371, 0, 'n', 331, 0, 'i', 265, 0]);

  Recipes.addShaped({ id: ItemID.binderComposite, count: 8, data: 0 }, [
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
Item.createItem("skullZombieController", "Zombie Controller", { name: "skullZombieController" }, { stack: 64 });