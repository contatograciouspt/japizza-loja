// Category.js
import React, { useContext, useState } from "react"; // Import useState
import Link from "next/link";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

//internal import
import { pages } from "@utils/data";
import Loading from "@components/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
import CategoryCard from "@components/category/CategoryCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import HorarioModal from "@components/modal/HorarioModal";

const Category = () => {
  const { categoryDrawerOpen, closeCategoryDrawer } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false); // State for HorarioModal - declare using useState here
  const { data, error, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  // HorarioModal handlers
  const handleOpenHorarioModal = () => {
    setIsHorarioModalOpen(true);
  };

  const handleCloseHorarioModal = () => {
    setIsHorarioModalOpen(false);
  };

  const now = new Date();
  const diaSemanaAtual = now.getDay();
  const tempoAtualEmMinutos = now.getHours() * 60 + now.getMinutes();
  const horarioAbertura = diaSemanaAtual === 0 || diaSemanaAtual === 2 || diaSemanaAtual === 3 ? 17 * 60 + 30 : 17 * 60;
  const horarioFechamento = 22 * 60;

  const isDentroHorario = tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos < horarioFechamento;
  const isDiaAberto = diaSemanaAtual >= 2 && diaSemanaAtual <= 6 && isDentroHorario;

  return (
    <div className="flex flex-col w-full h-full bg-white cursor-pointer scrollbar-hide">
      {categoryDrawerOpen && (
        <div className="w-full flex justify-between items-center h-16 px-6 py-4 bg-customRed text-white border-b border-gray-100">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center">
            <Link href="/" className="mr-10">
              <Image
                width={100}
                height={38}
                src="/logo_japizza.png"
                alt="logo"
              />
            </Link>
          </h2>
          <button
            onClick={closeCategoryDrawer}
            className="flex text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-red-500 p-2 focus:outline-none transition-opacity hover:text-red-600"
            aria-label="close"
          >
            <IoClose />
          </button>
        </div>
      )}
      <div className="w-full max-h-full">
        {categoryDrawerOpen && (
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center border-b px-8 py-3">
            Todas as categorias
          </h2>
        )}
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : error ? (
          <p className="flex justify-center align-middle items-center m-auto text-xl text-red-500">
            {error?.response?.data?.message || error?.message}
          </p>
        ) : (
          <div className="relative grid gap-2 p-6">
            {data[0]?.children?.map((category) => (
              <CategoryCard
                key={category._id}
                id={category._id}
                icon={category.icon}
                nested={category.children}
                title={showingTranslateValue(category?.name)}
              />
            ))}
          </div>
        )}
        {categoryDrawerOpen && (
          <div className="relative grid gap-2 mt-5">
            <h3 className="font-semibold font-serif text-lg m-0 text-heading flex align-center border-b px-8 py-3">
              Páginas
            </h3>
            <div className="relative grid gap-1 p-6">
              {pages.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="p-2 flex font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-red-500"
                >
                  <item.icon
                    className="flex-shrink-0 h-4 w-4"
                    aria-hidden="true"
                  />
                  <p className="inline-flex items-center justify-between ml-2 text-sm font-medium w-full hover:text-red-500">
                    {item.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="relative grid gap-2 mt-5">
          <h3 className="font-semibold font-serif text-lg m-0 text-heading flex align-center border-b px-8 py-3">
            Horários de funcionamento
          </h3>
          <div className="relative grid gap-1 p-6">
            <div className="flex items-center justify-self-start flex-col">
              <button
                type="button"
                onClick={handleOpenHorarioModal} // Make sure this is correctly connected
                className="relative inline-flex items-center bg-red-100 font-serif ml-2 py-0 px-2 rounded text-sm font-medium text-red-500 hover:text-customRed focus:outline-none"
              >
                <span className={`relative flex h-2 w-2 mr-1`}>
                  <span className={`animate-ping absolute inline-flex -top-2 -right-16 h-full w-full rounded-full ${isDiaAberto ? 'bg-green-500' : 'bg-red-500'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full -top-2 -right-16 h-2 w-2 ${isDiaAberto ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                <p className="relative -left-2">
                  {isDiaAberto ? 'Aberto' : 'Fechado'}
                </p>
              </button>
            </div>
          </div>
          <HorarioModal // Ensure props are passed correctly
            isOpen={isHorarioModalOpen}
            onClose={handleCloseHorarioModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;