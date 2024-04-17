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
import {AppContext} from '../providers/approvider';
import { gql, useMutation, useQuery } from "@apollo/client";

function Actiontemplate(job:Demo.Job) {
     
    const {offset,setOffset,limit,setLimit} = useContext(AppContext) 
     
    const router = useRouter();
    
     
    
    const DELETE_JOB = gql`
    mutation DeleteJob(
        $id:Int!
    ) {
      deleteJob(
        id: $id
        
      ) {
       success
      }
    }
  `;
  const updateCache = (cache:any, {data}:any) => {
    // If this is for the public feed, do nothing
     console.log(cache)
     console.log(data)
    // Fetch the todos from the cache
    const existingJobs = cache.readQuery({
      query: gql`
      query {
      jobs(offset:${offset},limit:${limit}) {
          id
          name
          deadline
          description
          location
        }
      }
      `
    }); 
    const newjobs = existingJobs.jobs.filter((t:any) => (t.id !== job.id));
    console.log(existingJobs)
    console.log(newjobs)
    // // Add the new 
    cache.writeQuery({
      query: gql`
      query {
      jobs(offset:${offset},limit:${limit}) {
          id
          name
          deadline
          description
          location
      }
      }
      `,
      data: {jobs:newjobs}
    });
  };
    const [DeleteJob] = useMutation(DELETE_JOB,{update: updateCache});
    const onDelete=async (id:any)=>{
       
        try{
            const { data } = await DeleteJob({
                variables: {
                  id:Number(id),
                },
            });
        }
        catch{

        }
      
    }
    const onEdit=(id:any)=>{
        router.push(`edit/position/${id}`)
    }
 
    return (
        <>
        
        <Button icon="pi pi-search-plus" onClick={()=>onEdit(job.id)}  className='mr-1'  severity="info" size="small"  />
        <Button icon="pi pi-file-edit" onClick={()=>onEdit(job.id)}    className='mr-1'  severity="info" size="small" />
        <Button icon="pi pi-times" onClick={()=>onDelete(job.id)}  className='mr-1' severity="danger"  size="small" />
        </>
    );
}

export default Actiontemplate;
