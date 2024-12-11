import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { logIn } from '@/services/AuthService'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<string[]>([])
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        logIn(email, password)
            .then((resp: any) => {
                setLoading(false)
                localStorage.setItem('token', resp.id)
                navigate('/')
            })
            .catch((err) => {
                const detail = err?.response?.data?.detail
                if (typeof detail === 'string') {
                    setErrors([detail])
                } else {
                    setErrors(detail?.map((error: any) => error?.msg))
                }
                setLoading(false)
            })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Login to Augmenta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {errors.length > 0 && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>
                                <ul className="list-disc pl-4">
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>
                            <Input
                                required
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Password
                            </label>
                            <Input
                                required
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
