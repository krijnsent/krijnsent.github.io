<!DOCTYPE html>
<html lang="EN">
<head>

    <title>Murals on a Map</title>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <link href="css/bootstrap.min.css" rel="stylesheet"> <!--load all fontawesome styles -->
    <link href="css/all.min.css" rel="stylesheet"> <!--load all fontawesome styles -->
    <link href="css/leaflet.css" rel="stylesheet" />
    <link href="css/leaflet-sidebar.css" rel="stylesheet"> <!--load custom styles -->
    <link href="css/murals.css" rel="stylesheet"> <!--load custom styles -->

    <script src="js/jquery-3.5.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/leaflet.js"></script>
    <script src="js/leaflet-sidebar.min.js"></script>

    <style>

        html, body {
            margin: 0;
            width: 100%;
            height: 100%;
        }
        #mmap {
            float: left;
            margin: 0;
            width: 100%;
            height: 100%;
        }

    </style>

</head>
<body>

<div id="sidebar" class="sidebar collapsed">
    <!-- Nav tabs -->
    <div class="sidebar-tabs">
        <ul role="tablist">
            <li><a href="#home" role="tab"><i class="fa fa-bars"></i></a></li>
            <li><a href="#about" role="tab"><i class="fa fa-question-circle"></i></a></li>
        </ul>
    </div>

    <!-- Tab panes -->
    <div class="sidebar-content">
        <div class="sidebar-pane" id="home">
            <h1 class="sidebar-header">
                Murals on a map
                <span class="sidebar-close"><i class="fa fa-caret-left"></i></span>
            </h1>
            <p>A hobby project to map out murals in Utrecht, NL.</p>
            <p>Please leave feedback/suggestions at <a href="https://www.reddit.com/r/Utrecht/comments/i9i7hc/murals_in_utrecht/" target="_blank">my Reddit post</a>
                or as an issue at <a href="https://github.com/krijnsent/krijnsent.github.io" target="_blank">the Github repo</a>.</p>

            <h4>Highlight murals by artist or by title</h4>
            <form class="form-horizontal">
                <div class="input-group">
                    <input type="text" id="highlight_filter" class="form-control" placeholder="Highlight with text" oninput="update_highlight();" aria-label="Highlight with text" aria-describedby="basic-addon2" value='<?php echo htmlspecialchars($_GET["q"]); ?>' >
                    <div class="input-group-append">
                        <button class="btn btn-outline-danger" type="button" onclick="clear_highlight_filter();" >X</button>
                    </div>
                </div>
            </form>
        </div>

        <div class="sidebar-pane" id="about">
            <h1 class="sidebar-header">About<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>
            The images I use are of poor quality, I scale them to max 300px.
            That is on purpose: the best way to enjoy these murals is to be in front of them.
            So enjoy this site as your guide for a nice bike ride :). Please leave feedback/suggestions at <a href="https://www.reddit.com/r/Utrecht/comments/i9i7hc/murals_in_utrecht/" target="_blank">my Reddit post</a>
            or as an issue at <a href="https://github.com/krijnsent/krijnsent.github.io" target="_blank">the Github repo</a>.
            <h2>Sources</h2>
            <ul>
                <li>Years of cycling through the city</li>
                <li>Ingress</li>
                <li><a href="https://hetutrechtsarchief.nl/beeldmateriaal/" target="_blank">Utrechts Archief</a></li>
                <li>DuckDuckGo & Startpage.com</li>
            </ul>
        </div>

    </div>
</div>


<div id='mmap'></div>

<script>
    $(document).ready(function() {
        initmap();
    });

    var m_map;
    var murals_data = 1;
    //var murals_markers = new L.FeatureGroup();
    var murals_layer_group = new L.LayerGroup();
    var sett_filter = document.getElementById("highlight_filter");

    var IconMural = function(latlng, properties) {
        var bg_color = "#FFFFFF";
        var w = 2;
        var filter_by = sett_filter.value.toLowerCase();

        if (filter_by === "") {
            //no different settings
        } else {
            //console.log("FILTER");
            var nn = properties.name.toLowerCase().indexOf(filter_by);
            var na = properties.artist.toLowerCase().indexOf(filter_by);
            if (nn >= 0 || na >= 0) {
                w = 4;
                bg_color = "#FFFF00";
            } else {
                // no different settings
            }
        }
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: bg_color,
            weight: w,
            color: "#000000",
            opacity: 1,
            fillOpacity: 0.6
        })
    };


    function initmap() {
        // set up the map
        m_map = new L.Map('mmap', {zoomControl: false});
        var UTRECHT_DOM = [52.0906, 5.1214];
        //get our map
        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = '&copy; <a href = "https://www.openstreetmap.org/copyright">  OpenStreetMap </a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 4, maxZoom: 19, attribution: osmAttrib});
        m_map.addLayer(osm);

        m_map.attributionControl.setPrefix('');
        m_map.setView(UTRECHT_DOM, 13);

        murals_layer_group.addTo(m_map);
        load_murals_data();

        var sidebar = L.control.sidebar('sidebar').addTo(m_map);
    }

    function load_murals_data() {
        console.log("LOAD MURALS DATA START");
        var ajax = $.ajax({
            type : 'GET',
            url : 'data/murals.json',
            success : function (response) {
                //console.log("MURALS DATA RESPONSE OK");
                //console.log(response);
                murals_data = response;
                redraw_murals();
            },
            error: function(response){
                console.log("ERROR MURALS LOADING");
                //console.log(response);
            }
        });
    }

    function redraw_murals() {
        console.log("START DRAW MURALS");
        murals_layer_group.clearLayers();
        //L.geoJSON(murals_data).addTo(murals_markers);

        //loop through murals_data
        var geojson = L.geoJson(murals_data, {
            pointToLayer: function(feature, latlng) {
                return new IconMural(latlng, feature.properties);
            },
            onEachFeature: function (feature, layer) {
                //console.log(feature);
                //var mural_pos = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
                var popup_txt = '<b>Titel</b>: ' + feature.properties.name + '<br/>' ;
                popup_txt +=  '<b>Artiest</b>: ' + feature.properties.artist + '<br/>';
                popup_txt +=  '<img src="img/' + feature.properties.image + '" alt="Foto"/>';
                layer.bindPopup(popup_txt, {minWidth : 300});
            }
        });

        murals_layer_group.addLayer(geojson);
    }

    function update_highlight(){
        console.log("UPDATE_FILTER");
        redraw_murals()
    }

    function clear_highlight_filter(){
        console.log("CLEAR_FILTER");
        sett_filter.value = "";
        redraw_murals();
    }


</script>

</body>
</html>
