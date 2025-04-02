
export default function HomeFooter() {
    return (
        <footer className="bg-gray-900 py-12">
            <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-8 md:mb-0">
                <div className="flex items-center mb-4">
                    <span className="text-xl font-bold">trading.</span>
                </div>
                <p className="text-gray-400 max-w-xs">
                    Making investing accessible and rewarding for all Indians.
                </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-medium mb-4">Company</h3>
                    <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-lg font-medium mb-4">Products</h3>
                    <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white">Stocks</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Mutual Funds</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">US Stocks</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-lg font-medium mb-4">Support</h3>
                    <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                    </ul>
                </div>
                </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} trading. All rights reserved.
                </p>
            </div>
            </div>
        </footer>
    );
}