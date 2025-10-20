import Link from 'next/link';
import { Lightbulb, Users, GraduationCap, Code, CreativeCommons, Briefcase } from 'lucide-react'; // Example icons, install lucide-react

// If you haven't installed lucide-react yet:
// npm install lucide-react

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar (Basic - you'll likely want a separate component) */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            SkillBridge
          </Link>
          <div className="space-x-4">
            <Link href="/courses" className="text-gray-600 hover:text-indigo-600 font-medium">
              Courses
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-700 to-purple-600 text-white py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10" style={{ backgroundImage: "url('/pattern-light.svg')" }}></div> {/* Optional pattern */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Unlock Your Potential with SkillBridge
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
              Your gateway to mastering new skills. Learn from expert instructors, track your progress, and earn certificates.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300"
              >
                Browse All Courses
                <Lightbulb className="ml-3 h-5 w-5" />
              </Link>
              <Link
                href="/register?role=instructor"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300"
              >
                Become an Instructor
                <Users className="ml-3 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features for Students */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Learn What You Love
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Access high-quality courses designed to help you achieve your goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-indigo-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <GraduationCap className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Diverse Course Catalog</h3>
                <p className="text-gray-600">
                  Explore thousands of courses across various categories like Programming, Design, Business, and more.
                </p>
              </div>
              <div className="p-8 bg-indigo-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <Lightbulb className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your learning journey with intuitive progress bars and completion percentages.
                </p>
              </div>
              <div className="p-8 bg-indigo-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <Code className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Certificate of Completion</h3>
                <p className="text-gray-600">
                  Receive verifiable certificates to showcase your newly acquired skills.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features for Instructors */}
        <section className="py-16 md:py-24 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Teach What You Know
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Share your expertise with a global audience and impact thousands of learners.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CreativeCommons className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                {/* <DesignServices className="h-10 w-10 text-purple-600 mx-auto mb-4" /> */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Course Management</h3>
                <p className="text-gray-600">
                  Intuitive dashboard to create, update, and manage your courses and lessons.
                </p>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <Briefcase className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Reach a Global Audience</h3>
                <p className="text-gray-600">
                  Connect with eager students from around the world and build your teaching brand.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Link
                href="/register?role=instructor"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300"
              >
                Start Teaching Today
                <Users className="ml-3 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action - Final */}
        <section className="bg-indigo-700 py-16 md:py-20 text-white text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Ready to Get Started?</h2>
                <p className="text-lg sm:text-xl mb-10 opacity-90">
                    Join SkillBridge today and embark on your learning or teaching journey!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-300"
                    >
                        Sign Up Now
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white border-2 border-white hover:bg-white hover:text-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-300"
                    >
                        Explore Courses
                    </Link>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}