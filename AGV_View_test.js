const Component = React.Component

var mainAGV = "ITRI_3-3";

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = props;
        console.log(this.state);
    }

    setMainAGV = (e) => {
        //console.log("setMainAGV : " + e.target.value);
        mainAGV = e.target.value;
        Services.map((_agv, i) => {
            var agv_ob = document.getElementById(_agv.Name);
            //console.log(agv_ob);
            agv_ob.classList.remove("AGV-main");
        });
        var mainAGV_ob = document.getElementById(mainAGV);
        mainAGV_ob.classList.add("AGV-main");
        //updateControls(mainAGV, AGV[mainAGV_ob]);
    }

    setAGVLoading = (e) => {
        Services.map((_Sv, i) => {
            if(_Sv.Name == mainAGV){
                Services[i].isLoading = !Services[i].isLoading;
            }
        });
        //console.log(Services);
    }   
    
    render() {
        return (
            <div className="ad-Container">
                <div className="ad-Container-main">
                    <div className="ad-Container-svg">
                        {/* <canvas id="AGV-View" className="AGV-canvas">你的瀏覽器不支援 canvas!</canvas> */}
                        <Grid
                            id="map"
                            {...this.state}
                        />
                    </div>
                </div>
                <div className="ad-Container-controls">
                    <Controls
                        setMainAGV={ this.setMainAGV }
                        setAGVLoading={ this.setAGVLoading }
                        {...this.state}
                    />
                </div>
            </div>
        )
    }
}

function Grid(props) {
    console.log(props);
    let grid = [];
    for (let i=0; i<props.height; ++i){
        let grid_y = [];
        for(let j=0;j<props.width; ++j){
            let name="0"+String(i)+"00"+String(j)+"0";
            let icon = [];
            if(name == "000000"){
                props.Services.map((_Sv, i) => {
                    console.log(_Sv['Name']);
                    icon.push({id: _Sv['Name'], className: "icon-AGV-Car AGV", });
                });
            }
            let className = "square " + (props.unWalk.indexOf(name) != -1 ? "unWalk" : "Walk");
            if(props.Power.indexOf(name) != -1){
                icon.push({id: "power", className: "fa-charging-station", });
            }
            if(props.PowerUnwalk.indexOf(name) != -1){
                icon.push({id: "powerUnwalk", className: "fa-plug tf90", });
            }
            
            grid_y.push(
                <Square 
                    name={name}
                    className={className}
                    icon={icon}
                />
            )
        }
        grid.push(
            <tr>
                {grid_y}
            </tr>
        );
    }
    return (
        <table id={props.id} className="ad-Container-table">
            <tbody>
                { grid }
            </tbody>
        </table>
    );
}

function Square(props){
    const {
        name,
        className,
        icon,
    } = props;
    let Icons = icon.map((_icon, i) => {
        return (
            <DynamicIcon 
                id={_icon.id}
                className={_icon.className}
            />
        )
    });
    return (
        <td id={name} className={className}>
            { Icons }
        </td>
    );
}

function DynamicIcon(props){
    return (
        <i id={props.id} className={"dynamic-i fas " + props.className}></i>
    );
}

function Icon(props){
    const {
        name,
        index,
        length,
    } = props;
    let icon = "fas";
    switch(name){
        case "power": icon+=" fa-charging-station";
        break;
        case "powerunwalk": icon+=" fa-plug tf90";
        break;
        case "AGV-main": icon+=" icon-AGV-Car AGV-main";
        break;
        case "AGV": icon+=" icon-AGV-Car AGV";
        break;
        case "Shelf": icon+=" icon-AGV-Shelf";
        break;
    }
    return (
        <i className={icon + (length>1 ? " fa-stack-" + (length-index) + "x" : "")}></i>
    )
}

/* * *
* Controls
* * */

