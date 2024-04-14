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
import { useRouter } from "next/navigation";

import EditForm from "./input";
interface DropdownItem {
  name: string;
  code: string;
}

const FormLayoutDemo = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;

  const GET_CANDIDATE = gql`
    query candidateById {
        candidateById(id: "${id}") {
        id
        name
        phone
        email
        rateSalary
        }
    }
    `;

  const initialState = { message: null, errors: {} };

  const { loading, error, data: candidateData } = useQuery(GET_CANDIDATE);
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <EditForm candidateData={candidateData} id={id} />
    </>
  );
};

export default FormLayoutDemo;
