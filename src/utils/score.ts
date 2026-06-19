export function calculateOverallScore(
  comfort: number,
  shade: number,
  view: number
): number {
  const weighted = comfort * 0.4 + shade * 0.35 + view * 0.25;
  return Math.round(weighted * 10) / 10;
}

export function getScoreColor(score: number): string {
  if (score >= 4.5) return '#2D6A4F';
  if (score >= 3.5) return '#52B788';
  if (score >= 2.5) return '#F4A261';
  if (score >= 1.5) return '#E76F51';
  return '#D62828';
}

export function getScoreLabel(score: number): string {
  if (score >= 4.5) return '绝佳';
  if (score >= 3.5) return '舒适';
  if (score >= 2.5) return '一般';
  if (score >= 1.5) return '较差';
  return '不推荐';
}

export function getBenchTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    stone: '石凳',
    wood: '木椅',
    other: '其他',
  };
  return labels[type] || type;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateId(): string {
  return 'bench-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
