let currentCanvas, mousesx, mousesy, zk = 1.2;

const CanvasPrototype = function() {
    this.vdx = 1.0;
    this.vdy = 1.0;
    this.k = 1.0;
    this.oldZoom = 0;
    this.defaultPosition = this;
    this.update();
    
    function draw() {
        if(!this.active) return;
        let viewport = this.viewport;
        let oldCanvas = currentCanvas;
        currentCanvas = this;
        update();
        g.background = root.background;
        g.setClip(viewport.leftX, viewport.topY, viewport.width, viewport.height);
        g.clearRect(viewport.leftX, viewport.topY, viewport.width, viewport.height);
        for(module in drawingModules) {
            module.draw(g);
        }
        listener.draw(g, this);
        currentCanvas = oldCanvas;
    }

    function update () {
        let viewport = this.viewport;
        let k = 1.0 * viewport.width / width;
        this.k = k;
        this.height = 1.0 * viewport.height / k;
        this.vdx = 0.5 * viewport.width - this.centerX * k + viewport.leftX;
        this.vdy = 0.5 * viewport.height - this.centerY * k + viewport.topY;
    }

    function setZoom (zoom) {
        this.width = this.viewport.width * Math.pow(zk, zoom);
        this.update();
    }

    function setZoomXY (zoom, x, y) {
        let fx1 = xFromScreen(x);
        let fy1 = yFromScreen(y);
        setZoom(zoom);
        let fx2 = xFromScreen(x);
        let fy2 = yFromScreen(y);
        this.centerX += fx1 - fx2;
        this.centerY += fy1 - fy2;
        this.update();
    }

    function hasMouse () {
        return this.viewport.hasPoint(mousesx, mousesy);
    }

    function setDefaultPosition() {
        this.oldZoom = this.zoom;
        this.defaultPosition = Sprite(null, this.centerX, this.centerY, this.width, this.height);
    }

    function restorePosition() {
        let defaultPosition = this.defaultPosition;
        this.centerX = defaultPosition.centerX;
        this.centerY = defaultPosition.centerY;
        this.width = defaultPosition.width;
        this.height = defaultPosition.height;
        this.zoom = this.oldZoom;
        this.update();
    }

    function drawDefaultCamera(g: Graphics2D) {
        g.color = Color.BLUE;
        g.drawRect(xToScreen(defaultPosition.leftX), yToScreen(defaultPosition.topY), distToScreen(defaultPosition.width), distToScreen(defaultPosition.height));
        g.color = Color.BLACK;
    }

    toggle() {
        active = !active
    }
    
}

function Canvas(fx, fy, fwidth, fheight, scale, active) {
    let canvas = Sprite(null, 0.0, 0.0, fwidth / scale, fheight / scale, 0.0, 0.0, 0.0, active);
    canvas.prototype = CanvasPrototype;
    canvas.viewport = Area(fx, fy, fwidth, fheight);
    canvas.
}

function xToScreen(fieldX) {
    return fieldX * currentCanvas.k + currentCanvas.vdx;
}
function yToScreen(fieldY) {
   return fieldY * currentCanvas.k + currentCanvas.vdy;
}
function distToScreen(fieldDist) {
    return fieldDist * currentCanvas.k;
}

function xFromScreen(screenX) {
    return (screenX - currentCanvas.vdx) / currentCanvas.k;
}
function yFromScreen(screenY) {
    return (screenY - currentCanvas.vdy) / currentCanvas.k;
}
function distFromScreen(screenDist) {
    return screenDist / currentCanvas.k;
}