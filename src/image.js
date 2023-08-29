import {ctx, Renderable, root} from "./system.js";

let showCollisionShapes = true;

export default class Image extends Renderable {
    constructor(texture, x = 0, y = 0, width = texture.width, height = texture.height
                , xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
        super();
        this.texture = texture;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.xMul = xMul;
        this.yMul = yMul;
        this.heightMul = heightMul;
        this.widthMul = widthMul;
    }

    drawResized(sx, sy, swidth, sheight) {
        ctx.drawImage(this.texture, sx, sy, sx + swidth, sy + sheight
            , this.x, this.y, this.x + this.width, this.y + this.height)
    }

    drawRotated(sx, sy, swidth, sheight, angle) {
        let newWidth = swidth * this.widthMul;
        let newHeight = sheight * this.heightMul;
        let newX = -newWidth * this.xMul;
        let newY = -newHeight * this.yMul;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(angle);
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, newX, newY, newWidth, newHeight);
        if(showCollisionShapes) {
            ctx.beginPath();
            ctx.arc(0.0, 0.0, 0.5 * swidth, 0, 2.0 * Math.PI, false);
            ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
            ctx.fill();
            ctx.fillStyle = "black";
        }
        ctx.restore();
    }
}

/*class ImageArray extends Renderable {
    constructor(images, name: String) {
        super();
    }
    fun setCenter(x: Double, y: Double) {
        for(image in images) {
            image.xMul = x // / image.width
            image.yMul = y // / image.height
        }
    }

    fun setVisibleArea(xk: Double, yk: Double) {
        for(image in images) {
            image.widthMul = xk
            image.heightMul = yk
        }
    }

    override fun toNode(node: Node) {
        node.setString("name", name)
        let list = mutableListOf<Image>()
        for(image in images) {
            list.add(image)
        }
        node.setChildren(list)
    }

    override fun toString(): String {
        return name
    }
}*/