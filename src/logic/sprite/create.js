import {current, Executable} from "../../system.js"
import Sprite from "../../sprite.js"

export default class CreateSprite extends Executable {
    constructor(layer, image) {
        super();
        this.layer = layer
        this.image = image
    }

    execute() {
        let sprite = new Sprite(this.image)
        current.sprite = sprite;
        this.layer.items.push(sprite);
    }
}