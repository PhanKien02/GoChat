import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockSignup } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground overflow-hidden relative selection:bg-primary/20">

      {/* Background Subtle Gradients for Premium Feel */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-sidebar-ring/10 blur-[150px]" />
      </div>

      <div className="w-full max-w-[400px] p-6 sm:p-10 z-10 mt-10 mb-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold mb-6 shadow-lg shadow-primary/20 ring-1 ring-primary/50">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-2">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/5">
          <form action={mockSignup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-medium text-foreground/80 pl-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="h-11 bg-background/50 focus:bg-background transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-foreground/80 pl-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="h-11 bg-background/50 focus:bg-background transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium text-foreground/80 pl-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-11 bg-background/50 focus:bg-background transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-xs font-medium text-foreground/80 pl-1">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="••••••••"
                className="h-11 bg-background/50 focus:bg-background transition-colors"
                required
              />
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-medium mt-6 shadow-md transition-all hover:shadow-lg">
              Sign Up
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 bg-background/50 hover:bg-background transition-colors border-border">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </Button>
            <Button variant="outline" className="h-11 bg-background/50 hover:bg-background transition-colors border-border">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? 
          <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4 ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div >
  );
}
