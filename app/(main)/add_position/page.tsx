"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useFormState } from "react-dom";
import { create_candidate } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { gql, useMutation, useQuery } from "@apollo/client";

interface DropdownItem {
  name: string;
  code: string;
}

const FormLayoutDemo = () => {
  const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
  const dropdownItems: DropdownItem[] = useMemo(
    () => [
      { name: "Accenture", code: "Accenture" },
      { name: "ADR", code: "ADR" },
      { name: "Advantexps", code: "Advantexps" },
      { name: "ALL state Corporation", code: "ALL state Corporation" },
      { name: "AP Professional", code: "AP Professional" },
      { name: "-Other-", code: "-Other-" },
    ],
    []
  );

  const CREATE_Job = gql`
    mutation CreateJob(
      $name: String!
      $location: String!
      $deadline: String!
      $description: String!
    ) {
      createJob(
        name: $name
        location: $location
        deadline: $deadline
        description: $description
      ) {
        id
        name
        location
        deadline
        description
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
 
  const [inputNumberValue, setInputNumberValue] = useState<number | null>(null);
  const [calendarValue, setCalendarValue] = useState<any>(null);
  const router = useRouter();
  const updateCache = (cache:any, {data}:any) => {
    // If this is for the public feed, do nothing
     console.log(cache)
     console.log(data)
    // Fetch the todos from the cache
    const existingTodos = cache.readQuery({
      query: gql`
      query {
      jobs(offset:0,limit:50) {
          id
          name
          deadline
          description
          location
        }
      }
      `
    });
    console.log(existingTodos)
    // // Add the new todo to the cache
    const newJob= data.createJob;
    console.log(newJob)
    cache.writeQuery({
      query: gql`
      query {
      jobs(offset:0,limit:50) {
          id
          name
          deadline
          description
          location
      }
      }
      `,
      data: {jobs: [newJob, ...existingTodos.jobs]}
    });
  };
  const [createJob] = useMutation(CREATE_Job,{update: updateCache});
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const input = Object.fromEntries(formData.entries());
      const { name, location, deadline, description } = input;
      const parts = String(deadline).split("/"); // Split the string by "/"
      const rearrangedDate = `${parts[2]}-${parseInt(parts[0])}-${parseInt(parts[1])}`;
      console.log(name,location,rearrangedDate,description)
      const date = new Date().toISOString().split("T")[0];
      const { data } = await createJob({
        variables: {
          name,
          deadline:rearrangedDate,
          location,
          description,
        },
      });
      router.push("/candidate_list");
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
                  <label htmlFor="account">Account *</label>
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
                  <label htmlFor="resume">Resume count</label>
                  <InputNumber
                    id="resume"
                    name="resumecount"
                    showButtons
                    mode="decimal"
                  ></InputNumber>
                </div>
              </div>
            </div>

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
                  <InputText id="job" name="job" type="text" required />
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
                    name="location"
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
                  <InputText id="name2" name="name" type="text" required />
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
                      name="deadline"
                      required
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
                    rows={5}
                    name="description"
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

export default FormLayoutDemo;
