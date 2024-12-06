import React from 'react'

interface ConditionalRenderProps {
    data: any
    children: (fieldData: any) => React.ReactNode
}

export function IfRender({ data, children }: ConditionalRenderProps) {
    if (!data) {
        return null
    }
    return <>{children(data)}</>
}
