export default class Key {
    constructor(name, code) {
        if(name) this._name = name
        this.code = code
        this._isPressed = false
        this._isDown = false
    }

    get isDown() {
        return this._isDown
    }

    get isPressed() {
        return this._isPressed
    }
}