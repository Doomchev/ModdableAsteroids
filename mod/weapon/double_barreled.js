import Weapon from "./weapon.js"
import Sprite from "../../src/sprite.js"
import Img from "../../src/image.js"
import {obj, project, val} from "../../src/project.js"
import Constraint from "../../src/constraint.js"
import Delayed from "../../src/actions/delayed.js"
import {playSound} from "../../src/system.js"
import DelayedRemove from "../../src/actions/sprite/delayed_remove.js"

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
                damage: 50,
                //angle: new Rnd(rad(-10), rad(10)),
            },
            gunfire: {
                layer: obj.ship,
                image: new Img(project.texture.gunfire, undefined, undefined, undefined, undefined
                    , 0, 0.5),
                size: 1,
            },
        }

        let reg = this.registry
        reg.weapon = this
        for(let i = 0; i < 2; i++) {
            let barrelEnd = new Sprite(undefined, 0.5, 0.4 * (i === 0 ? -1 : 1))
            reg.barrelEnd.push(barrelEnd)
            this.actions.push(new Constraint(barrelEnd, reg.turret))
        }

        this.gunfire = new Array(2)
        val.weapon.doubleBarreled = this

        reg.turret.visible = false
        obj.ship.add(reg.turret)
    }

    fire() {
        let reg = this.registry
        if(reg.gunDelay.active()) {
            for (let i = 0; i < 2; i++) {
                let bullet = Sprite.createFromTemplate(reg.bullet)
                bullet.setPositionAs(reg.barrelEnd[i])
                bullet.turn(obj.shipSprite.angle)
                bullet.damage = 50

                let gunfire = Sprite.createFromTemplate(reg.gunfire)
                gunfire.setPositionAs(reg.barrelEnd[i])
                gunfire.turn(obj.shipSprite.angle)
                gunfire.add(new DelayedRemove(gunfire, obj.ship, 0.05))
                this.gunfire[i] = gunfire
            }
            playSound("bullet")
            this.ammo -= 1
            if(this.ammo === 0) {
                reg.turret.visible = false
                val.currentWeapon = val.weapon.default
            }
        }
    }

    update() {
        let ship = obj.shipSprite
        let reg = this.registry
        let turret = reg.turret
        turret.setPositionAs(ship)
        turret.angle = ship.angle
        if(this.gunfire[0]) {
            this.gunfire[0].setPositionAs(reg.barrelEnd[0])
            this.gunfire[1].setPositionAs(reg.barrelEnd[1])
        }
    }
}