import {Function} from "../function.js"
import {getString} from "../tree.js"

export default class Cos extends Function {
    constructor(length, amplitude = 1, xshift = 0, yshift = 0) {
        super()
        this.length = length
        this.amplitude = amplitude
        this.xshift = xshift
        this.yshift = yshift
        this.time = 0
    }

    calculate(x) {
        return this.yshift + this.amplitude * Math.cos((this.xshift + x) * 2 * Math.PI / this.length)
    }

    getString() {
        return "cos(" + getString(this.xshift) + ", " + getString(this.yshift) + ", " + getString(this.length)
            + ", " + getString(this.amplitude) + ")"
    }
}