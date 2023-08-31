import Image from "./src/image.js"
import Sprite from "./src/sprite.js"
import Key from "./src/key.js"
import {current, randomInt, randomFloat, root, toRadians, randomSign} from "./src/system.js"
import LinearChange from "./src/actions/linear_change.js"
import Move from "./src/actions/sprite/move.js"
import If from "./src/actions/structure/if.js"
import ImageArray from "./src/image_array.js"
import Constraint from "./src/constraint.js"
import Animate from "./src/actions/sprite/animate.js"
import SetField from "./src/actions/set_field.js"
import Layer from "./src/layer.js"
import CreateSprite from "./src/actions/sprite/create.js"
import SetPosition from "./src/actions/sprite/set_position.js"
import SetSize from "./src/actions/sprite/set_size.js"
import SetAngle from "./src/actions/sprite/set_angle.js"
import Delayed from "./src/actions/delayed.js"
import {currentCanvas} from "./src/canvas.js"
import SetBounds from "./src/actions/sprite/set_bounds.js"
import LoopArea from "./src/actions/sprite/loop_area.js";
import Shape from "./src/shape.js"
import ExecuteActions from "./src/actions/sprite/execute_actions.js"
import Rotate from "./src/actions/sprite/rotate.js"
import AddAction from "./src/actions/sprite/add_action.js"

export let textures = {
    ship: "textures/ship.png",
    flame: "textures/flame.png",
    bullet: "textures/bullet.png",
    asteroid: "textures/asteroid.png",
}

export function init() {
    let bounds = new Shape(0.0, 0.0, currentCanvas.width + 2.0, currentCanvas.height + 2.0)

    let shipTexture = textures.ship
    let ship = new Sprite(new Image(shipTexture, 0, 0, shipTexture.width, shipTexture.height
        , 0.35, 0.5, 1.35, 1.9))
    
    let flameImages = new ImageArray(textures.flame, 3, 3)
    let flame = new Sprite(flameImages.images[0], -0.9, 0.0, 1.0, 1.0, -90.0)

    let gun = new Sprite(null, 1.0, 0.0)
    let bulletLayer = new Layer()
    let bulletImages = new ImageArray(textures.bullet, 1, 16
        , 43.0 / 48.0, 5.5 / 12.0, 10.5, 3.0)

    let asteroidLayer = new Layer()
    let asteroidImages = new ImageArray(textures.asteroid, 8, 4)

    for(let i = 0; i < 5; i++) {
        let size = randomFloat(1.0, 2.0)
        let asteroid = new Sprite(asteroidImages.images[0], randomFloat(bounds.leftX, bounds.rightX), bounds.topY
            , size, size, randomFloat(360.0), randomFloat(5.0, 10.0), 0.0)
        asteroid.actions = [
            new Animate(asteroid, asteroidImages, randomFloat(12.0, 20.0) * randomSign()),
            new Rotate(asteroid, toRadians(randomFloat(-180.0, 180.0))),
        ]
        asteroidLayer.items.push(asteroid)
    }

    root.background = "rgb(9, 44, 84)"
    root.scene = [bulletLayer, asteroidLayer, flame, ship]

    let left = new Key("ArrowLeft")
    let right = new Key("ArrowRight")
    let forward = new Key("ArrowUp")
    let fire = new Key("Space")

    let speed = 50.0, back = 1.5 * speed, limit = 15.0, dAngle = toRadians(360.0)
    root.actions = [
        new If(left, new LinearChange(ship,"angle", -dAngle)),
        new If(right, new LinearChange(ship,"angle", dAngle)),
        new If(forward, new LinearChange(ship,"speed", speed + back, undefined, limit)),
        new LinearChange(ship,"speed", -back, 0.0),
        new LoopArea(ship, bounds),
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
            new SetField(current, "speed", 15.0),
            new AddAction(current, new Animate(current, bulletImages, 16.0 )),
        ]),
        new SetBounds(bulletLayer, bounds),
        new Move(bulletLayer),

        new ExecuteActions(asteroidLayer),
        new Move(asteroidLayer),
        new LoopArea(asteroidLayer, bounds),
    ]
}