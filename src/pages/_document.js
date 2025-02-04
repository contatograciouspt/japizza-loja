import SettingServices from "@services/SettingServices";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Fetch general metadata from backend API
    const setting = await SettingServices.getStoreSeoSetting();

    return { ...initialProps, setting };
  }

  render() {
    const setting = this.props.setting;
    return (
      <Html lang="pt">
        <Head>
          <link rel="icon" href="favicon.ico" />
          <meta
            property="og:title"
            content={
              setting?.meta_title ||
              "jápizza - A Melhor Pizza em Mexilhoeira"
            }
          />
          <meta property="og:type" content="eCommerce Website" />
          <meta
            property="og:description"
            content={
              setting?.meta_description ||
              "Descubra as pizzas mais saborosas de Mexilhoeira! Ingredientes frescos, massa artesanal e um serviço de entrega rápido. Faça já o seu pedido!"
            }
          />
          <meta
            name="keywords"
            content={setting?.meta_keywords || "pizza em Mexilhoeira, melhor pizzaria, entrega de pizza, pizza artesanal"}
          />
          <meta
            property="og:url"
            content={
              setting?.meta_url || "https://japizza-loja.vercel.app/"
            }
          />
          <meta
            property="og:image"
            content={
              setting?.meta_img ||
              "https://res.cloudinary.com/ahossain/image/upload/v1636729752/facebook-page_j7alju.png"
            }
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
