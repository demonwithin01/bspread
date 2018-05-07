/// <reference path="./../typings/jquery/jquery.d.ts" />
var CSheet;
(function (CSheet) {
    var WorkbookOptions = (function () {
        function WorkbookOptions() {
            this.debug = false;
            this.scrollColumnBufferCount = 1;
            this.scrollRowBufferCount = 1;
        }
        return WorkbookOptions;
    }());
    var Workbook = (function () {
        function Workbook(selector, options) {
            this._prefix = "bspread";
            var defaults = new WorkbookOptions();
            this._options = $.extend({}, defaults, options);
            this._container = $(selector);
            this._container.css({ position: "relative" });
            var defaultRenderOptions = {
                lineColor: "#ccc"
            };
            var renderOptions = $.extend({}, defaultRenderOptions);
            this._renderer = new CSheet.Renderer(this, renderOptions);
            this._sheets = [];
            this._toolsElement = $("<div class=\"" + this._prefix + "-tools\" style=\"position: absolute; top: 2px; right: 2px; bottom: 2px; left: 2px; pointer-events: none;\"></div>");
            this._container.append(this._toolsElement);
            this._marquee = new CSheet.Marquee(this);
            this._sheets.push(new CSheet.Spreadsheet(this, 0, options)); // TEMP
            this._keyHandler = new CSheet.InputHandler(this);
            window.addEventListener("resize", CSheet.helpers.proxy(this._onResize, this));
            this._renderer.render(this._sheets[0]);
        }
        Workbook.prototype._onResize = function () {
            this._marquee.recalculatePosition();
        };
        /**
         * Writes a message to the console log.
         * @param message The message to be written to the log.
         */
        Workbook.prototype._log = function (message) {
            if (this._options.debug) {
                console.log(message);
            }
        };
        Object.defineProperty(Workbook.prototype, "options", {
            /**
             * Gets the main container for the spreadsheets.
             */
            get: function () {
                return this._options;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "container", {
            /**
             * Gets the main container for the spreadsheets.
             */
            get: function () {
                return this._container;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "prefix", {
            /**
             * Gets the class prefix for the spreadsheets.
             */
            get: function () {
                return this._prefix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "marquee", {
            /**
             * Gets the marquee.
             */
            get: function () {
                return this._marquee;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "selectedSheet", {
            /**
             * Gets the currently selected sheet.
             */
            get: function () {
                return this._sheets[0]; // TEMP
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Workbook.prototype, "toolsContainer", {
            /**
             * Gets the html container for the tools.
             */
            get: function () {
                return this._toolsElement;
            },
            enumerable: true,
            configurable: true
        });
        return Workbook;
    }());
    CSheet.Workbook = Workbook;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Workbook.js.map