var CSheet;
(function (CSheet) {
    /**
     * Defines the CSheet event type.
     */
    var CSheetEvent = (function () {
        function CSheetEvent() {
            this._handlers = new Array();
        }
        /**
         * Raises the event handler.
         * @param sender The object raising the event.
         * @param args The arguments attached to the event.
         */
        CSheetEvent.prototype.raise = function (sender, args) {
            for (var i = 0; i < this._handlers.length; i++) {
                this._handlers[i].call(sender, args);
            }
        };
        /**
         * Registers a handler function for the event.
         * @param fn The function to be raised with the event.
         */
        CSheetEvent.prototype.register = function (fn) {
            if (typeof (fn) !== "function") {
                console.error("Must be a function!");
                return;
            }
            if (this._handlers.indexOf(fn) < 0) {
                this._handlers.push(fn);
            }
        };
        return CSheetEvent;
    }());
    CSheet.CSheetEvent = CSheetEvent;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=CSheetEvent.js.map