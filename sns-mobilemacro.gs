//var SS_ID = "0Am5QDf7hoFQ-dDV3QXh5TlhnaWNfdFM1TEU3YzBiYkE";
var SS_ID="0AqTfmI2fgbDydHNxcnQtdmxnODAzbkFkR3hQb2VqWnc";
var TXT_SVC_KEY = "a3a1fcf3-040d-4b88-8844-5b0265548260";
var TXT_PUB_KEY = "132df29a-7632-4795-aea0-c3fd628baf25";
//row and col starts from 0


function doGet(e) {
 Logger.log(e.parameter);
  Logger.log(e.parameter['txtweb-message']);
/*return findDist(e.parameter['txtweb-mobile']); */
  if(typeof e.parameter.action != "undefined" && e.parameter.action=="mlink")
    return setOne(e.parameter);
  return findDist(e.parameter['svc'],e.parameter['txtweb-mobile'],e.parameter["txtweb-message"]);
}

function replySMS(message){
  var html="<html><head><title> Response </title><meta name=\"txtweb-appkey\" content=\""+TXT_SVC_KEY+"\" /></head><body> "+message+"<br /><br />Advertisement: </body></html>";
return ContentService.createTextOutput(html)
      .setMimeType(ContentService.MimeType.TEXT);
}

var userloc;
var uLat;
var uLong;


function distLL(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
/*function myEventList(rowNo)
{
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Sample");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var msg="";
  for( var i=1;i<=values[1].length;i++)
     msg=msg+" "+values[rowNo][i];
  return replySMS(msg);
  var userID;
  userID=getuserID(rowNo);
  var events=" ";
  events=getEventList(userID);
  return replySMS(events);  
}*/

function getuserID(hashKey)
{
  var rowNo=getRowNo(hashKey);
  if(rowNo==-1)
  {
    return rowNo;
  }
  Logger.log(rowNo);
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Users");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var userID;
  userID=values[rowNo][1];
  userloc=values[rowNo][3];
  uLat=userloc.split(",")[0];
  uLong=userloc.split(",")[1];
  return userID;
  
  /*for(i=0;i<numRows;i++)
  {
      if(hashKey==values[i][5])
      {
          userID=values[i][1];
          userloc=values[i][3];
          uLat=userloc.split(",")[0];
          uLong=userloc.split(",")[1];
          return userID;
      }
  }*/   
}

function getRowNo(hashKey)
{
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Users");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var rowNo=-1;
  for(i=0;i<numRows;i++)
  {
      if(hashKey==values[i][7])
         rowNo=i;
  }  
  return rowNo;
}
/*function getEventList(userID)
{
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Events");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var msg=" ";
  for(i=0;i<numRows;i++)
  {
      if(userID==values[i][1])
      {
        msg=msg+" "+values[i][4]+"<br/>";
      }
  }
  return msg;
}
*/
function sorter(a,b)
{
  if(a.distance<b.distance)
    return -1;
  else if(a.distance>b.distance)
    return 1;
  else 
    return 0;
}

function findDist(svc,hash,code)
{
  if(svc=="register")
  {
    if(auth(code,hash))
    {
      msg="Authentication successfull!!";
      return replySMS(msg);
    }
    else
    {
      msg="Authentication Failed!!";
      return replySMS(msg);
    }
  }
  Logger.log(hash);
  var userID=getuserID(hash);
  if(userID==-1)
  {
    msg="Please,register your number at share and smile app(http://gcdc2013-shareandsmile.appspot.com/) to use this service.";
    return replySMS(msg);
  }
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Events");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var msg=" ";
  var myEvents= [];
  
  if(svc==null)
  {
    
   for(i=0;i<numRows;i++)
   {
       eLat=values[i][2];
       eLon=values[i][3];
       var dist=distLL(uLat,uLong,eLat,eLon);
       myEvents[i]={};
       myEvents[i].name=values[i][4];
       myEvents[i].distance=Math.round(dist*100)/100;
   } 
   myEvents.sort(sorter);
    
  
   for(i=0;(i<myEvents.length)&&(i<5);i++)
   {
     msg=msg+" "+myEvents[i].name+" : "+myEvents[i].distance+"Kms"+"<br />";
   }
   if(myEvents.length==0)
     msg="No events found";
   else
     msg="Nearest events : <br />"+msg;
   return replySMS(msg);
 }
 else if(svc=="food"||svc=="books"||svc=="clothing"||svc=="newspapers"||svc=="furnitures"||svc=="household"||svc=="electronics"||svc=="others")
 {    
    var count=0;
    for(i=0;i<numRows;i++)
   {
       if(values[i][6]==svc)
       {
        eLat=values[i][2];
        eLon=values[i][3];
        var dist=distLL(uLat,uLong,eLat,eLon);
        myEvents[count]={};
        myEvents[count].name=values[i][4];
        myEvents[count].distance=Math.round(dist*100)/100;
        count++;
       }
   }
   myEvents.sort(sorter);
  
   for(i=0;(i<myEvents.length)&&(i<5);i++)
   {
     msg=msg+" "+myEvents[i].name+" : "+myEvents[i].distance+"Kms"+"<br />";
   }
   if(myEvents.length==0)
     msg="No events found";
   else
     msg="Nearest events : <br />"+msg;
   Logger.log(msg);
   return replySMS(msg);
 }

}  

function auth(ucode,hash)
{
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Users");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var rowNo;
  for(var i=0;i<numRows;i++)
  {
    if(values[i][8]=="1"||values[i][8]=="2")
    {
        
        var acode=sign(values[i][1]);
        if(acode==ucode)
        {
          rowNo=i+1;
          var celID="I"+rowNo;
          sheet.getRange(celID).setValue('2');
          var hashCell="H"+rowNo;
          sheet.getRange(hashCell).setValue(hash);
          return true;
        }
      }
    }
  return false;
  
}

function sign(message){     
  message = message || "thisismyteststring";
  var signature = Utilities.computeDigest(
                       Utilities.DigestAlgorithm.MD5,
                       message,
                       Utilities.Charset.US_ASCII);
  Logger.log(signature);
  var signatureStr = '';
    for (i = 0; i < signature.length; i++) {
      var byte = signature[i];
      if (byte < 0)
        byte += 256;
      var byteStr = byte.toString(16);
      // Ensure we have 2 chars in our byte, pad with 0
      if (byteStr.length == 1) byteStr = '0'+byteStr;
      signatureStr += byteStr;
    }   
  Logger.log(signatureStr);
  signatureStr=signatureStr.substring(signatureStr.length-5,signatureStr.length);
  Logger.log(signatureStr);
  return signatureStr;
}
function setOne(ev)
{
  var pid=ev.profile_id;
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Users");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var karHash;
  for(var i=0;i<numRows;i++)
  {
    if(values[i][1]==pid)
    {
        var m_count=i+1;
        var celID="I"+m_count;
        if(values[i][8]!="2")
        {
        sheet.getRange(celID).setValue('1');
        }
        karHash=sign(pid);
    }
  }
  var ob={};
  ob.key="md5";
  ob.value=karHash;
  return respond(ob,ev.call);
}

function respond(str, clb){

return ContentService.createTextOutput(
    clb + '(' + JSON.stringify(str) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);

}


/*
function doTest() {
  var sheet = SpreadsheetApp.openById(SS_ID).getSheetByName("Users");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var rowNo;
  var celID="G"+55;
 sheet.getRange(celID).setValue('new');
}*/
/*
function driver()
{
  var message="100897659453221053462";
  var str=setOne(message);
  Logger.log(str);
}
  */