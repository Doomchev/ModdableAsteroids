import Img from "./image.js"
import Sprite from "./sprite.js"
import Key from "./key.js"
import LinearChange from "./actions/linear_change.js"
import Move from "./actions/sprite/move.js"
import ImageArray from "./image_array.js"
import Constraint from "./constraint.js"
import Animate from "./actions/sprite/animate.js"
import Layer from "./layer.js"
import Area from "./area.js"
import SetBounds from "./actions/sprite/set_bounds.js"
import LoopArea from "./actions/sprite/loop_area.js"
import Shape from "./shape.js"
import ExecuteActions from "./actions/sprite/execute_actions.js"
import RotateImage from "./actions/sprite/rotate_image.js"
import DelayedRemove from "./actions/sprite/delayed_remove.js"
import AddAction from "./actions/sprite/add_action.js"
import Label from "./gui/label.js"
import SpriteVariable from "./variable/sprite.js"
import NumericVariable from "./variable/number.js"
import EnumVariable from "./variable/enum.js"
import Canvas from "./canvas.js"
import {Loc} from "./localization.js"

export let classes = {

    // basic

    Object: function(o) {return o},
    Loc: function(o) {return new Loc(o.name)},
    Key: function(o) {return new Key(o._name, o.code)},

    // variables

    NumericVariable: function(o) {return new NumericVariable(o._name, o.value, o.format)},
    EnumVariable: function(o) {return new EnumVariable(o._name, o.value)},
    SpriteVariable: function(o) {return new SpriteVariable(o._name)},

    // graphics

    Image: function(o) {return new Img(o.texture, o.x, o.y, o.width, o.height, o.xMul ?? dv.xMul
        , o.yMul ?? dv.yMul, o.widthMul ?? dv.widthMul, o.heightMul ?? dv.heightMul)},
    Sprite: function(o) {return new Sprite(o.image, o.centerX, o.centerY, o.width, o.height
        , o.angle, o.speed, o.imageAngle, o.active ?? dv.active, o.visible ?? dv.visible)},
    ImageArray: function(o) {return new ImageArray(o._name, o.texture, o.columns, o.rows, o.xMul ?? dv.xMul
        , o.yMul ?? dv.yMul, o.widthMul ?? dv.widthMul, o.heightMul ?? dv.heightMul)},
    Layer: function(o) {return new Layer(o._name, o.items)},
    Canvas: function(o) {return new Canvas(o.centerX, o.centerY, o.width, o.height, o.active ?? dv.active, o.viewport)},
    Area: function(o) {return new Area(o.leftX, o.topY, o.width, o.height)},
    Shape: function(o) {return new Shape(o.centerX, o.centerY, o.width, o.height)},
    Label: function(o) {return new Label(o._name, classes.Sprite(o), o.items, o.horizontalAlign, o.verticalAlign)},

    // actions

    Constraint: function(o) {return new Constraint(o.sprite, o.parent)},
    LinearChange: function(o) {return new LinearChange(o.object, o.parameterName, o.speed, o.min, o.max)},
    Move: function(o) {return new Move(o.object)},
    Animate: function(o) {return new Animate(o.sprite, o.images, o.speed)},
    SetBounds: function(o) {return new SetBounds(o.layer, o.bounds)},
    LoopArea: function(o) {return new LoopArea(o.object, o.area)},
    ExecuteActions: function(o) {return new ExecuteActions(o.object)},
    RotateImage: function(o) {return new RotateImage(o.object, o.speed)},
    DelayedRemove: function(o) {return new DelayedRemove(o.sprite, o.layer, o.time)},
    AddAction: function(o) {return new AddAction(o.sprite, o.action)},
}

export let dv = {
    xMul: 0.5,
    yMul: 0.5,
    heightMul: 1,
    widthMul: 1,
    visible: true,
    active: true,
    actions: [],
}