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
  
  export default Skeleton;
  