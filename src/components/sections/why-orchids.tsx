import { Receipt, Shield, Wrench } from 'lucide-react'

export const WhyOrchids = () => {
  return (
    <section className="py-20 bg-light-gray">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Features */}
          <div>
            <h2 className="text-4xl font-bold text-dark-gray mb-12">
              Why Orchids?
            </h2>
            
            <div className="space-y-8">
              {/* Transparent pricing */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark-gray mb-2">
                    Transparent pricing
                  </h3>
                  <p className="text-medium-gray">
                    You know how much you will pay even before you book. No hidden charges.
                  </p>
                </div>
              </div>

              {/* Experts only */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark-gray mb-2">
                    Experts only
                  </h3>
                  <p className="text-medium-gray">
                    Our professionals are well trained and have on-job expertise.
                  </p>
                </div>
              </div>

              {/* Fully equipped */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark-gray mb-2">
                    fully equipped
                  </h3>
                  <p className="text-medium-gray">
                    Your home will be cleaned using latest cleaning tools.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image placeholder */}
          <div className="relative h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center">
            <p className="text-medium-gray text-lg">Service Image</p>
          </div>
        </div>
      </div>
    </section>
  );
};
