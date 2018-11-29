import { Application } from "express";
import { DockerController } from "./docker";
import { HomeController } from "./home";
import { MigrateController } from "./migrate";
import { OptionsController } from "./options";

export function registerRoutes(app: Application): void {
    app.use("/api/options", OptionsController);
    app.use("/api/docker", DockerController);
    app.use("/api/migrate", MigrateController);
    app.use("/*", HomeController);
}
