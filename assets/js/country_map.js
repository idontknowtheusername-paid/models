var CountryMap = new Class({
    Implements:[Options],
    options:{
        container:null
    },
    initialize: function(options) {
        this.setOptions(options);
        this.tabLinks = this.options.container.getElements('a');
        this.typeLinks = this.options.container.getElements('.types a');
        this.containers = {};
        this.cookieKey = 'active_city_view';
        this.mapsDrawn = [];
        if (this.tabLinks.length) {
            this.tabLinks.each(function (link) {
                var key = link.get('href').substr(1);
                if(key != '')
                    this.containers[key] = $(key);
            }.bind(this));
            this.attachEvents();
        }
        new Asset.javascript(STATIC + '/js/lib/OpenLayers.js');
    },
    attachEvents: function(){
        var activeValue = Cookie.read(this.cookieKey);
        if(activeValue in this.containers){
            this.setActiveTab(activeValue);
        }
        else {
            var allKeys = Object.keys(this.containers);
            activeValue = allKeys[0];
        }
        this.currentType = activeValue.split('_')[1];

        this.tabLinks.each(function(link){
            if(link.get('href') != '#'){
                link.addEvent('click', function(e){
                    e.stop();
                    var id = link.get('href').substr(1);
                    var dataLink = link.get('data-link');
                    if(dataLink){
                        this.currentType = dataLink;
                    }
                    this.setActiveTab(id);
                    Cookie.write(this.cookieKey, id, {
                        duration: 30,
                        path: '/'
                    });
                }.bind(this));
            }
        }.bind(this));
        this.typeLinks.each(function(link){
            link.addEvent('click', function(e){
                e.stop();
                var id ='';
                if(this.currentType){
                    id = this.currentType;
                    if(link.hasClass('list')){
                        id = 's_'+id;
                    }
                    else{
                        id = 'm_'+id;
                    }
                    this.setActiveTab(id);
                }
                Cookie.write(this.cookieKey, id, {
                    duration: 30,
                    path: '/'
                });
            }.bind(this));
        }.bind(this))
    },
    setActiveTab:function(tab){
        var key;
        for(key in this.containers){
            this.containers[key].hide();
        }
        if(!this.containers.hasOwnProperty(tab)){
            this.containers[tab] =  $(tab);
        }
        this.containers[tab].show();

        if(tab.indexOf('m_') != -1 && this.mapsDrawn.indexOf(tab) == -1){
            (function myLoop (isLoaded) {
                if('OpenLayers' in window){
                    this.initMap(tab);
                    isLoaded = true;
                }
                else{
                    setTimeout(function () {
                        myLoop.bind(this)(isLoaded);
                    }.bind(this), 250)
                }
            }.bind(this))(false);

        }
    },
    initMap:function(tab){
        if(this.mapsDrawn.indexOf(tab) == -1){
            var container = this.containers[tab];
            var containerWidth = container.getSize().x;
            var mapHolder = container.getElement('.map').setStyles({
                'width': containerWidth - 10,
                'height': 500
            });
            OpenLayers.ImgPath = "/img/open_layers/";
            var items = JSON.parse(container.get('data-items'));
            var country_coords = JSON.parse(this.options.container.get('data-country-coordinates'));
            if(country_coords) {
                var lat =country_coords.lat;
                var lng = country_coords.lng;
                var zoom = country_coords.zoom;
            }
            this.fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
            var map = new OpenLayers.Map(mapHolder.get('id'), {
                theme: null
            });

            map.addLayer(new OpenLayers.Layer.OSM(
                "OpenStreetMap",
                // Official OSM tileset as protocol-independent URLs
                [
                    '//a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    '//b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    '//c.tile.openstreetmap.org/${z}/${x}/${y}.png'
                ],
                null));
            this.toProjection   = map.getProjectionObject(); // to Spherical Mercator Projection
            var position       = this.getPosition(lat, lng);
            map.setCenter(position, zoom);
            this.addMarkers(map, items, mapHolder.get('data-type'));
            this.mapsDrawn.push(tab);
        }
    },
    getPosition: function(lat, lng){
        return new OpenLayers.LonLat(lng, lat).transform( this.fromProjection, this.toProjection);
    },
    getPoint: function(lat, lng){
        return new OpenLayers.Geometry.Point(lng, lat).transform( this.fromProjection, this.toProjection)
    },
    addMarkers: function (map, items, type) {
        var markerLayer = new OpenLayers.Layer.Vector("Markers", {
            renderers: OpenLayers.Layer.Vector.prototype.renderers
        });
        var markerStyle = {externalGraphic: '/img/marker.png', graphicHeight: 8, graphicWidth: 8, graphicXOffset:-4, graphicYOffset:-4 };
        if(items.length){
            var key,numItems;
            for(key in items[0]){
                if(key.indexOf('num_items') != - 1)
                    numItems = key;
            }
            var markers = [];
            items.each(function(item){
                item.lat = parseFloat(item.lat);
                item.lng = parseFloat(item.lng);
                var marker = new OpenLayers.Feature.Vector(this.getPoint(item.lat, item.lng),
                    {name:type == 'city'?item.city:item.name, id:item.id, count:item[numItems], type:type} ,markerStyle);
                markers.push(marker);

            }.bind(this));
            markerLayer.addFeatures(markers);
        }
        map.addLayer(markerLayer);
        this.addMarkerEvents(map, markerLayer, type);
    },
    addMarkerEvents: function(map, markerLayer, type){
        var selectControl = new OpenLayers.Control.SelectFeature(markerLayer, {
            hover: true,
            clickFeature: function (evt) {
                location.href = $(type + '-link-' + evt.data.id).get('href');
            }
        });
        var self = this;
        var onFeatureHighlighted= function (evt) {
            var onPopupClose = function (evt) {
                // 'this' is the popup.
                var feature = this.feature;
                if (feature.layer) {
                    selectControl.unselect(feature);
                }
                this.destroy();
            };
            var feature = evt.feature;
            var popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100,30),
                feature.attributes.name + ': ' + feature.attributes.count + ' ' + MooTools.lang.get('Global', 'escorts')
                ,
                null, true, onPopupClose);
            popup.events.on({
                'click': function(){
                    location.href = $(type + '-link-' + this.feature.data.id).get('href');
                }
            });
            feature.popup = popup;
            popup.feature = feature;
            map.addPopup(popup, true);
        };
        selectControl.events.register('featurehighlighted', null, onFeatureHighlighted);
        map.addControl(selectControl);
        selectControl.activate();

    }
});