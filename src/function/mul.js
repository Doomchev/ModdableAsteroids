import {num} from "../system.js";

export default class Mul {
    constructor(value1, value2) {
        this.value1 = value1
        this.value2 = value2
    }

    toNumber() {
        return num(this.value1) * num(this.value2)
    }
}