import {Mod} from "../src/mod.js"
import Sprite from "../src/sprite.js"
import {get, rad, rnd} from "../src/system.js"
import DelayedRemove from "../src/actions/sprite/delayed_remove.js"
import {project} from "../src/project.js"

export default class DefaultExplosion extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Стандартная функция создания взрыва"
            default:
                return "Default function for creating explosion"
        }
    }

    init() {
        let explosions = get("explosions")
        let explosionImages = get("explosionImages")

        project.registry.createExplosion = function (sprite, size) {
            let explosion = Sprite.create(undefined, explosions, explosionImages, sprite.centerX, sprite.centerY
                , size, size, rad(rnd(360)), 0, 16)
            explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        }
    }
}