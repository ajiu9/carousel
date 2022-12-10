
import { createElement, Component} from './framework';
class Div extends Component {
    constructor() {
        super();
        this.root = document.createElement("div");
    }
    render() {
        return document.createElement("div");
    }
}

let a = <div id="a">
    <span>1</span>
    <span>2</span>
    <span>3</span>
</div>;

// document.body.appendChild(a);
a.mountTo(document.body);