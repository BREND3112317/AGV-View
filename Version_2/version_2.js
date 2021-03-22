let PowerPosition = "060050";
let Power = "060060";
Autopilot_Path = [];

window.modal = {
    alert: function (title, data) {
        console.log("alert - " + title, data);
    }
}


window.system = {
    ajax_request: function (url, datajson, callback = {}) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.onreadystatechange = function () {
            if(xmlhttp.readyState !== 4) return ;
            var data;
            try {
                data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                console.log("ajax_request - JSON.parse error message: ", err);
            }
            if(xmlhttp.status === 200){
                if(typeof data.code !== "undefined") {
                    if(data.code === 0) {
                        if(typeof(callback.success) !== "undefined") {
                            callback.success(data.data);
                        }else{
                            callback_success(data.data);
                        }
                    }else {
                        if(typeof(callback.failed) !== "undefined") {
                            callback.failed(data.data);
                        }else{
                            callback_failed(data.data);
                        }
                    }
                }
            }else{
                modal.alert("code: "+xmlhttp.state, data);
            }
        }
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(datajson));
        return xmlhttp;
    },
    check_request: function (data){

    },
    callback_success: function (data) {
        console.log("this.system_success", data);
    },
    callback_failed: function (data) {
        console.log("this.system_failed", data);
    }
}

window.Control = {
    requestDATAURL: "/AGV/AGV-API/src/API/ajax_AGVStatus.php",
    requestGETAWAYURL: "/AGV/AGV-API/src/API/ajax_AGVGetaway.php",
    service: [
        {name: 'AGV_1', id: 'ITRI_3-1', type: "AGV",   code: "000000", yaw: 0   , show: true   , isLoading: false , disable: false},
        {name: 'AGV_2', id: 'ITRI_3-2', type: "AGV",   code: "000000", yaw: 0   , show: false  , isLoading: false , disable: true },
        {name: 'AGV_3', id: 'ITRI_3-3', type: "AGV",   code: "000000", yaw: 0   , show: true   , isLoading: true  , disable: false},
        {name: 'AGV_4', id: 'ITRI_3-4', type: "AGV",   code: "000000", yaw: 0   , show: false  , isLoading: false , disable: true },
        {name: 'Shelf_1', id: "Shelf1", type: 'Shelf', code: "040010", show: true   , isLoading: false , disable: false},
        {name: 'Shelf_2', id: "Shelf2", type: 'Shelf', code: "050010", show: true   , isLoading: false , disable: false},
        {name: 'Shelf_3', id: "Shelf3", type: 'Shelf', code: "060010", show: true   , isLoading: false , disable: false},
    ],
    obj: [
      {name: "powerPosition", type: "power", code: "060050"},
      {name: "power", type: "power", code: "060060"},
    ],
    main: 2,
    map: [ 
      [-1,-2, 0, 0,-1,-1,-1],
      [-1,-1, 0, 0, 0,-2,-2],
      [-1,-1, 0, 0, 0,-2,-2],
      [-1,-1, 0, 0, 0, 0,-2],
      [-1, 0, 0, 0, 0, 0,-2],
      [-1, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0,-1],
    ],

    setMain: function (name) {
      for(var sv in this.service) {
        if(this.service[sv].name == name){
          this.main = sv;
          console.log("Control.setMain", this.main);
        }
      }
    },

    getAGVPost: function (name, code, callback) {
      system.ajax_request(this.requestDATAURL,
      {
        name: name,
        Cmd, code,
      },
      {
        success: callback.success,
        failed: callback.failed,
      });
    },
    pre_AGVGateway: function (name, code, param = new Array) {
      // if(typeof param == "undefined"){
      //   param = [];
      // }
      // console.log("Debug - param", param);
      system.ajax_request(this.requestGETAWAYURL, 
        {
            Name: name,
            Cmd: code,
            Param: param,
        },
        {
            success: function (data) {
                console.log("AGVGateway - success", data);
                
            },
            failed: function (data) {
                console.log("AGVGateway - failed", data);
            }
        });
    },
    pre_getAGVStatus: function (name, code) {
        system.ajax_request(this.requestDATAURL, 
        {
            Name: name,
            Cmd: code,
        },
        {
            success: function (data) {
                console.log("getAGVStatus - success", data);
                // console.log("Debug", Control.service[Control.main]);
                Control.setAGVStatus(data);
                builder.update_ControlData(data);
                if (data['StatusCode'] === 0) {
                    builder.setPosition(name, data['Attitude']['Code'], data['Attitude']['Yaw']);
                }
            },
            failed: function (data) {
                console.log("getAGVStatus - failed", data);
            }
        });
    },
    do_getAGVStatus: function (data) {
        console.log(data);
        
    },

    setAGVStatus: function(data) {
      Control.service[Control.main].code = data['Attitude']['Code'];
      Control.service[Control.main].yaw = parseFloat(data['Attitude']['Yaw']);
    },
    getMainAGVStatus: function () {
        this.pre_getAGVStatus(this.service[this.main].id, 0);  
    },

    setAGVPosition: function () {
      var param = {};
      param['code'] = "000020";
      param['yaw'] = 0;
      this.pre_AGVGateway(this.service[this.main].id, -1000, param);
    },
}

