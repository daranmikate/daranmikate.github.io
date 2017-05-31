(function($){
	$.fn.devices = function(ease,object){
			ease = ease || 1000;
			return this.each(function(){
				var $devices = $(this),
					$trail = $devices.find(".scrollbar-trail"),
					torig_h = $trail.height(), 
					$monitor = $devices.find('.monitor'),
					$tablet = $devices.find('.tablet'),
					$phone = $devices.find('.phone'),
					$mview = $monitor.find(".monitor-view"), 
					$tview = $tablet.find(".tablet-view"), 
					$pview = $phone.find(".phone-view"), 
					monitor_exist = $monitor.length > 0,
					tablet_exist = $tablet.length > 0,
					phone_exist = $phone.length > 0,
					mscreen_total = ($monitor.find(".monitor-screen").height() - $mview.height()),
					tscreen_total = ($tablet.find(".tablet-screen").height() - $tview.height()),
					pscreen_total = ($phone.find(".phone-screen").height() - $pview.height()),
					$trail_prog = $devices.find(".scrollbar-progress"),  
					extra = (torig_h/25),
					isSingle = $devices.is('.single-device') && $devices.find('.monitor').length === 0,
					$tab = isSingle ? $devices.find('[class$="-view"]') : $devices.find(".scrollbar-tab"),
					trail_height = isSingle ? $tab.parent().height() - $tab.height() :torig_h - extra, 
					cache_num = 0,
					cache_start = {};

				$tab.draggable({ 
					axis:'y',
					scroll:false,
					// containment:"parent",
					start: function (e,ui){
							cache_start = e; 
						},
					drag: function(event,ui){
						if (!isSingle) {
							if (cache_num < ui.position.top) {
								$tab.addClass("positive").removeClass("negative");
							} else {
								$tab.addClass("negative").removeClass("positive");
							} 
							// ui.position.left = tab_left; 
							if (ui.position.top <= 0) ui.position.top = 0;
							if (ui.position.top >= trail_height) ui.position.top = trail_height;
							
							if (monitor_exist) {
								mtop_percent = (ui.position.top/trail_height)*mscreen_total;
								$mview.stop().css({'margin-top':mtop_percent+"px"
								});
							}
							if (tablet_exist) {
								ttop_percent = (ui.position.top/trail_height)*tscreen_total;
								$tview.stop().css({'margin-top':ttop_percent+"px"
								});
							}
							if (phone_exist) {
								ptop_percent = (ui.position.top/trail_height)*pscreen_total;
								$pview.stop().css({'margin-top':ptop_percent+"px"
								});
							}
							$trail_prog.stop().height(ui.position.top + (extra/2)); 
						} 
							$tab.stop();
						cache_num = ui.position.top;
						
					},
					stop: function (e, ui) { 
						var     $this = $(this),
								$parent = $this.parent(),
								start = cache_start,
								startX = start.clientX,
								startY = start.clientY,
								startTime = start.timeStamp,
								stopX = e.clientX,
								stopY = e.clientY,
								stopTime = e.timeStamp,
							    distX =  Math.abs(startX - stopX),
				           		distY =  Math.abs(startY - stopY),
				            	//var dDist = (distX + distY)/2,
				            	dDist = Math.sqrt(Math.pow(startX-stopX, 2) + Math.pow(startY-stopY, 2)),
				            	dTime = stopTime - startTime,
				            	dSpeed = (dDist / dTime).toString(),
				                dSpeed = parseFloat(dSpeed.substr(0,(parseInt(dSpeed.substring(2,4)) > 25 ? 5 : 2))), // 1 decimal point only
				    				
				            	dVelX = ((Math.round(distX*dSpeed*180 / (distX+distY)))),
				            	dVelY = ((Math.round(distY*dSpeed*180 / (distX+distY)))),
				    
				            	Xc = ui.position.left,
				            	Yc = ui.position.top,
				            	momentumpos = {};
				            	
				            	// console.log(dDist);
				            if ( startX > stopX )  // we are moving left
				                 Xc = Xc - dVelX;

				            if ( startX > stopX ) //  we are moving right
				                 Xc = Xc + dVelX; 
				         
				            if ( startY > stopY )  // we are moving up
				                 Yc = (Yc - dVelY); 

				            if ( startY < stopY )  // we are moving down
				                Yc = (Yc + dVelY);  
				            momentumpos.left = Xc;
				            momentumpos.top = Yc;
				            // if(!isSingle){
				            // 	var pheight = $parent.height(),thisheight = $this.height(),pwidth = $parent.width(),
				            // 		thiswidth = $this.width();
				            // 	if (pheight <= momentumpos.top) momentumpos.top = (pheight - (thisheight));
				            // 	if (0 >= momentumpos.top) momentumpos.top = 0;
				            // 	// if (pwidth < momentumpos.left && (!dragga.axis || dragga.axis === 'x')) momentumpos.left = (pwidth - (thiswidth));
				            // 	// if (0 >= momentumpos.left && (!dragga.axis || dragga.axis === 'x')) momentumpos.left = 0;
				            // }

						

						var momentumtop = momentumpos.top;
						if (!isSingle) {
							if (momentumpos.top <= 0) momentumtop = 0;
							if (momentumpos.top >= trail_height) momentumtop = trail_height;
							
							if (monitor_exist && dSpeed) {
								mtop_percent = (momentumtop/trail_height)*mscreen_total;
								$mview.stop().animate({marginTop:mtop_percent+"px"
								},1000,'easeOutCirc');
							}
							if (tablet_exist && dSpeed) {
								ttop_percent = (momentumtop/trail_height)*tscreen_total;
								$tview.stop().animate({marginTop:ttop_percent+"px"
								},1000,'easeOutCirc');
							}
							if (phone_exist && dSpeed) {
								ptop_percent = (momentumtop/trail_height)*pscreen_total;
								$pview.stop().animate({marginTop:ptop_percent+"px"
								},1000,'easeOutCirc');
							}
							dSpeed && $trail_prog.stop().animate({height:momentumtop + (extra/2)
								},1000,'easeOutCirc'); 
							$tab.removeClass("positive").removeClass("negative");
							dSpeed && $this.stop().animate({ top:momentumtop+'px', useTranslate3d:true }, ease,'easeOutCirc');
						} else {
							if (momentumpos.top >= 0) momentumtop = 0;
							if (momentumpos.top <= trail_height) momentumtop = trail_height;
							dSpeed && $tab.stop().animate({top:momentumtop+'px', useTranslate3d:true }, 1000,'easeOutCirc');
						}
					}	
				});
			});
		}
})(jQuery);

$(window).load(function(){
	$('.devices').devices();
});