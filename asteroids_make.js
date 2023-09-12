import NumericVariable from "./src/variable/number.js"
import Shape from "./src/shape.js"
import {currentCanvas} from "./src/canvas.js"
import Label from "./src/gui/label.js"
import {addTextures, align, loc, rad} from "./src/system.js"
import Sprite from "./src/sprite.js"
import Image from "./src/image.js"
import ImageArray from "./src/image_array.js"
import Layer from "./src/layer.js"
import Key from "./src/key.js"
import LoopArea from "./src/actions/sprite/loop_area.js"
import Move from "./src/actions/sprite/move.js"
import Animate from "./src/actions/sprite/animate.js"
import Constraint from "./src/constraint.js"
import SetBounds from "./src/actions/sprite/set_bounds.js"
import ExecuteActions from "./src/actions/sprite/execute_actions.js"
import {exportProject} from "./src/export.js"
import {project} from "./src/project.js"
import {initUpdate} from "./asteroids_code.js"

project._loadTextures = () => {
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
    pressEnter: "PRESS ENTER",
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
    pressEnter: "НАЖМИТЕ ENTER",
    gameOver: "ИГРА ОКОНЧЕНА",

    left: "Повернуть влево",
    right: "Повернуть вправо",
    forward: "Ускоряться",
    fire: "Стрелять",

    startingLives: "Стартовые жизни",
    acceleration: "Ускорение корабля",
    deceleration: "Замедление корабля",
    limit: "Максимальное ускорение корабля",
    dAngle: "Скорость вращения корабля",
}

project.key = {
    left: new Key("left", "ArrowLeft"),
    right: new Key("right", "ArrowRight"),
    forward: new Key("forward", "ArrowUp"),
    fire: new Key("fire", "Space"),
    continue: new Key("continue", "Enter"),
}

project.registry = {
    startingLives: 3,
    levelBonus: 1000,
    lifeBonus: 25000,
    ship: {
        acceleration: 25.0,
        deceleration: 15.0,
        limit: 7.5,
        dAngle: 180.0,
    },
    state: {
        alive: 0,
        dead: 1,
        gameOver: 2,
    },
    asteroidType: {
        big: {
            size: 3,
            minSpeed: 2,
            maxSpeed: 3,
            minAnimSpeed: 12,
            maxAnimSpeed: 20,
            score: 100,
        },
        medium: {
            size: 2,
            minSpeed: 2,
            maxSpeed: 2.5,
            minAnimSpeed: 16,
            maxAnimSpeed: 25,
            score: 200,
        },
        small: {
            size: 1,
            minSpeed: 3,
            maxSpeed: 5,
            minAnimSpeed: 16,
            maxAnimSpeed: 25,
            score: 300,
        },
    }
}

let val = project.registry
let asteroidType = val.asteroidType
asteroidType.big.pieces = [
    {
        type: asteroidType.medium,
        angle: 0,
    },
    {
        type: asteroidType.small,
        angle: 60,
    },
    {
        type: asteroidType.small,
        angle: -60,
    },
]
asteroidType.medium.pieces = [
    {
        type: asteroidType.small,
        angle: 60,
    },
    {
        type: asteroidType.small,
        angle: -60,
    },
]
asteroidType.small.pieces = []

project._init = () => {
    let textures = project.texture

    let score = new NumericVariable("score", 0, "Z8")
    let lives = new NumericVariable("lives", 3, "R ∆")
    let level = new NumericVariable("level", 0)

    let bounds = Shape.create("bounds", 0, 0, currentCanvas.width + 3, currentCanvas.height + 3)

    let shipSprite = Sprite.create("shipSprite", undefined, new Image(textures.ship, 0, 0
        , undefined, undefined, 0.35, 0.5, 1.35, 1.9))

    let flameImages = new ImageArray("flameImages", textures.flame, 3, 3)
    let flameSprite = Sprite.create("flameSprite", undefined, flameImages._images[0], -0.9, 0
        , 1, 1, rad(-90))

    let gun = Sprite.create("gun", undefined, undefined, 1.0, 0.0)

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

    val.objects = [bulletImages, asteroidImages, explosionImages]

    let scoreLabel = new Label("scoreLabel", hudArea, [score], align.left, align.top)
    let levelLabel = new Label("levelLabel", hudArea, [loc("level"), level], align.center, align.top)
    let livesLabel = new Label("livesLabel", hudArea, [lives], align.right, align.top)
    let messageLabel = new Label("messageLabel", hudArea, [""], align.center, align.center)

    project.background = "rgb(9, 44, 84)"
    project.scene = [bullets, asteroids, flameSprite, shipSprite, explosions, scoreLabel, levelLabel, livesLabel
        , messageLabel]

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

    initUpdate()

    exportProject()
}
