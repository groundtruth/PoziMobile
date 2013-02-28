define(["jquery"], function($) {

    var defaults = {
        "defaultZoomLevel": 15,
        "maxZoom": 18,
        "featuresLimit": 20
    };

    return $.extend(defaults, {
        "dataLayerName": "Minor Culverts",
        "databaseName": "loddongis",
        "readEndpoint": "http://v3.pozi.com/ws/rest/v3/ws_minor_culvert_geojson.php?callback=?",
        "maxExtentBounds": [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
        "centerLon": 15986928,
        "centerLat": -4358362,
        "POIFields": [
            {
                "type": "select",
                "id": "culvert_type",
                "description": "Culvert type",
                "options": [
                    { "1": "Box Culvert" },
                    { "2": "Crown Unit" },
                    { "3": "Pipe" },
                    { "4": "Major Culvert" },
                    { "5": "Major structure" }
                ]
            },
            {
                "type": "select",
                "id": "culvert_size",
                "description": "Size",
                "options": [
                    { "1":  "150 dia" },
                    { "2":  "225 dia" },
                    { "3":  "300 dia" },
                    { "4":  "375 dia" },
                    { "5":  "450 dia" },
                    { "6":  "525 dia" },
                    { "7":  "600 dia" },
                    { "8":  "675 dia" },
                    { "9":  "750 dia" },
                    { "10": "825 dia" },
                    { "11": "900 dia" },
                    { "12": "975 dia" },
                    { "13": "1050 dia" },
                    { "14": "1125 dia" },
                    { "15": "1200 dia" },
                    { "16": "1275 dia" },
                    { "17": "1350 dia" },
                    { "18": "1500 dia" },
                    { "19": "375x150" },
                    { "20": "375x225" },
                    { "21": "375x300" },
                    { "22": "375x375" },
                    { "23": "375x450" },
                    { "24": "375x600" },
                    { "25": "375x750" },
                    { "26": "375x900" },
                    { "27": "375x1200" },
                    { "28": "450x150" },
                    { "29": "450x225" },
                    { "30": "450x300" },
                    { "31": "450x375" },
                    { "32": "450x450" },
                    { "33": "450x600" },
                    { "34": "450x750" },
                    { "35": "450x900" },
                    { "36": "450x1200" },
                    { "37": "600x150" },
                    { "38": "600x225" },
                    { "39": "600x300" },
                    { "40": "600x375" },
                    { "41": "600x450" },
                    { "42": "600x600" },
                    { "43": "600x750" },
                    { "44": "600x900" },
                    { "45": "600x1200" },
                    { "46": "750x150" },
                    { "47": "750x225" },
                    { "48": "750x300" },
                    { "49": "750x375" },
                    { "50": "750x450" },
                    { "51": "750x600" },
                    { "52": "750x750" },
                    { "53": "750x900" },
                    { "54": "750x1200" },
                    { "55": "900x150" },
                    { "56": "900x225" },
                    { "57": "900x300" },
                    { "58": "900x375" },
                    { "59": "900x450" },
                    { "60": "900x600" },
                    { "61": "900x750" },
                    { "62": "900x900" },
                    { "63": "900x1200" },
                    { "64": "1200x150" },
                    { "65": "1200x225" },
                    { "66": "1200x300" },
                    { "67": "1200x375" },
                    { "68": "1200x450" },
                    { "69": "1200x600" },
                    { "70": "1200x750" },
                    { "71": "1200x900" },
                    { "72": "1200x1200" }
                ]
            },
            {
                "type": "select",
                "id": "culvert_material",
                "description": "Material",
                "options": [
                    { "1": "Brick" },
                    { "2": "Corrugated Galvanised Steel" },
                    { "3": "Earthenware" },
                    { "4": "Fibre Reinforced Concrete" },
                    { "5": "PVC" },
                    { "6": "Reinforced Concrete" },
                    { "7": "Steel" },
                    { "8": "Timber" }
                ]
            },
            {
                "type": "select",
                "id": "cell_count",
                "description": "Number of cells",
                "options": [
                    { "1":  "1" },
                    { "2":  "2" },
                    { "3":  "3" },
                    { "4":  "4" },
                    { "5":  "5" },
                    { "6":  "6" },
                    { "7":  "7" },
                    { "8":  "8" },
                    { "9":  "9" },
                    { "10": "10" },
                    { "11": "11" },
                    { "12": "12" }
                ]
            },
            {
                "type": "select",
                "id": "culvert_condition",
                "description": "Culvert condition",
                "options": [
                    { "-1": "" },
                    { "0":  "0 - New" },
                    { "1":  "1 - Good Condition" },
                    { "2":  "2 - Good Condition" },
                    { "3":  "3 - Good Condition" },
                    { "4":  "4 - Good Condition" },
                    { "5":  "5 - Obvious deterioration" },
                    { "6":  "6 - Obvious deterioration" },
                    { "7":  "7 - Obvious deterioration" },
                    { "8":  "8 - Severe deterioration" },
                    { "9":  "9 - Severe deterioration" },
                    { "10": "10 - Unserviceable" }
                ]
            },
            {
                "type": "select",
                "id": "endwall_count",
                "description": "Number of endwalls",
                "options": [
                    { "0": "0" },
                    { "1": "1" },
                    { "2": "2" }
                ]
            },
            {
                "type": "select",
                "id": "endwall_condition",
                "description": "Endwall condition",
                "options": [
                    { "-1": "" },
                    { "0":  "0 - New" },
                    { "1":  "1 - Good Condition" },
                    { "2":  "2 - Good Condition" },
                    { "3":  "3 - Good Condition" },
                    { "4":  "4 - Good Condition" },
                    { "5":  "5 - Obvious deterioration" },
                    { "6":  "6 - Obvious deterioration" },
                    { "7":  "7 - Obvious deterioration" },
                    { "8":  "8 - Severe deterioration" },
                    { "9":  "9 - Severe deterioration" },
                    { "10": "10 - Unserviceable" }
                ]
            },
            {
                "type": "select",
                "id": "culvert_posts_needed",
                "description": "Endwall posts needed",
                "options": [
                    { "1": "No" },
                    { "2": "Yes" }
                ]
            },
            {
                "type": "select",
                "id": "unblock_culvert",
                "description": "Unblock culvert",
                "options": [
                    { "1": "No" },
                    { "2": "Yes" }
                ]
            },
            {
                "type": "select",
                "id": "bridge_register",
                "description": "Bridge register",
                "options": [
                    { "1": "No" },
                    { "2": "Yes" }
                ]
            },
            {
                "type": "select",
                "id": "further_inspection_required",
                "description": "Further inspection required",
                "options": [
                    { "1": "No" },
                    { "2": "Yes" }
                ]
            },
            {
                "type": "textarea",
                "id": "comments"
            },
            {
                "type": "hidden",
                "id": "lat"
            },
            {
                "type": "hidden",
                "id": "lon"
            },
            {
                "type": "hidden",
                "id": "config",
                "value": "loddongis"
            }
        ]
    });

});
 
