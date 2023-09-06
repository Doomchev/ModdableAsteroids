import Image from "./image.js"
import Sprite from "./sprite.js"
import Key from "./key.js"
import LinearChange from "./actions/linear_change.js"
import Move from "./actions/sprite/move.js"
import If from "./actions/structure/if.js"
import ImageArray from "./image_array.js"
import Constraint from "./constraint.js"
import Animate from "./actions/sprite/animate.js"
import SetField from "./actions/set_field.js"
import Layer from "./layer.js"
import Create from "./actions/sprite/create.js"
import Delayed from "./actions/delayed.js"
import Area from "./area.js"
import SetBounds from "./actions/sprite/set_bounds.js"
import LoopArea from "./actions/sprite/loop_area.js"
import Shape from "./shape.js"
import ExecuteActions from "./actions/sprite/execute_actions.js"
import Rotate from "./actions/sprite/rotate.js"
import OnCollision from "./on_collision.js"
import Remove from "./actions/sprite/remove.js"
import DelayedRemove from "./actions/sprite/delayed_remove.js"
import IsEmpty from "./functions/is_empty.js"
import AddAction from "./actions/sprite/add_action.js"
import Repeat from "./actions/structure/repeat.js"
import Label from "./gui/label.js"
import {current} from "./variable/sprite.js"
import IntVariable from "./variable/int.js"
import Increment from "./actions/variable/increment.js"
import EnumVariable from "./variable/enum.js"
import IntIsEqual from "./functions/equal.js"
import Equate from "./actions/variable/int_equate.js"
import RandomFloat from "./functions/random_float.js"
import RandomSign from "./functions/random_sign.js"
import Mul from "./functions/mul.js"
import Pressed from "./functions/pressed.js"
import Decrement from "./actions/variable/decrement.js"
import Add from "./actions/variable/add.js"
import Clear from "./actions/layer/clear.js"
import SpriteVariable from "./variable/sprite.js"
import Canvas from "./canvas.js"

export let classes = {
    Image: function(o) {return new Image(o.texture, o.x, o.y, o.width, o.height, o.xMul, o.yMul, o.widthMul, o.heightMul)},
    Sprite: function(o) {return new Sprite(o._name, o.image, o.centerX, o.centerY, o.width, o.height, o.angleInDegrees, o.speed, o.imageAngle)},
    Key: function(o) {return new Key(o._name, o.code)},
    LinearChange: function(o) {return new LinearChange(o.object, o.parameterName, o.speed, o.min, o.max)},
    Move: function(o) {return new Move(o.object)},
    If: function(o) {return new If(o.condition, o.code, o.elseCode)},
    ImageArray: function(o) {return new ImageArray(o._name, o.texture, o.columns, o.rows, o.xMul, o.yMul, o.widthMul, o.heightMul)},
    Constraint: function(o) {return new Constraint(o.sprite, o.parent)},
    Animate: function(o) {return new Animate(o.sprite, o.array, o.speed)},
    SetField: function(o) {return new SetField(o.object, o.fieldName, o.value)},
    Layer: function(o) {return new Layer(o._name, o.items)},
    Create: function(o) {return new Create(o.layer, o.image, o.animationSpeed, o.position, o.size, o.angle, o.speed, o.imageAngle)},
    Delayed: function(o) {return new Delayed(o.condition, o.coolDown)},
    Canvas: function(o) {return new Canvas(o.centerX, o.centerY, o.width, o.height, o.active, o.viewport)},
    Area: function(o) {return new Area(o.leftX, o.topY, o.width, o.height)},
    SetBounds: function(o) {return new SetBounds(o.layer, o.bounds)},
    LoopArea: function(o) {return new LoopArea(o.object, o.area)},
    Shape: function(o) {return new Shape(o._name, o.centerX, o.centerY,  o.width, o.height)},
    ExecuteActions: function(o) {return new ExecuteActions(o.object)},
    Rotate: function(o) {return new Rotate(o.object, o.speed)},
    OnCollision: function(o) {return new OnCollision(o.object1, o.object2, o.code)},
    Remove: function(o) {return new Remove(o.object, o.layer)},
    DelayedRemove: function(o) {return new DelayedRemove(o.sprite, o.layer, o.time)},
    IsEmpty: function(o) {return new IsEmpty(o.layer)},
    AddAction: function(o) {return new AddAction(o.sprite, o.action)},
    Repeat: function(o) {return new Repeat(o.times, o.code)},
    Label: function(o) {return new Label(classes.Sprite(o), o.items, o.horizontalAlign, o.verticalAlign)},
    IntVariable: function(o) {return new IntVariable(o._name, o.value, o.format)},
    Increment: function(o) {return new Increment(o.variable)},
    EnumVariable: function(o) {return new EnumVariable(o._name, o.value)},
    IntIsEqual: function(o) {return new IntIsEqual(o.value1, o.value2)},
    Equate: function(o) {return new Equate(o.variable, o.value)},
    RandomFloat: function(o) {return new RandomFloat(o.from, o.to)},
    RandomSign: function(o) {return new RandomSign()},
    Mul: function(o) {return new Mul(o.value1, o.value2)},
    Pressed: function(o) {return new Pressed(o.key)},
    Decrement: function(o) {return new Decrement(o.variable)},
    Add: function(o) {return new Add(o.variable, o.value)},
    Empty: function(o) {return new Clear(o.layer)},
    SpriteVariable: function(o) {return new SpriteVariable(o._name)},
    Clear: function(o) {return new Clear(o.layer)},
    Object: function(o) {return o},
}

export let defaultValue = {
    xMul: 0.5,
    yMul: 0.5,
    heightMul: 1,
    widthMul: 1,
    visible: true,
    active: true,
    actions: [],
}