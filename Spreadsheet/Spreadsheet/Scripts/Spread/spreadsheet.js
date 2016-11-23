/// <reference path="./../typings/jquery/jquery.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BsSpread;
(function (BsSpread) {
    /**
     * Holds a group of helper functions.
     */
    var Helpers = (function () {
        function Helpers() {
        }
        /**
         * Creates a proxy event handler.
         * @param callback The callback method to call.
         * @param self The object to call the callback against.
         */
        Helpers.prototype.proxy = function (callback, self) {
            return function (evt) {
                callback.apply(self, [evt]);
            };
        };
        /**
         * Adds an event listener to the specified element.
         * @param element The element, elements, or selector for adding the event listener to.
         * @param type The event type to attach.
         * @param listener The callback/listener for the event.
         */
        Helpers.prototype.addEventListener = function (element, type, listener) {
            var htmlElement;
            if (typeof (element) === 'string') {
                var htmlElements = this._resolveElement(element);
                htmlElements.forEach(function (value) { value.addEventListener(type, listener); });
            }
            else if (this.isArray(element)) {
                var htmlElements = element;
                htmlElements.forEach(function (value) { value.addEventListener(type, listener); });
            }
            else {
                element.addEventListener(type, listener);
            }
        };
        /**
         * Determines whether or not the provided object is an array.
         * @param obj The object to be checked.
         */
        Helpers.prototype.isArray = function (obj) {
            return obj.constructor === Array;
        };
        /**
         * Simple foreach loop for arrays.
         * @param array The array to loop over.
         * @param callback The callback method for each item.
         */
        Helpers.prototype.forEach = function (array, callback) {
            if (!array)
                return;
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                callback.call(item, i, item);
            }
        };
        /**
         * Finds the element using the provided selector. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         * @returns {Element} The first element found using the provided selector.
         */
        Helpers.prototype.findElement = function (selector) {
            var elements = this._resolveElement(selector);
            if (elements.length == 0) {
                throw "Element not found using selector: '" + selector + "'";
            }
            return elements[0];
        };
        /**
         * Gets the total width of the columns for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the columns.
         * @param startIndex {number} The first index of the column to retrieve.
         * @param endIndex {number} The final index of the column to retrieve.
         * @returns {number} The total width of the requested columns.
         */
        Helpers.prototype.getColumnsTotalWidth = function (sheet, startIndex, endIndex) {
            var width = 0;
            if (startIndex < 0)
                startIndex = 0;
            if (endIndex < startIndex) {
                for (var i = startIndex; i >= 0 && i >= endIndex; --i) {
                    width += sheet.columns[i].width;
                }
            }
            else {
                for (var i = startIndex; i < sheet.columns.length && i <= endIndex; i++) {
                    width += sheet.columns[i].width;
                }
            }
            return width;
        };
        /**
         * Gets the total height of the rows for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the rows.
         * @param startIndex {number} The first index of the row to retrieve.
         * @param endIndex {number} The final index of the row to retrieve.
         * @returns {number} The total height of the requested rows.
         */
        Helpers.prototype.getRowsTotalHeight = function (sheet, startIndex, endIndex) {
            var width = 0;
            if (startIndex < 0)
                startIndex = 0;
            if (endIndex < startIndex) {
                for (var i = startIndex; i >= 0 && i >= endIndex; --i) {
                    width += sheet.rows[i].height;
                }
            }
            else {
                for (var i = startIndex; i < sheet.rows.length && i <= endIndex; i++) {
                    width += sheet.rows[i].height;
                }
            }
            return width;
        };
        /**
         * Resolves a selector string into an array of html elements. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         */
        Helpers.prototype._resolveElement = function (selector) {
            var htmlElements = [];
            if (selector.indexOf('#') == 0) {
                var htmlElement = document.getElementById(selector);
                htmlElements.push(htmlElement);
            }
            else if (selector.indexOf('.') == 0) {
                var elements = document.getElementsByClassName(selector);
                for (var i = 0; i < elements.length; i++) {
                    htmlElements.push(elements[i]);
                }
            }
            else {
                var elements = document.getElementsByTagName(selector);
                for (var i = 0; i < elements.length; i++) {
                    htmlElements.push(elements[i]);
                }
            }
            return htmlElements;
        };
        return Helpers;
    }());
    BsSpread.Helpers = Helpers;
    var WorkbookOptions = (function () {
        function WorkbookOptions() {
            this.debug = false;
            this.scrollColumnBufferCount = 1;
            this.scrollRowBufferCount = 1;
        }
        return WorkbookOptions;
    }());
    var Workbook = (function () {
        function Workbook(selector, options) {
            this._prefix = "bspread";
            var defaults = new WorkbookOptions();
            this._options = $.extend({}, defaults, options);
            this._container = $(selector);
            this._keyHandler = new KeyHandler(this);
            this._container.css({ position: "relative" });
            this._sheets = [];
            this._toolsElement = $("<div class=\"" + this._prefix + "-tools\" style=\"position: absolute; top: 2px; right: 2px; bottom: 2px; left: 2px; pointer-events: none;\"></div>");
            this._container.append(this._toolsElement);
            this._marquee = new Marquee(this);
            this._sheets.push(new Spreadsheet(this, 0, options)); // TEMP
            window.addEventListener("resize", BsSpread._helpers.proxy(this._onResize, this));
            window.addEventListener("keydown", BsSpread._helpers.proxy(this._keyHandler.onKeyDown, this._keyHandler));
        }
        Workbook.prototype._onResize = function () {
            this._marquee.recalculatePosition();
        };
        /**
         * Writes a message to the console log.
         * @param message The message to be written to the log.
         */
        Workbook.prototype._log = function (message) {
            if (this._options.debug) {
                console.log(message);
            }
        };
        Object.defineProperty(Workbook.prototype, "options", {
            /**
             * Gets the main container for the spreadsheets.
             */
            get: function () {
                return this._options;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "container", {
            /**
             * Gets the main container for the spreadsheets.
             */
            get: function () {
                return this._container;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "prefix", {
            /**
             * Gets the class prefix for the spreadsheets.
             */
            get: function () {
                return this._prefix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "marquee", {
            /**
             * Gets the marquee.
             */
            get: function () {
                return this._marquee;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "selectedSheet", {
            /**
             * Gets the currently selected sheet.
             */
            get: function () {
                return this._sheets[0]; // TEMP
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "toolsContainer", {
            /**
             * Gets the html container for the tools.
             */
            get: function () {
                return this._toolsElement;
            },
            enumerable: true,
            configurable: true
        });
        return Workbook;
    }());
    BsSpread.Workbook = Workbook;
    var Spreadsheet = (function () {
        function Spreadsheet(workbook, index, options) {
            this._isUpdating = false;
            var defaults = {};
            this._workbook = workbook;
            this._index = index;
            this._options = options;
            this._isTabMode = false;
            this._columns = new ObservableArray();
            this._rows = new ObservableArray();
            this._dataSource = new ObservableArray();
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
                "col11", "col12", "col13", "col14", "col15", "col16", "col17", "col18", "col19"];
            for (var i = 0; i < keys.length; i++) {
                var column = new Column();
                column.index = i;
                column._key = keys[i];
                this._columns.push(column);
            }
            var data = [];
            for (var i = 0; i < 22; i++) {
                data.push({
                    title: "Row: " + (i + 1),
                    col1: Math.round(Math.random() * 100),
                    col2: Math.round(Math.random() * 100),
                    col3: Math.round(Math.random() * 100),
                    col4: Math.round(Math.random() * 100),
                    col5: Math.round(Math.random() * 100),
                    col6: Math.round(Math.random() * 100),
                    col7: Math.round(Math.random() * 100),
                    col8: Math.round(Math.random() * 100),
                    col9: Math.round(Math.random() * 100),
                    col10: Math.round(Math.random() * 100),
                    col11: Math.round(Math.random() * 100),
                    col12: Math.round(Math.random() * 100),
                    col13: Math.round(Math.random() * 100),
                    col14: Math.round(Math.random() * 100),
                    col15: Math.round(Math.random() * 100),
                    col16: Math.round(Math.random() * 100),
                    col17: Math.round(Math.random() * 100),
                    col18: Math.round(Math.random() * 100),
                    col19: Math.round(Math.random() * 100)
                });
            }
            this.dataSource = data;
            this._createRowData();
            this._$sheet[0].addEventListener("scroll", BsSpread._helpers.proxy(this._onScroll, this));
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
            this._drawHeaders.call(this);
            this._drawBody.call(this);
        };
        ;
        Spreadsheet.prototype._tabToNextCell = function () {
            if (this._isTabMode === false) {
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
                this.selectCell(nextCell);
            }
        };
        Spreadsheet.prototype._tabToPreviousCell = function () {
            this._isTabMode = false;
            var previousCell = this._currentCell.row.cells[this._currentCell.columnIndex - 1];
            if (!previousCell) {
                var previousRow = this._rows[this._currentCell.row.index - 1];
                if (previousRow) {
                    previousCell = previousRow.cells[previousRow.cells.length - 1];
                }
            }
            if (previousCell) {
                this.selectCell(previousCell);
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
                this.selectCell(nextRow.cells[colIndex]);
            }
        };
        Spreadsheet.prototype._selectCellInDirection = function (direction) {
            var row = this._rows[this._currentCell.rowIndex + direction.y];
            var column = this._columns[this._currentCell.columnIndex + direction.x];
            if (row === undefined || column === undefined) {
                return;
            }
            this.selectCell(this._cells[row.index][column.index]);
        };
        Spreadsheet.prototype.selectCell = function (cell) {
            this._currentCell = cell;
            var topOffset = parseInt(this._$sheetBody.get(0).style.top);
            var right = cell.column.position + cell.column.width;
            var bottom = topOffset + cell.row.position + cell.row.height;
            var bodyRight = this.sheetContainer.scrollLeft + this.sheetContainer.clientWidth;
            var bodyBottom = this.sheetContainer.scrollTop + this.sheetContainer.clientHeight;
            var jumpForwardRow = BsSpread._helpers.getRowsTotalHeight(this, cell.rowIndex + 1, cell.rowIndex + this._workbook.options.scrollRowBufferCount);
            var jumpBackwardRow = BsSpread._helpers.getRowsTotalHeight(this, cell.rowIndex - 1, cell.rowIndex - this._workbook.options.scrollRowBufferCount);
            var jumpForwardColumn = BsSpread._helpers.getColumnsTotalWidth(this, cell.columnIndex + 1, cell.columnIndex + this._workbook.options.scrollColumnBufferCount);
            var jumpBackwardColumn = BsSpread._helpers.getColumnsTotalWidth(this, cell.columnIndex - 1, cell.columnIndex - this._workbook.options.scrollColumnBufferCount);
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
                    var cell = new Cell(this._dataSource[i][this._columns[j]._key], this, this._rows[i], this.columns[j]);
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
            this._rows = new ObservableArray();
            for (var i = 0; i < this._dataSource.length; i++) {
                var row = new Row();
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
                var $cell = this.createCell(new Point(currentPosition, 0), "Header: " + (i + 1));
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
            this._bodyDimensions = new Point(0, this._$columnHeaders.height());
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
            var observableDataSource = new ObservableArray();
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
        Spreadsheet.prototype._onScroll = function () {
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
                if (BsSpread._helpers.isArray(newSource)) {
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
    BsSpread.Spreadsheet = Spreadsheet;
    /**
     * Provides common functionality to both the Column and Row classes.
     */
    var RowCol = (function () {
        function RowCol() {
            this._index = 0;
            this._position = 0;
            this._cells = [];
        }
        /**
         * Adds a cell the the list of cells that are managed by the row/column.
         * @param cell
         */
        RowCol.prototype._addCell = function (cell) {
            this._cells.push(cell);
        };
        /**
         * Empties the list of cells that are managed by the row/column for the purposes of rebuilding.
         * @param cell
         */
        RowCol.prototype._clearCells = function () {
            this._cells = [];
        };
        Object.defineProperty(RowCol.prototype, "index", {
            /**
             * Gets the index of the row/column.
             */
            get: function () {
                return this._index;
            },
            /**
             * Sets the index of the row/column.
             */
            set: function (val) {
                this._index = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RowCol.prototype, "cells", {
            /**
             * Gets the cells managed by the row/column.
             */
            get: function () {
                return this._cells;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RowCol.prototype, "position", {
            /**
             * Gets the position of the row/column.
             */
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        return RowCol;
    }());
    var Column = (function (_super) {
        __extends(Column, _super);
        function Column() {
            _super.call(this);
            this._width = 100;
        }
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
        return Column;
    }(RowCol));
    BsSpread.Column = Column;
    var Row = (function (_super) {
        __extends(Row, _super);
        function Row() {
            _super.call(this);
            this._height = 28;
        }
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
        return Row;
    }(RowCol));
    BsSpread.Row = Row;
    var BspreadEvent = (function () {
        function BspreadEvent() {
            this._handlers = new Array();
        }
        BspreadEvent.prototype.raise = function (sender, args) {
            for (var i = 0; i < this._handlers.length; i++) {
                this._handlers[i].call(sender, args);
            }
        };
        BspreadEvent.prototype.register = function (fn) {
            if (typeof (fn) !== "function") {
                console.error("Must be a function!");
                return;
            }
            if (this._handlers.indexOf(fn) < 0) {
                this._handlers.push(fn);
            }
        };
        return BspreadEvent;
    }());
    BsSpread.BspreadEvent = BspreadEvent;
    var Cell = (function () {
        function Cell(initialValue, sheet, row, column) {
            if (initialValue == null)
                initialValue = undefined;
            this._value = initialValue;
            this._sheet = sheet;
            this._row = row;
            this._column = column;
            this.recreateElement();
        }
        Cell.prototype.recreateElement = function () {
            var newElement = $("<div class=\"" + this._sheet.workbook.prefix + "-cell\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>");
            if (this._element && this._element.parentElement) {
                console.log("trigger redraw");
            }
            this._element = newElement.get(0);
            this._element.addEventListener("click", BsSpread._helpers.proxy(this._cellClicked, this), true);
        };
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "displayValue", {
            /**
             * Gets the cell display value of the value.
             */
            get: function () {
                return this._value;
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
    BsSpread.Cell = Cell;
    /**
     * An array base object used to aid in creating the observable array object.
     */
    var ArrayBase = (function () {
        /**
         * Creates a new array object.
         */
        function ArrayBase() {
            this.length = 0;
            Array.apply(this, arguments);
            return new Array();
        }
        /**
         * Returns the last element of the array, removing it in the procecss.
         */
        ArrayBase.prototype.pop = function () {
            return "";
        };
        /**
         * Pushes a new value into the array.
         * @returns {number} The new length of the array.
         */
        ArrayBase.prototype.push = function (val) {
            return 0;
        };
        return ArrayBase;
    }());
    ArrayBase.prototype = new Array();
    /**
     * An observable array that will automatically raise changes when the collection is changed.
     */
    var ObservableArray = (function (_super) {
        __extends(ObservableArray, _super);
        /**
         * Creates a new observable array.
         */
        function ObservableArray() {
            _super.call(this);
            this._isUpdating = false;
            this.onCollectionChanged = new BspreadEvent();
        }
        /**
         * Pushes a new value into the array.
         *
         * @param item {any} The object to be added to the array.
         * @returns {number} The new length of the array.
         */
        ObservableArray.prototype.push = function (val) {
            var args = new Array();
            var newLength = this.length;
            for (var i = 0; i < arguments.length; i++) {
                newLength = _super.prototype.push.call(this, arguments[i]);
            }
            return newLength;
        };
        /**
         * Pops the last value from the array.
         */
        ObservableArray.prototype.pop = function () {
            var item = _super.prototype.pop.call(this);
            // raise pop event
            return item;
        };
        return ObservableArray;
    }(ArrayBase));
    BsSpread.ObservableArray = ObservableArray;
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
            this.onDataItemChange = new BspreadEvent();
            this._dataItem = dataItem;
            for (var idx in dataItem) {
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
            }
        }
        return ObservableDataItem;
    }());
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
    BsSpread.Point = Point;
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
            this._position = new Point(x, y);
            this._dimensions = new Point(width, height);
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
    BsSpread.Rect = Rect;
    /**
     * The standard keyboard event handler.
     */
    var KeyHandler = (function () {
        function KeyHandler(workbook) {
            this._workbook = workbook;
        }
        KeyHandler.prototype.onKeyDown = function (e) {
            var isShiftDown = e.shiftKey;
            var keyCode = e.keyCode;
            this._workbook._log(e);
            switch (keyCode) {
                case BsSpread.keys.enter:
                    this._workbook.selectedSheet._enterToNextRow();
                    break;
                case BsSpread.keys.tab:
                    if (isShiftDown) {
                        this._workbook.selectedSheet._tabToPreviousCell();
                    }
                    else {
                        this._workbook.selectedSheet._tabToNextCell();
                    }
                    this._cancelEvent(e);
                    break;
                case BsSpread.keys.upArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new Point(0, -1));
                    this._cancelEvent(e);
                    break;
                case BsSpread.keys.rightArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new Point(1, 0));
                    this._cancelEvent(e);
                    break;
                case BsSpread.keys.downArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new Point(0, 1));
                    this._cancelEvent(e);
                    break;
                case BsSpread.keys.leftArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new Point(-1, 0));
                    this._cancelEvent(e);
                    break;
            }
        };
        /**
         * Cancels the key event by stopping bubbling and preventing default.
         * @param e {KeyboardEvent} The keyboard event to cancel.
         */
        KeyHandler.prototype._cancelEvent = function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
        };
        return KeyHandler;
    }());
    /**
     * Holds a group of helper functions.
     */
    BsSpread._helpers = new Helpers();
    /**
     * Holds all the key codes for a keydown/keypress/keyup event.
     */
    BsSpread.keys = {
        "backspace": 8,
        "tab": 9,
        "enter": 13,
        "shift": 16,
        "ctrl": 17,
        "alt": 18,
        "pauseBreak": 19,
        "capsLock": 20,
        "escape": 27,
        "pageUp": 33,
        "pageDown": 34,
        "end": 35,
        "home": 36,
        "leftArrow": 37,
        "upArrow": 38,
        "rightArrow": 39,
        "downArrow": 40,
        "insert": 45,
        "delete": 46,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "a": 65,
        "b": 66,
        "c": 67,
        "d": 68,
        "e": 69,
        "f": 70,
        "g": 71,
        "h": 72,
        "i": 73,
        "j": 74,
        "k": 75,
        "l": 76,
        "m": 77,
        "n": 78,
        "o": 79,
        "p": 80,
        "q": 81,
        "r": 82,
        "s": 83,
        "t": 84,
        "u": 85,
        "v": 86,
        "w": 87,
        "x": 88,
        "y": 89,
        "z": 90,
        "leftWindowKey": 91,
        "rightWindowKey": 92,
        "selectKey": 93,
        "numpad0": 96,
        "numpad1": 97,
        "numpad2": 98,
        "numpad3": 99,
        "numpad4": 100,
        "numpad5": 101,
        "numpad6": 102,
        "numpad7": 103,
        "numpad8": 104,
        "numpad9": 105,
        "multiply": 106,
        "add": 107,
        "subtract": 109,
        "decimalPoint": 110,
        "divide": 111,
        "f1": 112,
        "f2": 113,
        "f3": 114,
        "f4": 115,
        "f5": 116,
        "f6": 117,
        "f7": 118,
        "f8": 119,
        "f9": 120,
        "f10": 121,
        "f11": 122,
        "f12": 123,
        "numLock": 144,
        "scrollLock": 145,
        "semiColon": 186,
        "equalSign": 187,
        "comma": 188,
        "dash": 189,
        "period": 190,
        "forwardSlash": 191,
        "graveAccent": 192,
        "openBracket": 219,
        "backSlash": 220,
        "closeBracket": 221,
        "singleQuote": 222
    };
})(BsSpread || (BsSpread = {}));
//# sourceMappingURL=spreadsheet.js.map