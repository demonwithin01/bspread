/// <reference path="./../typings/jquery/jquery.d.ts" />

module CSheet
{
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
                    col1: Math.round( Math.random() * 10000 ) + 0.23572,
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

            this._$sheet[0].addEventListener( "scroll", helpers.proxy( this._onScroll, this ) );

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

            var jumpForwardRow = helpers.getRowsTotalHeight( this, cell.rowIndex + 1, cell.rowIndex + this._workbook.options.scrollRowBufferCount );
            var jumpBackwardRow = helpers.getRowsTotalHeight( this, cell.rowIndex - 1, cell.rowIndex - this._workbook.options.scrollRowBufferCount );
            var jumpForwardColumn = helpers.getColumnsTotalWidth( this, cell.columnIndex + 1, cell.columnIndex + this._workbook.options.scrollColumnBufferCount );
            var jumpBackwardColumn = helpers.getColumnsTotalWidth( this, cell.columnIndex - 1, cell.columnIndex - this._workbook.options.scrollColumnBufferCount );
            
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
            if ( helpers.isArray( newSource ) )
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
        public onDataItemChange: CSheetEvent;

        /**
         * Creates a new observable data item.
         * @param {any} dataItem The data item to base this obvservable off.
         * @param {Spreadsheet} sheet The sheet that this data item is being created for.
         */
        constructor( dataItem: any, sheet: Spreadsheet )
        {
            this._sheet = sheet;
            this.onDataItemChange = new CSheetEvent();
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
     * Holds a group of helper functions.
     */
    export let helpers = new Helpers();

}