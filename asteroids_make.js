import NumericVariable from "./src/variable/number.js"
import Shape from "./src/shape.js"
import {currentCanvas} from "./src/canvas.js"
import Label from "./src/gui/label.js"
import {align, loadSound, loadTexture, loc, rad} from "./src/system.js"
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
import RandomSign, {rnds} from "./src/function/random_sign.js"
import Mul from "./src/function/mul.js"
import AsteroidPieces from "./mod/asteroid_pieces.js"
import AsteroidsHealth from "./mod/asteroid_health.js"
import MultiExplosion from "./mod/multi_explosion.js"
import CameraMovement from "./mod/camera_movement.js"
import ExtraLifeBonus from "./mod/extra_life_bonus.js"
import BonusForLevel from "./mod/bonus_for_level.js"
import InfiniteLives from "./mod/infinite_lives.js"
import DefaultWeapon from "./mod/weapon/default/main.js"
import DoubleBarreled from "./mod/weapon/double_barreled/main.js"
import AsteroidBonus from "./mod/asteroid_bonus.js"
import Invulnerability from "./mod/invulnerability.js"
import MissileWeapon from "./mod/weapon/missile/main.js"

project.locales.en = {
    // hud

    level: "LEVEL ",
    pressEnter: "PRESS ENTER",
    gameOver: "GAME OVER",
    paused: "PAUSED",
    ammo: "AMMO: ",
    missiles: "MISSILES: ",

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
    missiles: "РАКЕТЫ: ",

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
    invulnerable: false,
    asteroidType: {
        default: {
            size: 3,
            angle: new Rnd(-15, 15),
            speed: new Rnd(2, 3),
            animationSpeed: new Mul(new Rnd(12, 20), rnds),
            score: 100,
        },
    }
})

project.allModules = [
    [new AsteroidPieces(), true],
    [new AsteroidsHealth(), true],
    [new MultiExplosion(), true],
    [new CameraMovement(), true],
    [new ExtraLifeBonus(25000), true],
    [new BonusForLevel(1000), true],
    [new InfiniteLives(), false],
    [new DefaultWeapon(), true, "mod/weapon/default/"],
    [new DoubleBarreled(), true, "mod/weapon/double_barreled/"],
    [new MissileWeapon(), true, "mod/weapon/missile/"],
    [new AsteroidBonus(), true],
    [new Invulnerability(0.05), true],
]

project.loadAssets = () => {
    val.texture = {
        ship: loadTexture("textures/ship.png"),
        flame: loadTexture("textures/flame.png"),
        asteroid: loadTexture("textures/asteroid.png"),
        explosion: loadTexture("textures/explosion.png"),
    }

    val.sound = {
        explosion: loadSound("sounds/explosion.mp3"),
        death: loadSound("sounds/death.mp3"),
        extraLife: loadSound("sounds/extra_life.mp3"),
        flame: loadSound("sounds/flame.mp3"),
        newLevel: loadSound("sounds/new_level.mp3"),
        gameOver: loadSound("sounds/game_over.mp3"),
        music: loadSound("sounds/music.mp3"),
        bonus: loadSound("sounds/bonus.mp3"),
    }
}

project.init = () => {
    val.score = new NumericVariable(0)
    val.lives = new NumericVariable(val.startingLives)
    val.level = new NumericVariable(0)

    val.bullets = new Layer()
    val.shipLayer = new Layer()
    val.asteroids = new Layer()
    val.bonuses = new Layer()
    val.explosions = new Layer()

    val.asteroidImages = new ImageArray(val.texture.asteroid, 8, 4
        , 0.5, 0.5, 1.5, 1.5)
    val.asteroidType.default.images = val.asteroidImages

    val.explosionImages = new ImageArray(val.texture.explosion, 4, 4
        , 0.5, 0.5, 2, 2)
    project.registry.template = {
        ship: {
            image: new Img(val.texture.ship, 0, 0, undefined, undefined
                , 0.5, 0.5, 1.75, 1.75),
            angle: 0,
            speed: 0,
        },
        explosion: {
            layer: val.explosions,
            images: val.explosionImages,
            angle: new Rnd(rad(360)),
            animationSpeed: 16
        },
    }
    let template = project.registry.template

    val.bounds = new Shape(0, 0, currentCanvas.width + 3, currentCanvas.height + 3)

    val.shipSprite = Sprite.createFromTemplate(template.ship)
    val.shipLayer.add(val.shipSprite)

    val.flameImages = new ImageArray(val.texture.flame, 3, 3)
    val.flameSprite = Sprite.create(val.shipLayer, val.flameImages._images[0], -0.9, 0
        , 1, 1, rad(-90))

    val.hudArea = new Shape(0, 0, currentCanvas.width - 1, currentCanvas.height - 1)

    val.scoreLabel = new Label(val.hudArea, [val.score], align.left, align.top, "Z8")
    val.levelLabel = new Label(val.hudArea, [loc("level"), val.level], align.center, align.top)
    val.livesLabel = new Label(val.hudArea, [val.lives], align.right, align.top, "I1", val.texture.ship)

    val.messageLabel = new Label(val.hudArea, [""], align.center, align.center)
    val.hud = new Layer(val.scoreLabel, val.levelLabel, val.livesLabel, val.messageLabel)

    project.background = "rgb(9, 44, 84)"
    project.scene = [val.bullets, val.asteroids, val.bonuses, val.shipLayer, val.explosions, val.hud]

    project.actions = [
        new LoopArea(val.shipSprite, val.bounds),
        new Move(val.shipSprite),

        new Animate(val.flameSprite, val.flameImages, 16),
        new Constraint(val.flameSprite, val.shipSprite),

        new SetBounds(val.bullets, val.bounds),
        new ExecuteActions(val.bullets),
        new Move(val.bullets),

        new ExecuteActions(val.asteroids),
        new Move(val.asteroids),
        new LoopArea(val.asteroids, val.bounds),

        new ExecuteActions(val.explosions),
        new ExecuteActions(val.bonuses),
        new ExecuteActions(val.shipLayer),
    ]

    initUpdate()
}
