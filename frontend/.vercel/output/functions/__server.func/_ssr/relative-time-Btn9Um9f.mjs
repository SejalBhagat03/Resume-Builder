import { o as __toESM } from "../_runtime.mjs";
import { s as formatRelative } from "./app-shell-q8BzYArD.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/relative-time-Btn9Um9f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RelativeTime({ ts }) {
	const [text, setText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setText(formatRelative(ts));
		const i = setInterval(() => setText(formatRelative(ts)), 3e4);
		return () => clearInterval(i);
	}, [ts]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		suppressHydrationWarning: true,
		children: text
	});
}
//#endregion
export { RelativeTime as t };
