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
};

for (let i = 0; i < 3; ++i) {
    let row = [];
    for (let j = 0; j < 3; ++j) {
        row.push(null);
    }
    ttt.marks.push(row);
}


//
// redraw
// draw_grid
// draw_mark
//

function redraw() {
    ctx.save();
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.translate(w/2, h/2);
    ctx.scale(1, -1);
    draw_grid();
    for (let i = 0; i < 3; ++i) {
        let row = ttt.marks[i];
        for (let j = 0; j < 3; ++j) {
            draw_mark(i, j, row[j]);
        }
    }
    ctx.restore();
}

function draw_grid() {
    ctx.fillStyle = "black";
    ctx.fillRect(-ttt.a_cell/2 - 1, -3*ttt.a_cell/2, 2, 3*ttt.a_cell);
    ctx.fillRect(ttt.a_cell/2 - 1, -3*ttt.a_cell/2, 2, 3*ttt.a_cell);
    ctx.fillRect(-3*ttt.a_cell/2, -ttt.a_cell/2 - 1, 3*ttt.a_cell, 2);
    ctx.fillRect(-3*ttt.a_cell/2, ttt.a_cell/2 - 1, 3*ttt.a_cell, 2);
}

function draw_mark(i, j, mark) {
    ctx.fillStyle = "blue";
	let x = (i-1)*ttt.a_cell;
	let y = (1-j)*ttt.a_cell;
    switch (mark) {
    case null: {
        break;
    }
    case true: {
        ctx.beginPath();
        ctx.arc(x, y, ttt.a_mark / 2, 0, 2 * Math.PI);
        ctx.stroke();
        break;
    }
    case false: {
        ctx.beginPath();
		ctx.moveTo(x-ttt.a_mark/2, y+ttt.a_mark/2);
		ctx.lineTo(x+ttt.a_mark/2, y-ttt.a_mark/2);
		ctx.moveTo(x-ttt.a_mark/2, y-ttt.a_mark/2);
		ctx.lineTo(x+ttt.a_mark/2, y+ttt.a_mark/2);
        ctx.stroke();
        break;
    }
    }
}


//
// handle_click
// handle_click_cell
//

function handle_click(mx, my) {
    for (let i = 0; i < 3; ++i) {
        let x = (i-1)*ttt.a_cell;
        let left = x - ttt.a_cell/2;
        let right = x + ttt.a_cell/2;
        if (mx < left || mx > right) {
            continue;
        }
        for (let j = 0; j < 3; ++j) {
            let y = (1-j)*ttt.a_cell;
            let bottom = y - ttt.a_cell/2;
            let top = y + ttt.a_cell/2;
            if (my < bottom || my > top) {
                continue;
            }
            handle_click_cell(i, j);
            return;
        }
    }
}

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

function handle_click_cell(i, j) {
    if (ttt.marks[i][j] !== null) {
        return;
    }
    let n_marks = compute_n_marks();
    let mark = n_marks % 2 !== 0;
    ttt.marks[i][j] = mark;
    redraw();
}


//
// DOMContentLoaded
// _on_resize
//

function _on_resize() {
    let root = ctx.canvas.parentElement;
    ctx.canvas.style.width = root.clientWidth + "px";
    ctx.canvas.style.height = root.clientHeight + "px";
    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;
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
});
