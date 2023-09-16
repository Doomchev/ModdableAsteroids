import Mod from "../src/mod.js"
import {currentCanvas} from "../src/canvas.js"
import {obj, project} from "../src/project.js"

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
        currentCanvas.setPositionAs(obj.shipSprite)
        obj.bounds.setPositionAs(obj.shipSprite)
        obj.hud.setPositionAs(obj.shipSprite)
    }
}