module CSheet
{
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
}