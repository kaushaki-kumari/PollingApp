const Skeleton = () => (
  <div className="p-4 border rounded-lg shadow-sm bg-white animate-pulse">
    <div className="h-6 bg-gray-100 mb-2 w-3/4"></div>
    <div className="space-y-2">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="h-3 bg-gray-100 w-1/2"></div>
        </div>
      ))}
    </div>
    <div className="my-auto text-center mt-4">
      <div className="bg-gray-100 h-8 w-32 mx-auto"></div>
    </div>
  </div>
);

const TableSkeleton = () => {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <tbody>
            {[...Array(10)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border px-4 py-2">
                  <span className="h-4 bg-gray-100 rounded w-12 animate-pulse block" />
                </td>
                <td className="border px-4 py-2">
                  <span className="h-4 bg-gray-100 rounded w-24 animate-pulse block" />
                </td>
                <td className="border px-4 py-2">
                  <span className="h-4 bg-gray-100 rounded w-24 animate-pulse block" />
                </td>
                <td className="border px-4 py-2">
                  <span className="h-4 bg-gray-100 rounded w-48 animate-pulse block" />
                </td>
                <td className="border px-4 py-2">
                  <span className="h-4 bg-gray-100 rounded w-20 animate-pulse block" />
                </td>
                <td className="border px-4 py-2">
                  <span className="h-4 bg-gray-100 rounded w-32 animate-pulse block" />
                </td>
                <td className="border px-4 py-2">
                  <span className="h-4 bg-gray-100 rounded w-32 animate-pulse block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};




export { Skeleton, TableSkeleton };
