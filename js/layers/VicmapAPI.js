define(["openlayers"], function(OpenLayers) {

    return function() {

        this.layer = OpenLayers.Layer.WMTS.doNew({
            "name":"Vicmap API",
            "url":"http://api.maps.vic.gov.au/geowebcacheWM/service/wmts",
            "layer" : "WEB_MERCATOR",
            "tileSize": new OpenLayers.Size(512,512),
            "style":"_null",
            "isBaseLayer": true,
            "sphericalMercator" : true,
            "format":"image/png",
            "matrixSet":"EPSG:3857_WEB_MERCATOR",
            "matrixIds":[
                {"identifier":"EPSG:3857_WEB_MERCATOR:0","matrixHeight":1,"matrixWidth":1,"resolution":156543.03392800014,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:1","matrixHeight":1,"matrixWidth":1,"resolution":78271.516963999937,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:2","matrixHeight":2,"matrixWidth":2,"resolution":39135.758482000092,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:3","matrixHeight":3,"matrixWidth":4,"resolution":19567.879240999919,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:4","matrixHeight":6,"matrixWidth":8,"resolution":9783.9396204999593,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:5","matrixHeight":11,"matrixWidth":15,"resolution":4891.9698102499797,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:6","matrixHeight":21,"matrixWidth":30,"resolution":2445.9849051249898,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:7","matrixHeight":41,"matrixWidth":60,"resolution":1222.9924525624949,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:8","matrixHeight":82,"matrixWidth":119,"resolution":611.496226281379687,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:9","matrixHeight":163,"matrixWidth":238,"resolution":305.74811314055756,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:10","matrixHeight":326,"matrixWidth":476,"resolution":152.87405657041106,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:11","matrixHeight":652,"matrixWidth":951,"resolution":76.437028285073239,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:12","matrixHeight":1303,"matrixWidth":1902,"resolution":38.21851414253662,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:13","matrixHeight":2605,"matrixWidth":3804,"resolution":19.10925707126831,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:14","matrixHeight":5210,"matrixWidth":7608,"resolution":9.5546285356341549,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:15","matrixHeight":10419,"matrixWidth":15215,"resolution":4.7773142679493699,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:16","matrixHeight":20837,"matrixWidth":30430,"resolution":2.3886571339746849,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:17","matrixHeight":41673,"matrixWidth":60860,"resolution":1.1943285668550503,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:18","matrixHeight":83345,"matrixWidth":121719,"resolution":0.59716428355981721,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:19","matrixHeight":166689,"matrixWidth":243437,"resolution":0.29858214164761665,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)},
                {"identifier":"EPSG:3857_WEB_MERCATOR:20","matrixHeight":333378,"matrixWidth":486873,"resolution":0.14929107082380833,"tileSize":new OpenLayers.Size(512,512),"topLeftCorner":new OpenLayers.LonLat(-20037508.34,20037508.34)}
            ],
            "tileOrigin": new OpenLayers.LonLat(-20037508.34,20037508.34),
            "serverResolutions": [156543.03392800014,78271.516963999937,39135.758482000092,19567.879240999919,9783.9396204999593,4891.9698102499797,2445.9849051249898, 1222.9924525624949, 611.496226281379687, 305.74811314055756, 152.87405657041106, 76.437028285073239, 38.21851414253662, 19.10925707126831, 9.5546285356341549, 4.7773142679493699, 2.3886571339746849, 1.1943285668550503, 0.59716428355981721, 0.29858214164761665, 0.14929107082380833]
        });

    };

});

