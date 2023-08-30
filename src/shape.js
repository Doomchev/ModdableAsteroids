export default class Shape {
    constructor(centerX = 0.0, centerY = 0.0,  width = 1.0, height = 1.0) {
        this.centerX = centerX
        this.centerY = centerY
        this.halfWidth = 0.5 * width
        this.halfHeight = 0.5 * height
    }

    get width() {
        return this.halfWidth * 2.0
    }
    set width(value) {
        this.halfWidth = value * 0.5
    }

    get height() {
        return this.halfHeight * 2.0
    }
    set height(value) {
        this.halfHeight = value * 0.5
    }

    get leftX() {
        return this.centerX - this.halfWidth
    }
    set leftX(value) {
        this.centerX = value + this.halfWidth
    }

    get topY() {
        return this.centerY - this.halfHeight
    }
    set topY(value) {
        this.centerY = value + this.halfHeight
    }

    get rightX() {
        return this.centerX + this.halfWidth
    }
    set rightX(value) {
        this.centerX = value - this.halfWidth
    }

    get bottomY() {
        return this.centerY + this.halfHeight
    }
    set bottomY(value) {
        this.centerY = value - this.halfHeight
    }

    collidesWithPoint(x, y) {
        return x >= this.leftX && x < this.rightX && y >= this.topY && y < this.bottomY
    }

    overlaps(shape) {
        return shape.leftX >= this.leftX && shape.topY >= this.topY && shape.rightX < this.rightX
            && shape.bottomY < this.bottomY
    }

    collidesWidth(shape2) {
        let dx = this.centerX - shape2.centerX
        let dy = this.centerY - shape2.centerY
        let radius = shape2.halfWidth + this.halfWidth
        return dx * dx + dy * dy < radius * radius
    }
}