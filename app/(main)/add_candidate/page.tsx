"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useFormState } from "react-dom";
import { create_candidate } from "@/app/lib/actions";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

interface DropdownItem {
  name: string;
  code: string;
}

const FormLayoutDemo = () => {
  const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
  const dropdownItems: DropdownItem[] = useMemo(
    () => [
      { name: "Green", code: "Green" },
      { name: "Red", code: "Red" },
      { name: "Unassigned", code: "Unassigned" },
      { name: "Yellow", code: "Yellow" },
      { name: "-Other-", code: "-Other-" },
    ],
    []
  );
  const CREATE_CANDIDATE = gql`
    mutation CreateCandidate(
      $name: String!
      $email: String!
      $phone: String!
      $rate: String!
      $skillId:Int!
    ) {
      createCandidate(
        name: $name
        email: $email
        phone: $phone
        rateSalary: $rate
        skillId: $skillId
      ) {
        id
        name
        email
        rateSalary
        phone
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
  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    let selectedValue = [...checkboxValue];
    if (e.checked) selectedValue.push(e.value);
    else selectedValue.splice(selectedValue.indexOf(e.value), 1);

    setCheckboxValue(selectedValue);
  };
  const router = useRouter();
  useEffect(() => {
    setDropdownItem(dropdownItems[0]);
  }, [dropdownItems]);
  const [skillItem,setSkillItem]=useState<any>();
  const initialState = { message: null, errors: {} }; 


  const updateCache = (cache:any, {data}:any) => {
    // If this is for the public feed, do nothing
     console.log(cache)
     console.log(data)
    // Fetch the todos from the cache
    const existingTodos = cache.readQuery({
      query: gql`
      query {
      candidates(offset:0,limit:50) {
          id
          name
          email
          phone 
      }
      }
      `
    });
    console.log(existingTodos)
    // // Add the new todo to the cache
    const newTodo = data.createCandidate;
    console.log(newTodo)
    cache.writeQuery({
      query: gql`
      query {
      candidates(offset:0,limit:50) {
          id
          name
          email
          phone 
      }
      }
      `,
      data: {candidates: [newTodo, ...existingTodos.candidates]}
    });
  };

  const [createCandidate] = useMutation(CREATE_CANDIDATE,{update: updateCache});

  const { loading, error, data: skillsData } = useQuery(GET_SkillDATA);

  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const input = Object.fromEntries(formData.entries());
      console.log(input);
      const {
        first_name,
        last_name,
        email,
        phone,
        skill,
        rate,
        city,
        visa,
        referred,
      } = input;
      const date = new Date().toISOString().split("T")[0];
      const name = first_name+" "+last_name; 
      const { data } = await createCandidate({
        variables: { name, phone, email, rate,skillId: Number( skillItem.id) },
      });
      router.push("/candidate_list");
      console.log("Candidate created:", data.createCandidate);

      // Handle success, reset form, show success message, etc.
    } catch (error) {
      console.error("Error creating candidate:", error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid">
        <div className="col-12">
          <div className="card p-fluid font-medium text-base">
            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">* First name</label>
                  <InputText
                    id="name2"
                    name="first_name"
                    type="text"
                    placeholder="Legal first name"
                    required
                  />
                </div>
                 
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="email2">* Email address</label>
                  <InputText
                    id="email2"
                    name="email"
                    type="text"
                    placeholder="Email address"
                    required
                  />
                </div>
                 
              </div>
            </div>

            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">* Last Name</label>
                  <InputText
                    id="name2"
                    name="last_name"
                    type="text"
                    placeholder="Legal last name"
                  />
                </div>
                 
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="phone2">* Phone</label>
                  <InputText
                    id="phone2"
                    name="phone"
                    type="text"
                    placeholder="Phone number"
                    required
                  />
                </div>
                
              </div>
            </div>

            <div className="formgrid grid text-gray-500">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="state">Status</label>
                  <Dropdown
                    id="state"
                    className="text-gray-700"
                    value={dropdownItem}
                    onChange={(e) => setDropdownItem(e.value)}
                    options={dropdownItems}
                    optionLabel="name"
                    placeholder="Select One"
                  ></Dropdown>
                </div>
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="phone2">Best time to call</label>
                  <InputText
                    id="phone2"
                    type="text"
                    placeholder="Best time to call"
                  />
                </div>
              </div>
            </div>

            <div className="formgrid grid text-gray-500">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">Review status</label>
                  <InputText id="name2" type="text" />
                </div>
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="phone2">State</label>
                  <InputText id="phone2" type="text" />
                </div>
              </div>
            </div>

            <div className="formgrid grid ">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="skill">* Skill</label>
                  <Dropdown
                    id="skill"
                    className="text-gray-700"  
                    options={skillsData.skills}
                    value={skillItem}
                    onChange={(e) => setSkillItem(e.value)}
                    optionLabel="name"
                    placeholder="Select One"
                  ></Dropdown>
                </div>
                
              </div>
              <div className="flex-col field col">
                <div className="field col text-gray-500">
                  <label htmlFor="phone2">Years of experience</label>
                  <InputText id="phone2" type="text" />
                </div>
              </div>
            </div>

            <div className="formgrid grid ">
              <div className="field col-6">
                <div className="flex-col field col">
                  <div className="field">
                    <label htmlFor="number">* Rate salary</label>
                    <InputText id="number" name="rate" type="text" required />
                  </div>
                  
                </div>
                <div className="flex-col field col">
                  <div className="field">
                    <label htmlFor="city">* City</label>
                    <InputText id="city" name="city" type="text"   />
                  </div>
                  
                </div>
                <div className="flex-col field col">
                  <div className="field text-gray-500">
                    <label htmlFor="visa">Visa</label>
                    <InputText id="visa" name="visa" type="text"   />
                  </div>
                  
                </div>
                <div className="flex-col field col">
                  <div className="field">
                    <label htmlFor="name2">* Referred by</label>
                    <InputText
                      id="name2"
                      name="referred"
                      type="text"
                       
                    />
                  </div>
                  
                </div>
              </div>
              <div className="flex-col field col-6">
                <div className="field col">
                  <div className="field-checkbox">
                    <input type="checkbox" id="city1"></input>
                    <label
                      className="bg-transparent text-gray-500"
                      htmlFor="city1"
                    >
                      Hot
                    </label>
                  </div>
                  <div className="field-checkbox">
                    <input type="checkbox" id="city2"></input>
                    <label
                      className="bg-transparent text-gray-500"
                      htmlFor="city2"
                    >
                      Security clearance
                    </label>
                  </div>
                  <div className="field-checkbox">
                    <input type="checkbox" id="city3"></input>
                    <label
                      className="bg-transparent text-gray-500"
                      htmlFor="city3"
                    >
                      Federal Dod experience
                    </label>
                  </div>
                  <div className="field-checkbox">
                    <input type="checkbox" id="city4"></input>
                    <label
                      className="bg-transparent text-gray-500"
                      htmlFor="city4"
                    >
                      State experience
                    </label>
                  </div>
                  <div className="field-checkbox">
                    <input type="checkbox" id="city5"></input>
                    <label
                      className="bg-transparent text-gray-500"
                      htmlFor="city5"
                    >
                      Certified
                    </label>
                  </div>
                  <div className="field-checkbox">
                    <input type="checkbox" id="city6"></input>
                    <label
                      className="bg-transparent text-gray-500"
                      htmlFor="city6"
                    >
                      Relocate
                    </label>
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
