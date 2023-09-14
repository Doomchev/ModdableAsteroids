import Mod from "../src/mod.js"
import {project, val} from "../src/project.js"
import {classes} from "../src/classes.js"

export default class DefaultAsteroidDestruction extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Стандартная функция уничтожения астероида"
            default:
                return "Default function for destroying asteroid"
        }
    }

    destroyAsteroid(asteroid) {
        val.createExplosion(asteroid, asteroid.width)
    }
}

classes.DefaultAsteroidDestruction = function () {return new DefaultAsteroidDestruction()}