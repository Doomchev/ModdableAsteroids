let canvas, ctx;
let root = {
    keys: {},
    images: {}
};

function Key(code) {
    return {
        code: code
    }
}

function init() {
    root.ship = {
        x: 100.0,
        y: 100.0,
        angle: 0.0
    }
    root.ship.image = document.getElementById("ship");
    root.background = "rgb(9, 44, 84)"
    root.keys.right = Key("KeyA");
    root.keys.left = Key("KeyD");
}

function logic() {
    let ship = root.ship;
    if(root.keys.left.isDown) {
        ship.angle += 1.0;
    }
    if(root.keys.right.isDown) {
        ship.angle -= 1.0;
    }
}

function render() {
    let ship = root.ship;
    ctx.resetTransform();
    ctx.fillStyle = root.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(ship.x, ship.y)
    ctx.rotate(ship.angle * Math.PI / 180.0);
    ctx.drawImage(ship.image, 0.0, 0.0);
}

document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    init();
    setInterval(function() {
        logic();
        render();
    }, 20)
});

document.addEventListener("keydown", (event) => {
    for(const[name, key] of Object.entries(root.keys)) {
        if(event.code === key.code) {
            key.isDown = true;
        }
    }
}, false);

document.addEventListener("keyup", (event) => {
    for(const[name, key] of Object.entries(root.keys)) {
        if(event.code === key.code) {
            key.isDown = false;
        }
    }
}, false);