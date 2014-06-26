var categories = [];
categories[0]={name:"All", icon:"all.png"};
categories[1]={name:"Food", icon:"food.png"};
categories[2]={name:"Books", icon:"books.png"};
categories[3]={name:"Clothing", icon:"clothing.png"};
categories[4]={name:"Newspapers", icon:"newspapers.png"};
categories[5]={name:"Furnitures", icon:"furnitures.png"};
categories[6]={name:"Household", icon:"household.png"};
categories[7]={name:"Electronics", icon:"electronics.png"};
categories[8]={name:"Others", icon:"others.png"};
var defi={};
defi.food="images/cat/food.jpg";
defi.books="images/cat/books.jpg";
defi.clothing="images/cat/clothing.jpg";
defi.newspapers="images/cat/newspapers.jpg";
defi.furnitures="images/cat/furnitures.jpg";
defi.household="images/cat/household.jpg";
defi.electronics="images/cat/electronics.jpg";
defi.others="images/cat/others.jpg";
var global_profile=null;
var SS_ID="0Aka-Bvq5dDncdDRSV0xFdEI3eHRob09nRHNKUVB6cGc";
var mobileMacro="https://script.google.com/macros/s/AKfycbyjrwi1EbqBr69sbDFbGBe4OgYdi86SuEr5jFTgAM0p4XmobzM/exec";
var macro = "https://script.google.com/macros/s/AKfycbwlWgbKh7KXl7Ppm13-WC5d0jwh8ErZklODCoQ1JhJv2Wy6e_rB/exec";
var default_video="http://www.youtube.com/watch?v=1XfhWhWMBXc";
google.maps.visualRefresh = true;
var map,marker,dirmap,oms,mc;
var ecategory="*";
var eventObjects={};
eventObjects.array=[];
var markers=[];
var isIdled=false;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var oauth_token;
var infowindow = new google.maps.InfoWindow({maxWidth: 300});
var limit=8000 ,searchstr="";
var loggedIn=false;
var de={};	
de.status=false;
de.id=null;
var intro=null;
var firsttime=false;
var relocated=false;
function mapInitialize(myLatLng)
	{
		//var myLatLng = new google.maps.LatLng(-34.397, 150.644);
	  	var mapOptions = {
	    zoom: 16,
	    center: myLatLng,
	    mapTypeId: google.maps.MapTypeId.ROADMAP/*,
	    icon: global_profile.user_dp*/
	  	};
	  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	    marker = new google.maps.Marker({
		      position: myLatLng,
		      map: map,
		      title: 'Me',
		      //icon: 'http://maps.google.com/mapfiles/kml/pal3/icon31.png'
		      icon: 'http://maps.google.com/mapfiles/kml/pal3/icon56.png'
		  		});

	    google.maps.event.addListenerOnce(map, "idle", function(){

		isIdled=true;
	   });
/*
	    google.maps.event.addListener(map, "zoom_changed", function(){
	    	if(map.getZoom()>15)
	    	{
	    		autoSpiderify();
	    	}
	    });
*/	
	

	}


function handleLogin(authData)
{

	if(authData['access_token'])
	{
		
		if($('#header-nav').data('size') == 'big')
    {
        smallheader();
    }
		 $("#nav-bar").show(1000);
		 $("#outer-page").fadeOut(500, function(){
		 	$("#inner-page").fadeIn(500, function(){
		 		//mapInitialize();
		 	});
		 });
		 oauth_token=authData['access_token'];
		$(".container-fluid-nav, #header-nav").animate({height: "35px"}, 1000);
		$(".brand").animate({fontSize: "24px"}, 700);
		$(".outer-nav").hide();
		//ecategory="*";
		populateUserData();
		Ladda.stopAll();
		loggedIn=true;
		if(window.location.hash.substring(0,10)=="#event-id-" && de.status==false)
		{
			de.status=true;
			de.id=window.location.hash.replace("#event-id-","");
		}
		
		
	}

}

function generateCategories()
{	var i;
	var str="";
	for(i=0; i<categories.length; i++)
	{
		str+='<li class="cat-item" id="cat-'+categories[i].name.toLowerCase()+'"><a href="#"><img src="images/'+categories[i].icon+'" /><span class="menu-text"> '+categories[i].name+' </span></a></li>';
	}
	
	$("#cat-list").html(str);
	$("#cat-all").find("a").addClass("cat-active");

	$(".cat-item").click(function(){
		ecategory = $(this).find(".menu-text").text();
		$("#menu-toggler").html(ecategory+'&nbsp; &nbsp;<i class="icon-caret-down"></i>');
		ecategory=ecategory.toLowerCase().trim();
		if(ecategory=='all')
			ecategory="*";

		$(".cat-item").find('a').removeClass("cat-active");
		$(this).find('a').addClass("cat-active");
		populateEvents();
		if($(window).width()<980)
		{
			$("#sidebar").slideUp(100);
		}
		return false;
	});
}


