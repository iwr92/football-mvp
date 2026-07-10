const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `API error ${response.status}: ${response.statusText}`,
    )
  }

  return response.json() as Promise<T>
}