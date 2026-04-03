export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchWithRetry = async (url: string, retries = 5, backoffMs = 1000, attempt = 1): Promise<Response> => {
  const response = await fetch(url)
  if (response.ok) return response
  if (attempt >= retries) throw new Error(`Failed after ${retries} attempts: ${response.status} ${response.statusText}`)
  console.warn(`Request failed with ${response.status}, retrying in ${backoffMs * attempt}ms... (attempt ${attempt}/${retries})`)
  await delay(backoffMs * attempt)
  return fetchWithRetry(url, retries, backoffMs, attempt + 1)
}
