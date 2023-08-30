import Image from "./src/image.js";
import Sprite from "./src/sprite.js";
import Key from "./src/key.js";
import {root, toRadians} from "./src/system.js";
import LinearChange from "./src/logic/linear_change.js";
import Move from "./src/logic/move.js";
import {IfBlock} from "./src/structures.js";
import ImageArray from "./src/image_array.js";
import Constraint from "./src/constraint.js";
import SpriteAnimation from "./src/logic/sprite_animation.js";
import SetField from "./src/logic/set_field.js";

export let textures = {
    ship: "textures/ship.png",
    flame: "textures/flame.png",
};

export function init() {
    let texture = textures.ship;
    let ship = new Sprite(new Image(texture, 0, 0, texture.width, texture.height
        , 0.35, 0.5, 1.35, 1.9));
    let flameImage = new ImageArray(textures.flame, 3, 3);
    let flame = new Sprite(flameImage.images[0], -0.9, 0.0, 1.0, 1.0, -90.0)
    let constraint = new Constraint(flame, ship);

    root.background = "rgb(9, 44, 84)";
    root.scene = [ship, flame];

    let right = new Key("KeyA");
    let left = new Key("KeyD");
    let forward = new Key("KeyW");

    let speed = 30.0, back = 1.5 * speed, limit = 10.0;
    root.logic = [
        new IfBlock(left, new LinearChange(ship,"angle", toRadians(180.0))),
        new IfBlock(right, new LinearChange(ship,"angle", toRadians(-180.0))),
        new IfBlock(forward, new LinearChange(ship,"speed", speed + back, undefined, limit)),
        new LinearChange(ship,"speed", -back, 0.0),
        new Move(ship),
        new SpriteAnimation(flame, flameImage, 16.0),
        new SetField(flame, "visible", forward),
        constraint,
    ];
}