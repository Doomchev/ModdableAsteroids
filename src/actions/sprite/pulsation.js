import {apsk, rad} from "../../system.js"
import {Action} from "../action.js"

export default class Pulsation extends Action {
    constructor(sprite, sizeMul, period) {
        super()
        this.sprite = sprite
        this.width = sprite.width
        this.height = sprite.height
        this.sizeMul = sizeMul
        this.period = period
        this.time = 0
    }

    execute() {
        let mul = 1 + Math.sin(this.time * Math.PI * 2 / this.period) * this.sizeMul
        this.sprite.width = this.width * mul
        this.sprite.height = this.height * mul
        this.time += apsk
    }
}