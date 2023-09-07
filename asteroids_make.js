import IntVariable from "./src/variable/int.js"
import EnumVariable from "./src/variable/enum.js"
import Shape from "./src/shape.js"
import {currentCanvas} from "./src/canvas.js"
import Label from "./src/gui/label.js"
import {addTextures, align, collisionSprite1, collisionSprite2, loc, project, toRadians} from "./src/system.js"
import Sprite from "./src/sprite.js"
import Image from "./src/image.js"
import ImageArray from "./src/image_array.js"
import Layer from "./src/layer.js"
import Key from "./src/key.js"
import If from "./src/actions/structure/if.js"
import IntIsEqual from "./src/functions/equal.js"
import LinearChange from "./src/actions/linear_change.js"
import LoopArea from "./src/actions/sprite/loop_area.js"
import Move from "./src/actions/sprite/move.js"
import Animate from "./src/actions/sprite/animate.js"
import SetField from "./src/actions/set_field.js"
import Constraint from "./src/constraint.js"
import Delayed from "./src/actions/delayed.js"
import Create from "./src/actions/sprite/create.js"
import OnCollision from "./src/on_collision.js"
import RandomFloat from "./src/functions/random_float.js"
import AddAction from "./src/actions/sprite/add_action.js"
import {current} from "./src/variable/sprite.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"
import Equate from "./src/actions/variable/int_equate.js"
import Pressed from "./src/functions/pressed.js"
import Decrement from "./src/actions/variable/decrement.js"
import Clear from "./src/actions/layer/clear.js"
import SetBounds from "./src/actions/sprite/set_bounds.js"
import ExecuteActions from "./src/actions/sprite/execute_actions.js"
import IsEmpty from "./src/functions/is_empty.js"
import Increment from "./src/actions/variable/increment.js"
import Repeat from "./src/actions/structure/repeat.js"
import Mul from "./src/functions/mul.js"
import RandomSign from "./src/functions/random_sign.js"
import Rotate from "./src/actions/sprite/rotate.js"
import Add from "./src/actions/variable/add.js"
import Remove from "./src/actions/sprite/remove.js"
import {exportProject} from "./src/export.js"

project.loadTextures = () => {
    addTextures({
        ship: "textures/ship.png",
        flame: "textures/flame.png",
        bullet: "textures/bullet.png",
        asteroid: "textures/asteroid.png",
        explosion: "textures/explosion.png",
    })
}

project.en = {
    level: "LEVEL ",
    pressSpace: "PRESS SPACE",
    gameOver: "GAME OVER",
}

project.ru = {
    level: "УРОВЕНЬ ",
    pressSpace: "НАЖМИТЕ ПРОБЕЛ",
    gameOver: "ИГРА ОКОНЧЕНА",
}

