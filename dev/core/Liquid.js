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

