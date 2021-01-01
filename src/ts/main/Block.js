"use strict";
var Block = /** @class */ (function () {
    function Block(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Block.prototype.isTouching = function (x, y, radius) {
        var deltaX = x - Math.max(this.x, Math.min(x, this.x + this.width));
        var deltaY = y - Math.max(this.y, Math.min(y, this.y + this.height));
        return (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
    };
    Block.prototype.getX = function () {
        return this.x;
    };
    Block.prototype.getY = function () {
        return this.y;
    };
    Block.prototype.getWidth = function () {
        return this.width;
    };
    Block.prototype.getHeight = function () {
        return this.height;
    };
    return Block;
}());
