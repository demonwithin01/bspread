var CSheet;
(function (CSheet) {
    var ScrollbarValues = (function () {
        function ScrollbarValues(width, height, padding) {
            this.barDimensions = new CSheet.Rect(0, 0, width - (padding * 2), height - (padding * 2));
            this.backgroundDimensions = new CSheet.Rect(0, 0, width, height);
            this.pos = 0;
            this.offset = 0;
            this.size = 100;
            this.backgroundSize = 100;
            this.isVisible = false;
        }
        Object.defineProperty(ScrollbarValues.prototype, "renderPos", {
            get: function () {
                return (this.pos + this.offset);
            },
            enumerable: true,
            configurable: true
        });
        return ScrollbarValues;
    }());
    var Scrollbar = (function () {
        /**
         * Creates a new scrollbar for the provided spreadsheet.
         * @param sheet The spreadsheet that the scrollbars will be attached to.
         */
        function Scrollbar(sheet) {
            this._sheet = sheet;
            this._padding = 4;
            this._barSize = 20;
            this._horizontalBarSettings = new ScrollbarValues(0, this._barSize, this._padding);
            this._verticalBarSettings = new ScrollbarValues(this._barSize, 0, this._padding);
            this._horizontalBarHeight = 20;
            this._verticalBarWidth = 20;
            var that = this;
            this._sheet.totalWidthChanged.register(function (width) {
                var containerDimensions = window.getComputedStyle(that._sheet.workbook.container[0]);
                var containerWidth = CSheet.helpers.forceToNumber(containerDimensions.width);
                that._horizontalBarSettings.isVisible = (containerWidth < width);
            });
            this._sheet.totalHeightChanged.register(function (height) {
                var containerDimensions = window.getComputedStyle(that._sheet.workbook.container[0]);
                var containerHeight = CSheet.helpers.forceToNumber(containerDimensions.height);
                that._verticalBarSettings.isVisible = (containerHeight < height);
            });
        }
        /**
         * Renders the scrollbars.
         * @param canvas The canvas to render the scrollbars to.
         * @param context The canvas context to render the scrollbars to.
         */
        Scrollbar.prototype.render = function (canvas, context) {
            this.recalculateDimensions(canvas.width, canvas.height);
            var usableHeight = canvas.height;
            var usableWidth = canvas.width;
            var padding = 4;
            if (this._verticalBarSettings.isVisible && this._horizontalBarSettings.isVisible) {
                usableWidth -= this._verticalBarWidth;
                usableHeight -= this._horizontalBarHeight;
                CSheet.helpers.renderRect(context, this._corner, "#ddd");
            }
            if (this._horizontalBarSettings.isVisible) {
                CSheet.helpers.renderRect(context, this._horizontalBarSettings.backgroundDimensions, "#ddd");
                CSheet.helpers.renderRect(context, this._horizontalBarSettings.barDimensions, "#f53");
            }
            if (this._verticalBarSettings.isVisible) {
                CSheet.helpers.renderRect(context, this._verticalBarSettings.backgroundDimensions, "#ddd");
                CSheet.helpers.renderRect(context, this._verticalBarSettings.barDimensions, "#f53");
            }
        };
        /**
         * Recalculates the dimensions of the scrollbars for rendering.
         * @param canvasWidth The width of the canvas that the scrollbars will be rendered to.
         * @param canvasHeight The height of the canvas that the scrollbars will be rendered to.
         */
        Scrollbar.prototype.recalculateDimensions = function (canvasWidth, canvasHeight) {
            var renderOffset = 0.5;
            var height = canvasHeight;
            var width = canvasWidth;
            if (this._verticalBarSettings.isVisible && this._horizontalBarSettings.isVisible) {
                width -= this._verticalBarSettings.backgroundDimensions.width;
                height -= this._horizontalBarSettings.backgroundDimensions.height;
            }
            this._verticalBarSettings.backgroundDimensions.height = height + renderOffset;
            this._horizontalBarSettings.backgroundDimensions.width = width + renderOffset;
            height -= (this._padding * 2);
            width -= (this._padding * 2);
            var widthPercentage = width / this._sheet.totalCellsWidth;
            var barWidth = Math.max(20, width * widthPercentage);
            var heightPercentage = height / this._sheet.totalCellsHeight;
            var barHeight = Math.max(20, height * heightPercentage);
            this._verticalBarSettings.barDimensions.height = barHeight + (0.5 - (this._padding * 2));
            this._horizontalBarSettings.barDimensions.width = barWidth + (0.5 - (this._padding * 2));
            this._verticalBarSettings.barDimensions.y = this._padding - 0.5;
            this._verticalBarSettings.backgroundDimensions.x = canvasWidth - this._verticalBarSettings.backgroundDimensions.width;
            this._verticalBarSettings.barDimensions.x = this._verticalBarSettings.backgroundDimensions.x + this._padding - 0.5;
            this._horizontalBarSettings.barDimensions.x = this._padding - 0.5;
            this._horizontalBarSettings.backgroundDimensions.y = canvasHeight - this._horizontalBarSettings.backgroundDimensions.height;
            this._horizontalBarSettings.barDimensions.y = this._horizontalBarSettings.backgroundDimensions.y + this._padding - 0.5;
            this._corner = new CSheet.Rect(canvasWidth - this._barSize, canvasHeight - this._barSize, this._barSize, this._barSize);
        };
        Object.defineProperty(Scrollbar.prototype, "horizontalBarHeight", {
            get: function () {
                return this._horizontalBarHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scrollbar.prototype, "verticalBarWidth", {
            get: function () {
                return this._verticalBarWidth;
            },
            enumerable: true,
            configurable: true
        });
        return Scrollbar;
    }());
    CSheet.Scrollbar = Scrollbar;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Scrollbar.js.map