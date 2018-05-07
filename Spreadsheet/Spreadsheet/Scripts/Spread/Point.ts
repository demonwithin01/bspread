module CSheet
{
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
}