function populateUserData()
{
	//window.location.href=location.href.replace(location.hash,"")+"#home";


	gapi.client.load('plus','v1', function(){
 		var request = gapi.client.plus.people.get({'userId': 'me'});
 		request.execute(function(resp) {
   			if(typeof resp.image != 'undefined' && typeof resp.image.url != 'undefined')
   			{
	            $("#user-dp").attr("src", resp.image.url);
          	}
   			else
   			{
	            $("#user-dp").attr("src", "https://developers.google.com/_static/images/silhouette36.png?sz=30");
          	}
   			$("#user-name").text(resp.displayName);
   			
   			global_profile=resp;
   			$.getJSON("https://spreadsheets.google.com/tq?tq="+encodeURIComponent("select * where B='"+resp.id+"'")+"&key="+SS_ID+"&sheet=Users&tqx=responseHandler:isRegistered&?callback=?");
			  		//resp.emails[0].value

			//console.log(global_profile);
   			//alert(resp);


   			



 		});
	});

	


}


function isRegistered(data)
{
	//console.log(data);
	//FIXME data.status=="error" || 
	window.scrollTo(0,0);
	if(!annoteset)
	changeAnnote();
	if(typeof data.table == 'undefined' || data.table.rows.length==0)
		{
			//alert("Not Registered");
			//firsttime=true;
			$("#mfp-title").text("Enter your location");
			$("#mfp-spinner").hide();
			var htmldata='<div>Please enter your complete address to help us serve you better. You can start by typing your street, area, city and country, or you can enter the nearest landmark and the autocomplete completes it for you. You can then drag the marker to point to a much accurate location.<br /><span id="detected-location"></span><div id="locationField"><input id="autocomplete" placeholder="Enter your address and drag the marker that appears to set an accurate location" type="text" style=" width: 98%; "></input><div id="map-autocanvas" style="height: 300px; margin-top: 20px;"></div></div><br /></div>';
			$("#mfp-content").html(htmldata);
			newPopup();
			var temp_address;
			var temp_latlng;
			if((typeof global_profile.placesLived!= "undefined") && (global_profile.placesLived.length>0))
			{
					temp_address=global_profile.placesLived[0].value;
					$("#detected-location").text("It looks like you live in "+temp_address);
			}
			else
			{
					temp_address="New Delhi, India";
			}

			 disablePopup(true, "Please enter your location first");
			 
			var mapOptions = {	zoom: 14,
									    center: temp_latlng,
									    mapTypeId: google.maps.MapTypeId.ROADMAP
									  };
					var infowindow = new google.maps.InfoWindow({
								      content: "<p>Drag me to set a more accurate location.</p>"});
					var automap = new google.maps.Map(document.getElementById('map-autocanvas'), mapOptions);

					var automarker = new google.maps.Marker(
									{
									    map:automap,
									    draggable:true,
									    animation: google.maps.Animation.DROP,
									    position: new google.maps.LatLng(0,0)
									});

			geocoder = new google.maps.Geocoder();
			geocoder.geocode
			    ({
			        address: temp_address
			    }, 
        		function(results, status) 
		        {
		            if (status == google.maps.GeocoderStatus.OK) 
		            {
		                temp_latlng=results[0].geometry.location;
		                
		            }
		            else
		            {
		            	temp_latlng=new google.maps.LatLng(28.61, 77.23);
		            }

		            automap.panTo(temp_latlng);
					
		            
		        });

		         var autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')));
		         google.maps.event.addListener(autocomplete, 'place_changed', function() {
				    //console.log(autocomplete.getPlace());
				    setTimeout(function(){automap.setZoom(16);}, 3000);
				    var completeData = autocomplete.getPlace();
				    var autoLatLng = new google.maps.LatLng(completeData.geometry.location.lat(), completeData.geometry.location.lng());
				    automap.panTo(autoLatLng);
				    automarker.setPosition(completeData.geometry.location);
				    infowindow.open(automap, automarker);
				    $( "#autocomplete" ).effect( "highlight", {color:'skyblue'}, 1000);
				  });

	google.maps.event.addListener(automarker, 'dragend', function(){
   geocoder.geocode
    ({
        latLng: automarker.getPosition()
    }, 
        function(results, status) 
        {
            if (status == google.maps.GeocoderStatus.OK) 
            {
                $("#autocomplete").val(results[0].formatted_address);
                $( "#autocomplete" ).effect( "highlight", {color:'skyblue'}, 1000);
                //$("#mapErrorMsg").hide(100);
            } 
            else 
            {
                $("#autocomplete").html('Cannot determine address at this location.'+status);
            }
        }
    );

    

});
	$(".ladda-button-register").text("Submit");
	$(".ladda-button-register").unbind("click").click(function(){
				
				if(automarker.getPosition().lat()==0)
				{
					//$(".ladda-button").css("background", "#D84C01");
					//var orig=$(".ladda-button-register").css("background-color");
					//$(".ladda-button-register").animate({backgroundColor: "#D84C01"}, 1000).text("Invalid input. Try again");
					//setTimeout(function(){$(".ladda-button-register").animate({backgroundColor: orig}, 1000).text("Submit");}, 5000);
					$(".ladda-button-register").text("Please enter your address first");
					setTimeout(function(){$(".ladda-button-register").text("Submit");}, 5000);
					return;
				}
				$(".ladda-button-register").text("Submitting");
				var l = Ladda.create( document.querySelector( '.ladda-button-register' ) );
				l.start();
			 	$.getJSON(macro+"?action=register&user_id="+global_profile.id+"&location="+(automarker.getPosition().lat()+","+automarker.getPosition().lng())+"&name="+global_profile.displayName+"&email="+global_profile.emails[0].value+"&call=registrationSuccessful&?callback=?");
			 	


			 });
	//Ladda.bind( '.ladda-button');

	}
	if(typeof data.table != 'undefined' && data.table.rows.length>0)
	{
		//alert("Registered");
		//populateEvents();
		var lln = data.table.rows[0].c[3].v;
	    global_profile.user_location=lln.split(",")[0]+","+lln.split(",")[1];
		var latLng = new google.maps.LatLng(lln.split(",")[0], lln.split(",")[1]);
	    /*map.panTo(latLng);
	    map.setZoom(15);
	    marker.setPosition(latLng);*/
	    $(".map-spinner-holder").fadeOut(300, function(){

	    	$("#map-canvas").fadeIn(300, function(){
	    		mapInitialize(latLng);
	    		populateEvents();
	    		if(firsttime==true && relocated==false)
	    		{
	    		startIntro();
	    		firsttime=false;
	    		}
	    	});
	    });

//	    calcRoute();
		
	}

	//newPopup("Hello World!", true);
	
}




