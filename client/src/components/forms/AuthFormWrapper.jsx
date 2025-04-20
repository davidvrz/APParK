function AuthFormWrapper({ children, title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-heading font-semibold text-center text-dark mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

export default AuthFormWrapper
