import Mod from "./mod.js"
import {project, val} from "../src/project.js"
import Img from "../src/image.js"
import {playSound, rad, rnd} from "../src/system.js"
import Sprite from "../src/sprite.js"
import Cos from "../src/function/cos.js"
import SetSize from "../src/actions/sprite/set_size.js"
import SetAngle from "../src/actions/sprite/set_angle.js"

export default class AsteroidBonus extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Бонусы из разрушенных астероидов"
            default:
                return "Bonuses from destroyed asteroids"
        }
    }

    destroyAsteroid(asteroid) {
        val.weapons.forEach(weapon => {
            if(rnd() <= weapon.registry.probability) {
                let bonus = Sprite.createFromTemplate(weapon.registry.bonus)
                bonus.weapon = weapon
                bonus.setPositionAs(asteroid)
                bonus.add(new SetSize(bonus, new Cos(0.45, 0.1, 0, 1)))
                bonus.add(new SetAngle(bonus, new Cos(0.9, rad(15))))
                val.bonuses.add(bonus)
            }
        })
    }

    update() {
        val.bonuses.collisionWith(val.shipSprite, function(bonus) {
            let weapon = bonus.weapon
            val.currentWeapon = weapon
            val.ammo.value = Math.min(val.ammo.value + weapon.registry.ammo, weapon.registry.maxAmmo)
            val.currentWeapon.registry.turret.visible = true
            playSound(val.sound.bonus)
            val.bonuses.remove(bonus)
        })
    }
}