function disablePopup(i,m)
{

	if(i)
		{
			$.magnificPopup.instance.close = function () {

      		alert(m);
      		return;
       $.magnificPopup.proto.close.call(this);
  		};
  	}
  	else
  	{
  		$.magnificPopup.instance.close = function () {
       $.magnificPopup.proto.close.call(this);
  		};
  	}
}




   function newPopup()
     {
        //$("#popup-content").html(str);
        /*if(!spinner)
          $("#spinner").css("display","none");
        else
          $("#spinner").css("display","block");*/
        $.magnificPopup.open({
        items: {src: "#test-popup"},
        type: "inline",
        removalDelay: 500, //delay removal by X to allow out-animation
        mainClass: 'mfp-zoom-in',
        midClick: true/*,
        closeBtnInside: false*/

     	});

     }


 function settingsPopup()
     {
        
        $.magnificPopup.open({
        items: {src: "#settings-popup"},
        type: "inline",
        removalDelay: 500, //delay removal by X to allow out-animation
        mainClass: 'mfp-zoom-in',
        midClick: true/*,
        closeBtnInside: false*/

     	});

     }

      function eventsPopup()
     {
        myEvents();
        $.magnificPopup.open({
        items: {src: "#events-popup"},
        type: "inline",
        removalDelay: 500, //delay removal by X to allow out-animation
        mainClass: 'mfp-zoom-in',
        midClick: true/*,
        closeBtnInside: false*/

     	});

     }

function registrationSuccessful(data)
{
	firsttime=true;
	if(data.query=="register" && data.result=="success")
	{
		disablePopup(false);
		Ladda.stopAll();
		 $.magnificPopup.close(); 
		$.growl.notice({title:"Info", message: "Your location has been saved succesfully.", duration: 3000});

		 populateUserData();
		


	}
	else
	{
		Ladda.stopAll();
		$.growl.error({title:"Error", message: "There was an error saving your location. Please try again.", duration: 3000});

		$(".ladda-button-register").text("There was an error registering");
		setTimeout(function(){$(".ladda-button-register").text("Submit")}, 5000);
	}
}


function populateEvents()
{
	//$(".event-list").html('<div class="event-spinner-holder"><div class="spinner" id="event-spinner"></div><div class="event-spinner-helper"></div></div>');
	$(".event-list").html(generateSpinner("event"));
	var query="https://spreadsheets.google.com/tq?tq="+encodeURIComponent('select * where G '+(ecategory=="*"?'!=':'=')+'"'+ecategory+'"')+"&key=0AqTfmI2fgbDydHNxcnQtdmxnODAzbkFkR3hQb2VqWnc&sheet=Events&tqx=responseHandler:eventData&?callback=?";
	  $.getJSON(query);

	 
}

