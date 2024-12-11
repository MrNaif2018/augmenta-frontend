import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { IfRender } from '@/components/IfRender'

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

type CompanyDataProps = {
    companyData: Record<string, any>
}

export default function CompanyData({ companyData }: CompanyDataProps) {
    return (
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
                <p className="mb-4">{companyData.description}</p>
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
                                <strong>Employees:</strong> {num_employees}
                            </div>
                        )}
                    </IfRender>
                    <IfRender data={companyData.founded_on}>
                        {(founded) => (
                            <div>
                                <strong>Founded:</strong>{' '}
                                {new Date(founded.value).toLocaleDateString()}
                            </div>
                        )}
                    </IfRender>
                    <IfRender data={companyData.company_type}>
                        {(company_type) => (
                            <div>
                                <strong>Company type:</strong> {company_type}
                            </div>
                        )}
                    </IfRender>
                    <IfRender data={companyData.crunchbase_rank}>
                        {(crunchbase_rank) => (
                            <div>
                                <strong>Crunchbase rank:</strong>{' '}
                                {crunchbase_rank}
                            </div>
                        )}
                    </IfRender>
                    <IfRender data={companyData.semrush_global_rank}>
                        {(semrush_global_rank) => (
                            <div>
                                <strong>Semrush global rank:</strong>{' '}
                                {semrush_global_rank}
                            </div>
                        )}
                    </IfRender>
                    <IfRender data={companyData.semrush_visits_latest_month}>
                        {(semrush_visits_latest_month) => (
                            <div>
                                <strong>Semrush visits last month:</strong>{' '}
                                {semrush_visits_latest_month}
                            </div>
                        )}
                    </IfRender>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Summary</h3>
                <p className="mb-4">{companyData.ai_short_summary}</p>
                {renderFAQSection(companyData.faqs)}
                <IfRender data={companyData.competitors}>
                    {(competitors) => (
                        <>
                            <h3 className="text-xl font-semibold mb-2">
                                Top Competitors
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {competitors.map((competitor, index) => (
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
                                                <span>{competitor.name}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm">
                                                {competitor.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </IfRender>
            </CardContent>
        </Card>
    )
}
