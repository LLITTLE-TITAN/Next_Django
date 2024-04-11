'use client';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '@/types/layout';
import '@/styles/ButtonDemo.css';
import { useFormState, useFormStatus } from 'react-dom';
import { googleAuthenticate } from '@/app/lib/actions';



const Login: Page = () => {
    const [errorMsgGoogle, dispatchGoogle] = useFormState(googleAuthenticate, undefined) //googleAuthenticate hook
    const router = useRouter();
    const navigateToDashboard = () => {
        router.push('/');
    };
    const { pending } = useFormStatus();

    return (
        <div className="h-screen flex flex-column bg-cover" style={{ backgroundImage: 'url(/layout/images/pages/login-bg.jpg)' }}>
            <div className="shadow-2 bg-indigo-500 z-5 p-3 flex justify-content-between flex-row align-items-center">
                <div className="ml-3 flex" onClick={navigateToDashboard}>
                </div>
                <div className="mr-3 flex">
                    <Button onClick={navigateToDashboard} text className="p-button-plain text-white">
                        DASHBOARD
                    </Button>
                </div>
            </div>

            <div className="align-self-center mt-auto mb-auto flex grow w-500[px]">
                <div className="text-center z-5 flex flex-column border-1 border-round-md surface-border surface-card px-3">
                    <div className="-mt-5 text-white bg-cyan-700 border-round-md mx-auto px-3 py-1 border-1 surface-border">
                        <h5 className="m-0">SIGN IN</h5>
                    </div>

                    <h3>Welcome</h3>
                    <div className="button-demo w-full flex flex-column gap-3 px-3 pb-6">
                        <div className="template">
                            <form action={dispatchGoogle}>
                                <Button className="google p-0 items-center text-4xl" aira-label="Sign in With Google" aria-disabled={pending}>
                                    <i className="pi pi-google px-2"></i>
                                    <span className="px-3 font-mono">Sign in With Google</span>
                                    <p>{errorMsgGoogle}</p>
                                </Button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Login;
