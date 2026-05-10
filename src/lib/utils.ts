export function cn(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

export function formatConfidence(value: number) {
	return `${(value * 100).toFixed(1)}%`;
}

export function getModelColor(model: string) {
	if (model === 'baseline') return '#4C72B0';
	if (model === 'improved') return '#DD8452';
	return '#6366f1';
}
