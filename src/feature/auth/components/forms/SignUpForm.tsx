"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useSignUp from "@/feature/auth/hooks/useSignUp";

export default function SignUpForm() {
  const { form, isLoading, onSubmit } = useSignUp();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Enter your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="tel"
                    placeholder="+1234567890"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter your phone number with country code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} spinner type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </Form>

      {/* "Don't have an account? Sign up" */}
      <Button variant="link" asChild>
        <Link href="/auth/login">
          Already have an account? <strong className="mx-1">Sign In</strong>
        </Link>
      </Button>
    </div>
  );
}
