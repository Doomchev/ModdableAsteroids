import Shape from "./shape.js";
import {xToScreen, yToScreen, distToScreen} from "./canvas.js";

let fps = 100.0;
let fpsk = 1.0 / fps;

export default class Sprite extends Shape {
    constructor(image, centerX = 0.0, centerY = 0.0, width = 1.0, height = 1.0
                , angleInDegrees = 0.0, dx = 1.0, dy = 0.0) {
        super(centerX, centerY, width, height);
        this.image = image;
        this.angle = angleInDegrees * Math.PI / 180.0;
        this.dx = dx;
        this.dy = dy;
        this.visible = true;
    }

    draw() {
        if(!this.visible) return
        this.image.drawRotated(xToScreen(this.centerX), yToScreen(this.centerY)
            , distToScreen(this.width), distToScreen(this.height), this.angle, false)
    }

    move() {
        this.centerX += fpsk * this.dx
        this.centerY += fpsk * this.dy
    }
}