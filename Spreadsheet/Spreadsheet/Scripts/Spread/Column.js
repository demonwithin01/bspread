var CSheet;
(function (CSheet) {
    var Column = (function () {
        function Column() {
            this._index = 0;
            this._position = 0;
            this._cells = [];
            this._width = 100;
        }
        /**
         * Adds a cell the the list of cells that are managed by the row/column.
         * @param cell
         */
        Column.prototype._addCell = function (cell) {
            this._cells.push(cell);
        };
        /**
         * Empties the list of cells that are managed by the row/column for the purposes of rebuilding.
         * @param cell
         */
        Column.prototype._clearCells = function () {
            this._cells = [];
        };
        Object.defineProperty(Column.prototype, "cells", {
            /**
             * Gets the cells managed by the row/column.
             */
            get: function () {
                return this._cells;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Column.prototype, "position", {
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
        Object.defineProperty(Column.prototype, "isCurrentlyVisible", {
            get: function () {
                return this._isCurrentlyVisible;
            },
            set: function (val) {
                this._isCurrentlyVisible = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Column.prototype, "index", {
            /**
             * Gets the index of the column.
             */
            get: function () {
                return this._index;
            },
            /**
             * Sets the index of the column.
             */
            set: function (val) {
                this._index = val;
                this._position = this._index * this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Column.prototype, "width", {
            /**
             * Gets the width of the column.
             */
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Column.prototype, "right", {
            get: function () {
                return this._position + this._width;
            },
            enumerable: true,
            configurable: true
        });
        return Column;
    }());
    CSheet.Column = Column;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Column.js.map