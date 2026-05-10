const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function predict(file: File) {
	const fd = new FormData();
	fd.append('file', file);
	const res = await fetch(`${BASE}/predict`, { method: 'POST', body: fd });
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function compare(file: File) {
	const fd = new FormData();
	fd.append('file', file);
	const res = await fetch(`${BASE}/compare`, { method: 'POST', body: fd });
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function getMetrics() {
	const res = await fetch(`${BASE}/metrics`, { cache: 'no-store' });
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function sendLiveFrame(blob: Blob, variant: string) {
	const fd = new FormData();
	fd.append('frame', blob, 'frame.jpg');
	const res = await fetch(`${BASE}/live?variant=${variant}`, {
		method: 'POST',
		body: fd,
	});
	if (!res.ok) return null;
	return res.json();
}

export async function healthCheck() {
	try {
		const res = await fetch(`${BASE}/health`);
		return res.json();
	} catch {
		return null;
	}
}