function Controls(props) {
    //console.log(props);
    return (
        <div className="ad-Controls">
            <h3 className="ad-Controls-title">
                AGV
            </h3>
            <div className="ad-Controls-container">
                <Control
                    name="Service"
                    type="choices"
                    id="AGVName"
                    choices={[
                        {name: "ITRI_3-1", value: "ITRI_3-1"},
                        {name: "ITRI_3-2", value: "ITRI_3-2"},
                        {name: "ITRI_3-3", value: "ITRI_3-3"},
                        {name: "ITRI_3-4", value: "ITRI_3-4"},
                    ]}
                    onChange={(e) => props.setMainAGV(e)}
                />
            </div>
            <h3 className="ad-Controls-title">
                Status
            </h3>
            <div className="ad-Controls-container">
                <Control
                    js_id="AGV_Battery"
                    name="Battery"
                    type="text"
                    value={ "Disconnect" }
                />
                <Control
                    js_id="AGV_IsProgress"
                    name="IsProgress"
                    type="text"
                    value={ "false" }
                />
                <Control
                    name="Loading"
                    type="checkbox"
                    checked={ true }
                    onChange={ (e) => props.setAGVLoading(e) }
                />
            </div>
            <div className="ad-Controls-container">
                <Control
                    js_id="AGV_X"
                    name="X"
                    type="text"
                    value={ 2 }
                />
                <Control
                    js_id="AGV_Y"
                    name="y"
                    type="text"
                    value={ 4 }
                />
                <Control
                    js_id="AGV_Yaw"
                    name="Yaw"
                    type="text"
                    value={ 180 }
                />
            </div>
            <h3 className="ad-Controls-title">
                Shelf
            </h3>
            <div className="ad-Controls-container">
                <Control
                    name="X"
                    type="text"
                    value={ 0 }
                />
                <Control
                    name="y"
                    type="text"
                    value={ 0 }
                />
                <Control
                    name="Yaw"
                    type="text"
                    value={ 90 }
                />
            </div>
            <h3 className="ad-Controls-title">
                Control
            </h3>
            <div className="ad-Controls-container">
                <Control
                    type="button"
                    action="reset"
                    value="左轉"/>
                <Control
                    type="button"
                    action="reset"
                    value="前進"/>
                <Control
                    type="button"
                    action="reset"
                    value="右轉"/>
            </div>
            <div className="ad-Controls-container">
                <Control
                    type="button"
                    action="reset"
                    value="左轉"/>
                <Control
                    type="button"
                    action="reset"
                    value="前進"/>
                <Control
                    type="button"
                    action="reset"
                    value="右轉"/>
            </div>
        </div>
    )
}

function Control(props) {
    const {
        js_id,
        name,
        type,
        ..._props
    } = props;

    let control = "", label = "";

    switch (type) {
        case "range": control = <Range { ...props } />
        break;
        case "text": control = <Text { ...props } />
        break;
        case "checkbox": control = <Checkbox { ..._props } />
        break;
        case "button": control = <Button { ..._props } />
        break;
        case "choices": control = <Choices { ..._props } />
        break;
    }
    if(name) {
        label = (
            <label className="ad-Control-label">
                {name}
            </label>
        )
    }

    return (
        <div className="ad-Control">
            { label }
            { control }
        </div>
    )
}

function Label(props) {
    return (
        <label className="AGV-View-Control-label">
            {props.name}
        </label>
    )
}

function Choices(props) {
    let choices = props.choices.map((c, i) => {
        return (
            <label className="ad-Choice">
                <input 
                    id={ props.js_id }
                    className="ad-Choice-input"
                    type="radio"
                    value={ c.value }
                    name={ props.id }
                    onChange={ props.onChange }
                />
                <div className="ad-Choice-fake">
                    { c.name }
                </div>
            </label>
        )
    });
    return (
        <div className="ad-Choices">
            { choices }
        </div>
    );
}

function Button(props) {
    return (
        <button 
            id={ props.js_id }
            className={
                "ad-Button" + (props.action ? "  ad-Button--" + props.action : "")
            }
            type="button"
            onClick={ props.onClick }
        >
            { props.value }
        </button>
    );
}

function Checkbox(props) {
    return (
        <label className="ad-Checkbox">
            <input 
                id={ props.js_id }
                className="ad-Checkbox-input"
                type="checkbox"
                onChange={ props.onChange }
                checked={ props.checked }
            />
            <div className="ad-Checkbox-fake" />
        </label>
    );
}

function Text(props) {
    return (
        <input 
            id={ props.js_id }
            className="ad-Text"
            type="text"
            value={ props.value }
            onChange={ props.onChange }
        />
    )
}

