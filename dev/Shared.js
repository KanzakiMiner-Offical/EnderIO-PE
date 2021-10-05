ModAPI.registerAPI("EIOAPI", {
  Machine: MachineRegistry,
  Recipe: RecipeRegistry,
  Conduit: ConduitRegistry,
  Upgrade: UpgradeAPI,
  requireGlobal: function(command) {
    return eval(command);
  }

});
Logger.Log("EIOAPI shared", "API");
