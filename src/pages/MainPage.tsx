import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSummary, getSummaryResult } from '@/services/SummaryService'
import { Loader2 } from 'lucide-react'
import { ToastProvider, useToast } from '@/hooks/useToast'
import { IfRender } from '@/components/IfRender'

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

const renderFAQSection = (faqs) => {
    if (!faqs || faqs.length === 0) return null

    const fundingTotal = faqs.find((faq) => faq.funding_total)?.funding_total
    const lastFunding = faqs.find((faq) => faq.last_funding_at)
    const numInvestors = faqs.find((faq) => faq.num_investors)?.num_investors
    const noFAQ = !fundingTotal && !lastFunding && !numInvestors
    if (noFAQ) return null

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Company Facts</h3>
            <div className="grid grid-cols-2 gap-4">
                {fundingTotal && (
                    <div>
                        <strong>Total Funding:</strong>{' '}
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: fundingTotal.currency,
                        }).format(fundingTotal.value)}
                    </div>
                )}
                {lastFunding && (
                    <>
                        <div>
                            <strong>Last Funding Date:</strong>{' '}
                            {new Date(
                                lastFunding.last_funding_at,
                            ).toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Last Funding Type:</strong>{' '}
                            {lastFunding.last_funding_type.replace(/_/g, ' ')}
                        </div>
                        <div>
                            <strong>Number of Funding Rounds:</strong>{' '}
                            {lastFunding.num_funding_rounds}
                        </div>
                    </>
                )}
                {numInvestors && (
                    <div>
                        <strong>Number of Investors:</strong> {numInvestors}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function MainPage() {
    const [companyData, setCompanyData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [isResultSearch, setIsResultSearch] = useState(false)
    const { toast } = useToast()

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
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">
                        Augmenta
                    </h1>
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

                    {companyData && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-4">
                                    <IfRender data={companyData.logo}>
                                        {(logo) => (
                                            <img
                                                src={logo}
                                                alt={`${companyData.name} logo`}
                                                width={45}
                                                height={45}
                                                className="rounded-full"
                                            />
                                        )}
                                    </IfRender>
                                    <span>{companyData.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">
                                    {companyData.description}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <IfRender data={companyData.website}>
                                        {(website) => (
                                            <div>
                                                <strong>Website:</strong>{' '}
                                                <a
                                                    href={website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {website}
                                                </a>
                                            </div>
                                        )}
                                    </IfRender>
                                    <IfRender data={companyData.location}>
                                        {(location) => (
                                            <div>
                                                <strong>Location:</strong>{' '}
                                                {`${location.city}, ${location.region}, ${location.country}`}
                                            </div>
                                        )}
                                    </IfRender>
                                    <IfRender data={companyData.num_employees}>
                                        {(num_employees) => (
                                            <div>
                                                <strong>Employees:</strong>{' '}
                                                {num_employees}
                                            </div>
                                        )}
                                    </IfRender>
                                    <IfRender data={companyData.founded_on}>
                                        {(founded) => (
                                            <div>
                                                <strong>Founded:</strong>{' '}
                                                {new Date(
                                                    founded.value,
                                                ).toLocaleDateString()}
                                            </div>
                                        )}
                                    </IfRender>
                                    <IfRender data={companyData.company_type}>
                                        {(company_type) => (
                                            <div>
                                                <strong>Company type:</strong>{' '}
                                                {company_type}
                                            </div>
                                        )}
                                    </IfRender>
                                    <IfRender
                                        data={companyData.crunchbase_rank}
                                    >
                                        {(crunchbase_rank) => (
                                            <div>
                                                <strong>
                                                    Crunchbase rank:
                                                </strong>{' '}
                                                {crunchbase_rank}
                                            </div>
                                        )}
                                    </IfRender>
                                    <IfRender
                                        data={companyData.semrush_global_rank}
                                    >
                                        {(semrush_global_rank) => (
                                            <div>
                                                <strong>
                                                    Semrush global rank:
                                                </strong>{' '}
                                                {semrush_global_rank}
                                            </div>
                                        )}
                                    </IfRender>
                                    <IfRender
                                        data={
                                            companyData.semrush_visits_latest_month
                                        }
                                    >
                                        {(semrush_visits_latest_month) => (
                                            <div>
                                                <strong>
                                                    Semrush visits last month:
                                                </strong>{' '}
                                                {semrush_visits_latest_month}
                                            </div>
                                        )}
                                    </IfRender>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    AI Summary
                                </h3>
                                <p className="mb-4">
                                    {companyData.ai_short_summary}
                                </p>
                                {renderFAQSection(companyData.faqs)}
                                <IfRender data={companyData.competitors}>
                                    {(competitors) => (
                                        <>
                                            <h3 className="text-xl font-semibold mb-2">
                                                Top Competitors
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {competitors.map(
                                                    (competitor, index) => (
                                                        <Card key={index}>
                                                            <CardHeader>
                                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                                    <img
                                                                        src={
                                                                            competitor.logo
                                                                        }
                                                                        alt={`${competitor.name} logo`}
                                                                        width={
                                                                            30
                                                                        }
                                                                        height={
                                                                            30
                                                                        }
                                                                        className="rounded-full"
                                                                    />
                                                                    <span>
                                                                        {
                                                                            competitor.name
                                                                        }
                                                                    </span>
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <p className="text-sm">
                                                                    {
                                                                        competitor.description
                                                                    }
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    ),
                                                )}
                                            </div>
                                        </>
                                    )}
                                </IfRender>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </ToastProvider>
    )
}
