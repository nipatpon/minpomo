import { getCsrfToken, useSession, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useState } from "react";
import { useRouter } from "next/router";

type SignInSubmitForm = {
	email: string;
	password: string;
};

interface ISignInProps {
	csrfToken: string;
}

function SignIn({ csrfToken }: ISignInProps) {
	const router = useRouter();
	const [error, setError] = useState(null);

	const validationSchema = Yup.object().shape({
		email: Yup.string().required("Email is required").email("Email is invalid"),
		password: Yup.string().required("Password is required"),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<SignInSubmitForm>({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = async (data: SignInSubmitForm) => {
		// console.log(JSON.stringify(data, null, 2));
		const res: any = await signIn("credentials", {
			redirect: false,
			email: data.email,
			password: data.password,
			callbackUrl: `${window.location.origin}`,
		});
		if (res?.error) {
			setError(res.error);
			console.log("Got error ", res.error);
		} else {
			setError(null);
			router.push(`/`);
		}
	};

	return (
		<div className={`flex justify-center`}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input name="csrfToken" type="hidden" defaultValue={csrfToken} />

				<div className={`bg-white rounded px-8 pt-6 pb-8 mb-4 flex flex-col`}>
					<h1 className={`mb-4 text-2xl`}>Login to your account.</h1>
					<div className={`mb-4`}>
						<label className={`block text-sm font-bold mb-2`}>Email</label>
						<input
							{...register("email")}
							className={`
                                shadow appearance-none border rounded w-full py-2 px-3 
                                text-sm ${errors.email ? "border-[red]" : ""}
                            `}
							id="email"
							type="text"
							defaultValue={``}
							placeholder="Email"
						/>
						{errors?.email && (
							<p className={`text-[red] text-sm mt-2 pl-3`}>
								{errors.email.message}
							</p>
						)}
					</div>
					<div className="mb-6">
						<label className={`block text-sm font-bold mb-2`}>Password</label>
						<input
							{...register("password")}
							className={`shadow appearance-none border text-sm rounded w-full py-2 px-3 
							${ errors.password ? "border-[red]" : "" }`}
							id="password"
							type="password"
							placeholder="Password"
							defaultValue={``}
						/>
						{errors?.password && (
							<p className={`text-[red] text-sm mt-2 pl-3`}>
								{errors.password.message}
							</p>
						)}
					</div>
					<div
						className={`
                            flex items-center justify-between
                        `}
					>
						<button
							type="submit"
							className={`
                                bg-neutral-500 hover:bg-[#f87171] text-[#fff]
                                py-2 px-4 rounded transition-all duration-75
                            `}
						>
							Sign In
						</button>
						<Link href="/auth/forgot-password">
							<a
								className={`
                                inline-block align-baseline font-bold 
                                text-sm text-sky-500 hover:text-sky-800
                            `}
							>
								Forgot Password?
							</a>
						</Link>
					</div>
				</div>

				{/* <div className={`flex justify-center`}>
                    <Link href="/" >
                        <VscHome className='cursor-pointer' />
                    </Link>
                </div> */}
			</form>
		</div>
	);
}

export async function getServerSideProps(context: any) {
	return {
		props: {
			// ...await serverSideTranslations(context.locale, ['login']),
			csrfToken: await getCsrfToken(context),
		},
	};
}

export default SignIn;
