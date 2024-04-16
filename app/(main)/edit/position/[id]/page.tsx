"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useFormState } from "react-dom";
import { create_candidate } from "@/app/lib/actions";
import { gql, useQuery, useMutation } from "@apollo/client";

import EditForm from "./input";

const FormLayoutDemo = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  const GET_POS = gql`
    query jobById {
        jobById(id: "${id}") {
        id
        name 
        description
        deadline
        location
       }
    }
    `;
  const { loading, error, data: jobsData } = useQuery(GET_POS);
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <EditForm jobData={jobsData.jobById} id={id} jobItem={jobsData.jobById} />
    </>
  );
};

export default FormLayoutDemo;
