import {Value} from "./system.js";

export default class Key extends Value {
    constructor(code) {
        super();
        this.code = code;
        this.isDown = false;
    }

    toBoolean() {
        return this.isDown;
    }
}