import Mod from "./mod.js"
import {func, mod, project, val} from "../src/project.js"
import {rad} from "../src/system.js"
import Rnd from "../src/function/rnd.js"
import Mul from "../src/function/mul.js"
import RandomSign, {rnds} from "../src/function/random_sign.js"

export default class AsteroidPieces extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Разбиение астероидов на куски"
            default:
                return "Splitting asteroids to pieces"
        }
    }

    init() {
        let type = val.asteroidType

        type.big = {
            layer: val.asteroids,
            images: val.asteroidImages,
            size: 3,
            angle: new Rnd(rad(-15), rad(15)),
            speed: new Rnd(2, 3),
            animationSpeed: new Mul(new Rnd(12, 20), rnds),
            rotationSpeed: new Rnd(rad(-180), rad(180)),
            score: 100,
        }
        type.medium = {
            layer: val.asteroids,
            images: val.asteroidImages,
            size: 2,
            angle: new Rnd(rad(-15), rad(15)),
            speed: new Rnd(2.5, 4),
            animationSpeed: new Mul(new Rnd(16, 25), rnds),
            rotationSpeed: new Rnd(rad(-180), rad(180)),
            score: 200,
        }
        type.small = {
            layer: val.asteroids,
            images: val.asteroidImages,
            size: 1,
            angle: new Rnd(rad(-15), rad(15)),
            speed: new Rnd(3, 5),
            animationSpeed: new Mul(new Rnd(20, 30), rnds),
            rotationSpeed: new Rnd(rad(-180), rad(180)),
            score: 300,
        }

        type.big.pieces = [
            {
                type: type.medium,
                angle: 0,
            },
            {
                type: type.small,
                angle: 60,
            },
            {
                type: type.small,
                angle: -60,
            },
        ]
        type.medium.pieces = [
            {
                type: type.small,
                angle: 60,
            },
            {
                type: type.small,
                angle: -60,
            },
        ]
        type.small.pieces = []

        type.default = type.big

        func.destroyAsteroid = function (asteroid, angle) {
            mod.forEach(module => module.destroyAsteroid(asteroid, angle))
            asteroid.type.pieces.forEach(piece => {
                func.createAsteroid(asteroid, undefined, piece.type, angle + rad(piece.angle))
            })
            func.createExplosion(asteroid, asteroid.width)
            func.removeAsteroid(asteroid)
        }
    }
}