/// <reference path="./../typings/jquery/jquery.d.ts" />

module BsSpread
{
    /**
     * Holds a group of helper functions.
     */
    export class Helpers
    {
        /**
         * Creates a proxy event handler.
         * @param callback The callback method to call.
         * @param self The object to call the callback against.
         */
        public proxy( callback: Function, self: Object ): EventListener
        {
            return function ( evt: Event ): void
            {
                callback.apply( self, [ evt ] );
            };
        }
    }

    export class Spreadsheet
    {
        private _options: Object;
        private _$columnHeaders: JQuery;
        private _$sheet: JQuery;
        private _toolsElement: JQuery;
        public _$sheetBody: JQuery;
        private _prefix: string = "bspread";
        private _isUpdating = false;
        private _container: JQuery;
        private _columns: ObservableArray<Column>;
        private _rows: ObservableArray<Row>;
        private _dataSource: ObservableArray<ObservableDataItem>;
        private _cells: Array<Array<Cell>>;
        private _marquee: Marquee;

        private _bodyDimensions: Point;

        constructor( selector: string, options: Object )
        {
            var defaults = {

            };
            
            this._options = options;

            this._container = $( selector );
            this._columns = new ObservableArray<Column>();
            this._rows = new ObservableArray<Row>();
            this._dataSource = new ObservableArray<ObservableDataItem>();
            this._cells = [];

            //this.columns.addedItem.register( this.columnAdded );
            //this.columns.arrayChanged.register( this.columnsChanged );

            this._$sheet = $( "<div class=\"" + this._prefix + "-sheet\" style=\"margin: 2px;\"></div>" );
            this._toolsElement = $( "<div class=\"" + this._prefix + "-tools\" style=\"position: absolute; top: 2px; right: 2px; bottom: 2px; left: 2px; pointer-events: none;\"></div>" );

            this._$columnHeaders = $( "<div class=\"" + this._prefix + "-column-headers\"></div>" );
            this._$sheetBody = $( "<div class=\"" + this._prefix + "-sheet-body\"></div>" );

            this._$sheet.append( this._$columnHeaders );
            this._$sheet.append( this._$sheetBody );

            this._container.append( this._$sheet );
            this._container.append( this._toolsElement );

            this._container.css( { position: "relative" } );

            this._marquee = new Marquee( this );

            this._isUpdating = true;

            var keys = ["title", "col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", "col10",
                        "col11", "col12", "col13", "col14", "col15", "col16", "col17", "col18", "col19"];

            for ( var i = 0; i < keys.length; i++ )
            {
                var column = new Column();
                column.index = i;
                column._key = keys[i];

                this._columns.push( column );
            }

            var data: any[] = [];

            for ( var i = 0; i < 22; i++ )
            {
                data.push( {
                    title: "Row: " + ( i + 1 ),
                    col1: Math.round( Math.random() * 100 ),
                    col2: Math.round( Math.random() * 100 ),
                    col3: Math.round( Math.random() * 100 ),
                    col4: Math.round( Math.random() * 100 ),
                    col5: Math.round( Math.random() * 100 ),
                    col6: Math.round( Math.random() * 100 ),
                    col7: Math.round( Math.random() * 100 ),
                    col8: Math.round( Math.random() * 100 ),
                    col9: Math.round( Math.random() * 100 ),
                    col10: Math.round( Math.random() * 100 ),
                    col11: Math.round( Math.random() * 100 ),
                    col12: Math.round( Math.random() * 100 ),
                    col13: Math.round( Math.random() * 100 ),
                    col14: Math.round( Math.random() * 100 ),
                    col15: Math.round( Math.random() * 100 ),
                    col16: Math.round( Math.random() * 100 ),
                    col17: Math.round( Math.random() * 100 ),
                    col18: Math.round( Math.random() * 100 ),
                    col19: Math.round( Math.random() * 100 )
                });
            }

            this.dataSource = data;
            
            this._createRowData();

            window.addEventListener( "resize", _helpers.proxy( this._onResize, this ) );
            this._$sheet[0].addEventListener( "scroll", _helpers.proxy( this._onResize, this ) );

            this.endUpdate();
        }
        
