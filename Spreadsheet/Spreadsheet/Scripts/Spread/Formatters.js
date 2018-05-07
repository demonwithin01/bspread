var CSheet;
(function (CSheet) {
    var Formatter = (function () {
        function Formatter() {
        }
        Formatter.prototype.formatNumber = function (value, format) {
            if (value === null || value === undefined) {
                return value;
            }
            var isNumber = CSheet.helpers.isNumber(value);
            if (isNumber === false) {
                return value;
            }
            var type = format[0].toUpperCase();
            var precision = Number(format.substr(1));
            var formattedValue = "";
            var prefix = "";
            var suffix = "";
            switch (type) {
                case "C":
                    prefix = "$";
                case "N":
                    var noDp = Math.round(Number(value));
                    var dp = Number(value) - noDp;
                    var numAsString = noDp + "";
                    var index = 0;
                    formattedValue = numAsString.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    //for ( let i = numAsString.length - 1; i >= 0; i-- )
                    //{
                    //    ++index;
                    //    formattedValue = ( i > 0 && index % 3 == 0 ? "," : "" ) + numAsString[i] + formattedValue;
                    //}
                    //dp = helpers.round( dp, precision );
                    //;
                    formattedValue += (dp.toFixed(precision) + "").substr(1);
                    break;
            }
            return (prefix + formattedValue + suffix);
        };
        return Formatter;
    }());
    CSheet.formatter = new Formatter();
})(CSheet || (CSheet = {}));
//# sourceMappingURL=Formatters.js.map