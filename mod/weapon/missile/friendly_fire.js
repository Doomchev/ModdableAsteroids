import {func, val} from "../../../src/project.js"
import Mod from "../../mod.js"

export default class FriendlyFire extends Mod {
    init() {
        let parameters = val.weapon.missile.missile.parameters
        let onHit = parameters.onHit
        parameters.onHit = function() {
            onHit.call(this)
            if(this.collidesWithSprite(val.shipSprite)) {
                func.destroyShip()
            }
        }
    }
}