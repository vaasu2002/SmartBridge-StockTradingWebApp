import React from 'react';
import { TrendingUp, BarChart, PieChart, Shield, Users, Zap, Brain } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-white">
      {/* Main Hero Section - Centered and Larger */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
              <span className="block">Smarter trading for</span>
              <span className="block text-blue-600">modern investors</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
              Trade stocks, options, mutual funds, and more with zero brokerage fees. Access advanced charts, expert research, and powerful trading tools for both beginners and pros.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#"
                className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-base md:text-lg font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1"
              >
                Get started
              </a>
              <a
                href="#"
                className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-base md:text-lg font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all duration-200"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Banner */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trust with confidence
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              That's why 1.5+ crore customers trust TradeSmart with ₹4.5+ lakh crores of equity investments and contribute to 15% of daily retail exchange volumes in India.
            </p>
          </div>
        </div>
      </div>
      
      {/* Features Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-xl font-medium text-gray-900">Zero Brokerage</h3>
            </div>
            <p className="text-gray-600">Trade equity stocks with absolutely zero brokerage fees on delivery orders.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-xl font-medium text-gray-900">Advanced Charts</h3>
            </div>
            <p className="text-gray-600">Access powerful technical analysis tools with 100+ indicators and drawing tools.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-xl font-medium text-gray-900">Diverse Portfolio</h3>
            </div>
            <p className="text-gray-600">Invest in stocks, ETFs, IPOs, mutual funds, and more from a single platform.</p>
          </div>
        </div>
      </div>
      
      {/* Customer First Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Customer-first always</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">No spam or gimmicks</h3>
              </div>
              <p className="text-gray-600">No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">The TradeSmart universe</h3>
              </div>
              <p className="text-gray-600">Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Do better with money</h3>
              </div>
              <p className="text-gray-600">With initiatives like <strong>Nudge</strong> and <strong>Kill Switch</strong>, we don't just facilitate transactions, but actively help you do better with your money.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Smart Decision Making</h3>
              </div>
              <p className="text-gray-600">Access detailed analytics and intelligent insights to help you make informed investment decisions based on market trends.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trading Stats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">By the numbers</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              TradeSmart has become India's trusted trading platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-blue-600">15%</p>
              <p className="mt-2 text-lg font-medium text-gray-500">Daily retail volume</p>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-extrabold text-blue-600">₹4.5+ Lakh Cr</p>
              <p className="mt-2 text-lg font-medium text-gray-500">Equity investments</p>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-extrabold text-blue-600">1.5+ Cr</p>
              <p className="mt-2 text-lg font-medium text-gray-500">Active customers</p>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-extrabold text-blue-600">30+</p>
              <p className="mt-2 text-lg font-medium text-gray-500">Fintech startups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;