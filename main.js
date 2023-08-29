import Image from "./src/image.js";
import Sprite from "./src/sprite.js";
import Key from "./src/key.js";
import {root, toRadians} from "./src/system.js";
import LinearChange from "./src/logic/linear_change.js";
import Move from "./src/logic/move.js";

export function init() {
    let texture = document.getElementById("ship");
    let ship = new Sprite(new Image(texture, 0, 0, texture.width, texture.height
        , 0.35, 0.5, 1.35, 1.9));
    root.ship = ship
    root.background = "rgb(9, 44, 84)";

    root.scene = [ship];

    let keys = {
        right: new Key("KeyA"),
        left: new Key("KeyD"),
        forward: new Key("KeyW"),
    }
    root.keys = keys;

    let speed = 30.0, back = 1.5 * speed, limit = 10.0;
    root.logic = [
        new LinearChange(keys.left, ship,"angle", toRadians(180.0)),
        new LinearChange(keys.right, ship,"angle", toRadians(-180.0)),
        new LinearChange(keys.forward, ship,"speed", speed + back, undefined, limit),
        new LinearChange(undefined, ship,"speed", -back, 0.0),
        new Move(ship),
    ];
}