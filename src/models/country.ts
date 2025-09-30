import { pool } from "../config/db.js";
import { errorResponse } from "../utils/errorResponse.js";

export interface Country {
    id: number;
    name: string;
    code: string;
    capital: string;
    region: string;
    currency: string;
    flag: string;
    map: string | null;
    similar_flags: string[];
    popular_places: string[];
    created_at: Date;
    updated_at: Date;
}

export const createCountry = async (
    data: Omit<Country, "id" | "created_at" | "updated_at">
): Promise<Country> => {
    const result = await pool.query<Country>(
        `INSERT INTO public.countries
        (name, code, capital, region, currency, flag, map, similar_flags, popular_places)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
            data.name,
            data.code,
            data.capital,
            data.region,
            data.currency,
            data.flag,
            data.map,
            data.similar_flags,
            data.popular_places,
        ]
    );
    return result.rows[0]!;
};

export const getAllCountries = async (): Promise<Country[]> => {
    const result = await pool.query<Country>(
        "SELECT id, name, code, capital, region, flag FROM public.countries ORDER by name"
    );
    return result.rows;
};

export const getCountryById = async (id: number): Promise<Country | null> => {
    const result = await pool.query<Country>(
        "SELECT * FROM public.countries WHERE id=$1",
        [id]
    );
    return result.rows[0] || null;
};

export const updateCountry = async (
    id: number,
    data: Partial<Omit<Country, "id" | "code" | "created_at" | "updated_at">>
): Promise<Country | null> => {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);

    if (dataKeys.length === 0) return getCountryById(id);

    const fields = dataKeys
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

    const updateClause = `${fields}, updated_at = NOW()`;

    const result = await pool.query<Country>(
        `UPDATE public.countries SET ${updateClause} WHERE id=$1 RETURNING *`,
        [id, ...dataValues]
    );
    return result.rows[0] || null;
};
