module CSheet
{
    export class Cell
    {
        /**
         * Holds the value of the cell.
         */
        private _value: string | number;

        /**
         * Holds the display value (for performance).
         */
        private _displayValue: string | number;

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
            if ( initialValue == null ) 
            {
                initialValue = undefined;
            }

            this.value = initialValue;

            this._sheet = sheet;
            this._row = row;
            this._column = column;

            this.recreateElement();
        }

        /**
         * Re-creates the cell element.
         */
        public recreateElement()
        {
            let newElement = $( "<div class=\"" + this._sheet.workbook.prefix + "-cell " + this._sheet.workbook.prefix + "-row\" style=\"position: absolute; top: " + this._row.position + "px; left: " + this._column.position + "px; overflow: hidden; width: " + this._column.width + "px; height: " + this._row.height + "px;\">" + this.displayValue + "</div>" );

            if ( this._row.index % 2 == 1 )
            {
                newElement.addClass( this._sheet.workbook.prefix + "-alt-row" );
            }

            if ( this._element && this._element.parentElement )
            {
                console.log( "trigger redraw" );
            }
            
            this._element = newElement.get( 0 );
            this._element.addEventListener( "click", helpers.proxy( this._cellClicked, this ), true );
        }

        /**
         * Event handler for when the cell is clicked.
         * @param e The mouse event for the cell.
         */
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

            this._displayValue = formatter.formatNumber( this._value, "C2" );
        }
        
        /**
         * Gets the cell display value of the value.
         */
        get displayValue()
        {
            return this._displayValue;
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
}