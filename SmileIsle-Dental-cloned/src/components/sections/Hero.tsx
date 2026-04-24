import { motion } from 'framer-motion';

const BOOKING_URL = 'https://smileisleorthodontics.com/book';
const PHONE = '(813) 755-4655';

export default function Hero() {
  return (
    <section className="relative bg-[#eef4ff] overflow-hidden wave-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Left Content - 3 cols */}
          <motion.div
            className="md:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary-700 text-sm font-body font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Your Favorite Odessa Orthodontists
              </span>
            </motion.div>

            {/* Heading */}
            <div>
              <p className="font-body text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
                Welcome to
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-[1.1]">
                A new smile is coming to{' '}
                <span className="text-primary">Odessa</span>
              </h1>
            </div>

            {/* Subheadline */}
            <motion.p
              className="text-lg text-gray-600 font-body max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Board-certified orthodontist Dr. Marina Kosturos brings a boutique,
              whole-body approach to orthodontics — with 3D imaging, airway support,
              and a coastal-calm office designed for your comfort.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white font-body font-semibold text-base
                  hover:bg-navy-light transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Book Free Consultation
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
              <a
                href={`tel:${PHONE.replace(/[^\d]/g, '')}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-navy-light font-body font-semibold text-base
                  border-b-2 border-navy-light hover:text-navy hover:border-navy transition-colors duration-300"
              >
                Call Us!
              </a>
            </motion.div>
          </motion.div>

          {/* Right Image - 2 cols */}
          <motion.div
            className="md:col-span-2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative">
              {/* Organic wave border shape */}
              <div
                className="aspect-[4/5] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] overflow-hidden bg-primary-100 shadow-2xl"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                {/* Placeholder for lifestyle image */}
                <div className="w-full h-full bg-gradient-to-br from-primary-200 via-teal-soft to-primary-100 flex items-center justify-center">
                  <div className="text-center space-y-3 px-6">
                    <svg className="mx-auto text-primary-600" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <p className="text-primary-700 font-body text-sm font-medium">
                      Lifestyle Image Placeholder
                    </p>
                    <p className="text-primary-500 font-body text-xs">
                      Replace with hero photo
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative accent blobs */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full blur-xl" aria-hidden="true" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-primary/15 rounded-full blur-2xl" aria-hidden="true" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave bottom divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" aria-hidden="true">
        <svg
          className="relative block w-full h-[60px] md:h-[80px]"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFFCF7"
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
}
