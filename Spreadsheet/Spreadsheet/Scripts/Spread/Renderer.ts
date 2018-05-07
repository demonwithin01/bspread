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
            
            this._canvas.width = width;
            this._canvas.height = height;

            this._context.clearRect( 0, 0, width, height );
            this._context.fillStyle = "#ddd";
            this._context.fillRect( 0, 0, width, height );
            //this._context.
        }
    }
}