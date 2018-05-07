var CSheet;
(function (CSheet) {
    /**
     * The position and dimensions of a rectangle.
     */
    var Rect = (function () {
        /**
         * Creates a new Rect object with the specified position and dimensions.
         * @param {number} x The left position of the rectangle.
         * @param {number} y The top position of the rectangle.
         * @param {number} width The width of the rectangle.
         * @param {number} height The height of the rectangle.
         */
        function Rect(x, y, width, height) {
            this._position = new CSheet.Point(x, y);
            this._dimensions = new CSheet.Point(width, height);
        }
        Object.defineProperty(Rect.prototype, "top", {
            /**
             * Gets the top of the rectangle.
             */
            get: function () {
                return this._position.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "left", {
            /**
             * Gets the left of the rectangle.
             */
            get: function () {
                return this._position.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "width", {
            /**
             * Gets the width of the rectangle.
             */
            get: function () {
                return this._dimensions.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "height", {
            /**
             * Gets the height of the rectangle.
             */
            get: function () {
                return this._dimensions.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "bottom", {
            /**
             * Gets the bottom of the rectangle.
             */
            get: function () {
                return (this._position.y + this._dimensions.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "right", {
            /**
             * Gets the right of the rectangle.
             */
            get: function () {
                return (this._position.x + this._dimensions.x);
            },
            enumerable: true,
            configurable: true
        });
        return Rect;
    }());
    CSheet.Rect = Rect;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Rect.js.map