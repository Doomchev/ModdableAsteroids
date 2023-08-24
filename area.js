function Area(leftX, topY, width, height) {
    return {
        leftX: leftX,
        topY: topY,
        width: width,
        height: height,

        rightX() {
            return leftX + width
        },
        bottomY() {
            return topY + height
        },
        hasPoint(px, py) {
            return px >= leftX && px < this.rightX && py >= topY && py < this.bottomY
        }
    }
}