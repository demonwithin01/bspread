var CSheet;
(function (CSheet) {
    /**
     * A two dimensional point.
     */
    var Point = (function () {
        /**
         * Creates a new point object.
         * @param x {number} The x co-ordinate of the point.
         * @param y {number} The y co-ordinate of the point.
         */
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    CSheet.Point = Point;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Point.js.map