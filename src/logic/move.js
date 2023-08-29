import {Executable} from "../system.js";
import {fpsk} from "../sprite.js";

export default class Move extends Executable {
    constructor(sprite) {
        super();
        this.sprite = sprite;
    }

    execute() {
        this.sprite.move();
    }
}