var CSheet;
(function (CSheet) {
    /**
     * Responsible for managing the marquee that is displayed showing the selected cells.
     */
    var Marquee = (function () {
        /**
         * Creates a new Marquee object on the specified spreadsheet.
         * @param {Workbook} workbook The left position of the rectangle.
         * @param {any} options The top position of the rectangle.
         */
        function Marquee(workbook, options) {
            var defaults = {
                borderWidth: 2,
                borderColor: "#00f"
            };
            this._options = $.extend({}, defaults, options);
            this._workbook = workbook;
            this._isVisible = false;
            this._element = document.createElement("div");
            this._element.classList.add(this._workbook.prefix + "-marquee");
            this._element.style.position = "absolute";
            this._element.style.borderWidth = this._options.borderWidth + "px";
            this._element.style.borderColor = this._options.borderColor;
            this._element.style.borderStyle = "solid";
            this._element.style.display = "none";
            this._workbook.toolsContainer.append($(this._element));
        }
        /**
         * Selects a cell range using the provided indices.
         * @param {number} startRow The start row index
         * @param {number} startColumn The start column index
         * @param {number} endRow The end row index
         * @param {number} endColumn The end column index
         */
        Marquee.prototype.selectCells = function (startRow, startColumn, endRow, endColumn) {
            if (endRow == undefined)
                endRow = startRow;
            if (endColumn == undefined)
                endColumn = startColumn;
            this._startCell = this._workbook.selectedSheet.cells[startRow][startColumn];
            this._endCell = this._workbook.selectedSheet.cells[endRow][endColumn];
            this.recalculatePosition();
        };
        /**
         * Recalculates the position of the marquee.
         */
        Marquee.prototype.recalculatePosition = function () {
            if (this._startCell == undefined)
                return;
            var spacing = this._options.borderWidth / 2;
            var topOffset = parseInt(this._workbook.selectedSheet.bodyContainer.get(0).style.top);
            var top = topOffset + this._startCell.row.position - spacing - 1 - this._workbook.selectedSheet.sheetContainer.scrollTop;
            var left = this._startCell.column.position - spacing - 1 - this._workbook.selectedSheet.sheetContainer.scrollLeft;
            var right = this._endCell.column.position + this._endCell.column.width - spacing - 1;
            var bottom = topOffset + this._endCell.row.position + this._endCell.row.height - spacing - 1;
            var bodyTop = this._workbook.selectedSheet.bodyDimensions.y;
            var bodyLeft = this._workbook.selectedSheet.bodyDimensions.x;
            var clientWidth = this._workbook.selectedSheet.sheetContainer.clientWidth;
            var clientHeight = this._workbook.selectedSheet.sheetContainer.clientHeight;
            var rowHeight = 0, columnWidth = 0;
            for (var i = this._startCell.rowIndex; i <= this._endCell.rowIndex; i++) {
                rowHeight += this._workbook.selectedSheet.rows[i].height;
            }
            for (var i = this._startCell.columnIndex; i <= this._endCell.columnIndex; i++) {
                columnWidth += this._workbook.selectedSheet.columns[i].width;
            }
            var bodyRight = this._workbook.selectedSheet.sheetContainer.scrollLeft + clientWidth;
            var bodyBottom = this._workbook.selectedSheet.sheetContainer.scrollTop + clientHeight;
            if (this._startCell.row.position + bodyTop < this._workbook.selectedSheet.sheetContainer.scrollTop) {
                var difference = this._startCell.row.position + bodyTop - this._workbook.selectedSheet.sheetContainer.scrollTop;
                rowHeight += difference;
                top = -spacing - 1;
            }
            else if (bottom > bodyBottom) {
                var difference = bottom - bodyBottom;
                rowHeight -= difference;
            }
            if (this._startCell.column.position + bodyLeft < this._workbook.selectedSheet.sheetContainer.scrollLeft) {
                var difference = this._startCell.column.position + bodyLeft - this._workbook.selectedSheet.sheetContainer.scrollLeft;
                columnWidth += difference;
                left = -spacing - 1;
            }
            else if (right > bodyRight) {
                var difference = right - bodyRight;
                columnWidth -= difference;
            }
            this._element.style.top = top + "px";
            this._element.style.left = left + "px";
            this._element.style.height = (rowHeight + this._options.borderWidth + 1) + "px";
            this._element.style.width = (columnWidth + this._options.borderWidth + 1) + "px";
            if (columnWidth <= 0 || rowHeight <= 0) {
                this._isVisible = false;
                this._element.style.display = "none";
            }
            else {
                this._isVisible = true;
                this._element.style.display = "block";
            }
        };
        /**
         * Gets whether or not the marquee currently has a selection, multiple or single.
         */
        Marquee.prototype._hasSelection = function () {
            if (this._isVisible == false)
                return false;
            if (this._startCell == undefined || this._endCell == undefined)
                return false;
            return true;
        };
        Object.defineProperty(Marquee.prototype, "isVisible", {
            /**
             * Gets whether or not the marquee is currently visible.
             */
            get: function () {
                return this._isVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Marquee.prototype, "hasSingleCellSelected", {
            /**
             * Gets whether or not there is currently a single cell selected.
             * Returns false if the marquee is not visible.
             */
            get: function () {
                if (this._hasSelection()) {
                    return (this._startCell.columnIndex == this._endCell.columnIndex && this._startCell.rowIndex == this._endCell.rowIndex);
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Marquee.prototype, "hasMultipleCellsSelected", {
            /**
             * Gets whether or not there are currently multiple cells selected.
             * Returns false if the marquee is not visible.
             */
            get: function () {
                if (this._hasSelection()) {
                    return (this._startCell.columnIndex != this._endCell.columnIndex || this._startCell.rowIndex != this._endCell.rowIndex);
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return Marquee;
    }());
    CSheet.Marquee = Marquee;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Marquee.js.map