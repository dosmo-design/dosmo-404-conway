// Size of field/table with cells
const width_x = 40,
  height_y = 20;

// create the table dynamically
build_table();

// poulate random cells with life
rnd_state();

// register event listeners so the user can change the state of cells
let cells = document.querySelectorAll("[id^='x']");
for (let cell of Array.from(cells)) {
  cell.addEventListener("click", toggle);
}

// clicking the button #next will advance one generation
document.getElementById("next").addEventListener("click", upd);

// autorun button
let running = null;
document.querySelector("#run").addEventListener("click", () => {
  if (running) {
    clearInterval(running);
    running = null;
    document.querySelector("#run").innerText = "Auto run";
  } else {
    running = setInterval(upd, 250);
    document.querySelector("#run").innerText = "Pause";
  }
});

// build the playing field/table
function build_table() {
  let tbl = "";
  for (let y = 1; y <= height_y; y++) {
    tbl += "<tr>";
    for (let x = 1; x <= width_x; x++) {
      tbl += `<td id="x${x}y${y}"></td>\n`;
    }
    tbl += "</tr>\n";
  }
  tbl = "<table>\n<tbody>" + tbl + "</tbody>\n</table>\n";
  document.getElementById("grid").innerHTML = tbl;
}

// change the state of one cell
function toggle(el) {
  if (!String(el).match("HTML")) el = this;
  el.className = el.classList.contains("lv") ? "exp" : "lv rng";
}

// toggle the state of random cells in the table
function rnd_state(prob = 0.23) {
  for (let y = 1; y <= height_y; y++) {
    for (let x = 1; x <= width_x; x++) {
      if (Math.random() < prob) {
        // document.getElementById(`x${x}y${y}`).className = "lv rng";
        toggle(document.getElementById(`x${x}y${y}`));
      }
    }
  }
}

// next generation, update the playing field/table accorfing to the rules
function upd() {
  // loop over all cells, set their next state in an empty new struct
  /*
    Any live cell with fewer than two or more than three live neighbors dies.
    Any live cell with two or three live neighbors lives on to the next generation.
    Any dead cell with exactly three live neighbors becomes a live cell.
    */
  let updated = {};

  for (let y = 1; y <= height_y; y++) {
    for (let x = 1; x <= width_x; x++) {
      let my_id = `x${x}y${y}`;
      let lv_ns = live_neighbors(my_id);
      let lv_me = document.getElementById(my_id).classList.contains("lv");

      // cell is alive only in two cases, dead in all others
      updated[my_id] = "";
      if (lv_me && lv_ns >= 2 && lv_ns <= 3) {
        updated[my_id] = "lv";
      }

      // a dead cell will be switched alive if it has exactly 3 living neighbors
      if (!lv_me && lv_ns == 3) updated[my_id] = "lv";
    }
  }

  // There has to be a better way to iterate over an object…
  // https://stackoverflow.com/q/34913675
  // for (i = 0; i < Object.keys(updated).length; i++) {
  //   let k_id = Object.keys(updated)[i];
  //   let val = updated[k_id];
  //   document.getElementById(k_id).classList = val;
  // }

  // Loop over all entries and update the playing field/table;
  Object.entries(updated).forEach(([key, val]) => {
    document.getElementById(key).classList = val;
  });

  // helper-function that determines the number of living neighbors
  function live_neighbors(id) {
    let [x_, y_] = id.replace("x", "").split("y");
    let lv_ns = 0;
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        let nx = Number(x_) + i;
        let ny = Number(y_) + j;
        let check_id = `x${nx}y${ny}`;
        if (valid_cell(nx, ny) && !(j == 0 && i == 0)) {
          if (document.getElementById(check_id).classList.contains("lv")) {
            lv_ns++;
          }
        }
      }
    }

    function valid_cell(x, y) {
      if (x >= 1 && x <= width_x && y >= 1 && y <= height_y) return true;
      else return false;
    }
    return lv_ns;
  }

  // document.querySelector("tbody").className = "";
  if (document.querySelector("#rng").value / 100 > Math.random()) {
    rnd_state(0.042);
    // document.querySelector("tbody").className = "rng_u";
  }
  // console.log(updated);
}