import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link, useParams } from 'react-router'
import { getRequestByID } from '@/services/SummaryService'
import CompanyData from '@/components/CompanyData'

const fetchRequestById = async (id: string) => {
    return getRequestByID(id).then((data) => data.data)
}

export default function RequestDetailPage() {
    const [companyData, setCompanyData] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            fetchRequestById(params.id as string).then((data) => {
                setCompanyData(data)
                setLoading(false)
            })
        }
    }, [params])

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                    <h1 className="text-4xl font-bold text-center">
                        Augmenta Request
                    </h1>
                    <div className="w-[100px]"></div>
                </div>

                {loading ? (
                    <Card className="mb-8">
                        <CardHeader>
                            <Skeleton className="h-12 w-[250px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>
                ) : companyData ? (
                    <CompanyData companyData={companyData} />
                ) : (
                    <Card className="mb-8">
                        <CardContent>
                            <p className="text-center text-lg">
                                No data found for this request ID.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
