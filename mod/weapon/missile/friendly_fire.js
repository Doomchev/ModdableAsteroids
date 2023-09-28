import {func, project, val} from "../../../src/project.js"
import Mod from "../../mod.js"

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
        //let missile = val.weapon.missile
        let onHit = val.weapon.missile.missile.onHit
        val.weapon.missile.missile.onHit = function() {
            onHit.call(this)
            if(this.collidesWithSprite(val.shipSprite)) {
                func.destroyShip()
            }
        }
    }
}