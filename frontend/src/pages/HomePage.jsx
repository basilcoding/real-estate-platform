import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Shield, Leaf, Bold } from 'lucide-react';
import Footer from '../components/Footer';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-zinc-800 flex flex-col">

      {/* Hero Section */}
      <section className="relative h-screen bg-zinc-900 flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Home Architecture"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <p className="text-[#BFA15F] text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-6">
            The Art of Luxury Living
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Discover Your <br />  Private Sanctuary
          </h1>
          <p className="text-lg text-zinc-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Explore an exclusive collection of premium villas designed for unparalleled elegance, privacy, and comfort.
          </p>

          <button
            onClick={() => navigate('/properties')}
            className="group inline-flex items-center gap-4 bg-white text-zinc-900 px-8 py-4 text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300"
          >
            Explore Portfolio
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-zinc-900 mb-6">What We Promise</h2>
        <div className="w-16 h-0.5 bg-[#BFA15F] mx-auto mb-10"></div>
        <p className="text-zinc-600 font-light leading-relaxed max-w-3xl mx-auto text-lg">
          <div className='pb-5'>
            <b>Uncompromising Quality</b> <br />Only the finest craftsmanship in every villa<br />
          </div>
          <div className='pb-5'>
            <b>Transparent Transactions</b><br /> We believe in complete clarity, from initial inquiry to final handover, ensuring a stress-free experience.<br />
          </div>
          <b>Curated Living Experiences</b><br /> We don’t just sell properties; we match you with homes that align with your lifestyle and vision.        </p>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-6 text-zinc-800">
              <Building2 size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif mb-3 uppercase tracking-wider text-zinc-900">Iconic Architecture</h3>
            <p className="text-zinc-500 font-light text-sm leading-relaxed">
              Award-winning designs that stand as landmarks of modern luxury and sophisticated aesthetic.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-6 text-zinc-800">
              <Shield size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif mb-3 uppercase tracking-wider text-zinc-900">Uncompromising Quality</h3>
            <p className="text-zinc-500 font-light text-sm leading-relaxed">
              Backward integration ensures absolute control over the quality of every component in your home.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-6 text-zinc-800">
              <Leaf size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif mb-3 uppercase tracking-wider text-zinc-900">Sustainable Luxury</h3>
            <p className="text-zinc-500 font-light text-sm leading-relaxed">
              Harmonizing opulent living with eco-conscious practices and lush, manicured landscapes.
            </p>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="bg-zinc-900 py-24 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Ready for your dream vacation?</h2>
        <p className="text-zinc-400 font-light mb-10 max-w-2xl mx-auto">
          Browse our exclusive collection of premium villas available for immediate viewing.
        </p>
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex border border-white text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-colors duration-300"
        >
          View All Villas
        </button>
      </section>
      <Footer />
    </div>
  );
}