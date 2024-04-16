'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import '../styles/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '../styles/demo/Demos.scss';

import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import {AppProvider} from './providers/approvider';
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-link" href={`/theme/theme-light/indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <ApolloProvider client={client}>
                    <PrimeReactProvider>
                        <AppProvider>

                        <LayoutProvider>{children}</LayoutProvider>
                        </AppProvider>
                    </PrimeReactProvider>
                </ApolloProvider>
            </body>
        </html>
    );
}
