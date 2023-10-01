import {func, project, val} from "../../../src/project.js"
import Mod from "../../mod.js"
import {addTranslations} from "../../../src/tree.js"

export default class FriendlyFire extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Повреждение корабля взрывом ракеты"
            default:
                return "Ship damage by missiles"
        }
    }

    init() {
        let parameters = val.weapon.missile.missile.parameters
        let onHit = parameters.onHit
        parameters.onHit = function() {
            onHit.call(this)
            if(this.collidesWithSprite(val.shipSprite)) {
                func.destroyShip()
            }
        }

        addTranslations({
            FriendlyFire: "ВзрывРакетыПовреждаетКорабль",
            probability: "вероятность",
            ammo: "патроны",
            bonusAmmo: "бонусныеПатроны",
            maxAmmo: "максимумПатронов",
            gun: "дуло",
            missile: "ракета",
            icon: "иконка",
            bonus: "бонус",
            fire: "огонь",
            fireMissile: "пуститьРакету",
        })
    }
}