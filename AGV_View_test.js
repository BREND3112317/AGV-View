const Component = React.Component

class Container extends Component {
    state = {
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
        mainAGV: {
            name: "050030",
        },
        AGV: [
            "000010",
            "030060",
        ],
        Shelf: [
            "010040",
            "010050",
            "010060",
            "050030",
        ],
    };
    // render() {
    //     return (
    //         <div className="AGV-View-Container">
    //             <div className="AGV-View-Container-main">
    //                 <div className="AGV-View-Container-grid">
    //                     <canvas 
    //                         id="map"
    //                         height="600"
    //                         width="600"
    //                     >
    //                         <Grid
    //                             {...this.state}
    //                         />
    //                     </canvas>
    //                 </div>
    //             </div>
    //             <div className="AGV-View-Container-controls">
    //                 <Controls

    //                 />
    //             </div>
    //         </div>
    //     )
    // }
    render() {
        return (
            <div className="AGV-View-Container">
                <div className="AGV-View-Container-main">
                    <div className="AGV-View-Container-grid">
                        <canvas id="AGV-View" className="AGV-canvas">你的瀏覽器不支援 canvas!</canvas>
                        <Grid
                            id="map"
                            {...this.state}
                        />
                    </div>
                </div>
                <div className="AGV-View-Container-controls">
                    <Controls

                    />
                </div>
            </div>
        )
    }
}

function Grid(props) {
    let grid = [];
    for (let i=0; i<props.height; ++i){
        let grid_y = [];
        for(let j=0;j<props.width; ++j){
            let name="0"+String(i)+"00"+String(j)+"0";
            let className = "square " + (props.unWalk.indexOf(name) != -1 ? "unWalk" : "Walk");
            let icon = [];
            if(props.Power.indexOf(name) != -1){
                icon.push("power");
            }
            if(props.PowerUnwalk.indexOf(name) != -1){
                icon.push("powerunwalk");
            }
            //console.log(Square_state);
            // grid_y.push(
            //     <td id={name} className={className} key={(i+1)*props.height+j+1}></td>
            // )
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
        <table id={props.id} className="AGV-View-Container-table">
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
    let Icons = "";
    let obj = icon.map((_icon, i) => {
        //console.log(i);
        return (
            <Icon 
                name={_icon}
                index={i}
                length={icon.length}
            />
        )
    });
    if(icon.length>1){
        // Icons = (
        //     <span className={"icon-stack" + (icon.length>0 ? " fa-" + icon.length + "x" : "")}>
        //         { obj }
        //     </span>
        // );
        Icons = (
            <span className={"fa-stack"}>
                { obj }
            </span>
        );
    }else{
        Icons = obj;
    }
    
    return (
        <td id={name} className={className}>
            { Icons }
        </td>
    )
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
        case "AGV": icon+=" icon-AGV-Car2";
        break;
        case "Shelf": icon+=" icon-AGV-Shelf";
        break;
    }
    //console.log(icon);
    return (
        <i className={icon + (length>1 ? " fa-stack-" + (length-index) + "x" : "")}></i>
    )
}

/* * *
* Controls
* * */

function Controls(props) {
    return (
        <div className="AGV-View-Controls">
            <h3 className="AGV-View-Controls-title">
                AGV
            </h3>

            <div className="AGV-View-Controls-container">
                <Control
                    name="Service"
                    type="choices"
                    id="AGVName"
                    choices={[
                        {name: "ITRI_3-1", value: "itri_3-1"},
                        {name: "ITRI_3-2", value: "itri_3-2"},
                        {name: "ITRI_3-3", value: "itri_3-3"},
                        {name: "ITRI_3-4", value: "itri_3-4"},
                    ]}
                />
            </div>
        </div>
    )
}

function Control(props) {
    const {
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
        //label = <Label name={name} />
        label = (
            <label className="AGV-View-Control-label">
                {name}
            </label>
        )
    }

    return (
        <div className="AGV-View-Control">
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
            <label className="AGV-View-Choice">
                <input 
                    className="AGV-View-Choice-iniput"
                    type="radio"
                    value={ c.value }
                    name={ props.id }
                />
                <div className="AGV-View-Choice-fake">
                    { c.name }
                </div>
            </label>
        )
    });
    return (
        <div className="AGV-View-Choices">
            { choices }
        </div>
    );
}

