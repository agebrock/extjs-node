

Ext.Loader.setConfig({
    enabled: true,
	paths: {
		'Ext':  extBasePath
    }
});


var window = {
    status:__defineSetter__("status", function(debugStatusMsg){
        console.log(debugStatusMsg);
    })
}

Ext.Error = {
    raise:function(msg){
        console.log("----------------ExtJS ERROR----------------");
        console.error(msg)
    }
}


Ext.callback = function(callback, scope, args, delay){
    if(Ext.isFunction(callback)){
        args = args || [];
        scope = scope || window;
        if (delay) {
            Ext.defer(callback, delay, scope, args);
        } else {
            callback.apply(scope, args);
        }
    }
};

