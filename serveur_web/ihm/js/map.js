var lon = -4.501142;
var lat = 48.400665;
var lonR;
var latR;
var bool = 0;
var distanceF;
var angle;

var zoom = 21;

var map = null;

var marqueurRobot = {
		layer : null,
		icon : 'img/marqueur_R_32.png',
		lon : null,
		lat : null,
		dir : 0,
}
	  
$(document).ready(function () {
    initMap();


    // Robot 2
    // Dessin de la pièce
    /*var posPiece = gpsDestination(lon,lat,-7.90,15)
	tracerLigne("segment",lon,lat,posPiece[0],posPiece[1])

    var posPiece2 = gpsDestination(posPiece[0],posPiece[1],1.77,105)
	tracerLigne("segment",posPiece[0],posPiece[1],posPiece2[0],posPiece2[1])

	var posPiece3 = gpsDestination(posPiece2[0],posPiece2[1],7.90,15)
	tracerLigne("segment",posPiece2[0],posPiece2[1],posPiece3[0],posPiece3[1])

    var dir = gpsDirection(posPiece3[0],posPiece3[1],lon,lat)
	var posPiece4 = gpsDestination(posPiece3[0],posPiece3[1],1.77,dir)
    tracerLigne("segment",posPiece3[0],posPiece3[1],posPiece4[0],posPiece4[1])
    
    // Obstacle
    var posObs = gpsDestination(lon, lat, -3.64, 15)
    var posObs2 = gpsDestination(posObs[0], posObs[1], 0.87, 105)
    var posObs3 = gpsDestination(posObs2[0], posObs2[1], 0.2, 105)
    tracerLigne("segment", posObs2[0],posObs2[1],posObs3[0],posObs3[1])*/

    // Robot 3
    // Dessin de la pièce
    var posPiece = gpsDestination(lon,lat,2.90,77)
    tracerLigne("segment",lon,lat,posPiece[0],posPiece[1])

    var posPiece2 = gpsDestination(posPiece[0],posPiece[1],1.3,340)
    tracerLigne("segment",posPiece[0],posPiece[1],posPiece2[0],posPiece2[1])

    var posPiece3 = gpsDestination(posPiece2[0],posPiece2[1],-2.9,77)
    tracerLigne("segment",posPiece2[0],posPiece2[1],posPiece3[0],posPiece3[1])

    var dir = gpsDirection(posPiece3[0],posPiece3[1],lon,lat)
    var posPiece4 = gpsDestination(posPiece3[0],posPiece3[1],1.3,dir)
    tracerLigne("segment",posPiece3[0],posPiece3[1],posPiece4[0],posPiece4[1])

    // Obstacle
    var posObs = gpsDestination(lon, lat, 1, 77)
    var posObs2 = gpsDestination(posObs[0], posObs[1], 0.55, 340)
    var posObs3 = gpsDestination(posObs2[0], posObs2[1], 0.15, 340)
    tracerLigne("segment", posObs2[0],posObs2[1],posObs3[0],posObs3[1])


    // Marqueur
	 marqueurRobot.lon = posPiece[0]
     marqueurRobot.lat = posPiece[1]
     lonR = marqueurRobot.lon;
     latR = marqueurRobot.lat;

		  
	 marqueurRobot.layer = tracerMarqueur(
		  [{lon:marqueurRobot.lon,lat:marqueurRobot.lat,txt:""}],
		  "MarqueurRobot",
		  marqueurRobot.icon,
		  0.7,	// opacité
		  16 
	  // on a comme marqueur un disque de 32 pixels de diamètre
	  // on déplace le marqueur de 16 pixels vers le bas pour que
	  // le centre du cercle corresponde à la position du marqueur
		)

    //testBougerMarqueur()
	ref();
});

function ref(){
    setInterval("rel()", 1000);
}

