module CSheet
{
    /**
     * Responsible for managing the marquee that is displayed showing the selected cells.
     */
    export class Marquee
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
            let defaults = {
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

            let spacing = this._options.borderWidth / 2;

            let topOffset = parseInt( this._workbook.selectedSheet.bodyContainer.get( 0 ).style.top );

            let top = topOffset + this._startCell.row.position - spacing - 1 - this._workbook.selectedSheet.sheetContainer.scrollTop;
            let left = this._startCell.column.position - spacing - 1 - this._workbook.selectedSheet.sheetContainer.scrollLeft;
            let right = this._endCell.column.position + this._endCell.column.width - spacing - 1;
            let bottom = topOffset + this._endCell.row.position + this._endCell.row.height - spacing - 1;

            let bodyTop = this._workbook.selectedSheet.bodyDimensions.y;
            let bodyLeft = this._workbook.selectedSheet.bodyDimensions.x;

            let clientWidth = this._workbook.selectedSheet.sheetContainer.clientWidth;
            let clientHeight = this._workbook.selectedSheet.sheetContainer.clientHeight;
            
            let rowHeight = 0, columnWidth = 0;
            for ( let i = this._startCell.rowIndex; i <= this._endCell.rowIndex; i++ )
            {
                rowHeight += this._workbook.selectedSheet.rows[i].height;
            }
            for ( let i = this._startCell.columnIndex; i <= this._endCell.columnIndex; i++ )
            {
                columnWidth += this._workbook.selectedSheet.columns[i].width;
            }

            let bodyRight = this._workbook.selectedSheet.sheetContainer.scrollLeft + clientWidth;
            let bodyBottom = this._workbook.selectedSheet.sheetContainer.scrollTop + clientHeight;
            
            if ( this._startCell.row.position + bodyTop < this._workbook.selectedSheet.sheetContainer.scrollTop )
            {
                let difference = this._startCell.row.position + bodyTop - this._workbook.selectedSheet.sheetContainer.scrollTop;
                rowHeight += difference;
                top = -spacing - 1;
            }
            else if ( bottom > bodyBottom )
            {
                let difference = bottom - bodyBottom;
                rowHeight -= difference;
            }

            if ( this._startCell.column.position + bodyLeft < this._workbook.selectedSheet.sheetContainer.scrollLeft )
            {
                let difference = this._startCell.column.position + bodyLeft - this._workbook.selectedSheet.sheetContainer.scrollLeft;
                columnWidth += difference;
                left = -spacing - 1;
            }
            else if ( right > bodyRight )
            {
                let difference = right - bodyRight;
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
}