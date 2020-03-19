
function draw() {
  let indices = screen_size_grid.indices;
  let size = 12;
  let y = 0;
  let x = 0;
  textSize(size);
  fill(0); text('screen size grid', x, y + size*0.8); y += size;
  y += visualise_indices(screen_size_grid.indices, x, y, size);
  fill(0); text('browser grid', x, y + size*0.8); y += size;
  y += visualise_indices(browser_grid.indices, x, y, size);
  fill(0); text('language grid', x, y + size*0.8); y += size;
  y += visualise_indices(language_grid.indices, x, y, size);
  fill(0); text('canvas grid', x, y + size*0.8); y += size;
  y += visualise_indices(canvas_grid.indices, x, y, size);
}

function visualise_indices(indices, x,  y, size) {
  let resulting_height = 0;
  for(let i = 0; i < indices.length; i++) {
    let index = indices[i];
    for(let j = 0; j < index.length; j++) {
      if(index.v == j) {
        fill(0);
      } else {
        fill(255);
      }
      rect(x + size*j, y + size*i, size, size);
    }
    resulting_height += size;
  }
  return resulting_height;
}