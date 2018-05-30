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
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Object.defineProperty(Rect.prototype, "top", {
            /**
             * Gets the top of the rectangle.
             */
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "left", {
            /**
             * Gets the left of the rectangle.
             */
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "bottom", {
            /**
             * Gets the bottom of the rectangle.
             */
            get: function () {
                return (this.y + this.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "right", {
            /**
             * Gets the right of the rectangle.
             */
            get: function () {
                return (this.x + this.width);
            },
            enumerable: true,
            configurable: true
        });
        return Rect;
    }());
    CSheet.Rect = Rect;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Rect.js.map