project.init = () => {
    let textures = project.textures

    let state = {
        alive: 0,
        dead: 1,
        gameOver: 2,
    }

    let score = new IntVariable("score", -500, "Z8")
    let lives = new IntVariable("lives", 3, "R ∆")
    let level = new IntVariable("level", 0)
    let currentState = new EnumVariable("state", state.alive)

    let hudArea = new Shape("hudArea", 0.0, 0.0, currentCanvas.width - 1.0
        , currentCanvas.height - 1.0)
    let scoreLabel = new Label(hudArea, [score], align.left, align.top)
    let levelLabel = new Label(hudArea, [loc("level"), level], align.center, align.top)
    let livesLabel = new Label(hudArea, [lives], align.right, align.top)
    let messageLabel = new Label(hudArea, [""], align.center, align.center)

    let bounds = new Shape("bounds",0.0, 0.0, currentCanvas.width + 2.5
        , currentCanvas.height + 2.5)

    let ship = new Sprite("ship", new Image(textures.ship, 0, 0
        , undefined, undefined, 0.35, 0.5, 1.35, 1.9))
    let start = new Sprite("start")

    let flameImages = new ImageArray("flameImages", textures.flame, 3, 3)
    let flame = new Sprite("flame", flameImages._images[0], -0.9, 0.0, 1.0, 1.0, toRadians(-90.0))

    let gun = new Sprite("gun", undefined, 1.0, 0.0)
    let bullets = new Layer("bullets")
    let bulletImages = new ImageArray("bulletImages", textures.bullet
        , 1, 16, 43.0 / 48.0, 5.5 / 12.0, 10.5, 3.0)

    let asteroids = new Layer("asteroids")
    let asteroidImages = new ImageArray("asteroidImages", textures.asteroid
        , 8, 4, 0.5, 0.5, 1.5, 1.5)

    let explosions = new Layer("explosions")
    let explosionImages = new ImageArray("explosionImages", textures.explosion
        , 4, 4, 0.5, 0.5, 1.5, 1.5)

    project.background = "rgb(9, 44, 84)"
    project.scene = [bullets, asteroids, flame, ship, explosions, scoreLabel, levelLabel, livesLabel, messageLabel]

    let left = new Key("left", "ArrowLeft")
    let right = new Key("right", "ArrowRight")
    let forward = new Key("forward", "ArrowUp")
    let fire = new Key("fire", "Space")

    let acceleration = 25.0, deceleration = 15.0, limit = 7.5, dAngle = toRadians(180.0)
    project.actions = [
        new If(new IntIsEqual(currentState, state.alive), [
            new If(left, new LinearChange(ship,"angle", -dAngle)),
            new If(right, new LinearChange(ship,"angle", dAngle)),
            new If(forward, new LinearChange(ship,"speed", acceleration + deceleration
                , undefined, limit)),
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

            new OnCollision(ship, asteroids, [
                new Create(explosions, explosionImages, 16.0, ship, 2.5
                    , new RandomFloat(toRadians(360.0))),
                new AddAction(current, new DelayedRemove(current, explosions,1.0)),
                new SetField(ship, "visible", false),
                new SetField(flame, "visible", false),
                new If(new IntIsEqual(lives, 0), [
                    new SetField(messageLabel, "items", [loc("gameOver")]),
                    new Equate(currentState, state.gameOver),
                ], [
                    new SetField(messageLabel, "items", [loc("pressSpace")]),
                    new Equate(currentState, state.dead),
                ])
            ]),
        ], [
            new If(new Pressed(fire), [
                new SetField(ship, "visible", true),
                new SetField(flame, "visible", true),
                new SetField(messageLabel, "items", []),
                new SetField(ship, "centerX", 0.0),
                new SetField(ship, "centerY", 0.0),
                new SetField(ship, "angle", 0.0),
                new SetField(ship, "speed", 0.0),
                new If(new IntIsEqual(currentState, state.dead), [
                    new Decrement(lives),
                ], [
                    new Equate(lives, new IntVariable(undefined, 3)),
                    new Equate(score, new IntVariable(undefined, -500)),
                    new Equate(level, new IntVariable(undefined, 0)),
                    new Clear(asteroids)
                ]),
                new Equate(currentState, state.alive),
            ])
        ]),

        new SetBounds(bullets, bounds),
        new ExecuteActions(bullets),
        new Move(bullets),

        new ExecuteActions(asteroids),
        new Move(asteroids),
        new LoopArea(asteroids, bounds),

        new ExecuteActions(explosions),

        new If(new IsEmpty(asteroids), [
            new Increment(level),
            new Repeat(level, [
                new Create(asteroids, asteroidImages, new Mul(new RandomFloat(12.0, 20.0), new RandomSign())
                    , {centerX: new RandomFloat(bounds.leftX, bounds.rightX), centerY: bounds.topY}
                    , 3.0, new RandomFloat(360.0), new RandomFloat(2.0, 3.0), 0.0),
                new AddAction(current, new Rotate(current, new RandomFloat(toRadians(-180.0), toRadians(180.0))))
            ]),
            new Add(score, 500)
        ]),

        new OnCollision(bullets, asteroids, [
            new Create(explosions, explosionImages, 16.0, collisionSprite2, 3.0, new RandomFloat(360.0)),
            new AddAction(current, new DelayedRemove(current, explosions,1.0)),
            new Remove(collisionSprite1, bullets),
            new Remove(collisionSprite2, asteroids),
            new Add(score, 100)
        ]),
    ]
    exportProject()
}