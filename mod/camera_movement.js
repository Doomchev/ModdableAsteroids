import Mod from "./mod.js"
import {currentCanvas} from "../src/canvas.js"
import {project, val} from "../src/project.js"
import {addTranslations} from "../src/tree.js"

export default class CameraMovement extends Mod {
    init() {
        addTranslations({
            CameraMovement: "ПеремещениеКамерыСКораблём"
        })
    }

    update() {
        currentCanvas.setPositionAs(val.shipSprite)
        val.bounds.setPositionAs(val.shipSprite)
        val.hud.setPositionAs(val.shipSprite)
    }
}