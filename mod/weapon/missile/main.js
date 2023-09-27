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
        this.bonus = loadTexture("bonus.png")
        //this.bonus = loadSound("fireball.mp3")
    }

    init() {
        this.missile = {
            layer: val.bullets,
            image: new Img(this.missileTexture, undefined, undefined, undefined, undefined
                , 0.95, 0.5, 10, 3),
            size: 0.15,
            speed: 15,
        }

        this.bonus = new Sprite(new Img(this.bonus))
        this.probability = 0.1
        this.ammo = new NumericVariable(3)
        this.maxAmmo = 8

        this.gun = Sprite.create(undefined, undefined, 0.9, 0)
        this.actions = [new Constraint(this.gun, val.shipSprite),]

        let key = new Key("fireMissile", "KeyX")
        project.key.fireMissile = key
        this.delay = new Delayed(key, 0.5)
        val.weapon.missile = this

        let label = new Label(val.hudArea, [loc("missiles"), this.ammo], align.left, align.bottom)
        val.hud.add(label)
    }

    update() {
        if(this.ammo.value > 0 && this.delay.active()) {
            let missile = Sprite.createFromTemplate(this.missile)
            missile.setPositionAs(this.gun)
            missile.turn(val.shipSprite.angle)
            missile.damage = 300
            this.ammo.value--
            //playSound(this.fireSound)
        }
    }

    collect() {
        if(this.ammo.value < this.maxAmmo) this.ammo.value++
    }
}