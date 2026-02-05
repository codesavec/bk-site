interface BalanceCardProps {
  title: string;
  amount: number;
  subtitle: string;
  color?: 'default' | 'success' | 'error';
}

export function BalanceCard({
  title,
  amount,
  subtitle,
  color = 'default',
}: BalanceCardProps) {
  const colorClasses = {
    default: 'text-foreground',
    success: 'text-green-600',
    error: 'text-red-600',
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      <p className={`text-3xl font-bold mb-1 ${colorClasses[color]}`}>
        {Number(amount || 0).toLocaleString()} $
      </p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
