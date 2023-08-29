import {root, Value} from "./system.js";

export default class Key extends Value {
    constructor(code) {
        super();
        this.code = code;
        this.isDown = false;
        root.keys.push(this);
    }

    toBoolean() {
        return this.isDown;
    }
}