window.calculate = {
    Code2Absolute: function (code) {
        return {
            x: parseInt(code[1]), 
            y: parseInt(code[4])
        };
    },
    absYaw: function (yaw) {
        while(yaw<0) yaw+=360;
        yaw = yaw%361;
        yaw = Math.round(yaw/90)*90;
        return yaw%361;
    },
    absYawName: function(yaw){
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
    },
    viewYaw: function(yaw) {
      var _yaw = this.absYaw(yaw);
      switch(_yaw) {
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
}

window.builder = {
    loading: false,
    Absolute_X: [0, 78, 156, 233, 311, 390, 468],
    Absolute_Y: [0, 78, 156, 234, 314, 391, 469],
    update_ControlData: function (data){
      try { // statements to try
        document.getElementById("AGV_Status")       .value = data['StatusCode'];
        document.getElementById("AGV_State")        .value = data['Status']['State'];
        document.getElementById("AGV_IsLiftUp")     .value = data['Status']['IsLiftUp'];
        document.getElementById("AGV_X")            .value = data["Attitude"]['Code'][4];
        document.getElementById("AGV_Y")            .value = data["Attitude"]['Code'][1];
        document.getElementById("AGV_Yaw")          .value = calculate.absYawName(parseInt(data["Attitude"]['Yaw']));
        document.getElementById("AGV_Battery")      .value = data["Battery"];
        document.getElementById("AGV_IsReady")      .value = data['Status']['IsReady'];
        document.getElementById("AGV_IsProgress")   .value = data['AgvLogIndex']['IsProgress'];
        document.getElementById("AGV_IsMoving")     .value = data['Status']['IsMoving'];
        document.getElementById("AGV_IsReady")      .value = data['Status']['IsReady'];

      }
      catch (e) {
        console.log(e); // 將例外傳至例外處理機制
      }
        this.viewMap(data['Map']);
        this.setPreviewPaths(data['Priview']);
    },
    viewMap: function (map) {
      console.log(map);
      $("#map tr").remove();
      for(var i in map){
        var DOM = $(`<tr></tr>`);
        for(var j in map[i]){
          var DOM_i = $(`<td class="square"></td>`);
          DOM_i.attr("id", "0"+i+"00"+j+"0");
          if(map[i][j] >= 0){
            DOM_i.addClass("Walk");
          }else if(map[i][j] < 0){
            DOM_i.addClass("unWalk");
          }
          if(map[i][j] == 12){
            DOM_i.append(`<i id="power" class="static static-i fas fa-charging-station fa-lg" aria-hidden="true"></i>`);
          }else if(map[i][j] == -3){
            DOM_i.addClass("unWalk");
            DOM_i.append(`<i id="powerUnwalk" class="static static-i fas fa-plug tf90 fa-lg" aria-hidden="true"></i>`);
          }
          DOM.append(DOM_i);
        }
        $("#map").append(DOM);
      }
    },
    setPosition: function (id, code, yaw) {
        $('#'+id).css({
            top: this.Absolute_X[parseInt(code[1])]+"px",
            left: this.Absolute_Y[parseInt(code[4])]+"px",
            transform: `rotate(${calculate.absYaw(yaw)}deg)`,
        });
    },
    setAutopilotList: function (pathList) {
        Autopilot_Path = pathList;
    },
    showAutopilotPath: function (code) {
        var length = pathList[code];
        var gradient = length - 1;
        for(var p in pathList[code]) {
            //Autopilot_Path.push()
            console.log(p);
        }
    },
    // clearAutopilotPath: function () {
    //     for(var p in Autopilot_Path){
    //         if((AutopilotPath[p] === PowerPosition) || (AutopilotPath[p] === Power)) {
    //             $('#'+Autopilot_Path[p]).css('color', '');
    //         }else{
    //             $('#'+Autopilot_Path[p]).empty();
    //         }
    //     }
    //     Autopilot_Path = [];
    // },
    basicPrepare: function () { // todo: service radio 沒有吃到onclick function
      var ClassName = "";
      loading_checkBx = false;
      for(var sv in Control.service) {
        $("#"+Control.service[sv].id).remove();
        var DOM = $(`<div class="dynamic-i"><i class="fas" aria-hidden="true"></i></div>`);           
        if(Control.service[sv].type === "AGV"){
          // setControl
            // set service radio
          if(Control.service[sv].disable === true) {
            $("#" + Control.service[sv].id + "_Radio").attr("disabled", true);
          }else{
            $("#" + Control.service[sv].id + "_Radio").on("click", this.setServiceRadio);
            console.log($("#" + Control.service[sv].id + "_Radio"));
          }
          ClassName = "icon-AGV-Car AGV";
          if(sv == Control.main){
            ClassName = ClassName + " AGV-main";
            loading_checkBx = Control.service[sv].isLoading;
          }
          DOM.find(">i").addClass(ClassName);
        }
        if(Control.service[sv].type === "Shelf"){
          ClassName = "icon-AGV-Shelf Shelf";
          DOM.find(">i").addClass(ClassName);
        }
        DOM.attr('id', Control.service[sv].id);
        console.log("new View Object", Control.service[sv].id);
        $("#map").append(DOM);
        this.setPosition(Control.service[sv].id, Control.service[sv].code, 180);
      }

      // set service Radio
      $("#" + Control.service[Control.main].id + "_Radio").attr("checked", true);

      // set IsLoading checkBox
      $("#Loading_CheckBox").on("change", this.setLoading);
      $("#Loading_CheckBox").attr("checked", loading_checkBx);

      // set FOV Lock
      $("#FOVLock_CheckBox").on("change", this.setFovLock);
      $("#map").mouseout(function(){
        builder.clearPreviewPath();
      });
    },
    setServiceRadio: function (e) {
      // console.log(e.target.value);
      $("#" + Control.service[Control.main].id).children().removeClass("AGV-main");
      Control.setMain(e.target.value);
      $("#" + Control.service[Control.main].id).children().addClass("AGV-main");
      $("#Loading_CheckBox").prop("checked", Control.service[Control.main].isLoading);
    },
    setLoading: function (e) {
      Control.service[Control.main].isLoading = $("#Loading_CheckBox").is(":checked");
      console.log(Control.service[Control.main].isLoading);
    },
    setFovLock: function (e) {
      console.log(e.target.checked);
      var yaw = 0;
      if(e.target.checked === true) {
        yaw = Control.service[Control.main].yaw;
      }
      $(".static-map").css('transform', `rotate(${calculate.viewYaw(parseInt(yaw))}deg)`);
      $(".static-i").css('transform', `rotate(${calculate.viewYaw(parseInt(yaw))}deg)`);
    },
    clearPreviewPath: function () {
      for (var point in Autopilot_Path) {
        if(Autopilot_Path[point] == "060050" || Autopilot_Path[point] == "060060") {
          $('#' + Autopilot_Path[point]).css('color', '');
        }else{
          $('#' + Autopilot_Path[point]).empty();
        }
      }
      Autopilot_Path = [];
    },
    setPreviewPaths: function (data) {
      console.log(data);
      var i = 0;
      for (var point in data) {
        if (point == Control.service[Control.main].code) continue;
        $('#' + point).unbind("mouseover").mouseover( function () {
          builder.clearPreviewPath();
          var length = data[this.id].length;
          var index = length - 1;
          data[this.id].map((_code, i) => {
            Autopilot_Path.push(_code);
            if(_code == "060050") {
              $('#' + _code).css('color', 'rgb(81, 207, 102, ' + (index--)/length + ')');
            }else{
              $('#' + _code).append(`<i class="far fa-dot-circle" style="color: rgb(81, 207, 102, ` + (index--)/length + `)"></i>`);
            }
          });

          if (this.id == "060050") {
            $('#' + this.id).css('color', 'var(--green-l)');
          }else{
            var DOM = `<i class="fas fa-bullseye fa-lg static-i" style="color: var(--green-l);"></i>`;
            $(DOM).unbind("click").click(function(){
              $(DOM).css('color', 'var(--green-d)');
            });
            $('#'+this.id).append(DOM);
          }

          $('#' + this.id).unbind("click").click(function(){
            $('#' + this.id).css('color', 'var(--green-d)');
            if($("#Autopilot_CheckBox").is(":checked")){
              console.log("GoPosition", this.id);
            }
          });
          Autopilot_Path.push(this.id);
        });
      }
      if(typeof data['060040'] !== 'undefined'){
        $("#060060").unbind("mouseover").mouseover(function () {
          $("#060050").mouseover();
          $('#' + this.id).css('color', 'var(--yellow-l)');
          Autopilot_Path.push(this.id);
        });

        $("#060060").unbind("click").click(function () {
          $('#' + this.id).css('color', 'var(--yellow-d)');

          if($("#Autopilot_CheckBox").is(":checked")){
            console.log("POST CODE", -1001);
          }
        });
      }
    }
}
document.addEventListener("DOMContentLoaded", function () {
  console.log(builder.Autopilot_Path);
  builder.viewMap();
  builder.basicPrepare();
  // builder.setPreviewPaths();
  Control.getMainAGVStatus();
});