var requestDATAURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_AGVStatus.php";
var requestGETAWAYURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_AGVGetaway.php";

var AGV_Name = "ITRI_3-3";
var mainAGV = "AGV_3";
var mainAGV_Code = "000000";
var AGV_Data = {};

var PreviewPath = [];
var mapPath = new Array;

var Services = {
    "AGV_1":    { Name: "ITRI_3-1", Type: "AGV",    isLoading: false,   show: true},
    "AGV_2":    { Name: "ITRI_3-2", Type: "AGV",    isLoading: false,   show: false},
    "AGV_3":    { Name: "ITRI_3-3", Type: "AGV",    isLoading: true,    show: true},
    "AGV_4":    { Name: "ITRI_3-4", Type: "AGV",    isLoading: false,   show: false},
    "Shelf_1":  { Name: "Shelf-1",  Type: "Shelf",  show: true,         Code: "040010"},
    "Shelf_2":  { Name: "Shelf-2",  Type: "Shelf",  show: true,         Code: "050010"},
    "Shelf_3":  { Name: "Shelf-3",  Type: "Shelf",  show: true,         Code: "060010"},
};

ajax_request = function(datajson, callback){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', requestDATAURL, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify(datajson));
  callback(xmlhttp['response']);
  return xmlhttp;
}

function AGVStatus(name, cmd){
    var dataJSON = {};
    dataJSON["Name"] = name;
    dataJSON["Cmd"] = cmd;
    var request;
    $.ajax({
        url: requestDATAURL,
        data: JSON.stringify(dataJSON),
        type: "POST",
        dataType: "json",
        async : false,
        contentType: "application/json;charset=utf-8",
        success: function(returnData){
            //console.log(returnData);
            request = returnData;
        },
        error: function(xhr, ajaxOptions, thrownError){
            // console.log("erorr");
            console.log(xhr);
            console.log(thrownError);
        },
        timeout: 3000
    });
    return request;
}

function AGVGetaway(name, cmd, param = new Array){
    console.log(name + " : " + cmd);
    var dataJSON = {};
    dataJSON["Name"] = name;
    dataJSON["Param"] = param;
    dataJSON["Cmd"] = cmd;
    var request;
    $.ajax({
        url: requestGETAWAYURL,
        data: JSON.stringify(dataJSON),
        type: "POST",
        dataType: "json",
        async : false,
        contentType: "application/json;charset=utf-8",
        success: function(returnData){
            //console.log(returnData);
            request = returnData;
        },
        error: function(xhr, ajaxOptions, thrownError){
            console.log("erorr");
             console.log(xhr);
             console.log(thrownError);
        },
        timeout: 3000
    });
    return request;
}

MainAGV_STATUS = function(cmd){
    var response = AGVStatus(Services[mainAGV].Name, cmd);
    console.log(response);
}

MainAGV_GETAWAY = function(cmd){
  var response = AGVGetaway(Services[mainAGV].Name, cmd);
  console.log(response);
}

mainAGV_GoPosition = function(code){
  var param = {};
  param['code'] = code;
  param['yaw'] = 0;
  var response = AGVGetaway(Services[mainAGV].Name, -1000, param);
  console.log(response);
}

DataHandlar = function(response){
  if(response['code'] == 0){
    return response['data'];
  }else{
    console.log("error", response['data']);
    return null;
  }
}

var yPosition = [0, 78, 156, 233, 311, 390, 468];
var xPosition = [0, 78, 156, 234, 314, 391, 469];

move = function(Name, position, yaw){
    $("#"+Name).css({
        top: yPosition[parseInt(position[1])]+"px", 
        left: xPosition[parseInt(position[4])]+"px",
        transform: `rotate(${absYaw(parseInt(yaw))}deg)`,
    });
}

absYaw = function(yaw){
  while(yaw<0)yaw+=360;
  while(yaw>360)yaw-=360;
  yaw = Math.round(yaw/90)*90;
  return yaw%361;
}

