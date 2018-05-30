var CSheet;
(function (CSheet) {
    var Renderer = (function () {
        function Renderer(workbook, renderOptions) {
            this._workbook = workbook;
            this._canvas = document.getElementById("cSpread");
            this._container = this._canvas.parentElement;
            this._context = this._canvas.getContext("2d");
        }
        Renderer.prototype.render = function (sheet) {
            var containerDimensions = window.getComputedStyle(this._container);
            var width = CSheet.helpers.forceToNumber(containerDimensions.width);
            var height = CSheet.helpers.forceToNumber(containerDimensions.height);
            var cellsTotalWidth = sheet.totalCellsWidth;
            var cellsTotalHeight = sheet.totalCellsHeight;
            this._canvas.width = width;
            this._canvas.height = height;
            this._context.clearRect(0, 0, width, height);
            this._context.fillStyle = "#fff";
            this._context.fillRect(0, 0, width, height);
            //this._context.
            this._context.strokeStyle = "#666";
            this._context.lineWidth = 1;
            var columnLines = sheet.columnGridLines;
            var rowLines = sheet.rowGridLines;
            for (var i = 0; i < columnLines.length; i++) {
                var x = columnLines[i];
                this._context.beginPath();
                this._context.moveTo(x + 0.5, 0);
                this._context.lineTo(x + 0.5, cellsTotalHeight);
                this._context.stroke();
            }
            for (var i = 0; i < rowLines.length; i++) {
                var y = rowLines[i];
                this._context.beginPath();
                this._context.moveTo(0, y + 0.5);
                this._context.lineTo(cellsTotalWidth, y + 0.5);
                this._context.stroke();
            }
            this._context.beginPath();
            this._context.moveTo(0.5, 0.5);
            this._context.lineTo(width - 0.5, 0.5);
            this._context.lineTo(width - 0.5, height - 0.5);
            this._context.lineTo(0.5, height - 0.5);
            this._context.lineTo(0.5, 0);
            this._context.stroke();
            sheet.scrollbar.render(this._canvas, this._context);
        };
        return Renderer;
    }());
    CSheet.Renderer = Renderer;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Renderer.js.map