function rel(){
    if(bool == 1){
        var lonA = lonR;
        var latA = latR;
        var distance = parseInt($("#distance").html()) / 100
        angle = parseInt($("#angle").html())
        var pos = gpsDestination(lonA, latA, distance, angle);
        lonR = pos[0];
        latR = pos[1];
        deplacerMarqueur(marqueurRobot.layer,lonR,latR,angleR);
        bool = 0;
    } else if(bool == 2){
        angle = parseInt($("#angle").html())
        deplacerMarqueur(marqueurRobot.layer,lonR,latR,angle);
        bool = 0;
    }
}

function initMap() {
map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Tile({
		source: new ol.source.OSM()
		})
	],
	view: new ol.View({
		//center: ol.proj.fromLonLat([lon, lat]),
		center : ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
		projection: 'EPSG:3857',
		zoom: zoom
	})
	});

	// EPSG:4326 : code pour les coordonnées GPS (voir WGS-84)
	// on utilise 2 angles, longitude et latitude

	// EPSG:3857 : code pour les coordonnées Mercator
	// on utilise des coordonnées projetées.
	// La projection Mercator utilise une projection cylindrique.
	// La projection Mercator a été utilisée pour la première fois en 1569
	// par Geraldus Mercator, géographe flamand
    // les coordonnées sont exprimées en mètres
    
    map.on("click", function(event) {
        gestionClic(event,map);
    });

    function gestionClic(event,map) {
        var coord = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
           var pos = {lon:coord[0], lat:coord[1]}; // GPS

        $("#lon").html(pos.lon.toFixed(6));
        $("#lat").html(pos.lat.toFixed(6));

        $("#lonm").html(event.coordinate[0]);
        $("#latm").html(event.coordinate[1]);

        deplacerMarqueur(marqueurRobot.layer,pos.lon,pos.lat,angleR)
    }
}

function initPos(){
    var posPiece = gpsDestination(lon,lat,2.90,77)
    var distance = parseInt($("#distance").html()) / 100
    angle = parseInt($("#angle").html())

    var angleTemp = (angle + 180) % 360
    var latlong = gpsDestination(posPiece[0],posPiece[1],distance,angleTemp)
    //tracerLigne("segment", posPiece[0],posPiece[1],latlong[0],latlong[1])

    console.log("distance : " + distance)
    console.log("angle : " + angle + " | angletemp : " + angleTemp)
    deplacerMarqueur(marqueurRobot.layer, latlong[0], latlong[1], angle)
}

function tracerLigne(nom,lon1,lat1,lon2,lat2) {
		
    // on peut tracer en une fois une liste des segments
    // liste des segments dans lseg
    var lseg = [
                    [[lon1,lat1], [lon2, lat2]], // segment n°1
            ]
    
    var couleur = 'rgba(255,0,0,0.5)' // RGB + transparence
    
    var largeur = 10 // largeur du trait

    // création d'un vecteur vide
    var vectorSource = new ol.source.Vector({
      //create empty vector
    });

    // ajout des segments dans le vecteur
    lseg.forEach (function(seg) {
        vectorSource.addFeature(new ol.Feature({
            geometry : new ol.geom.LineString(seg).transform('EPSG:4326', 'EPSG:3857'),
        }));
        // création d'un layer
        var vectorLayer = new ol.layer.Vector({
        source : vectorSource,
        name : nom,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: couleur,
            width: largeur
          })
        })
    });

    // superposition du layer à la carte
    map.addLayer(vectorLayer);

    });
}

function gpsDestination(lon,lat,dist,dir) {
    // on part du point (lon,lat)
    // on avance de "dist" (mètres) dans la direction "dir" (degrés par rapport au nord)
    // on retourne le point d'arrivée sous la forme d'un tableau [lon,lat]

    // http://www.movable-type.co.uk/scripts/latlong.html
    //φ2 = asin( sin φ1 ⋅ cos δ + cos φ1 ⋅ sin δ ⋅ cos θ )
    //λ2 = λ1 + atan2( sin θ ⋅ sin δ ⋅ cos φ1, cos δ − sin φ1 ⋅ sin φ2 )
    // where     φ is latitude, λ is longitude, θ is the bearing (clockwise from north)
    // δ is the angular distance d/R; d being the distance travelled, R the earth’s radius



    var lon1 = lon * (Math.PI/180); // degrés -> radians
    var lat1 = lat * (Math.PI/180);
    dir = dir * (Math.PI/180);
    var R = 6371000; // rayon de la planète terre en mètres

    var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist/R) +
            Math.cos(lat1)*Math.sin(dist/R)*Math.cos(dir) );
    var lon2 = lon1 + Math.atan2(Math.sin(dir)*Math.sin(dist/R)*Math.cos(lat1),
                Math.cos(dist/R)-Math.sin(lat1)*Math.sin(lat2));


    lon2 = lon2 * (180/Math.PI); // radians -> degrés
    lat2 = lat2 * (180/Math.PI);

    //alert("lon1 = "+lon0+" lat1 = "+lat0+" lon2 = "+lon2+" lat2 = "+lat2)

    return [lon2,lat2]; 


}

