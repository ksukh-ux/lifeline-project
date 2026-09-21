import "dotenv/config";
import { applySchema, db } from "./index.js";
import { runDataMigrations } from "./migrateCategories.js";

applySchema();
runDataMigrations(db);
console.log("Datenbank-Schema angewendet.");
