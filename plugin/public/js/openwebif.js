/*  OpenWebif JavaScript 
 *  2011 E2OpenPlugins
 *
 *  This file is open source software; you can redistribute it and/or modify  
 *    it under the terms of the GNU General Public License version 2 as      
 *              published by the Free Software Foundation.                  
 *
 *--------------------------------------------------------------------------*/

$.fx.speeds._default = 1000;
var loadspinner = "<div id='spinner' ><img src='../images/spinner.gif' alt='loading...' /></div>"
var mutestatus = 0;

$(function() {
	

	$( "#tvbutton" ).buttonset();
	

	$( "#dialog" ).dialog({
		autoOpen: false,
		show: "fade",
		hide: "explode",
		buttons: {
			"Ok": function() { 
				$(this).dialog("close");
			} 
		}
	});
	
	$('#tvbutton0').click(function(){
		$("#tvcontent").html(loadspinner).load("ajax/current");
	});
	$('#tvbutton1').click(function(){
		$("#tvcontent").html(loadspinner).load("ajax/bouquets");
	});
	$('#tvbutton2').click(function(){
		$("#tvcontent").html(loadspinner).load("ajax/providers");
	});
	$('#tvbutton3').click(function(){
		$("#tvcontent").load("ajax/satellites");
	});
	$('#tvbutton4').click(function(){
		$("#tvcontent").html(loadspinner).load("ajax/channels");
	});

	$('#radiobutton0').click(function(){
		$("#tvcontent").html(loadspinner).load("ajax/bouquets?stype=radio");
	});
	$('#radiobutton1').click(function(){
		$("#tvcontent").html(loadspinner).load("ajax/providers?stype=radio");
	});
	$('#radiobutton2').click(function(){
		$("#tvcontent").load("ajax/satellites?stype=radio");
	});
	$('#radiobutton3').click(function(){
		$("#tvcontent").html(loadspinner).load("ajax/channels?stype=radio");
	});	


	$('#volimage').click(function(){
		if (mutestatus == 0) {
			mutestatus = 1;
			$("#volimage").attr("src","/images/volume_mute.png");
		} else  {
			mutestatus = 0;
			$("#volimage").attr("src","/images/volume.png");
		}
		$.ajax("web/vol?set=mute")
	});
	
	getStatusInfo();
	setInterval("getStatusInfo()", 15000);
});

$(function() {
	$( "#slider" ).slider({
		
		range: "min",
		min: 0,
		max: 100,
		value: 40,
		slide: function( event, ui ) {
			$( "#amount" ).val( ui.value );
		},
		stop: function( event, ui ) {	
			if ( ui.value == 0) {
				$("#volimage").attr("src","/images/volume_mute.png");
			} else  {
				$("#volimage").attr("src","/images/volume.png");
			} 
			var url = "web/vol?set=set" + ui.value;
			var jqxhr = $.ajax( url )
			return false;
		}
	});
	$( "#amount" ).val( $( "#slider" ).slider( "value" ) );
});


(function($) {
    var defaults = {
        height: 500,
        width: 500,
        toolbar: false,
        scrollbars: false,
        status: false,
        resizable: false,
        left: 0,
        top: 0,
        center: true,
        createNew: true,
        location: false,
        menubar: false,
        onUnload: null
    };

    $.popupWindow = function(url, opts) {
        var options = $.extend({}, defaults, opts);
        if (options.center) {
            options.top = ((screen.height - options.height) / 2) - 50;
            options.left = (screen.width - options.width) / 2;
        }

        var params = [];
        params.push('location=' + (options.location ? 'yes' : 'no'));
        params.push('menubar=' + (options.menubar ? 'yes' : 'no'));
        params.push('toolbar=' + (options.toolbar ? 'yes' : 'no'));
        params.push('scrollbars=' + (options.scrollbars ? 'yes' : 'no'));
        params.push('status=' + (options.status ? 'yes' : 'no'));
        params.push('resizable=' + (options.resizable ? 'yes' : 'no'));
        params.push('height=' + options.height);
        params.push('width=' + options.width);
        params.push('left=' + options.left);
        params.push('top=' + options.top);

        var random = new Date().getTime();
        var name = options.createNew ? 'popup_window_' + random : 'popup_window';
        var win = window.open(url, name, params.join(','));

        if (options.onUnload && typeof options.onUnload === 'function') {
            var unloadInterval = setInterval(function() {
                if (!win || win.closed) {
                    clearInterval(unloadInterval);
                    options.onUnload();
                }
            }, 250);
        }

        if (win && win.focus) win.focus();

        return win;
    };
})(jQuery);


