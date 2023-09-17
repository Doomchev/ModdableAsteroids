import {num, rnd} from "../system.js";

export default class Rnd {
    constructor(from, to) {
        this.from = from
        this.to = to
    }

    toNumber() {
        return rnd(num(this.from), num(this.to))
    }
}