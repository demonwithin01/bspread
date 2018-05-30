module CSheet
{
    /**
     * The position and dimensions of a rectangle.
     */
    export class Rect
    {
        public x: number;
        public y: number;
        public width: number;
        public height: number;

        /**
         * Creates a new Rect object with the specified position and dimensions.
         * @param {number} x The left position of the rectangle.
         * @param {number} y The top position of the rectangle.
         * @param {number} width The width of the rectangle.
         * @param {number} height The height of the rectangle.
         */
        constructor( x: number, y: number, width: number, height: number )
        {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /**
         * Gets the top of the rectangle.
         */
        get top(): number
        {
            return this.y;
        }

        /**
         * Gets the left of the rectangle.
         */
        get left(): number
        {
            return this.x;
        }

        /**
         * Gets the bottom of the rectangle.
         */
        get bottom(): number
        {
            return ( this.y + this.height );
        }

        /**
         * Gets the right of the rectangle.
         */
        get right(): number
        {
            return ( this.x + this.width );
        }
    }
}