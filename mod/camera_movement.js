import Mod from "./mod.js"
import {currentCanvas} from "../src/canvas.js"
import {project, val} from "../src/project.js"

export default class CameraMovement extends Mod {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Перемещение камеры c кораблём"
            default:
                return "Moving camera with ship"
        }
    }

    update() {
        currentCanvas.setPositionAs(val.shipSprite)
        val.bounds.setPositionAs(val.shipSprite)
        val.hud.setPositionAs(val.shipSprite)
    }
}