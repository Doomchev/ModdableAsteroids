import NumericVariable from "./src/variable/number.js"
import Shape from "./src/shape.js"
import {currentCanvas} from "./src/canvas.js"
import Label from "./src/gui/label.js"
import {
    addTextures,
    align,
    collisionSprite1,
    collisionSprite2,
    loc,
    project,
    rad,
    randomFloat,
    randomSign
} from "./src/system.js"
import Sprite from "./src/sprite.js"
import Image from "./src/image.js"
import ImageArray from "./src/image_array.js"
import Layer from "./src/layer.js"
import Key from "./src/key.js"
import LinearChange from "./src/actions/linear_change.js"
import LoopArea from "./src/actions/sprite/loop_area.js"
import Move from "./src/actions/sprite/move.js"
import Animate from "./src/actions/sprite/animate.js"
import Constraint from "./src/constraint.js"
import Delayed from "./src/actions/delayed.js"
import AddAction from "./src/actions/sprite/add_action.js"
import {current} from "./src/variable/sprite.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"
import SetBounds from "./src/actions/sprite/set_bounds.js"
import ExecuteActions from "./src/actions/sprite/execute_actions.js"
import RotateImage from "./src/actions/sprite/rotate_image.js"
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

project.locales.en = {
    // hud

    level: "LEVEL ",
    pressSpace: "PRESS SPACE",
    gameOver: "GAME OVER",

    // keys

    left: "Turn left",
    right: "Turn right",
    forward: "Thrust",
    fire: "Fire",

    // variables

    startingLives: "Starting lives",
    acceleration: "Ship acceleration",
    deceleration: "Ship deceleration",
    limit: "Max ship acceleration",
    dAngle: "Ship turning speed",
}

project.locales.ru = {
    level: "УРОВЕНЬ ",
    pressSpace: "НАЖМИТЕ ПРОБЕЛ",
    gameOver: "ИГРА ОКОНЧЕНА",

    left: "Повернуть влево",
    right: "Повернуть вправо",
    forward: "Ускоряться",
    fire: "Стрелять",

    startingLives: "Стартовые жизни",
    acceleration: "Ускорение корабля",
    deceleration: "Замедление корабля",
    limit: "Максимальное ускорениекорабля",
    dAngle: "Скорость вращения корабля",
}

project.enum = {
    state: {
        alive: 0,
        dead: 1,
        gameOver: 2,
    },
    asteroidType: {
        big: 0,
        medium: 1,
        small: 2,
    }
}

project.key = {
    left: new Key("left", "ArrowLeft"),
    right: new Key("right", "ArrowRight"),
    forward: new Key("forward", "ArrowUp"),
    fire: new Key("fire", "Space"),
    continue: new Key("continue", "Enter"),
}

