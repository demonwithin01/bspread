module CSheet
{
    class ScrollbarValues
    {

        public barDimensions: Rect;

        public backgroundDimensions: Rect;
        
        public pos: number;

        public offset: number;

        public size: number;

        public backgroundSize: number;

        public isVisible: boolean;

        constructor( width: number, height: number, padding: number )
        {
            this.barDimensions = new Rect( 0, 0, width - ( padding * 2 ), height - ( padding * 2 ) );
            this.backgroundDimensions = new Rect( 0, 0, width, height );

            this.pos = 0;
            this.offset = 0;
            this.size = 100;
            this.backgroundSize = 100;
            this.isVisible = false;
        }

        get renderPos(): number
        {
            return ( this.pos + this.offset );
        }
    }

    export class Scrollbar
    {
        /**
         * The spreadsheet that the scrollars will be attached to.
         */
        private _sheet: Spreadsheet;

        /**
         * The current values/settings of the horizontal scrollbar.
         */
        private _horizontalBarSettings: ScrollbarValues;

        /**
         * The current values/settings of the vertical scrollbar.
         */
        private _verticalBarSettings: ScrollbarValues;

        private _padding: number;

        private _barSize: number;

        private _corner: Rect;

        /**
         * The x position of the horizontal scrollbar.
         */
        private _xPos: number;

        /**
         * The y position of the vertical scrollbar.
         */
        private _yPos: number;

        /**
         * The current height of the horizontal bar.
         */
        private _horizontalBarHeight: number;

        /**
         * The current width of the vertical bar.
         */
        private _verticalBarWidth: number;
        
        /**
         * Creates a new scrollbar for the provided spreadsheet.
         * @param sheet The spreadsheet that the scrollbars will be attached to.
         */
        constructor( sheet: Spreadsheet )
        {
            this._sheet = sheet;

            this._padding = 4;
            this._barSize = 20;

            this._horizontalBarSettings = new ScrollbarValues( 0, this._barSize, this._padding );
            this._verticalBarSettings = new ScrollbarValues( this._barSize, 0, this._padding );

            this._horizontalBarHeight = 20;
            this._verticalBarWidth = 20;

            let that = this;

            this._sheet.totalWidthChanged.register( function ( width )
            {
                let containerDimensions = window.getComputedStyle( that._sheet.workbook.container[0] );

                let containerWidth = helpers.forceToNumber( containerDimensions.width );

                that._horizontalBarSettings.isVisible = ( containerWidth < width );
            } );

            this._sheet.totalHeightChanged.register( function ( height )
            {
                let containerDimensions = window.getComputedStyle( that._sheet.workbook.container[0] );

                let containerHeight = helpers.forceToNumber( containerDimensions.height );

                that._verticalBarSettings.isVisible = ( containerHeight < height );
            } );
        }

        /**
         * Renders the scrollbars.
         * @param canvas The canvas to render the scrollbars to.
         * @param context The canvas context to render the scrollbars to.
         */
        public render( canvas: HTMLCanvasElement, context: CanvasRenderingContext2D ): void
        {
            this.recalculateDimensions( canvas.width, canvas.height );

            let usableHeight = canvas.height;
            let usableWidth = canvas.width;

            let padding = 4;

            if ( this._verticalBarSettings.isVisible && this._horizontalBarSettings.isVisible )
            {
                usableWidth -= this._verticalBarWidth;
                usableHeight -= this._horizontalBarHeight;
                
                helpers.renderRect( context, this._corner, "#ddd" );
            }

            if ( this._horizontalBarSettings.isVisible )
            {
                helpers.renderRect( context, this._horizontalBarSettings.backgroundDimensions, "#ddd" );
                helpers.renderRect( context, this._horizontalBarSettings.barDimensions, "#f53" );
            }

            if ( this._verticalBarSettings.isVisible )
            {
                helpers.renderRect( context, this._verticalBarSettings.backgroundDimensions, "#ddd" );
                helpers.renderRect( context, this._verticalBarSettings.barDimensions, "#f53" );
            }
        }

        /**
         * Recalculates the dimensions of the scrollbars for rendering.
         * @param canvasWidth The width of the canvas that the scrollbars will be rendered to.
         * @param canvasHeight The height of the canvas that the scrollbars will be rendered to.
         */
        private recalculateDimensions( canvasWidth: number, canvasHeight: number )
        {
            let renderOffset = 0.5;
            
            let height = canvasHeight;
            let width = canvasWidth;
            
            if ( this._verticalBarSettings.isVisible && this._horizontalBarSettings.isVisible )
            {
                width -= this._verticalBarSettings.backgroundDimensions.width;
                height -= this._horizontalBarSettings.backgroundDimensions.height;
            }

            this._verticalBarSettings.backgroundDimensions.height = height + renderOffset;
            this._horizontalBarSettings.backgroundDimensions.width = width + renderOffset;

            height -= ( this._padding * 2 );
            width -= ( this._padding * 2 );
            
            let widthPercentage = width / this._sheet.totalCellsWidth;
            let barWidth = Math.max( 20, width * widthPercentage );
            
            let heightPercentage = height / this._sheet.totalCellsHeight;
            let barHeight = Math.max( 20, height * heightPercentage );

            this._verticalBarSettings.barDimensions.height = barHeight + ( 0.5 - ( this._padding * 2 ) );
            this._horizontalBarSettings.barDimensions.width = barWidth + ( 0.5 - ( this._padding * 2 ) );
            
            this._verticalBarSettings.barDimensions.y = this._padding - 0.5;
            this._verticalBarSettings.backgroundDimensions.x = canvasWidth - this._verticalBarSettings.backgroundDimensions.width;
            this._verticalBarSettings.barDimensions.x = this._verticalBarSettings.backgroundDimensions.x + this._padding - 0.5;

            this._horizontalBarSettings.barDimensions.x = this._padding - 0.5;
            this._horizontalBarSettings.backgroundDimensions.y = canvasHeight - this._horizontalBarSettings.backgroundDimensions.height;
            this._horizontalBarSettings.barDimensions.y = this._horizontalBarSettings.backgroundDimensions.y + this._padding - 0.5;

            this._corner = new Rect( canvasWidth - this._barSize, canvasHeight - this._barSize, this._barSize, this._barSize );
        }

        get horizontalBarHeight(): number
        {
            return this._horizontalBarHeight;
        }

        get verticalBarWidth(): number
        {
            return this._verticalBarWidth;
        }
    }
}