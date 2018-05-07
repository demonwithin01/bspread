module CSheet
{

    export class Row
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

        /**
         * Holds the height of the row.
         */
        private _height: number;

        public dataItem: any;

        constructor()
        {
            this._index = 0;
            this._position = 0;

            this._cells = [];

            this._height = 28;
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
        set position( val: number )
        {
            this._position = val;
        }

        get isCurrentlyVisible(): boolean
        {
            return this._isCurrentlyVisible;
        }
        set isCurrentlyVisible( val: boolean )
        {
            this._isCurrentlyVisible = val;
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

}