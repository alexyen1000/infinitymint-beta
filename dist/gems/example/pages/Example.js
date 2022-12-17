"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const HelloWorld_1 = __importDefault(require("../components/HelloWorld"));
function Example() {
    return (<div>
			<HelloWorld_1.default />
		</div>);
}
Example.page = {
    url: "/example",
};
exports.default = Example;
//# sourceMappingURL=Example.js.map