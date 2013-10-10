/**
 * Created with PyCharm.
 * User: marcinra
 * Date: 10/3/13
 * Time: 11:39 AM
 * To change this template use File | Settings | File Templates.
 */
var geocache = {
    ajax_done: function(data){
    },
    ajax_fail: function(data){
        alert('ajax fail' + data);
    },
    ajax_send: function(data,ajax_params,slug){

        if(ajax_params === undefined) {
            ajax_param = {};
        }

        var url = server_addr+"/geocache/"+slug;
        console.log('ajax_send to:'+url);

        var kwargs = $.extend(
            ajax_params,
            {
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.withCredentials = true;
                }
            }
        );
        $.ajax(kwargs).done(function(data){
            geocache.ajax_done(data);
        }).fail(function(data, dwa, trzy){
            geocache.ajax_fail(data);
        });
    },
    ajax_get_markers: function(slug, ajax_params, callback_done){
        if(ajax_params === undefined) {
            ajax_param = {};
        }

        var url = server_addr+"/geocache/list/"+slug;
        console.log('ajax_get_markers:'+url);
        var kwargs = $.extend(
            ajax_params,
            {
                url: url,
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                format: "json"
            }
        );

        $.ajax(kwargs).done(function(data){
            callback_done(data);
        }).fail(function(data){
            geocache.ajax_fail(data);
        });
    }
}
