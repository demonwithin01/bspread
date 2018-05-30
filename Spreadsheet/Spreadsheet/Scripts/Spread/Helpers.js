var CSheet;
(function (CSheet) {
    /**
     * Holds a group of helper functions.
     */
    var Helpers = (function () {
        function Helpers() {
        }
        /**
         * Creates a proxy event handler.
         * @param callback The callback method to call.
         * @param self The object to call the callback against.
         */
        Helpers.prototype.proxy = function (callback, self) {
            return function (evt) {
                return callback.apply(self, [evt]);
            };
        };
        /**
         * Rounds a number to a set precision.
         * @param value The value to be rounded.
         * @param precision The precision to round the number to.
         */
        Helpers.prototype.round = function (value, precision) {
            var pow = Math.pow(10, precision);
            return Math.round(value * pow) / pow;
        };
        /**
         * Adds an event listener to the specified element.
         * @param element The element, elements, or selector for adding the event listener to.
         * @param type The event type to attach.
         * @param listener The callback/listener for the event.
         */
        Helpers.prototype.addEventListener = function (element, type, listener) {
            var htmlElement;
            if (typeof (element) === 'string') {
                var htmlElements = this._resolveElement(element);
                htmlElements.forEach(function (value) { value.addEventListener(type, listener); });
            }
            else if (this.isArray(element)) {
                var htmlElements = element;
                htmlElements.forEach(function (value) { value.addEventListener(type, listener); });
            }
            else {
                element.addEventListener(type, listener);
            }
        };
        /**
         * Determines whether or not the provided object is an array.
         * @param obj The object to be checked.
         */
        Helpers.prototype.isArray = function (obj) {
            return obj.constructor === Array;
        };
        /**
         * Determines whether or not the provided object is a number.
         * @param obj The object to be checked.
         */
        Helpers.prototype.isNumber = function (obj) {
            if (obj.constructor === Number) {
                return true;
            }
            return ((obj + "").match(/^\d*$|^\d*\.\d*$/g) !== null);
        };
        /**
         * Forces a string value to become a number by stripping all non-digit values.
         * @param value The value to be become a number.
         */
        Helpers.prototype.forceToNumber = function (value) {
            return parseFloat(value.replace(/[^\d\.]/g, ""));
        };
        /**
         * Simple foreach loop for arrays.
         * @param array The array to loop over.
         * @param callback The callback method for each item.
         */
        Helpers.prototype.forEach = function (array, callback) {
            if (!array)
                return;
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                callback.call(item, i, item);
            }
        };
        /**
         * Finds the element using the provided selector. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         * @returns {Element} The first element found using the provided selector.
         */
        Helpers.prototype.findElement = function (selector) {
            var elements = this._resolveElement(selector);
            if (elements.length == 0) {
                throw "Element not found using selector: '" + selector + "'";
            }
            return elements[0];
        };
        /**
         * Gets the total width of the columns for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the columns.
         * @param startIndex {number} The first index of the column to retrieve.
         * @param endIndex {number} The final index of the column to retrieve.
         * @returns {number} The total width of the requested columns.
         */
        Helpers.prototype.getColumnsTotalWidth = function (sheet, startIndex, endIndex) {
            var width = 0;
            if (startIndex < 0)
                startIndex = 0;
            if (endIndex < startIndex) {
                for (var i = startIndex; i >= 0 && i >= endIndex; --i) {
                    width += sheet.columns[i].width;
                }
            }
            else {
                for (var i = startIndex; i < sheet.columns.length && i <= endIndex; i++) {
                    width += sheet.columns[i].width;
                }
            }
            return width;
        };
        /**
         * Gets the total height of the rows for the indices specified.
         * @param sheet {Spreadsheet} The sheet to use to get the rows.
         * @param startIndex {number} The first index of the row to retrieve.
         * @param endIndex {number} The final index of the row to retrieve.
         * @returns {number} The total height of the requested rows.
         */
        Helpers.prototype.getRowsTotalHeight = function (sheet, startIndex, endIndex) {
            var width = 0;
            if (startIndex < 0)
                startIndex = 0;
            if (endIndex < startIndex) {
                for (var i = startIndex; i >= 0 && i >= endIndex; --i) {
                    width += sheet.rows[i].height;
                }
            }
            else {
                for (var i = startIndex; i < sheet.rows.length && i <= endIndex; i++) {
                    width += sheet.rows[i].height;
                }
            }
            return width;
        };
        Helpers.prototype.renderRect = function (context, rect, color) {
            context.fillStyle = color;
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };
        /**
         * Resolves a selector string into an array of html elements. Does not support advanced search methods such as descendents.
         * @param selector Supports tags, ids, and class selectors.
         */
        Helpers.prototype._resolveElement = function (selector) {
            var htmlElements = [];
            if (selector.indexOf('#') == 0) {
                var htmlElement = document.getElementById(selector);
                htmlElements.push(htmlElement);
            }
            else if (selector.indexOf('.') == 0) {
                var elementsByClass = document.getElementsByClassName(selector);
                for (var i = 0; i < elementsByClass.length; i++) {
                    htmlElements.push(elementsByClass[i]);
                }
            }
            else {
                var elementsByTag = document.getElementsByTagName(selector);
                for (var i = 0; i < elementsByTag.length; i++) {
                    htmlElements.push(elementsByTag[i]);
                }
            }
            return htmlElements;
        };
        return Helpers;
    }());
    CSheet.Helpers = Helpers;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Helpers.js.map