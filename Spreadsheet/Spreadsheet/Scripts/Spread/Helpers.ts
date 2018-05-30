module CSheet
{
    /**
     * Holds a group of helper functions.
     */
    export class Helpers
    {
        /**
         * Creates a proxy event handler.
         * @param callback The callback method to call.
         * @param self The object to call the callback against.
         */
        public proxy( callback: Function, self: Object ): EventListener
        {
            return function ( evt: Event ): void
            {
                return callback.apply( self, [ evt ] );
            };
        }

        /**
         * Rounds a number to a set precision.
         * @param value The value to be rounded.
         * @param precision The precision to round the number to.
         */
        public round( value: number, precision: number ): number
        {
            let pow = Math.pow( 10, precision );

            return Math.round( value * pow ) / pow;
        }

        /**
         * Adds an event listener to the specified element.
         * @param element The element, elements, or selector for adding the event listener to.
         * @param type The event type to attach.
         * @param listener The callback/listener for the event.
         */
        public addEventListener( element: Array<Element> | Element | string, type: string, listener: EventListener | EventListenerObject )
        {
            let htmlElement: Element;

            if ( typeof ( element ) === 'string' )
            {
                let htmlElements = this._resolveElement( element as string );

                htmlElements.forEach( function ( value ) { value.addEventListener( type, listener ); } );
            }
            else if ( this.isArray( element ) )
            {
                let htmlElements = element as Array<Element>;

                htmlElements.forEach( function ( value ) { value.addEventListener( type, listener ); });   
            }
            else
            {
                ( element as Element ).addEventListener( type, listener );
            }
        }

        /**
         * Determines whether or not the provided object is an array.
         * @param obj The object to be checked.
         */
        public isArray( obj: any )
        {
            return obj.constructor === Array;
        }

        /**
         * Determines whether or not the provided object is a number.
         * @param obj The object to be checked.
         */
        public isNumber( obj: any )
        {
            if ( obj.constructor === Number )
            {
                return true;
            }

            return ( ( obj + "" ).match( /^\d*$|^\d*\.\d*$/g ) !== null );
        }

        /**
         * Forces a string value to become a number by stripping all non-digit values.
         * @param value The value to be become a number.
         */
        public forceToNumber( value: string )
        {
            return parseFloat( value.replace( /[^\d\.]/g, "" ) );
        }

        /**
         * Simple foreach loop for arrays.
         * @param array The array to loop over.
         * @param callback The callback method for each item.
         */
        public forEach( array: Array<any>, callback: Function )
        {
            if ( !array ) return;

            for ( let i = 0; i < array.length; i++ )
            {
                let item = array[i];
                callback.call( item, i, item );
            }
        }

        /**
         * Finds the element using the provided selector. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         * @returns {Element} The first element found using the provided selector.
         */
        public findElement( selector: string ): Element
        {
            let elements = this._resolveElement( selector );

            if ( elements.length == 0 )
            {
                throw "Element not found using selector: '" + selector + "'";
            }

            return elements[0];
        }

        /**
         * Gets the total width of the columns for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the columns.
         * @param startIndex {number} The first index of the column to retrieve.
         * @param endIndex {number} The final index of the column to retrieve.
         * @returns {number} The total width of the requested columns.
         */
        public getColumnsTotalWidth( sheet: Spreadsheet, startIndex: number, endIndex: number ): number
        {
            let width = 0;

            if ( startIndex < 0 ) startIndex = 0;
            
            if ( endIndex < startIndex )
            {
                for ( let i = startIndex; i >= 0 && i >= endIndex; --i )
                {
                    width += sheet.columns[i].width;
                }
            }
            else
            {
                for ( let i = startIndex; i < sheet.columns.length && i <= endIndex; i++ )
                {
                    width += sheet.columns[i].width;
                }
            }

            return width;
        }

        /**
         * Gets the total height of the rows for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the rows.
         * @param startIndex {number} The first index of the row to retrieve.
         * @param endIndex {number} The final index of the row to retrieve.
         * @returns {number} The total height of the requested rows.
         */
        public getRowsTotalHeight( sheet: Spreadsheet, startIndex: number, endIndex: number ): number
        {
            let width = 0;

            if ( startIndex < 0 ) startIndex = 0;

            if ( endIndex < startIndex )
            {
                for ( let i = startIndex; i >= 0 && i >= endIndex; --i )
                {
                    width += sheet.rows[i].height;
                }
            }
            else
            {
                for ( let i = startIndex; i < sheet.rows.length && i <= endIndex; i++ )
                {
                    width += sheet.rows[i].height;
                }
            }

            return width;
        }

        public renderRect( context: CanvasRenderingContext2D, rect: Rect, color: string ): void
        {
            context.fillStyle = color;
            context.fillRect( rect.x, rect.y, rect.width, rect.height );
        }

        /**
         * Resolves a selector string into an array of html elements. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         */
        private _resolveElement( selector: string ): Array<Element>
        {
            let htmlElements: Array<Element> = [];
            
            if ( selector.indexOf( '#' ) == 0 )
            {
                let htmlElement = document.getElementById( selector );
                
                htmlElements.push( htmlElement );
            }
            else if ( selector.indexOf( '.' ) == 0 )
            {
                let elementsByClass = document.getElementsByClassName( selector );

                for ( let i = 0; i < elementsByClass.length; i++ )
                {
                    htmlElements.push( elementsByClass[i] );
                }
            }
            else
            {
                let elementsByTag = document.getElementsByTagName( selector );
                
                for ( let i = 0; i < elementsByTag.length; i++ )
                {
                    htmlElements.push( elementsByTag[i] );
                }
            }

            return htmlElements;
        }
    }
}