import Mod from "../src/mod.js"
import ImageArray from "../src/image_array.js"
import {obj, project, val} from "../src/project.js"
import Img from "../src/image.js"
import {playSound, rad, rnd} from "../src/system.js"
import Sprite from "../src/sprite.js"
import Pulsation from "../src/actions/sprite/pulsation.js"
import Swing from "../src/actions/sprite/swing.js"

export default class AsteroidBonus extends Mod {
    constructor(probability, ammo) {
        super()
        this.registry = {
            probability: probability,
            ammo: ammo,
            template: {},
        }
    }

    get name() {
        switch (project.locale) {
            case "ru":
                return "Бонусы из разрушенных астероидов"
            default:
                return "Bonuses from destroyed asteroids"
        }
    }

    init() {
        this.registry.template.image = new Img(project.texture.bonus)
    }

    destroyAsteroid(asteroid) {
        if(rnd() <= this.registry.probability) {
            let bonus = Sprite.createFromTemplate(this.registry.template)
            bonus.setPositionAs(asteroid)
            bonus.add(new Pulsation(bonus, 0.1, 0.45))
            bonus.add(new Swing(bonus, rad(15), 0.9))
            obj.bonuses.add(bonus)
        }
    }

    update() {
        let reg = project.registry
        let ammo = this.registry.ammo
        obj.bonuses.collisionWith(obj.shipSprite, function(bonus) {
            val.currentWeapon = reg.weapon.doubleBarreled
            obj.ammo.value = ammo
            val.currentWeapon.registry.turret.visible = true
            playSound("bonus")
            obj.bonuses.remove(bonus)
        })
    }
}