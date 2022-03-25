//
// simulation_description
//

let simulation_description = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];


//
// ctx
//

let ctx = null;


//
// ttt
//

let ttt = {
    a_cell: 60,
    a_mark: 40,
    marks: [], // 3x3 array of null/true/false representing blank/knot/cross
    status: null,
    // In-progress => null
    // Draw => { result: null }
    // Win => {
    //     result: {
    //         winner: true/false representing knot/cross
    //         row: #/null
    //         column: #/null
    //         leading_diagonal: true/false
    //         trailing_diagonal: true/false
    //     }
    // }
};

for (let i = 0; i < 3; ++i) {
    let row = [];
    for (let j = 0; j < 3; ++j) {
        row.push(null);
    }
    ttt.marks.push(row);
}


//
// compute_n_marks
//

function compute_n_marks() {
    let n_marks = 0;
    for (let i = 0; i < 3; ++i) {
        let row = ttt.marks[i];
        for (let j = 0; j < 3; ++j) {
            if (row[j] !== null) {
                n_marks += 1;
            }
        }
    }
    return n_marks;
}


//
// redraw
//

function redraw() {
    ctx.save();
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w/2, h/2);
    ctx.scale(1, -1);
    draw_grid();
    draw_marks();
    draw_result();
    ctx.restore();
}


//
// draw_grid
//

function draw_grid() {
    ctx.fillStyle = "black";
    ctx.fillRect(-ttt.a_cell/2 - 1, -3*ttt.a_cell/2, 2, 3*ttt.a_cell);
    ctx.fillRect(ttt.a_cell/2 - 1, -3*ttt.a_cell/2, 2, 3*ttt.a_cell);
    ctx.fillRect(-3*ttt.a_cell/2, -ttt.a_cell/2 - 1, 3*ttt.a_cell, 2);
    ctx.fillRect(-3*ttt.a_cell/2, ttt.a_cell/2 - 1, 3*ttt.a_cell, 2);
}


//
// draw_marks
// _draw_mark
//

function draw_marks() {
    for (let i = 0; i < 3; ++i) {
        let row = ttt.marks[i];
        for (let j = 0; j < 3; ++j) {
            _draw_mark(i, j, row[j]);
        }
    }
}

function _draw_mark(i, j, mark) {
    ctx.fillStyle = "blue";
	let cx = (j-1)*ttt.a_cell;
	let cy = (1-i)*ttt.a_cell;
    switch (mark) {
    case null: {
        break;
    }
    case true: {
        ctx.beginPath();
        ctx.arc(cx, cy, ttt.a_mark / 2, 0, 2 * Math.PI);
        ctx.stroke();
        break;
    }
    case false: {
        ctx.beginPath();
		ctx.moveTo(cx-ttt.a_mark/2, cy+ttt.a_mark/2);
		ctx.lineTo(cx+ttt.a_mark/2, cy-ttt.a_mark/2);
		ctx.moveTo(cx-ttt.a_mark/2, cy-ttt.a_mark/2);
		ctx.lineTo(cx+ttt.a_mark/2, cy+ttt.a_mark/2);
        ctx.stroke();
        break;
    }
    }
}


//
// draw_result
//

function draw_result() {
    if (ttt.status === null) {
        return;
    }
    console.log(ttt.status);
}


//
// update_status
//

