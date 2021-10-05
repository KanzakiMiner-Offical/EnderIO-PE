var RecipeRegistry = {
  crusher: {},
  smelter: {},
  sliceAndSlice: {},
  theVat: {},
  soulBinder: {},

  addSmelter: function(obj) {
    this.smelter.push(obj);
  },
  addCrusher: function(obj) {
    this.crusher.push(obj);
  },
  showMelter: function(api) {
    api.registerRecipeType("enderio_alloy", {
      contents: {
        icon: BlockID.alloySmelter,
        drawing: [
          { type: "bitmap", x: 527, y: 235, bitmap: "fire_scale0", scale: 3.2 },
          { type: "bitmap", x: 687, y: 235, bitmap: "fire_scale0", scale: 3.2 },
            ],
        elements: {
          input1: { type: "slot", x: 520, y: 170 },
          input2: { type: "slot", x: 600, y: 140 },
          input3: { type: "slot", x: 680, y: 170 },
          output: { type: "slot", x: 600, y: 320 },
        }
      },
      getList: function(id, data, isUsage) {
        let list = [];
        if (isUsage) {
          for (let i in this.smelter) {
            let recipe = this.smelter[i];
            let input = recipe.input;
            for (let j in input) {
              if (input[j].id == id) {
                list.push({
                  input: input,
                  output: { id: recipe.result.id, count: recipe.result.count }
                });
              }
            }
          }
        }
        else {
          for (let i in this.smelter) {
            let recipe = this.smelter[i];
            if (recipe.result.id == id) {
              list.push({
                input: recipe.input,
                output: { id: recipe.result.id, count: recipe.result.count }
              });
            }
          }
        }
        return list;
      }
    });
  },
  
  showCrusher: function(api) {
    api.registerRecipeType("enderio_SAG", {
      contents: {
        icon: BlockID.sagmill,
        drawing: [
          { type: "bitmap", x: 595, y: 250, bitmap: "bar_progress_down0", scale: 4.2 },
			],
        elements: {
          input0: { type: "slot", x: 602, y: 170, size: 65 },
          output0: { type: "slot", x: 505, y: 340, size: 65 },
          output1: { type: "slot", x: 570, y: 340, size: 65 },
          output2: { type: "slot", x: 635, y: 340, size: 65 },
          output3: { type: "slot", x: 700, y: 340, size: 65 },
          textChange0: { type: "text", x: 635, y: 300 },
          textChange1: { type: "text", x: 700, y: 300 },
          textTime: { type: "text", x: 700, y: 200 }
        }
      },
      getList: function(id, data, isUsage) {
        let result;
        let list = [];
        if (isUsage) {
          for (let i in this.crusher) {
            let recipe = this.crusher[i];
            let input = recipe.ingridient;
            let result0 = recipe.result0;
            let result1 = recipe.result1;
            let result2 = recipe.result2;
            let result3 = recipe.result3;
            if (input.id == id) {
              list.push({
                input: { id: id, count: 1, data: input.data },
                output: [
                  { id: result0.id || 0, count: 1, data: result0.data || 0 },
                  { id: result1.id || 0, count: 1, data: result1.data || 0 },
                  { id: result2.id || 0, count: 1, data: result2.data || 0 },
                  { id: result3.id || 0, count: 1, data: result3.data || 0 },
					],
                change: [
                  { change: result2.change },
                  { change: result3.change },
                  ]
              });
            }
          }
          return list;
        }
      },
      onOpen: function(elements, data) {
        let elem = elements.get("textChange0");
        elem.onBindingUpdated("text", data ? Translation.translate("Change: ") + data.change[0].change : "");

        let elem2 = elements.get("textChange1");
        elem2.onBindingUpdated("text", data ? Translation.translate("Change: ") + data.change[1].change : "");
      }

    });

  }
  /*,
    getSmelter: function(id, data){
      for(let i in this.smelter){
      var recipe = this.smelter[i];
        if(id == recipe.input && data == recipe.output){
        return 
      }
    }}
    */
};