        /**
         * Puts the sheet into an update mode.
         */
        public beginUpdate()
        {
            if ( this._isUpdating )
            {
                console.error( "already updating" );

                return;
            }

            this._isUpdating = true;
        };

        /**
         * Exits the sheet out of update mode.
         */
        public endUpdate()
        {
            if ( this._isUpdating )
            {
                this._isUpdating = false;
                this.redraw();
            }
        };

        public redraw()
        {
            this._$sheet.css( { display: "block", overflow: "scroll", width: "100%", height: "200px", position: "relative" });

            this._drawHeaders.call( this );
            this._drawBody.call( this );
        };

        public _cellClicked( cell: Cell, e: MouseEvent )
        {
            this._marquee.selectCells( cell.rowIndex, cell.columnIndex, cell.rowIndex, cell.columnIndex );
        }

        private _columnsChanged( column: Column )
        {
            console.log( "Columns Changed" );
            if ( this._isUpdating ) return;

        }

        private _columnAdded( column: Column )
        {
            console.log( "Column Added" );
            if ( this._isUpdating ) return;

        }

        private _createCellData()
        {
            this._cells = [];

            for ( var i: number = 0; i < this._columns.length; i++ )
            {
                this._columns[i]._cells = [];
            }

            for ( var i: number = 0; i < this._dataSource.length; i++ )
            {
                this._cells[i] = [];
                for ( var j: number = 0; j < this._columns.length; j++ )
                {
                    var cell = new Cell( this._dataSource[i][this._columns[j]._key], this, this._rows[i], this.columns[j] );

                    this._cells[i][j] = cell;
                    this._columns[j]._cells.push( cell );
                }

                this._rows[i]._cells = this._cells[i];
            }
        }

        private _createRowData()
        {
            for ( var i = 0; i < this._dataSource.length; i++ )
            {
                var row = new Row();
                row.index = i;
                row.dataItem = this._dataSource[i];
                
                this._rows.push( row );
            }

            this._createCellData();
        }

        private _drawHeaders()
        {
            this._$columnHeaders.empty().css( { position: "absolute", top: "0", left: "0", width: "100%" });

            var currentPosition = 0;
            var height = 0;

            for ( var i = 0; i < this._columns.length; i++ )
            {
                var $cell = this.createCell( new Point( currentPosition, 0 ), "Header: " + ( i + 1 ) );
                $cell.addClass( this._prefix + "-column-header" );
                this._$columnHeaders.append( $cell );

                this._columns[i].position = currentPosition;
                currentPosition += this._columns[i].width;

                var h = $cell.outerHeight();
                if ( h > height )
                {
                    height = h;
                }
            }

            this._$columnHeaders.height( height );
        };

        private _drawBody()
        {
            this._bodyDimensions = new Point( 0, this._$columnHeaders.height() );

            this._$sheetBody.empty().css( { position: "absolute", top: this._$columnHeaders.height(), left: "0", width: "100%" });

            var currentPositionY = 0;

            for ( var y = 0; y < this._cells.length; y++ )
            {
                for ( var x = 0; x < this._cells[y].length; x++ )
                {
                    this._$sheetBody.append( $( this._cells[y][x].element ) );
                }

                currentPositionY += this.rows[y].height;
            }
            
            this._$sheetBody.height( currentPositionY );
        };

        private _createObservableDataSource( data: ObservableArray<ObservableDataItem> | Array<any> ): ObservableArray<ObservableDataItem>
        {
            var observableDataSource: ObservableArray<ObservableDataItem> = new ObservableArray<ObservableDataItem>();

            for ( var i = 0; i < data.length; i++ )
            {
                if ( !( data[i] instanceof ObservableDataItem ) )
                {
                    data[i] = new ObservableDataItem( data[i], this );
                }

                observableDataSource.push( data[i] );
            }

            return observableDataSource;
        }

