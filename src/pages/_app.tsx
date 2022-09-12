import '../styles/globals.css';
import type { AppProps } from 'next/app';
import App from 'next/app';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { store } from '../store/store';
import BaseLayout from '../layouts/base';
import { SessionProvider } from "next-auth/react";
import AppModal from '../components/modals';


 
type NextPageWithLayout = NextPage & {
  layout?: string
}

type AppPropsCustom = AppProps & {
  Component: NextPageWithLayout
}



class MyApp extends App<AppPropsCustom> {

  public render() {
    let persistor = persistStore(store);
    const { Component, pageProps } = this.props;
    let Layout = !!Component.layout ? Component.layout : BaseLayout;
    return (
      <SessionProvider
        session={pageProps.session}
      >
        <Head>
          <title>MINPOMO | Pomodoro</title>
          <meta name="description" content="The Pomodoro Technique is a time management method developed by Francesco Cirillo."/>
          <meta name="keywords" content="Pomodoro, Web"/>
          <meta name="author" content="Nipatpon Changdum"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Provider store={store}>
          <PersistGate loading={<>Persisting...</>} persistor={persistor}>
            
              <Layout>
                <Component {...pageProps} />
              </Layout> 
              <AppModal/> 
          </PersistGate>
        </Provider>
      </SessionProvider>

    );
  }
}

export default MyApp;