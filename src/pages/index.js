import { SidebarContext } from "@context/SidebarContext"
import React, { useContext, useEffect } from "react"
import { useRouter } from "next/router"

//internal import
import Layout from "@layout/Layout"
import Banner from "@components/banner/Banner"
import useGetSetting from "@hooks/useGetSetting"
import CardTwo from "@components/cta-card/CardTwo"
import OfferCard from "@components/offer/OfferCard"
import StickyCart from "@components/cart/StickyCart"
import Loading from "@components/preloader/Loading"
import ProductServices from "@services/ProductServices"
import ProductCard from "@components/product/ProductCard"
import MainCarousel from "@components/carousel/MainCarousel"
import FeatureCategory from "@components/category/FeatureCategory"
import AttributeServices from "@services/AttributeServices"
import CMSkeleton from "@components/preloader/CMSkeleton"
import RedirecionarLojas from "@components/modal/RedirecionarLojas"
import LojaFechadaModal from "@components/modal/LojaFechadaModal"

const Home = ({ popularProducts, discountProducts, attributes }) => {
  const router = useRouter()
  const { isLoading, setIsLoading } = useContext(SidebarContext)
  const { loading, error, storeCustomizationSetting } = useGetSetting()
  const [lojaFechadaModal, setLojaFechadaModal] = React.useState(false)
  const [showRedirecionarLojas, setShowRedirecionarLojas] = React.useState(false)
  const [storeStatus, setStoreStatus] = React.useState({
    isOpen: false,
    isClosed: true,
    isClosedDay: false
  })

  // console.log("storeCustomizationSetting", storeCustomizationSetting)

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [router])

  // useEffect(() => {
  //   const verificarHorarioFuncionamento = () => {
  //     // Get current date in both timezones for comparison
  //     const brasilTime = new Date()
  //     const portugalTimeStr = brasilTime.toLocaleString('pt-PT', {
  //       timeZone: 'Europe/Lisbon',
  //       hour12: false,
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       second: '2-digit'
  //     })

  //     // Parse Portugal time components
  //     const [datePart, timePart] = portugalTimeStr.split(', ')
  //     const [day, month, year] = datePart.split('/')
  //     const [hours, minutes, seconds] = timePart.split(':')

  //     // Create Portugal date object
  //     const portugalTime = new Date(
  //       parseInt(year),
  //       parseInt(month) - 1,
  //       parseInt(day),
  //       parseInt(hours),
  //       parseInt(minutes),
  //       parseInt(seconds)
  //     )

  //     // Extract time components for store hours calculation
  //     const diaSemanaAtual = portugalTime.getDay()
  //     const horaAtual = portugalTime.getHours()
  //     const minutosAtual = portugalTime.getMinutes()
  //     const tempoAtualEmMinutos = (horaAtual * 60) + minutosAtual

  //     // Define store hours
  //     const horarioAbertura = (diaSemanaAtual === 0 || diaSemanaAtual === 2 || diaSemanaAtual === 3)
  //       ? (17 * 60) + 30  // 17:30
  //       : 17 * 60         // 17:00

  //     const horarioFechamento = 22 * 60  // 22:00

  //     // Calculate store status
  //     const isDentroHorario = tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos < horarioFechamento
  //     const isDiaAberto = (diaSemanaAtual >= 2 && diaSemanaAtual <= 6) || diaSemanaAtual === 0
  //     const hasSelectedStore = localStorage.getItem('selectedStore')

  //     if (hasSelectedStore) {
  //       setShowRedirecionarLojas(false)
  //       setLojaFechadaModal(!isDentroHorario && !isDiaAberto)
  //     } else {
  //       setShowRedirecionarLojas(true)
  //     }

  //     setStoreStatus({
  //       isOpen: isDentroHorario && isDiaAberto,
  //       isClosed: !isDentroHorario || !isDiaAberto,
  //       isClosedDay: !isDiaAberto
  //     })
  //   }

  //   verificarHorarioFuncionamento()
  //   const interval = setInterval(verificarHorarioFuncionamento, 300000)
  //   return () => clearInterval(interval)
  // }, [])


  const verificarHorarioFuncionamento = () => {
    const portugalTimeStr = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon', hour12: false })
    const [datePart, timePart] = portugalTimeStr.split(', ')
    const [hours, minutes] = timePart.split(':')
    const portugalTime = new Date()
    const tempoAtualEmMinutos = (parseInt(hours) * 60) + parseInt(minutes)
    const diaSemanaAtual = portugalTime.getDay()

    const horarioAbertura = (diaSemanaAtual === 0 || diaSemanaAtual === 2 || diaSemanaAtual === 3)
      ? (17 * 60) + 30 : 17 * 60

    const horarioFechamento = 22 * 60
    const isDentroHorario = tempoAtualEmMinutos >= horarioAbertura && tempoAtualEmMinutos < horarioFechamento
    const isDiaAberto = (diaSemanaAtual >= 2 && diaSemanaAtual <= 6) || diaSemanaAtual === 0

    return isDentroHorario && isDiaAberto
  }

  useEffect(() => {
    const isLojaAberta = verificarHorarioFuncionamento()
    const hasSelectedStore = localStorage.getItem('selectedStore')

    if (!isLojaAberta) {
      setLojaFechadaModal(true)
    } else if (!hasSelectedStore) {
      setShowRedirecionarLojas(true)
    }
  }, [])

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
            <StickyCart />
            <div className="bg-white">
              <div className="mx-auto py-5 max-w-screen-2xl px-3 sm:px-10">
                <div className="flex w-full">
                  <div className="flex-shrink-0 xl:pr-6 lg:block w-full lg:w-3/5">
                    <MainCarousel />
                  </div>
                  <div className="w-full hidden lg:flex">
                    <OfferCard />
                  </div>
                </div>
                {storeCustomizationSetting?.home?.promotion_banner_status && (
                  <div className="bg-orange-100 px-10 py-6 rounded-lg mt-6">
                    <Banner />
                  </div>
                  )}
                </div>
              </div>
              {lojaFechadaModal ? (
                <LojaFechadaModal
                  isOpen={true}
                  onClose={() => {
                    setLojaFechadaModal(false)
                    if (!localStorage.getItem('selectedStore')) {
                      setShowRedirecionarLojas(true)
                    }
                  }}
                />
              ) : showRedirecionarLojas ? (
                <RedirecionarLojas
                  onStoreSelect={() => {
                    setShowRedirecionarLojas(false)
                  }}
                />
              ) : null}
            {/* feature category's */}
            {storeCustomizationSetting?.home?.featured_status && (
              <div className="bg-gray-100 lg:py-16 py-10">
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                        <CMSkeleton
                          count={1}
                          height={30}
                          loading={loading}
                          data={storeCustomizationSetting?.home?.feature_title}
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={4}
                          height={10}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home?.feature_description
                          }
                        />
                      </p>
                    </div>
                  </div>

                  <FeatureCategory />
                </div>
              </div>
            )}
            {/* popular products */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                      <CMSkeleton
                        count={1}
                        height={30}
                        loading={loading}
                        data={storeCustomizationSetting?.home?.popular_title}
                      />
                    </h2>
                    <p className="text-base font-sans text-gray-600 leading-6">
                      <CMSkeleton
                        count={5}
                        height={10}
                        error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home?.popular_description
                        }
                      />
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {popularProducts
                          ?.slice(
                            0,
                            storeCustomizationSetting?.home
                              ?.popular_product_limit
                          )
                          .map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              attributes={attributes}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* promotional banner card */}
            {storeCustomizationSetting?.home?.delivery_status && (
              <div className="block mx-auto max-w-screen-2xl">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
                  <div className="lg:p-16 p-6 bg-customRed shadow-sm border rounded-lg">
                    <CardTwo />
                  </div>
                </div>
              </div>
            )}
            {/* discounted products */}
            {storeCustomizationSetting?.home?.discount_product_status &&
              discountProducts?.length > 0 && (
                <div
                  id="discount"
                  className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
                >
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                        <CMSkeleton
                          count={1}
                          height={30}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_title
                          }
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={5}
                          height={20}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_description
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                          {discountProducts
                            ?.slice(
                              0,
                              storeCustomizationSetting?.home
                                ?.latest_discount_product_limit
                            )
                            .map((product) => (
                              <ProductCard
                                key={product._id}
                                product={product}
                                attributes={attributes}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </Layout>
      )}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { cookies } = context.req
  const { query, _id } = context.query

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),

    AttributeServices.getShowingAttributes(),
  ])

  return {
    props: {
      attributes,
      cookies: cookies,
      popularProducts: data.popularProducts,
      discountProducts: data.discountedProducts,
    },
  }
}

export default Home
