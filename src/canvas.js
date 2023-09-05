import Sprite from "./sprite.js"
import Area from "./area.js"
import {root, ctx, mousesx, mousesy} from "./system.js"

export let currentCanvas, zk = 1.2

export function setCurrentCanvas(canvas) {
    currentCanvas = canvas
}

export default class Canvas extends Sprite {
    constructor(fx, fy, fwidth, fheight, scale, active = true) {
        super(undefined, undefined, 0.0, 0.0, fwidth / scale, fheight / scale, 0.0, 0.0, 0.0, active)
        this.viewport = new Area(fx, fy, fwidth, fheight)
        this.vdx = 1.0
        this.vdy = 1.0
        this.k = 1.0
        this.oldZoom = 0
        this.defaultPosition = this
        this.active = active
        this.update()
    }

    draw() {
        if(!this.active) return
        let viewport = this.viewport
        let oldCanvas = currentCanvas
        currentCanvas = this
        this.update()

        ctx.fillStyle = root.background
        //g.setClip(viewport.leftX, viewport.topY, viewport.width, viewport.height)
        ctx.fillRect(viewport.leftX, viewport.topY, viewport.width, viewport.height)
        for(let i = 0; i < root.scene.length; i++) {
            root.scene[i].draw()
        }
        currentCanvas = oldCanvas
    }

    update() {
        let viewport = this.viewport
        let k = 1.0 * viewport.width / this.width
        this.k = k
        this.height = 1.0 * viewport.height / k
        this.vdx = 0.5 * viewport.width - this.centerX * k + viewport.leftX
        this.vdy = 0.5 * viewport.height - this.centerY * k + viewport.topY
    }

    setZoom(zoom) {
        this.width = this.viewport.width * (zk ** zoom)
        this.update()
    }

    setZoomXY(zoom, x, y) {
        let fx1 = xFromScreen(x)
        let fy1 = yFromScreen(y)
        this.setZoom(zoom)
        let fx2 = xFromScreen(x)
        let fy2 = yFromScreen(y)
        this.centerX += fx1 - fx2
        this.centerY += fy1 - fy2
        this.update()
    }

    hasMouse() {
        return this.viewport.hasPoint(mousesx, mousesy)
    }

    setDefaultPosition() {
        this.oldZoom = this.zoom
        this.defaultPosition = new Sprite(undefined, undefined, this.centerX, this.centerY, this.width, this.height)
    }

    restorePosition() {
        let defaultPosition = this.defaultPosition
        this.centerX = defaultPosition.centerX
        this.centerY = defaultPosition.centerY
        this.width = defaultPosition.width
        this.height = defaultPosition.height
        this.zoom = this.oldZoom
        this.update()
    }

    drawDefaultCamera() {
        let pos = this.defaultPosition
        ctx.fillStyle("blue")
        drawRect(xToScreen(pos.leftX), yToScreen(pos.topY), distToScreen(pos.width), distToScreen(pos.height))
        ctx.fillStyle("white")
    }

    toggle() {
        this.active = !this.active
    }
}

export function drawRect(x, y, width, height) {
    let x2 = x + width
    let y2 = y + height
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x, y2)
    ctx.lineTo(x, y)
    ctx.stroke()
}

export function xToScreen(fieldX) {
    return fieldX * currentCanvas.k + currentCanvas.vdx
}
export function yToScreen(fieldY) {
   return fieldY * currentCanvas.k + currentCanvas.vdy
}
export function distToScreen(fieldDist) {
    return fieldDist * currentCanvas.k
}

export function xFromScreen(screenX) {
    return (screenX - currentCanvas.vdx) / currentCanvas.k
}
export function yFromScreen(screenY) {
    return (screenY - currentCanvas.vdy) / currentCanvas.k
}

export function distFromScreen(screenDist) {
    return screenDist / currentCanvas.k
}

export function setCanvas(canvas) {
    currentCanvas = canvas
}