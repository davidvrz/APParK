function Input({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  )
}

export default Input
