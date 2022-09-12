import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: "Email",
                    type: "text"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials, req) {
                const signIn = await fetch(`${process.env.API_URL}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })

                const res = await signIn.json()
                if (signIn.status === 201) {
                    return res.data;
                }
                return null;
            }
        })
    ],
    secret: process.env.SECRET,
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (account && !!user.user) {
                return {
                    ...token,
                    accessToken: user.access_token,
                    refreshToken: user.refresh_token,
                    accessTokenExpires: Date.now() + 15 * 1000,
                    user: user.user
                };
            }

            if (Date.now() < token.accessTokenExpires) {
                return token
            }
            // console.log("END access END ", token);
            return refreshAccessToken(token);
        },
        async session({ session, token }: any) {
            // console.log("token", token);
            session.user = token.user
            session.accessToken = token.accessToken
            session.error = token.error
            return session
        },
    },
    // debug: true
})


async function refreshAccessToken(token: any) {
    try {
        const getAccessToken = await fetch(`${process.env.API_URL}/auth/get-access-token`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "refreshToken": token.refreshToken
            },
            method: "POST",
        })
        const response = await getAccessToken.json()

        if (response.statusCode !== 201) {
            throw response
        }
        // console.log("response", token.refreshToken);
        return {
            ...token,
            accessToken: response.data.access_token,
            accessTokenExpires: Date.now() + 15 * 1000,
            refreshToken: token.refreshToken, // Fall back to old refresh token
        }
    } catch (error) {
        // console.log("Refresh Token is expired.", error)
        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}