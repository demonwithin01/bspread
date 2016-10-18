var Utilities;
(function (Utilities) {
    var Point = (function () {
        function Point(x, y) {
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(Point.prototype, "X", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "Y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        return Point;
    }());
    Utilities.Point = Point;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=utilities.js.map