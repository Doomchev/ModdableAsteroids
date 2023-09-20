import {apsk} from "../system.js"

export default class Cos {
    constructor(length, amplitude, xshift, yshift) {
        this.length = length
        this.amplitude = amplitude
        this.xshift = xshift
        this.yshift = yshift
        this.time = 0
    }

    toNumber() {
        this.time += apsk
        return this.yshift + this.amplitude * Math.sin((this.xshift + this.time) * 2 * Math.PI / this.length)
    }
}