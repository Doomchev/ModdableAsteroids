import Image from "./src/image.js"
import Sprite from "./src/sprite.js"
import Key from "./src/key.js"
import {current, root, toRadians} from "./src/system.js"
import LinearChange from "./src/logic/linear_change.js"
import Move from "./src/logic/sprite/move.js"
import {If} from "./src/structures.js"
import ImageArray from "./src/image_array.js"
import Constraint from "./src/constraint.js"
import Animate from "./src/logic/sprite/animate.js"
import SetField from "./src/logic/set_field.js"
import Layer from "./src/layer.js"
import CreateSprite from "./src/logic/sprite/create.js"
import SetPosition from "./src/logic/sprite/set_position.js";
import SetSize from "./src/logic/sprite/set_size.js";
import SetAngle from "./src/logic/sprite/set_angle.js"
import Delayed from "./src/logic/delayed.js"

export let textures = {
    ship: "textures/ship.png",
    flame: "textures/flame.png",
    bullet: "textures/bullet.png",
}

export function init() {
    let shipTexture = textures.ship
    let ship = new Sprite(new Image(shipTexture, 0, 0, shipTexture.width, shipTexture.height
        , 0.35, 0.5, 1.35, 1.9))
    
    let flameImages = new ImageArray(textures.flame, 3, 3)
    let flame = new Sprite(flameImages.images[0], -0.9, 0.0, 1.0, 1.0, -90.0)

    let gun = new Sprite(null, 1.0, 0.0)
    let bulletLayer = new Layer()
    let bulletImages = new ImageArray(textures.bullet, 1, 16
        , 43.0 / 48.0, 5.5 / 12.0, 10.5, 3.0)

    root.background = "rgb(9, 44, 84)"
    root.scene = [bulletLayer, flame, ship]

    let right = new Key("ArrowLeft")
    let left = new Key("ArrowRight")
    let forward = new Key("ArrowUp")
    let fire = new Key("Space")

    let speed = 30.0, back = 1.5 * speed, limit = 10.0
    root.logic = [
        new If(left, new LinearChange(ship,"angle", toRadians(180.0))),
        new If(right, new LinearChange(ship,"angle", toRadians(-180.0))),
        new If(forward, new LinearChange(ship,"speed", speed + back, undefined, limit)),
        new LinearChange(ship,"speed", -back, 0.0),
        new Move(ship),

        new Animate(flame, flameImages, 16.0),
        new SetField(flame, "visible", forward),
        new Constraint(flame, ship),

        new Constraint(gun, ship),

        new If(new Delayed(fire, 0.15), [
            new CreateSprite(bulletLayer, bulletImages.images[0]),
            new SetPosition(current, gun),
            new SetSize(current, 0.15),
            new SetAngle(current, ship),
            new SetField(current, "speed", 15.0)
        ]),
        new Move(bulletLayer),
    ]
}