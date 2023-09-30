import Mod from "./mod.js"
import {project, val} from "../src/project.js"
import {playSound, rad, rnd} from "../src/system.js"
import Sprite from "../src/sprite.js"
import Cos from "../src/function/cos.js"
import SetSize from "../src/actions/sprite/set_size.js"
import SetAngle from "../src/actions/sprite/set_angle.js"
import {addTranslations} from "../src/tree.js"

export default class AsteroidBonus extends Mod {
    init() {
        addTranslations({
            AsteroidBonus: "БонусИзАстероидов",
        })
    }

    destroyAsteroid(asteroid) {
        for(const[, weapon] of Object.entries(val.weapon)) {
            if(rnd() > weapon.probability) continue
            if(!weapon.bonus) continue

            let bonus = Sprite.createFromTemplate(weapon.bonus)
            bonus.weapon = weapon
            bonus.setPositionAs(asteroid)
            bonus.add(new SetSize(bonus, new Cos(0.45, 0.1, 0, 1)))
            bonus.add(new SetAngle(bonus, new Cos(0.9, rad(15))))
            val.bonuses.add(bonus)
            return
        }
    }

    update() {
        val.bonuses.collisionWith(val.shipSprite, function(bonus) {
            bonus.weapon.collect()
            playSound(project.sound.bonus)
            val.bonuses.remove(bonus)
        })
    }
}