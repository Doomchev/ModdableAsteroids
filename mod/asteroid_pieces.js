import {Mod} from "../src/mod.js"
import {project} from "../src/project.js"
import {rad} from "../src/system.js"

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
        let type = project.registry.asteroidType

        type.big = {
            size: 3,
                minSpeed: 2,
                maxSpeed: 3,
                minAnimSpeed: 12,
                maxAnimSpeed: 20,
                score: 100,
        }
        type.medium = {
            size: 2,
                minSpeed: 2,
                maxSpeed: 2.5,
                minAnimSpeed: 16,
                maxAnimSpeed: 25,
                score: 200,
        }
        type.small = {
            size: 1,
                minSpeed: 3,
                maxSpeed: 5,
                minAnimSpeed: 16,
                maxAnimSpeed: 25,
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
    }

    destroyAsteroid(asteroid, bullet) {
        asteroid.type.pieces.forEach(piece =>  {
            project.registry.createAsteroid(asteroid, undefined, piece.type, piece, bullet.angle + rad(piece.angle))
        })
    }

    update() {
        super.update()
    }

}