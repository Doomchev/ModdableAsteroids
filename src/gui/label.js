import Shape from "../shape.js"
import {align, ctx} from "../system.js"
import {xToScreen, yToScreen} from "../canvas.js"
import {project} from "../project.js"

export default class Label extends Shape {
    constructor(name, sprite, items, horizontalAlign, verticalAlign) {
        super(sprite.centerX, sprite.centerY, sprite.width, sprite.height)
        if(name) project._object[name] = this
        this.items = items
        this.horizontalAlign = horizontalAlign
        this.verticalAlign = verticalAlign
    }

    draw() {
        let text = ""
        this.items.forEach(item => text += typeof item === "string" ? item : item.toString())

        ctx.fillStyle = "white"

        let x, y
        const metrics = ctx.measureText(text)
        let width = metrics.width
        let height = metrics.actualBoundingBoxDescent
        switch(this.horizontalAlign) {
            case align.left:
                x = xToScreen(this.leftX)
                break
            case align.center:
                x = xToScreen(this.centerX) - 0.5 * width
                break
            case align.right:
                x = xToScreen(this.rightX) - width
                break
        }
        switch(this.verticalAlign) {
            case align.top:
                y = yToScreen(this.topY)
                break
            case align.center:
                y = yToScreen(this.centerY) - 0.5 * height
                break
            case align.bottom:
                y = yToScreen(this.bottomY) - height
                break
        }
        ctx.fillText(text, x, y)
    }
}