$(function() {
	$( ".epgsearch button:first" ).button({
            icons: {
                primary: "ui-icon-search"
            }
        })
});


function dialog_notyet(){
	$('#dialog').dialog('open');
	return false;
}

function load_tvcontent(url) {
	$("#tvcontent").load(url);
	return false;
}

function load_tvcontent_spin(url) {
	$("#tvcontent").html(loadspinner).load(url);
	return false;
}

function load_maincontent(url) {
	$("#content").load(url);
	return false;
}

function webapi_execute(url) {
	var jqxhr = $.ajax( url )
//    	.done(function() { alert(jqxhr.responseXml); })
	return false;
}

function toggle_chan_des(evId, sRef, idp) {
	var url = 'ajax/eventdescription?sref=' + escape(sRef) + '&idev=' + evId;
	var iddiv = "#" + idp;
	$(iddiv).load(url);
	$(iddiv).toggle('blind', '', '500');
	
}

function open_epg_pop(sRef) {
	var url = 'ajax/epgpop?sref=' + escape(sRef);
	$.popupWindow(url, {
		height: 500,
		width: 900,
		toolbar: false,
		scrollbars: true,
	});	
}

function open_epg_search_pop() {
	var spar = $("#epgSearch").val();
	var url = "ajax/epgpop?sstr=" + escape(spar);
	$.popupWindow(url, {
		height: 500,
		width: 900,
		toolbar: false,
		scrollbars: true,
	});
	$("#epgSearch").val("");
}

function deleteTimer(sRef, begin, end) {
	answer = confirm("Really delete this timer?");
	if (answer == true) {
		webapi_execute("/api/timerdelete?sRef=" + sRef + "&begin=" + begin + "&end=" + end);
		$('#'+begin+'-'+end).remove();
	}
}

function zapChannel(sRef, sname) {
	var url = 'api/zap?sRef=' + escape(sRef);
	$.getJSON(url, function(result){
		$("#osd").html('zap to: ' + sname);
		$("#osd_bottom").html(" ");
	});
}

function getStatusInfo() {
	$.getJSON('api/statusinfo')
	.success(function(statusinfo) {
		// Set Volume
		$("#slider").slider("value", statusinfo['volume']);
		$("#amount").val(statusinfo['volume']);
		
		// Set Mute Status
		if (statusinfo['muted'] == true) {
			mutestatus = 1;
			$("#volimage").attr("src","/images/volume_mute.png");
		} else {
			mutestatus = 0;
			$("#volimage").attr("src","/images/volume.png");
		}

		if (statusinfo['currservice_station']) {
			$("#osd").html("<span style='color:#EA7409;font-weight:bold;'>" + statusinfo['currservice_station'] + "</span>&nbsp;&nbsp;" + statusinfo['currservice_begin'] + " - " + statusinfo['currservice_end'] + "&nbsp;&nbsp;" + statusinfo['currservice_name']);
			$("#osd_bottom").html(statusinfo['currservice_description']);
		}
	})
	.error(function() {
		$("#osd, #osd_bottom").html("");
	});
}

function grabScreenshot(mode, width) {
	$('#screenshotspinner').show();
	$('#screenshotimage').hide();
	
	$('#screenshotimage').load(function(){
	  $('#screenshotspinner').hide();
	  $('#screenshotimage').show();
	});

	if (mode != "auto" && typeof screenshotMode != "undefined") {
		screenshotMode = mode;
	}
	
	if (mode == 'auto') {
		if (typeof screenshotMode != 'undefined') {
			mode = screenshotMode;
		} else {
			mode = 'all';
		}
	}

	if (typeof width == 'undefined') {
		width = 700;
	}
	
	timestamp = new Date().getTime()
	$('#screenshotimage').attr("src",'/grab?r=' + width + '&mode=' + mode + '&timestamp=' + timestamp);
}

function sendMessage() {
	var text = $('#messageText').val();
	var type = $('#messageType').val();
	var timeout = $('#messageTimeout').val();

	$.getJSON('api/message?text=' + text + '&type=' + type + '&timeout=' + timeout, function(result){
		$('#messageSentResponse').html(result['message']);
	});
}

function toggleMenu(name) {
	expander_id = "#leftmenu_expander_" + name
	container_id = "#leftmenu_container_" + name
	if ($(expander_id).hasClass("leftmenu_icon_collapse")) {
		$(expander_id).removeClass("leftmenu_icon_collapse");
		$(container_id).show('fast')
		webapi_execute("api/expandmenu?name=" + name)
	}
	else {
		$(expander_id).addClass("leftmenu_icon_collapse");
		$(container_id).hide('fast')
		webapi_execute("api/collapsemenu?name=" + name)
	}
}
