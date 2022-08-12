//Create folder if does not exists only
//https://yagisanatode.com/2018/07/08/google-apps-script-how-to-create-folders-in-directories-with-driveapp/
function GetOrCreateSubFolder(folderID, folderName){
  var parentFolder = DriveApp.getFolderById(folderID);
  var subFolders = parentFolder.getFolders();
  var doesntExists = true;
  var newFolder = '';
  
  // Check if folder already exists.
  while(subFolders.hasNext()){
    var folder = subFolders.next();
    
    //If the name exists return the id of the folder
    if(folder.getName() === folderName){
      doesntExists = false;
      newFolder = folder;
      return newFolder.getId();
    };
  };
  //If the name doesn't exists, then create a new folder
  if(doesntExists = true){
    //If the file doesn't exists
    newFolder = parentFolder.createFolder(folderName);
    return newFolder.getId();
  };
};

function CreateUpdateFile (folder, filename, data) {
  try {
    // filename is unique, so we can get first element of iterator
    var file = folder.getFilesByName(filename).next();
    file.setContent(data);
  } catch(e) {
    folder.createFile(filename, data);
  }
}
