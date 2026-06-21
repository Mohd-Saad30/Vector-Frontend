import React from 'react';

const CategoryButtons = ({ categories, activeCategory, setActiveCategory }) => {
  const cats = ["All Categories", ...(categories || [])];

  return (
    <div className="max-w-[95%] md:max-w-[80%] mx-auto my-8">
      <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-4">
        {cats.map((item) => (
          <button
            key={item}
            onClick={() => setActiveCategory(item)}
            className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center rounded-sm shadow-sm border cursor-pointer
              ${activeCategory === item 
                ? 'bg-black text-white border-black scale-105' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black'
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;