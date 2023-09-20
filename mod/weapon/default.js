import Weapon from "./weapon.js"
import {project, val} from "../../src/project.js"
import ImageArray from "../../src/image_array.js"
import Sprite from "../../src/sprite.js"
import {playSound} from "../../src/system.js"
import Constraint from "../../src/constraint.js"
import Delayed from "../../src/actions/delayed.js"

export default class DefaultWeapon extends Weapon {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Оружие по умолчанию"
            default:
                return "Default weapon"
        }
    }

    init() {
        this.registry = {
            bullet: {
                layer: val.bullets,
                images: new ImageArray(project.texture.fireball
                , 1, 16, 43 / 48, 5.5 / 12, 5.25, 1.5),
                size: 0.3,
                speed: 15,
                //angle: new Rnd(rad(-10), rad(10)),
                animationSpeed: 16.0,
            },
            gun: Sprite.create(undefined, undefined, 1, 0),
            gunDelay: new Delayed(project.key.fire, 0.15),
        }
        this.actions = [new Constraint(this.registry.gun, val.shipSprite),]
        val.weapon.default = this
        val.currentWeapon = this
    }

    fire() {
        if(this.registry.gunDelay.active()) {
            let bullet = Sprite.createFromTemplate(this.registry.bullet)
            bullet.setPositionAs(this.registry.gun)
            bullet.turn(val.shipSprite.angle)
            bullet.damage = 100
            playSound("fireball")
        }
    }
}