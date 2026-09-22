import React from 'react'

const AuthLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vocab<span className="text-primary">UP</span>
          </h1>
          <p className="text-sm text-muted-foreground">Grow your vocabulary, one word at a time.</p>
        </div>

        {children}
      </div>
    </div>
  )
}

export default AuthLayout