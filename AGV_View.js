const Component = React.Component
//const render = ReactDOM.render
/**
 * Used to calling backend API.
 * @param {string} request  
 * Request backend file (xxx.php).
 * @param {JSON} datajson 
 */
function ajax_request(request, datajson){
    var requestURL = "http://127.0.0.1/AGV-API/src/API/ajax_" + request + ".php";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', requestURL, true);
    xmlhttp.setRequestHeAGV-Viewer("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(datajson));
    return xmlhttp;
}
/**
 * Used to calling backend API.
 * @param {int} code  
 * Request backend file (xxx.php).
 * @param {JSON} jParam 
 */
function code_resolver(code, jParam) {
    // switch (code){
    //     case 0:

    // }
}


class Container extends Component {
    state = {
        height: 7,
        width: 7,
        O_grid: [
            [{x: "000", y: "000"}, {x: "000", y: "010"}, {x: "000", y: "020"}, {x: "000", y: "030"}, {x: "000", y: "040"}, {x: "000", y: "050"}, {x: "000", y: "060"}],
            [{x: "010", y: "000"}, {x: "010", y: "010"}, {x: "010", y: "020"}, {x: "010", y: "030"}, {x: "010", y: "040"}, {x: "010", y: "050"}, {x: "010", y: "060"}],
            [{x: "020", y: "000"}, {x: "020", y: "010"}, {x: "020", y: "020"}, {x: "020", y: "030"}, {x: "020", y: "040"}, {x: "020", y: "050"}, {x: "020", y: "060"}],
            [{x: "030", y: "000"}, {x: "030", y: "010"}, {x: "030", y: "020"}, {x: "030", y: "030"}, {x: "030", y: "040"}, {x: "030", y: "050"}, {x: "030", y: "060"}],
            [{x: "040", y: "000"}, {x: "040", y: "010"}, {x: "040", y: "020"}, {x: "040", y: "030"}, {x: "040", y: "040"}, {x: "040", y: "050"}, {x: "040", y: "060"}],
            [{x: "050", y: "000"}, {x: "050", y: "010"}, {x: "050", y: "020"}, {x: "050", y: "030"}, {x: "050", y: "040"}, {x: "050", y: "050"}, {x: "050", y: "060"}],
            [{x: "060", y: "000"}, {x: "060", y: "010"}, {x: "060", y: "020"}, {x: "060", y: "030"}, {x: "060", y: "040"}, {x: "060", y: "050"}, {x: "060", y: "060"}],
        ],
        grid: [
            [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}],
            [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 1, y: 6}],
            [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}, {x: 2, y: 5}, {x: 2, y: 6}],
            [{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 3, y: 6}],
            [{x: 4, y: 0}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 4, y: 6}],
            [{x: 5, y: 0}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 5, y: 6}],
            [{x: 6, y: 0}, {x: 6, y: 1}, {x: 6, y: 2}, {x: 6, y: 3}, {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}],
        ],
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
        AGV: [
            "ITRI_3-1", 
            "ITRI_3-2", 
            "ITRI_3-3",
            "ITRI_3-4",
        ]
    };
    render() {
        return (
            <div
                className="AGV-View-Container">
                <div className="AGV-View-Container-main">
                    <div className="AGV-View-Container-grid">
                        <Grid 
                            {...this.state}
                        />
                    </div>
                </div>
                <div className="AGV-View-Container-controls">
                    {/* <Controls
                        {...this.state}
                    /> */}
                </div>
            </div>    
        );
    }
}