project.init = () => {
    let textures = project.textures
    let enums = project.enum
    let key = project.key

    let score = new NumericVariable("score", 0, "Z8")
    let lives = new NumericVariable("lives", 0, "R ∆")
    let level = new NumericVariable("level", 0)

    let bounds = new Shape("bounds",0.0, 0.0, currentCanvas.width + 2.5
        , currentCanvas.height + 2.5)

    let shipSprite = new Sprite("",  new Image(textures.ship, 0, 0
        , undefined, undefined, 0.35, 0.5, 1.35, 1.9))

    let flameImages = new ImageArray("flameImages", textures.flame, 3, 3)
    let flameSprite = new Sprite("flame", flameImages._images[0], -0.9, 0.0, 1.0, 1.0, rad(-90.0))

    let gun = new Sprite("gun", undefined, 1.0, 0.0)

    let bullets = new Layer("bullets")
    let bulletImages = new ImageArray("bulletImages", textures.bullet
        , 1, 16, 43.0 / 48.0, 5.5 / 12.0, 10.5, 3.0)

    let asteroids = new Layer("asteroids")
    let asteroidImages = new ImageArray("asteroidImages", textures.asteroid
        , 8, 4, 0.5, 0.5, 1.5, 1.5)

    let explosions = new Layer("explosions")
    let explosionImages = new ImageArray("explosionImages", textures.explosion
        , 4, 4, 0.5, 0.5, 2, 2)

    let hudArea = new Shape("hudArea", 0.0, 0.0, currentCanvas.width - 2.0
        , currentCanvas.height - 2.0)
    let scoreLabel = new Label(hudArea, [score], align.left, align.top)
    let levelLabel = new Label(hudArea, [loc("level"), level], align.center, align.top)
    let livesLabel = new Label(hudArea, [lives], align.right, align.top)
    let messageLabel =  new Label(hudArea, [""], align.center, align.center)

    let currentState = enums.state.alive

    project.background = "rgb(9, 44, 84)"
    project.scene = [bullets, asteroids, flameSprite, shipSprite, explosions
        , scoreLabel, levelLabel, livesLabel, messageLabel]

    project.registry = {
        startingLives: 3,
        levelBonus: 1000,
        bounds: bounds,
        ship: {
            acceleration: 25.0,
            deceleration: 15.0,
            limit: 7.5,
            dAngle: 180.0,
        },
    }

    project.actions = [
        new LoopArea(shipSprite, bounds),
        new Move(shipSprite),

        new Animate(flameSprite, flameImages, 16.0),
        new Constraint(flameSprite, shipSprite),

        new Constraint(gun, shipSprite),

        new SetBounds(bullets, bounds),
        new ExecuteActions(bullets),
        new Move(bullets),

        new ExecuteActions(asteroids),
        new Move(asteroids),
        new LoopArea(asteroids, bounds),

        new ExecuteActions(explosions),
    ]

    function createAsteroid(minAstAnimSpeed, maxAstAnimSpeed, astSize, minAstSpeed, maxAstSpeed, astType, astAngle) {
        let asteroid = new Sprite(asteroids, asteroidImages, randomFloat(minAstAnimSpeed, maxAstAnimSpeed) * randomSign()
            , collisionSprite2.sprite, astSize, collisionSprite1.sprite, randomFloat(minAstSpeed,maxAstSpeed, 0.0))
        asteroid.actions.push(new RotateImage(current, randomFloat(rad(-180.0), rad(180.0))))
        asteroid.type = astType
        asteroid.turn(astAngle + randomFloat(rad(-15.0), rad(15.0)))
        return asteroid
    }

    function createExplosion(sprite) {
        let explosion = new Sprite(explosions, explosionImages, sprite.centerX, sprite.centerY
            , sprite.width, sprite.height, randomFloat(rad(360.0)), 0, 16)
        new AddAction(explosion, new DelayedRemove(explosion, explosions, 1.0))
    }

    let delayed = new Delayed(key.fire, 0.15)

    project.update = () => {
        let val = project.registry
        let ship = val.ship
        let state = project.enum.state
        let asteroidType = project.enum.asteroidType

        if(currentState === state.alive) {
            if(key.left._isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(ship.dAngle))
            }
            if(key.right._isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.dAngle))
            }
            if(key.forward._isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, undefined, ship.limit)
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
            }

            flameSprite.visible = key.forward._isDown

            if(delayed.toBoolean()) {
                bullets.items.push(new Sprite("", bulletImages, gun.centerX, gun.centerY, 0.15, 0.15, shipSprite.angle
                    , 15.0, 16.0))
            }

            shipSprite.collisionWith(asteroids, () => {
                createExplosion(shipSprite)
                shipSprite.hide()
                flameSprite.hide()
                if (lives.value === 0) {
                    messageLabel.items = [loc("gameOver")]
                    currentState = state.gameOver
                } else {
                    messageLabel.items = [loc("pressSpace")]
                    currentState = state.dead
                }
            })
       } else if(key.continue._isPressed()) {
            shipSprite.show()
            flameSprite.show()
            messageLabel.clear()
            shipSprite.centerX = 0
            shipSprite.centerY = 0
            shipSprite.angle = 0
            shipSprite.speed = 0
            if(currentState === state.dead) {
                lives--
            } else {
                lives.value = val.startingLives
                score.value = -val.levelBonus
                asteroids.clear()
            }
            currentState = state.alive
        }

        return

        if(asteroids.isEmpty()) {
            level++
            for(let i = 0; i < level; level++) {
                let asteroid = createAsteroid(12.0, 20.0, 3.0, 2.0
                    , 3.0, enums.asteroidType.big, 0.0)
                asteroid.centerX = randomFloat(bounds.leftX, bounds.rightX)
                asteroid.centerY = bounds.topY
            }
            if(level > 1) score.value += val.levelBonus
        }

        bullets.collisionWith(asteroids, () => {
            let bullet = collisionSprite1.sprite
            let asteroid = collisionSprite2.sprite

            switch (asteroid.type) {
                case asteroidType.big:
                    createAsteroid(16.0, 25.0, 2.0, 2.5, 4.0
                        , asteroidType.medium, 0.0)
                    createAsteroid(20.0, 30.0, 1.0, 3.0, 5.0
                        , asteroidType.small, rad(60.0))
                    createAsteroid(20.0, 30.0, 1.0, 3.0, 5.0
                        , asteroidType.small, rad(-60.0))
                    score += 100
                    break
                case asteroidType.medium:
                    createAsteroid(0.0, 30.0, 1.0, 3.0, 5.0
                        , asteroidType.small, rad(60.0))
                    createAsteroid(20.0, 30.0, 1.0, 3.0, 5.0
                        , asteroidType.small, rad(-60.0))
                    score += 200
                    break
                case asteroidType.small:
                    score += 300
                    break
            }

            createExplosion(asteroid)
            bullets.remove(bullet)
            asteroids.remove(asteroid)
        })
    }

    //exportProject()
}