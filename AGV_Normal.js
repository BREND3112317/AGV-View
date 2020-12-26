var requestDATAURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_AGVStatus.php";
var requestGETAWAYURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_AGVGetaway.php";

var AGV_Name = "IREI_3-1";

var Services = [
    { Name: "ITRI_3-1", isLoading: true},
];

var AGV = [];

var yPosition = [18, 94, 172, 249, 327, 406, 484];
var xPosition = [12, 89, 167, 245, 325, 402, 480];

function ajax_request(request, datajson){
  var requestURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_" + request + ".php";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', requestURL, true);
  xmlhttp.setRequestHeAGV-Viewer("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify(datajson));
  return xmlhttp;
}
function AGVStatus(name, cmd){
    var dataJSON = {};
    dataJSON["Name"] = name;
    dataJSON["Cmd"] = cmd;
    console.log(JSON.stringify(dataJSON));
    var request = "AGVStatus";
    var requestURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_" + request + ".php";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', requestURL, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(dataJSON));
    return xmlhttp;
}

function AGVGetaway(name, cmd){
    var dataJSON = {};
    dataJSON["Name"] = name;
    dataJSON["Cmd"] = cmd;
    var request = "AGVGetaway";
    var requestURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_" + request + ".php";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', requestURL, true);
    xmlhttp.setRequestHeAGV-Viewer("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(dataJSON));
    return xmlhttp;
}

function absYaw(yaw){
    while(yaw<0)yaw+=360;
    yaw = yaw%361;
    yaw = Math.round(yaw/90)*90;
    return yaw;
}

function absYawName(yaw){
    while(yaw<0)yaw+=360;
    yaw = yaw%361;
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

function moveAGV(AGVName, position, yaw){
    $("#"+AGVName).css({
        top: xPosition[parseInt(position[1])]+"px", 
        left: yPosition[parseInt(position[4])]+"px",
        transform: `rotate(${absYaw(parseInt(yaw))}deg)`,
    });
}

function updateMainAGV(id){
    updateControls(id, AGV[id]);
}

function updateControls(id, data){
    console.log(id + ": " + data);
    $('#AGV_Status').val(data['StatusCode']);
    $('#AGV_Battery').val(data['Config']["Battery"]);
    $('#AGV_IsProgress').val(data['Config']["AgvLogIndex"]['IsProgress']);
    $('#AGV_X').val(data['Config']["Attitude"]['Code'][4]);
    $('#AGV_Y').val(data['Config']["Attitude"]['Code'][1]);
    $('#AGV_Yaw').val(absYawName(parseInt(data['Config']["Attitude"]['Yaw'])));
}

function loadingStatus(services){
    Services.map((_Sv, i) => {
        if(_Sv.isLoading){
            var API_data = AGV[_Sv.Name] = AGVStatus(_Sv.Name, 1);
            if(API_data['code'] == 0){
                var statusCode = API_data['data']['StatusCode'];
                var config = API_data['data']['Config'];
                updateControls(_Sv.Name, API_data['data']);
                //console.log(data);
                if(statusCode == 0){
                    moveTo(_Sv.Name, config['Attitude']["Code"], config['Attitude']["Yaw"]);
                }
            }else{
                
            }
        }
    });
}

function AGV_STATUS(cmd){
    var response = AGVStatus(AGV_Name, cmd);
    console.log(response);
}

function AGV_GETAWAY(cmd){
    var response = AGVGetaway(AGV_Name, cmd);
    console.log(response);
}

$(document).ready( function(){
    setInterval("loadingStatus('Services')", 500);
} );