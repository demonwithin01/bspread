module BsSpread
{
    export class Spreadsheet
    {
        private _options: Object;
        private _$columnHeaders: JQuery;
        public _$sheetBody: JQuery;
        private _prefix: String = "bspread";
        private _isUpdating = false;
        private _container: JQuery;
        private _columns: ObservableArray;
        private _rows: ObservableArray;
        private _dataSource;
        private _cells;
        private _marquee: Marquee;

        constructor( selector: string, options: Object )
        {
            var defaults = {

            };

            this._options = options;

            this._container = $( selector );
            this._columns = new ObservableArray();
            this._rows = new ObservableArray();
            this._dataSource = new ObservableArray();
            this._cells = [];

            //this.columns.addedItem.register( this.columnAdded );
            //this.columns.arrayChanged.register( this.columnsChanged );

            this._$columnHeaders = $( "<div class=\"" + this._prefix + "-column-headers\"></div>" );
            this._$sheetBody = $( "<div class=\"" + this._prefix + "-sheet-body\"></div>" );

            this._container.append( this._$columnHeaders );
            this._container.append( this._$sheetBody );

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

            var data = [];

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
            this._container.css( { display: "block", overflow: "scroll", width: "100%", height: "200px", position: "relative" });

            this._drawHeaders.call( this );
            this._drawBody.call( this );
        };

        public _cellClicked( cell, e )
        {
            this._marquee.selectCells( cell.rowIndex, cell.columnIndex );
            console.log( cell );
        }

        private _columnsChanged( sender, column )
        {
            console.log( "Columns Changed" );
            if ( this._isUpdating ) return;

        }

        private _columnAdded( sender, column )
        {
            console.log( "Column Added" );
            if ( this._isUpdating ) return;

        }

        private _createCellData()
        {
            this._cells = [];

            for ( var i = 0; i < this._columns.length; i++ )
            {
                this._columns[i]._cells = [];
            }

            for ( var i = 0; i < this._dataSource.length; i++ )
            {
                this._cells[i] = [];
                for ( var j = 0; j < this._columns.length; j++ )
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
                var $cell = this.createCell( { top: 0, left: currentPosition }, "Header: " + ( i + 1 ) );
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

            //for ( var i = 0; i < this._rows.length; i++ )
            //{
            //    var height = this._rows[i].height;
            //    var currentPositionX = 0;

            //    for ( var j = 0; j < this._columns.length; j++ )
            //    {
            //        var $cell = this.createCell( { top: currentPositionY, left: currentPositionX }, this._rows[i].dataItem[this._columns[j]._key] );
            //        this._$sheetBody.append( $cell );

            //        currentPositionX += this._columns[j].width;

            //        $cell.height( height );
            //    }

            //    currentPositionY += height;
            //}

            this._$sheetBody.height( currentPositionY );
        };

        private _createObservableDataSource( data ) : ObservableArray
        {
            for ( var i = 0; i < data.length; i++ )
            {
                if ( data[i] instanceof ObservableDataItem )
                {
                    continue;
                }

                data[i] = new ObservableDataItem( data[i], this );
            }

            return data;
        }

        private createCell( pos, content )
        {
            return $( "<div class=\"" + this._prefix + "-cell\" style=\"position: absolute; top: " + pos.top + "px; left: " + pos.left + "px; overflow: hidden; width: 100px;\">" + content + "</div>" );
        };

        get container()
        {
            return this._container;
        }

        get columns(): ObservableArray
        {
            return this._columns;
        }

        get rows(): ObservableArray
        {
            return this._rows;
        }

        get prefix(): String
        {
            return this._prefix;
        }

        get cells()
        {
            return this._cells;
        }

        get dataSource(): any[]
        {
            return this._dataSource;
        }
        set dataSource( newSource: any[] )
        {
            this._dataSource = this._createObservableDataSource( newSource );
        }
    }

    class RowCol
    {
        protected _index: number;
        protected _position: number;

        public _cells;

        constructor()
        {
            this._index = 0;
            this._position = 0;

            this._cells = [];
        }

        get index(): number
        {
            return this._index;
        }
        set index( val: number )
        {
            this._index = val;
        }

        get position(): number
        {
            return this._position;
        }
    }

    export class Column extends RowCol
    {
        private _width: number;
        public _key: String;

        constructor()
        {
            super();

            this._width = 100;
        }

        get index(): number
        {
            return this._index;
        }
        set index( val: number )
        {
            this._index = val;
            this._position = this._index * this._width;
        }

        get width(): number
        {
            return this._width;
        }
    }

    export class Row extends RowCol
    {
        private _height: number;

        public dataItem;

        constructor()
        {
            super();
            
            this._height = 28;
        }

        get index(): number
        {
            return this._index;
        }
        set index( val: number )
        {
            this._index = val;
            this._position = this._index * this._height;
        }

        get height(): number
        {
            return this._height;
        }
    }

    export class Event
    {
        private _handlers;

        constructor()
        {
            this._handlers = new Array();
        }

        public raise( sender, args )
        {
            for ( var i = 0; i < this._handlers.length; i++ )
            {
                this._handlers[i].call( sender, args );
            }
        }

        public register( fn )
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
        private _value;
        private _element: Element;
        private _sheet: Spreadsheet;
        private _row: Row;
        private _column: Column;

        constructor( initialValue, sheet: Spreadsheet, row: Row, column: Column )
        {
            if ( initialValue == null ) initialValue = undefined;
            this._value = initialValue;

            this._sheet = sheet;
            this._row = row;
            this._column = column;

            this.recreateElement();
        }

        public getDisplayValue()
        {
            return this._value;
        }

        public recreateElement()
        {
            var newElement = $( "<div class=\"" + this._sheet.prefix + "-cell\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>" );

            if ( this._element && this._element.parentElement )
            {
                console.log( "trigger redraw" );
            }
            
            this._element = newElement.get( 0 );
            this._element.addEventListener( "click", $.proxy( this._cellClicked, this ), true );
        }

        private _cellClicked( e )
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

        get row(): Row
        {
            return this._row;
        }

        get column(): Column
        {
            return this._column;
        }

        get rowIndex()
        {
            return this._row.index;
        }

        get columnIndex()
        {
            return this._column.index;
        }
    }

    export class ArrayBase 
    {
        public length: number;

        constructor()
        {
            this.length = 0;
            Array.apply( this, arguments );
            return new Array();
        }

        public pop() : any
        {
            return "";
        }

        public push( val ): number
        {
            return 0;
        }
    }
    
    ArrayBase.prototype = new Array();

    export class ObservableArray extends ArrayBase
    {
        private _isUpdating: Boolean;
        private onCollectionChanged;

        constructor()
        {
            super();
            this._isUpdating = false;
            this.onCollectionChanged = new Event();
        }

        /**
         * Pushes a new value into the array.
         * 
         * @param item {any} The object to be added to the array.
         * @returns {Number} The new length of the array.
         */
        public push( val ): number
        {
            var args = new Array();
            var newLength = this.length;
            for ( var i = 0; i < arguments.length; i++ )
            {
                newLength = super.push( arguments[i] );
            }

            return newLength;
        }

        public pop()
        {
            var item = super.pop();

            // raise pop event

            return item;
        }
    }

    class ObservableDataItem
    {
        private _dataItem;
        private _sheet: Spreadsheet;

        public onDataItemChange: Event;

        constructor( dataItem, sheet: Spreadsheet )
        {
            this._dataItem = dataItem;
            this._sheet = sheet;
            this.onDataItemChange = new Event();

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

    class Marquee
    {
        private _options;
        private _sheet: Spreadsheet;
        private _element: HTMLElement;

        constructor( sheet: Spreadsheet, options? )
        {
            var defaults = {
                borderWidth: 2,
                borderColor: "#00f"
            };
            this._options = $.extend( {}, defaults, options );

            this._sheet = sheet;

            this._element = document.createElement( "div" );
            this._element.classList.add( this._sheet.prefix + "-marquee" );
            this._element.style.position = "absolute";
            this._element.style.borderWidth = this._options.borderWidth + "px";
            this._element.style.borderColor = this._options.borderColor;
            this._element.style.borderStyle = "solid";

            this._sheet.container.append( $( this._element ) );
        }

        public selectCells( startRow: number, startColumn: number, endRow?: number, endColumn?: number )
        {
            /// <signature>
            /// <summary>Selects a cell using the provided indices</summary>
            /// <param name="startRow">The row index</param>
            /// <param name="startColumn">The column index</param>
            /// </signature>
            /// <signature>
            /// <summary>Selects a cell range using the provided indices</summary>
            /// <param name="startRow">The start row index</param>
            /// <param name="startColumn">The start column index</param>
            /// <param name="endRow">The end row index</param>
            /// <param name="endColumn">The end column index</param>
            /// </signature>

            if ( endRow == undefined ) endRow = startRow;
            if ( endColumn == undefined ) endColumn = startColumn;

            var startCell = this._sheet.cells[startRow][startColumn];
            var endCell = this._sheet.cells[endRow][endColumn];

            var topOffset = parseInt( this._sheet._$sheetBody.get( 0 ).style.top );

            var spacing = this._options.borderWidth / 2;
            
            this._element.style.top = ( topOffset + startCell.row.position - spacing - 1 ) + "px";
            this._element.style.left = ( startCell.column.position - spacing - 1 ) + "px";
            this._element.style.height = ( endCell.row.height + this._options.borderWidth + 1 ) + "px";
            this._element.style.width = ( endCell.column.width + this._options.borderWidth + 1 ) + "px";
        }
    }
}