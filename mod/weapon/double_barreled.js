import Weapon from "./weapon.js"
import Sprite from "../../src/sprite.js"
import Img from "../../src/image.js"
import {obj, project, val} from "../../src/project.js"
import Constraint from "../../src/constraint.js"
import Delayed from "../../src/actions/delayed.js"
import {playSound} from "../../src/system.js"
import ImageArray from "../../src/image_array.js"

export default class DoubleBarreled extends Weapon {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Двуствольный пулемёт"
            default:
                return "Double barreled gun"
        }
    }

    init() {
        this.registry = {
            turret: new Sprite(new Img(project.texture.turret), 0, 0, 2, 2),
            barrelEnd: [],
            gunDelay: new Delayed(project.key.fire, 0.10),
            bullet: {
                layer: obj.bullets,
                image: new Img(project.texture.bullet),
                size: 0.12,
                speed: 30,
                damage: 50
                //angle: new Rnd(rad(-10), rad(10)),
            }
        }

        let reg = this.registry
        reg.weapon = this
        for(let i = 0; i < 2; i++) {
            let barrelEnd = new Sprite(undefined, 0.6, 0.4 * (i === 0 ? -1 : 1))
            reg.barrelEnd.push(barrelEnd)
            this.actions.push(new Constraint(barrelEnd, reg.turret))
        }

        val.weapon = this
    }

    fire() {
        let reg = this.registry
        if(reg.gunDelay.active()) {
            for (let i = 0; i < 2; i++) {
                let bullet = Sprite.createFromTemplate(reg.bullet)
                bullet.setPositionAs(reg.barrelEnd[i])
                bullet.turn(obj.shipSprite.angle)
                bullet.damage = 50
            }
            playSound("shooting")
        }
    }

    update() {
        let ship = obj.shipSprite
        let turret = this.registry.turret
        turret.setPositionAs(ship)
        turret.angle = ship.angle
    }

    draw() {
        this.registry.turret.draw()
    }
}