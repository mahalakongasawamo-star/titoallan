import { motion } from 'framer-motion';
import { ScanLine, Cpu, Radio, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TechCard {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const techCards: TechCard[] = [
  {
    icon: ScanLine,
    title: '3D CBCT Imaging',
    description:
      'Full 3D cone-beam imaging for precise diagnosis, airway analysis, and treatment planning — one of the only offices in the area with this technology.',
    accent: 'from-primary-100 to-teal-light',
  },
  {
    icon: Cpu,
    title: 'iTero Scanning',
    description:
      'Digital impressions in minutes — no goopy molds. See a virtual simulation of your new smile before treatment even starts.',
    accent: 'from-secondary-100 to-secondary-50',
  },
  {
    icon: Radio,
    title: 'AI-Powered Bonding',
    description:
      'DIBS indirect bonding uses AI to place brackets with pinpoint accuracy for faster, more comfortable treatment and better results.',
    accent: 'from-blue-100 to-blue-50',
  },
  {
    icon: Smartphone,
    title: 'Remote Monitoring',
    description:
      'Track your progress from home with remote monitoring tools. Fewer office visits, more convenience — without compromising care.',
    accent: 'from-green-100 to-emerald-50',
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function TechGrid() {
  return (
    <section className="py-20 md:py-28 bg-[#eef4ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Technology that makes everything easier
          </h2>
          <p className="font-body text-gray-500 text-lg leading-relaxed">
            We've invested in tools that make your care smoother and more precise — and
            we're one of the only offices in the area with 3D CBCT and advanced airway imaging.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {techCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={cardVariant}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-primary-100/60
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon circle */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.accent}
                    flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-navy" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-bold text-navy mb-3">
                  {card.title}
                </h3>
                <p className="font-body text-gray-500 text-sm leading-relaxed">
                  {card.description}
                </p>

                {/* Hover accent line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-[3px] bg-primary rounded-full
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
