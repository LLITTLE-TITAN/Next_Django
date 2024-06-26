'use client';
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import React, { useEffect, useRef, useState,useContext } from 'react';
import { CustomerService } from '@/demo/service/CustomerService';
import type { Demo } from '@/types'; 
import { Button } from 'primereact/button';
import ReactHtmlParser from 'react-html-parser';
import { Paginator } from 'primereact/paginator';
import { Badge } from 'primereact/badge';
import './index.css'
import {AppContext} from '../providers/approvider';
import { gql, useMutation, useQuery } from "@apollo/client";
import Actiontemplate from './action'
function List() {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const {offset,setOffset,limit,setLimit} = useContext(AppContext) 
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const router = useRouter();
    const dt = useRef(null);
    
    const GET_DATA = gql`
    query {
    jobs(offset:${offset},limit:${limit}) {
        id
        name
        location
        resumecount
        description
        deadline
    }
    }
    `; 
    const GET_JOB_COUNT=gql`
    query {
        pageInfoJobs{
            totalCount
        }
    }
    `;
    const DELETE_JOB = gql`
    mutation DeleteJob(
        $id:String!
    ) {
      createJob(
        id: $id
        
      ) {
       success
      }
    }
  `;
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

    const { loading, error, data:jobsData } = useQuery(GET_DATA);
    const {loading:countsloading, error:countserror, data:countsData}=useQuery(GET_JOB_COUNT);
    
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

    const nameBodyTemplate = (job: Demo.Job) => {
        return (
            <>
                <span className="  title-custom"> 
                {job.name}</span>
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
        const dateToCheck = new Date(job.deadline);
        const today = new Date();
         var classdate=''
        if (dateToCheck <= today) {
          classdate="red-bac"
        } else {
             classdate="white-bac"
        }
        return (
             
                <div className={classdate}>  
                <span>  {job.deadline}</span></div>
            
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
                <Badge value="0" severity="warning"></Badge>
                <Badge value="0" severity="danger"></Badge> 
                <Badge value={Number(job.resumecount)} severity="info"></Badge>
                <Badge value="0" severity="success"></Badge>
                
            </>
        );
    };
    const onSelectRow=(id:any)=>{
        router.push(`edit/position/${id}`)
    }
    
 

    const actionBodyTemplate =(job:Demo.Job)=>{
        return <> 

            <Button icon="pi pi-search-plus" className='mr-1'  severity="info" size="small"  />
            <Button icon="pi pi-file-edit"    className='mr-1'  severity="info" size="small" />
            <Button icon="pi pi-times"    className='mr-1' severity="danger"  size="small" />

        </>;
    }
    const activityBodyTemplate = (customer: Demo.Customer) => {
        return <ProgressBar value={customer.activity} showValue={false} style={{ height: '.5rem' }} />;
    };

    const header = renderHeader();
     
    const onPageChange = (event:any) => {
        console.log(event)
        setOffset(event.first)
        setLimit(event.rows)
    };
    const onRowClick = (event:any) => {
        // Here, you can access the selected row data
        router.push(`/edit/position/${event.data.id}`); 
      }; 
    return (
        <div className="card">
            <DataTable
                ref={dt}
                value={jobsData.jobs}
                header={header}
                resizableColumns 
                filters={filters}
                onRowClick={onRowClick}
                scrollable={true}
            
                className="table-custom"
            >
                <Column field="action" header="Action" sortable body={Actiontemplate} headerClassName="white-space-normal" style={{ width: '10%' }}></Column>
                <Column field="name" header="Job ID-Title" sortable body={nameBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '15%' }}></Column>
                <Column field="location" header="Location" sortable body={countryBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '20%' }}></Column>
                <Column field="deadline" header="Exp.Date" sortable body={dateBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '15%' }} ></Column>
                <Column field="description" header="Notes" body={descriptionBodyTemplate} headerClassName="white-space-normal"  style={{ width: '30%' }} ></Column>
                <Column field="resumecount" header="Resumes count"  body={resumecountBodyTemplate} headerClassName="white-space-nowrap" style={{ width: '10%' }} ></Column> 
            </DataTable>
            <Paginator
                first={offset}
                rows={limit}
                totalRecords={countsData.pageInfoJobs.totalCount} // Set totalRecords
                rowsPerPageOptions={[10, 25, 50]}
                onPageChange={onPageChange}
                pageLinkSize={5}
            />
        </div>
    );
}

export default List;
