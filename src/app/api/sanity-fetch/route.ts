import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { query } = await req.json();

    // Fetch data from Sanity
    const result = await client.fetch(query);

    // Return response in JSON format
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return NextResponse.json({ error: "Error fetching data from Sanity" }, { status: 500 });
  }
}
