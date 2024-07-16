"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


export default function SignupForm () {

	const [username, setUsername] = useState("")
	const [usernameMsg, setUsernameMsg] = useState("")
	const [isCheckingUsername, setIsCheckingUsername] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const debounced = useDebounceCallback(setUsername, 300)
	const {toast} = useToast()
	const router = useRouter()

	// zod implementation
	// form name in many places is given register and not form.
	const form = useForm<z.infer<typeof signupSchema>>({
		resolver : zodResolver(signupSchema),
		defaultValues : {
			username : '',
			email : '',
			password : ''
		}
	})


	useEffect(() => {

		const checkUsernameUnique = async() => {

			if (username) {
				
				setIsCheckingUsername(true)
				setUsernameMsg('')

				try {

					const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
					let message = response.data.message
					setUsernameMsg(message)
					
				} catch (error) {

					const axiosError = error as AxiosError<ApiResponse>

					setUsernameMsg(
						axiosError.response?.data.message ?? "Error checking username"
					)

				} finally {
					setIsCheckingUsername(false)
				}
			}
		}

		checkUsernameUnique()

	}, [username])




	// submitting logic
	const onSubmit = async(data: z.infer<typeof signupSchema>) => {

		setIsSubmitting(true)

		try {

			const response = await axios.post<ApiResponse>('/api/signup', data)

			toast({
				title : "Success",
				description : response.data.message
			})	

			router.replace(`/verify/${username}`)

			setIsSubmitting(false)

		} catch (error) {

			console.error("Error in signup of user", error);

			const axiosError = error as AxiosError<ApiResponse>
			
			// default error message
			let errorMessage = axiosError.response?.data.message

			toast({
				title : "Signup Failed.",
				description : errorMessage,
				variant : "destructive"
			})

			setIsSubmitting(false)

		}
	}


	
	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure.</p>
				</div>

				<Form {...form}>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >

						<FormField

							name="username"
							control={form.control}

							render={({ field }) => (

								<FormItem>
									<FormLabel>Username</FormLabel>
									
									<FormControl>
										<Input 
											placeholder="username" 
											{...field} 
											onChange={(event) => {
												field.onChange(event)
												debounced(event.target.value)
											}}
										/>
									</FormControl>

									{isCheckingUsername && <Loader2 className="animate-spin" />}

									{!isCheckingUsername && usernameMsg && (
										<p
											className={`text-sm ${
												usernameMsg === 'Username is available.'
												? 'text-green-500'
												: 'text-red-500'
											}`}
										>
											{usernameMsg}
										</p>
									)}

									<FormMessage />
								</FormItem>
							)}
						/>


						<FormField

							name="email"
							control={form.control}

							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<Input placeholder = "email" {...field} name='email' />
									<p className='text-muted text-gray-400 text-sm'>We will send you a verification code.</p>
									<FormMessage />
								</FormItem>
							)}

						/>


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

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{
								isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
										Please wait
									</>
								) : ('Sign Up')
							}
						</Button>

					</form>

				</Form>

				<div className="text-center mt-4">
					<p>
						Already a member?{' '}

						<Link href="/signin" className="text-blue-600 hover:text-blue-800">
							Sign in
						</Link>
					</p>
				</div>

			</div>
		</div>
	)

}