import Weapon from "../weapon.js"
import {project, val} from "../../../src/project.js"
import ImageArray from "../../../src/image_array.js"
import Sprite from "../../../src/sprite.js"
import {align, loadSound, loadTexture, loc, playSound} from "../../../src/system.js"
import Constraint from "../../../src/constraint.js"
import Delayed from "../../../src/actions/delayed.js"
import Img from "../../../src/image.js"
import Key from "../../../src/key.js"
import Label from "../../../src/gui/label.js"
import NumericVariable from "../../../src/variable/number.js"

export default class MissileWeapon extends Weapon {
    get name() {
        switch (project.locale) {
            case "ru":
                return "Ракеты"
            default:
                return "Missiles"
        }
    }

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
        }

        this.bonus = new Sprite(new Img(this.bonusTexture))
        this.probability = 0.1
        this.ammo = new NumericVariable(3)
        this.maxAmmo = 8

        this.gun = Sprite.create(undefined, undefined, 0.9, 0)
        this.actions = [new Constraint(this.gun, val.shipSprite),]

        let key = new Key("fireMissile", "KeyX")
        project.key.fireMissile = key
        this.delay = new Delayed(key, 0.5)
        val.weapon.missile = this

        val.hud.add(new Label(val.hudArea, [this.ammo], align.left, align.bottom, "I1", this.iconTexture))
    }

    update() {
        if(this.ammo.value > 0 && this.delay.active()) {
            let missile = Sprite.createFromTemplate(this.missile)
            missile.setPositionAs(this.gun)
            missile.turn(val.shipSprite.angle)
            missile.damage = 300
            this.ammo.decrement()
            playSound(this.fire)
        }
    }

    collect() {
        this.ammo.increment(1, this.maxAmmo)
    }
}