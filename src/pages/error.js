import React from "react"
import { FaCircleXmark } from "react-icons/fa6";

export default function SuccessPage() {
    React.useEffect(() => {
        setTimeout(() => {
            window.location.href = "/contact-us";
        }, 6000);
    }, []);

    return (
        <div
            className="bg-white px-6 py-10 lg:py-20 h-screen flex flex-wrap content-center">
            <div className="block justify-items-center mx-auto items-center text-center">
                <FaCircleXmark
                    width={100}
                    height={100}
                    color="red"
                    style={{ width: 60, height: 60 }}
                />
                <h1 className="font-bold font-serif font-2xl lg:text-3xl leading-6 mt-4 mb-4">
                    Houve um problema com o pagamento
                </h1>
                <h4 className="font-serif font-2xl lg:text-2xl leading-6 mt-4 mb-4">
                    Consulte seu banco. Caso seja um engano, contate o suporte da loja <br />
                    com informações de pagamento para avaliarmos o que aconteceu. <br />
                </h4>
                <span className="font-serif font-semibold font-2xl lg:text-2xl leading-6">
                    A Japizza lhe agradece por confiar em nós.
                </span>
                <p className="block text-center font-semibold text-base font-sans mt-4 text-gray-600">Redirecionando ao suporte...</p>
            </div>
        </div>
    )
}