function gpsDirection(lon1,lat1,lon2,lat2) {
    // connaissant deux points GPS
    // on calcule la direction par rapport au nord
    // de la droite passant par ces deux points

    lon1 = lon1 * (Math.PI/180); // degrés -> radians
    lat1 = lat1 * (Math.PI/180);

    lon2 = lon2 * (Math.PI/180); // degrés -> radians
    lat2 = lat2 * (Math.PI/180);

    //var y = Math.sin(λ2-λ1) * Math.cos(φ2);
    //var x = Math.cos(φ1)*Math.sin(φ2) -
    //        Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
    //var dir = Math.atan2(y, x).toDegrees();

    var y = Math.sin(lon2-lon1) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
    var dir = Math.atan2(y, x);
    dir = dir *(180 / Math.PI);

    //alert(dir);
    return dir;
}

function gpsDistance(lon1,lat1,lon2,lat2) {
    var R = 6371000; // Radius of the earth in m
    var dist = 0;
        var dLat = (lat2-lat1) * Math.PI / 180;  // Javascript functions in radians
        var dLon = (lon2-lon1) * Math.PI / 180; 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        dist += R * c;

            //alert(dist);
    return dist;
}


function testBougerMarqueur() {
	marqueurRobot.lon += 0.00002
	marqueurRobot.lat += 0.00001
	marqueurRobot.dir += 10
	deplacerMarqueur(marqueurRobot.layer,marqueurRobot.lon,marqueurRobot.lat,marqueurRobot.dir)
	setTimeout(() => {
	testBougerMarqueur()}, 1000);
}

function tracerMarqueur(lm,nom,icon,opa,posY) {
	// lm : liste des marqueurs à créer
	// nom : nom de la liste des marqueurs
	// icon : png du marqueur
	// opa : opacité
	// posY : positionnement du marqueur sur l'axe vertical

	var vectorSource = new ol.source.Vector({
	  //create empty vector
	});

	lm.forEach (function(m) {
		vectorSource.addFeature(new ol.Feature({
		geometry : new ol.geom.Point(ol.proj.transform([m.lon, m.lat], 'EPSG:4326',     
		'EPSG:3857')),
		txt : m.txt
		}));
		});
		
	var image = new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
				anchor: [0.5, posY],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: opa,
				src: icon
			}));


	var vectorLayer = new ol.layer.Vector({
		source : vectorSource,
		name : nom,
		style: new ol.style.Style({
			image: image
			})
		});
	//polyLayer.set('name','rrrr');

	map.addLayer(vectorLayer);
	// map.addOverlay(vectorLayer);

	//alert(polyLayer.get('name'));
		

	return vectorLayer;
		
	//return vectorSource.getFeatures()[0];
	// retourne le premier marqueur


}

function deplacerMarqueur(marqueurLayer,lon,lat,dir) {
    // mettre le marqueur à la position (lon,lat) et dans la direction dir

	// on prend le premier marqueur dans la source
		marqueurLayer.getSource().getFeatures()[0].setGeometry(new ol.geom.Point(ol.proj.transform([lon, lat], 
			'EPSG:4326', 'EPSG:3857')));

		marqueurLayer.getStyle().getImage().setRotation(dir * 0.01745329251);

		marqueurLayer.changed();
		
}