function generateSpinner(s)
{
	return '<div class="'+s+'-spinner-holder"><div class="spinner" id="'+s+'-spinner"></div><div class="'+s+'-spinner-helper"></div></div>';
}

function sorter(a,b)
{
	if(a.distance<b.distance) return -1;
	else if(a.distance>b.distance) return 1;
	else return 0;
}
function eventData(data)
{
	//console.log(data);
	eventObjects={};
	eventObjects["array"]=[];
	if(data.status=="ok" && data.table.rows.length>0)
	{	//console.log(data.table);
		for(var i=0; i<data.table.rows.length; i++)
		{
			var ci=""+data.table.rows[i].c[0].f;
			eventObjects[ci]={};
			eventObjects[ci].event_id=ci;
			eventObjects[ci].profile_id=data.table.rows[i].c[1].v;
			eventObjects[ci].lat=data.table.rows[i].c[2].v;
			eventObjects[ci].lng=data.table.rows[i].c[3].v;
			eventObjects[ci].title=data.table.rows[i].c[4].v;
			eventObjects[ci].desc=data.table.rows[i].c[5].v;
			eventObjects[ci].category=data.table.rows[i].c[6].v;
			eventObjects[ci].video=data.table.rows[i].c[7].v;
			eventObjects[ci].phone=data.table.rows[i].c[8].v;
			eventObjects[ci].email=data.table.rows[i].c[9].v;
			if(typeof data.table.rows[i].c[10]!= "undefined" && typeof data.table.rows[i].c[10].v!= "undefined")
			eventObjects[ci].end_date=data.table.rows[i].c[10].v;
			if(typeof data.table.rows[i].c[11]!= "undefined" && typeof data.table.rows[i].c[11].v!= "undefined")
			eventObjects[ci].image=data.table.rows[i].c[11].v;
			eventObjects[ci].distance=distLL(data.table.rows[i].c[2].v,data.table.rows[i].c[3].v, global_profile.user_location.split(",")[0], global_profile.user_location.split(",")[1]);
			eventObjects.array.push(eventObjects[ci]);
		}
		eventObjects.array.sort(sorter);
		listEvents(eventObjects.array);
		plotMarkers(eventObjects.array);


		//console.log(eventObjects);
	}
	else
	{
		//$(".event-list").html('<div style="text-align: center; width: 100%"><h4>No events found</h4></div>');
		var suffix="";
		if(limit>0)
	{
		suffix="within "+limit+" Kms.";
	}

		$(".event-list").html('<div style="text-align: center; width: 100%"><h4>No events found '+suffix+' for the category "'+ecategory+'"</h4></div>');
	
		for(var i=0;i<markers.length; i++)
		markers[i].setMap(null);

		if(oms)
		{
	    //oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied:true, circleSpiralSwitchover: Infinity});
	    	oms.clearMarkers();
		oms.clearListeners('click');
		oms=null;
		}
			

		

		if(mc)
		{
			mc.clearMarkers();
		}
	}

	
}


function showDetailedEvent(eid)
{
	//alert($(this).data("id"));

	if(intro!=null)
	{
		alert("Please complete the introduction first.");
		return;
	}
	
		populateDetailEvent(eid);

		gapi.comments.render('comments', {
			    //href: "http://gcdc2013-shareandsmile.appspot.com/",//+global_profile.id+"/"+eid+"/",
			    href:"http://gcdc2013-shareandsmile.appspot.com/events.php?e_id="+global_profile.id+"-"+eid,
			    //width: $('body').innerWidth()-250,
			    //width: '600',
			    first_party_property: 'BLOGGER',
			    view_type: 'FILTERED_POSTMOD'
			});


		$(".a-page").fadeOut(200);
		$("#event-page").show(200, function(){
			initializeDirMap();
			//setTimeout(function(){setTabHeight()}, 200);
			

		});
}


