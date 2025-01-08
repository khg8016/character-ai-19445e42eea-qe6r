interface AuthMessageProps {
  type: 'error' | 'success' | 'warning';
  children: React.ReactNode;
}

const styles = {
  error: 'bg-red-900/50 border-red-800 text-red-200',
  success: 'bg-green-900/50 border-green-800 text-green-200',
  warning: 'bg-yellow-900/50 border-yellow-800 text-yellow-200'
};

export function AuthMessage({ type, children }: AuthMessageProps) {
  return (
    <div className={`p-4 rounded-lg border ${styles[type]}`}>
      <p className="text-sm">{children}</p>
    </div>
  );
}