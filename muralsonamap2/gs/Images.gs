function loopProcessFiles(){
  //loop through the files

  var wb = SpreadsheetApp.openById(wb_id);
  var sheet_data = wb.getSheetByName(sheet_name);

  //not to overload the google engine - code can run for max 5 minutes
  var max_queries = 10;
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
    //Logger.log(i + "_" + rw_lat + "_" + rw_lon);
    if(rw_status === "DOWNLOADED" || rw_status === "POSTPROCESS_HALF"){
      var pp_result = postProcessGeojson(folder_id, rw_file_nm);
      //console.log(i);
      rng_data_info[i][3] = pp_result;
      if (pp_result === "POSTPROCESS_HALF") {
        i = rw_last;
      }
      nr_queries++;
    }
  }

  //write results to sheet
  sheet_data.getRange(2,1,rw_last,5).setValues(rng_data_info);
}

function postProcessGeojson(folder_id, file_name) {
  //take the raw GEOJSON and try to download an image per node if possible
  //store the image in Google Drive and add the name as img_thumbnail to the GEOJSON
  //max_downloads is used not to overload the google engine - code can run for max 5 minutes

  var save_folder = DriveApp.getFolderById(folder_id);
  var img_folder_id = GetOrCreateSubFolder(folder_id,"img");
  console.log("PROCESS-" + file_name);
  var process_status = "POSTPROCESS_OK";
  try {
    // filename is unique, so we can get first element of iterator
    var g_file = save_folder.getFilesByName(file_name).next();
    var g_content = g_file.getBlob().getDataAsString();
    var g_json = JSON.parse(g_content);
    for (j = 0; j < g_json.elements.length; j++){
      if (current_downloads > max_downloads) {
        process_status = "POSTPROCESS_HALF";
        break;
      }
      var g = g_json.elements[j];
      //console.log("ELEMENT: " + j + " ID: " + g.id);
      if(g.tags.hasOwnProperty("image")) {
         if(!g.tags.hasOwnProperty("img_thumbnail")) {
          var img_nr = -1;
          var has_thumb = false;
          //has at least one image, loop all tags
          for (var t in g.tags) {
            if (t.substring(0,5) === "image") {
              img_nr += 1;
              var nm = g.type.toLowerCase() + "_" + g.id + "_" + img_nr;
              console.log("DOWNLOAD: " + t + "_" + nm + "_" + g.tags[t]);
              var save_result = attemptDownloadResizeImage(g.tags[t], nm, img_folder_id);
              if (save_result !== "ERROR") {
                current_downloads += 1;
                if (!has_thumb) {
                  //push first result to "img_thumbnail"
                  //console.log ("PUSH THUMB " + save_result);
                  g_json.elements[j].tags["img_thumbnail"] = save_result;
                  has_thumb = true;
                }
              }
            }
          }
        }
      }
    }
    //return "POSTPROCESSED";
    var json_string= JSON.stringify(g_json);
    CreateUpdateFile(save_folder, file_name, json_string);
    return process_status;
  } catch(e) {
    return "ERROR_POSTPROCESS";
  }

}

function attemptDownloadResizeImage(url_in, save_file_name, save_folder_id){

  var save_folder = DriveApp.getFolderById(save_folder_id);
  var max_size = 500; // max width&height

  if (url_in.includes('imgur.com/')) {
    //IMGUR generally works
    current_downloads++;
    //console.log("IMGUR:" + url_in);
    var fetch_options = {
      'method' : 'get',
      'muteHttpExceptions': true
    };

    //save locally and get ID
    var file_blob = UrlFetchApp.fetch(url_in, fetch_options).getBlob().setName("img_temp");
    var temp_file = save_folder.createFile(file_blob);
    var temp_file_id = temp_file.getId();

    //process and resize
    var file_res = ImgApp.getSize(file_blob);
    if (file_res.width >= file_res.height) {
      //wider than high
      var new_w = max_size;
    } else {
      //higher than wide
      var new_w = file_res.width * (max_size / file_res.height);
    }
    final_file_name = save_file_name + "." + file_res.identification.toLowerCase();
    //var bt = file_blob.getContentType();
    //if (bt = "image/*") {
    var res = ImgApp.doResize(temp_file_id, new_w.toFixed(0));

    try {
      // filename is unique, so we can get first element of iterator
      var file = save_folder.getFilesByName(final_file_name).next();
      file.setTrashed(true);
    } catch(e) {
      //file not present yet
    }
    save_folder.createFile(res.blob.setName(final_file_name));
    temp_file.setTrashed(true);
    return final_file_name;
  } else if (url_in.includes('photos.app.goo.gl/')) {
    //google photo, needs processing
    return "ERROR";
  } else {
    //unknow, try
    return "ERROR";
  }

}



function downloadSaveSmall() {
  //simple test example
  var url = "";
  url = "https://www.vandoeuvre.fr/wp-content/uploads/2022/03/la-sieste-2.jpg";
  //url = "https://commons.wikimedia.org/wiki/File:De_Beverpatroelje.jpg";
  url = "https://i.imgur.com/c1Cg0JK.jpg";

  var fetch_options = {
    'method' : 'get',
    'muteHttpExceptions': true
  };

  var save_folder = DriveApp.getFolderById(folder_id);
  var file_nm = "node_738040957_a";
  var width = 500;

  var file_blob = UrlFetchApp.fetch(url, fetch_options).getBlob().setName("img_temp");
  var temp_file = save_folder.createFile(file_blob);
  var temp_file_id = temp_file.getId();

  var bt = file_blob.getContentType();
  if (bt = "image/*") {
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(url)[1];
    if(typeof ext !== "undefined")
    {
      var res = ImgApp.doResize(temp_file_id, width);
      save_folder.createFile(res.blob.setName(file_nm + "." + ext));
    }
  }
  temp_file.setTrashed(true);
}