function plotMarkers(ea)
{
	if(!map)
	{
		setTimeout(function(){
			plotMarkers(eventObjects.array)
		}, 100);
		return;
	}


	for(var i=0;i<markers.length; i++)
		markers[i].setMap(null);
	markers=[];

		oms=null;
		if(!oms)
	    oms = new OverlappingMarkerSpiderfier(map, {nearByDistance: 30, circleSpiralSwitchover: Infinity});

		oms.clearMarkers();
		oms.clearListeners('click');

		oms.addListener('click', function(marker, event) {
		  showDetailedEvent(marker.event_id);
		});

		if(mc)
  		mc.clearMarkers();

  	var bounds = new google.maps.LatLngBounds();
	for(var i=0; i<ea.length; i++)
	{
		markers[i]=new google.maps.Marker({
      position: new google.maps.LatLng(ea[i].lat,ea[i].lng),
      map: map,
      title: ea[i].title,
      icon:'images/'+ea[i].category+'.png'    
  		});
  		markers[i].event_id=ea[i].event_id;
  		oms.addMarker(markers[i]);
  		/*function m(mm){
  			google.maps.event.addListener(mm,'mouseover',function(ev){ 
  			if(oms.markersNearMarker(mm,true))
  			{
  				alert(mm.title);
  			}
  		});
  		};
  		m(markers[i]);*/
  		function h(mk)
  		{
  			google.maps.event.addListener(markers[i], 'mouseover', function(event)
		{
			//console.log(mk);
		  infowindow.setContent("<h4>"+eventObjects[mk.event_id].title+"</h4><p>"+eventObjects[mk.event_id].desc+"</p>");
		  infowindow.open(map,mk);
		});
  			google.maps.event.addListener(markers[i], 'mouseout', function(){
  				infowindow.close();
  			});
  		};
  		h(markers[i]);
  		bounds.extend(markers[i].getPosition());
  		
	}
  		//console.log(markers);
map.fitBounds(bounds);
if(map.getZoom()==1)
{
	map.setZoom(3);
	map.panTo(new google.maps.LatLng(global_profile.user_location.split(",")[0],global_profile.user_location.split(",")[1]));
}
  	
	mc = new MarkerClusterer(map, markers, {maxZoom: 16});
	

	if(de.status==true)
	{
		setTimeout(function(){
			if(typeof eventObjects[de.id] != 'undefined')
			{
				showDetailedEvent(de.id);
			}
			else
			{
				$.growl.error({message: "The requested event no longer exists."});
			}

		}, 1000);
		de.status=false;
	
	}

	   



}
/*
function autoSpiderify()
{
	if(!isIdled)
	{
		setTimeout(function(){
			autoSpiderify();
		}, 1000);
		return;
	}
	//alert(markers.length);
	
	for( var i=0; i<markers.length; i++)
	   {	var arr;
	   	arr=oms.markersNearMarker(markers[i],true);
	   	if(arr.length>0 && map.getZoom()>17)
	   	{
	   		function f(e){
	   			google.maps.event.clearListeners(e, 'mouseover');
	   		google.maps.event.addListener(e, 'mouseover', function(event){
	   			
	   			google.maps.event.trigger(e,'click');
	   			event.stop();
	   			//console.log(e);
	   			return;
	   			
	   		});


	   		};
	   		f(markers[i]);

	   	}
	   }
}*/


function setTabHeight()
{

}

function populateDetailEvent(id)
{
	var e=eventObjects[id];
	//window.location.href=location.href.replace(location.hash,"")+"#event-"+e.event_id;

	$("#ed-title").text(e.title);
	$("#ed-main-title").text("Event details for \""+e.title+"\"");
	// $("#ed-category").html('<img src="images/'+e.category+'.png" />');
	$("#ed-category").text(capitaliseFirstLetter(e.category));
	$("#ed-distance").text((Math.round(e.distance*100)/100)+" Kms away")	;
	$("#ed-at").text("Determining address at this location..");
	edAddress(e.lat,e.lng);
	$(".ed-user").text("Determining name..");
	edNameLoad(e.profile_id);
	if(e.phone!="")
	{
		$("#ed-call").show();
		$("#ed-call").unbind("click").click(function(){
			window.location.href="tel:"+e.phone;
		});
		//$("#ed-call").attr("href","tel:"+e.phone);
		//$("#ed-call").text("Call: "+e.phone);
		$("#uc-num").text(e.phone)
	}
	else
		{
			$("#ed-call").hide();
			$("#uc-num").text("");

		}
	$("#ed-desc-text").text(e.desc);
	$("#uc-mail-btn").data("email",e.email);
	//alert(e.email);
	//console.log(e);
	$("#uc-mail-btn").unbind("click").click(function(){
		var popup = window.open("https://mail.google.com/mail/?view=cm&fs=1&tf=1&source=mailto&to="+$("#uc-mail-btn").data("email")+"&body="+encodeURIComponent("Message from Share and Smile user :")+"&su="+encodeURIComponent("Share and Smile - Message about your event : "+ $("#ed-title").text()), "Send Message");
		//alert($("#uc-mail-btn").data("email"));
			});
	edRoute(e.lat,e.lng, "DRIVING");

	$("#public-tab").unbind("click").click(function(){
		directionsDisplay.setPanel(document.getElementById("public"));
		$(".directions-content").html("").hide();
		edRoute(e.lat,e.lng, "TRANSIT");
	});

	$("#drive-tab").unbind("click").click(function(){
		directionsDisplay.setPanel(document.getElementById("drive"));
		$(".directions-content").html("").hide();
		edRoute(e.lat,e.lng, "DRIVING");
	});

	$("#walk-tab").unbind("click").click(function(){
		directionsDisplay.setPanel(document.getElementById("walk"));
		$(".directions-content").html("").hide();
		edRoute(e.lat,e.lng, "WALKING");
	});

	$("#taf").unbind("click").click(function(){
		window.open('https://mail.google.com/mail/?view=cm&fs=1&tf=1&source=mailto&body=Hi+Check out this event : '+$(this).data('ename')+' on Share and Smile at '+encodeURIComponent( 'http://gcdc2013-shareandsmile.appspot.com/#event-id-'+id)+'+&su=Share and Smile - Message');
	});

	var options = {
    contenturl: 'http://gcdc2013-shareandsmile.appspot.com/?n',
    clientid: '362163419531.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    prefilltext: "Hi, I just came across this giveaway : "+e.title+". Share something to bring a smile. Visit http://gcdc2013-shareandsmile.appspot.com/#event-id-"+id,
    calltoactionlabel: 'VISIT',
    calltoactionurl: 'http://gcdc2013-shareandsmile.appspot.com/#event-id-'+id
  };


  if(typeof gapi != "undefined")
  	gapi.interactivepost.render('gp-share-btn', options);

  $("#fb-btn").attr("data-href", "http://gcdc2013-shareandsmile.appspot.com/#event-id-"+id);
  if( typeof FB != "undefined")
  		FB.XFBML.parse();

	$("#twt-btn-holder").html('<a href="https://twitter.com/share" id="twt-btn" class="twitter-share-button" data-lang="en" data-url="http://gcdc2013-shareandsmile.appspot.com/#event-id-'+id+'" data-via="ShareAndSmileIN" data-text="Hi,I just found a giveaway - '+e.title+ ' at Share and Smile. You can also share to bring a smile.">Tweet</a>');
	if(typeof twttr != "undefined")
		twttr.widgets.load();

	$("#taf").data("ename", e.title);
	$("#yt-btn").data("yt-link", e.video);

	$('#det-img').html("");
	if(typeof e.image != "undefined"&& e.image.trim()!="")
	{
		var img = new Image();

			$(img).load(function(){

			  $('#det-img').html($(this)).hide().fadeIn(350);
			

			}).attr({src: e.image}).error(function(){});
	}
	else
	{
		var def_img= defi[e.category.toLowerCase()];
		var img = new Image();

			$(img).load(function(){

			  $('#det-img').html($(this)).hide().fadeIn(350);
			

			}).attr({src: def_img}).error(function(){});
	}

	$(".tabtitle").removeClass("active");
	$("#deftab").addClass("active");
	
}


