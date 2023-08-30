import {Executable, fpsk} from "../system.js";

export default class SpriteAnimation extends Executable {
    constructor(sprite, array, speed, frame = 0.0) {
        super()
        this.sprite = sprite
        this.array = array
        this.speed = speed
        this.frame = frame
    }

    execute() {
        let images = this.array.images
        this.frame += fpsk * this.speed
        while(this.frame < 0.0) {
            this.frame += images.length
        }
        while(this.frame > images.length) {
            this.frame -= images.length
        }
        this.sprite.image = images[Math.floor(this.frame)];
    }
}