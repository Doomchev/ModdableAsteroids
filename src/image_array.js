import Image from "./image.js"
import {project} from "./project.js"

export default class ImageArray {
    constructor(name, texture, columns, rows
                , xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
        if(name) project._object[name] = this
        this.texture = texture
        this.columns = columns
        this.rows =  rows
        this.xMul = xMul
        this.yMul = yMul
        this.heightMul = heightMul
        this.widthMul = widthMul
        let quantity = columns * rows
        let width = texture.width / columns
        let height = texture.height / rows
        let images = Array(quantity)
        for(let i = 0; i < quantity; i++) {
            images[i] = new Image(texture, (i % columns) * width, Math.floor(i / columns) * height, width, height
                , xMul, yMul, widthMul, heightMul)
        }
        this._images = images
    }
}