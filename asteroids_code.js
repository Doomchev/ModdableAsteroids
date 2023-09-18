import Sprite from "./src/sprite.js"
import {loc, loopedSound, num, paused, playSound, rad, rnd, rndi, togglePause} from "./src/system.js"
import LinearChange from "./src/actions/linear_change.js"
import {func, mod, obj, project, val} from "./src/project.js"
import RotateImage from "./src/actions/sprite/rotate_image.js"
import DelayedRemove from "./src/actions/sprite/delayed_remove.js"

export function initUpdate() {
    let asteroids = obj.asteroids
    let shipSprite = obj.shipSprite
    let flameSprite = obj.flameSprite
    let bullets = obj.bullets
    let bulletImages = obj.bulletImages
    let explosions = obj.explosions
    let explosionImages = obj.explosionImages
    let gun = obj.gun
    let lives = obj.lives
    let messageLabel = obj.messageLabel
    let level = obj.level
    let score = obj.score

    let ship = val.ship
    let state = val.state
    let key = project.key
    let template = val.template

    let currentState = state.alive

    loopedSound("music", 0, 1.81, true)
    let flameSound = loopedSound("flame", 1.1, 1.9, true)

    // functions

    func.createAsteroids = function(num) {
        let bounds = obj.bounds
        for(let i = 0; i < num; i++) {
            let x, y
            if (rndi() === 0) {
                x = rnd(bounds.leftX, bounds.rightX)
                y = bounds.topY
            } else {
                x = bounds.leftX
                y = rnd(bounds.topY, bounds.bottomY)
            }
            func.createAsteroid(x, y, val.asteroidType.default, rnd(rad(360)))
        }
    }

    func.createAsteroid = function (centerX, centerY, type, angle = 0) {
        let asteroid = Sprite.createFromTemplate(type)
        if(centerY === undefined) {
            asteroid.setPositionAs(centerX.toSprite())
        } else {
            asteroid.moveTo(centerX, centerY)
        }
        asteroid.turn(angle)
        asteroid.type = type
        asteroid.imageAngle = 0
        asteroid.add(new RotateImage(asteroid, num(type.rotationSpeed)))
        mod.forEach(module => module.initAsteroid(asteroid))
        return asteroid
    }

    func.removeAsteroid= function (asteroid) {
        score.value += asteroid.type.score
        asteroids.remove(asteroid)
    }

    func.asteroidHit = function(asteroid, bullet) {
        func.destroyAsteroid(asteroid, bullet.angle)
        func.createSingleExplosion(bullet, 0.7, false)
        func.removeAsteroid(asteroid)
    }

    func.destroyAsteroid = function (asteroid, angle) {
        func.createExplosion(asteroid, asteroid.width)
        playSound("explosion")
    }

    func.createExplosion = function (sprite, size, playSnd = true) {
        let explosion = Sprite.createFromTemplate(template.explosion)
        explosion.width = explosion.height = size
        explosion.moveTo(sprite.centerX, sprite.centerY)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        if(playSnd) playSound("explosion")
    }
    func.createSingleExplosion = func.createExplosion

    // main

    project.update = () => {
        if(key.pause.wasPressed) {
            togglePause()
            if(paused) {
                messageLabel.show(loc("paused"))
            } else {
                messageLabel.show()
            }
        }
        if(paused) return

        if(currentState === state.alive) {
            if(key.left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(ship.dAngle))
            }

            if(key.right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.dAngle))
            }

            if(key.forward.isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, 0, ship.limit)
                if(flameSound) flameSound.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
                if(!flameSound.paused) flameSound.pause()
                flameSound.currentTime = 0
            }

            flameSprite.visible = key.forward.isDown

            if(key.fire.isDown) {
                val.weapon.fire()
            }

            shipSprite.collisionWith(asteroids, (sprite, asteroid) => {
                func.createExplosion(shipSprite, 2)
                shipSprite.setFromTemplate(template.ship)
                shipSprite.hide()
                flameSprite.hide()
                if (lives.value === 0) {
                    messageLabel.show(loc("gameOver"))
                    currentState = state.gameOver
                    playSound("gameOver")
                } else {
                    messageLabel.show(loc("pressEnter"))
                    currentState = state.dead
                    playSound("death")
                }
                func.destroyAsteroid(asteroid, 0)
            })
        } else if(key.continue.wasPressed) {
            shipSprite.show()
            flameSprite.show()
            messageLabel.show()
            if(currentState === state.dead) {
                lives.value--
            } else {
                lives.value = val.startingLives
                score.value = 0
                asteroids.clear()
                level.value = 0
                mod.forEach(module => module.reset())
            }
            currentState = state.alive
        } else {
            if(!flameSound.paused) flameSound.pause()
        }

        if(asteroids.isEmpty()) {
            level.value++
            func.createAsteroids(level.value)
            mod.forEach(module => module.initLevel(level.value))
            playSound("newLevel")
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            func.asteroidHit(asteroid, bullet)
            bullets.remove(bullet)
        })
    }
}