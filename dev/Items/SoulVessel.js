IDRegistry.genItemID("soulVesselEmpty");
Item.createItem("soulVesselEmpty", "Soul Vessel", { name: "itemSoulVessel" }, { stack: 16 });
var SoulVessel = {
  values: {},
  addVesselMob: function(id, mob) {
    this.values[id] = mob
  },
  getVesselMob: function(id) {
    return this.values[id]
  }
}

var setVessel = function(arg) {

  IDRegistry.genItemID("soulVessel" + arg.id);
  Item.createItem("soulVessel" + arg.id, "Soul Vessel ", { name: "itemSoulVesselFull" }, { stack: 1, isTech: false });
  Item.setGlint(ItemID["soulVessel" + arg.id], true);

  Item.registerNameOverrideFunction(ItemID["soulVessel" + arg.id], function(item, name) {
    return name + "\n§7" + arg.id;
  });

  SoulVessel.addVesselMob(ItemID["soulVessel" + arg.id], arg.mob.id)

  Callback.addCallback("PlayerAttack", function(player, victim) {
    item = Player.getCarriedItem();
    if (item.id == ItemID.soulVesselEmpty && Entity.getType(victim) == arg.mob.id) {
      Entity.remove(victim);
      Player.setCarriedItem(ItemID["soulVessel" + arg.id], 1, 0);
    }
  });

  Callback.addCallback("ItemUse", function(coords) {
    item = Player.getCarriedItem();
    if (item.id == ItemID["soulVessel" + arg.id]) {
      Entity.spawn(coords.relative.x + .5, coords.relative.y + .5, coords.relative.z + .5, arg.mob.id);
      Player.setCarriedItem(ItemID.soulVesselEmpty, 1, 0);
    }
  });

  Item.addCreativeGroup("SoulVessel", Translation.translate("Soul Vessel"), [
    ItemID["soulVessel" + arg.id]
]);
  mod_tip(ItemID["soulVessel" + arg.id])
}
setVessel({ id: "Chicken", mob: { id: 10 } });
setVessel({ id: "Cow", mob: { id: 11 } });
setVessel({ id: "Pig", mob: { id: 12 } });
setVessel({ id: "Sheep", mob: { id: 13 } });
setVessel({ id: "Wolf", mob: { id: 14 } });
setVessel({ id: "Villager", mob: { id: 15 } });
setVessel({ id: "Moooshrom", mob: { id: 16 } });
setVessel({ id: "Squid", mob: { id: 17 } });
setVessel({ id: "Rabbit", mob: { id: 18 } });
setVessel({ id: "Bat", mob: { id: 19 } });
setVessel({ id: "Golem", mob: { id: 20 } });
setVessel({ id: "Snowman", mob: { id: 21 } });
setVessel({ id: "Ocelot", mob: { id: 22 } });
setVessel({ id: "Skeleton-horse", mob: { id: 26 } });
setVessel({ id: "Zombie-horse", mob: { id: 27 } });
setVessel({ id: "Zombie", mob: { id: 32 } });
setVessel({ id: "Creeper", mob: { id: 33 } });
setVessel({ id: "Skeleton", mob: { id: 34 } });
setVessel({ id: "Spider", mob: { id: 35 } });
setVessel({ id: "Pigman", mob: { id: 36 } });
setVessel({ id: "Slime", mob: { id: 37 } });
setVessel({ id: "Enderman", mob: { id: 38 } });
setVessel({ id: "Silverfish", mob: { id: 39 } });
setVessel({ id: "CaveSpider", mob: { id: 40 } });
setVessel({ id: "Ghast", mob: { id: 41 } });
setVessel({ id: "Magmacube", mob: { id: 42 } });
setVessel({ id: "Blaze", mob: { id: 43 } });
setVessel({ id: "Zombie-villager", mob: { id: 44 } });
setVessel({ id: "Husk", mob: { id: 47 } });
setVessel({ id: "Wither-skeleton", mob: { id: 48 } });
setVessel({ id: "Guardian", mob: { id: 49 } });
setVessel({ id: "Elder-guardian", mob: { id: 50 } });
setVessel({ id: "Shulker", mob: { id: 54 } });
setVessel({ id: "Endermite", mob: { id: 55 } });