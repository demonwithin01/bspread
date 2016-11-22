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
                callback.apply(self, evt);
            };
        };
        /**
         * Adds an event listener to the specified element.
         * @param element
         * @param type
         * @param listener
         */
        Helpers.prototype.addEventListener = function (element, type, listener) {
            var htmlElement;
            if (typeof (element) === 'string') {
                htmlElement = this._resolveElement(element);
            }
            else {
                htmlElement = element;
            }
            htmlElement.addEventListener(type, listener);
        };
        /**
         * Resolves a selector string into a html element.
         * @param selector
         */
        Helpers.prototype._resolveElement = function (selector) {
            var htmlElement;
            //var elements: NodeListOf<Element>;
            if (selector.indexOf('#') == 0) {
                htmlElement = document.getElementById(selector);
            }
            else if (selector.indexOf('.') == 0) {
                var elements = document.getElementsByClassName(selector);
                if (elements.length == 0) {
                    return undefined;
                }
                htmlElement = elements.item(0);
            }
            else {
                var elements = document.getElementsByTagName(selector);
                if (elements.length == 0) {
                    return undefined;
                }
                htmlElement = elements.item(0);
            }
            return htmlElement;
        };
        return Helpers;
    }());
    BsSpread.Helpers = Helpers;
    var Spreadsheet = (function () {
        function Spreadsheet(selector, options) {
            this._prefix = "bspread";
            this._isUpdating = false;
            var defaults = {};
            this._options = options;
            this._container = $(selector);
            this._columns = new ObservableArray();
            this._rows = new ObservableArray();
            this._dataSource = new ObservableArray();
            this._cells = [];
            //this.columns.addedItem.register( this.columnAdded );
            //this.columns.arrayChanged.register( this.columnsChanged );
            this._$sheet = $("<div class=\"" + this._prefix + "-sheet\" style=\"margin: 2px;\"></div>");
            this._toolsElement = $("<div class=\"" + this._prefix + "-tools\" style=\"position: absolute; top: 2px; right: 2px; bottom: 2px; left: 2px; pointer-events: none;\"></div>");
            this._$columnHeaders = $("<div class=\"" + this._prefix + "-column-headers\"></div>");
            this._$sheetBody = $("<div class=\"" + this._prefix + "-sheet-body\"></div>");
            this._$sheet.append(this._$columnHeaders);
            this._$sheet.append(this._$sheetBody);
            this._container.append(this._$sheet);
            this._container.append(this._toolsElement);
            this._container.css({ position: "relative" });
            this._marquee = new Marquee(this);
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
            window.addEventListener("resize", BsSpread._helpers.proxy(this._onResize, this));
            this._$sheet[0].addEventListener("scroll", BsSpread._helpers.proxy(this._onResize, this));
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
        Spreadsheet.prototype._cellClicked = function (cell, e) {
            this._marquee.selectCells(cell.rowIndex, cell.columnIndex, cell.rowIndex, cell.columnIndex);
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
        Spreadsheet.prototype._createCellData = function () {
            this._cells = [];
            for (var i = 0; i < this._columns.length; i++) {
                this._columns[i]._cells = [];
            }
            for (var i = 0; i < this._dataSource.length; i++) {
                this._cells[i] = [];
                for (var j = 0; j < this._columns.length; j++) {
                    var cell = new Cell(this._dataSource[i][this._columns[j]._key], this, this._rows[i], this.columns[j]);
                    this._cells[i][j] = cell;
                    this._columns[j]._cells.push(cell);
                }
                this._rows[i]._cells = this._cells[i];
            }
        };
        Spreadsheet.prototype._createRowData = function () {
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
                $cell.addClass(this._prefix + "-column-header");
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
            return $("<div class=\"" + this._prefix + "-cell\" style=\"position: absolute; top: " + pos.y + "px; left: " + pos.x + "px; overflow: hidden; width: 100px;\">" + content + "</div>");
        };
        ;
        Spreadsheet.prototype._onResize = function () {
            this._marquee.recalculatePosition();
        };
        Object.defineProperty(Spreadsheet.prototype, "container", {
            get: function () {
                return this._container;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "sheetContainer", {
            get: function () {
                return this._$sheet;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "toolsContainer", {
            get: function () {
                return this._toolsElement;
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
        Object.defineProperty(Spreadsheet.prototype, "columns", {
            get: function () {
                return this._columns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "rows", {
            get: function () {
                return this._rows;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "prefix", {
            get: function () {
                return this._prefix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "cells", {
            get: function () {
                return this._cells;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spreadsheet.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            set: function (newSource) {
                this._dataSource = this._createObservableDataSource(newSource);
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
        Object.defineProperty(RowCol.prototype, "index", {
            get: function () {
                return this._index;
            },
            set: function (val) {
                this._index = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RowCol.prototype, "position", {
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
            get: function () {
                return this._index;
            },
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
            get: function () {
                return this._index;
            },
            set: function (val) {
                this._index = val;
                this._position = this._index * this._height;
            },
            enumerable: true,
            configurable: true
        });
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
            var newElement = $("<div class=\"" + this._sheet.prefix + "-cell\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>");
            if (this._element && this._element.parentElement) {
                console.log("trigger redraw");
            }
            this._element = newElement.get(0);
            this._element.addEventListener("click", BsSpread._helpers.proxy(this._cellClicked, this), true);
        };
        Cell.prototype._cellClicked = function (e) {
            this._sheet._cellClicked(this, e);
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
         * @returns {Number} The new length of the array.
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
         * @param {Spreadsheet} sheet The left position of the rectangle.
         * @param {any} options The top position of the rectangle.
         */
        function Marquee(sheet, options) {
            var defaults = {
                borderWidth: 2,
                borderColor: "#00f"
            };
            this._options = $.extend({}, defaults, options);
            this._sheet = sheet;
            this._isVisible = false;
            this._element = document.createElement("div");
            this._element.classList.add(this._sheet.prefix + "-marquee");
            this._element.style.position = "absolute";
            this._element.style.borderWidth = this._options.borderWidth + "px";
            this._element.style.borderColor = this._options.borderColor;
            this._element.style.borderStyle = "solid";
            this._element.style.display = "none";
            this._sheet.toolsContainer.append($(this._element));
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
            this._startCell = this._sheet.cells[startRow][startColumn];
            this._endCell = this._sheet.cells[endRow][endColumn];
            this.recalculatePosition();
        };
        /**
         * Recalculates the position of the marquee.
         */
        Marquee.prototype.recalculatePosition = function () {
            var spacing = this._options.borderWidth / 2;
            var topOffset = parseInt(this._sheet._$sheetBody.get(0).style.top);
            var top = topOffset + this._startCell.row.position - spacing - 1 - this._sheet.sheetContainer[0].scrollTop;
            var left = this._startCell.column.position - spacing - 1 - this._sheet.sheetContainer[0].scrollLeft;
            var bodyTop = this._sheet.bodyDimensions.y;
            var bodyLeft = this._sheet.bodyDimensions.x;
            var rowHeight = 0, columnWidth = 0;
            for (var i = this._startCell.rowIndex; i <= this._endCell.rowIndex; i++) {
                rowHeight += this._sheet.rows[i].height;
            }
            for (var i = this._startCell.columnIndex; i <= this._endCell.columnIndex; i++) {
                columnWidth += this._sheet.columns[i].width;
            }
            if (this._startCell.row.position + bodyTop < this._sheet.sheetContainer[0].scrollTop) {
                var difference = this._startCell.row.position + bodyTop - this._sheet.sheetContainer[0].scrollTop;
                rowHeight += difference;
                top = -spacing - 1;
            }
            if (this._startCell.column.position + bodyLeft < this._sheet.sheetContainer[0].scrollLeft) {
                var difference = this._startCell.column.position + bodyLeft - this._sheet.sheetContainer[0].scrollLeft;
                columnWidth += difference;
                left = -spacing - 1;
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
    var KeyDispatcher = (function () {
        function KeyDispatcher() {
        }
        return KeyDispatcher;
    }());
    /**
     * Holds a group of helper functions.
     */
    BsSpread._helpers = new Helpers();
})(BsSpread || (BsSpread = {}));
//# sourceMappingURL=spreadsheet.js.map