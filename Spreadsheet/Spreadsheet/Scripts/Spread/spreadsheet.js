/// <reference path="./../typings/jquery/jquery.d.ts" />
var CSheet;
(function (CSheet) {
    var Spreadsheet = (function () {
        function Spreadsheet(workbook, index, options) {
            this._isUpdating = false;
            var defaults = {};
            this._workbook = workbook;
            this._index = index;
            this._options = options;
            this._isTabMode = false;
            this._columns = new CSheet.ObservableArray();
            this._rows = new CSheet.ObservableArray();
            this._dataSource = new CSheet.ObservableArray();
            this._cells = [];
            //this.columns.addedItem.register( this.columnAdded );
            //this.columns.arrayChanged.register( this.columnsChanged );
            this._$sheet = $("<div class=\"" + this._workbook.prefix + "-sheet\" style=\"margin: 2px;\"></div>");
            this._$columnHeaders = $("<div class=\"" + this._workbook.prefix + "-column-headers\"></div>");
            this._$sheetBody = $("<div class=\"" + this._workbook.prefix + "-sheet-body\"></div>");
            this._$sheet.append(this._$columnHeaders);
            this._$sheet.append(this._$sheetBody);
            this._$sheet.insertBefore(this._workbook.toolsContainer);
            this._isUpdating = true;
            var keys = ["title", "col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", "col10",
                "col11", "col12", "col13", "col14", "col15", "col16", "col17", "col18", "col19", "col20",
                "col21", "col22", "col23", "col24", "col25", "col26", "col27", "col28", "col29"];
            for (var i = 0; i < keys.length; i++) {
                var column = new CSheet.Column();
                column.index = i;
                column._key = keys[i];
                this._columns.push(column);
            }
            var data = [];
            for (var i = 0; i < 122; i++) {
                data.push({
                    title: "Row: " + (i + 1),
                    col1: Math.round(Math.random() * 10000) + 0.23572,
                    col2: Math.round(Math.random() * 10000),
                    col3: Math.round(Math.random() * 10000),
                    col4: Math.round(Math.random() * 10000),
                    col5: Math.round(Math.random() * 10000),
                    col6: Math.round(Math.random() * 10000),
                    col7: Math.round(Math.random() * 10000),
                    col8: Math.round(Math.random() * 10000),
                    col9: Math.round(Math.random() * 10000),
                    col10: Math.round(Math.random() * 10000),
                    col11: Math.round(Math.random() * 10000),
                    col12: Math.round(Math.random() * 10000),
                    col13: Math.round(Math.random() * 10000),
                    col14: Math.round(Math.random() * 10000),
                    col15: Math.round(Math.random() * 10000),
                    col16: Math.round(Math.random() * 10000),
                    col17: Math.round(Math.random() * 10000),
                    col18: Math.round(Math.random() * 10000),
                    col19: Math.round(Math.random() * 10000),
                    col20: Math.round(Math.random() * 10000),
                    col21: Math.round(Math.random() * 10000),
                    col22: Math.round(Math.random() * 10000),
                    col23: Math.round(Math.random() * 10000),
                    col24: Math.round(Math.random() * 10000),
                    col25: Math.round(Math.random() * 10000),
                    col26: Math.round(Math.random() * 10000),
                    col27: Math.round(Math.random() * 10000),
                    col28: Math.round(Math.random() * 10000),
                    col29: Math.round(Math.random() * 10000)
                });
            }
            this.dataSource = data;
            this._createRowData();
            this._$sheet[0].addEventListener("scroll", CSheet.helpers.proxy(this._onScroll, this));
            this.endUpdate();
        }
        /**
         * Puts the sheet into an update mode.
         */
        Spreadsheet.prototype.beginUpdate = function () {
            if (this._isUpdating) {
                console.error("already updating");
                return;
            }
            this._isUpdating = true;
        };
        ;
        /**
         * Exits the sheet out of update mode.
         */
        Spreadsheet.prototype.endUpdate = function () {
            if (this._isUpdating) {
                this._isUpdating = false;
                this.redraw();
            }
        };
        ;
        Spreadsheet.prototype.redraw = function () {
            this._$sheet.css({ display: "block", overflow: "scroll", width: "100%", height: "200px", position: "relative" });
            this._drawHeaders();
            this._drawBody();
            //this._recalculateVisibleCells();
        };
        ;
        Spreadsheet.prototype._tabToNextCell = function () {
            if (this._isTabMode === false || (this._isTabMode === true && this._currentCell.columnIndex < this._tabModeStartIndex)) {
                this._isTabMode = true;
                this._tabModeStartIndex = this._currentCell.columnIndex;
            }
            var nextCell = this._currentCell.row.cells[this._currentCell.columnIndex + 1];
            if (!nextCell) {
                var nextRow = this._rows[this._currentCell.row.index + 1];
                if (nextRow) {
                    nextCell = nextRow.cells[0];
                }
            }
            if (nextCell) {
                this._selectCell(nextCell, false);
            }
        };
        Spreadsheet.prototype._tabToPreviousCell = function () {
            var previousCell = this._currentCell.row.cells[this._currentCell.columnIndex - 1];
            if (!previousCell) {
                var previousRow = this._rows[this._currentCell.row.index - 1];
                if (previousRow) {
                    previousCell = previousRow.cells[previousRow.cells.length - 1];
                }
            }
            if (previousCell) {
                this._selectCell(previousCell, false);
            }
        };
        Spreadsheet.prototype._enterToNextRow = function () {
            var colIndex;
            if (this._isTabMode) {
                colIndex = this._tabModeStartIndex;
            }
            else {
                colIndex = this._currentCell.columnIndex;
            }
            var nextRow = this._rows[this._currentCell.rowIndex + 1];
            if (nextRow) {
                this._selectCell(nextRow.cells[colIndex], false);
            }
        };
        Spreadsheet.prototype._selectCellInDirection = function (direction) {
            var row = this._rows[this._currentCell.rowIndex + direction.y];
            var column = this._columns[this._currentCell.columnIndex + direction.x];
            if (row === undefined || column === undefined) {
                return;
            }
            this._selectCell(this._cells[row.index][column.index], true);
        };
        Spreadsheet.prototype.selectCell = function (cell) {
            this._selectCell(cell, true);
        };
        Spreadsheet.prototype._selectCell = function (cell, resetTab) {
            if (resetTab) {
                this._isTabMode = false;
            }
            this._currentCell = cell;
            var topOffset = parseInt(this._$sheetBody.get(0).style.top);
            var right = cell.column.position + cell.column.width;
            var bottom = topOffset + cell.row.position + cell.row.height;
            var bodyRight = this.sheetContainer.scrollLeft + this.sheetContainer.clientWidth;
            var bodyBottom = this.sheetContainer.scrollTop + this.sheetContainer.clientHeight;
            var jumpForwardRow = CSheet.helpers.getRowsTotalHeight(this, cell.rowIndex + 1, cell.rowIndex + this._workbook.options.scrollRowBufferCount);
            var jumpBackwardRow = CSheet.helpers.getRowsTotalHeight(this, cell.rowIndex - 1, cell.rowIndex - this._workbook.options.scrollRowBufferCount);
            var jumpForwardColumn = CSheet.helpers.getColumnsTotalWidth(this, cell.columnIndex + 1, cell.columnIndex + this._workbook.options.scrollColumnBufferCount);
            var jumpBackwardColumn = CSheet.helpers.getColumnsTotalWidth(this, cell.columnIndex - 1, cell.columnIndex - this._workbook.options.scrollColumnBufferCount);
            if (bottom + jumpForwardRow > bodyBottom) {
                var difference = bottom - bodyBottom + jumpForwardRow;
                this.sheetContainer.scrollTop += difference;
            }
            else if (cell.row.position + topOffset < this.sheetContainer.scrollTop + jumpBackwardRow) {
                var difference = this.sheetContainer.scrollTop - (cell.row.position + topOffset) + jumpBackwardRow;
                this.sheetContainer.scrollTop -= difference;
            }
            if (right + jumpForwardColumn > bodyRight) {
                var difference = right - bodyRight + jumpForwardColumn;
                this.sheetContainer.scrollLeft += difference;
            }
            else if (cell.column.position < this.sheetContainer.scrollLeft + jumpBackwardColumn) {
                var difference = this.sheetContainer.scrollLeft - cell.column.position + jumpBackwardColumn;
                this.sheetContainer.scrollLeft -= difference;
            }
            this._workbook.marquee.selectCells(cell.rowIndex, cell.columnIndex, cell.rowIndex, cell.columnIndex);
        };
        Spreadsheet.prototype._columnsChanged = function (column) {
            console.log("Columns Changed");
            if (this._isUpdating)
                return;
        };
        Spreadsheet.prototype._columnAdded = function (column) {
            console.log("Column Added");
            if (this._isUpdating)
                return;
        };
        /**
         * Regenerates the cell data for the spreadsheet.
         */
        Spreadsheet.prototype._createCellData = function () {
            this._cells = [];
            for (var i = 0; i < this._columns.length; i++) {
                this._columns[i]._clearCells();
            }
            for (var i = 0; i < this._dataSource.length; i++) {
                this._cells[i] = [];
                for (var j = 0; j < this._columns.length; j++) {
                    var cell = new CSheet.Cell(this._dataSource[i][this._columns[j]._key], this, this._rows[i], this.columns[j]);
                    this._cells[i][j] = cell;
                    this._columns[j]._addCell(cell);
                }
                this._rows[i]._setCells(this._cells[i]);
            }
        };
        /**
         * Regenerates the rows and cell data for the spreadsheet.
         */
        Spreadsheet.prototype._createRowData = function () {
            this._rows = new CSheet.ObservableArray();
            for (var i = 0; i < this._dataSource.length; i++) {
                var row = new CSheet.Row();
                row.index = i;
                row.dataItem = this._dataSource[i];
                this._rows.push(row);
            }
            this._createCellData();
        };
        Spreadsheet.prototype._drawHeaders = function () {
            this._$columnHeaders.empty().css({ position: "absolute", top: "0", left: "0", width: "100%" });
            var currentPosition = 0;
            var height = 0;
            for (var i = 0; i < this._columns.length; i++) {
                var $cell = this.createCell(new CSheet.Point(currentPosition, 0), "Header: " + (i + 1));
                $cell.addClass(this._workbook.prefix + "-column-header");
                this._$columnHeaders.append($cell);
                this._columns[i].position = currentPosition;
                currentPosition += this._columns[i].width;
                var h = $cell.outerHeight();
                if (h > height) {
                    height = h;
                }
            }
            this._$columnHeaders.height(height);
        };
        ;
        Spreadsheet.prototype._drawBody = function () {
            this._bodyDimensions = new CSheet.Point(0, this._$columnHeaders.height());
            this._$sheetBody.empty().css({ position: "absolute", top: this._$columnHeaders.height(), left: "0", width: "100%" });
            var currentPositionY = 0;
            for (var y = 0; y < this._cells.length; y++) {
                for (var x = 0; x < this._cells[y].length; x++) {
                    this._$sheetBody.append($(this._cells[y][x].element));
                }
                currentPositionY += this.rows[y].height;
            }
            this._$sheetBody.height(currentPositionY);
        };
        ;
        Spreadsheet.prototype._createObservableDataSource = function (data) {
            var observableDataSource = new CSheet.ObservableArray();
            for (var i = 0; i < data.length; i++) {
                if (!(data[i] instanceof ObservableDataItem)) {
                    data[i] = new ObservableDataItem(data[i], this);
                }
                observableDataSource.push(data[i]);
            }
            return observableDataSource;
        };
        Spreadsheet.prototype.createCell = function (pos, content) {
            return $("<div class=\"" + this._workbook.prefix + "-cell\" style=\"position: absolute; top: " + pos.y + "px; left: " + pos.x + "px; overflow: hidden; width: 100px;\">" + content + "</div>");
        };
        ;
        Spreadsheet.prototype._onResize = function () {
        };
        Spreadsheet.prototype._recalculateVisibleCells = function () {
            var scrollTop = this.sheetContainer.scrollTop;
            var scrollBottom = scrollTop + this.sheetContainer.clientHeight;
            var scrollLeft = this.sheetContainer.scrollLeft;
            var scrollRight = scrollLeft + this.sheetContainer.clientWidth;
            this._workbook._log(scrollTop);
            this._workbook._log(scrollBottom);
            for (var i = 0; i < this._rows.length; i++) {
                var isNotVisible = (scrollTop >= this._rows[i].bottom || scrollBottom <= this._rows[i].position);
                this._rows[i].isCurrentlyVisible = !isNotVisible;
            }
            for (var i = 0; i < this._columns.length; i++) {
                var isNotVisible = (scrollLeft >= this._columns[i].right || scrollRight <= this._columns[i].position);
                this._columns[i].isCurrentlyVisible = !isNotVisible;
            }
            for (var x = 0; x < this._cells.length; x++) {
                for (var y = 0; y < this._cells.length; y++) {
                    var cell = this._cells[y][x];
                    var isVisible = cell.column.isCurrentlyVisible && cell.row.isCurrentlyVisible;
                    cell.element.style.display = isVisible ? "block" : "none";
                }
            }
        };
        Spreadsheet.prototype._onScroll = function () {
            //this._recalculateVisibleCells();
            this._workbook.marquee.recalculatePosition();
        };
        Object.defineProperty(Spreadsheet.prototype, "sheetContainer", {
            get: function () {
                return this._$sheet.get(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "bodyContainer", {
            get: function () {
                return this._$sheetBody;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "bodyDimensions", {
            get: function () {
                return this._bodyDimensions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "workbook", {
            get: function () {
                return this._workbook;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "index", {
            get: function () {
                return this._index;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "columns", {
            /**
             * Gets the columns associated with the spreadsheet.
             */
            get: function () {
                return this._columns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "rows", {
            /**
             * Gets the rows associated with the spreadsheet.
             */
            get: function () {
                return this._rows;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "cells", {
            /**
             * Gets the cells associated with the spreadsheet.
             */
            get: function () {
                return this._cells;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "dataSource", {
            /**
             * Gets the data source for the sheet.
             */
            get: function () {
                return this._dataSource;
            },
            /**
             * Sets the data source for the sheet.
             */
            set: function (newSource) {
                if (CSheet.helpers.isArray(newSource)) {
                    this._dataSource = this._createObservableDataSource(newSource);
                }
                else {
                    this._dataSource = newSource;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Spreadsheet;
    }());
    CSheet.Spreadsheet = Spreadsheet;
    /**
     * An object that creates observable property for each properties on a provided object.
     */
    var ObservableDataItem = (function () {
        /**
         * Creates a new observable data item.
         * @param {any} dataItem The data item to base this obvservable off.
         * @param {Spreadsheet} sheet The sheet that this data item is being created for.
         */
        function ObservableDataItem(dataItem, sheet) {
            this._sheet = sheet;
            this.onDataItemChange = new CSheet.CSheetEvent();
            this._dataItem = dataItem;
            for (var idx in dataItem) {
                this._defineObservableProperty(idx);
            }
        }
        /**
         * Defines a property on the observable that allows the item to be edited and raise events.
         * @param idx The index of the property/
         */
        ObservableDataItem.prototype._defineObservableProperty = function (idx) {
            Object.defineProperty(this, idx, {
                get: function () {
                    return this._dataItem[idx];
                },
                set: function (value) {
                    this._dataItem[idx] = value;
                },
                enumerable: !0,
                configurable: !1
            });
        };
        return ObservableDataItem;
    }());
    /**
     * Holds a group of helper functions.
     */
    CSheet.helpers = new CSheet.Helpers();
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Spreadsheet.js.map