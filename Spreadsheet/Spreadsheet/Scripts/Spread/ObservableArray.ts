module CSheet
{
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
        public pop(): any
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
        private onCollectionChanged: CSheetEvent;

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
            this.onCollectionChanged = new CSheetEvent();
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
}