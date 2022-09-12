import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from 'next/router';


export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session?.error === "RefreshAccessTokenError") {
    router.push('/auth/signin');
    return null;
  } else {
    return (
      <>
        <div className="w-full h-fit list-none m-0 p-0 flex justify-center ">
          <div className="w-[300px]">

            <div className={`
              py-2 flex border-b cursor-pointer
            `}> 
              <div className="mr-4">
                <img 
                  className="w-10 h-10 rounded-full" 
                  src="https://scontent.fbkk12-4.fna.fbcdn.net/v/t1.6435-9/70183444_2841354939207911_5118528769656619008_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=MyOHFm4AdVMAX9EPF_a&_nc_ht=scontent.fbkk12-4.fna&oh=00_AT-JmtYO4u9I4I-g39rvuL4zQFGaxHTPbhHYjqfz6fnOOg&oe=6329D377" 
                  alt="Rounded avatar" 
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-gray-700 text-sm">Nipatpon Changdum</h2>
                <p className="text-gray-400 text-xs" >See your profile</p>
              </div> 
            </div> 

            <div className="flex flex-col">
              
              <div className="mt-4">
                <button
                  className={`
                    border w-full p-1 rounded-md bg-zinc-200 hover:bg-zinc-300 
                    text-zinc-800 transition-all duration-150
                  `}
                  type="button"
                >Log out</button>
              </div> 
            </div>

          </div>
        </div>
      </>
    )
  }

}

export async function getServerSideProps(context: any) {
  return {
    props: {
      // ...await serverSideTranslations(context.locale, ['login']),
      session: await getSession(context),
    },
  }
} 
