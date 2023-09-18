import Shape from "../shape.js"
import {align, ctx, setName} from "../system.js"
import {xToScreen, yToScreen} from "../canvas.js"

export default class Label extends Shape {
    constructor(name, sprite, items, horizontalAlign, verticalAlign, format) {
        super(sprite.centerX, sprite.centerY, sprite.width, sprite.height)
        setName(this, name)
        this.items = items
        this.horizontalAlign = horizontalAlign
        this.verticalAlign = verticalAlign
        this.format = format
    }

    draw() {
        let text = ""
        this.items.forEach(item => text += typeof item === "string" ? item : item.toString())

        let formatString = this.format?.substring(1)
        if (this.format === undefined) {
        } else if (this.format.startsWith("Z")) {
            text = "0".repeat(parseInt(formatString) - text.length) + text
        } else if (this.format.startsWith("R")) {
            let value = parseInt(text)
            if(value > 5) {
                text = formatString + " x " + value
            } else {
                text = formatString.repeat(value)
            }
        }

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

        ctx.fillStyle = "white"
        ctx.fillText(text, x, y)
    }

    show(...objects) {
        this.items = objects
    }
}