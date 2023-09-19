import NumericVariable from "./src/variable/number.js"
import Shape from "./src/shape.js"
import {currentCanvas} from "./src/canvas.js"
import Label from "./src/gui/label.js"
import {addTextures, align, loc, rad, setName} from "./src/system.js"
import Sprite from "./src/sprite.js"
import Img from "./src/image.js"
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
import Rnd from "./src/function/rnd.js"
import {RandomSign} from "./src/function/random_sign.js"
import Mul from "./src/function/mul.js"
import AsteroidPieces from "./mod/asteroid_pieces.js"
import AsteroidsHealth from "./mod/asteroids_health.js"
import MultiExplosion from "./mod/multi_explosion.js"
import CameraMovement from "./mod/camera_movement.js"
import ExtraLifeBonus from "./mod/extra_life_bonus.js"
import BonusForLevel from "./mod/bonus_for_level.js"
import InfiniteLives from "./mod/infinite_lives.js"
import DefaultWeapon from "./mod/weapon/default.js"
import DoubleBarreled from "./mod/weapon/double_barreled.js"
import AsteroidBonus from "./mod/asteroid_bonus.js"

project.loadTextures = () => {
    addTextures({
        ship: "textures/ship.png",
        flame: "textures/flame.png",
        asteroid: "textures/asteroid.png",
        explosion: "textures/explosion.png",
        fireball: "textures/fireball.png",
        turret: "textures/turret.png",
        bullet: "textures/bullet.png",
        gunfire: "textures/gunfire.png",
        bonus: "textures/bonus.png",
    })
}

project.locales.en = {
    // hud

    level: "LEVEL ",
    pressEnter: "PRESS ENTER",
    gameOver: "GAME OVER",
    paused: "PAUSED",
    ammo: "AMMO: ",

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
    ammo: "ПАТРОНЫ: ",

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

setRegistry({
    startingLives: 3,
    ship: {
        acceleration: 25,
        deceleration: 15,
        limit: 7.5,
        dAngle: 180,
    },
    weapon: {},
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

project.sound = {
    fireball: new Audio("sounds/fireball.mp3"),
    bullet: new Audio("sounds/bullet.mp3"),
    bulletHit: new Audio("sounds/bullet_hit.mp3"),
    explosion: new Audio("sounds/explosion.mp3"),
    death: new Audio("sounds/death.mp3"),
    extraLife: new Audio("sounds/extra_life.mp3"),
    flame: new Audio("sounds/flame.mp3"),
    newLevel: new Audio("sounds/new_level.mp3"),
    gameOver: new Audio("sounds/game_over.mp3"),
    music: new Audio("sounds/music.mp3"),
    bonus: new Audio("sounds/bonus.mp3"),
}

project.allModules = [
    [new AsteroidPieces(), true],
    [new AsteroidsHealth(), true],
    [new MultiExplosion(), true],
    [new CameraMovement(), true],
    [new ExtraLifeBonus(25000), true],
    [new BonusForLevel(1000), true],
    [new InfiniteLives(), false],
    [new DefaultWeapon(), true],
    [new DoubleBarreled(), true],
    [new AsteroidBonus(0.1, 50), true],
]

project.init = () => {
    let textures = project.texture

    let score = new NumericVariable("score", 0)
    let lives = new NumericVariable("lives", val.startingLives)
    let level = new NumericVariable("level", 0)
    let ammo = new NumericVariable("ammo", 0)

    let bullets = new Layer("bullets")
    let ship = new Layer("ship")
    let asteroids = new Layer("asteroids")
    let bonuses = new Layer("bonuses")
    let explosions = new Layer("explosions")

    val.asteroidType.default.images = new ImageArray("asteroidImages", textures.asteroid
        , 8, 4, 0.5, 0.5, 1.5, 1.5)

    project.registry.template = {
        ship: {
            image: new Img(textures.ship, 0, 0, undefined, undefined
                , 0.5, 0.5, 1.75, 1.75),
            angle: 0,
            speed: 0,
        },
        explosion: {
            layer: explosions,
            images: new ImageArray("explosionImages", textures.explosion
                , 4, 4, 0.5, 0.5, 2, 2),
            angle: new Rnd(rad(360)),
            animationSpeed: 16
        },
    }
    let template = project.registry.template

    let bounds = Shape.create("bounds", 0, 0, currentCanvas.width + 3
        , currentCanvas.height + 3)

    let shipSprite = Sprite.createFromTemplate(template.ship)
    setName(shipSprite, "shipSprite")
    ship.add(shipSprite)

    let flameImages = new ImageArray("flameImages", textures.flame, 3, 3)
    let flameSprite = Sprite.create("flameSprite", undefined, flameImages._images[0], -0.9, 0
        , 1, 1, rad(-90))
    ship.add(flameSprite)

    let hudArea = Shape.create("hudArea", 0, 0, currentCanvas.width - 1
        , currentCanvas.height - 1)

    let scoreLabel = new Label("scoreLabel", hudArea, [score], align.left, align.top, "Z8")
    let levelLabel = new Label("levelLabel", hudArea, [loc("level"), level], align.center, align.top)
    let livesLabel = new Label("livesLabel", hudArea, [lives], align.right, align.top, "R ∆")
    let ammoLabel = new Label("ammoLabel", hudArea, [loc("ammo"), ammo], align.right, align.bottom)

    let messageLabel = new Label("messageLabel", hudArea, [""], align.center, align.center)
    let hud = new Layer("hud", scoreLabel, levelLabel, livesLabel, messageLabel, ammoLabel)

    project.background = "rgb(9, 44, 84)"
    project.scene = [bullets, asteroids, bonuses, ship, explosions, hud]

    project.actions = [
        new LoopArea(shipSprite, bounds),
        new Move(shipSprite),

        new Animate(flameSprite, flameImages, 16),
        new Constraint(flameSprite, shipSprite),

        new SetBounds(bullets, bounds),
        new ExecuteActions(bullets),
        new Move(bullets),

        new ExecuteActions(asteroids),
        new Move(asteroids),
        new LoopArea(asteroids, bounds),

        new ExecuteActions(explosions),
        new ExecuteActions(bonuses),
        new ExecuteActions(ship),
    ]

    initUpdate()
}
