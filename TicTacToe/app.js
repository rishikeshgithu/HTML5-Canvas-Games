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
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    ctx.translate(w/2, h/2);
    ctx.scale(1, -1);
    draw_grid();
    for (let i = 0; i < 3; ++i) {
        let row = ttt.marks[i];
        for (let j = 0; j < 3; ++j) {
            draw_mark(i, j, row[j]);
        }
    }
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
    switch (mark) {
    case null: {
        break;
    }
    case true: {
        ctx.beginPath();
        ctx.arc(-ttt.a_cell + i*ttt.a_cell, ttt.a_cell - j*ttt.a_cell, ttt.a_cell / 2, 0, 2 * Math.PI);
        ctx.stroke();
        break;
    }
    case false: {
        ctx.beginPath();
        ctx.moveTo(-(3*ttt.a_cell/2) + i*ttt.a_cell, ttt.a_cell*3/2 - j*ttt.a_cell);
        ctx.lineTo(-(ttt.a_cell/2) + i*ttt.a_cell, ttt.a_cell/2 - j*ttt.a_cell);
        ctx.moveTo(-(ttt.a_cell/2) + i*ttt.a_cell, 3*ttt.a_cell/2 - j*ttt.a_cell);
        ctx.lineTo(-(3*ttt.a_cell/2) + i*ttt.a_cell, ttt.a_cell/2 - j*ttt.a_cell);
        ctx.stroke();
        break;
    }
    }
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

    ctx.canvas.addEventListener("mousemove", (event) => {
    });
    ctx.canvas.addEventListener("click", (event) => {
    });
});
