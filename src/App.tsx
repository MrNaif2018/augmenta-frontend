import { ToastProvider } from '@/hooks/useToast'
import MainPage from '@/pages/MainPage'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router'

import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignupPage'
import RequestDetailPage from '@/pages/RequestDetailPage'

export default function AugmentaApp() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route
                        path="/requests/:id"
                        element={<RequestDetailPage />}
                    />
                </Routes>
            </ToastProvider>
        </BrowserRouter>
    )
}
