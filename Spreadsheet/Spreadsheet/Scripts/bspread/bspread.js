var __extends = this && this.__extends || function ( n, t )
{
    function r()
    {
        this.constructor = n
    }
    for ( var i in t ) t.hasOwnProperty( i ) && ( n[i] = t[i] );
    n.prototype = t === null ? Object.create( t ) : ( r.prototype = t.prototype, new r )
}

var bspreadsheet = new function ()
{
    this.bspread = ( function ()
    {
        var _options;
        var _$columnHeaders
        var _$sheetBody;
        var _prefix = "bspread";
        var _isUpdating = false;

        function bspread( selector, options )
        {
            _options = options;

            this.container = $( selector );
            this.columns = new bspreadsheet.ObservableArray();
            this.rows = new bspreadsheet.ObservableArray();

            this.columns.addedItem.register( columnAdded );
            this.columns.arrayChanged.register( columnsChanged );

            _$columnHeaders = $( "<div class=\"" + _prefix + "-column-headers\"></div>" );
            _$sheetBody = $( "<div class=\"" + _prefix + "-sheet-body\"></div>" );

            this.container.append( _$columnHeaders );
            this.container.append( _$sheetBody );

            _isUpdating = true;

            for ( var i = 0 ; i < 50; i++ )
            {
                var column = new bspreadsheet.Column();
                column.index = i;

                this.columns.push( column );
            }

            this.endUpdate();
        }

        bspread.prototype.getOptions = function ()
        {
            return _options;
        };

        bspread.prototype.beginUpdate = function ()
        {
            if ( _isUpdating )
            {
                console.error( "already updating" );

                return;
            }

            _isUpdating = true;
        };

        bspread.prototype.endUpdate = function ()
        {
            if ( _isUpdating )
            {
                _isUpdating = false;
                this.redraw();
            }
        };

        bspread.prototype.redraw = function ()
        {
            this.container.css( { display: "block", overflow: "scroll", width: "100%", height: "200px", position: "relative" } );

            drawHeaders.call( this );
            drawBody.call( this );
        };

        function columnsChanged( sender, column )
        {
            console.log( "Columns Changed" );
            if ( _isUpdating ) return;

        }

        function columnAdded( sender, column )
        {
            console.log( "Column Added" );
            if ( _isUpdating ) return;

        }

        function drawHeaders()
        {
            _$columnHeaders.empty().css( { position: "absolute", top: "0", left: "0", width: "100%" } );

            var currentPosition = 0;
            var height = 0;

            for ( var i = 0 ; i < this.columns.length ; i++ )
            {
                var $cell = createCell( { top: 0, left: currentPosition }, "Header: " + ( i + 1 ) );
                $cell.addClass( _prefix + "-column-header" );
                _$columnHeaders.append( $cell );

                this.columns[i].position = currentPosition;
                currentPosition += this.columns[i].width;

                var h = $cell.height();
                if ( h > height )
                {
                    height = h;
                }
            }

            _$columnHeaders.height( height );
        };

        function drawBody()
        {
            _$sheetBody.empty().css( { position: "absolute", top: _$columnHeaders.height(), left: "0", width: "100%" } );

            var currentPositionY = 0;

            for ( var i = 1 ; i <= 20 ; i++ )
            {
                var height = 0;
                var currentPositionX = 0;

                for ( var j = 0 ; j < this.columns.length ; j++ )
                {
                    var $cell = createCell( { top: currentPositionY, left: currentPositionX }, "Row: " + i + ", Column: " + ( j + 1 ) );
                    _$sheetBody.append( $cell );

                    currentPositionX += this.columns[i].width;

                    var h = $cell.height();

                    if ( h > height )
                    {
                        height = h;
                    }
                }

                currentPositionY += height;
            }

            _$sheetBody.height( currentPositionY );
        };

        function createCell( pos, content )
        {
            return $( "<div class=\"" + _prefix + "-cell\" style=\"position: absolute; top: " + pos.top + "px; left: " + pos.left + "px; overflow: hidden; width: 100px;\">" + content + "</div>" );
        };

        return bspread;
    } )();

    this.Column = ( function ()
    {
        function Column()
        {
            this.index = 0;
            this.position = 0;

            this.width = 100;
        }

        return Column;
    } )();

    this.Row = ( function ()
    {
        function Row()
        {
            this.index = 0;
            this.position = 0;

            this.height = 30;
        }

        return Row;
    } )();

    this.ObservableArray = ( function ()
    {
        //var _array;

        function ObservableArray()
        {
            //_array = new Array();
            
            this.addedItem = new bspreadsheet.Event();
            this.removedItem = new bspreadsheet.Event();
            this.arrayChanged = new bspreadsheet.Event();
        }

        ObservableArray.prototype = Array.prototype;

        ObservableArray.prototype.push = function ( item )
        {
            this.push( item );

            this.addedItem.raise( this, item );
            this.arrayChanged.raise( this, item );
        };

        ObservableArray.prototype.remove = function ( item )
        {
            //this = this.splice( this.indexOf( item ), 1 );

            this.removedItem.raise( this, item );
            this.arrayChanged.raise( this, item );
        };

        //Object.defineProperty( ObservableArray.prototype, "length", {
        //    get: function ()
        //    {
        //        return this.length;
        //    },
        //    enumerable: !0
        //} );

        return ObservableArray;
    } )();

    this.Observable = ( function ()
    {
        var _value;

        function Observable( value )
        {
            _value = value;
        }

        return Observable;
    } )();

    this.Event = ( function ()
    {
        var _handlers;

        function Event()
        {
            _handlers = new Array();
        }

        Event.prototype.raise = function ( sender, args )
        {
            for ( var i = 0 ; i < _handlers.length; i++ )
            {
                _handlers[i].call( sender, args );
            }
        };

        Event.prototype.register = function ( fn )
        {
            if ( typeof ( fn ) !== "function" )
            {
                console.error( "Must be a function!" );
                return;
            }

            if ( _handlers.indexOf( fn ) < 0 )
            {
                _handlers.push( fn );
            }
        };

        return Event;
    } )();
};



