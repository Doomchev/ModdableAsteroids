import Mod from "./mod.js"
import {currentCanvas} from "../src/canvas.js"
import {val} from "../src/project.js"

export default class CameraMovement extends Mod {
    update() {
        currentCanvas.setPositionAs(val.shipSprite)
        val.bounds.setPositionAs(val.shipSprite)
        val.hud.setPositionAs(val.shipSprite)
    }
}