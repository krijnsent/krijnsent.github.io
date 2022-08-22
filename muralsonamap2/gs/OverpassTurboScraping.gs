function LoopGetSaveOTData(){
  //loops through the information in the sheet, takes the
  //expected columns (a-d): LAT(N-Z), LON(E-W), LAST_UPDATE, LAST_STATUS
  //settings in Variables.gs

  var base_url = "https://overpass-api.de/api/interpreter";
  base_url += "?data="

  var fetch_options = {
    'method' : 'get',
    'contentType': 'application/json',
    'muteHttpExceptions': true
  };

  var d = new Date();
  var wb = SpreadsheetApp.openById(wb_id);
  var sheet_data = wb.getSheetByName(sheet_name);

  //not to overload the end point
  var max_queries = 40;
  var nr_queries = 0;

  var rw_values = sheet_data.getRange("A2:A").getValues();
  var rw_last = rw_values.filter(String).length;  
  var rng_data_info = sheet_data.getRange(2,1,rw_last,5).getValues();

  for (i = 0; i < rw_last; i++){
    if(nr_queries>=max_queries) {break;};

    var rw_lat = rng_data_info[i][0];
    var rw_lon = rng_data_info[i][1];
    var rw_date = rng_data_info[i][2];
    var rw_status = rng_data_info[i][3];
    var rw_file_nm = rng_data_info[i][4];

    var diff_days = Math.floor((rw_date-d)/(24*3600*1000));

    //Logger.log(i + "_" + rw_lat + "_" + rw_lon);
    if(diff_days < -7 || (rw_status !== "DOWNLOADED" || rw_status !== "POSTPROCESS_OK")){
      //Logger.log(diff_days + "_" + scrape_status);
      //fixed area, 2 degrees wide, 2 high
      var qry = BuildOTQuery('[tourism=artwork]["artwork_type"~"(mural|street_art)"]',rw_lat,rw_lon,rw_lat+2,rw_lon+2);
      var qry = encodeURIComponent(qry);

//[out:json];(nwr[tourism=artwork][artwork_type=mural](52.0,5.0,52.5,5.5);nwr[tourism=artwork][artwork_type=street_art](52.0,5.0,52.5,5.5););out geom;
//nwr["artwork_type"~"(mural|street_art)"]

      response_data = UrlFetchApp.fetch(base_url + qry, fetch_options); 
      var file_contents = response_data.getContentText();
      try {
          var obj = JSON.parse(file_contents);

          //get folder from Variables.gs
          var save_folder = DriveApp.getFolderById(folder_id);

          var file_nm = 'mural_' + (100 * rw_lat).toFixed(0) + "_" + (100*rw_lon).toFixed(0) + '.json';
          CreateUpdateFile(save_folder, file_nm, file_contents);

          rng_data_info[i][2] = d;
          rng_data_info[i][3] = "DOWNLOADED";
          rng_data_info[i][4] = file_nm;
      }
      catch (e) {
          // The JSON was invalid, `e` has some further information
          rng_data_info[i][2] = d;
          rng_data_info[i][3] = e;
          rng_data_info[i][4] = "ERROR";
     }
      nr_queries++;
    }
  }
  //write results to sheet
  sheet_data.getRange(2,1,rw_last,5).setValues(rng_data_info);
}

function GetSaveOTData() {
  // simple scrape version, do set the folder_id in Variables.gs first
  //https://wiki.openstreetmap.org/wiki/Overpass_API
  //https://overpass-turbo.eu/
  //Choose your endpoint, they should all work
  //var base_url = "https://lz4.overpass-api.de/api/interpreter";
  //var base_url = "https://z.overpass-api.de/api/interpreter";
  //var base_url = "https://overpass.kumi.systems/api/interpreter";
  var base_url = "https://overpass-api.de/api/interpreter";
  base_url += "?data="

  var fetch_options = {
    'method' : 'get',
    'contentType': 'application/json',
    'muteHttpExceptions': true
  };

  //more info on queries, check out the sites above
  var qry = BuildOTQuery("[tourism=artwork][artwork_type=mural]",52,4,53,5);
  response_data = UrlFetchApp.fetch(base_url + qry, fetch_options); 
  var file_contents = response_data.getContentText();
  //parse with JSON for access
  //var parsed_file = JSON.parse(file_contents);

  //get folder from Variables.gs
  var save_folder = DriveApp.getFolderById(folder_id);
  CreateUpdateFile(save_folder, 'data.json', file_contents);
}

function BuildOTQuery(QueryElements, LatFrom, LonFrom, LatTo, LonTo) {
  //working examples, should work in a browser too
  //get XML data in a box
  //"https://overpass-api.de/api/interpreter?data=[out:xml];way[maxspeed](52.07526,5.13997,52.07528,5.13999);out;"

  //get JSON data around a point (meters)
  //"https://overpass-api.de/api/interpreter?data=[out:json];way[maxspeed](around:10,52.07530,5.13997);out geom;"

  //query for my purpose, timeout set to 54 seconds
  var qry = "[out:json][timeout:54];"
  qry += "(nwr" + QueryElements;
  qry += "(";
  qry += LatFrom.toFixed(1) + ",";
  qry += LonFrom.toFixed(1) + ",";
  qry += LatTo.toFixed(1) + ",";
  qry += LonTo.toFixed(1);
  qry += "););";
  qry += "out geom;";

  return qry;
}