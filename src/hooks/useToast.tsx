import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from 'react'
import { Transition } from '@headlessui/react'

type ToastVariant = 'default' | 'destructive' | 'success'

interface ToastOptions {
    title: string
    description?: string
    variant?: ToastVariant
    duration?: number
}

interface ToastItem extends ToastOptions {
    id: string
}

interface ToastContextValue {
    toast: (options: ToastOptions) => void
    toasts: ToastItem[]
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastProviderProps {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const toast = useCallback(
        ({
            title,
            description,
            variant = 'default',
            duration = 3000,
        }: ToastOptions) => {
            const id = Math.random().toString(36).substring(2, 9)
            const newToast: ToastItem = {
                id,
                title,
                description,
                variant,
                duration,
            }
            setToasts((prev) => [...prev, newToast])

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id)
                }, duration)
            }
        },
        [removeToast],
    )

    return (
        <ToastContext.Provider value={{ toast, toasts, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast(): { toast: (options: ToastOptions) => void } {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return { toast: context.toast }
}

interface ToastContainerProps {
    toasts: ToastItem[]
    removeToast: (id: string) => void
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} removeToast={removeToast} />
            ))}
        </div>
    )
}

interface ToastProps {
    toast: ToastItem
    removeToast: (id: string) => void
}

function Toast({ toast, removeToast }: ToastProps) {
    const { title, description, variant, id } = toast

    const variantClasses: Record<ToastVariant, string> = {
        default: 'bg-gray-800 text-white',
        destructive: 'bg-red-600 text-white',
        success: 'bg-green-600 text-white',
    }

    return (
        <Transition
            show={true}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform ease-in duration-200 transition"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-2 opacity-0"
        >
            <div
                className={`w-72 p-4 rounded shadow-lg pointer-events-auto flex flex-col space-y-1 ${variantClasses[variant] || variantClasses.default}`}
            >
                <div className="flex justify-between items-start">
                    <p className="font-semibold">{title}</p>
                    <button
                        className="text-sm hover:opacity-75 ml-2"
                        onClick={() => removeToast(id)}
                    >
                        ✕
                    </button>
                </div>
                {description && (
                    <p className="text-sm text-white/90">{description}</p>
                )}
            </div>
        </Transition>
    )
}
