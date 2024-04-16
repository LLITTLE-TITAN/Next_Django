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

  const GET_POS = gql`
    query candidateById {
        candidateById(id: "${id}") {
        id
        name
        phone
        email
        rateSalary
        skill{
          id
          name
        }
        }
    }
    `;
  const GET_SkillDATA = gql`
    query {
      skills(offset: 0, limit: 50) {
        id
        name
      }
    }
  `;
  const initialState = { message: null, errors: {} };

  const { loading, error, data: candidateData } = useQuery(GET_CANDIDATE);
  const { loading: skillLoading, data: skillData } = useQuery(GET_SkillDATA);
  if (loading || skillLoading) return <p>Loading...</p>;

  return (
    <>
      <EditForm
        candidateData={candidateData}
        id={id}
        skillItem={candidateData.candidateById.skill}
        skillsData={skillData.skills}
      />
    </>
  );
};

export default FormLayoutDemo;
