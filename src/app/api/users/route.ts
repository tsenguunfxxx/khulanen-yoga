import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
export const GET = async () => {
  const result = await pool.query("SELECT * FROM employees");
  return NextResponse.json(
    { message: "amjilttai butsaalaa", result },
    {
      status: 200,
    },
  );
};
export const POST = async (request: Request) => {
  const body = await request.json();
  const {
    Full_name,
    age,
    gender,
    email,
    id,
    department,
    salary,
    years_of_service,
  } = await body;
  const result = await pool.query(
    "INSERT INTO employees (Full_name, age, gender, email, id, department, salary, years_of_service) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [Full_name, age, gender, email, id, department, salary, years_of_service],
  );
  return NextResponse.json({ message: "amjilttai ajiltan uuslee", result });
};
