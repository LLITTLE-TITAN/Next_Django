"use client";

import React, { useState, useEffect, useMemo, useContext } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useFormState } from "react-dom";
import { create_candidate } from "@/app/lib/actions";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { AppContext } from "@/app/providers/approvider";
interface DropdownItem {
  name: string;
  code: string;
}

const EditForm = ({ jobData, id, jobItem }: any) => {
  const { offset, limit } = useContext(AppContext);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...jobData,
    },
  });
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
  const EDIT_JOB = gql`
    mutation update_job($name: String!,$description: String!,$deadline: String!,$location: String!,) {
        updateJob(id:${id},name: $name,description: $description,deadline: $deadline,location: $location ) {
          
            __typename
     
        }
    }
    `;
  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    let selectedValue = [...checkboxValue];
    if (e.checked) selectedValue.push(e.value);
    else selectedValue.splice(selectedValue.indexOf(e.value), 1);

    setCheckboxValue(selectedValue);
  };

  useEffect(() => {
    setDropdownItem(dropdownItems[0]);
  }, [dropdownItems]);

  const [update_job] = useMutation(EDIT_JOB);
  const onSubmit = handleSubmit(async (e: any) => {
    try {
      const { name, deadline, description, location } = e;
      const date = new Date().toISOString().split("T")[0];
      const { data } = await update_job({
        variables: { name, description, deadline, location },
        update: (cache: any) => {
          const existingTodos: any = cache.readQuery({
            query: gql`
          query {
          jobs(offset:${offset},limit:${limit})  {
              id
              name
              description
              location
              deadline
          }
          }
          `,
          });
          const newTodos = existingTodos.jobs.map((t: any) => {
            if (t.id === id) {
              return { ...t, name, location, deadline, description };
            } else {
              return t;
            }
          });
          cache.writeQuery({
            query: gql`
              query {
                jobs(offset:${offset},limit:${limit}) {
                  id
                  name
                  email
                  phone
                }
              }
            `,
            data: { jobs: newTodos },
          });
        },
      });
      router.push("/");

      // Handle success, reset form, show success message, etc.
    } catch (error) {
      console.error("Error creating candidate:", error);
      // Handle error, show error message, etc.
    }
  });
  useEffect(() => {
    reset({
      ...jobData,
    }); // asynchronously reset your form values
  }, [reset, jobData]);

  return (
    <form onSubmit={onSubmit}>
      <div className="grid">
        <div className="col-12">
          <div className="card p-fluid font-medium text-base">
            

            <div className="formgrid grid text-gray-500">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">Assigned to</label>
                  <Dropdown
                    id="account"
                    className="text-gray-700"
                    value={dropdownItem}
                    onChange={(e) => setDropdownItem(e.value)}
                    options={dropdownItems}
                    optionLabel="account"
                    placeholder="Select One"
                  ></Dropdown>
                </div>
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="resume">Submitted resumes</label>
                  <InputText id="resume" name="resume" type="text" />
                </div>
              </div>
            </div>

            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="job">Job ID *</label>
                  <InputText id="job" name="job" type="text"   />
                </div>
              </div>
              <div className="flex-col field col text-gray-500">
                <div className="field col">
                  <label htmlFor="resume">Queued resumes</label>
                  <InputText id="resume" type="text" />
                </div>
              </div>
            </div>

            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="location">Location *</label>
                  <InputText
                    id="location"
                    {...register("location")}
                    type="text"
                    placeholder="Enter a location"
                    required
                  />
                </div>
              </div>
              <div className="flex-col field col text-gray-500">
                <div className="field col">
                  <label htmlFor="resume">Potential resumes</label>
                  <InputText id="resume" type="text" />
                </div>
              </div>
            </div>

            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">State *</label>
                  <Dropdown
                    id="account"
                    className="text-gray-700"
                    value={dropdownItem}
                    onChange={(e) => setDropdownItem(e.value)}
                    options={dropdownItems}
                    optionLabel="account"
                    placeholder="Select One"
                  ></Dropdown>
                </div>
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="length">Length *</label>
                  <InputText
                    id="length"
                    name="length"
                    type="text"
                    placeholder="Long term"
                     
                  />
                </div>
                
              </div>
            </div>

            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">Title *</label>
                  <InputText id="name2" {...register("name")} type="text" required />
                </div>
                 
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="length">Restriction *</label>
                  <InputText
                    id="length"
                    name="restriction"
                    type="text"
                    placeholder="W2 or C2C"
                     
                  />
                </div>
               
              </div>
            </div>

            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="location">* Skill</label>
                  <Dropdown
                    id="account"
                    className="text-gray-700"
                    value={dropdownItem}
                    onChange={(e) => setDropdownItem(e.value)}
                    options={dropdownItems}
                    optionLabel="account"
                    placeholder="Select One"
                  ></Dropdown>
                </div>
                
              </div>
              <div className="flex-col field col text-gray-500">
                <div className="field col">
                  <label htmlFor="resume">W2 rate</label>
                  <InputText id="resume" type="text" />
                </div>
              </div>
            </div>

            <div className="formgrid grid text-gray-500">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="state">Department</label>
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
                  <label htmlFor="phone2">C2C 1099</label>
                  <InputText
                    id="phone2"
                    type="text"
                    placeholder="Best time to call"
                  />
                </div>
              </div>
            </div>

            <div className="formgrid grid ">
              <div className="field col-6">
                <div className="flex-col field col">
                  <div className="field">
                    <label htmlFor="number">Exp. date *</label>
                    <Calendar
                      showIcon
                      showButtonBar
                      {...register("deadline")}
                       
                    />
                  </div>
                  
                </div>

                <div className="flex-col field col">
                  <div className="field text-gray-500">
                    <label htmlFor="visa">priority</label>
                    <Dropdown
                      id="account"
                      className="text-gray-700"
                      value={dropdownItem}
                      onChange={(e) => setDropdownItem(e.value)}
                      options={dropdownItems}
                      optionLabel="account"
                      placeholder="Select One"
                    ></Dropdown>
                  </div>
                  <div className="field col"></div>
                </div>

                <div className="flex-col field col">
                  <div className="field text-gray-500">
                    <label htmlFor="name2">Resume template link</label>
                    <InputText
                      id="name2"
                      type="text"
                      placeholder="example:http://www.validurl.com"
                    />
                  </div>
                  <div className="field col"></div>
                </div>
                <div className="flex row">
                  <div className="field col-6">
                    <div className="field-checkbox">
                      <input type="checkbox" id="city1"></input>
                      <label
                        className="bg-transparent text-gray-500"
                        htmlFor="city1"
                      >
                        no opt
                      </label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="city2"></input>
                      <label
                        className="bg-transparent text-gray-500"
                        htmlFor="city2"
                      >
                        W2 only
                      </label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="city3"></input>
                      <label
                        className="bg-transparent text-gray-500"
                        htmlFor="city3"
                      >
                        H1 transfer allowed
                      </label>
                    </div>
                  </div>

                  <div className="field col-6">
                    <div className="field-checkbox">
                      <input type="checkbox" id="city4"></input>
                      <label
                        className="bg-transparent text-gray-500"
                        htmlFor="city4"
                      >
                        Remote/Telecommute
                      </label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="city5"></input>
                      <label
                        className="bg-transparent text-gray-500"
                        htmlFor="city5"
                      >
                        Active
                      </label>
                    </div>
                    <div className="field-checkbox">
                      <input type="checkbox" id="city6"></input>
                      <label
                        className="bg-transparent text-gray-500 text-sm"
                        htmlFor="city6"
                      >
                        Send ConstantContact emails
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-col field col-6">
                <div className="flex-col field col text-gray-500">
                  <div className="field">
                    <label htmlFor="name2">Notes</label>
                    <InputTextarea
                      placeholder="Your Message"
                      rows={5}
                      cols={30}
                    />
                  </div>
                </div>
                <div className="flex-col field col">
                  <div className="field text-gray-500">
                    <label htmlFor="name2">Keywords</label>
                    <InputText id="name2" type="text" />
                  </div>
                  <div className="field col"></div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="flex-col field col">
                <div className="field">
                  <label htmlFor="name2">* Description</label>
                  <InputTextarea
                    placeholder="Your Message"
                    {...register("description")}
                    rows={5}
                    cols={30}
                  />
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

export default EditForm;
