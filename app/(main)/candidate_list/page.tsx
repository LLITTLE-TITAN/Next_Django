'use client';
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import React, { useEffect, useRef, useState } from 'react';
import { CustomerService } from '@/demo/service/CustomerService';
import type { Demo } from '@/types';

import { useQuery, gql } from '@apollo/client';
import ReactHtmlParser from 'react-html-parser';
import { Paginator } from 'primereact/paginator';
function List() {
     
    const [filters, setFilters] = useState<DataTableFilterMeta>({}); 
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const router = useRouter();
    const dt = useRef(null);
    const [offset,setOffset]=useState(0);
    const [limit,setLimit]=useState(50);
    const GET_DATA = gql`
    query {
    candidates(offset:${offset},limit:${limit}) {
        id
        name
        email
        phone 
    }
    }
    `; 
    const GET_Candidate_COUNT=gql`
    query {
        pageInfoCandidates{
            totalCount
        }
    }
    `;
    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
        });
        setGlobalFilterValue('');
    };
    const { loading, error, data:candidatesData } = useQuery(GET_DATA);
    const {loading:countsloading, error:countserror, data:countsData}=useQuery(GET_Candidate_COUNT);
    if (loading||countsloading) return <p>Loading...</p>; 


    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        let _filters = { ...filters };
        (_filters['global'] as any).value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <span className="p-input-icon-left w-full sm:w-20rem flex-order-1 sm:flex-order-0">
                    <i className="pi pi-search"></i>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Global Search" className="w-full" />
                </span>
                <Button type="button" icon="pi pi-user-plus" label="Add New" outlined className="w-full sm:w-auto flex-order-0 sm:flex-order-1" onClick={() => router.push('/profile/create')} />
            </div>
        );
    };

    const nameBodyTemplate = (customer: Demo.Customer) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {customer.name}
            </>
        );
    };

    const countryBodyTemplate = (customer: Demo.Customer) => {
        return (
            <>
                <img alt={customer.country.name} src={`/demo/images/flag/flag_placeholder.png`} className={'w-2rem mr-2 flag flag-' + customer.country.code} />
                <span className="image-text">{customer.country.name}</span>
            </>
        );
    };

    const createdByBodyTemplate = (customer: Demo.Customer) => {
        return (
            <div className="inline-flex align-items-center">
                <img alt={customer.representative.name} src={`/demo/images/avatar/${customer.representative.image}`} className="w-2rem mr-2" />
                <span>{customer.representative.name}</span>
            </div>
        );
    };

    const dateBodyTemplate = (customer: Demo.Customer) => {
        return formatDate(customer.date);
    };

    const activityBodyTemplate = (customer: Demo.Customer) => {
        return <ProgressBar value={customer.activity} showValue={false} style={{ height: '.5rem' }} />;
    };

    const header = renderHeader();
    const onPageChange = (event:any) => {
        console.log(event)
        setOffset(event.first)
        setLimit(event.rows)
    };
    return (
        <div className="card">
            <DataTable
                ref={dt}
                value={candidatesData.candidates}
                header={header}
                filters={filters}
            >
                <Column field="" header="" sortable  headerClassName="white-space-nowrap" style={{ width: '25%' }}></Column>
                <Column field="name" header="Name" sortable body={nameBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '25%' }}></Column>
                 
            </DataTable>
            <Paginator
                first={offset}
                rows={limit}
                totalRecords={countsData.pageInfoCandidates.totalCount} // Set totalRecords
                rowsPerPageOptions={[10, 25, 50]}
                onPageChange={onPageChange}
                pageLinkSize={5}
            />
        </div>
    );
}

export default List;