function Button(props) {
    return (
        <button 
            className={
                "AGV-View-Button" + (props.action ? " AGV-View-Button--" + props.action : "")
            }
            type="button"
        >
            { props.value }
        </button>
    );
}

function Checkbox(props) {
    return (
        <label className="AGV-View-Checkbox">
            <input 
                className="AGV-View-Checkbox-input"
                type="checkbox"
            />
            <div className="AGV-View-fake" />
        </label>
    );
}

function Text(props) {
    return (
        <input 
            className="AGV-View-Text"
            type="text"
            value={ props.value }
        />
    )
}

function Range(props) {
    return (
        <div className="AGV-View-Range">
            <input
                className="AGV-View-Range-input"
                type="range"
                min={ props.min }
                max={ props.max }
                step={ props.step }
                value={ props.value }
            />
            <input 
                className="AGV-View-Range-text AGV-View-Text"
                type="text"
                value={ props.value }
            />
        </div>
    )
}

function AGV_View(header){
    var table = document.getElementById(header);
    var canvas = document.getElementById("AGV-View");
    //console.log(table);
    var xpos = table.clientWidth;
	var ypos = table.clientHeight;
    if(canvas.getContext){
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, xpos, ypos);
        ctx.fill();
        console.log(ctx);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00E676';
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(xpos,ypos);
        ctx.stroke();
        ctx.closePath();
    }
}

// function tick() {
//     const element = (
//       <div>
//         <h2>{new Date().toLocaleTimeString()}</h2>
//       </div>
//     );
//     // highlight-next-line
//     ReactDOM.render(element, document.getElementById('time'));
// }

ReactDOM.render(
    <Container />,
    document.getElementById('app')
);

setTimeout("AGV_View('map')", 1000);
/*
const Component = React.Component

class Container extends Component {
    state = {
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
            "060050"
        ],
    };
    render() {
        return (
            <div className="AGV-View-Container">
                <div className="AGV-View-Container-main">
                    <div className="AGV-View-Container-grid">
                        <Grid 
                            {...this.state}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

function Grid(props){
    let grid = [];
    for (let i=0; i<props.height; ++i){
        let grid_y = [];
        for(let j=0;j<props.width; ++j){
            let Square_state = {
                name: "0"+String(i)+"00"+String(j)+"0",
                className: "square " + (props.unWalk.indexOf(name) != -1 ? "unWalk" : "Walk"),
            }
            // if(props.Power.indexOf(Square_state.name) != -1){
            //     Square_state.icon = "power";
            // }
            //console.log(Square_state);
            grid_y.push(
                <td id={Square_state.name} className={Square_state.className}></td>
                // <Square 
                //     {...Square_state}
                // />
            )
        }
        console.log(grid_y);
        grid.push(
            <tr>
                {grid_y}
            </tr>
        );
    }
    return (
        <table>
            { grid }
        </table>
    );
}

function Square(props){
    // if("icon" in props){
    //     return (
    //         <td id={props.name} className={props.className}>
    //             <Icon 
    //                 {...props}
    //             />
    //         </td>
    //     );
    // }else{
    //     return (
    //         <td id={props.name} className={props.className}></td>
    //     )
    // }
    return (
        <td id={props.name} className={props.className}></td>
    )
}

function Icon(props){
    if(props.icon == "server"){
        return (
            <i className="fas fa-server"></i>
        );
    }
    if(props.icon == "power"){
        return (
            <i className="fas fa-plug"></i>
        );
    }
    return ;
}

ReactDOM.render(
    <Container />,
    document.getElementById('app')
);
*/