        private createCell( pos: Point, content: string )
        {
            return $( "<div class=\"" + this._prefix + "-cell\" style=\"position: absolute; top: " + pos.y + "px; left: " + pos.x + "px; overflow: hidden; width: 100px;\">" + content + "</div>" );
        };

        private _onResize(): void
        {
            this._marquee.recalculatePosition();
        }

        get container()
        {
            return this._container;
        }

        get sheetContainer()
        {
            return this._$sheet;
        }

        get toolsContainer(): JQuery
        {
            return this._toolsElement;
        }

        get bodyContainer(): JQuery
        {
            return this._$sheetBody;
        }

        get bodyDimensions(): Point
        {
            return this._bodyDimensions;
        }

        get columns(): ObservableArray<Column>
        {
            return this._columns;
        }

        get rows(): ObservableArray<Row>
        {
            return this._rows;
        }

        get prefix(): string
        {
            return this._prefix;
        }

        get cells(): Array<Array<Cell>>
        {
            return this._cells;
        }

        get dataSource(): ObservableArray<ObservableDataItem> | Array<any>
        {
            return this._dataSource;
        }
        set dataSource( newSource: ObservableArray<ObservableDataItem> | Array<any> )
        {
            this._dataSource = this._createObservableDataSource( newSource );
        }
    }

    /**
     * Provides common functionality to both the Column and Row classes.
     */
    class RowCol
    {
        /**
         * Holds the current index of the row/column.
         */
        protected _index: number;
        
        /**
         * Holds the current position of the row/column.
         */
        protected _position: number;

        public _cells: Array<Cell>;

        constructor()
        {
            this._index = 0;
            this._position = 0;

            this._cells = [];
        }

        /**
         * Gets the index of the column/row.
         */
        get index(): number
        {
            return this._index;
        }
        /**
         * Sets the index of the column/row.
         */
        set index( val: number )
        {
            this._index = val;
        }

        /**
         * Gets the position of the column/row.
         */
        get position(): number
        {
            return this._position;
        }
    }

    export class Column extends RowCol
    {
        /**
         * Holds the width of the column.
         */
        private _width: number;

        public _key: string;

        constructor()
        {
            super();

            this._width = 100;
        }

        /**
         * Gets the index of the column.
         */
        get index(): number
        {
            return this._index;
        }
        /**
         * Sets the index of the column.
         */
        set index( val: number )
        {
            this._index = val;
            this._position = this._index * this._width;
        }

        /**
         * Gets the width of the column.
         */
        get width(): number
        {
            return this._width;
        }
    }

    export class Row extends RowCol
    {
        /**
         * Holds the height of the row.
         */
        private _height: number;
        
        public dataItem: any;

        constructor()
        {
            super();
            
            this._height = 28;
        }

        /**
         * Gets the index of the row.
         */
        get index(): number
        {
            return this._index;
        }
        /**
         * Sets the index of the row.
         */
        set index( val: number )
        {
            this._index = val;
            this._position = this._index * this._height;
        }

        /**
         * Gets the height of the row.
         */
        get height(): number
        {
            return this._height;
        }
    }

    export class BspreadEvent
    {
        private _handlers: Array<Function>;

        constructor()
        {
            this._handlers = new Array();
        }

        public raise( sender: any, args: any )
        {
            for ( var i = 0; i < this._handlers.length; i++ )
            {
                this._handlers[i].call( sender, args );
            }
        }

        public register( fn: Function )
        {
            if ( typeof ( fn ) !== "function" )
            {
                console.error( "Must be a function!" );
                return;
            }

            if ( this._handlers.indexOf( fn ) < 0 )
            {
                this._handlers.push( fn );
            }
        }
    }

    export class Cell
    {
        private _value: string | number;
        private _element: Element;
        private _sheet: Spreadsheet;
        private _row: Row;
        private _column: Column;

        constructor( initialValue: string | number, sheet: Spreadsheet, row: Row, column: Column )
        {
            if ( initialValue == null ) initialValue = undefined;
            this._value = initialValue;

            this._sheet = sheet;
            this._row = row;
            this._column = column;

            this.recreateElement();
        }
        
