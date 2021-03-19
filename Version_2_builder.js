const Component = React.Component
const render = ReactDOM.render

class Container extends Component {
    state = {
        w: 7,
        h: 7,
        unwalk: [
            '000010',
            '000040',
            '000050',
            '000060',
            '010000',
            '010010',
            '010050',
            '010060',
            '020000',
            '020010',
            '020050',
            '020060',
            '030000',
            '030010',
            '030060',
            '040000',
            '040060',
            '050000',
            '050060',
            '060000',
            '060060',
        ],
        powerPosition: "060050",
        power: "060060",
        service: [
            {id: "ITRI3-1", type: "AGV"},
            {id: "ITRI3-2", type: "AGV"},
            {id: "ITRI3-3", type: "AGV"},
            {id: "ITRI3-4", type: "AGV"},
        ],
    };
    render () {
        return (
            <Service
                services = {state.service}
            />
        )
    }
}

class Service {
    render () {
        const {
            service
        } = this.props;
        let obj = [];
        service.map((i) => {
            if(i.type === "AGV"){
                obj.push(
                    <AGV 
                        id={i.name}
                    />
                )
            }
        })
        return (
            {obj}
        )
    }
}

class AGV {
    render () {
        const {
            id,
        } = this.props;
        return (
            <div className={id}
            >
                <Icon 
                    display={"none"}
                    basicClass={"AGV icon-AGV-Car"}
                />
            </div>
        )
    }
}

function Icon (props) {
    return (
        <i 
            className={
                "fas" + props.basicClass
            }
            aria-hidden={"true"}
            display={props.display}>
        </i>
    )
}

// class Icon {
//     render () {
//         const {
//             display,
//             basicClass,
//         } = this.props
//         return (
//             <i 
//                 className={
//                     "fas" + basicClass
//                 }
//                 aria-hidden={"true"}
//                 display={display}>
//             </i>
//         )
//     }
// }
render(
    <Container />,
    document.querySelector("#map")
)
