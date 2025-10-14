// Core
import type { Request, Response, NextFunction } from "express";

// Custom
import {
    createCountry,
    getAllCountries,
    getCountryById,
    updateCountry,
    type Country,
} from "../models/country.js";
import { successResponse } from "../utils/successResponse.js";
import { errorResponse } from "../utils/errorResponse.js";

interface CountryParams {
    id: string;
}

// Check if the data Object is empty
const isDataEmpty = (data: Record<string, any>): boolean => {
    return Object.keys(data).length === 0;
};

// GET /api/v1/countries
export const listCountries = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const countries = await getAllCountries();

        if (!countries || countries.length === 0) {
            return res.status(204).json();
        }

        res.status(200).json(
            successResponse("Country list retrieved successfully", {
                countries,
            })
        );
    } catch (err) {
        next(err);
    }
};

export const getCountry = async (
    req: Request<CountryParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "INVALID_ID",
                        "Country ID must be a number",
                        req.path
                    )
                );
        }

        const country = await getCountryById(id);
        if (!country) {
            return res
                .status(404)
                .json(
                    errorResponse(
                        404,
                        "COUNTRY_NOT_FOUND",
                        `Country with ID${id} not found`,
                        req.path
                    )
                );
        }

        res.status(200).json(
            successResponse("Country details retrieved successfully.", {
                country,
            })
        );
    } catch (err) {
        next(err);
    }
};

export const addCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Middleware here for checking if the user is an authorized admin before proceeding
        //
        const data = req.body as Omit<
            Country,
            "id" | "created_at" | "updated_at"
        >;

        if (!data.name || !data.code || !data.flag_url) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "MISSING_FIELDS",
                        "Name, code, capital, and flag are required.",
                        req.path
                    )
                );
        }

        const newCountry = await createCountry(data);

        res.status(201).json(
            successResponse("Country added successfull.", {
                country: newCountry,
            })
        );
    } catch (err) {
        next(err);
    }
};

export const editCountry = async (
    req: Request<CountryParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        // also middleware here

        const id = parseInt(req.params.id);
        const data = req.body as Partial<
            Omit<Country, "id" | "code" | "created_at" | "updated_at">
        >;

        if (isNaN(id)) {
            return res.status(400).json(errorResponse(400, "INVALID_ID"));
        }

        if (isDataEmpty(data)) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        400,
                        "NO_DATA",
                        "No data provided for update",
                        req.path
                    )
                );
        }

        const updatedCountry = await updateCountry(id, data);
        if (!updatedCountry) {
            return res
                .status(404)
                .json(
                    errorResponse(
                        404,
                        "COUNTRY_NOT_FOUND",
                        `Country with ID ${id} not found`,
                        req.path
                    )
                );
        }

        res.status(200).json(
            successResponse("Country updated successfully.", {
                country: updateCountry,
            })
        );
    } catch (err) {
        next(err);
    }
};
