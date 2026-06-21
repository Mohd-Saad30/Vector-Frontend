const ProductCard = ({ product, onClick }) => {


  return (
    <div onClick={onClick} className="bg-white border border-gray-100 p-4 flex flex-col group transition-all hover:shadow-2xl cursor-pointer relative">



      <div className="bg-[#fcfcfc] aspect-square flex items-center justify-center mb-4 overflow-hidden relative">
        <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="flex-1">
        <h3 className="text-gray-800 text-[13px] font-medium mb-1 line-clamp-1 uppercase">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          {/* Using toLocaleString for proper comma formatting */}
          <span className="text-black font-bold text-lg">₹ {Number(product.price).toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-xs">₹ {Number(product.originalPrice).toLocaleString('en-IN')}</span>
          )}
        </div>



      </div>
    </div>
  );
};

export default ProductCard;