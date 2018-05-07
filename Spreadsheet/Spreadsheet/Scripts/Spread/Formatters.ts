module CSheet
{
    class Formatter
    {
        public formatNumber( value: any, format: string ) : string
        {
            if ( value === null || value === undefined )
            {
                return value;
            }

            let isNumber = helpers.isNumber( value );

            if ( isNumber === false )
            {
                return value;
            }

            let type = format[0].toUpperCase();
            let precision = Number( format.substr( 1 ) );
            let formattedValue = "";
            let prefix = "";
            let suffix = "";

            switch ( type )
            {
                case "C":
                    prefix = "$";
                case "N":
                    let noDp = Math.round( Number( value ) );
                    let dp = Number( value ) - noDp;
                    let numAsString = noDp + "";
                    let index = 0;

                    formattedValue = numAsString.replace( /(\d)(?=(\d{3})+(?!\d))/g, "$1," );

                    //for ( let i = numAsString.length - 1; i >= 0; i-- )
                    //{
                    //    ++index;
                    //    formattedValue = ( i > 0 && index % 3 == 0 ? "," : "" ) + numAsString[i] + formattedValue;
                    //}

                    //dp = helpers.round( dp, precision );
                    //;

                    formattedValue += ( dp.toFixed( precision ) + "" ).substr( 1 );

                    break;
            }

            return ( prefix + formattedValue + suffix );
        }


    }

    export let formatter = new Formatter();
}