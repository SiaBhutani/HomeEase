// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero section */}
      <section
        className="relative bg-cover w-[1520px] h-[600px]"
        style={{ backgroundImage: 'url("/img/img4.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-2">Sparkling Space</h1>
            <p className="text-lg mb-4">Spotless Homes, Spotless Lives</p>
            <button
              onClick={() => navigate("/services")}
              className="bg-teal-600 px-6 py-2 rounded text-white hover:bg-teal-700"
            >
              Book now
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-20 py-20 mt-12 bg-white shadow-md ring-4 shadow-slate-900">
        <div className="w-full md:w-1/2 flex justify-center shadow-md shadow-slate-700">
          <img
            src="/img/homeease3.jpg"
            alt="Cleaning Service Banner"
            className="max-w-full h-auto"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Keep your home sparkling ✨<br /> Explore our cleaning services
          </h2>
          <p className="text-gray-600 mb-8">
            "A clean home is a happy home." From dusty shelves to messy floors,
            let us handle it all while you relax and recharge.
          </p>

          {/* Service 1 */}
          <div className="flex items-start gap-4 mb-6">
            <div className="text-white bg-green-500 p-3 rounded-full">
              <i className="fas fa-broom text-xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Deep Cleaning
              </h4>
              <p className="text-sm text-gray-600">
                “Cleanliness is next to happiness.” Our team ensures your home
                is spotless from corner to corner.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="flex items-start gap-4 mb-6">
            <div className="text-white bg-blue-500 p-3 rounded-full">
              <i className="fas fa-shield-alt text-xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Safe & Trustworthy
              </h4>
              <p className="text-sm text-gray-600">
                “Your home, our responsibility.” We ensure secure and
                professional services you can rely on.
              </p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="flex items-start gap-4">
            <div className="text-white bg-yellow-500 p-3 rounded-full">
              <i className="fas fa-clock text-xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Time-Saving
              </h4>
              <p className="text-sm text-gray-600">
                “Spend time living, not cleaning.” Book, relax, and enjoy a
                clean home without lifting a finger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <div>
        <section className="py-10 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              className="h-64 rounded-lg shadow-md p-6 bg-cover bg-center text-white flex items-end"
              style={{ backgroundImage: "url('/img/img5.avif')" }}
            >
              <div className="bg-black bg-opacity-40 p-4 rounded-lg w-full">
                <h2 className="text-xl font-bold mb-2">Cleaning Services</h2>
                <p className="text-sm">
                  General Cleaning: Regular dusting, vacuuming, and tidying up.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="h-64 rounded-lg shadow-md p-6 bg-cover bg-center text-white flex items-end"
              style={{ backgroundImage: "url('/img/img6.avif')" }}
            >
              <div className="bg-black bg-opacity-40 p-4 rounded-lg w-full">
                <h2 className="text-xl font-bold mb-2">Laundry Services</h2>
                <p className="text-sm">
                  Washing and Ironing: Clothes washed, ironed, and neatly
                  folded.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="h-64 rounded-lg shadow-md p-6 bg-cover bg-center text-white flex items-end"
              style={{ backgroundImage: "url('/img/img7.png')" }}
            >
              <div className="bg-black bg-opacity-40 p-4 rounded-lg w-full">
                <h2 className="text-xl font-bold mb-2">Plumbing Services</h2>
                <p className="text-sm">
                  Leak Repair: Fixing dripping faucets and hidden leaks.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div
              className="h-64 rounded-lg shadow-md p-6 bg-cover bg-center text-white flex items-end"
              style={{ backgroundImage: "url('/img/img8.jpeg')" }}
            >
              <div className="bg-black bg-opacity-40 p-4 rounded-lg w-full">
                <h2 className="text-xl font-bold mb-2">Electrical Services</h2>
                <p className="text-sm">
                  Electrical Wiring: New installations and rewiring.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div
              className="h-64 rounded-lg shadow-md p-6 bg-cover bg-center text-white flex items-end"
              style={{ backgroundImage: "url('/img/img9.jpg')" }}
            >
              <div className="bg-black bg-opacity-40 p-4 rounded-lg w-full">
                <h2 className="text-xl font-bold mb-2">
                  Pest Control Services
                </h2>
                <p className="text-sm">
                  Bedbug Treatment: Full home inspection and treatment.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div
              className="h-64 rounded-lg shadow-md p-6 bg-cover bg-center text-white flex items-end"
              style={{ backgroundImage: "url('/img/img11.jpg')" }}
            >
              <div className="bg-black bg-opacity-40 p-4 rounded-lg w-full">
                <h2 className="text-xl font-bold mb-2">
                  Air Conditioning & Heating Services
                </h2>
                <p className="text-sm">
                  Duct Cleaning: Clearing air ducts for clean air flow..
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
