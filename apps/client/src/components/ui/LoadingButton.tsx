const LoadingButton = ({
  children,
  loading = false,
  className = '',
  variant = 'primary',
  ...props
}) => (
  <button
    className={`${
      variant === 'secondary' ? 'secondary-button' : 'primary-button'
    } w-full ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        Loading
      </span>
    ) : (
      children
    )}
  </button>
);

export default LoadingButton;
