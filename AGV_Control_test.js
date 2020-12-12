var requestDATAURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_AGVStatus.php";

function POST_AGV_DATA_API(name, cmd){
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
            console.log(xhr.status);
            console.log(thrownError);
        },
        timeout: 3000
    });
    return request;
}

var requestGETAWAYURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_AGVGetaway.php";

function POST_AGV_GETAWAY_API(name, cmd){
    console.log(name + " : " + cmd);
    var dataJSON = {};
    dataJSON["Name"] = name;
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
            // console.log(xhr.status);
            // console.log(thrownError);
        },
        timeout: 3000
    });
    return request;
}

var AGV_Name = "IREI_3-1";

var Services = [
    { Name: "ITRI_3-1", isLoading: true},
];

var AGV = [];

var yPosition = [18, 94, 172, 249, 327, 406, 484];
var xPosition = [12, 89, 167, 245, 325, 402, 480];

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

function moveTo(id, position, yaw){
    $("#"+id).css({
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
    agv_x = parseInt(data['Config']["Attitude"]['Code'][4]);
    agv_y = parseInt(data['Config']["Attitude"]['Code'][1]);
    $('#AGV_X').val(data['Config']["Attitude"]['Code'][4]);
    $('#AGV_Y').val(data['Config']["Attitude"]['Code'][1]);
    $('#AGV_Yaw').val(absYawName(parseInt(data['Config']["Attitude"]['Yaw'])));
}

function loadingStatus(services){
    Services.map((_Sv, i) => {
        if(_Sv.isLoading){
            var API_data = AGV[_Sv.Name] = POST_AGV_DATA_API(_Sv.Name, 1);
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

function AGV_GETAWAY(cmd){
    //console.log(cmd);
    var response = POST_AGV_GETAWAY_API(AGV_Name, cmd);
    console.log(response);
}

var agv_x = 2, agv_y = 4;

// loadingStatus(Services);
$(document).ready( function(){
    //loadingStatus('Services');
    setInterval("loadingStatus('Services')", 500);
} );



// var grid = [[1,2,0,0,0,1,1,1],
//             [1,1,0,0,0,0,2,2],
//             [1,1,0,0,0,0,2,2],
//             [1,1,0,0,0,0,0,2],
//             [1,0,0,0,0,0,0,2],
//             [1,0,0,0,0,0,0,1],
//             [1,0,0,0,0,0,0,1],];
var grid = [[1,1,0,0,1,1,1],
            [1,1,0,0,0,1,1],
            [1,1,0,0,0,1,1],
            [1,1,0,0,0,0,1],
            [1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1],];

var s_Path = [];
var subPoint = `<i class="fas fa-genderless"></i>`;
var mainPoint = `<i class="far fa-dot-circle"></i>`;
var lastPath = [];
function clearLastPath(path_Arr){
    path_Arr.map((p, i)=>{
        p.innerHTML = "";
    });
}
// function drawPathPoints(path_Arr, _cLP){
//     _cLP(lastPath);
//     for(var i=1;i<path_Arr.length;++i){
//         console.log(path_Arr[i]);
//         var walk = document.getElementById("0"+path_Arr[i].y+"00"+path_Arr[i].x+"0");
//         lastPath.push(walk);
//         walk.innerHTML = (i==(path_Arr.length-1) ? mainPoint : subPoint);
//     }
// }
// var subSearchPath = function( path ) {
//     if (path === null ) {
//         console.log("Path was not found.");
//     } else if(path.length == 0){
//         console.log("is Now Path");
//     }else {
//         console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);
//         //console.log(path);
//         s_Path = path;
//     }
// };
// function searchPath(x, y, _dPP){
//     var easystar = new EasyStar.js();
//     easystar.setGrid(grid);
//     easystar.setAcceptableTiles([0]);
//     easystar.findPath(agv_x, agv_y, x, y, subSearchPath);
//     easystar.setIterationsPerCalculation(1000);
//     easystar.calculate();
//     _dPP(s_Path, clearLastPath);
// }

// function drawPath(x, y, _sp){
//     // var Path = [];
//     //console.log(x + ", " + y);
//     searchPath(x, y, drawPathPoints);
//     //setTimeout(Path = searchPath(parseInt(e.id[4]), parseInt(e.id[1])),100);
//     //console.log(Path);
//     // drawPoint(x, y, function (_x, _y){
//     //     var easystar = new EasyStar.js();
//     //     easystar.setGrid(grid);
//     //     easystar.setAcceptableTiles([0]);
//     //     easystar.findPath(agv_x, agv_y, _x, _y, subSearchPath);
//     //     easystar.setIterationsPerCalculation(1000);
//     //     easystar.calculate();
//     //     return s_Path;
//     // });
//     // s_Path = Path = [];
// }

var subSearchPath = function( path ) {
    if (path === null ) {
        console.log("Path was not found.");
    } else if(path.length == 0){
        console.log("is Now Path");
    }else {
        console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);
        //console.log(path);
        s_Path = path;
        lastPath.map((p, i)=>{
            p.innerHTML = "";
        });
        for(var i=1;i<path.length;++i){
            console.log(path[i]);
            var walk = document.getElementById("0"+path[i].y+"00"+path[i].x+"0");
            lastPath.push(walk);
            walk.innerHTML = (i==(path.length-1) ? mainPoint : subPoint);
            if(i==(path.length-1)){
                var timer=null;
                walk.addEventListener('click',function(e){
                    clearTimeout(timer);
                    timer=setTimeout(function(){//初始化一個延時
                        console.log("1");
                        // console.log(e);
                    },250)
                },false);
                walk.addEventListener('dblclick',function(){//雙擊事件會先觸發兩次單擊事件，然後再執行雙擊事件，使用清除定時器來達到雙擊只執行雙擊事件的目的
                    clearTimeout(timer);
                    console.log("2");
                },false);
            }
        }
        
    }
};
function drawPath(x, y){
    var easystar = new EasyStar.js();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    easystar.findPath(agv_x, agv_y, x, y, subSearchPath);
    easystar.setIterationsPerCalculation(1000);
    easystar.calculate();
}

// function drawPath(x, y){
//     console.log("("+x+", "+y+")");
// }