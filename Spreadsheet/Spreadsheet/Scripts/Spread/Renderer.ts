module CSheet
{
    interface RenderOptions
    {
        lineColor: string
    }

    export class Renderer
    {
        private _workbook: Workbook;
        private _container: HTMLElement;
        private _canvas: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;
        private _renderOptions: RenderOptions;

        constructor( workbook: Workbook, renderOptions: RenderOptions )
        {
            this._workbook = workbook;
            this._canvas = document.getElementById( "cSpread" ) as HTMLCanvasElement;
            this._container = this._canvas.parentElement;
            this._context = this._canvas.getContext( "2d" );
        }

        public render( sheet: Spreadsheet ): void
        {
            let containerDimensions = window.getComputedStyle( this._container );
            
            let width = helpers.forceToNumber( containerDimensions.width );
            let height = helpers.forceToNumber( containerDimensions.height );

            let cellsTotalWidth = sheet.totalCellsWidth;
            let cellsTotalHeight = sheet.totalCellsHeight;
            
            this._canvas.width = width;
            this._canvas.height = height;

            this._context.clearRect( 0, 0, width, height );
            this._context.fillStyle = "#fff";
            this._context.fillRect( 0, 0, width, height );
            //this._context.

            this._context.strokeStyle = "#666";
            this._context.lineWidth = 1;

            let columnLines = sheet.columnGridLines;
            let rowLines = sheet.rowGridLines;
            
            for ( let i = 0; i < columnLines.length; i++ )
            {
                let x = columnLines[i];

                this._context.beginPath();
                this._context.moveTo( x + 0.5, 0 );
                this._context.lineTo( x + 0.5, cellsTotalHeight );
                this._context.stroke();
            }

            for ( let i = 0; i < rowLines.length; i++ )
            {
                let y = rowLines[i];

                this._context.beginPath();
                this._context.moveTo( 0, y + 0.5 );
                this._context.lineTo( cellsTotalWidth, y + 0.5 );
                this._context.stroke();
            }

            this._context.beginPath();
            this._context.moveTo( 0.5, 0.5 );
            this._context.lineTo( width - 0.5, 0.5 );
            this._context.lineTo( width - 0.5, height - 0.5 );
            this._context.lineTo( 0.5, height - 0.5 );
            this._context.lineTo( 0.5, 0 );
            this._context.stroke();

            sheet.scrollbar.render( this._canvas, this._context );
        }
    }
}