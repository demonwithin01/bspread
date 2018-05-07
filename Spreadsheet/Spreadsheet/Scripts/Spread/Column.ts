module CSheet
{
    export class Column
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
         * Holds the width of the column.
         */
        private _width: number;

        public _key: string;

        constructor()
        {
            this._index = 0;
            this._position = 0;

            this._cells = [];

            this._width = 100;
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
}