        public recreateElement()
        {
            var newElement = $( "<div class=\"" + this._sheet.prefix + "-cell\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>" );

            if ( this._element && this._element.parentElement )
            {
                console.log( "trigger redraw" );
            }
            
            this._element = newElement.get( 0 );
            this._element.addEventListener( "click", _helpers.proxy( this._cellClicked, this ), true );
        }

        private _cellClicked( e: MouseEvent )
        {
            this._sheet._cellClicked( this, e );
        }
        
        /**
         * Gets the value of the cell.
         */
        get value()
        {
            return this._value;
        }
        
        /**
         * Sets the value of the cell.
         */
        set value( newValue )
        {
            this._value = newValue;
        }
        
        /**
         * Gets the cell display value of the value.
         */
        get displayValue()
        {
            return this._value;
        }
        
        /**
         * Gets the cell element.
         */
        get element(): Element
        {
            return this._element;
        }

        /**
         * Gets the row that this cell can be found in.
         */
        get row(): Row
        {
            return this._row;
        }

        /**
         * Gets the column that this cell can be found in.
         */
        get column(): Column
        {
            return this._column;
        }

        /**
         * Gets the row index for this cell.
         */
        get rowIndex()
        {
            return this._row.index;
        }

        /**
         * Gets the column index for this cell.
         */
        get columnIndex()
        {
            return this._column.index;
        }
    }



    /**
     * An array base object used to aid in creating the observable array object.
     */
    class ArrayBase 
    {

        /**
         * Holds the current length of the array.
         */
        public length: number;

        /**
         * Creates a new array object.
         */
        constructor()
        {
            this.length = 0;
            Array.apply( this, arguments );
            return new Array();
        }

        /**
         * Returns the last element of the array, removing it in the procecss.
         */
        public pop() : any
        {
            return "";
        }

        /**
         * Pushes a new value into the array.
         * @returns {number} The new length of the array.
         */
        public push( val: any ): number
        {
            return 0;
        }
    }
    
    ArrayBase.prototype = new Array();



    /**
     * An observable array that will automatically raise changes when the collection is changed.
     */
    export class ObservableArray<T> extends ArrayBase
    {

        /**
         * Holds whether or not the collection is currently being updated.
         * If this value is true, then the collection events should not be raised.
         */
        private _isUpdating: Boolean;
        
        /**
         * Holds the event which will be raised when the collection is changed.
         */
        private onCollectionChanged: BspreadEvent;

        /**
         * Array indexer, created to prevent compiler "errors".
         */
        [key: number]: T;

        /**
         * Creates a new observable array.
         */
        constructor()
        {
            super();
            this._isUpdating = false;
            this.onCollectionChanged = new BspreadEvent();
        }

        /**
         * Pushes a new value into the array.
         * 
         * @param item {any} The object to be added to the array.
         * @returns {Number} The new length of the array.
         */
        public push( val: any ): number
        {
            var args = new Array();
            var newLength = this.length;
            for ( var i = 0; i < arguments.length; i++ )
            {
                newLength = super.push( arguments[i] );
            }

            return newLength;
        }

        /**
         * Pops the last value from the array.
         */
        public pop()
        {
            var item = super.pop();

            // raise pop event

            return item;
        }
    }



    /**
     * An object that creates observable property for each properties on a provided object.
     */
    class ObservableDataItem
    {
        /**
         * Holds the sheet this data item was created for.
         */
        private _sheet: Spreadsheet;

        /**
         * Holds the data item details.
         */
        private _dataItem: any;

        /**
         * Array indexer, created to prevent compiler "errors".
         */
        [key: string]: any;
        
        /**
         * The event which is raised when the data item is changed.
         */
        public onDataItemChange: BspreadEvent;

