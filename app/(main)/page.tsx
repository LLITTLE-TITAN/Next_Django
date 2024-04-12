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
const GET_DATA = gql`
  query {
    jobs {
      id
      name
      location
      resumecount
      description
      deadline
    }
}
`; 

function List() {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const router = useRouter();
    const dt = useRef(null);
 

    const formatDate = (value: Date) => {
        console.log(value)
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
    const { loading, error, data } = useQuery(GET_DATA);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    // useEffect(() => {
    //     if(data)
    //     //CustomerService.getCustomersLarge().then((data) => {
    //     setCustomers(data.data.jobs);
            
    //     //});
    //     initFilters();
    // }, []);

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

    const nameBodyTemplate = (job: Demo.Job) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {job.name}
            </>
        );
    };
    const countryBodyTemplate = (job: Demo.Job) => {
        return (
            <>
                <span className="p-column-title">Location</span>
                {job.location}
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
    
    const dateBodyTemplate = (job: Demo.Job) => {
        return (
            <>
                <span className="p-column-title">Deadline</span>
                {job.deadline}
            </>
        );
    };
    const descriptionBodyTemplate = (job: Demo.Job) => {
        return (
            <>
                 
                {ReactHtmlParser(job.description)}
            </>
        );
    };
    const resumecountBodyTemplate = (job: Demo.Job) => {
        return (
            <>
                 
                {job.resumecount}
            </>
        );
    };

    const activityBodyTemplate = (customer: Demo.Customer) => {
        return <ProgressBar value={customer.activity} showValue={false} style={{ height: '.5rem' }} />;
    };

    const header = renderHeader();
    console.log(data.jobs)
    return (
        <div className="card">
            <DataTable
                ref={dt}
                value={data.jobs}
                header={header}
                paginator
                rows={10}
                responsiveLayout="scroll"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                rowsPerPageOptions={[10, 25, 50]}
                filters={filters}
                loading={loading}
            >
                 
                <Column field="name" header="Job ID-Title" sortable body={nameBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '25%' }}></Column>
                <Column field="location" header="Location" sortable body={countryBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '25%' }}></Column>
                <Column field="deadline" header="Exp.Date" sortable body={dateBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '25%' }}></Column>
                
                <Column field="description" header="Notes" body={descriptionBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '25%' }} ></Column>
                <Column field="resumecount" header="Resumes count"  body={resumecountBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '25%' }} ></Column> 
            </DataTable>
        </div>
    );
}

export default List;
