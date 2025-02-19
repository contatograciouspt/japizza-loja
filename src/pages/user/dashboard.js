// Dashboard Component (Dashboard.js)
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { IoLockOpenOutline } from "react-icons/io5";
import {
  FiCheck,
  FiFileText,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiSettings,
  FiShoppingCart,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { signOut } from "next-auth/react";

//internal import
import Layout from "@layout/Layout";
import Card from "@components/order-card/Card";
import RecentOrder from "@pages/user/recent-order";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@components/preloader/Loading";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import axios from "axios";

const Dashboard = ({ title, description, children }) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completeOrders, setCompleteOrders] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleGetOrders = async () => {
    setLoadingOrders(true);
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get(`http://localhost:5055/api/orders/order/${email}`);
      if (response.status === 200) {

        // Assuming the API returns an *array* of orders, even if example showed one order object
        if (Array.isArray(response.data)) {
          const allOrders = response.data;
          setOrders(allOrders); // Set all orders for RecentOrder table
          setTotalOrders(allOrders.length); // Total orders count is array length
          setPendingOrders(allOrders.filter(order => order?.status === "Pending").length); // Count "Pending" status
          setCompleteOrders(allOrders.filter(order => order?.status === "Pago").length); // Count "Pago" (Completed) status
        } else if (response.data) {
          // If API returns a single order object (as per your example, although it's less likely for a dashboard)
          // You might need to adjust the backend to return an array of orders for a user dashboard scenario
          setOrders([response.data]); // Set as an array of one order for RecentOrder table
          setTotalOrders(1); // If single object, assume it's one order
          setPendingOrders(response.data?.status === "Pending" ? 1 : 0);
          setCompleteOrders(response.data?.status === "Pago" ? 1 : 0);
        } else {
          setOrders([]);
          setTotalOrders(0);
          setPendingOrders(0);
          setCompleteOrders(0);
        }

      }
    } catch (error) {
      console.log("Erro ao obter pedidos:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogOut = () => {
    signOut();
    Cookies.remove("couponInfo");
    router.push("/");
  };

  useEffect(() => {
    setIsLoading(false);
    handleGetOrders();
  }, []);

  const userSidebar = [
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.dashboard_title
      ),
      href: "/user/dashboard",
      icon: FiGrid,
    },
    {
      title: "Minha Conta",
      href: "/user/my-account",
      icon: FiUser,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile
      ),
      href: "/user/update-profile",
      icon: FiSettings,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.change_password
      ),
      href: "/user/change-password",
      icon: FiFileText,
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={title ? title : "Dashboard"}
          description={description ? description : "This is User Dashboard"}
        >
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="py-10 lg:py-12 flex flex-col lg:flex-row w-full">
              <div className="flex-shrink-0 w-full lg:w-80 mr-7 lg:mr-10  xl:mr-10 ">
                <div className="bg-white p-4 sm:p-5 lg:p-8 rounded-md sticky top-32">
                  {userSidebar?.map((item) => (
                    <span
                      key={item.title}
                      className="p-2 my-2 flex font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-emerald-600"
                    >
                      <item.icon
                        className="flex-shrink-0 h-4 w-4"
                        aria-hidden="true"
                      />
                      <Link
                        href={item.href}
                        className="inline-flex items-center justify-between ml-2 text-sm font-medium w-full hover:text-emerald-600"
                      >
                        {item.title}
                      </Link>
                    </span>
                  ))}
                  <span className="p-2 flex font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-emerald-600">
                    <span className="mr-2">
                      <IoLockOpenOutline />
                    </span>{" "}
                    <button
                      onClick={handleLogOut}
                      className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-emerald-600"
                    >
                      {showingTranslateValue(
                        storeCustomizationSetting?.navbar?.logout
                      )}
                    </button>
                  </span>
                </div>
              </div>
              <div className="w-full bg-white mt-4 lg:mt-0 p-4 sm:p-5 lg:p-8 rounded-md overflow-hidden">
                {!children && (
                  <div className="overflow-hidden">
                    <h2 className="text-xl font-serif font-semibold mb-5">
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.dashboard_title
                      )}
                    </h2>
                    <div className="grid gap-4 mb-8 md:grid-cols-2 xl:grid-cols-3">
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.total_order
                        )}
                        Icon={FiShoppingCart}
                        quantity={totalOrders}
                        className="text-red-600  bg-red-200"
                      />
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.pending_order
                        )}
                        Icon={FiRefreshCw}
                        quantity={pendingOrders}
                        className="text-orange-600 bg-orange-200"
                      />
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.complete_order
                        )}
                        Icon={FiCheck}
                        quantity={completeOrders}
                        className="text-emerald-600 bg-emerald-200"
                      />
                    </div>
                    <RecentOrder orders={orders} loading={loadingOrders} error={null} />
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });