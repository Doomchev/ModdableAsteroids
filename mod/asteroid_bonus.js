import Mod from "../src/mod.js"
import ImageArray from "../src/image_array.js"
import {obj, project, val} from "../src/project.js"
import Img from "../src/image.js"
import {playSound, rnd} from "../src/system.js"
import Sprite from "../src/sprite.js"

export default class AsteroidBonus extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Бонусы из разрушенных астероидов"
            default:
                return "Bonuses from destroyed asteroids"
        }
    }

    init() {
        this.registry = {
            template: {
                image: new Img(project.texture.bonus),
            },
            probability: 0.1,
        }
    }

    destroyAsteroid(asteroid) {
        if(rnd() <= this.registry.probability) {
            let bonus = Sprite.createFromTemplate(this.registry.template)
            bonus.setPositionAs(asteroid)
            obj.bonuses.add(bonus)
        }
    }

    update() {
        obj.bonuses.collisionWith(obj.shipSprite, function (bonus) {
            val.currentWeapon = project.registry.weapon.doubleBarreled
            playSound("bonus")
            obj.bonuses.remove(bonus)
        })
    }
}