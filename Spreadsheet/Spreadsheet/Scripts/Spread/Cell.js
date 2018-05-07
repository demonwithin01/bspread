var CSheet;
(function (CSheet) {
    var Cell = (function () {
        function Cell(initialValue, sheet, row, column) {
            if (initialValue == null) {
                initialValue = undefined;
            }
            this.value = initialValue;
            this._sheet = sheet;
            this._row = row;
            this._column = column;
            this.recreateElement();
        }
        /**
         * Re-creates the cell element.
         */
        Cell.prototype.recreateElement = function () {
            var newElement = $("<div class=\"" + this._sheet.workbook.prefix + "-cell " + this._sheet.workbook.prefix + "-row\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>");
            if (this._row.index % 2 == 1) {
                newElement.addClass(this._sheet.workbook.prefix + "-alt-row");
            }
            if (this._element && this._element.parentElement) {
                console.log("trigger redraw");
            }
            this._element = newElement.get(0);
            this._element.addEventListener("click", CSheet.helpers.proxy(this._cellClicked, this), true);
        };
        /**
         * Event handler for when the cell is clicked.
         * @param e The mouse event for the cell.
         */
        Cell.prototype._cellClicked = function (e) {
            this._sheet.selectCell(this);
        };
        Object.defineProperty(Cell.prototype, "value", {
            /**
             * Gets the value of the cell.
             */
            get: function () {
                return this._value;
            },
            /**
             * Sets the value of the cell.
             */
            set: function (newValue) {
                this._value = newValue;
                this._displayValue = CSheet.formatter.formatNumber(this._value, "C2");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "displayValue", {
            /**
             * Gets the cell display value of the value.
             */
            get: function () {
                return this._displayValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "element", {
            /**
             * Gets the cell element.
             */
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "row", {
            /**
             * Gets the row that this cell can be found in.
             */
            get: function () {
                return this._row;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "column", {
            /**
             * Gets the column that this cell can be found in.
             */
            get: function () {
                return this._column;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "rowIndex", {
            /**
             * Gets the row index for this cell.
             */
            get: function () {
                return this._row.index;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "columnIndex", {
            /**
             * Gets the column index for this cell.
             */
            get: function () {
                return this._column.index;
            },
            enumerable: true,
            configurable: true
        });
        return Cell;
    }());
    CSheet.Cell = Cell;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Cell.js.map