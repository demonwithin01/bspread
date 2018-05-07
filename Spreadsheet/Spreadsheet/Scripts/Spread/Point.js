var CSheet;
(function (CSheet) {
    /**
     * A two dimensional point.
     */
    var Point = (function () {
        /**
         * Pushes a new value into the array.
         *
         * @param x {number} The x co-ordinate of the point.
         * @param y {number} The y co-ordinate of the point.
         */
        function Point(x, y) {
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(Point.prototype, "x", {
            /**
             * Gets the X co-ordinate of the point.
             */
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "y", {
            /**
             * Gets the Y co-ordinate of the point.
             */
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        return Point;
    }());
    CSheet.Point = Point;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Point.js.map