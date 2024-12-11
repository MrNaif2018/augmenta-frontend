import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getSummary, getSummaryResult } from '@/services/SummaryService'
import { Loader2 } from 'lucide-react'
import { ToastProvider, useToast } from '@/hooks/useToast'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useNavigate, Link } from 'react-router'
import { getHistory } from '@/services/AuthService'
import CompanyData from '@/components/CompanyData'

type GetCompanyQuery = {
    value: string
    type: 'company' | 'result'
}

const fetchCompanyData = async (query: GetCompanyQuery) => {
    if (query.type === 'result') {
        return await getSummaryResult(query.value)
    }
    return await getSummary(query.value)
}

const useTypingEffect = (text: string, speed: number = 70) => {
    const [displayText, setDisplayText] = useState('')

    useEffect(() => {
        let i = 0
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.substring(0, i + 1))
                i++
            } else {
                clearInterval(typingInterval)
            }
        }, speed)

        return () => {
            clearInterval(typingInterval)
        }
    }, [text, speed])

    return displayText
}

export default function MainPage() {
    const [companyData, setCompanyData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [isResultSearch, setIsResultSearch] = useState(false)
    const [requestHistory, setRequestHistory] = useState([])
    const { toast } = useToast()
    const navigate = useNavigate()

    const isLoggedIn = localStorage.getItem('token') ? true : false

    useEffect(() => {
        getHistory().then((data) => {
            setRequestHistory(data)
        })
    }, [isLoggedIn, companyData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const data = await fetchCompanyData({
            value: searchInput,
            type: isResultSearch ? 'result' : 'company',
        })
        if (!data) {
            setLoading(false)
            toast({
                title: 'No result found',
                description: 'Please try a different search term.',
                variant: 'destructive',
                duration: 3000,
            })
            return
        }
        setCompanyData(data)
        setLoading(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        toast({
            title: 'Logged out successfully',
            description: 'Come back soon!',
            duration: 3000,
        })
    }

    const toggleSearchType = () => {
        setIsResultSearch(!isResultSearch)
        setSearchInput('')
    }

    const animatedText = useTypingEffect(
        'Discover AI-powered insights about companies. Enter a company name to get started.',
        50,
    )

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto w-full">
                        <div className="w-1/3"></div>
                        <h1 className="text-4xl font-bold text-center w-1/3">
                            Augmenta
                        </h1>
                        <div className="w-1/3 flex justify-end">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-4">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">
                                                Request History
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <h3 className="font-semibold mb-2">
                                                Recent Requests
                                            </h3>
                                            <div className="max-h-96 overflow-y-auto">
                                                {requestHistory.length > 0 ? (
                                                    <ul className="space-y-4">
                                                        {requestHistory.map(
                                                            (request) => (
                                                                <li
                                                                    key={
                                                                        request.id
                                                                    }
                                                                    className="text-sm border-b pb-2"
                                                                >
                                                                    <Link
                                                                        to={`/requests/${request.id}`}
                                                                        className="font-medium text-blue-600 hover:underline"
                                                                    >
                                                                        {
                                                                            request
                                                                                .data
                                                                                .name
                                                                        }
                                                                    </Link>
                                                                    <div className="text-gray-500">
                                                                        {new Date(
                                                                            request.created,
                                                                        ).toLocaleString()}
                                                                    </div>
                                                                    <div className="text-gray-700">
                                                                        {
                                                                            request
                                                                                .data
                                                                                .description
                                                                        }
                                                                    </div>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        No recent requests
                                                    </p>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <Button onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/login')}
                                    >
                                        Login
                                    </Button>
                                    <Link to="/signup">
                                        <Button>Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-xl text-center mb-8">{animatedText}</p>
                    <form
                        className="flex flex-col items-center gap-4 mb-8"
                        onSubmit={handleSubmit}
                    >
                        <div className="w-full flex gap-4">
                            <Input
                                type="text"
                                placeholder={
                                    isResultSearch
                                        ? 'Enter company name (local access)'
                                        : 'Enter company name'
                                }
                                className="flex-grow"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Search'
                                )}
                            </Button>
                        </div>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none"
                            onClick={toggleSearchType}
                        >
                            {isResultSearch
                                ? 'Or search for a company'
                                : 'Or search for stored result'}
                        </button>
                    </form>

                    {companyData && <CompanyData companyData={companyData} />}
                </div>
            </div>
        </ToastProvider>
    )
}
