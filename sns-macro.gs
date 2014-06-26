var SS_ID = "0AqTfmI2fgbDydHNxcnQtdmxnODAzbkFkR3hQb2VqWnc";

function doGet(request) {
  initSheet();
  var callback=request.parameters.call;
  if(request.parameters.action=='register')
  {
                      var response = {};
                      if(registerUser(request.parameters))
                       response.result="success";
                       else
                       response.result="failed";
                       response.query="register";
                       return respond(response,callback ); 
  }
  else if(request.parameters.action=='relocateuser')
    {
    
        var response={};
        if(relocateUser(request.parameter.user_id))
            response.result="success";
         else
             response.result="failed";
          response.query="deleteuser";
          return respond(response, callback);
    }
  else if(request.parameters.action=='deleteuser')
    {
    
        var response={};
        if(deleteUser(request.parameter.user_id))
            response.result="success";
         else
             response.result="failed";
          response.query="deleteuser";
          return respond(response, callback);
    }
    
  else if(request.parameters.action=="createevent")
  {
  
    var response={};
    if(createEvent(request.parameter))
            response.result="success";
         else
             response.result="failed";
          response.query="createdevent";
    return respond(response, callback);
    
  
  }
  
   else if(request.parameters.action=="deleteevent")
  {
  
    var response={};
    if(deleteEvent(request.parameter))
            response.result="success";
         else
             response.result="failed";
          response.query="deletedevent";
    return respond(response, callback);
    
  
  }
  
}


function respond(str, clb){

return ContentService.createTextOutput(
    clb + '(' + JSON.stringify(str) + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);

}


function initSheet(){
var sheetinit = SpreadsheetApp.openById(SS_ID);

if(!sheetinit.getSheetByName("Events"))
    sheetinit.getSheets()[0].setName("Events");
    
if(!sheetinit.getSheetByName("Users")){
    sheetinit.insertSheet("Users",1);
    }
       
  sheetinit.setActiveSheet(sheetinit.getSheetByName("Events"));  
 }
 


function deleteUser(id) {
  var ss = SpreadsheetApp.openById(SS_ID);
var s = ss.getSheetByName("Users");
  var values = s.getDataRange().getValues();

  for (var row in values)
    if (values[row][1] == id)
      s.deleteRow(parseInt(row)+1);
}


function relocateUser(id) {
  var ss = SpreadsheetApp.openById(SS_ID);
var s = ss.getSheetByName("Users");
  var values = s.getDataRange().getValues();

  for (var row in values)
    if (values[row][1] == id)
      s.deleteRow(parseInt(row)+1);
}



function registerUser(b){

var sheetinit = SpreadsheetApp.openById(SS_ID);
var sheet = sheetinit.getSheetByName("Users");
var row   = sheet.getLastRow() + 1;

if(  sheet.appendRow([row, b.user_id, b.name, b.location, b.email,"0","0","0","0"]))
    return true;
   else
   return false;
  
  }



function createEvent(b)
{

var sheetinit = SpreadsheetApp.openById(SS_ID);
var sheet = sheetinit.getSheetByName("Events");
var row   = sheet.getLastRow() + 1;
Logger.log(b);
if(  sheet.appendRow([b.timestamp,b.user_id, b.lat, b.lng, b.title, b.desc, b.category, b.video, b.phone, b.email,b.end_date,b.image]))
    return true;
   else
   return false;
  


}


function deleteEvent(b)
{
   var ss = SpreadsheetApp.openById(SS_ID);
var s = ss.getSheetByName("Events");
  var values = s.getDataRange().getValues();

  Logger.log(b.id_event+"-"+b.timestamp);
 if(b.user_id==b.id_event)
  {
  
  for (var row in values)
    if (values[row][1] == b.id_event && values[row][0] == b.timestamp)
      {
      s.deleteRow(parseInt(row)+1);
       return true;
      }

    }
    return false;
}