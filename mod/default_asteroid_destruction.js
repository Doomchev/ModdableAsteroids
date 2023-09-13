import {Mod} from "../src/mod.js"
import {project} from "../src/project.js"

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
        project.registry.createExplosion(asteroid, asteroid.width)
    }
}