var CSheet;
(function (CSheet) {
    var Row = (function () {
        function Row() {
            this._index = 0;
            this._position = 0;
            this._cells = [];
            this._height = 28;
        }
        /**
         * Adds a cell the the list of cells that are managed by the row/column.
         * @param cell
         */
        Row.prototype._addCell = function (cell) {
            this._cells.push(cell);
        };
        /**
         * Empties the list of cells that are managed by the row/column for the purposes of rebuilding.
         * @param cell
         */
        Row.prototype._clearCells = function () {
            this._cells = [];
        };
        Object.defineProperty(Row.prototype, "cells", {
            /**
             * Gets the cells managed by the row/column.
             */
            get: function () {
                return this._cells;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Row.prototype, "position", {
            /**
             * Gets the position of the row/column.
             */
            get: function () {
                return this._position;
            },
            set: function (val) {
                this._position = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Row.prototype, "isCurrentlyVisible", {
            get: function () {
                return this._isCurrentlyVisible;
            },
            set: function (val) {
                this._isCurrentlyVisible = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Row.prototype, "index", {
            /**
             * Gets the index of the row.
             */
            get: function () {
                return this._index;
            },
            /**
             * Sets the index of the row.
             */
            set: function (val) {
                this._index = val;
                this._position = this._index * this._height;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets the cells associated with the row.
         * @param cells
         */
        Row.prototype._setCells = function (cells) {
            this._cells = cells;
        };
        Object.defineProperty(Row.prototype, "height", {
            /**
             * Gets the height of the row.
             */
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Row.prototype, "bottom", {
            get: function () {
                return this._position + this._height;
            },
            enumerable: true,
            configurable: true
        });
        return Row;
    }());
    CSheet.Row = Row;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Row.js.map