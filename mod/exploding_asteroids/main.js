import {func, val} from "../../src/project.js"
import ImageArray from "../../src/image_array.js"
import {rnd} from "../../src/system.js"
import Mod from "../mod.js"

export default class ExplodingAsteroids extends Mod {
   getAssets() {
        return {
            texture: {
                asteroid: "asteroid.png"
            },
            sound: {},
        }
    }

    init(texture) {
        this.asteroid = {
            layer: val.asteroids,
            images: new ImageArray(texture.asteroid, 8, 4, 0.5, 0.5, 1.5, 1.5),
            size: 2,
            speed: 5,
            //angle: new Rnd(rad(-10), rad(10)),
            animationSpeed: 24.0,
            hp: 50,
            parameters: {
                explosionSize: 5,
                onHit: function() {
                    func.removeAsteroid(this)
                    func.explosionDamage(this, 5)
                    if(this.collidesWithSprite(val.shipSprite)) {
                        func.destroyShip()
                    }
                }
            }
        }
    }

    initLevel(num) {
        for(let i = 5; i <= num; i += 5) {
            let asteroid = func.createAsteroid(0, 0, this.asteroid, rnd(360))
            asteroid.moveToPerimeter(val.bounds)
        }
    }
}