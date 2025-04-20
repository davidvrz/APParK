function FormError({ message }) {
  if (!message) return null
  return (
    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">
      {message}
    </div>
  )
}

export default FormError