        /**
         * Creates a new observable data item.
         * @param {any} dataItem The data item to base this obvservable off.
         * @param {Spreadsheet} sheet The sheet that this data item is being created for.
         */
        constructor( dataItem: any, sheet: Spreadsheet )
        {
            this._sheet = sheet;
            this.onDataItemChange = new BspreadEvent();
            this._dataItem = dataItem;
            
            for ( var idx in dataItem )
            {
                Object.defineProperty( this, idx, {
                    get: function ()
                    {
                        return this._dataItem[idx];
                    },
                    set: function ( value )
                    {
                        this._dataItem[idx] = value;
                    },
                    enumerable: !0,
                    configurable: !1
                } );
            }
        }
    }



    /**
     * Responsible for managing the marquee that is displayed showing the selected cells.
     */
    class Marquee
    {
        /**
         * Holds any options associated with this marquee.
         */
        private _options: any;

        /**
         * Holds the cell which is used as the start index.
         */
        private _startCell: Cell;

        /**
         * Holds the cell which is used as the end index.
         */
        private _endCell: Cell;

        /**
         * Holds the sheet this marquee is attached to.
         */
        private _sheet: Spreadsheet;

        /**
         * Holds whether or not the marquee is currently visible.
         */
        private _isVisible: Boolean;

        /**
         * Holds the marquee HTML element.
         */
        private _element: HTMLElement;

        /**
         * Creates a new Marquee object on the specified spreadsheet.
         * @param {Spreadsheet} sheet The left position of the rectangle.
         * @param {any} options The top position of the rectangle.
         */
        constructor( sheet: Spreadsheet, options?: any )
        {
            var defaults = {
                borderWidth: 2,
                borderColor: "#00f"
            };
            this._options = $.extend( {}, defaults, options );

            this._sheet = sheet;
            this._isVisible = false;

            this._element = document.createElement( "div" );
            this._element.classList.add( this._sheet.prefix + "-marquee" );
            this._element.style.position = "absolute";
            this._element.style.borderWidth = this._options.borderWidth + "px";
            this._element.style.borderColor = this._options.borderColor;
            this._element.style.borderStyle = "solid";
            this._element.style.display = "none";

            this._sheet.toolsContainer.append( $( this._element ) );
        }

        /**
         * Selects a cell range using the provided indices.
         * @param {number} startRow The start row index
         * @param {number} startColumn The start column index
         * @param {number} endRow The end row index
         * @param {number} endColumn The end column index
         */
        public selectCells( startRow: number, startColumn: number, endRow?: number, endColumn?: number )
        {
            if ( endRow == undefined ) endRow = startRow;
            if ( endColumn == undefined ) endColumn = startColumn;

            this._startCell = this._sheet.cells[startRow][startColumn];
            this._endCell = this._sheet.cells[endRow][endColumn];
            
            this.recalculatePosition();
        }

        /**
         * Recalculates the position of the marquee.
         */
        public recalculatePosition()
        {
            var spacing = this._options.borderWidth / 2;

            var topOffset = parseInt( this._sheet._$sheetBody.get( 0 ).style.top );

            var top = topOffset + this._startCell.row.position - spacing - 1 - this._sheet.sheetContainer[0].scrollTop;
            var left = this._startCell.column.position - spacing - 1 - this._sheet.sheetContainer[0].scrollLeft;

            var bodyTop = this._sheet.bodyDimensions.y;
            var bodyLeft = this._sheet.bodyDimensions.x;

            var rowHeight = 0, columnWidth = 0;
            for ( var i = this._startCell.rowIndex; i <= this._endCell.rowIndex; i++ )
            {
                rowHeight += this._sheet.rows[i].height;
            }
            for ( var i = this._startCell.columnIndex; i <= this._endCell.columnIndex; i++ )
            {
                columnWidth += this._sheet.columns[i].width;
            }

            if ( this._startCell.row.position + bodyTop < this._sheet.sheetContainer[0].scrollTop )
            {
                var difference = this._startCell.row.position + bodyTop - this._sheet.sheetContainer[0].scrollTop;
                rowHeight += difference;
                top = -spacing - 1;
            }
            if ( this._startCell.column.position + bodyLeft < this._sheet.sheetContainer[0].scrollLeft )
            {
                var difference = this._startCell.column.position + bodyLeft - this._sheet.sheetContainer[0].scrollLeft;
                columnWidth += difference;
                left = -spacing - 1;
            }
            
            this._element.style.top = top + "px";
            this._element.style.left = left + "px";

            this._element.style.height = ( rowHeight + this._options.borderWidth + 1 ) + "px";
            this._element.style.width = ( columnWidth + this._options.borderWidth + 1 ) + "px";

            if ( columnWidth <= 0 || rowHeight <= 0 )
            {
                this._isVisible = false;
                this._element.style.display = "none";
            }
            else
            {
                this._isVisible = true;
                this._element.style.display = "block";
            }
        }

