var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CSheet;
(function (CSheet) {
    /**
     * An array base object used to aid in creating the observable array object.
     */
    var ArrayBase = (function () {
        /**
         * Creates a new array object.
         */
        function ArrayBase() {
            this.length = 0;
            Array.apply(this, arguments);
            return new Array();
        }
        /**
         * Returns the last element of the array, removing it in the procecss.
         */
        ArrayBase.prototype.pop = function () {
            return "";
        };
        /**
         * Pushes a new value into the array.
         * @returns {number} The new length of the array.
         */
        ArrayBase.prototype.push = function (val) {
            return 0;
        };
        return ArrayBase;
    }());
    ArrayBase.prototype = new Array();
    /**
     * An observable array that will automatically raise changes when the collection is changed.
     */
    var ObservableArray = (function (_super) {
        __extends(ObservableArray, _super);
        /**
         * Creates a new observable array.
         */
        function ObservableArray() {
            var _this = _super.call(this) || this;
            _this._isUpdating = false;
            _this.onCollectionChanged = new CSheet.CSheetEvent();
            return _this;
        }
        /**
         * Pushes a new value into the array.
         *
         * @param item {any} The object to be added to the array.
         * @returns {number} The new length of the array.
         */
        ObservableArray.prototype.push = function (val) {
            var args = new Array();
            var newLength = this.length;
            for (var i = 0; i < arguments.length; i++) {
                newLength = _super.prototype.push.call(this, arguments[i]);
            }
            return newLength;
        };
        /**
         * Pops the last value from the array.
         */
        ObservableArray.prototype.pop = function () {
            var item = _super.prototype.pop.call(this);
            // raise pop event
            return item;
        };
        return ObservableArray;
    }(ArrayBase));
    CSheet.ObservableArray = ObservableArray;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=ObservableArray.js.map