updateControls = function(id, data){
    absYawName = function(yaw){
        while(yaw<0)yaw+=360;
        yaw = yaw%360;
        yaw = Math.round(yaw/90)*90;
        var name = "";
        switch(yaw){
            case 0:
                name="前";
                break;
            case 90:
                name="右";
                break;
            case 180:
                name="後";
                break;
            case 270:
                name="左";
                break;
        }
        return yaw+":"+name;
    }

    console.log("Update Control", id);
    setFovLock();
    $('#AGV_Status')      .val(data['StatusCode']);
    $('#AGV_State')       .val(data['Config']['Status']['State']);
    $('#AGV_IsLiftUp')    .val(data['Config']['Status']['IsLiftUp']);
    $('#AGV_X')           .val(data['Config']["Attitude"]['Code'][4]);
    $('#AGV_Y')           .val(data['Config']["Attitude"]['Code'][1]);
    $('#AGV_Yaw')         .val(absYawName(parseInt(data['Config']["Attitude"]['Yaw'])));
    $('#AGV_Battery')     .val(data['Config']["Battery"]);
    $('#AGV_Chargeing')   .val(data['Config']['Status']['IsChargeing']);
    $('#AGV_IsReady')     .val(data['Config']['Status']['IsReady']);
    $('#AGV_IsProgress')  .val(data['Config']['AgvLogIndex']['IsProgress']);
    $('#AGV_IsMoving')    .val(data['Config']['Status']['IsMoving']);
    $('#AGV_IsReady')     .val(data['Config']['Status']['IsReady']);

    $('#AGV_ScriptIdx')   .val(data['Config']['AgvLogIndex']['ScriptIdx']);
    $('#AGV_RunIdx')      .val(data['Config']['AgvLogIndex']['RunIdx']);
    $('#AGV_ErrorIdx')    .val(data['Config']['AgvLogIndex']['ErrorIdx']);

    if(data['Config']['Shelves']['Code'] != "ERROR"){
      $('#Shelf_X')       .val(data['Config']['Shelves']['Code'][4]);
      $('#Shelf_Y')       .val(data['Config']['Shelves']['Code'][1]);
      $('#Shelf_Yaw')     .val(data['Config']['Shelves']['Yaw']);
    }else{
      $('#Shelf_X')       .val('null');
      $('#Shelf_Y')       .val('null');
      $('#Shelf_Yaw')     .val('null');
    }
    
    $('#AGV_Script_Type')       .val(data['Config']['AgvScript']['Type']);
    $('#AGV_Script_Parameter')  .val(data['Config']['AgvScript']['Parameter']);
    $('#AGV_Script_Code')       .val(data['Config']['AgvScript']['Code']);
}

loadingStatus = function(){
  for(var sv in Services){
    if(Services[sv].isLoading && Services[sv].Type == "AGV"){
      console.log("Loading", sv);
      var API_data = AGVStatus(Services[sv].Name, 1);
      if(API_data['code'] == 0){ // API_data['code'] == API_data.code
        if(sv == mainAGV){
          AGV_Data = API_data;
          if(mainAGV_Code != AGV_Data['data']['Config']['Attitude']['Code']){
            mainAGV_Code = AGV_Data['data']['Config']['Attitude']['Code'];
            buildPreviewList();
          }
          updateControls(Services[sv].Name, API_data['data']);
        }
        if(statusCode = API_data['data']['StatusCode'] == 0){
          move(Services[sv].Name, API_data['data']['Config']['Attitude']["Code"], API_data['data']['Config']['Attitude']["Yaw"]);
        }
      }else{
        
      }
    }
  }
}

readyObject = function(){
  var loading = false;


  // 建立移動物件
  for(var sv in Services){
    var DOM_d = $(`<div id="${Services[sv].Name}" class="dynamic-i"></div>`);
    var DOM_i = $(`<i class="fas" aria-hidden="true"></i>`);
    if(Services[sv].show == false){
      $(DOM_d).css('display', 'none');
      // $(DOM).css('display', ''); //取消方法
    }
    if(Services[sv].Type == "AGV"){
      if(Services[sv].show == false){
        
      }
      $(DOM_i).addClass("icon-AGV-Car");
      $(DOM_i).addClass("AGV");
      if(sv == mainAGV){
        loading = Services[sv].isLoading;
        $(DOM_i).addClass("AGV-main");
      }
      DOM_d.append(DOM_i);
      $("#map").append(DOM_d);
    }else if(Services[sv].Type == "Shelf"){
      $(DOM_i).addClass("icon-AGV-Shelf");
      $(DOM_i).addClass("Shelf");
      DOM_d.append(DOM_i);
      $("#map").append(DOM_d);
      move(Services[sv].Name, Services[sv].Code, 0);
    }
  }

  // 選擇AGV
  $("#" + Services[mainAGV].Name + "_Radio").attr("checked",true);
  $("#Loading_CheckBox").attr("checked",loading);
}

