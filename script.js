// JavaScript Document

$(document).ready(function(e) {
	
	
    $(".button_langue").click(function(e) {
		var langue=$(this).attr('id');
		       						        $("#langue").hide();
													       						        $("#enfant").hide();

			    $("#plat_"+langue).show();
							    $("#plat_"+langue).animate({opacity:1} , 2000);
								
								$("#container").css('height' , '700px');
		    });
	
	
	
    // draw milk or Dairy circle 
    var milkOrDairyPoints = Array();
    milkOrDairyPoints = drawPoly(milkOrDairyPoints, 527, 315, 40, 0, 360);

    // draw fruit circle 
    var fruityPoints = Array();
    fruityPoints = drawPoly(fruityPoints, 253, 319, 40, 0, 360);

    // draw non starchy vegetable polygon
    var nonStarchyVegetablePoints = Array();
    nonStarchyVegetablePoints = drawPoly(nonStarchyVegetablePoints, 391, 490, 167, 90, 270);


    // draw starchy vegetable polygon
    var starchyVegetablePoints = Array();
    starchyVegetablePoints = drawPoly(starchyVegetablePoints, 391, 490, 167, 270, 360);

    // draw meats and protein
    var meatsAndProteinPoints = Array();
    meatsAndProteinPoints = drawPoly(meatsAndProteinPoints, 391, 490, 167, 0, 90);

    // jQuery UI Draggable
    $(".laitier").draggable({

        revert: false,
        stop: function (ev, ui) {
            checkIsItInPoly(milkOrDairyPoints, ui,this,false);
        }
    });

    $(".fruit").draggable({

        revert: false,
        stop: function (ev, ui) {
			            checkIsItInPoly(fruityPoints, ui,this,false);
        }
    });


    $(".non_feculent").draggable({

        revert: false,
        stop: function (ev, ui) {
            checkIsItInPoly(nonStarchyVegetablePoints, ui,this,true);
        }
    });

    $(".feculent").draggable({

        revert: false,
        stop: function (ev, ui) {
            checkIsItInPoly(starchyVegetablePoints, ui,this,true);
        }
    });

    $(".viande").draggable({

        revert: false,
        stop: function (ev, ui) {
            checkIsItInPoly(meatsAndProteinPoints, ui,this,true);
        }
    });
});


function checkIsItInPoly(points, ui,me,takeOnlyCenterPoint) {
    var hel = ui.helper;
    var centerCenter = { x: 0, y: 0 };
    var topLeft = { x: ui.offset.left, y: ui.offset.top };
    var topRight = { x: ui.offset.left + ui.helper.width(), y: ui.offset.top };
    var bottomLeft = { x: ui.offset.left, y: ui.offset.top + ui.helper.height() };
    var bottomRight = { x: ui.offset.left + ui.helper.width(), y: ui.offset.top + ui.helper.height() };
    if (topLeft.x != undefined && topRight.x != undefined && bottomLeft.y != undefined && bottomRight.y != undefined) {
        centerCenter = {
            x: (topLeft.x + topRight.x) / 2,
            y: (topRight.y + bottomRight.y) / 2,
        };
    }

    if (takeOnlyCenterPoint) {
        if (isPointInPoly(points, centerCenter) == true) {
			$(me).css("pointer-events" , "none");
            $(me).draggable("option", "disabled", true); // don't drag once it is place. 
        } else {
            hel.animate({ top: ui.originalPosition.top, left: ui.originalPosition.left });
        }
    } else {
        if (isPointInPoly(points, topLeft) == true || isPointInPoly(points, topRight) == true || isPointInPoly(points, bottomLeft) == true || isPointInPoly(points, bottomRight) == true || isPointInPoly(points, centerCenter) == true) {
            $(me).draggable("option", "disabled", true); // don't drag once it is place. 
        } else {
            hel.animate({ top: ui.originalPosition.top, left: ui.originalPosition.left });
        }
    }
    //  showlog(points, topLeft, topRight, bottomLeft, bottomRight, centerCenter);
}

function showlog(topLeft, topRight, bottomLeft, bottomRight, centerCenter) {
    console.clear();
    console.log("topleft:" + topLeft.x + "," + topLeft.y);
    console.log("topRight:" + topRight.x + "," + topRight.y);
    console.log("bottomLeft:" + bottomLeft.x + "," + bottomLeft.y);
    console.log("bottomRight:" + bottomRight.x + "," + bottomRight.y);
    console.log("centerCenter:" + centerCenter.x + "," + centerCenter.y);
}

function drawPoly(points, originX, originY, radius, startDegree, endDegree) {
    var j = 0;
    var xAxis;
    var yAxis;
    var imageWidth = 800;
    originX = $(document).width() / 2 - imageWidth / 2 + originX;

    for (var i = startDegree; i <= endDegree; i = i + 1) {

        var rad = i * Math.PI / 180.0;
        xAxis = Math.round(originX + (radius * Math.cos(rad)));
        yAxis = Math.round(originY + (radius * Math.sin(rad)));

        points.push({ x: xAxis, y: yAxis });
        // This will draw the image
      // DrawImage(points[j], i);
        j = j + 1;
    }


    //  if this is not a full circle
    if (startDegree == 0 && endDegree == 360) {
        // if this is circle do nothing
    } else {
        points.push({ x: originX, y: originY });
    }

    return points;
}

function drawLine(points, one, two, originX, originY) {
    var j = points.length;
    for (var b = one; b < two; b = b + 1) {
        if (originY == -1)
            points[j] = { x: originX, y: b };
        if (originX == -1)
            points[j] = { x: b, y: originY };
      //DrawImage(points[j], b);
        j = j + 1;
    }
}

function DrawImage(point, degree) {
    var generatedId = point.x.toString() + "_" + point.y.toString() + "_" + degree.toString() + Math.floor(Math.random() * 1000).toString();
    $("#plateDiv").append("<img id=" + generatedId + " src=images/content/2x2.gif />");
    $("#" + generatedId).css('position', 'absolute');
    $("#" + generatedId).offset({ left: point.x, top: point.y });
    $("#" + generatedId).css('z-index', '50');
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [v1.0]
function isPointInPoly(poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
		&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
		&& (c = !c);
    return c;
}