function Grid(props){
    let grid = [];
    for (let i=0; i<props.height; ++i){
        let grid_y = [];
        for(let j=0;j<props.width; ++i){
            grid_y.push(
                //<td id={props.O_grid[i][j].x+props.O_grid[i][j].y} className={props.unWalk.indexOf(props.O_grid[i][j].x+props.O_grid[i][j].y)!=-1 ? "unWalk" : "Walk"}></td>
                <td className="Walk"></td>
            )
        }
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

function Controls(props) {
    const active = props.points[props.activePoint]
    const step = props.grid.snap ? props.grid.size : 1
    
    let params = []
    
    if (active.q) {
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Control point X position"
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.q.x }
                    onChange={ (e) => props.setQuAGV-ViewraticPosition("x", e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Control point Y position"
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.q.y }
                    onChange={ (e) => props.setQuAGV-ViewraticPosition("y", e) } />
            </div>
        )
    } else if (active.c) {
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="First control point X position"
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.c[0].x }
                    onChange={ (e) => props.setCubicPosition("x", 0, e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="First control point Y position"
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.c[0].y }
                    onChange={ (e) => props.setCubicPosition("y", 0, e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Second control point X position"
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.c[1].x }
                    onChange={ (e) => props.setCubicPosition("x", 1, e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Second control point Y position"
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.c[1].y }
                    onChange={ (e) => props.setCubicPosition("y", 1, e) } />
            </div>
        )
    } else if (active.a) {
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="X RAGV-Viewius"
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.a.rx }
                    onChange={ (e) => props.setArcParam("rx", e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Y RAGV-Viewius"
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.a.ry }
                    onChange={ (e) => props.setArcParam("ry", e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Rotation"
                    type="range"
                    min={ 0 }
                    max={ 360 }
                    step={ 1 }
                    value={ active.a.rot }
                    onChange={ (e) => props.setArcParam("rot", e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Large arc sweep flag"
                    type="checkbox"
                    checked={ active.a.laf }
                    onChange={ (e) => props.setArcParam("laf", e) } />
            </div>
        )
        params.push(
            <div className="AGV-View-Controls-container">
                <Control
                    name="Sweep flag"
                    type="checkbox"
                    checked={ active.a.sf }
                    onChange={ (e) => props.setArcParam("sf", e) } />
            </div>
        )
    }
        
    return (
        <div className="AGV-View-Controls">
            <h3 className="AGV-View-Controls-title">
                AGV Status
            </h3>
            <div className="AGV-View-Controls-container">
                <Control
                    name="Name"
                    type="text"
                    value={ props.w }
                    onChange={ (e) => props.setWidth(e) } />
                <Control
                    name="Battery"
                    type="text"
                    value={ props.h }
                    onChange={ (e) => props.setHeight(e) } />
            </div>
            <h3 className="AGV-View-Controls-title">
                AGV Position
            </h3>
            <div className="AGV-View-Controls-container">
                <Control
                    name="Map-X"
                    type="text"
                    value={ props.grid.size }
                    onChange={ (e) => props.setGridSize(e) } />
                <Control
                    name="Map-Y"
                    type="text"
                    value={ props.grid.size }
                    onChange={ (e) => props.setGridSnap(e) } />
                <Control
                    name="Map-Yaw"
                    type="text"
                    value={ props.grid.size }
                    onChange={ (e) => props.setGridShow(e) } />
            </div>
            <div className="AGV-View-Controls-container">
                <Control
                    type="button"
                    action="reset"
                    value="Reset path"
                    onClick={ (e) => props.reset(e) } />
            </div>
                    
            <h3 className="AGV-View-Controls-title">
                Selected point
            </h3>
            
            { props.activePoint !== 0 && (
                <div className="AGV-View-Controls-container">
                    <Control
                        name="Point type"
                        type="choices"
                        id="pointType"
                        choices={[
                            { name: "L", value: "l", checked: (!active.q && !active.c && !active.a) },
                            { name: "Q", value: "q", checked: !!active.q },
                            { name: "C", value: "c", checked: !!active.c },
                            { name: "A", value: "a", checked: !!active.a }
                        ]}
                        onChange={ (e) => props.setPointType(e) } />
                </div>
            )}
            <div className="AGV-View-Controls-container">
                <Control
                    name="Point X position"
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.x }
                    onChange={ (e) => props.setPointPosition("x", e) } />
            </div>
            <div className="AGV-View-Controls-container">
                <Control
                    name="Point Y position"
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.y }
                    onChange={ (e) => props.setPointPosition("y", e) } />
            </div>
            
            { params }
            
            { props.activePoint !== 0 && (
                <div className="AGV-View-Controls-container">
                    <Control
                        type="button"
                        action="delete"
                        value="Remove this point"
                        onClick={ (e) => props.removeActivePoint(e) } />
                </div>
            )}
        </div>
    )
}

function Control(props) {
    const {
        name,
        type,
        ..._props
    } = props

    let control = "", label = ""

    switch (type) {
        case "range": control = <Range { ..._props } />
        break
        case "text": control = <Text { ..._props } />
        break
        case "checkbox": control = <Checkbox { ..._props } />
        break
        case "button": control = <Button { ..._props } />
        break
        case "choices": control = <Choices { ..._props } />
        break
    }

    if (name) {
        label = (
            <label className="AGV-View-Control-label">
                { name }
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

function Choices(props) {
    let choices = props.choices.map((c, i) => {
        return (
            <label className="AGV-View-Choice">
                <input
                    className="AGV-View-Choice-input"
                    type="rAGV-Viewio"
                    value={ c.value }
                    checked={ c.checked }
                    name={ props.id }
                    onChange={ props.onChange } />
                <div className="AGV-View-Choice-fake">
                    { c.name }
                </div>
            </label>
        )
    })
    
    return (
        <div className="AGV-View-Choices">
            { choices }
        </div>
    )
}

function Button(props) {    
    return (
        <button
            className={
                "AGV-View-Button" +
                (props.action ? "  AGV-View-Button--" + props.action : "")
            }
            type="button"
            onClick={ props.onClick }>
            { props.value }
        </button>
    )
}
function Checkbox(props) {    
    return (
        <label className="AGV-View-Checkbox">
            <input
                className="AGV-View-Checkbox-input"
                type="checkbox"
                onChange={ props.onChange }
                checked={ props.checked } />
            <div className="AGV-View-Checkbox-fake" />
        </label>
    )
}
function Text(props) {
    return (
        <input
            className="AGV-View-Text"
            type="text"
            value={ props.value }
            onChange={ props.onChange } />
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
                onChange={ props.onChange } />
            <input
                className="AGV-View-Range-text  AGV-View-Text"
                type="text"
                value={ props.value }
                onChange={ props.onChange } />
        </div>
    )
}

ReactDOM.render(
  <Container />,
  document.getElementById('app')
);

function tick() {
    const element = (
      <div>
        <h2>{new Date().toLocaleTimeString()}</h2>
      </div>
    );
    // highlight-next-line
    ReactDOM.render(element, document.getElementById('time'));
}
  
setInterval(tick, 10);
