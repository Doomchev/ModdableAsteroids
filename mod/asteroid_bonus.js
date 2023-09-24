import Mod from "./mod.js"
import {project, val} from "../src/project.js"
import Img from "../src/image.js"
import {playSound, rad, rnd} from "../src/system.js"
import Sprite from "../src/sprite.js"
import Cos from "../src/function/cos.js"
import SetSize from "../src/actions/sprite/set_size.js"
import SetAngle from "../src/actions/sprite/set_angle.js"

export default class AsteroidBonus extends Mod {
    constructor(probability, ammo, maxAmmo) {
        super()
        this.registry = {
            probability: probability,
            ammo: ammo,
            maxAmmo: maxAmmo,
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
        this.registry.template.image = new Img(val.texture.bonus)
    }

    destroyAsteroid(asteroid) {
        if(rnd() <= this.registry.probability) {
            let bonus = Sprite.createFromTemplate(this.registry.template)
            bonus.setPositionAs(asteroid)
            bonus.add(new SetSize(bonus, new Cos(0.45, 0.1, 0, 1)))
            bonus.add(new SetAngle(bonus, new Cos(0.9, rad(15))))
            val.bonuses.add(bonus)
        }
    }

    update() {
        let reg = project.registry
        let ammo = Math.min(val.ammo.value + this.registry.ammo, this.registry.maxAmmo)
        val.bonuses.collisionWith(val.shipSprite, function(bonus) {
            val.currentWeapon = reg.weapon.doubleBarreled
            val.ammo.value = ammo
            val.currentWeapon.registry.turret.visible = true
            playSound(val.sound.bonus)
            val.bonuses.remove(bonus)
        })
    }
}