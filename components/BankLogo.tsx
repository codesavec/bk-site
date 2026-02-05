export function BankLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">PT</span>
      </div>
      <span className="font-bold text-lg">PTBank</span>
    </div>
  );
}
