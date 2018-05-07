/// <reference path="./../typings/jquery/jquery.d.ts" />

module CSheet
{
    class WorkbookOptions
    {
        public debug: Boolean;
        public scrollColumnBufferCount: number;
        public scrollRowBufferCount: number;

        constructor()
        {
            this.debug = false;
            this.scrollColumnBufferCount = 1;
            this.scrollRowBufferCount = 1;
        }
    }

    export class Workbook
    {
        private _prefix: string = "bspread";
        private _container: JQuery;
        private _marquee: Marquee;
        private _toolsElement: JQuery;
        private _sheets: Array<Spreadsheet>;
        private _options: WorkbookOptions;
        private _keyHandler: InputHandler;
        private _renderer: Renderer;

        constructor( selector: string, options: WorkbookOptions )
        {
            let defaults = new WorkbookOptions();

            this._options = $.extend( {}, defaults, options );
            this._container = $( selector );
            
            this._container.css( { position: "relative" } );

            let defaultRenderOptions = {
                lineColor: "#ccc"
            };
            let renderOptions = $.extend( {}, defaultRenderOptions );

            this._renderer = new Renderer( this, renderOptions );

            this._sheets = [];

            this._toolsElement = $( "<div class=\"" + this._prefix + "-tools\" style=\"position: absolute; top: 2px; right: 2px; bottom: 2px; left: 2px; pointer-events: none;\"></div>" );
            this._container.append( this._toolsElement );

            this._marquee = new Marquee( this );
            
            this._sheets.push( new Spreadsheet( this, 0, options ) ); // TEMP

            this._keyHandler = new InputHandler( this );
            window.addEventListener( "resize", helpers.proxy( this._onResize, this ) );

            this._renderer.render( this._sheets[0] );
        }

        private _onResize(): void
        {
            this._marquee.recalculatePosition();
        }

        /**
         * Writes a message to the console log.
         * @param message The message to be written to the log.
         */
        public _log( message: any )
        {
            if ( this._options.debug )
            {
                console.log( message );
            }
        }

        /**
         * Gets the main container for the spreadsheets.
         */
        get options(): WorkbookOptions
        {
            return this._options;
        }

        /**
         * Gets the main container for the spreadsheets.
         */
        get container()
        {
            return this._container;
        }

        /**
         * Gets the class prefix for the spreadsheets.
         */
        get prefix(): string
        {
            return this._prefix;
        }

        /**
         * Gets the marquee.
         */
        get marquee(): Marquee
        {
            return this._marquee;
        }

        /**
         * Gets the currently selected sheet.
         */
        get selectedSheet(): Spreadsheet
        {
            return this._sheets[0]; // TEMP
        }

        /**
         * Gets the html container for the tools.
         */
        get toolsContainer(): JQuery
        {
            return this._toolsElement;
        }
    }
}