
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
 

type ForgotPasswordSubmitForm = {
    email: string; 
};

function ForgotPassword() {

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required.')
            .email('Email type invalid.')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ForgotPasswordSubmitForm>({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data: ForgotPasswordSubmitForm) => {
        console.log(JSON.stringify(data, null, 2));
    };

    return (
        <div className={`flex justify-center`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`bg-white rounded px-8 pt-6 pb-8 mb-4 flex flex-col`}>
                    <h1 className={`mb-4 text-2xl`}>Forgot your password.</h1>
                    <div className="mb-6">
                        <label
                            className={`block text-sm font-bold mb-2`}>
                            Your email
                        </label>
                        <input
                            {...register('email')}
                            className={`
                                shadow appearance-none border text-sm
                                rounded w-full py-2 px-3 ${errors.email ? 'border-[red]' : ''}
                            `}
                            id="email"
                            type="email"
                            placeholder="email"
                        />
                        {
                            errors?.email && <p className={`
                                text-[red] text-sm mt-2 pl-3
                            `}>{errors.email.message}</p>
                        }
                    </div>
                    <div className={`
                            flex items-center justify-between
                        `}>

                        <button
                            type="submit"
                            className={`
                                bg-neutral-500 hover:bg-neutral-700 text-[#fff]
                                py-2 px-4 rounded transition-all duration-75
                            `}
                        >
                            Request.
                        </button>
                        <Link href={'/auth/signin'}>
                            <a
                                className={`
                                    inline-block align-baseline font-bold 
                                    text-sm text-sky-500 hover:text-sky-800
                                `}
                            >
                                Back
                            </a>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

// ForgotPassword['layout'] = ClearLayout;
export default ForgotPassword;