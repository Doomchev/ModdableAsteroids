import Weapon from "../weapon.js"
import Sprite from "../../../src/sprite.js"
import Img from "../../../src/image.js"
import {project, val} from "../../../src/project.js"
import Constraint from "../../../src/constraint.js"
import Delayed from "../../../src/actions/delayed.js"
import {loadSound, loadTexture, playSound} from "../../../src/system.js"
import DelayedRemove from "../../../src/actions/sprite/delayed_remove.js"

export default class DoubleBarreled extends Weapon {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Двуствольный пулемёт"
            default:
                return "Double barreled gun"
        }
    }

    loadAssets() {
        this.texture = {
            gunfire: loadTexture("gunfire.png"),
            bullet: loadTexture("bullet.png"),
            turret: loadTexture("turret.png"),
            bonus: loadTexture("bonus.png"),
        }

        this.sound = {
            bulletFire: loadSound("bullet.mp3"),
            bulletHit: loadSound("bullet_hit.mp3"),
        }
    }

    init() {
        this.registry = {
            turret: new Sprite(new Img(this.texture.turret), 0, 0, 2, 2),
            barrelEnd: [],
            gunDelay: new Delayed(project.key.fire, 0.10),
            bullet: {
                layer: val.bullets,
                image: new Img(this.texture.bullet),
                size: 0.12,
                speed: 30,
                damage: 50,
                //angle: new Rnd(rad(-10), rad(10)),
            },
            gunfire: {
                layer: val.shipLayer,
                image: new Img(this.texture.gunfire, undefined, undefined, undefined, undefined
                    , 0, 0.5),
                size: 1,
            },
            bonus: new Sprite(new Img(this.texture.bonus)),
            probability: 0.1,
            ammo: 50,
            maxAmmo: 100,
        }
        let reg = this.registry

        for(let i = 0; i < 2; i++) {
            let barrelEnd = new Sprite(undefined, 0.5, 0.4 * (i === 0 ? -1 : 1))
            reg.barrelEnd.push(barrelEnd)
            this.actions.push(new Constraint(barrelEnd, reg.turret))
        }

        this.gunfire = new Array(2)
        val.weapons.push(this)

        reg.turret.visible = false
        val.shipLayer.add(reg.turret)
    }

    fire() {
        let reg = this.registry
        if(reg.gunDelay.active()) {
            for (let i = 0; i < 2; i++) {
                let bullet = Sprite.createFromTemplate(reg.bullet)
                bullet.setPositionAs(reg.barrelEnd[i])
                bullet.turn(val.shipSprite.angle)
                bullet.damage = 50
                bullet.onHit = () => {
                    playSound(this.sound.bulletHit)
                }


                let gunfire = Sprite.createFromTemplate(reg.gunfire)
                gunfire.setPositionAs(reg.barrelEnd[i])
                gunfire.turn(val.shipSprite.angle)
                gunfire.add(new DelayedRemove(gunfire, val.shipLayer, 0.05))
                this.gunfire[i] = gunfire
            }
            playSound(this.sound.bulletFire)
            val.ammo.value -= 1
            if(val.ammo.value === 0) {
                reg.turret.visible = false
                val.currentWeapon = val.weapon.default
            }
        }
    }

    update() {
        let ship = val.shipSprite
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