        /**
         * Gets whether or not the marquee currently has a selection, multiple or single.
         */
        private _hasSelection(): Boolean
        {
            if ( this._isVisible == false ) return false;

            if ( this._startCell == undefined || this._endCell == undefined ) return false;

            return true;
        }

        /**
         * Gets whether or not the marquee is currently visible.
         */
        get isVisible(): Boolean
        {
            return this._isVisible;
        }

        /**
         * Gets whether or not there is currently a single cell selected.
         * Returns false if the marquee is not visible.
         */
        get hasSingleCellSelected(): Boolean
        {
            if ( this._hasSelection() )
            {
                return ( this._startCell.columnIndex == this._endCell.columnIndex && this._startCell.rowIndex == this._endCell.rowIndex );
            }

            return false;
        }

        /**
         * Gets whether or not there are currently multiple cells selected.
         * Returns false if the marquee is not visible.
         */
        get hasMultipleCellsSelected()
        {
            if ( this._hasSelection() )
            {
                return ( this._startCell.columnIndex != this._endCell.columnIndex || this._startCell.rowIndex != this._endCell.rowIndex );
            }

            return false;
        }
    }



    /**
     * A two dimensional point.
     */
    export class Point
    {
        /**
         * Holds the x co-ordinate.
         */
        private _x: number;

        /**
         * Holds the y co-ordinate.
         */
        private _y: number;

        /**
         * Pushes a new value into the array.
         * 
         * @param x {number} The x co-ordinate of the point.
         * @param y {number} The y co-ordinate of the point.
         */
        constructor( x: number, y: number )
        {
            this._x = x;
            this._y = y;
        }

        /**
         * Gets the X co-ordinate of the point.
         */
        get x(): number
        {
            return this._x;
        }

        /**
         * Gets the Y co-ordinate of the point.
         */
        get y(): number
        {
            return this._y;
        }
    }



    /**
     * The position and dimensions of a rectangle.
     */
    export class Rect
    {
        /**
         * Holds the top left position of the rectangle.
         */
        private _position: Point;
        /**
         * Holds the dimensions of the rectangle.
         */
        private _dimensions: Point;

        /**
         * Creates a new Rect object with the specified position and dimensions.
         * @param {number} x The left position of the rectangle.
         * @param {number} y The top position of the rectangle.
         * @param {number} width The width of the rectangle.
         * @param {number} height The height of the rectangle.
         */
        constructor( x: number, y: number, width: number, height: number )
        {
            this._position = new Point( x, y );
            this._dimensions = new Point( width, height );
        }

        /**
         * Gets the top of the rectangle.
         */
        get top(): number
        {
            return this._position.y;
        }

        /**
         * Gets the left of the rectangle.
         */
        get left(): number
        {
            return this._position.x;
        }

        /**
         * Gets the width of the rectangle.
         */
        get width(): number
        {
            return this._dimensions.x;
        }

        /**
         * Gets the height of the rectangle.
         */
        get height(): number
        {
            return this._dimensions.y;
        }

        /**
         * Gets the bottom of the rectangle.
         */
        get bottom(): number
        {
            return ( this._position.y + this._dimensions.y );
        }

        /**
         * Gets the right of the rectangle.
         */
        get right(): number
        {
            return ( this._position.x + this._dimensions.x );
        }
    }

    /**
     * Holds a group of helper functions.
     */
    export var _helpers = new Helpers();
}