AGVServiceSwitch = function(e){
  
  $("#"+Services[mainAGV].Name).children().removeClass("AGV-main");
  mainAGV = e.value;
  console.log(Services[mainAGV]);
  // $("#"+Services[mainAGV].Name).css('display', '');
  $("#"+Services[mainAGV].Name).children().addClass("AGV-main");
  console.log((Services[mainAGV].isLoading ? true : ''));
  $('#Loading_CheckBox').prop('checked', Services[mainAGV].isLoading);
  // $("#Loading_CheckBox").attr("checked", (Services[mainAGV].isLoading ? true : ''));
}

setAGVLoading = function(e){
  Services[mainAGV].isLoading = $("#Loading_CheckBox").is(":checked");
  console.log(Services[mainAGV].isLoading);
}

setFovLock = function(){
  cssYaw = function(yaw){
    var _yaw = absYaw(yaw);
    switch(_yaw){
      case 0:
        return 0;
      case 90:
        return 270;
      case 180:
        return 180;
      case 270:
        return 90;
    }
  }
  var yaw = 0;
  if($("#FOVLock_CheckBox").is(":checked")){
    yaw = AGV_Data['data']['Config']['Attitude']['Yaw'];
  }
  $(".static-map").css('transform', `rotate(${cssYaw(parseInt(yaw))}deg)`);
  $(".static-i").css('transform', `rotate(${-cssYaw(parseInt(yaw))}deg)`);
}

showList = function(list){
  // list.map((_p, i) => {
  //   console.log(_p);
  // });
  alert(list);
};

clearSubPoint = function(){
  for (var point in mapPath) {
    // console.log("clear " + mapPath[point]);
    if(mapPath[point] == "060050" || mapPath[point] == "060060"){
      $('#'+mapPath[point]).css('color', '');
    }else{
      $("#"+mapPath[point]).empty();
    }
  }
  mapPath = [];
}

buildPreviewList = function(){
  var data = AGVStatus(Services[mainAGV].Name, 100);
  if(data.code == 0){
    PreviewPath = data.data;
    var i=0;
    for (var key in PreviewPath) {
      console.log(key, PreviewPath[key]);
      if(key == mainAGV_Code)continue ;
      $('#'+key).unbind("mouseover").mouseover(function() {
        clearSubPoint();
        console.log(this.id + " in.");

        // path
        var length = PreviewPath[this.id].length;
        var index = length -1;
        PreviewPath[this.id].map((_code, i) => {
          mapPath.push(_code);
          if(_code == "060050"){
            $('#'+_code).css('color', 'rgb(81, 207, 102, ' + (index--)/length + ')');
          }else{
            $('#'+_code).append(`<i class="far fa-dot-circle" style="color: rgb(81, 207, 102, ` + (index--)/length + `)"></i>`);
          }
        });

        // Aim position
        if(this.id == "060050"){
          $('#'+this.id).css('color', 'var(--green-l)');
        }else{
          var DOM_i = `<i class="fas fa-bullseye fa-lg static-i" style="color: var(--green-l);"></i>`;
          $(DOM_i).unbind("click").click(function(){
            $(DOM_i).css('color', 'var(--green-d)');
          });
          $('#'+this.id).append(DOM_i);
        }

        // Autopilot
        $('#'+this.id).unbind("click").click(function(){
          $('#'+this.id).css('color', 'var(--green-d)');
          // alert(this.id);
          if($("#Autopilot_CheckBox").is(":checked")){
            mainAGV_GoPosition(this.id);
          }
        });
        mapPath.push(this.id);
      });
    }
    if(typeof PreviewPath['060050'] !== 'undefined'){
      $("#060060").unbind("mouseover").mouseover(function() {
        $("#060050").mouseover();
        $('#'+this.id).css('color', 'var(--yellow-l)');
        mapPath.push(this.id);
      });

      // Autopilot
      $("#060060").unbind("click").click(function(){
        $('#'+this.id).css('color', 'var(--yellow-d)');
        // alert(this.id);
        if($("#Autopilot_CheckBox").is(":checked")){
          MainAGV_GETAWAY(-1001);
        }
      });
    }
  }
}

$(function () {
  $("#map").mouseout(function(){
    clearSubPoint();
  });

  readyObject();
  loadingStatus();
  buildPreviewList();
  setInterval("loadingStatus()", 500);
});