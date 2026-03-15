"use server";

import { generateVideoToken as generateVideoTokenAction } from "./appointment";

export async function generateVideoToken(formData) {
    return generateVideoTokenAction(formData);
}