function dummy()
{
	alert("dummy");
}
function edAddress(lt,ln)
{
  addrgeocoder = new google.maps.Geocoder();
  addrgeocoder.geocode({latLng: new google.maps.LatLng(lt, ln)}, function(results, status){
          if (status == google.maps.GeocoderStatus.OK) 
            {
                $("#ed-at").text("At "+results[0].formatted_address);
            } 
            else 
            {
                $("#ed-at").html('Error determining address.'+status);
            }
          });

}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function restoreInnerPage()
{
	//window.location.href=location.href.replace(location.hash,"");
	//window.location.href=location.href.replace(location.hash,"")+"#home";

	$(".a-page").hide(300);
	$("#inner-page").fadeIn(500);
		 google.maps.event.trigger(document.getElementById('map-canvas'), 'resize');   

	
}


function distLL(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function listEvents(e)
{
	var h="";
	var i
	for(i=0;i<e.length; i++)
	{
		if(limit>0 && e[i].distance>limit)
			break;
		if(searchstr=="" || (e[i].title.search(new RegExp(searchstr, "i"))!=-1 || e[i].desc.search(new RegExp(searchstr, "i"))!=-1 || e[i].category.search(new RegExp(searchstr, "i"))!=-1))
		h+='<div class="event-item" data-id="'+e[i].event_id+'"><div class="event-title"><div class="event-actual-title">'+e[i].title+'</div><!--<div class="event-open">OPEN</div>--><div class="event-dist">'+Math.round(e[i].distance*100)/100+'</div></div><div class="event-desc">'+e[i].desc+'</div></div>';
		
	}

	$(".event-list").html(h);
	var suffix="";
	if(limit>0)
	{
		suffix="within "+limit+" Kms.";
	}

	if(i==0)
		$(".event-list").html('<div style="text-align: center; width: 100%"><h4>No events found '+suffix+' for the category "'+ecategory+'"</h4></div>');
	$(".event-desc").dotdotdot({height: 40});

	$(".event-item").mouseover(function(){
		map.panTo(new google.maps.LatLng(eventObjects[$(this).data("id")].lat, eventObjects[$(this).data("id")].lng));
	});

	$(".event-item").unbind("click").click(function(){
		showDetailedEvent($(this).data("id"));

	});

}
/*
function calcRoute() {
  var start = "Padmanabhanagar, Bangalore";
  var end = "Majestic, Bangalore";
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.TRANSIT
  };
  var directionsService = new google.maps.DirectionsService();

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
     // directionsDisplay.setDirections(response);
     console.log(response);
    }
  });
}
*/
function initializeDirMap()
{
	var mapOptions = {	zoom: 13,
						center: new google.maps.LatLng(global_profile.user_location.split(",")[0], global_profile.user_location.split(",")[1]),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
	if(!dirmap)
	dirmap = new google.maps.Map(document.getElementById('direction-canvas'), mapOptions);
	google.maps.event.trigger(document.getElementById('direction-canvas'), 'resize');   
	if(!directionsDisplay)
	directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(dirmap);
  directionsDisplay.setPanel(document.getElementById("public"));

}


function edRoute(lt,ln,mode) {
  var request = {
    origin: new google.maps.LatLng(global_profile.user_location.split(",")[0],global_profile.user_location.split(",")[1]),
    destination:new google.maps.LatLng(lt,ln),
    travelMode: google.maps.TravelMode[mode]//TRANSIT
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      //directionsDisplay.setMap();
      $(".directions-content").html("").hide().fadeIn(250);

      directionsDisplay.setMap(dirmap);
      directionsDisplay.setDirections(response);
    }
    else
    {
    	directionsDisplay.setMap(null);
    	//directionsDisplay=null;
    	$("#public,#drive,#walk").html("");
    	if(mode=="TRANSIT")
    		$("#public").html("<h5> Public Transport instructions to this place is currently unavailable. This may be because this place is in another city, or there is no public transport service at this place.</h5>").hide().fadeIn(200);
    	if(mode=="DRIVING")
    		$("#drive").html("<h5> Driving instructions to this place is currently unavailable. This may be because this place is in another country or due to a geographical barrier.</h5>").hide().fadeIn(200);
    	if(mode=="WALKING")
    		$("#walk").html("<h5> Walking instructions to this place is currently unavailable. This may be because this place is geographically too far.</h5>").hide().fadeIn(200);
    }
  });
}


