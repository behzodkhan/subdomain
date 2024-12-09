import OrderForm from "@/components/Orders"

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Order a New Subdomain</h1>
        <OrderForm />
      </div>
    </div>
  )
}