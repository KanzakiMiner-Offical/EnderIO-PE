// import values
function randomInt(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;

}

var Color = android.graphics.Color;
var PotionEffect = Native.PotionEffect;
var ParticleType = Native.ParticleType;
var BlockSide = Native.BlockSide;
var EntityType = Native.EntityType;
// load lib
alert("EnderIO BE \n Remake By KanzakiMiner");

IMPORT("StorageInterface");
IMPORT("flags");
IMPORT("ToolType");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("MachineRender");
IMPORT("TileRender");
IMPORT("LiquidLib");
IMPORT("ToolLib");
IMPORT("PipeAPI");
IMPORT("bakeModel");
IMPORT("Pipe");