function edNameLoad(id)
{
	var request = gapi.client.plus.people.get({'userId': id});
 		request.execute(function(resp) {
   			$(".ed-user").text(resp.displayName);
   			$("#uc-image").html('<img src="'+resp.image.url.substring(0,resp.image.url.length-2)+'80'+'" />');
   			$("#uc-view-profile").unbind("click").click(function(){
   					window.open("http://plus.google.com/"+resp.id);
   			});


   			//console.log(resp);
   			
   			});
}

function relocateUser()
{
	if(!confirm("Your current location will be removed and you will be asked to provide a new location, however your old events will retain their old location. Are you sure to continue?"))
		return;
	relocated=true;
	$.getJSON(macro+"?action=relocateuser&user_id="+global_profile.id+"&call=relocationSuccessful&?callback=?");
	$("#relocate").text("Removing your existing location..");
	var l = Ladda.create( document.querySelector( '#relocate' ) );
	l.start();
}

function relocationSuccessful()
{
	Ladda.stopAll();
	$.magnificPopup.close();
	$.growl.notice({title:"Info", message: "Existing location removal was successful.", duration: 1500});

	$("#relocate").text("Change My Location");
-	populateUserData();
	restoreInnerPage();

}

function deleteAccount()
{
	if(!confirm("This deletes all your data from this application. Continue?"));
	$.getJSON(macro+"?action=deleteuser&user_id="+global_profile.id+"&call=userRemovalSuccessful&?callback=?");
	$("#delete-account").text("Deleting your account..");
	var l = Ladda.create( document.querySelector( '#delete-account' ) );
	l.start();

}

function userRemovalSuccessful()
{
	$("#delete-account").text("Delete my account");
	Ladda.stopAll();
	$.growl.notice({title:"Info", message: "Your account has been removed, but we would like to see you again. Thank you!", duration: 3000});

	$("#logout-button").click();
	$.magnificPopup.close();

}

function generateMELayout(evtitle,evdesc,evid)
{
	var htm="";
	htm+='<div class="row-fluid myeve">';
	htm+='<div class="span9">';
	htm+='<h3>'+evtitle+'</h3>';
	htm+=evdesc;
	htm+='</div>';
	htm+='<div class="span3">';
	htm+='<button class="ladda-button myevedelete button-red" id="'+global_profile.id+'-'+evid+'" data-style="expand-right" data-color="red">Delete</button>';
								
	htm+='</div>';
	htm+='</div>';
	return htm;
}


function myEvents()
{
	$("#myeve-holder").html(generateSpinner("myeve"));
	var query="https://spreadsheets.google.com/tq?tq="+encodeURIComponent('select * where B = "'+global_profile.id+'" ')+"&key=0AqTfmI2fgbDydHNxcnQtdmxnODAzbkFkR3hQb2VqWnc&sheet=Events&tqx=responseHandler:listMyEvents&?callback=?";
  	$.getJSON(query);
}


