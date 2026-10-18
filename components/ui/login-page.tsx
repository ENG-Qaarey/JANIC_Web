'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './button';
import { Input } from './input';
import { motion } from 'framer-motion';
import { useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';
import googleIcon from 'thesvg/google';
import githubIcon from 'thesvg/github';

import {
	ChevronLeftIcon,
	Loader2,
	AlertCircle,
	User,
	Lock,
	Eye,
	EyeOff,
} from 'lucide-react';

interface LoginErrors {
	username?: string;
	password?: string;
}

export function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const fromParam = searchParams.get('from');
	const clerk = useClerk();

	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<LoginErrors>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [oauthLoading, setOauthLoading] = useState<'oauth_google' | 'oauth_github' | null>(null);

	// Prefetch the SSO callback route & auto-reset loading if the user cancels or navigates Back (bfcache)
	useEffect(() => {
		router.prefetch('/sso-callback');

		const stopLoading = () => {
			setOauthLoading(null);
		};

		window.addEventListener('pageshow', stopLoading);
		window.addEventListener('focus', stopLoading);
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				stopLoading();
			}
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			window.removeEventListener('pageshow', stopLoading);
			window.removeEventListener('focus', stopLoading);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [router]);

	const handleOAuth = async (strategy: 'oauth_google' | 'oauth_github') => {
		if (oauthLoading) return;
		setOauthLoading(strategy);

		// Auto-stop spinner after 5s if user cancels prompt or navigation doesn't occur
		setTimeout(() => {
			setOauthLoading((curr) => (curr === strategy ? null : curr));
		}, 5000);

		try {
			const client = clerk.client || (typeof window !== 'undefined' ? (window as unknown as { Clerk?: { client?: typeof clerk.client } }).Clerk?.client : null);

			if (client?.signIn) {
				await client.signIn.authenticateWithRedirect({
					strategy,
					redirectUrl: '/sso-callback',
					redirectUrlComplete: '/api/auth/sync',
				});
				return;
			}

			if (client?.signUp) {
				await client.signUp.authenticateWithRedirect({
					strategy,
					redirectUrl: '/sso-callback',
					redirectUrlComplete: '/api/auth/sync',
				});
				return;
			}

			// If client is still finishing initial load, wait momentarily
			if (!clerk.loaded) {
				await new Promise((resolve) => {
					const timer = setTimeout(resolve, 300);
					const check = setInterval(() => {
						if (clerk.loaded) {
							clearInterval(check);
							clearTimeout(timer);
							resolve(true);
						}
					}, 30);
				});

				const freshClient = clerk.client || (typeof window !== 'undefined' ? (window as unknown as { Clerk?: { client?: typeof clerk.client } }).Clerk?.client : null);
				if (freshClient?.signIn) {
					await freshClient.signIn.authenticateWithRedirect({
						strategy,
						redirectUrl: '/sso-callback',
						redirectUrlComplete: '/api/auth/sync',
					});
					return;
				}
			}

			throw new Error('Authentication service is initializing. Please try again.');
		} catch (err: unknown) {
			console.error('OAuth redirect failed:', err);
			setError(err instanceof Error ? err.message : 'Failed to redirect to OAuth provider.');
			setOauthLoading(null);
		}
	};

	const validate = (): boolean => {
		const newErrors: LoginErrors = {};

		const trimmedUser = formData.username.trim();
		if (!trimmedUser) {
			newErrors.username = 'Username or email is required';
		} else if (trimmedUser.length < 3) {
			newErrors.username = 'Must be at least 3 characters';
		}

		if (!formData.password) {
			newErrors.password = 'Password is required';
		} else if (formData.password.length < 4) {
			newErrors.password = 'Password must be at least 4 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			setError('Please enter your username/email and password.');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: formData.username.trim(),
					password: formData.password,
				}),
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(data.error || 'Login failed. Please check your credentials.');
			}

			const isPublicUser = data.user?.role === 'USER';
			toast.success(isPublicUser ? 'Welcome back!' : 'Welcome back! Redirecting to dashboard...');

			const defaultDest =
				data.user?.role === 'STAFF'
					? '/staff/dashboard'
					: isPublicUser
					? '/'
					: '/admin/dashboard';

			const dest =
				fromParam &&
				fromParam !== '/admin/dashboard' &&
				!(isPublicUser && (fromParam.startsWith('/admin') || fromParam.startsWith('/staff')))
					? fromParam
					: defaultDest;

			router.push(dest);
			router.refresh();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
			<main className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-blue-900/5 lg:grid lg:grid-cols-2">
				{/* Left Column: Branding, Animated Waves & Quote */}
				<div className="bg-[#F8FBFF] dark:bg-slate-950 relative hidden h-full flex-col border-r border-slate-100 dark:border-slate-800 p-10 lg:flex">
					<div className="z-10 flex items-center gap-3">
						<div className="relative h-10 w-36">
							<Image
								src="/images/janic-new-with-jazeera-blue.png"
								alt="JANIC — Jazeera Nexus Innovation Center"
								fill
								className="object-contain object-left dark:hidden"
								priority
								sizes="144px"
							/>
							<Image
								src="/images/janic-new-with-jazeera-white.png"
								alt="JANIC — Jazeera Nexus Innovation Center"
								fill
								className="object-contain object-left hidden dark:block"
								priority
								sizes="144px"
							/>
						</div>
					</div>
					<div className="z-10 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-xl text-slate-700 dark:text-slate-200">
								&ldquo;JANIC connected our education with real innovation and helped
								us ship faster.&rdquo;
							</p>
						</blockquote>
					</div>
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>

				{/* Right Column: Sign In Form */}
				<div className="relative flex flex-col justify-center p-6 sm:p-10 lg:min-h-[640px]">
					<Button variant="ghost" className="absolute top-5 left-5 transition-colors duration-150" asChild>
						<Link href="/">
							<ChevronLeftIcon className="size-4 me-2" />
							Home
						</Link>
					</Button>

					<div className="mx-auto w-full max-w-sm space-y-4 pt-10 lg:pt-0">
						{/* Mobile Brand Logo */}
						<div className="flex items-center gap-2 lg:hidden">
							<div className="relative h-8 w-28">
								<Image
									src="/images/janic-new-with-jazeera-blue.png"
									alt="JANIC logo"
									fill
									className="object-contain object-left dark:hidden"
									priority
									sizes="112px"
								/>
								<Image
									src="/images/janic-new-with-jazeera-white.png"
									alt="JANIC logo"
									fill
									className="object-contain object-left hidden dark:block"
									priority
									sizes="112px"
								/>
							</div>
						</div>

						{/* Heading */}
						<div className="flex flex-col space-y-1">
							<h1 className="font-heading text-2xl font-bold tracking-wide text-[#08245C] dark:text-white">
								Welcome Back
							</h1>
							<p className="text-muted-foreground text-sm">
								Enter your credentials to access your JANIC account.
							</p>
						</div>

						{/* Credentials Form */}
						<form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
							{error && (
								<div role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900/60 p-3 text-sm text-red-600 dark:text-red-400">
									<AlertCircle className="size-4 mt-0.5 shrink-0" />
									<span>{error}</span>
								</div>
							)}

							<div>
								<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
									Username or Email
								</label>
								<div className="relative h-max">
									<Input
										placeholder="Your username or email"
										aria-label="Username or Email"
										className={`peer ps-9 ${errors.username ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
										type="text"
										value={formData.username}
										onChange={(e) => handleInputChange('username', e.target.value)}
										autoComplete="username"
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<User className="size-4" aria-hidden="true" />
									</div>
								</div>
								{errors.username && (
									<p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1 animate-in fade-in duration-200">
										<AlertCircle className="size-3.5 shrink-0" />
										<span>{errors.username}</span>
									</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
									Password
								</label>
								<div className="relative h-max">
									<Input
										placeholder="••••••••••••"
										aria-label="Password"
										className={`peer ps-9 pe-9 ${errors.password ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
										type={showPassword ? 'text' : 'password'}
										value={formData.password}
										onChange={(e) => handleInputChange('password', e.target.value)}
										autoComplete="current-password"
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<Lock className="size-4" aria-hidden="true" />
									</div>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 end-0 flex items-center pe-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
										aria-label={showPassword ? 'Hide password' : 'Show password'}
									>
										{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
									</button>
								</div>
								{errors.password && (
									<p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1 animate-in fade-in duration-200">
										<AlertCircle className="size-3.5 shrink-0" />
										<span>{errors.password}</span>
									</p>
								)}
							</div>

							<Button type="submit" className="w-full bg-[#0875D1] hover:bg-[#0764B2] text-white transition-colors duration-150 cursor-pointer" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="size-4 me-2 animate-spin" />
										Signing In...
									</>
								) : (
									<span>Sign In</span>
								)}
							</Button>
						</form>

						{/* Divider */}
						<div className="relative my-4">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-slate-200 dark:border-slate-700" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">Or continue with</span>
							</div>
						</div>

						{/* OAuth Buttons with Real thesvg Logos */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOAuth('oauth_google')}
								disabled={oauthLoading !== null}
								className="w-full cursor-pointer"
							>
								{oauthLoading === 'oauth_google' ? (
									<Loader2 className="size-4 me-2 animate-spin text-[#0875D1]" />
								) : (
									<span
										className="size-4 me-2 shrink-0 flex items-center justify-center [&>svg]:size-full [&>svg]:block"
										dangerouslySetInnerHTML={{ __html: googleIcon.svg }}
									/>
								)}
								Google
							</Button>

							<Button
								type="button"
								variant="outline"
								onClick={() => handleOAuth('oauth_github')}
								disabled={oauthLoading !== null}
								className="w-full cursor-pointer"
							>
								{oauthLoading === 'oauth_github' ? (
									<Loader2 className="size-4 me-2 animate-spin text-[#0875D1]" />
								) : (
									<span
										className="size-4 me-2 shrink-0 flex items-center justify-center text-slate-900 dark:text-white [&>svg]:size-full [&>svg]:block [&>svg]:fill-current dark:[&>svg_path]:fill-white"
										dangerouslySetInnerHTML={{ __html: githubIcon.variants?.mono || githubIcon.svg }}
									/>
								)}
								GitHub
							</Button>
						</div>

						{/* Registration Link */}
						<div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
							Don&apos;t have an account?{' '}
							<Link
								href="/register"
								className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
							>
								Join Us / Register
							</Link>
						</div>

						{/* Terms Notice */}
						<p className="text-muted-foreground mt-4 text-xs text-center">
							By signing in, you agree to our{' '}
							<Link
								href="#"
								className="hover:text-primary underline underline-offset-4 transition-colors duration-150"
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<Link
								href="#"
								className="hover:text-primary underline underline-offset-4 transition-colors duration-150"
							>
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
			</main>
		</section>
	);
}

const FloatingPaths = React.memo(function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		width: 0.5 + i * 0.03,
		duration: 20 + (i % 5) * 2,
		delay: -(i * 0.4),
	}));

	return (
		<div className="pointer-events-none absolute inset-0" aria-hidden="true">
			<svg
				className="h-full w-full text-[#0875D1]"
				viewBox="0 0 696 600"
				preserveAspectRatio="xMidYMid slice"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.008}
						initial={{ pathLength: 0.3, pathOffset: 0 }}
						animate={{
							pathLength: 1,
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: path.duration,
							delay: path.delay,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
});