function Range(props) {
    return (
        <div className="ad-Range">
            <input
                id={ props.js_id }
                className="ad-Range-input"
                type="range"
                min={ props.min }
                max={ props.max }
                step={ props.step }
                value={ props.value }
                onChange={ props.onChange }
            />
            <input 
                className="ad-Range-text  ad-Text"
                type="text"
                value={ props.value }
                onChange={ props.onChange }
            />
        </div>
    )
}

var state = {
    height: 7,
    width: 7,
    unWalk: [
        "000000", 
        "000040", 
        "000050", 
        "000060", 
        "010000", 
        "010010", 
        "020000", 
        "020010", 
        "030000", 
        "030010", 
        "040000", 
        "050000", 
        "050060", 
        "060000", 
        "060060", 
    ],
    Power: [
        "060050",
    ],
    PowerUnwalk: [
        "060060",
    ],
}

var Services = [
    { Name: "ITRI_3-1", isLoading: false},
    { Name: "ITRI_3-2", isLoading: false},
    { Name: "ITRI_3-3", isLoading: true},
    { Name: "ITRI_3-4", isLoading: false},
];


ReactDOM.render(
    <Container 
        Services={Services}
        {...state}
    />,
    document.getElementById('app')
);

var requestURL = "http://127.0.0.1/AGV/AGV-API/src/API/ajax_AGVStatus.php";

function POST_AGV_API(name, cmd){
    var dataJSON = {};
    dataJSON["Name"] = name;
    dataJSON["Cmd"] = cmd;
    var request;
    $.ajax({
        url: requestURL,
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
        }
    });
    return request;
}

var AGV = [{}, {}, {}, {}];

var xPosition = [5, 54, 102,151, 202, 249, 298];
var yPotision = [8, 58, 107, 156, 205, 254, 303];

function absYaw(yaw){
    while(yaw<0)yaw+=360;
    yaw = yaw%361;
    yaw = Math.round(yaw/90)*90;
    return yaw;
}

function moveAGV(id, position, yaw){
    var AGV = document.getElementById(id);
    AGV.style.top = xPosition[parseInt(position[1])]+"px";
    AGV.style.left = xPosition[parseInt(position[4])]+"px";
    AGV.style.transform = `rotate(${absYaw(parseInt(yaw))}deg)`;
}

function moveTo(id, position, yaw){
    $("#"+id).css({
        top: xPosition[parseInt(position[1])]+"px", 
        left: yPotision[parseInt(position[4])]+"px",
        transform: `rotate(${absYaw(parseInt(yaw))}deg)`,
    });
}

function updateMainAGV(id){
    updateControls(id, AGV[id]);
}
function updateControls(id, data){
    console.log(id + ": " + data);
    $('#AGV_Battery').val(data["Battery"]);
    $('#AGV_IsProgress').val(data["Battery"]);
    $('#AGV_X').val(data["Attitude"]['Code'][1]);
    $('#AGV_Y').val(data["Attitude"]['Code'][4]);
    $('#AGV_Yaw').val(data["Attitude"]['Yaw']);
}

function loadingStatus(services){
    var AGV = [];
    Services.map((_Sv, i) => {
        if(_Sv.isLoading){
            AGV[_Sv.Name] = POST_AGV_API(_Sv.Name, 0);
            var data = AGV[_Sv.Name]['Config'];
            
            //console.log(data);
            if(AGV[_Sv.Name]['StatusCode'] == 0){
                updateControls(_Sv.Name, data);
                var agv_ob = document.getElementById(_Sv.Name);
                
                moveTo(_Sv.Name, data['Attitude']["Code"], data['Attitude']["Yaw"]);
                //console.log(_Sv.Name + ": " + AGV[_Sv.Name]);
                if(agv_ob.classList.contains('AGV-main')){
                    updateControls(_Sv.Name, data);
                }
            }
        }
    });
}

loadingStatus(Services);

// $(document).ready( function(){
//     //loadingStatus('Services');
//     setInterval("loadingStatus('Services')", 1000);
// } );



// function tick() {
//     const element = (
//       <div>
//         <h2>{new Date().toLocaleTimeString()}</h2>
//       </div>
//     );
//     // highlight-next-line
//     ReactDOM.render(element, document.getElementById('time'));
// }

//setInterval(tick, 1000);