function listMyEvents(data)
{
	if(typeof data.table != 'undefined' && typeof data.table.rows.length != 'undefined' && data.table.rows.length>0)
  {	var ht="";
		
		 for(var i=0; i<data.table.rows.length; i++)
    {
      	ht+=generateMELayout(data.table.rows[i].c[4].v,data.table.rows[i].c[5].v,data.table.rows[i].c[0].v);
    }
    	$("#myeve-holder").html(ht);

    	$(".myevedelete").unbind("click").click(function(){
    		//alert("Delete");
    		var ids=$(this).attr("id");
    		var l = Ladda.create(this );

    		ids=ids.split("-");
			$(this).text("Deleting..");
			l.start();
			$.getJSON(macro+"?action=deleteevent&user_id="+global_profile.id+"&id_event="+ids[0]+"&timestamp="+ids[1]+"&call=eventDeleted&?callback=?");

    	});

  }

  else
  {
  	$("#myeve-holder").html("<h3>No events found. </h3>");
  }
}


function eventDeleted(data)
{
	myEvents();
		$.growl.notice({title:"Info", message: "Event deleted successfully", duration: 3000});

	populateEvents();
	restoreInnerPage();
	Ladda.stopAll();
}


function ytPopup(link)
{
	var timeout=0;
	if(!link)
	{
		link=default_video;

		$.growl.notice({title:"Info", message: "The user has not attached any video for this event. The default video is being shown.", duration: 3000});
		timeout=2500;
	}
	setTimeout(function(){
		$.magnificPopup.open({
        items: {src: link},
        type: "iframe",
        //removalDelay: 500, //delay removal by X to allow out-animation
        mainClass: 'mfp-zoom-in',
        midClick: true,
        closeBtnInside: false

     	});
	}, timeout);
		
	
}


function linkPhone(){
	$.getJSON(mobileMacro+"?action=mlink&call=mLinked&profile_id="+global_profile.id+"&?callback=?");
	var l = Ladda.create( document.querySelector( '#mlink' ) );
		l.start();
}

function mLinked(data)
{
	$("#mlink").text("Add phone");
	Ladda.stopAll();
	if(typeof data.value == "undefined")
	{
		alert("An error occured generating secret code for your phone number. Please make sure your carrier is supported.");
	}
	else
	{
		$("#mcode").text(data.value);
		$.magnificPopup.close();

		setTimeout(function(){
		$.magnificPopup.open({
        items: {src: "#minfo-popup"},
        type: "inline",
        removalDelay: 500, //delay removal by X to allow out-animation
        mainClass: 'mfp-zoom-in',
        midClick: true/*,
        closeBtnInside: false*/

     	});
	}, 700);

	}
}


function showPrivacy()
{
		$.magnificPopup.open({
        items: {src: "#privacy-popup"},
        type: "inline",
        removalDelay: 500, //delay removal by X to allow out-animation
        mainClass: 'mfp-zoom-in',
        midClick: true/*,
        closeBtnInside: false*/

     	});
}


function showHelp()
{
		$.magnificPopup.open({
        items: {src: "#help-popup"},
        type: "inline",
        removalDelay: 500, //delay removal by X to allow out-animation
        mainClass: 'mfp-zoom-in',
        midClick: true/*,
        closeBtnInside: false*/

     	});
}


function startIntro(){
        intro = introJs();
          intro.setOptions({
            steps: [
              {
                element: document.querySelector('#sidebar'),
                intro: "Select a category here to show only events of the selected category.",
                position: 'right'
              },
               {
                element: '#map-canvas',
                intro: 'This map displays markers which represent events.',
                position: 'right'
              },
              {
                element: document.querySelector('#list-box'),
                intro: "This box shows all the events as a list.",
                position: 'left'
              },
              {
                element: document.querySelector('#kms'),
                intro: "Enter a distance here to show all the events within that limit.",
                position: 'left'
              },
             
              {
                element: '#nav-search-input',
                intro: "Search for an event here by keyword/category. Eg: books",
                position: 'left'
              },
              {
                element: '#event-create-link',
                intro: 'Use this link to create a new event.',
                position: 'left'
              },
              {
                element: '#help-link',
                intro: 'Use this link if you need any help.',
                position: 'left'
              },
              {
                element: '#user-area',
                intro: 'You can find the Settings menu here, which you can use to change your location and link a mobile number',
                position: 'left'
              },
              {
                element: '#user-area',
                intro: 'To make Share and Smile more accessible, we have introduced the SMS interface. You can link your mobile number for offline access in the settings menu. ',
                position: 'left'
              }
            ]
          });
		
		intro.oncomplete(function(){
			intro=null;
		});
		intro.onexit(function(){
			intro=null;
		})
          intro.start();
      }