function update_status() {
    let result = {
        winner: null,
        row: null,
        column: null,
        leading_diagonal: false,
        trailing_diagonal: false,
    };

    // Check row win.
    for (let i = 0; i < 3; ++i) {
        let winner = ttt.marks[i][0];
        if (winner === null) {
            continue;
        }
        if (ttt.marks[i][1] === winner && ttt.marks[i][2] === winner) {
            if (result.winner === null) {
                result.winner = winner;
            }
            else if (winner !== result.winner) {
                throw "Both cannot win!";
            }
            if (result.row !== null) {
                throw "Cannot win on two rows: " + [result.row, i] + ".";
            }
            result.row = i;
        }
    }

    // Check column win.
    for (let i = 0; i < 3; ++i) {
        let winner = ttt.marks[0][i];
        if (winner === null) {
            continue;
        }
        if (ttt.marks[1][i] === winner && ttt.marks[2][i] === winner) {
            if (result.winner === null) {
                result.winner = winner;
            }
            else if (winner !== result.winner) {
                throw "Both cannot win!";
            }
            if (result.column !== null) {
                throw "Cannot win on two columns: " + [result.column, i] + ".";
            }
            result.column = i;
        }
    }

    // Check diagonal win.
    if (ttt.marks[1][1] !== null) {
        let winner = ttt.marks[1][1];
        // Leading diagonal
        if (ttt.marks[0][0] === winner && ttt.marks[2][2] === winner) {
            if (result.winner === null) {
                result.winner = winner;
            }
            else if (winner !== result.winner) {
                throw "Both cannot win!";
            }
            result.leading_diagonal = true;
        }
        // Trailing diagonal
        if (ttt.marks[0][2] === winner && ttt.marks[2][0] === winner) {
            if (result.winner === null) {
                result.winner = winner;
            }
            else if (winner !== result.winner) {
                throw "Both cannot win!";
            }
            result.trailing_diagonal = true;
        }
    }

    if (result.winner !== null) {
        ttt.status = {
            result: result
        };
        return;
    }

    if (compute_n_marks() === 9) {
        ttt.status = {
            result: null
        };
    }
}


//
// handle_click
// _handle_click_cell
//

function handle_click(mx, my) {
    if (ttt.status !== null) {
        return;
    }
    for (let i = 0; i < 3; ++i) {
        let cy = (1-i)*ttt.a_cell;
        let bottom = cy - ttt.a_cell/2;
        let top = cy + ttt.a_cell/2;
        if (my < bottom || my > top) {
            continue;
        }
        for (let j = 0; j < 3; ++j) {
            let cx = (j-1)*ttt.a_cell;
            let left = cx - ttt.a_cell/2;
            let right = cx + ttt.a_cell/2;
            if (mx < left || mx > right) {
                continue;
            }
            _handle_click_cell(i, j);
            return;
        }
    }
}

function _handle_click_cell(i, j) {
    if (ttt.marks[i][j] !== null) {
        return;
    }
    let n_marks = compute_n_marks();
    let mark = n_marks % 2 !== 0;
    ttt.marks[i][j] = mark;
    update_status();
    redraw();
}


//
// start_simulation
// simulation_data
// simulate_next_turn
//

let simulation_data = [];

function start_simulation() {
    //
    // Process simulation_description and store in simulation_data.
    // Also includes thorough validation of simulation_description.
    //
    if (!Array.isArray(simulation_description)) {
        throw "Simulation description is not an array.";
    }
    if (simulation_description.length !== 3) {
        throw "Simulation description does not have 3 rows.";
    }
    for (let i = 0; i < 3; ++i) {
        let row = simulation_description[i];
        if (row.length !== 3) {
            throw "Simulation row " + i + " does not have 3 cells.";
        }
        for (let j = 0; j < 3; ++j) {
            let number = row[j];
            if (typeof number !== "number" || number < 0) {
                throw "Simulation step '" + number + "' is invalid.";
            }
            if (number === 0) {
                continue;
            }
            if (simulation_data[number-1] !== undefined) {
                throw (
                    "Simulation step " + number + " occurs at both " +
                    simulation_data[number-1] + " and " + [i, j] + ".");
            }
            simulation_data[number-1] = [i, j];
        }
    }
    for (let i = 0; i < simulation_data.length; ++i) {
        if (simulation_data[i] === undefined) {
            throw "Simulation step " + (i+1) + " missing.";
        }
    }

    //
    // Begin the simulation.
    //
    setTimeout(() => {
        // TODO: Begin the simulation.
        // _handle_click_cell(i, j);
    }, 1000);
}


//
// _on_resize
// DOMContentLoaded
//

function _on_resize() {
    let root = ctx.canvas.parentElement;
    ctx.canvas.style.width = root.clientWidth + "px";
    ctx.canvas.style.height = root.clientHeight + "px";
    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;
    redraw();
}

window.addEventListener("DOMContentLoaded", () => {
    ctx = document
        .getElementById("root")
        .appendChild(document.createElement("canvas"))
        .getContext("2d");

    window.addEventListener("resize", _on_resize);
    _on_resize();

    redraw();

    ctx.canvas.addEventListener("click", (event) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        let x = event.offsetX;
        let y = event.offsetY;
        x -= w/2;
        y -= h/2;
        y = -y;
        handle_click(x, y);
    });

    start_simulation();
});
