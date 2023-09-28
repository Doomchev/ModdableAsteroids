import Weapon from "../weapon.js"
import Sprite from "../../../src/sprite.js"
import Img from "../../../src/image.js"
import {project, val} from "../../../src/project.js"
import Constraint from "../../../src/constraint.js"
import Delayed from "../../../src/actions/delayed.js"
import {align, loadSound, loadTexture, loc, playSound} from "../../../src/system.js"
import DelayedRemove from "../../../src/actions/sprite/delayed_remove.js"
import {current} from "../../../src/variable/sprite.js"
import NumericVariable from "../../../src/variable/number.js"
import Label from "../../../src/gui/label.js"

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
            icon: loadTexture("icon.png")
        }

        this.sound = {
            bulletFire: loadSound("bullet.mp3"),
            bulletHit: loadSound("bullet_hit.mp3"),
        }
    }

    init() {
        this.turret = new Sprite(new Img(this.texture.turret), 0, 0, 2, 2)
        this.barrelEnd = []
        this.gunDelay = new Delayed(project.key.fire, 0.10)

        this.bullet = {
            layer: val.bullets,
            image: new Img(this.texture.bullet),
            size: 0.12,
            speed: 30,
            parameters: {
                damage: 50,
                explosionSize: 0.5,
            }
        }

        this.gunfire = {
            layer: val.shipLayer,
            image: new Img(this.texture.gunfire, undefined, undefined, undefined, undefined
                , 0, 0.5),
            size: 1,
        }

        this.bonus = new Sprite(new Img(this.texture.bonus))
        this.probability = 0.1
        this.ammo = new NumericVariable(0)
        this.bonusAmmo = 50
        this.maxAmmo = 100

        for(let i = 0; i < 2; i++) {
            let barrelEnd = new Sprite(undefined, 0.5, 0.4 * (i === 0 ? -1 : 1))
            this.barrelEnd.push(barrelEnd)
            this.actions.push(new Constraint(barrelEnd, this.turret))
        }

        this.gunfire = new Array(2)
        val.weapon.doubleBarreled = this

        this.turret.visible = false
        val.shipLayer.add(this.turret)

        val.hud.add(new Label(val.hudArea, [this.ammo], align.right, align.bottom, "I10", this.texture.icon))
    }

    collect() {
        val.currentWeapon = this
        this.ammo.increment(this.bonusAmmo, this.maxAmmo)
        this.turret.visible = true
    }

    update() {
        if(val.currentWeapon !== this) return

        if(this.gunDelay.active()) {
            for (let i = 0; i <= 1; i++) {
                let bullet = Sprite.createFromTemplate(this.bullet)
                bullet.setPositionAs(this.barrelEnd[i])
                bullet.turn(val.shipSprite.angle)
                bullet.onHit = () => {
                    playSound(this.sound.bulletHit)
                }

                let gunfire = Sprite.createFromTemplate(this.gunfire)
                gunfire.setPositionAs(this.barrelEnd[i])
                gunfire.turn(val.shipSprite.angle)
                gunfire.add(new DelayedRemove(gunfire, val.shipLayer, 0.05))
                this.gunfire[i] = gunfire
            }
            playSound(this.sound.bulletFire)
            this.ammo.decrement()
            if(this.ammo.value === 0) {
                this.turret.visible = false
                val.currentWeapon = val.weapon.default
            }
        }

        let ship = val.shipSprite
        let turret = this.turret
        turret.setPositionAs(ship)
        turret.angle = ship.angle
        if(this.gunfire[0]) {
            this.gunfire[0].setPositionAs(this.barrelEnd[0])
            this.gunfire[1].setPositionAs(this.barrelEnd[1])
        }
    }
}