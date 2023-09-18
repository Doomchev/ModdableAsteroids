import NumericVariable from "./src/variable/number.js"
import Shape from "./src/shape.js"
import {currentCanvas} from "./src/canvas.js"
import Label from "./src/gui/label.js"
import {addTextures, align, loc, rad, setName} from "./src/system.js"
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
import {project, setRegistry, val} from "./src/project.js"
import {initUpdate} from "./asteroids_code.js"
import Delayed from "./src/actions/delayed.js"
import Rnd from "./src/function/rnd.js"
import {RandomSign} from "./src/function/random_sign.js"
import Mul from "./src/function/mul.js"

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
    pressEnter: "PRESS ENTER",
    gameOver: "GAME OVER",
    paused: "PAUSED",

    // keys

    left: "Turn left",
    right: "Turn right",
    forward: "Thrust",
    fire: "Fire",
    pause: "Pause",

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
    paused: "ПАУЗА",

    left: "Повернуть влево",
    right: "Повернуть вправо",
    forward: "Ускоряться",
    fire: "Стрелять",
    pause: "Пауза",

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
    pause: new Key("pause", "KeyP"),
}

let shipSprite = Sprite.create("shipSprite", undefined)
setRegistry({
    startingLives: 3,
    ship: {
        acceleration: 25,
        deceleration: 15,
        limit: 7.5,
        dAngle: 180,
    },
    state: {
        alive: 0,
        dead: 1,
        gameOver: 2,
    },
    asteroidType: {
        default: {
            size: 3,
            angle: new Rnd(-15, 15),
            speed: new Rnd(2, 3),
            animationSpeed: new Mul(new Rnd(12, 20), RandomSign),
            score: 100,
        },
    }
})

project.sound.shooting = "sounds/shooting.mp3"
project.sound.explosion = "sounds/explosion.mp3"
project.sound.death = "sounds/death.mp3"
project.sound.extraLife = "sounds/extra_life.mp3"
project.sound.flame = "sounds/flame.mp3"
project.sound.newLevel = "sounds/new_level.mp3"
project.sound.gameOver = "sounds/game_over.mp3"
project.sound.music = "sounds/music.mp3"

project.init = () => {
    let textures = project.texture

    let score = new NumericVariable("score", 0)
    let lives = new NumericVariable("lives", val.startingLives)
    let level = new NumericVariable("level", 0)

    let bullets = new Layer("bullets")

    let asteroids = new Layer("asteroids")
    let asteroidImages = new ImageArray("asteroidImages", textures.asteroid
        , 8, 4, 0.5, 0.5, 1.5, 1.5)
    val.asteroidType.default.images = asteroidImages

    let explosions = new Layer("explosions")
    let explosionImages = new ImageArray("explosionImages", textures.explosion
        , 4, 4, 0.5, 0.5, 2, 2)

    project.registry.template = {
        ship: {
            image: new Image(textures.ship, 0, 0, undefined, undefined
                , 0.5, 0.5, 1.75, 1.75),
            angle: 0,
            speed: 0,
        },
        bullet: {
            layer: bullets,
            images: new ImageArray("bulletImages", textures.bullet
                , 1, 16, 43 / 48, 5.5 / 12, 10.5, 3),
            size: 0.15,
            speed: 15,
            //angle: new Rnd(rad(-10), rad(10)),
            animationSpeed: 16.0
        },
        explosion: {
            layer: explosions,
            images: explosionImages,
            angle: new Rnd(rad(360)),
            animationSpeed: 16
        },
    }
    let template = project.registry.template

    let bounds = Shape.create("bounds", 0, 0, currentCanvas.width + 3
        , currentCanvas.height + 3)

    let shipSprite = Sprite.createFromTemplate(template.ship)
    setName(shipSprite, "shipSprite")

    let weapon = Sprite.create()

    let flameImages = new ImageArray("flameImages", textures.flame, 3, 3)
    let flameSprite = Sprite.create("flameSprite", undefined, flameImages._images[0], -0.9, 0
        , 1, 1, rad(-90))

    let gun = Sprite.create("gun", undefined, undefined, 1, 0)
    template.bullet.pos = gun

    let hudArea = Shape.create("hudArea", 0, 0, currentCanvas.width - 1
        , currentCanvas.height - 1)

    let scoreLabel = new Label("scoreLabel", hudArea, [score], align.left, align.top, "Z8")
    let levelLabel = new Label("levelLabel", hudArea, [loc("level"), level], align.center, align.top)
    let livesLabel = new Label("livesLabel", hudArea, [lives], align.right, align.top, "R ∆")
    let messageLabel = new Label("messageLabel", hudArea, [""], align.center, align.center)
    let hud = new Layer("hud", scoreLabel, levelLabel, livesLabel, messageLabel)

    val.gunDelay = new Delayed(project.key.fire, 0.15)

    project.background = "rgb(9, 44, 84)"
    project.scene = [bullets, asteroids, flameSprite, shipSprite, explosions, hud]

    project.actions = [
        new LoopArea(shipSprite, bounds),
        new Move(shipSprite),

        new Animate(flameSprite, flameImages, 16),
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
}
