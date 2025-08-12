
const BASE = import.meta.env.VITE_API_BASE ?? "/v1";
const DEFAULT_TIMEOUT = 10000;

export async function http(
    path:string,
    init: RequestInit & { timeout?: number } = {}
) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), init.timeout ?? DEFAULT_TIMEOUT);

    try{
        const response = await fetch(`${BASE}${path}`, {
            ...init,
            signal:controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(init.headers || {})
            }
        })

        if(!response.ok){
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.error?.message || `HTTP ${response.status}`);
        }
        
        console.log('Fetcing : ', `${BASE}${path}`)

        return await response.json();
    }finally {
        clearTimeout(timeoutId);
    }
}