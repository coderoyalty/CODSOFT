import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import BaseController from "./controllers/base.controller";
import errorMiddleWare from "./middlewares/error.middleware";
import config from "./utils/config";

export default class App {
	private static instance: App | null = null;
	private _app: Express;
	private port: number;

	public get app() {
		return this._app;
	}

	private set app(v: Express) {
		this._app = v;
	}

	static endpoints: string[] = [];

	constructor() {
		this._app = express();
		this.initMiddleware();
		this.port = config.PORT;
	}

	injectController(controller: BaseController) {
		let endpoint = controller.endpoint;
		if (endpoint.length > 0 && endpoint[0] === "/") {
			endpoint = endpoint.slice(1);
		}
		if (endpoint.length > 0 && endpoint.at(-1) === "/") {
			endpoint = endpoint.slice(0, -1);
		}

		//TODO: actual controller registration here!
		if (endpoint.length === 0) {
			this.app.use("/api/", controller.router);
		} else {
			this.app.use(`/api/${endpoint}`, controller.router);
		}
	}

	private initMiddleware() {
		this.app.use(
			cors({
				origin: "*",
			}),
		);
		this.app.use(cookieParser(config.COOKIE_SECRET));
		this.app.use(morgan("dev"));
		this.app.use(express.json());
		this.app.use(
			express.urlencoded({
				extended: false,
			}),
		);
	}

	static getInstance() {
		if (!this.instance) {
			console.log(`Application: ✅ created`);
			this.instance = new App();
		}
		return this.instance;
	}

	private initErrHandler() {
		this.app.use(errorMiddleWare);
	}

	public run() {
		this.initErrHandler();

		const server = this.app.listen(this.port, () => {
			const time = new Date().toISOString();
			console.log(
				`[⚡] server started: ${time} => http://localhost:${this.port}/`,
			);
			console.log("Registered endpoints:");
			for (let endpoint of App.endpoints) {
				console.log("\t" + endpoint);
			}
		});

		return server;
	}
}
