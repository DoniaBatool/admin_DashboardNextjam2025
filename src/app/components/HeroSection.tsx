import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="hero-section relative bg-cover bg-center h-screen flex flex-col justify-center 
    items-center text-black" style={{ backgroundImage: 'url("/furn_2.jpg")' }}>
      <div className="hero-content text-center">
        <h1 className="text-4xl font-bold mb-4">Transform Your Home with Stylish, Custom Furniture</h1>
        <p className="text-xl mb-6">Explore our curated collection of handcrafted furniture designed to fit your unique style.</p>
        <Link href="/login">
          <button className="bg-blue-950 text-white px-6 py-3 rounded-lg text-lg hover:bg-slate-700">
             Login
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
