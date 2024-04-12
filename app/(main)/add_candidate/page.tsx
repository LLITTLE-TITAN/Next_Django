'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

interface DropdownItem {
    name: string;
    code: string;
}

const FormLayoutDemo = () => {
    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
    const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
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

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card p-fluid font-medium text-base">

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name2">* First name</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="field col">
                            <label htmlFor="email2">* Email address</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name2">* Last Name</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="field col">
                            <label htmlFor="phone2">* Phone</label>
                            <InputText id="phone2" type="text" />
                        </div>
                    </div>

                    <div className="formgrid grid text-gray-500">
                        <div className="field col">
                            <label htmlFor="name2">Status</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="field col">
                            <label htmlFor="phone2">Best time to call</label>
                            <InputText id="phone2" type="text" />
                        </div>
                    </div>

                    <div className="formgrid grid text-gray-500">
                        <div className="field col">
                            <label htmlFor="name2">Review status</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="field col">
                            <label htmlFor="phone2">State</label>
                            <InputText id="phone2" type="text" />
                        </div>
                    </div>

                    <div className="formgrid grid ">
                        <div className="field col">
                            <label htmlFor="name2">* Skill</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="field col text-gray-500">
                            <label htmlFor="phone2">Years of experience</label>
                            <InputText id="phone2" type="text" />
                        </div>
                    </div>

                    <div className="formgrid grid ">
                        <div className="field col-6">
                            <div className="field">
                                <label htmlFor="name2">* Rate salary</label>
                                <InputText id="name2" type="text" />
                            </div>
                            <div className="field">
                                <label htmlFor="name2">* City</label>
                                <InputText id="name2" type="text" />
                            </div>
                            <div className="field text-gray-500">
                                <label htmlFor="name2">Visa</label>
                                <InputText id="name2" type="text" />
                            </div>
                            <div className="field">
                                <label htmlFor="name2">* Referred by</label>
                                <InputText id="name2" type="text" />
                            </div>
                        </div>
                        <div className="field col-6">
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
            </div>
        </div>
    );
};

export default FormLayoutDemo;
