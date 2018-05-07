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
            this._canvas.width = width;
            this._canvas.height = height;
            this._context.clearRect(0, 0, width, height);
            this._context.fillStyle = "#ddd";
            this._context.fillRect(0, 0, width, height);
            //this._context.
        };
        return Renderer;
    }());
    CSheet.Renderer = Renderer;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Renderer.js.map