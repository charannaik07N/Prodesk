import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

const registrationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters.")
      .max(50, "First name must not exceed 50 characters.")
      .regex(
        /^[A-Za-zÀ-ÿ' \-]+$/,
        "Use only letters, spaces, hyphens, or apostrophes.",
      ),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters.")
      .max(50, "Last name must not exceed 50 characters.")
      .regex(
        /^[A-Za-zÀ-ÿ' \-]+$/,
        "Use only letters, spaces, hyphens, or apostrophes.",
      ),

    dateOfBirth: z.string().min(1, "Date of birth is required."),

    email: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least 1 capital letter.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must contain at least 1 special character.",
      )
      .refine(
        (value) => (value.match(/\d/g) || []).length >= 4,
        "Password must contain at least 4 numbers.",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const Input = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  // Password requirements checker
  const passwordRequirements = {
    length: passwordValue.length >= 8,
    capital: /[A-Z]/.test(passwordValue),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue),
    numbers: (passwordValue.match(/\d/g) || []).length >= 4,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const watchedPassword = watch("password");

  useEffect(() => {
    setPasswordValue(watchedPassword || "");
  }, [watchedPassword]);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    setIsSubmitSuccess(true);
    reset();
    setTimeout(() => setIsSubmitSuccess(false), 5000);
  };

  const inputStyles =
    "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/8";

  return (
    <section
      className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(226,232,240,0.95),rgba(248,250,252,1)_42%,rgba(241,245,249,1)_100%)] px-3 py-6 sm:px-6 sm:py-10 lg:px-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:min-h-[calc(100vh-4rem)] lg:items-center lg:justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl sm:rounded-4xl border border-slate-200/80 bg-white shadow-sm sm:shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="relative isolate hidden overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10 lg:block lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_34%)]" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="space-y-8">
                <img
                  src="/undraw_referral_ihsd.svg"
                  alt="Employee setup illustration"
                  className="h-auto w-full max-w-sm"
                />
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                    Employee setup
                  </p>
                  <h1
                    className="max-w-sm text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl lg:sm:text-5xl"
                    style={{ fontFamily: "'Crimson Text', serif" }}
                  >
                    Create a clean, secure account in one pass.
                  </h1>
                  <p className="max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                    Capture the essentials for a new employee with a form that
                    feels calm, fast, and easy to trust.
                  </p>
                </div>

                <div className="grid gap-3 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-3">
                  <div>
                    <p className="font-medium text-white">✓ Focused</p>
                    <p className="mt-1 leading-6">
                      Essential fields only—no clutter.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-white">✓ Readable</p>
                    <p className="mt-1 leading-6">
                      Clear labels & strong contrast.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-white">✓ Secure</p>
                    <p className="mt-1 leading-6">
                      Strong password requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-16">
            {isSubmitSuccess && (
              <div className="mb-4 sm:mb-6 rounded-lg bg-green-50 border border-green-200 p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-green-600 text-lg sm:text-xl">✓</div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-green-900">
                      Account created successfully!
                    </p>
                    <p className="text-xs sm:text-sm text-green-700 mt-0.5 sm:mt-1">
                      Welcome to the team. Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              </div>
            )}
            <form
              className="space-y-8"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-1 sm:space-y-2">
                <h2
                  className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl"
                  style={{ fontFamily: "'Crimson Text', serif" }}
                >
                  Employee details
                </h2>
                <p className="max-w-lg text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Fill in the essentials below—we've arranged everything for a
                  smooth experience.
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <label
                    className="text-sm sm:text-base font-medium text-slate-700"
                    htmlFor="firstName"
                  >
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputStyles}
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="John"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="text-sm sm:text-base font-medium text-slate-700"
                    htmlFor="lastName"
                  >
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputStyles}
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Smith"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="text-sm sm:text-base font-medium text-slate-700"
                    htmlFor="dateOfBirth"
                  >
                    Date of birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputStyles}
                    id="dateOfBirth"
                    type="date"
                    autoComplete="bday"
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="text-sm sm:text-base font-medium text-slate-700"
                    htmlFor="email"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputStyles}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="text-sm sm:text-base font-medium text-slate-700"
                    htmlFor="password"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className={inputStyles}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter password"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM19.5 13a8.971 8.971 0 01-1.07 4.753M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm-8 16l1.122-2.245m13.875-11.555l1.122-2.245M2.875 13.5H21m-17.445 6.986L5.077 19.5m12.868 0l1.122 2.245"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                  <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                    <p className="text-xs font-semibold text-slate-600">
                      Password requirements:
                    </p>
                    <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-xs">
                      <div
                        className={`flex items-center gap-1.5 sm:gap-2 ${passwordRequirements.length ? "text-green-600" : "text-slate-500"}`}
                      >
                        <span className="text-sm sm:text-lg">
                          {passwordRequirements.length ? "✓" : "○"}
                        </span>
                        <span className="text-xs sm:text-xs">
                          At least 8 characters
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 sm:gap-2 ${passwordRequirements.capital ? "text-green-600" : "text-slate-500"}`}
                      >
                        <span className="text-sm sm:text-lg">
                          {passwordRequirements.capital ? "✓" : "○"}
                        </span>
                        <span className="text-xs sm:text-xs">
                          At least 1 capital letter (A-Z)
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 sm:gap-2 ${passwordRequirements.special ? "text-green-600" : "text-slate-500"}`}
                      >
                        <span className="text-sm sm:text-lg">
                          {passwordRequirements.special ? "✓" : "○"}
                        </span>
                        <span className="text-xs sm:text-xs">
                          At least 1 special character (!@#$%^&*, etc.)
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 sm:gap-2 ${passwordRequirements.numbers ? "text-green-600" : "text-slate-500"}`}
                      >
                        <span className="text-sm sm:text-lg">
                          {passwordRequirements.numbers ? "✓" : "○"}
                        </span>
                        <span className="text-xs sm:text-xs">
                          At least 4 numbers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="text-sm sm:text-base font-medium text-slate-700"
                    htmlFor="confirmPassword"
                  >
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className={inputStyles}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM19.5 13a8.971 8.971 0 01-1.07 4.753M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm-8 16l1.122-2.245m13.875-11.555l1.122-2.245M2.875 13.5H21m-17.445 6.986L5.077 19.5m12.868 0l1.122 2.245"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs sm:text-sm text-slate-500">
                  All fields are required. Passwords must match.
                </p>
                <button
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/15"
                  type="submit"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Input;
