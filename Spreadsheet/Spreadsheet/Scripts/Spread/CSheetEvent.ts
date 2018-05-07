module CSheet
{
    /**
     * Defines the CSheet event type.
     */
    export class CSheetEvent
    {
        /**
         * Holds the list of event handlers.
         */
        private _handlers: Array<Function>;

        constructor()
        {
            this._handlers = new Array();
        }

        /**
         * Raises the event handler.
         * @param sender The object raising the event.
         * @param args The arguments attached to the event.
         */
        public raise( sender: any, args: any )
        {
            for ( var i = 0; i < this._handlers.length; i++ )
            {
                this._handlers[i].call( sender, args );
            }
        }

        /**
         * Registers a handler function for the event.
         * @param fn The function to be raised with the event.
         */
        public register( fn: Function )
        {
            if ( typeof ( fn ) !== "function" )
            {
                console.error( "Must be a function!" );
                return;
            }

            if ( this._handlers.indexOf( fn ) < 0 )
            {
                this._handlers.push( fn );
            }
        }
    }
}