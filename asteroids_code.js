import Sprite from "./src/sprite.js"
import {loc, rad} from "./src/system.js"
import Delayed from "./src/actions/delayed.js"
import LinearChange from "./src/actions/linear_change.js"
import {pobj, project, val} from "./src/project.js"

export function initUpdate() {
    let asteroids = pobj.asteroids
    let shipSprite = pobj.shipSprite
    let flameSprite = pobj.flameSprite
    let bullets = pobj.bullets
    let bulletImages = pobj.bulletImages
    let gun = pobj.gun
    let lives = pobj.lives
    let messageLabel = pobj.messageLabel
    let level = pobj.level
    let score = pobj.score

    let ship = val.ship
    let state = val.state
    let key = project.key

    let currentState = state.alive
    let delayed = new Delayed(key.fire, 0.15)

    function destroyAsteroid(asteroid, angle) {
        project.modules.forEach(module => module.destroyAsteroid(asteroid, angle))
        asteroids.remove(asteroid)
        new Audio(project.sound.explosion).play()
    }

    let music = new Audio(project.sound.music)
    let length = 1.81
    setInterval(function() {
        if(music.currentTime > length) music.currentTime -= length
    }, 50)
    music.play()

    let flameSound = new Audio(project.sound.flame)
    setInterval(function() {
        if(flameSound.currentTime > 1) flameSound.currentTime -= 1
    }, 50)

    project.update = () => {
       if(currentState === state.alive) {
            if(key.left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(ship.dAngle))
            }

            if(key.right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.dAngle))
            }

            if(key.forward.isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, 0, ship.limit)
                if(flameSound.paused) flameSound.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
                if(!flameSound.paused) flameSound.pause()
            }

            flameSprite.visible = key.forward.isDown

            if(delayed.active()) {
                Sprite.create(undefined, bullets, bulletImages, gun, undefined, 0.15, 0.15
                    , shipSprite.angle, 15.0, 16.0)
                new Audio(project.sound.shooting).play()
            }

            shipSprite.collisionWith(asteroids, (sprite, asteroid) => {
                new Audio(project.sound.death).play()
                val.createExplosion(shipSprite, 2)
                shipSprite.hide()
                flameSprite.hide()
                if (lives.value === 0) {
                    messageLabel.show(loc("gameOver"))
                    currentState = state.gameOver
                    new Audio(project.sound.gameOver).play()
                } else {
                    messageLabel.show(loc("pressEnter"))
                    currentState = state.dead
                }
                destroyAsteroid(asteroid, 0)
            })
        } else if(key.continue.wasPressed) {
            shipSprite.show()
            flameSprite.show()
            messageLabel.show()
            shipSprite.moveTo(0, 0)
            shipSprite.angle = 0
            shipSprite.speed = 0
            if(currentState === state.dead) {
                lives.value--
            } else {
                lives.value = val.startingLives
                score.value = 0
                asteroids.clear()
                level.value = 0
                project.modules.forEach(module => module.reset(level.value))
            }
            currentState = state.alive
        }

        if(asteroids.isEmpty()) {
            level.value++
            project.modules.forEach(module => module.initLevel(level.value))
            new Audio(project.sound.newLevel).play()
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            destroyAsteroid(asteroid, bullet.angle)

            score.value += asteroid.type.score

            bullets.remove(bullet)
        })
    }
}