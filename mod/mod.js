export default class Mod {
    _actions = []
    _key = {}
    getAssets() {
        return {texture: {}, sound: {}}
    }
    init(texture) {}
    reset() {}
    draw() {}
    update() {}

    initLevel(num) {}
    initAsteroid(asteroid) {}
    onAsteroidHit(asteroid) {}
    destroyAsteroid(asteroid) {}
}