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
                return callback.apply( self, [ evt ] );
            };
        }

        /**
         * Adds an event listener to the specified element.
         * @param element The element, elements, or selector for adding the event listener to.
         * @param type The event type to attach.
         * @param listener The callback/listener for the event.
         */
        public addEventListener( element: Array<Element> | Element | string, type: string, listener: EventListener | EventListenerObject )
        {
            var htmlElement: Element;

            if ( typeof ( element ) === 'string' )
            {
                var htmlElements = this._resolveElement( element as string );

                htmlElements.forEach( function ( value ) { value.addEventListener( type, listener ); } );
            }
            else if ( this.isArray( element ) )
            {
                var htmlElements = element as Array<Element>;

                htmlElements.forEach( function ( value ) { value.addEventListener( type, listener ); });   
            }
            else
            {
                ( element as Element ).addEventListener( type, listener );
            }
        }

        /**
         * Determines whether or not the provided object is an array.
         * @param obj The object to be checked.
         */
        public isArray( obj: any )
        {
            return obj.constructor === Array;
        }

        /**
         * Simple foreach loop for arrays.
         * @param array The array to loop over.
         * @param callback The callback method for each item.
         */
        public forEach( array: Array<any>, callback: Function )
        {
            if ( !array ) return;

            for ( var i = 0; i < array.length; i++ )
            {
                var item = array[i];
                callback.call( item, i, item );
            }
        }

        /**
         * Finds the element using the provided selector. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         * @returns {Element} The first element found using the provided selector.
         */
        public findElement( selector: string ): Element
        {
            var elements = this._resolveElement( selector );

            if ( elements.length == 0 )
            {
                throw "Element not found using selector: '" + selector + "'";
            }

            return elements[0];
        }

        /**
         * Gets the total width of the columns for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the columns.
         * @param startIndex {number} The first index of the column to retrieve.
         * @param endIndex {number} The final index of the column to retrieve.
         * @returns {number} The total width of the requested columns.
         */
        public getColumnsTotalWidth( sheet: Spreadsheet, startIndex: number, endIndex: number ): number
        {
            var width = 0;

            if ( startIndex < 0 ) startIndex = 0;
            
            if ( endIndex < startIndex )
            {
                for ( var i = startIndex; i >= 0 && i >= endIndex; --i )
                {
                    width += sheet.columns[i].width;
                }
            }
            else
            {
                for ( var i = startIndex; i < sheet.columns.length && i <= endIndex; i++ )
                {
                    width += sheet.columns[i].width;
                }
            }

            return width;
        }

        /**
         * Gets the total height of the rows for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the rows.
         * @param startIndex {number} The first index of the row to retrieve.
         * @param endIndex {number} The final index of the row to retrieve.
         * @returns {number} The total height of the requested rows.
         */
        public getRowsTotalHeight( sheet: Spreadsheet, startIndex: number, endIndex: number ): number
        {
            var width = 0;

            if ( startIndex < 0 ) startIndex = 0;

            if ( endIndex < startIndex )
            {
                for ( var i = startIndex; i >= 0 && i >= endIndex; --i )
                {
                    width += sheet.rows[i].height;
                }
            }
            else
            {
                for ( var i = startIndex; i < sheet.rows.length && i <= endIndex; i++ )
                {
                    width += sheet.rows[i].height;
                }
            }

            return width;
        }

        /**
         * Resolves a selector string into an array of html elements. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         */
        private _resolveElement( selector: string ): Array<Element>
        {
            var htmlElements: Array<Element> = [];
            
            if ( selector.indexOf( '#' ) == 0 )
            {
                var htmlElement = document.getElementById( selector );
                
                htmlElements.push( htmlElement );
            }
            else if ( selector.indexOf( '.' ) == 0 )
            {
                var elements = document.getElementsByClassName( selector );

                for ( var i = 0; i < elements.length; i++ )
                {
                    htmlElements.push( elements[i] );
                }
            }
            else
            {
                var elements = document.getElementsByTagName( selector );
                
                for ( var i = 0; i < elements.length; i++ )
                {
                    htmlElements.push( elements[i] );
                }
            }

            return htmlElements;
        }
    }

    class WorkbookOptions
    {
        public debug: Boolean;
        public scrollColumnBufferCount: number;
        public scrollRowBufferCount: number;

        constructor()
        {
            this.debug = false;
            this.scrollColumnBufferCount = 1;
            this.scrollRowBufferCount = 1;
        }
    }

    export class Workbook
    {
        private _prefix: string = "bspread";
        private _container: JQuery;
        private _marquee: Marquee;
        private _toolsElement: JQuery;
        private _sheets: Array<Spreadsheet>;
        private _options: WorkbookOptions;
        private _keyHandler: InputHandler;

        constructor( selector: string, options: WorkbookOptions )
        {
            var defaults = new WorkbookOptions();

            this._options = $.extend( {}, defaults, options );
            this._container = $( selector );
            
            this._container.css( { position: "relative" });

            this._sheets = [];

            this._toolsElement = $( "<div class=\"" + this._prefix + "-tools\" style=\"position: absolute; top: 2px; right: 2px; bottom: 2px; left: 2px; pointer-events: none;\"></div>" );
            this._container.append( this._toolsElement );

            this._marquee = new Marquee( this );
            
            this._sheets.push( new Spreadsheet( this, 0, options ) ); // TEMP

            this._keyHandler = new InputHandler( this );
            window.addEventListener( "resize", _helpers.proxy( this._onResize, this ) );
        }

        private _onResize(): void
        {
            this._marquee.recalculatePosition();
        }

        /**
         * Writes a message to the console log.
         * @param message The message to be written to the log.
         */
        public _log( message: any )
        {
            if ( this._options.debug )
            {
                console.log( message );
            }
        }

        /**
         * Gets the main container for the spreadsheets.
         */
        get options(): WorkbookOptions
        {
            return this._options;
        }

        /**
         * Gets the main container for the spreadsheets.
         */
        get container()
        {
            return this._container;
        }

        /**
         * Gets the class prefix for the spreadsheets.
         */
        get prefix(): string
        {
            return this._prefix;
        }

        /**
         * Gets the marquee.
         */
        get marquee(): Marquee
        {
            return this._marquee;
        }

        /**
         * Gets the currently selected sheet.
         */
        get selectedSheet(): Spreadsheet
        {
            return this._sheets[0]; // TEMP
        }

        /**
         * Gets the html container for the tools.
         */
        get toolsContainer(): JQuery
        {
            return this._toolsElement;
        }
    }

    export class Spreadsheet
    {
        private _workbook: Workbook;
        private _options: Object;
        private _$sheet: JQuery;
        private _$columnHeaders: JQuery;
        private _$sheetBody: JQuery;        
        private _isUpdating = false;
        private _columns: ObservableArray<Column>;
        private _rows: ObservableArray<Row>;
        private _dataSource: ObservableArray<ObservableDataItem>;
        private _cells: Array<Array<Cell>>;
        private _index: number;

        private _bodyDimensions: Point;

        private _isTabMode: Boolean;
        private _tabModeStartIndex: number;
        private _currentCell: Cell;

        constructor( workbook: Workbook, index: number, options: Object )
        {
            var defaults = {

            };

            this._workbook = workbook;
            this._index = index;
            this._options = options;

            this._isTabMode = false;
            
            this._columns = new ObservableArray<Column>();
            this._rows = new ObservableArray<Row>();
            this._dataSource = new ObservableArray<ObservableDataItem>();
            this._cells = [];

            //this.columns.addedItem.register( this.columnAdded );
            //this.columns.arrayChanged.register( this.columnsChanged );

            this._$sheet = $( "<div class=\"" + this._workbook.prefix + "-sheet\" style=\"margin: 2px;\"></div>" );

            this._$columnHeaders = $( "<div class=\"" + this._workbook.prefix + "-column-headers\"></div>" );
            this._$sheetBody = $( "<div class=\"" + this._workbook.prefix + "-sheet-body\"></div>" );

            this._$sheet.append( this._$columnHeaders );
            this._$sheet.append( this._$sheetBody );

            this._$sheet.insertBefore( this._workbook.toolsContainer );

            this._isUpdating = true;

            var keys = ["title", "col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", "col10",
                        "col11", "col12", "col13", "col14", "col15", "col16", "col17", "col18", "col19", "col20",
                        "col21", "col22", "col23", "col24", "col25", "col26", "col27", "col28", "col29"];

            for ( var i = 0; i < keys.length; i++ )
            {
                var column = new Column();
                column.index = i;
                column._key = keys[i];

                this._columns.push( column );
            }

            var data: any[] = [];

            for ( var i = 0; i < 122; i++ )
            {
                data.push( {
                    title: "Row: " + ( i + 1 ),
                    col1: Math.round( Math.random() * 10000 ),
                    col2: Math.round( Math.random() * 10000 ),
                    col3: Math.round( Math.random() * 10000 ),
                    col4: Math.round( Math.random() * 10000 ),
                    col5: Math.round( Math.random() * 10000 ),
                    col6: Math.round( Math.random() * 10000 ),
                    col7: Math.round( Math.random() * 10000 ),
                    col8: Math.round( Math.random() * 10000 ),
                    col9: Math.round( Math.random() * 10000 ),
                    col10: Math.round( Math.random() * 10000 ),
                    col11: Math.round( Math.random() * 10000 ),
                    col12: Math.round( Math.random() * 10000 ),
                    col13: Math.round( Math.random() * 10000 ),
                    col14: Math.round( Math.random() * 10000 ),
                    col15: Math.round( Math.random() * 10000 ),
                    col16: Math.round( Math.random() * 10000 ),
                    col17: Math.round( Math.random() * 10000 ),
                    col18: Math.round( Math.random() * 10000 ),
                    col19: Math.round( Math.random() * 10000 ),
                    col20: Math.round( Math.random() * 10000 ),
                    col21: Math.round( Math.random() * 10000 ),
                    col22: Math.round( Math.random() * 10000 ),
                    col23: Math.round( Math.random() * 10000 ),
                    col24: Math.round( Math.random() * 10000 ),
                    col25: Math.round( Math.random() * 10000 ),
                    col26: Math.round( Math.random() * 10000 ),
                    col27: Math.round( Math.random() * 10000 ),
                    col28: Math.round( Math.random() * 10000 ),
                    col29: Math.round( Math.random() * 10000 )
                });
            }

            this.dataSource = data;
            
            this._createRowData();

            this._$sheet[0].addEventListener( "scroll", _helpers.proxy( this._onScroll, this ) );

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

            this._drawHeaders();
            this._drawBody();

            //this._recalculateVisibleCells();
        };


        public _tabToNextCell()
        {
            if ( this._isTabMode === false || ( this._isTabMode === true && this._currentCell.columnIndex < this._tabModeStartIndex ) )
            {
                this._isTabMode = true;
                this._tabModeStartIndex = this._currentCell.columnIndex;
            }

            var nextCell = this._currentCell.row.cells[this._currentCell.columnIndex + 1];

            if ( !nextCell )
            {
                var nextRow = this._rows[this._currentCell.row.index + 1];

                if ( nextRow )
                {
                    nextCell = nextRow.cells[0];
                }
            }

            if ( nextCell )
            {
                this._selectCell( nextCell, false );
            }
        }

        public _tabToPreviousCell()
        {
            var previousCell = this._currentCell.row.cells[this._currentCell.columnIndex - 1];

            if ( !previousCell )
            {
                var previousRow = this._rows[this._currentCell.row.index - 1];

                if ( previousRow )
                {
                    previousCell = previousRow.cells[ previousRow.cells.length - 1 ];
                }
            }

            if ( previousCell )
            {
                this._selectCell( previousCell, false );
            }
        }

        public _enterToNextRow()
        {
            var colIndex: number;
            if ( this._isTabMode )
            {
                colIndex = this._tabModeStartIndex;
            }
            else
            {
                colIndex = this._currentCell.columnIndex;
            }

            var nextRow = this._rows[this._currentCell.rowIndex + 1];

            if ( nextRow )
            {
                this._selectCell( nextRow.cells[colIndex], false );
            }
        }

        public _selectCellInDirection( direction: Point )
        {

            var row = this._rows[this._currentCell.rowIndex + direction.y];
            var column = this._columns[this._currentCell.columnIndex + direction.x];

            if ( row === undefined || column === undefined )
            {
                return;
            }

            this._selectCell( this._cells[row.index][column.index], true );
        }

        public selectCell( cell: Cell )
        {
            this._selectCell( cell, true );
        }

        private _selectCell( cell: Cell, resetTab: boolean )
        {
            if ( resetTab )
            {
                this._isTabMode = false;
            }

            this._currentCell = cell;

            var topOffset = parseInt( this._$sheetBody.get( 0 ).style.top );

            var right = cell.column.position + cell.column.width;
            var bottom = topOffset + cell.row.position + cell.row.height;

            var bodyRight = this.sheetContainer.scrollLeft + this.sheetContainer.clientWidth;
            var bodyBottom = this.sheetContainer.scrollTop + this.sheetContainer.clientHeight;

            var jumpForwardRow = _helpers.getRowsTotalHeight( this, cell.rowIndex + 1, cell.rowIndex + this._workbook.options.scrollRowBufferCount );
            var jumpBackwardRow = _helpers.getRowsTotalHeight( this, cell.rowIndex - 1, cell.rowIndex - this._workbook.options.scrollRowBufferCount );
            var jumpForwardColumn = _helpers.getColumnsTotalWidth( this, cell.columnIndex + 1, cell.columnIndex + this._workbook.options.scrollColumnBufferCount );
            var jumpBackwardColumn = _helpers.getColumnsTotalWidth( this, cell.columnIndex - 1, cell.columnIndex - this._workbook.options.scrollColumnBufferCount );
            
            if ( bottom + jumpForwardRow > bodyBottom )
            {
                var difference = bottom - bodyBottom + jumpForwardRow;

                this.sheetContainer.scrollTop += difference;
            }
            else if ( cell.row.position + topOffset < this.sheetContainer.scrollTop + jumpBackwardRow )
            {
                var difference = this.sheetContainer.scrollTop - ( cell.row.position + topOffset ) + jumpBackwardRow;

                this.sheetContainer.scrollTop -= difference;
            }

            if ( right + jumpForwardColumn > bodyRight )
            {
                var difference = right - bodyRight + jumpForwardColumn;

                this.sheetContainer.scrollLeft += difference;
            }
            else if ( cell.column.position < this.sheetContainer.scrollLeft + jumpBackwardColumn )
            {
                var difference = this.sheetContainer.scrollLeft - cell.column.position + jumpBackwardColumn;

                this.sheetContainer.scrollLeft -= difference;
            }

            this._workbook.marquee.selectCells( cell.rowIndex, cell.columnIndex, cell.rowIndex, cell.columnIndex );
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

        /**
         * Regenerates the cell data for the spreadsheet.
         */
        private _createCellData()
        {
            this._cells = [];

            for ( var i: number = 0; i < this._columns.length; i++ )
            {
                this._columns[i]._clearCells();
            }

            for ( var i: number = 0; i < this._dataSource.length; i++ )
            {
                this._cells[i] = [];
                for ( var j: number = 0; j < this._columns.length; j++ )
                {
                    var cell = new Cell( this._dataSource[i][this._columns[j]._key], this, this._rows[i], this.columns[j] );

                    this._cells[i][j] = cell;
                    this._columns[j]._addCell( cell );
                }

                this._rows[i]._setCells( this._cells[i] );
            }
        }

        /**
         * Regenerates the rows and cell data for the spreadsheet.
         */
        private _createRowData()
        {
            this._rows = new ObservableArray<Row>();

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
                $cell.addClass( this._workbook.prefix + "-column-header" );
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
            return $( "<div class=\"" + this._workbook.prefix + "-cell\" style=\"position: absolute; top: " + pos.y + "px; left: " + pos.x + "px; overflow: hidden; width: 100px;\">" + content + "</div>" );
        };

        private _onResize(): void
        {
            
        }

        private _recalculateVisibleCells(): void
        {
            var scrollTop = this.sheetContainer.scrollTop;
            var scrollBottom = scrollTop + this.sheetContainer.clientHeight;

            var scrollLeft = this.sheetContainer.scrollLeft;
            var scrollRight = scrollLeft + this.sheetContainer.clientWidth;

            this._workbook._log( scrollTop );
            this._workbook._log( scrollBottom );

            for ( var i = 0; i < this._rows.length; i++ )
            {
                var isNotVisible = ( scrollTop >= this._rows[i].bottom || scrollBottom <= this._rows[i].position );
                
                this._rows[i].isCurrentlyVisible = !isNotVisible;
            }

            for ( var i = 0; i < this._columns.length; i++ )
            {
                var isNotVisible = ( scrollLeft >= this._columns[i].right || scrollRight <= this._columns[i].position );
                
                this._columns[i].isCurrentlyVisible = !isNotVisible;
            }

            for ( var x = 0; x < this._cells.length; x++ )
            {
                for ( var y = 0; y < this._cells.length; y++ )
                {
                    var cell = this._cells[y][x];
                    var isVisible = cell.column.isCurrentlyVisible && cell.row.isCurrentlyVisible;
                    
                    cell.element.style.display = isVisible ? "block" : "none";
                }
            }
        }

        private _onScroll(): void
        {
            //this._recalculateVisibleCells();
            this._workbook.marquee.recalculatePosition();
        }

        get sheetContainer(): HTMLElement
        {
            return this._$sheet.get( 0 );
        }

        get bodyContainer(): JQuery
        {
            return this._$sheetBody;
        }

        get bodyDimensions(): Point
        {
            return this._bodyDimensions;
        }

        get workbook(): Workbook
        {
            return this._workbook;
        }

        get index(): number
        {
            return this._index;
        }

        /**
         * Gets the columns associated with the spreadsheet.
         */
        get columns(): ObservableArray<Column>
        {
            return this._columns;
        }

        /**
         * Gets the rows associated with the spreadsheet.
         */
        get rows(): ObservableArray<Row>
        {
            return this._rows;
        }

        /**
         * Gets the cells associated with the spreadsheet.
         */
        get cells(): Array<Array<Cell>>
        {
            return this._cells;
        }

        /**
         * Gets the data source for the sheet.
         */
        get dataSource(): ObservableArray<ObservableDataItem> | Array<any>
        {
            return this._dataSource;
        }
        /**
         * Sets the data source for the sheet.
         */
        set dataSource( newSource: ObservableArray<ObservableDataItem> | Array<any> )
        {
            if ( _helpers.isArray( newSource ) )
            {
                this._dataSource = this._createObservableDataSource( newSource );
            }
            else
            {
                this._dataSource = newSource as ObservableArray<ObservableDataItem>;
            }
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

        /**
         * Holds the cells associated with the row/column.
         */
        protected _cells: Array<Cell>;


        private _isCurrentlyVisible: boolean;

        constructor()
        {
            this._index = 0;
            this._position = 0;

            this._cells = [];
        }

        /**
         * Adds a cell the the list of cells that are managed by the row/column.
         * @param cell
         */
        public _addCell( cell: Cell )
        {
            this._cells.push( cell );
        }

        /**
         * Empties the list of cells that are managed by the row/column for the purposes of rebuilding.
         * @param cell
         */
        public _clearCells()
        {
            this._cells = [];
        }

        /**
         * Gets the index of the row/column.
         */
        get index(): number
        {
            return this._index;
        }
        /**
         * Sets the index of the row/column.
         */
        set index( val: number )
        {
            this._index = val;
        }

        /**
         * Gets the cells managed by the row/column.
         */
        get cells(): Array<Cell>
        {
            return this._cells;
        }

        /**
         * Gets the position of the row/column.
         */
        get position(): number
        {
            return this._position;
        }

        get isCurrentlyVisible(): boolean
        {
            return this._isCurrentlyVisible;
        }
        set isCurrentlyVisible( val: boolean )
        {
            this._isCurrentlyVisible = val;
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

        get right(): number
        {
            return this._position + this._width;
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
         * Sets the cells associated with the row.
         * @param cells
         */
        public _setCells( cells: Array<Cell> )
        {
            this._cells = cells;
        }
        
        /**
         * Gets the height of the row.
         */
        get height(): number
        {
            return this._height;
        }

        get bottom(): number
        {
            return this._position + this._height;
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
        /**
         * Holds the value of the cell.
         */
        private _value: string | number;

        /**
         * The html element associated with this cell.
         */
        private _element: HTMLElement;

        /**
         * The sheet this cell is associated with.
         */
        private _sheet: Spreadsheet;

        /**
         * The row this cell is in.
         */
        private _row: Row;

        /**
         * The column this cell is in.
         */
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
            var newElement = $( "<div class=\"" + this._sheet.workbook.prefix + "-cell " + this._sheet.workbook.prefix + "-row\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>" );

            if ( this._row.index % 2 == 1 )
            {
                newElement.addClass( this._sheet.workbook.prefix + "-alt-row" );
            }

            if ( this._element && this._element.parentElement )
            {
                console.log( "trigger redraw" );
            }
            
            this._element = newElement.get( 0 );
            this._element.addEventListener( "click", _helpers.proxy( this._cellClicked, this ), true );
        }

        private _cellClicked( e: MouseEvent )
        {
            this._sheet.selectCell( this );
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
        get element(): HTMLElement
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
         * @returns {number} The new length of the array.
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
                this._defineObservableProperty( idx );
            }
        }

        /**
         * Defines a property on the observable that allows the item to be edited and raise events.
         * @param idx The index of the property/
         */
        private _defineObservableProperty( idx: string )
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
            });
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
        private _workbook: Workbook;

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
         * @param {Workbook} workbook The left position of the rectangle.
         * @param {any} options The top position of the rectangle.
         */
        constructor( workbook: Workbook, options?: any )
        {
            var defaults = {
                borderWidth: 2,
                borderColor: "#00f"
            };
            this._options = $.extend( {}, defaults, options );

            this._workbook = workbook;
            this._isVisible = false;

            this._element = document.createElement( "div" );
            this._element.classList.add( this._workbook.prefix + "-marquee" );
            this._element.style.position = "absolute";
            this._element.style.borderWidth = this._options.borderWidth + "px";
            this._element.style.borderColor = this._options.borderColor;
            this._element.style.borderStyle = "solid";
            this._element.style.display = "none";

            this._workbook.toolsContainer.append( $( this._element ) );
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

            this._startCell = this._workbook.selectedSheet.cells[startRow][startColumn];
            this._endCell = this._workbook.selectedSheet.cells[endRow][endColumn];
            
            this.recalculatePosition();
        }

        /**
         * Recalculates the position of the marquee.
         */
        public recalculatePosition()
        {
            if ( this._startCell == undefined ) return;

            var spacing = this._options.borderWidth / 2;

            var topOffset = parseInt( this._workbook.selectedSheet.bodyContainer.get( 0 ).style.top );

            var top = topOffset + this._startCell.row.position - spacing - 1 - this._workbook.selectedSheet.sheetContainer.scrollTop;
            var left = this._startCell.column.position - spacing - 1 - this._workbook.selectedSheet.sheetContainer.scrollLeft;
            var right = this._endCell.column.position + this._endCell.column.width - spacing - 1;
            var bottom = topOffset + this._endCell.row.position + this._endCell.row.height - spacing - 1;

            var bodyTop = this._workbook.selectedSheet.bodyDimensions.y;
            var bodyLeft = this._workbook.selectedSheet.bodyDimensions.x;

            var clientWidth = this._workbook.selectedSheet.sheetContainer.clientWidth;
            var clientHeight = this._workbook.selectedSheet.sheetContainer.clientHeight;
            
            var rowHeight = 0, columnWidth = 0;
            for ( var i = this._startCell.rowIndex; i <= this._endCell.rowIndex; i++ )
            {
                rowHeight += this._workbook.selectedSheet.rows[i].height;
            }
            for ( var i = this._startCell.columnIndex; i <= this._endCell.columnIndex; i++ )
            {
                columnWidth += this._workbook.selectedSheet.columns[i].width;
            }

            var bodyRight = this._workbook.selectedSheet.sheetContainer.scrollLeft + clientWidth;
            var bodyBottom = this._workbook.selectedSheet.sheetContainer.scrollTop + clientHeight;
            
            if ( this._startCell.row.position + bodyTop < this._workbook.selectedSheet.sheetContainer.scrollTop )
            {
                var difference = this._startCell.row.position + bodyTop - this._workbook.selectedSheet.sheetContainer.scrollTop;
                rowHeight += difference;
                top = -spacing - 1;
            }
            else if ( bottom > bodyBottom )
            {
                var difference = bottom - bodyBottom;
                rowHeight -= difference;
            }

            if ( this._startCell.column.position + bodyLeft < this._workbook.selectedSheet.sheetContainer.scrollLeft )
            {
                var difference = this._startCell.column.position + bodyLeft - this._workbook.selectedSheet.sheetContainer.scrollLeft;
                columnWidth += difference;
                left = -spacing - 1;
            }
            else if ( right > bodyRight )
            {
                var difference = right - bodyRight;
                columnWidth -= difference;
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
     * The standard keyboard event handler.
     */
    class InputHandler
    {
        /**
         * Holds the associated workbook.
         */
        private _workbook: Workbook;

        /**
         * Holds whether or not the shift key is currently pressed.
         */
        private _isShiftDown: Boolean;

        /**
         * Creates a new input handler for the provided workbook.
         * @param workbook
         */
        constructor( workbook: Workbook )
        {
            this._workbook = workbook;
            this._isShiftDown = false;

            this._workbook.selectedSheet.sheetContainer.addEventListener( "keyup", _helpers.proxy( this._onScrollKeyUp, this ) );
            window.addEventListener( "keydown", _helpers.proxy( this._onKeyDown, this ) );
            window.addEventListener( "keyup", _helpers.proxy( this._onKeyUp, this ) );
        }

        /**
         * Handles when a key is pushed down.
         * @param e The keyboard event.
         */
        private _onKeyDown( e: KeyboardEvent )
        {
            this._isShiftDown = e.shiftKey;
            var keyCode = e.keyCode;

            this._workbook._log( e );

            switch ( keyCode )
            {
                case keys.enter:
                    this._workbook.selectedSheet._enterToNextRow();
                    break;

                case keys.tab:
                    if ( this._isShiftDown )
                    {
                        this._workbook.selectedSheet._tabToPreviousCell();
                    }
                    else
                    {
                        this._workbook.selectedSheet._tabToNextCell();
                    }

                    this._cancelEvent( e );

                    break;

                case keys.upArrow:
                    this._workbook.selectedSheet._selectCellInDirection( new Point( 0, -1 ) );
                    this._cancelEvent( e );
                    break;

                case keys.rightArrow:
                    this._workbook.selectedSheet._selectCellInDirection( new Point( 1, 0 ) );
                    this._cancelEvent( e );
                    break;

                case keys.downArrow:
                    this._workbook.selectedSheet._selectCellInDirection( new Point( 0, 1 ) );
                    this._cancelEvent( e );
                    break;

                case keys.leftArrow:
                    this._workbook.selectedSheet._selectCellInDirection( new Point( -1, 0 ) );
                    this._cancelEvent( e );
                    break;
            }
        }

        /**
         * Handles when a key is lifted up.
         * @param e The keyboard event.
         */
        private _onKeyUp( e: KeyboardEvent )
        {
            this._isShiftDown = e.shiftKey;
        }

        /**
         * Handles when a key is lifted up inside the scroll container of the spreadsheet.
         * @param e The keyboard event.
         */
        private _onScrollKeyUp( e: KeyboardEvent )
        {
            var keyCode = e.keyCode;
            
            switch ( keyCode )
            {
                // Prevent browser default actions.
                case keys.tab:
                case keys.upArrow:
                case keys.rightArrow:
                case keys.downArrow:
                case keys.leftArrow:
                    this._preventDefault( e );
                    return false;
            }
        }


        //private _cellClicked( e: MouseEvent )
        //{
        //    this._workbook.selectedSheet.selectCell( this );
        //}

        /**
         * Cancels the key event by stopping bubbling and preventing default.
         * @param e {KeyboardEvent} The keyboard event to cancel.
         */
        private _cancelEvent( e: KeyboardEvent)
        {
            e.cancelBubble = true;
            this._preventDefault( e );
        }

        private _preventDefault( e: KeyboardEvent )
        {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        }
    }

    /**
     * Holds a group of helper functions.
     */
    var _helpers = new Helpers();

    /**
     * Holds all the key codes for a keydown/keypress/keyup event.
     */
    var keys = {
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
    }
}