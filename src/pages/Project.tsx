
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationMenu } from '@/components/NavigationMenu';
import { MessageSquare, Globe, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Project = () => {
  return (
    <div className="min-h-screen sam-gradient-bg">
      {/* Header */}
      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-gray-800">SAM</Link>
            </div>
            <NavigationMenu />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About SAM</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered legal assistant specializing in European asylum procedures
          </p>
        </div>

        {/* What is SAM Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">What is SAM?</h2>
              <p className="text-lg text-gray-700 mb-6">
                SAM is a cutting-edge legal vocal chatbot designed to be your expert guide through asylum procedures across Europe. 
                Whether you're seeking asylum, helping someone navigate the process, or working with refugees, SAM provides 
                instant, accurate information in your preferred language.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <span className="text-gray-700">Voice-enabled conversations for accessibility</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
                <span className="text-gray-700">Support for 44 languages instantly</span>
              </div>
              <div className="flex items-center gap-4">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-gray-700">Expert knowledge in European asylum procedures</span>
              </div>
            </div>
            <div className="sam-glass rounded-lg p-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">Real-time voice interaction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">Multilingual support (44 languages)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">Expert legal knowledge base</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">Country-specific procedures</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From hackathon innovation to real-world impact
            </p>
          </div>
          <Card className="sam-glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Born from Innovation</CardTitle>
              <CardDescription className="text-lg">
                The journey that started during an Amazon Web Services Hackathon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  SAM was conceived during an intensive Amazon Web Services Hackathon, where a passionate team from 
                  <strong className="text-gray-900"> Digitalizers</strong> recognized the critical need for accessible legal 
                  guidance in asylum procedures across Europe.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  What started as a 48-hour challenge quickly evolved into a mission-driven project. Our team of developers, 
                  legal experts, and user experience designers came together with a shared vision: to break down language 
                  barriers and make essential legal information accessible to those who need it most.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, SAM continues to evolve, powered by cutting-edge AI technology and guided by real-world feedback 
                  from users, NGOs, and legal professionals across Europe.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* NGO Solutions Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Solutions for NGOs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering organizations with data-driven insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="sam-glass border-0 shadow-lg">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Track conversation volumes, peak usage times, and user engagement patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Get detailed insights into how SAM is being used, helping you understand the needs 
                  of your community and optimize your support services.
                </p>
              </CardContent>
            </Card>

            <Card className="sam-glass border-0 shadow-lg">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Language Metrics</CardTitle>
                <CardDescription>
                  Monitor which languages are most requested and identify service gaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Understand the linguistic diversity of your users and ensure you're 
                  providing adequate support across all language communities.
                </p>
              </CardContent>
            </Card>

            <Card className="sam-glass border-0 shadow-lg">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Topic Analysis</CardTitle>
                <CardDescription>
                  Identify the most common questions and legal concerns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Discover trending topics and frequently asked questions to better 
                  prepare your staff and develop targeted support materials.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center">
          <Card className="sam-glass border-0 shadow-lg max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-gray-900">Ready to Get Started?</CardTitle>
              <CardDescription className="text-xl">
                Join thousands of users who trust SAM for their asylum procedure guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Create your account today and get instant access to expert legal guidance 
                in your preferred language. Help us build a more accessible future for asylum seekers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    Create Account
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="outline" size="lg" className="px-8 py-3 text-blue-600 border-blue-600 hover:bg-blue-50">
                    Try Dashboard
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    Try SAM Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Project;
