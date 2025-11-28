import Link from "next/link";
import { CheckCircle, Truck, Shield, Headphones, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative border-b border-slate-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80&fit=crop)"
          }}
        />
        <div className="relative bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/95">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                About SpeedsterX
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Your trusted partner for premium RC cars and trucks in India. 
                We're passionate about bringing the best remote control vehicles to enthusiasts across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Our Story
                </h2>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    SpeedsterX was born from a simple passion: bringing the thrill of high-performance 
                    RC cars to enthusiasts across India. What started as a small venture has grown into 
                    one of the country's most trusted destinations for remote control vehicles.
                  </p>
                  <p>
                    We understand that RC cars aren't just toys—they're precision-engineered machines 
                    that bring joy, excitement, and a sense of achievement. That's why we carefully curate 
                    our collection, ensuring every vehicle meets our high standards for quality, performance, 
                    and value.
                  </p>
                  <p>
                    Whether you're a seasoned racer, a trail crawler, or just starting your RC journey, 
                    we're here to help you find the perfect vehicle that matches your passion and skill level.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square relative bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl overflow-hidden border border-slate-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Award className="h-24 w-24 text-primary mx-auto mb-4" />
                      <p className="text-2xl font-bold text-white">Premium Quality</p>
                      <p className="text-slate-300 mt-2">Since 2020</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose SpeedsterX?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We're committed to providing the best experience for RC enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Premium Selection</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We handpick every RC car in our collection, ensuring only the highest quality vehicles 
                from trusted brands make it to our store.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Fast Delivery</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Quick and reliable shipping across India. We ensure your RC car reaches you safely 
                and on time, ready to hit the road.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Quality Guarantee</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Every product comes with manufacturer warranty and our commitment to quality. 
                We stand behind every RC car we sell.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <Headphones className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Expert Support</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our team of RC enthusiasts is here to help. From choosing the right vehicle to 
                technical support, we've got you covered.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Community Driven</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We're part of the RC community. We understand your needs because we share your passion 
                for remote control vehicles.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Easy Returns</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Not satisfied? We offer hassle-free returns within 7 days. Your satisfaction 
                is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Our Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">Q</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Quality</h3>
                <p className="text-slate-300 text-sm">
                  We never compromise on quality. Every RC car in our store is carefully selected 
                  and tested to meet our high standards.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">I</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Integrity</h3>
                <p className="text-slate-300 text-sm">
                  Honest pricing, transparent policies, and genuine customer service. 
                  We believe in building trust through integrity.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">P</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Passion</h3>
                <p className="text-slate-300 text-sm">
                  We're passionate about RC cars, and that passion drives everything we do. 
                  It's not just business—it's our hobby too.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 border-t border-slate-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80&fit=crop)"
          }}
        />
        <div className="relative bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Start Your RC Journey?
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Explore our collection of premium RC cars and find your perfect match
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
