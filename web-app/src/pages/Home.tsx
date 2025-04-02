import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import HomeNav from '../components/HomeNav';
import HomeFooter from '../components/HomeFooter';

// interfaces 
interface LoginFormData {
  email: string;
  password: string;
}
interface LoginFormErrors {
  email?: string;
  password?: string;
  api?: string;
}


export default function HomePage() {
    
    const navigate = useNavigate();
  
    // Login Model
    // state: if we need to show login modal
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [loginForm, setLoginForm] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [loginErrors, setLoginErrors] = useState<LoginFormErrors>({});
    // state: if loading
    const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
    // state: password visibility
    const [showPassword, setShowPassword] = useState<boolean>(false);
  

    // Stock Trading WebApp Features
    const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
    const features = [
        {
        title: "Zero Brokerage for Equity Delivery",
        description: "Trade in equity delivery for free. No commissions, no hidden charges.",
        expanded: "We've eliminated brokerage fees for all equity delivery trades. This means more money stays in your pocket. Whether you're a day trader or a long-term investor, you benefit from our zero-commission structure on delivery trading."
        },
        {
        title: "Invest in Mutual Funds with Zero Commission",
        description: "Choose from 5,000+ direct mutual funds with no commission.",
        expanded: "Access the entire universe of direct mutual funds without paying any commission. Our platform offers tools to compare, analyze, and invest in mutual funds that align with your financial goals. Set up SIPs or make lump sum investments with ease."
        },
        {
        title: "Quick and Easy Account Opening",
        description: "Open your investment account in less than 5 minutes.",
        expanded: "Our paperless, digital KYC process makes account opening a breeze. All you need is your Aadhaar card, PAN card, and a mobile number. The entire process is secure, fast, and can be completed from the comfort of your home."
        },
        {
        title: "Powerful Research Tools",
        description: "Make informed decisions with our advanced analytics and research.",
        expanded: "Access detailed company fundamentals, technical indicators, and historical data to make better investment decisions. Our platform integrates powerful charting tools, real-time alerts, and comprehensive stock screeners to help you identify opportunities."
        }
    ];
    // toggle feature expansion
    const toggleFeature = (index: number) => {
        if (expandedFeature === index) {
        setExpandedFeature(null);
        } else {
        setExpandedFeature(index);
        }
    };
        
    // handle form changes
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
        if(loginErrors[name as keyof LoginFormErrors]){
            const updatedErrors = { ...loginErrors };
            delete updatedErrors[name as keyof LoginFormErrors];
            setLoginErrors(updatedErrors);
        }
    };
  
    // validation: login form
    const validateLoginForm = (): boolean => {
        const errors: LoginFormErrors = {};
        if(!loginForm.email.trim()){
            errors.email = 'Email is required';
        } 
        else if(!/\S+@\S+\.\S+/.test(loginForm.email)){
            errors.email = 'Email is invalid';
        }
        if(!loginForm.password){
            errors.password = 'Password is required';
        }
        setLoginErrors(errors);
        return Object.keys(errors).length === 0;
    };
  
    // Handle login form submission
    const POST_SIGNIN_API = 'http://localhost:3007/api/customers/signin'
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateLoginForm()){
            return;
        }
        setIsLoginLoading(true);
        try{
        const response = await fetch(POST_SIGNIN_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: loginForm.email,
                password: loginForm.password
            }),
        });
        
        if(response.ok){
            const data = await response.json();
            localStorage.setItem('userId', data.data.userId);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('userEmail', data.data.userEmail);
            // todo: changes            
            navigate('/dashboard');
        }
        else{
            const errorData = await response.json();
            setLoginErrors({ 
                api: errorData.message || 'Login failed. Please check your credentials.' 
            });
        }
        }catch(error){
            setLoginErrors({ 
                api: 'Network error. Please check your connection and try again.' 
            });
        }finally{
            setIsLoginLoading(false);
        }
    };
  
    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className='min-h-screen bg-black text-white'>
        <HomeNav setShowLoginModal={setShowLoginModal} navigateToRegister={navigateToRegister} />

        {/* Hero Section */}

        {/* Hero: Left Section*/}
        <div className="max-w-screen-xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Investing Made <span className="text-green-400">Simple</span> for Everyone
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Start your wealth creation journey with zero commission on equity delivery. Trade in stocks, ETFs, IPOs, mutual funds & more.
                </p>
                <button 
                    onClick={navigateToRegister}
                    className="flex items-center px-6 py-3 bg-green-400 text-black rounded-md hover:bg-green-500 transition-colors"
                    >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </div>

            {/* Hero: Right Section*/}
            <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-center">Join 40 Million+ Investors</h2>
                        <p className="text-center text-gray-400">Create your account in minutes</p>
                    </div>
                    <div className="mt-6 space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg flex items-start">
                        <div className="bg-green-400 rounded-full w-8 h-8 flex items-center justify-center text-black font-bold mr-3 flex-shrink-0">
                        1
                        </div>
                        <div>
                        <h3 className="font-medium mb-1">Enter Your Details</h3>
                        <p className="text-sm text-gray-400">Provide basic information to create your account</p>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-start">
                        <div className="bg-green-400 rounded-full w-8 h-8 flex items-center justify-center text-black font-bold mr-3 flex-shrink-0">
                        2
                        </div>
                        <div>
                        <h3 className="font-medium mb-1">Complete KYC</h3>
                        <p className="text-sm text-gray-400">Verify your identity with our paperless KYC process</p>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-start">
                        <div className="bg-green-400 rounded-full w-8 h-8 flex items-center justify-center text-black font-bold mr-3 flex-shrink-0">
                        3
                        </div>
                        <div>
                        <h3 className="font-medium mb-1">Start Investing</h3>
                        <p className="text-sm text-gray-400">Fund your account and begin your investment journey</p>
                        </div>
                    </div>
                    </div>
                </div>
                
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg transform -rotate-6"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg transform rotate-12"></div>
                
                </div>
            </div>
            </div>
        </div>
        
        {/* "Why choose us" Section */}
        <div className="bg-gray-900 py-16">
            <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Why Choose us</h2>
            
            <div className="space-y-4">
                {features.map((feature, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                    <button 
                    className="w-full p-4 text-left flex justify-between items-center"
                    onClick={() => toggleFeature(index)}
                    >
                    <h3 className="text-xl font-medium">{feature.title}</h3>
                    {expandedFeature === index ? 
                        <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    }
                    </button>
                    
                    <div className={`px-4 overflow-hidden transition-all duration-300 ${expandedFeature === index ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                    <p className="text-gray-300 mb-2">{feature.description}</p>
                    <p className="text-gray-400 text-sm">{feature.expanded}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        
        {/* call to action Section */}
        <div className="max-w-screen-xl mx-auto px-4 py-16">
            <div className="bg-gray-900 rounded-xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-8 md:mb-0 md:mr-8">
                        <h2 className="text-3xl font-bold mb-4">Ready to start investing?</h2>
                        <p className="text-xl text-gray-300">
                            Your financial future is just a few clicks away.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                        <button 
                            onClick={() => setShowLoginModal(true)}
                            className="px-6 py-3 text-green-400 border border-green-400 rounded-md hover:bg-green-400 hover:text-black transition-colors w-full sm:w-auto"
                            >
                            Login
                        </button>
                        <button 
                            onClick={navigateToRegister}
                            className="px-6 py-3 bg-green-400 text-black rounded-md hover:bg-green-500 transition-colors w-full sm:w-auto"
                            >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Login Modal */}
        {showLoginModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 relative">
                <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                ×
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Groww</h2>
                
                <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-400 mb-1">Email</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-3 py-2 bg-gray-800 border ${loginErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:border-green-400`}
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                    />
                    {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>}
                </div>
                
                {/* Password */}
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-400 mb-1">Password</label>
                    <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`w-full px-3 py-2 bg-gray-800 border ${loginErrors.password ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:border-green-400`}
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    </div>
                    {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>}
                </div>
                
                {/* API Error */}
                {loginErrors.api && (
                    <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-md">
                    <p className="text-red-400 text-sm">{loginErrors.api}</p>
                    </div>
                )}
                
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-green-400 text-black rounded-md font-medium hover:bg-green-500 transition-colors flex items-center justify-center"
                    disabled={isLoginLoading}
                >
                    {isLoginLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </>
                    ) : (
                    'Login'
                    )}
                </button>
                </form>
                
                <p className="mt-4 text-center text-gray-400">
                Don't have an account?{" "}
                <button 
                    className="text-green-400 hover:underline"
                    onClick={() => {
                    setShowLoginModal(false);
                    navigateToRegister();
                    }}
                >
                    Sign up
                </button>
                </p>
                
                <p className="mt-2 text-center text-gray-500 text-xs">
                By logging in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
            </div>
        )}
        
        <HomeFooter/>
        </div>
    );
}