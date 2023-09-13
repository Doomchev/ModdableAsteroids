import {project} from "../src/project.js"
import Sprite from "../src/sprite.js"
import {get, rad, randomSign, rnd} from "../src/system.js"
import RotateImage from "../src/actions/sprite/rotate_image.js"
import {Mod} from "../src/mod.js"

export default class DefaultAsteroidCreation extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Стандартная функция создания астероида"
            default:
                return "Default function for creating asteroid"
        }
    }

    init() {
        let asteroids = get("asteroids")
        let asteroidImages = get("asteroidImages")

        project.registry.createAsteroid = function (centerX, centerY, type, piece, angle = 0) {
            let asteroid = Sprite.create(undefined, asteroids, asteroidImages, centerX, centerY
                , type.size, type.size, angle + rad(rnd(-15.0, 15.0)), rnd(type.minSpeed, type.maxSpeed)
                , rnd(type.minAnimSpeed, type.maxAnimSpeed) * randomSign(), rad(rnd(360)))
            asteroid.add(new RotateImage(asteroid, rad(rnd(-180, 180))))
            asteroid.type = type
            return asteroid
        }
    }
}
