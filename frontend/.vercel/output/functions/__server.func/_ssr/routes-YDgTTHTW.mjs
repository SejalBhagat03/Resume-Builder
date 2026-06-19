import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-YDgTTHTW.js
var $$splitComponentImporter = () => import("./routes-BWu0lrmw.mjs");
var Route = createFileRoute("/")({
	validateSearch: (search) => {
		return {
			create: search.create === true || search.create === "true" || void 0,
			tour: search.tour === true || search.tour === "true" || void 0
		};
	},
	head: () => ({ meta: [{ title: "Dashboard — Resume Builder Pro" }, {
		name: "description",
		content: "Your resume dashboard: continue editing, track ATS score, and create new resumes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
