"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signinSchema } from "@/schemas/signinSchema"
import { signIn } from "next-auth/react"


export default function SigninForm () {

	
	const {toast} = useToast()
	const router = useRouter()

	// zod implementation
	const form = useForm<z.infer<typeof signinSchema>>({
		resolver : zodResolver(signinSchema),
		defaultValues : {
			identifier : '',
			password : ''
		}
	})


	// submitting logic through next auth
	const onSubmit = async(data: z.infer<typeof signinSchema>) => {

        const result = await signIn('credentials', {
            redirect : false,
            identifier : data.identifier,
            password : data.password
        })


		if (result?.error) {

			// toast({
			// 	title : "Login Failed.",
			// 	description : "Incorrect Username or password",
			// 	variant : "destructive"
			// })

			if (result.error == 'CredentialsSignin') {
				toast({
					title : "Login Failed.",
					description : "Incorrect Username or password",
					variant : "destructive"
				})
			} else {
				toast({
					title : "Error",
					description : result.error,
					variant : "destructive"
				})
			}

		} 

		if (result?.url) {
			router.replace('/dashboard')
		}

	}


	
	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign in to start your anonymous adventure.</p>
				</div>

				<Form {...form}>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >


						{/* for identifier */}
						<FormField

							name="identifier"
							control={form.control}

							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<Input placeholder = "email" {...field} name='email' />
									<FormMessage />
								</FormItem>
							)}

						/>

						{/* for password */}
						<FormField

							name="password"
							control={form.control}

							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<Input type = "password" {...field} name="password" />
									<FormMessage />
								</FormItem>
							)}

						/>

						<Button type="submit" className="w-full bg-gray-800 hover:bg-gray-400">
							Signin
						</Button>

					</form>

				</Form>

				<div className="text-center mt-4">
					<p>
						Don't have an account ?

						<Link href="/signup" className="text-blue-600 hover:text-blue-800">
							Sign up
						</Link>
					</p>
				</div>

			</div>
		</div>
	)

}