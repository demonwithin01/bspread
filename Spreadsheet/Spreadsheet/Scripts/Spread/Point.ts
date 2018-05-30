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
        public x: number;

        /**
         * Holds the y co-ordinate.
         */
        public y: number;

        /**
         * Creates a new point object.
         * @param x {number} The x co-ordinate of the point.
         * @param y {number} The y co-ordinate of the point.
         */
        constructor( x: number, y: number )
        {
            this.x = x;
            this.y = y;
        }
    }
}