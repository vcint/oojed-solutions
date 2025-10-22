import Products from "@/components/Products";

export const metadata = {
  title: 'Products - OOJED Solutions',
  description: 'Products offered by OOJED Solutions: Solar Water Heaters, Solar Power Plants, Solar Pumps, LED Lighting, Poles & Masts and Spare Parts.'
};

export default function ProductsPage() {
  return (
    <main className="section">
      <div className="container py-12">
        {/* <h1 className="text-3xl md:text-4xl font-bold">Products</h1>
        <p className="muted mt-2">Browse our product categories and select a product to see images, specs and request a quote.</p> */}
        <div className="mt-8">
          <Products />
        </div>
      </div>
    </main>
  );
}
