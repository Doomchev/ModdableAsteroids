import Mod from "../src/mod.js"
import {currentCanvas} from "../src/canvas.js"
import {pobj, project} from "../src/project.js"

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
        currentCanvas.setPositionAs(pobj.shipSprite)
        pobj.bounds.setPositionAs(pobj.shipSprite)
        pobj.hud.setPositionAs(pobj.shipSprite)
    }
}