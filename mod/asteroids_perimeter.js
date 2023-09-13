import {rad, rnd} from "../src/system.js"
import Mod from "../src/mod.js"
import {pobj, project, val} from "../src/project.js"

export default class AsteroidsPerimeter extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Появление астероидов по периметру экрана"
            default:
                return "Creation of asteroids on screen perimeter"
        }
    }

    initLevel(num) {
        let bounds = pobj.bounds
        for(let i = 0; i < num; i++) {
            let x, y
            if (rnd() < 0.5) {
                x = rnd(bounds.leftX, bounds.rightX)
                y = bounds.topY
            } else {
                x = bounds.leftX
                y = rnd(bounds.topY, bounds.bottomY)
            }
            val.createAsteroid(x, y, val.asteroidType.default, undefined, rnd(rad(360)))
        }
    }
}
