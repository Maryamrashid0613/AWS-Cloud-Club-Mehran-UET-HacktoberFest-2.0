export default function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto bg-gray-800 p-6 rounded-2xl shadow-md">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">SKU</th>
            <th className="py-3 px-4 text-left">Price</th>
            <th className="py-3 px-4 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-700">
              <td className="py-3 px-4">{p.name}</td>
              <td className="py-3 px-4">{p.sku}</td>
              <td className="py-3 px-4">Rs.{p.price}</td>
              <td className="py-3 px-4">{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
