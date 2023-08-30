import {Executable} from "../../system.js"

export default class Move extends Executable {
    constructor(object) {
        super();
        this.object = object;
    }

    execute() {
        this.object.move();
    }
}