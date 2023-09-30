import Weapon from "../weapon.js"
import {func, project, val} from "../../../src/project.js"
import Sprite from "../../../src/sprite.js"
import {align, loadSound, loadTexture, playSound} from "../../../src/system.js"
import Constraint from "../../../src/constraint.js"
import Delayed from "../../../src/actions/delayed.js"
import Img from "../../../src/image.js"
import Key from "../../../src/key.js"
import Label from "../../../src/gui/label.js"
import NumericVariable from "../../../src/variable/number.js"
import {addTranslations} from "../../../src/tree.js"

export default class MissileWeapon extends Weapon {
    loadAssets() {
        this.missileTexture = loadTexture("missile.png")
        this.iconTexture = loadTexture("icon.png")
        this.bonusTexture = loadTexture("bonus.png")
        this.fire = loadSound("fire.ogg")
    }

    init() {
        this.missile = {
            layer: val.bullets,
            image: new Img(this.missileTexture, undefined, undefined, undefined, undefined
                , 0.95, 0.5, 10, 3),
            size: 0.15,
            speed: 15,
            parameters: {
                damage: 300,
                explosionSize: 5,
                onHit: function() {
                    func.explosionDamage(this, 5)
                }
            },
        }

        this.bonus = new Sprite(new Img(this.bonusTexture))
        this.probability = 0.1
        this.ammo = new NumericVariable(3)
        this.maxAmmo = 8

        this.gun = Sprite.create(undefined, undefined, 0.9, 0)
        this._actions = [new Constraint(this.gun, val.shipSprite),]

        let key = new Key("fireMissile", "KeyX")
        project.key.fireMissile = key
        this.delay = new Delayed(key, 0.5)
        val.weapon.missile = this

        val.hud.add(new Label(val.hudArea, [this.ammo], align.left, align.bottom, "I1", this.iconTexture))

        addTranslations({
            MissileWeapon: "Ракеты",
            probability: "вероятность",
            ammo: "патроны",
            bonusAmmo: "бонусныеПатроны",
            maxAmmo: "максимумПатронов",
            gun: "дуло",
            missile: "ракета",
            icon: "иконка",
            bonus: "бонус",
            fire: "огонь",
            fireMissile: "пуститьРакету",
        })
    }

    update() {
        if(this.ammo.value > 0 && this.delay.active()) {
            let missile = Sprite.createFromTemplate(this.missile)
            missile.setPositionAs(this.gun)
            missile.turn(val.shipSprite.angle)
            this.ammo.decrement()
            playSound(this.fire)
        }
    }

    collect() {
        this.ammo.increment(1, this.maxAmmo)
    }
}