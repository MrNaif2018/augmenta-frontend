import { ToastProvider } from '@/hooks/useToast'
import MainPage from '@/pages/MainPage'

export default function AugmentaApp() {
    return (
        <ToastProvider>
            <MainPage />
        </ToastProvider>
    )
}
