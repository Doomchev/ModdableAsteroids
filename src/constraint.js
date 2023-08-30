import {Executable} from "./system.js"

export default class Constraint extends Executable {
    constructor(sprite, parent) {
        super()
        this.sprite = sprite
        this.parent = parent
        this.dAngle = sprite.angle - parent.angle

        let dx = sprite.centerX - parent.centerX
        let dy = sprite.centerY - parent.centerY
        this.length = Math.sqrt(dx * dx + dy * dy)
        this.dAngle2 = Math.atan2(dy, dx) - parent.angle
    }

    execute() {
        let parent = this.parent
        this.sprite.angle = parent.angle + this.dAngle
        let angle = parent.angle + this.dAngle2
        this.sprite.centerX = parent.centerX + this.length * Math.cos(angle)
        this.sprite.centerY = parent.centerY + this.length * Math.sin(angle)
    }
}