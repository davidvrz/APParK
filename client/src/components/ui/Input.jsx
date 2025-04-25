function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-4 py-2 bg-white/50 text-gray-800 rounded-md shadow-inner 
                  backdrop-blur placeholder-gray-500 outline-none border border-white/30
                  focus:ring-2 focus:ring-primary focus:bg-white/70 transition duration-200 ${className}`}
      {...props}
    />
  )
}

export default Input
