var CSheet;
(function (CSheet) {
    /**
     * Holds all the key codes for a keydown/keypress/keyup event.
     */
    var keys = {
        "backspace": 8,
        "tab": 9,
        "enter": 13,
        "shift": 16,
        "ctrl": 17,
        "alt": 18,
        "pauseBreak": 19,
        "capsLock": 20,
        "escape": 27,
        "pageUp": 33,
        "pageDown": 34,
        "end": 35,
        "home": 36,
        "leftArrow": 37,
        "upArrow": 38,
        "rightArrow": 39,
        "downArrow": 40,
        "insert": 45,
        "delete": 46,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "a": 65,
        "b": 66,
        "c": 67,
        "d": 68,
        "e": 69,
        "f": 70,
        "g": 71,
        "h": 72,
        "i": 73,
        "j": 74,
        "k": 75,
        "l": 76,
        "m": 77,
        "n": 78,
        "o": 79,
        "p": 80,
        "q": 81,
        "r": 82,
        "s": 83,
        "t": 84,
        "u": 85,
        "v": 86,
        "w": 87,
        "x": 88,
        "y": 89,
        "z": 90,
        "leftWindowKey": 91,
        "rightWindowKey": 92,
        "selectKey": 93,
        "numpad0": 96,
        "numpad1": 97,
        "numpad2": 98,
        "numpad3": 99,
        "numpad4": 100,
        "numpad5": 101,
        "numpad6": 102,
        "numpad7": 103,
        "numpad8": 104,
        "numpad9": 105,
        "multiply": 106,
        "add": 107,
        "subtract": 109,
        "decimalPoint": 110,
        "divide": 111,
        "f1": 112,
        "f2": 113,
        "f3": 114,
        "f4": 115,
        "f5": 116,
        "f6": 117,
        "f7": 118,
        "f8": 119,
        "f9": 120,
        "f10": 121,
        "f11": 122,
        "f12": 123,
        "numLock": 144,
        "scrollLock": 145,
        "semiColon": 186,
        "equalSign": 187,
        "comma": 188,
        "dash": 189,
        "period": 190,
        "forwardSlash": 191,
        "graveAccent": 192,
        "openBracket": 219,
        "backSlash": 220,
        "closeBracket": 221,
        "singleQuote": 222
    };
    /**
     * The standard keyboard event handler.
     */
    var InputHandler = (function () {
        /**
         * Creates a new input handler for the provided workbook.
         * @param workbook
         */
        function InputHandler(workbook) {
            this._workbook = workbook;
            this._isShiftDown = false;
            this._workbook.selectedSheet.sheetContainer.addEventListener("keyup", CSheet.helpers.proxy(this._onScrollKeyUp, this));
            window.addEventListener("keydown", CSheet.helpers.proxy(this._onKeyDown, this));
            window.addEventListener("keyup", CSheet.helpers.proxy(this._onKeyUp, this));
        }
        /**
         * Handles when a key is pushed down.
         * @param e The keyboard event.
         */
        InputHandler.prototype._onKeyDown = function (e) {
            this._isShiftDown = e.shiftKey;
            var keyCode = e.keyCode;
            this._workbook._log(e);
            switch (keyCode) {
                case keys.enter:
                    this._workbook.selectedSheet._enterToNextRow();
                    break;
                case keys.tab:
                    if (this._isShiftDown) {
                        this._workbook.selectedSheet._tabToPreviousCell();
                    }
                    else {
                        this._workbook.selectedSheet._tabToNextCell();
                    }
                    this._cancelEvent(e);
                    break;
                case keys.upArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new CSheet.Point(0, -1));
                    this._cancelEvent(e);
                    break;
                case keys.rightArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new CSheet.Point(1, 0));
                    this._cancelEvent(e);
                    break;
                case keys.downArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new CSheet.Point(0, 1));
                    this._cancelEvent(e);
                    break;
                case keys.leftArrow:
                    this._workbook.selectedSheet._selectCellInDirection(new CSheet.Point(-1, 0));
                    this._cancelEvent(e);
                    break;
            }
        };
        /**
         * Handles when a key is lifted up.
         * @param e The keyboard event.
         */
        InputHandler.prototype._onKeyUp = function (e) {
            this._isShiftDown = e.shiftKey;
        };
        /**
         * Handles when a key is lifted up inside the scroll container of the spreadsheet.
         * @param e The keyboard event.
         */
        InputHandler.prototype._onScrollKeyUp = function (e) {
            var keyCode = e.keyCode;
            switch (keyCode) {
                // Prevent browser default actions.
                case keys.tab:
                case keys.upArrow:
                case keys.rightArrow:
                case keys.downArrow:
                case keys.leftArrow:
                    this._preventDefault(e);
                    return false;
            }
        };
        //private _cellClicked( e: MouseEvent )
        //{
        //    this._workbook.selectedSheet.selectCell( this );
        //}
        /**
         * Cancels the key event by stopping bubbling and preventing default.
         * @param e {KeyboardEvent} The keyboard event to cancel.
         */
        InputHandler.prototype._cancelEvent = function (e) {
            e.cancelBubble = true;
            this._preventDefault(e);
        };
        InputHandler.prototype._preventDefault = function (e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        };
        return InputHandler;
    }());
    CSheet.InputHandler = InputHandler;
})(CSheet || (CSheet = {}));
//# sourceMappingURL=InputHandler.js.map