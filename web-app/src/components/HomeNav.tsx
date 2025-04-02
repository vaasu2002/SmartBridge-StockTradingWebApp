
interface HomeNavProps {
    setShowLoginModal: (value: boolean) => void;
    navigateToRegister: () => void;
}
export default function HomeNav({ setShowLoginModal, navigateToRegister }: HomeNavProps) {
    return (
    <nav className='border-b border-gray-800'>
            <div className='max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3'>
                <div className='flex items-center'>
                    <span className="text-2xl font-bold">trading.</span>
                </div>
            
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setShowLoginModal(true)}
                        className="px-4 py-2 text-green-400 border border-green-400 rounded-md hover:bg-green-400 hover:text-black transition-colors"
                        >
                        Login
                    </button>

                    <button 
                        onClick={navigateToRegister}
                        className="px-4 py-2 bg-green-400 text-black rounded-md hover:bg-green-500 transition-colors"
                    >
                        Register
                    </button>
                </div>
            </div>
        </nav>
    );
}