import Image from "./src/image.js"
import Sprite from "./src/sprite.js"
import Key from "./src/key.js"
import {collisionSprite1, collisionSprite2, randomFloat, randomSign, root, toRadians} from "./src/system.js"
import LinearChange from "./src/actions/linear_change.js"
import Move from "./src/actions/sprite/move.js"
import If from "./src/actions/structure/if.js"
import ImageArray from "./src/image_array.js"
import Constraint from "./src/constraint.js"
import Animate from "./src/actions/sprite/animate.js"
import SetField from "./src/actions/set_field.js"
import Layer from "./src/layer.js"
import Create from "./src/actions/sprite/create.js"
import Delayed from "./src/actions/delayed.js"
import {currentCanvas} from "./src/canvas.js"
import SetBounds from "./src/actions/sprite/set_bounds.js"
import LoopArea from "./src/actions/sprite/loop_area.js"
import Shape from "./src/shape.js"
import ExecuteActions from "./src/actions/sprite/execute_actions.js"
import Rotate from "./src/actions/sprite/rotate.js"
import OnCollision from "./src/actions/sprite/on_collision.js"
import Remove from "./src/actions/sprite/remove.js"
import {Mul, RandomFloat, RandomSign} from "./src/functions.js"
import AddDelayedDelete from "./src/actions/sprite/delayed_remove.js"
import {current} from "./src/variable.js"
import Empty from "./src/actions/layer/empty.js"
import AddAction from "./src/actions/sprite/add_action.js"
import Repeat from "./src/actions/structure/repeat.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"

export let textures = {
    ship: "textures/ship.png",
    flame: "textures/flame.png",
    bullet: "textures/bullet.png",
    asteroid: "textures/asteroid.png",
    explosion: "textures/explosion.png",
}

export function init() {
    let bounds = new Shape(0.0, 0.0, currentCanvas.width + 2.0, currentCanvas.height + 2.0)

    let shipTexture = textures.ship
    let ship = new Sprite(new Image(shipTexture, 0, 0, shipTexture.width, shipTexture.height
        , 0.35, 0.5, 1.35, 1.9))
    
    let flameImages = new ImageArray(textures.flame, 3, 3)
    let flame = new Sprite(flameImages.images[0], -0.9, 0.0, 1.0, 1.0, -90.0)

    let gun = new Sprite(null, 1.0, 0.0)
    let bullets = new Layer()
    let bulletImages = new ImageArray(textures.bullet, 1, 16
        , 43.0 / 48.0, 5.5 / 12.0, 10.5, 3.0)

    let asteroids = new Layer()
    let asteroidImages = new ImageArray(textures.asteroid, 8, 4, 0.5, 0.5, 1.25, 1.25)

    let explosions = new Layer()
    let explosionImages = new ImageArray(textures.explosion, 4, 4, 0.5, 0.5, 1.5, 1.5)

    root.background = "rgb(9, 44, 84)"
    root.scene = [bullets, asteroids, flame, ship, explosions]

    let left = new Key("ArrowLeft")
    let right = new Key("ArrowRight")
    let forward = new Key("ArrowUp")
    let fire = new Key("Space")

    let acceleration = 25.0, deceleration = 15.0, limit = 7.5, dAngle = toRadians(180.0)
    root.actions = [
        new If(left, new LinearChange(ship,"angle", -dAngle)),
        new If(right, new LinearChange(ship,"angle", dAngle)),
        new If(forward, new LinearChange(ship,"speed", acceleration + deceleration, undefined, limit)),
        new LinearChange(ship,"speed", -deceleration, 0.0),
        new LoopArea(ship, bounds),
        new Move(ship),

        new Animate(flame, flameImages, 16.0),
        new SetField(flame, "visible", forward),
        new Constraint(flame, ship),

        new Constraint(gun, ship),

        new If(new Delayed(fire, 0.15), [
            new Create(bullets, bulletImages, 16.0, gun, 0.15, ship, 15.0),
        ]),
        new SetBounds(bullets, bounds),
        new ExecuteActions(bullets),
        new Move(bullets),

        new ExecuteActions(asteroids),
        new Move(asteroids),
        new LoopArea(asteroids, bounds),

        new ExecuteActions(explosions),

        new If(new Empty(asteroids), [
            new Repeat(5, [
                new Create(asteroids, asteroidImages, new Mul(new RandomFloat(12.0, 20.0), new RandomSign())
                    , {centerX: new RandomFloat(bounds.leftX, bounds.rightX), centerY: bounds.topY}
                    , 2.0, new RandomFloat(360.0), new RandomFloat(2.0, 3.0), 0.0),
                new AddAction(current, new Rotate(current, new RandomFloat(toRadians(-180.0), toRadians(180.0))))
            ]),
        ]),

        new OnCollision(bullets, asteroids, [
            new Create(explosions, explosionImages, 16.0, collisionSprite2, 2.5, new RandomFloat(360.0)),
            new Remove(collisionSprite1, bullets),
            new Remove(collisionSprite2, asteroids),
            new AddAction(current, new DelayedRemove(current, explosions,1.0))
        ])
    ]
}
