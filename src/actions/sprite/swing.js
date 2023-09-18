import {apsk} from "../../system.js"
import {Action} from "../action.js"

export default class Swing extends Action {
    constructor(sprite, dAngle, period) {
        super()
        this.sprite = sprite
        this.angle = sprite.angle
        this.dAngle = dAngle
        this.period = period
        this.time = 0
    }

    execute() {
        this.sprite.angle = this.angle + Math.sin(this.time * Math.PI * 2 / this.period) * this.dAngle
        this.time += apsk
    }
}