/// <reference path="./../typings/jquery/jquery.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BsSpread;
(function (BsSpread) {
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
            this._$columnHeaders = $("<div class=\"" + this._prefix + "-column-headers\"></div>");
            this._$sheetBody = $("<div class=\"" + this._prefix + "-sheet-body\"></div>");
            this._container.append(this._$columnHeaders);
            this._container.append(this._$sheetBody);
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
            this._container.css({ display: "block", overflow: "scroll", width: "100%", height: "200px", position: "relative" });
            this._drawHeaders.call(this);
            this._drawBody.call(this);
        };
        ;
        Spreadsheet.prototype._cellClicked = function (cell, e) {
            this._marquee.selectCells(cell.rowIndex, cell.columnIndex);
            console.log(cell);
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
            return $("<div class=\"" + this._prefix + "-cell\" style=\"position: absolute; top: " + pos.Y + "px; left: " + pos.X + "px; overflow: hidden; width: 100px;\">" + content + "</div>");
        };
        ;
        Object.defineProperty(Spreadsheet.prototype, "container", {
            get: function () {
                return this._container;
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
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        return Row;
    }(RowCol));
    BsSpread.Row = Row;
    var Event = (function () {
        function Event() {
            this._handlers = new Array();
        }
        Event.prototype.raise = function (sender, args) {
            for (var i = 0; i < this._handlers.length; i++) {
                this._handlers[i].call(sender, args);
            }
        };
        Event.prototype.register = function (fn) {
            if (typeof (fn) !== "function") {
                console.error("Must be a function!");
                return;
            }
            if (this._handlers.indexOf(fn) < 0) {
                this._handlers.push(fn);
            }
        };
        return Event;
    }());
    BsSpread.Event = Event;
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
        Cell.prototype.getDisplayValue = function () {
            return this._value;
        };
        Cell.prototype.recreateElement = function () {
            var newElement = $("<div class=\"" + this._sheet.prefix + "-cell\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>");
            if (this._element && this._element.parentElement) {
                console.log("trigger redraw");
            }
            this._element = newElement.get(0);
            this._element.addEventListener("click", $.proxy(this._cellClicked, this), true);
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
            get: function () {
                return this._row;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "column", {
            get: function () {
                return this._column;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "rowIndex", {
            get: function () {
                return this._row.index;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "columnIndex", {
            get: function () {
                return this._column.index;
            },
            enumerable: true,
            configurable: true
        });
        return Cell;
    }());
    BsSpread.Cell = Cell;
    var ArrayBase = (function () {
        function ArrayBase() {
            this.length = 0;
            Array.apply(this, arguments);
            return new Array();
        }
        ArrayBase.prototype.pop = function () {
            return "";
        };
        ArrayBase.prototype.push = function (val) {
            return 0;
        };
        return ArrayBase;
    }());
    BsSpread.ArrayBase = ArrayBase;
    ArrayBase.prototype = new Array();
    var ObservableArray = (function (_super) {
        __extends(ObservableArray, _super);
        function ObservableArray() {
            _super.call(this);
            this._isUpdating = false;
            this.onCollectionChanged = new Event();
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
        ObservableArray.prototype.pop = function () {
            var item = _super.prototype.pop.call(this);
            // raise pop event
            return item;
        };
        return ObservableArray;
    }(ArrayBase));
    BsSpread.ObservableArray = ObservableArray;
    var ObservableDataItem = (function () {
        function ObservableDataItem(dataItem, sheet) {
            this._dataItem = dataItem;
            this._sheet = sheet;
            this.onDataItemChange = new Event();
            for (var idx in dataItem) {
                Object.defineProperty(this, idx, {
                    get: function () {
                        return this._dataItem[idx];
                    },
                    set: function (value) {
                        this._dataItem[idx] = value;
                        console.log("data changed");
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
        function Marquee(sheet, options) {
            var defaults = {
                borderWidth: 2,
                borderColor: "#00f"
            };
            this._options = $.extend({}, defaults, options);
            this._sheet = sheet;
            this._element = document.createElement("div");
            this._element.classList.add(this._sheet.prefix + "-marquee");
            this._element.style.position = "absolute";
            this._element.style.borderWidth = this._options.borderWidth + "px";
            this._element.style.borderColor = this._options.borderColor;
            this._element.style.borderStyle = "solid";
            this._sheet.container.append($(this._element));
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
            var startCell = this._sheet.cells[startRow][startColumn];
            var endCell = this._sheet.cells[endRow][endColumn];
            var topOffset = parseInt(this._sheet._$sheetBody.get(0).style.top);
            var spacing = this._options.borderWidth / 2;
            this._element.style.top = (topOffset + startCell.row.position - spacing - 1) + "px";
            this._element.style.left = (startCell.column.position - spacing - 1) + "px";
            this._element.style.height = (endCell.row.height + this._options.borderWidth + 1) + "px";
            this._element.style.width = (endCell.column.width + this._options.borderWidth + 1) + "px";
        };
        return Marquee;
    }());
    var Point = (function () {
        function Point(x, y) {
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(Point.prototype, "X", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "Y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        return Point;
    }());
    BsSpread.Point = Point;
})(BsSpread || (BsSpread = {}));
//# sourceMappingURL=spreadsheet.js.map