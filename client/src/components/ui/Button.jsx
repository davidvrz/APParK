function Button({
  children,
  type = 'button',
  disabled = false,
  className = '',
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
