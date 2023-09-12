export default class Key {
    constructor(name, code) {
        if(name) this._name = name
        this.code = code
        this._wasPressed = false
        this._isDown = false
    }

    get isDown() {
        return this._isDown
    }

    get wasPressed() {
        return this._wasPressed
    }
}