var arrayBase = function ()
{
    function n()
    {
        this.length = 0;
        Array.apply( this, arguments )
    }
    return n.prototype.pop = function ()
    {
        return null
    }, n.prototype.push = function ()
    {
        for ( var t = [], n = 0; n < arguments.length; n++ ) t[+n] = arguments[n];
        return 0
    }, n.prototype.splice = function ()
    {
        return null
    }, n.prototype.slice = function ()
    {
        return null
    }, n.prototype.indexOf = function ()
    {
        return -1
    }, n.prototype.sort = function ()
    {
        return null
    }, n
}();

t.ArrayBase = arrayBase;
arrayBase.prototype = Array.prototype;
var r = function ( i )
{
    function r( t )
    {
        if ( i.call( this ), this._updating = 0, this.collectionChanged = new n.Event, t )
        {
            t = n.asArray( t );
            this._updating++;
            for ( var r = 0; r < t.length; r++ ) this.push( t[r] );
            this._updating--
        }
    }
    return __extends( r, i ), r.prototype.push = function ()
    {
        for ( var f, r, n = [], u = 0; u < arguments.length; u++ ) n[+u] = arguments[u];
        for ( f = this.length, r = 0; n && r < n.length; r++ ) f = i.prototype.push.call( this, n[r] ), this._updating || this._raiseCollectionChanged( t.NotifyCollectionChangedAction.Add, n[r], f - 1 );
        return f
    }, r.prototype.pop = function ()
    {
        var n = i.prototype.pop.call( this );
        return this._raiseCollectionChanged( t.NotifyCollectionChangedAction.Remove, n, this.length ), n
    }, r.prototype.splice = function ( n, r, u )
    {
        var f;
        return r && u ? ( f = i.prototype.splice.call( this, n, r, u ), r == 1 ? this._raiseCollectionChanged( t.NotifyCollectionChangedAction.Change, u, n ) : this._raiseCollectionChanged(), f ) : u ? ( f = i.prototype.splice.call( this, n, 0, u ), this._raiseCollectionChanged( t.NotifyCollectionChangedAction.Add, u, n ), f ) : ( f = i.prototype.splice.call( this, n, r ), r == 1 ? this._raiseCollectionChanged( t.NotifyCollectionChangedAction.Remove, f[0], n ) : this._raiseCollectionChanged(), f )
    }, r.prototype.slice = function ( n, t )
    {
        return i.prototype.slice.call( this, n, t )
    }, r.prototype.indexOf = function ( n, t )
    {
        return i.prototype.indexOf.call( this, n, t )
    }, r.prototype.sort = function ( n )
    {
        var t = i.prototype.sort.call( this, n );
        return this._raiseCollectionChanged(), t
    }, r.prototype.insert = function ( n, t )
    {
        this.splice( n, 0, t )
    }, r.prototype.remove = function ( n )
    {
        var t = this.indexOf( n );
        return t > -1 ? ( this.removeAt( t ), !0 ) : !1
    }, r.prototype.removeAt = function ( n )
    {
        this.splice( n, 1 )
    }, r.prototype.setAt = function ( n, t )
    {
        n > this.length && ( this.length = n );
        this.splice( n, 1, t )
    }, r.prototype.clear = function ()
    {
        this.length !== 0 && ( this.splice( 0, this.length ), this._raiseCollectionChanged() )
    }, r.prototype.beginUpdate = function ()
    {
        this._updating++
    }, r.prototype.endUpdate = function ()
    {
        this._updating > 0 && ( this._updating--, this._updating == 0 && this._raiseCollectionChanged() )
    }, Object.defineProperty( r.prototype, "isUpdating", {
        get: function ()
        {
            return this._updating > 0
        },
        enumerable: !0,
        configurable: !0
    } ), r.prototype.deferUpdate = function ( n )
    {
        try
        {
            this.beginUpdate();
            n()
        } finally
        {
            this.endUpdate()
        }
    }, r.prototype.implementsInterface = function ( n )
    {
        return n == 'INotifyCollectionChanged'
    }, r.prototype.onCollectionChanged = function ( n )
    {
        n === void 0 && ( n = t.NotifyCollectionChangedEventArgs.reset );
        this.isUpdating || this.collectionChanged.raise( this, n )
    }, r.prototype._raiseCollectionChanged = function ( n, i, r )
    {
        if ( n === void 0 && ( n = t.NotifyCollectionChangedAction.Reset ), !this.isUpdating )
        {
            var u = new t.NotifyCollectionChangedEventArgs( n, i, r );
            this.onCollectionChanged( u )
        }
    }, r
}( arrayBase );
t.ObservableArray = r