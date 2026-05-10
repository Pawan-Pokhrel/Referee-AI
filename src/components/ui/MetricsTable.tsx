'use client';

type MetricsTableProps = {
	data: Record<string, { acc: number; prec: number; rec: number; f1: number }>;
};

const headers = ['Accuracy', 'Precision', 'Recall', 'F1-Score'];
const keys = ['acc', 'prec', 'rec', 'f1'] as const;

export default function MetricsTable({ data }: MetricsTableProps) {
	const models = ['Baseline', 'Improved', 'ResNet50'];
	const bestByKey = keys.reduce(
		(acc, key) => {
			acc[key] = Math.max(...models.map((m) => data?.[m]?.[key] ?? 0));
			return acc;
		},
		{} as Record<string, number>
	);

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left">
				<thead>
					<tr className="text-sm text-(--color-text-muted)">
						<th className="py-3">Model</th>
						{headers.map((header) => (
							<th
								key={header}
								className="py-3 text-center"
							>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{models.map((model) => (
						<tr
							key={model}
							className="border-t border-(--color-border)"
						>
							<td className="py-3 font-semibold">{model}</td>
							{keys.map((key) => {
								const value = data?.[model]?.[key] ?? 0;
								const isBest = value === bestByKey[key];
								return (
									<td
										key={key}
										className="py-3 text-center"
									>
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
												isBest ?
													'bg-[rgba(99,102,241,0.25)] text-(--color-text)'
												:	'text-(--color-text-secondary)'
											}`}
										>
											{value.toFixed(4)}
										</span>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
