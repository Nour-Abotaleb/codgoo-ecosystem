import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, ArrowRight, FilterIcon, ArrowUpIcon } from "@utilities/icons";
import type { DashboardTokens } from "../../types";
import { useGetProductsQuery } from "@features/dashboard/api/dashboard-api";
import productImg1 from "@assets/images/software/product-img1.svg";
import productsBg from "@assets/images/software/products-bg.svg";

type ProductsViewProps = {
  readonly tokens: DashboardTokens;
};

export const ProductsView = ({ tokens }: ProductsViewProps) => {
  const navigate = useNavigate();
  const { data: apiData, isLoading, error, refetch } = useGetProductsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Use API data only
  const productsData = useMemo(() => {
    console.log("=== PRODUCTS DEBUG ===");
    console.log("API Data:", apiData);
    console.log("API Data Type:", typeof apiData);
    console.log("Has products?:", apiData?.products);
    console.log("Products length:", apiData?.products?.length);
    console.log("Is Loading:", isLoading);
    console.log("Error:", error);
    console.log("Auth Token:", localStorage.getItem("auth_token"));
    console.log("===================");
    
    if (apiData?.products && apiData.products.length > 0) {
      return apiData.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category_name || "General",
        image: product.image || productImg1,
        price: product.price,
        description: product.description,
        background_image: product.background_image,
        type: product.type,
      }));
    }
    return [];
  }, [apiData, isLoading, error]);

  const totalPages = Math.ceil(productsData.length / pageSize);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return productsData;
    }
    const query = searchQuery.toLowerCase();
    return productsData.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, productsData]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          ««
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          «
        </button>
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 font-semibold text-[var(--color-page-text)]"
              >
                …
              </span>
            );
          }
          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`${
                isCurrent ? "bg-[#071FD7] text-white" : tokens.buttonGhost
              } rounded-full px-3 py-1 text-xs font-semibold`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50`}
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Featured Product Section */}
      <div className={`${tokens.cardBase} rounded-[20px] overflow-hidden transition-colors relative ${tokens.isDark ? "bg-[#1E1B2E]" : "bg-[#2B3674]"}`}>
        <img
          src={productsBg}
          alt="Product illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative flex flex-col md:flex-row items-center justify-between p-6 md:p-8 z-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl md:text-4xl lg:text-[46px] font-regular text-white leading-tight">
                Most Used Product: <span className="text-nowrap font-extrabold">Smart <br /> CRM System</span>
              </h3>
            </div>
            <div className="flex items-start justify-between gap-70">
                <p className="text-white/70 text-sm md:text-base lg:text-xl font-light">
                    Trusted by 120+ businesses
                </p>
                <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full cursor-pointer border border-white text-white px-6 py-2.5 text-sm md:text-base font-medium hover:bg-white/10 transition-colors w-fit"
                >
                View Product
                <ArrowRight className="h-4 w-4" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-full items-center gap-3 rounded-full bg-transparent stroke px-4 text-[var(--color-search-text)] transition-colors`}
        >
          <SearchIcon className="h-5 w-5 text-[#A7A7A7]" />
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 w-full bg-transparent text-sm text-[var(--color-search-text)] placeholder:text-[#A7A7A7] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className={`flex h-12 px-4 items-center justify-center rounded-full ${tokens.isDark ? "bg-[#2E314166]" : "bg-white"} transition-colors hover:opacity-80`}
          title="Refresh products"
        >
          <span className="text-xs font-medium">Refresh</span>
        </button>
        <button
          type="button"
          className={`flex h-12 w-12 items-center justify-center rounded-full ${tokens.isDark ? "bg-[#2E314166]" : "bg-white"} transition-colors hover:opacity-80`}
          aria-label="Filter products"
        >
          <FilterIcon className={`h-5 w-5 ${tokens.isDark ? "text-white/70" : "text-[#071FD7]"}`} />
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>Loading products...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-red-500">Error loading products. Please check console for details.</p>
            <p className={`text-xs mt-2 ${tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}`}>
              {JSON.stringify(error)}
            </p>
          </div>
        ) : paginatedProducts.length > 0 ? (
          paginatedProducts.map((product: any) => (
            <div
              key={product.id}
              className={`${tokens.cardBase} rounded-[20px] overflow-hidden transition-colors ${tokens.isDark ? "bg-tansparent stroke " : "!bg-white"}`}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image || productImg1}
                  alt={product.name}
                  className="w-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="px-6 pt-6 pb-4 flex flex-col gap-4 relative">
                <div className="flex items-center gap-4">
                  {/* Placeholder Circle */}
                  <div className={`w-24 h-24 rounded-full bg-[#7282FF] border-5 ${tokens.isDark ? "border-[#1E1B2E]" : "border-white"} absolute -top-5 left-3`}></div>

                  {/* Product Name and Category */}
                  <div className="flex flex-col gap-1 absolute top-3 left-30">
                      <h4 className={`text-xl font-bold ${tokens.isDark ? "text-white" : "text-[#1B2559]"}`}>
                      {product.name}
                      </h4>
                      <p className={`text-sm ${tokens.isDark ? "text-white/60" : "text-[#838593]"}`}>
                      {product.category}
                      </p>
                  </div>
                </div>
                {/* Learn More Link */}
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/products/${product.id}`)}
                  className={`inline-flex items-center justify-end gap-2 text-sm font-medium mt-7 ${tokens.isDark ? "text-white/70 hover:text-white" : "text-[#838593] hover:text-[#071FD7]/80"} transition-colors`}
                >
                  Learn More
                    {/* Arrow Icon */}
                    <div className="flex justify-end flex items-center justify-center text-center cursor-pointer flex-shrink-0">
                       <ArrowUpIcon className="w-7 h-7 p-1 bg-gradient-to-b from-[#071FD766] to-[#071FD7] rounded-full" />
                   </div>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className={tokens.isDark ? "text-white/50" : "text-[#A3AED0]"}>No products found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

