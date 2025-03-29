// src/app/api/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Use the provided term or fallback to default keywords.
  const term = searchParams.get('term') || 
    'ιστοσελίδα κατασκευή ιστοσελίδας προβολή ψηφιακή αναβάθμιση eShop λογισμικό ψηφιακή υπηρεσία';

  // Build the Diavgeia API URL
  const apiUrl = `https://diavgeia.gov.gr/opendata/search.json?term=${encodeURIComponent(term)}`;

  try {
    const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from Diavgeia API' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching data.' }, { status: 500 });
  }
}
