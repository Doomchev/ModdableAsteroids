
var Image = {};

var Sprite = {
    
};

var images = {
    spaceship: {
        class_: Image,
        src: "images/ship.png"
    },
    explosion: {
        class_: Image,
        src: "images/explosion.png"
    }
};

var root = {
    spaceship: {
        _class: Sprite,
        width: 1.0,
        height: 1.0,
        image: images.spaceship
    }
};