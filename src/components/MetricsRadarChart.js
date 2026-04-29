"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function MetricsRadarChart({ data }) {
  if (!data) return null;

  // Format data for Recharts Radar
  const radarData = [
    { subject: 'Accuracy', A: data.Baseline?.acc || 0, B: data.Improved?.acc || 0, C: data.ResNet50?.acc || 0 },
    { subject: 'Precision', A: data.Baseline?.prec || 0, B: data.Improved?.prec || 0, C: data.ResNet50?.prec || 0 },
    { subject: 'Recall', A: data.Baseline?.rec || 0, B: data.Improved?.rec || 0, C: data.ResNet50?.rec || 0 },
    { subject: 'F1 Score', A: data.Baseline?.f1 || 0, B: data.Improved?.f1 || 0, C: data.ResNet50?.f1 || 0 },
  ];

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#f1f1f4', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
          <Tooltip 
            formatter={(value) => `${(value * 100).toFixed(1)}%`}
            contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #6366f1', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
          
          <Radar name="Baseline CNN" dataKey="A" stroke="#55556a" fill="#55556a" fillOpacity={0.1} />
          <Radar name="Improved CNN" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
          <Radar name="ResNet50" dataKey="C" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
