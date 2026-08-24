export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 py-16 md:px-20 mb-30">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-green-700">
          About Us
        </h1>

        <p className="mt-6 text-lg text-center text-gray-600 leading-relaxed">
          Welcome to <span className="font-semibold text-green-700">Groome</span> —
          a platform built on decades of real-world understanding and human insight.
        </p>

        {/* Who we are */}
        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Who We Are</h2>

          <p className="text-gray-700 leading-relaxed">
            We are a team of surveyors with over <b>27 years of experience</b>, exploring both
            urban and rural markets. Over the years, we have deeply studied public behavior,
            expectations, evolving market trends, supply chain systems, and untapped
            opportunities across diverse communities.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Based on extensive public feedback and our long-standing field experience, we at
            <b> Groome</b> have designed and developed a unique platform for every urban and
            rural individual in need — enabling people to easily utilize and convert their
            non-productive time into meaningful wealth creation opportunities.
          </p>
        </section>

        {/* Mission */}
        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>

          <p className="text-gray-700 leading-relaxed">
            Our mission is to design and develop a simple, user-friendly trade and business
            opportunity platform that serves as a breakthrough for both new and existing
            entrepreneurs from urban and rural areas — especially women.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We aim to empower individuals to showcase their inner talents, strengths, and
            abilities in commercial management, helping them build either a supplementary
            income or a fully established career path.
          </p>

          <p className="text-gray-700 leading-relaxed">
            This initiative is dedicated to reducing financial dependency and enabling
            self-reliance, while preserving pride, honor, and self-respect. We believe in
            enhancing every participant’s value as a multitasking, ambitious individual
            capable of leading a more refined and improved life.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Through these multitasking abilities, we are on a mission to enhance the beauty
            and dignity of every deserving life at the right time.
          </p>
        </section>

        {/* Vision */}
        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>

          <p className="text-gray-700 leading-relaxed">
            To provide a unified platform for every urban and rural individual in need,
            enabling them to achieve the milestones they have long envisioned — especially
            during the phase of life when they need it the most.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We envision a world where every individual can experience life at the “right age”
            with renewed momentum, confidence, and purpose — transforming potential into
            opportunity and time into value.
          </p>
        </section>

        {/* Closing */}
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-green-700">
            Groome — Turning Time Into Opportunity.
          </p>
        </div>

      </div>
    </main>
  );
}