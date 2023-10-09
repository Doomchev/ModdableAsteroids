import Weapon from "../weapon.js"
import {project, val} from "../../../src/project.js"
import ImageArray from "../../../src/image_array.js"
import Sprite from "../../../src/sprite.js"
import {playSound} from "../../../src/system.js"
import Constraint from "../../../src/constraint.js"
import Delayed from "../../../src/actions/delayed.js"
import {currentState} from "../../../code.js"

export default class DefaultWeapon extends Weapon {
    getAssets() {
        return {
            texture: {
                fireball: "fireball.png"
            },
            sound: {
                fire: "fireball.mp3"
            },
        }
    }

    init(texture) {
        this.bullet = {
            layer: val.bullets,
            images: new ImageArray(texture.fireball, 1, 16
                , 43 / 48, 5.5 / 12, 5.25, 1.5),
            size: 0.3,
            speed: 15,
            //angle: new Rnd(rad(-10), rad(10)),
            animationSpeed: 16.0,
            parameters: {
                damage: 100,
                explosionSize: 0.8,
            }
        }

        this.gun = Sprite.create(undefined, undefined, 1, 0)
        this.gunController = new Delayed(project.key.fire, 0.15)
        this._actions = [new Constraint(this.gun, val.shipSprite)]

        val.weapon.default = this
        val.currentWeapon = this
    }

    update() {
        if(val.currentWeapon !== this || currentState !== val.state.alive) return

        if(this.gunController.active()) {
            let bullet = Sprite.createFromTemplate(this.bullet)
            bullet.setPositionAs(this.gun)
            bullet.turn(val.shipSprite.angle)
            playSound(this.sound.fire)
        }
    }
}