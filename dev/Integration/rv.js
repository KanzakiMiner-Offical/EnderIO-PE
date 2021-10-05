ModAPI.addAPICallback("RecipeViewer", function(api) {

  let RecipeViewer = api.Core;

  const Bitmap = android.graphics.Bitmap;
  const Canvas = android.graphics.Canvas;
  const Rect = android.graphics.Rect;

  let bmp, cvs, source;
  let x = y = 0;


  RecipeRegistry.showSmelter(RecipeViewer);
  RecipeRegistry.showCrusher(RecipeViewer);
  //RecipeRegistry.show(RecipeViewer);


});