import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSummary } from './services/SummaryService'
import { Loader2 } from "lucide-react"


const fetchCompanyData = async (companyName: string) => {
    return await getSummary(companyName)
}

const useTypingEffect = (text: string, speed: number = 70) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1))
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
}

const renderFAQSection = (faqs) => {
  if (!faqs || faqs.length === 0) return null

  const fundingTotal = faqs.find(faq => faq.funding_total)?.funding_total
  const lastFunding = faqs.find(faq => faq.last_funding_at)
  const numInvestors = faqs.find(faq => faq.num_investors)?.num_investors
  const noFAQ = !fundingTotal && !lastFunding && !numInvestors
  if (noFAQ) return null

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Company Facts</h3>
      <div className="grid grid-cols-2 gap-4">
        {fundingTotal && (
          <div>
            <strong>Total Funding:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: fundingTotal.currency }).format(fundingTotal.value)}
          </div>
        )}
        {lastFunding && (
          <>
            <div>
              <strong>Last Funding Date:</strong> {new Date(lastFunding.last_funding_at).toLocaleDateString()}
            </div>
            <div>
              <strong>Last Funding Type:</strong> {lastFunding.last_funding_type.replace(/_/g, ' ')}
            </div>
            <div>
              <strong>Number of Funding Rounds:</strong> {lastFunding.num_funding_rounds}
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

export default function AugmentaApp() {
    const [companyName, setCompanyName] = useState('')
    const [companyData, setCompanyData] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const data = await fetchCompanyData(companyName)
        setCompanyData(data)
        setLoading(false)
    }

    const animatedText = useTypingEffect("Discover AI-powered insights about companies. Enter a company name to get started.", 50)

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Augmenta
                </h1>
                <p className="text-xl text-center mb-8">
                    {animatedText}
                </p>
                <form className="flex gap-4 mb-8" onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Enter company name"
                        value={companyName}
                        className="flex-grow"
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? <>
                          <Loader2 className="animate-spin" />
                          Loading...
                        </> : 'Search'}
                    </Button>
                </form>

                {companyData && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-4">
                                <img
                                    src={companyData.logo}
                                    alt={`${companyData.name} logo`}
                                    width={45}
                                    height={45}
                                    className="rounded-full"
                                />
                                <span>{companyData.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{companyData.description}</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <strong>Website:</strong>{' '}
                                    <a
                                        href={companyData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {companyData.website}
                                    </a>
                                </div>
                                <div>
                                    <strong>Location:</strong>{' '}
                                    {`${companyData.location.city}, ${companyData.location.region}, ${companyData.location.country}`}
                                </div>
                                <div>
                                    <strong>Employees:</strong>{' '}
                                    {companyData.num_employees}
                                </div>
                                <div>
                                    <strong>Founded:</strong>{' '}
                                    {new Date(
                                        companyData.founded_on.value,
                                    ).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Company type:</strong>{' '}
                                    {companyData.company_type}
                                </div>
                                <div>
                                    <strong>Crunchbase rank:</strong>{' '}
                                    {companyData.crunchbase_rank}
                                </div>
                                <div>
                                    <strong>Semrush global rank:</strong>{' '}
                                    {companyData.semrush_global_rank}
                                </div>
                                <div>
                                    <strong>Semrush visits last month:</strong>{' '}
                                    {companyData.semrush_visits_latest_month}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                AI Summary
                            </h3>
                            <p className="mb-4">
                                {companyData.ai_short_summary}
                            </p>
                            {renderFAQSection(companyData.faqs)}
                            <h3 className="text-xl font-semibold mb-2">
                                Top Competitors
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {companyData.competitors.map(
                                    (competitor, index) => (
                                        <Card key={index}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                    <img
                                                        src={competitor.logo}
                                                        alt={`${competitor.name} logo`}
                                                        width={30}
                                                        height={30}
                                                        className="rounded-full"
                                                    />
                                                    <span>
                                                        {competitor.name}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm">
                                                    {competitor.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
