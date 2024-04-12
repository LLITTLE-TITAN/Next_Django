'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { useFormState } from 'react-dom';
import { create_candidate } from '@/app/lib/actions';

interface DropdownItem {
    name: string;
    code: string;
}

const FormLayoutDemo = () => {
    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
    const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'Green', code: 'Green' },
            { name: 'Red', code: 'Red' },
            { name: 'Unassigned', code: 'Unassigned' },
            { name: 'Yellow', code: 'Yellow' },
            { name: '-Other-', code: '-Other-' }
        ],
        []
    );

    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };

    useEffect(() => {
        setDropdownItem(dropdownItems[0]);
    }, [dropdownItems]);

    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(create_candidate, initialState);

    return (
        <form action={dispatch}>
            <div className="grid">
                <div className="col-12">
                    <div className="card p-fluid font-medium text-base">
                        <div className="formgrid grid">
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="name2">* First name</label>
                                    <InputText id="name2" name="first_name" type="text" placeholder="Legal first name" required />
                                </div>
                                <div className="field col" id="first_name-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.first_name &&
                                        state.errors.first_name.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="email2">* Email address</label>
                                    <InputText id="email2" name="email" type="text" placeholder="Email address" required />
                                </div>
                                <div className="field col" id="email-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.email &&
                                        state.errors.email.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="name2">* Last Name</label>
                                    <InputText id="name2" name="last_name" type="text" placeholder="Legal last name" required />
                                </div>
                                <div className="field col" id="last_name-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.last_name &&
                                        state.errors.last_name.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="phone2">* Phone</label>
                                    <InputText id="phone2" name="phone" type="text" placeholder="Phone number" required />
                                </div>
                                <div className="field col" id="phone-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.phone &&
                                        state.errors.phone.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid text-gray-500">
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="state">Status</label>
                                    <Dropdown id="state" className="text-gray-700" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                                </div>
                            </div>
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="phone2">Best time to call</label>
                                    <InputText id="phone2" type="text" placeholder="Best time to call" />
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid text-gray-500">
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="name2">Review status</label>
                                    <InputText id="name2" type="text" />
                                </div>
                            </div>
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="phone2">State</label>
                                    <InputText id="phone2" type="text" />
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid ">
                            <div className='flex-col field col'>
                                <div className="field col">
                                    <label htmlFor="name2">* Skill</label>
                                    <InputText id="name2" name="skill" type="text" required />
                                </div>
                                <div className="field col" id="skill-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.skill &&
                                        state.errors.skill.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                            <div className='flex-col field col'>
                                <div className="field col text-gray-500">
                                    <label htmlFor="phone2">Years of experience</label>
                                    <InputText id="phone2" type="text" />
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid ">
                            <div className="field col-6">
                                <div className='flex-col field col'>
                                    <div className="field">
                                        <label htmlFor="number">* Rate salary</label>
                                        <InputText id="number" name="rate" type="text" required />
                                    </div>
                                    <div className="field col" id="rate-error" aria-live="polite" aria-atomic="true">
                                        {state.errors?.rate &&
                                            state.errors.rate.map((error: string) => (
                                                <p className="mt-2 text-sm text-red-500" key={error}>
                                                    {error}
                                                </p>
                                            ))}
                                    </div>
                                </div>
                                <div className='flex-col field col'>
                                    <div className="field">
                                        <label htmlFor="city">* City</label>
                                        <InputText id="city" name="city" type="text" required />
                                    </div>
                                    <div className="field col" id="rate-error" aria-live="polite" aria-atomic="true">
                                        {state.errors?.city &&
                                            state.errors.city.map((error: string) => (
                                                <p className="mt-2 text-sm text-red-500" key={error}>
                                                    {error}
                                                </p>
                                            ))}
                                    </div>
                                </div>
                                <div className='flex-col field col'>
                                    <div className="field text-gray-500">
                                        <label htmlFor="visa">Visa</label>
                                        <InputText id="visa" name="visa" type="text" required />
                                    </div>
                                    <div className="field col" id="rate-error" aria-live="polite" aria-atomic="true">
                                        {state.errors?.visa &&
                                            state.errors.visa.map((error: string) => (
                                                <p className="mt-2 text-sm text-red-500" key={error}>
                                                    {error}
                                                </p>
                                            ))}
                                    </div>
                                </div>
                                <div className='flex-col field col'>
                                    <div className="field">
                                        <label htmlFor="name2">* Referred by</label>
                                        <InputText id="name2" name="referred" type="text" required />
                                    </div>
                                    <div className="field col" id="rate-error" aria-live="polite" aria-atomic="true">
                                        {state.errors?.referred &&
                                            state.errors.referred.map((error: string) => (
                                                <p className="mt-2 text-sm text-red-500" key={error}>
                                                    {error}
                                                </p>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className='flex-col field col-6'>
                                <div className="field col">
                                    <div className="field-checkbox">
                                        <input type="checkbox" id="city1"></input>
                                        <label className="bg-transparent text-gray-500" htmlFor="city1">Hot</label>
                                    </div>
                                    <div className="field-checkbox">
                                        <input type="checkbox" id="city2"></input>
                                        <label className="bg-transparent text-gray-500" htmlFor="city2">Security clearance</label>
                                    </div>
                                    <div className="field-checkbox">
                                        <input type="checkbox" id="city3"></input>
                                        <label className="bg-transparent text-gray-500" htmlFor="city3">Federal Dod experience</label>
                                    </div>
                                    <div className="field-checkbox">
                                        <input type="checkbox" id="city4"></input>
                                        <label className="bg-transparent text-gray-500" htmlFor="city4">State experience</label>
                                    </div>
                                    <div className="field-checkbox">
                                        <input type="checkbox" id="city5"></input>
                                        <label className="bg-transparent text-gray-500" htmlFor="city5">Certified</label>
                                    </div>
                                    <div className="field-checkbox">
                                        <input type="checkbox" id="city6"></input>
                                        <label className="bg-transparent text-gray-500" htmlFor="city6">Relocate</label>
                                    </div>
                                    <div className="field text-gray-500">
                                        <label htmlFor="name2">Relocation</label>
                                        <InputText id="name2" type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="formgrid grid col-2">
                            <Button type="submit" label="Submit"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default FormLayoutDemo;