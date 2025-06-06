import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRef } from "react";
import { motion, useInView } from "@/lib/framer";

const Returns = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.2 });

  return (
    <div className="relative bg-omnis-black text-omnis-white min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto" ref={contentRef}>
          <motion.header
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-tight">
              RETURNS
            </h1>
            <div className="w-20 h-0.5 bg-omnis-white mx-auto mb-8"></div>
            <p className="text-omnis-lightgray max-w-2xl mx-auto">
              Our return policy ensures your complete satisfaction with every
              purchase.
            </p>
          </motion.header>

          <div className="max-w-3xl mx-auto space-y-12">
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
              <p className="text-omnis-lightgray mb-4">
                We offer a 30-day return policy for all unworn, unwashed, and
                undamaged items with original tags attached. The return shipping
                cost is the responsibility of the customer, unless the item
                received was defective or incorrect.
              </p>
              <div className="border-l-2 border-omnis-white pl-6 space-y-4 text-omnis-lightgray">
                <p>
                  All returned items must be in their original condition with
                  all tags attached. Items that have been worn, washed, or
                  damaged will not be accepted for return.
                </p>
                <p>
                  Please note that some special edition or limited collection
                  items may be marked as final sale, and these items are not
                  eligible for return or exchange.
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-bold mb-4">How to Return</h2>
              <ol className="space-y-4 text-omnis-lightgray list-decimal ml-4">
                <li>
                  <span className="font-medium text-omnis-white">
                    Request a Return:
                  </span>{" "}
                  Contact our customer service team to initiate a return
                  request. You will receive a return authorization number.
                </li>
                <li>
                  <span className="font-medium text-omnis-white">
                    Package Your Items:
                  </span>{" "}
                  Pack the items securely in their original packaging if
                  possible.
                </li>
                <li>
                  <span className="font-medium text-omnis-white">
                    Include Return Form:
                  </span>{" "}
                  Fill out the return form that was included with your order or
                  that was sent to you via email.
                </li>
                <li>
                  <span className="font-medium text-omnis-white">
                    Ship Your Return:
                  </span>{" "}
                  Send your package to the address provided by our customer
                  service team.
                </li>
                <li>
                  <span className="font-medium text-omnis-white">
                    Refund Processing:
                  </span>{" "}
                  Once we receive and approve your return, we will process your
                  refund to the original payment method within 7-10 business
                  days.
                </li>
              </ol>
            </motion.section>

            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
              <p className="text-omnis-lightgray mb-4">
                If you need a different size or color, we recommend returning
                your item for a refund and placing a new order. This ensures
                faster processing and availability of your desired item.
              </p>
              <p className="text-omnis-lightgray">
                For any questions regarding returns or exchanges, please contact
                our customer service team at returns@oomnisclothing.net.
              </p>
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Returns;
