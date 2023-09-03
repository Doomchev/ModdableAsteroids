import {BooleanFunction} from "./boolean.js"

export default class Pressed extends BooleanFunction {
    constructor(key) {
        super()
        this.key = key
    }

    toBoolean() {
        return this.key.isPressed;
    }
}