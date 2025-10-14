import express, { Router } from "express";
import {
    listCountries,
    getCountry,
    addCountry,
    editCountry,
} from "../controllers/countryController.js";

const countryRouter: Router = express.Router();

countryRouter.get("/countries", listCountries);
countryRouter.get("/countries/:id", getCountry);

countryRouter.post("/countries", addCountry);
countryRouter.put("/countries/:id", editCountry);

export default countryRouter;
