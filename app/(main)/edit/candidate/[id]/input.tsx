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
import { AppContext } from "@/app/providers/approvider";

interface DropdownItem {
  name: string;
  code: string;
}

const EditForm = ({ candidateData, id, skillItem, skillsData }: any) => {
  const { offset, limit } = useContext(AppContext);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...candidateData.candidateById,
      firstname: candidateData.candidateById.name.split(" ")[0],
      lastname: candidateData.candidateById.name.split(" ")[1],
      skillItem: skillItem,
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
  const [selectedskillItem, setSelectedskillItem] = useState<any>(skillItem);
  const EDIT_CANDIDATE = gql`
    mutation update_candidate($name: String!,$email: String!,$phone: String!,$rateSalary: String!,$skillId:Int!) {
        updateCandidate(id:${id},name: $name,email: $email,phone: $phone,rateSalary: $rateSalary,skillId:$skillId) {
          
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

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(create_candidate, initialState);

  const [update_candidate] = useMutation(EDIT_CANDIDATE);
  const onSubmit = handleSubmit(async (e: any) => {
    try {
      const {
        firstname = "",
        lastname,
        email,
        phone,
        skillId,
        rateSalary,
        city,
        visa,
        referred,
      } = e;
      const date = new Date().toISOString().split("T")[0];
      const name = firstname + " " + lastname;
      const skillid = parseInt(selectedskillItem.id);
      const { data } = await update_candidate({
        variables: { name, phone, email, rateSalary, skillId: skillid },
        update: (cache) => {
          console.log(cache);
          const existingTodos: any = cache.readQuery({
            query: gql`
          query {
          candidates(offset:${offset},limit:${limit})  {
              id
              name
              email
              phone 
          }
          }
          `,
          });
          console.log(existingTodos);
          const newTodos = existingTodos.candidates.map((t: any) => {
            if (t.id === id) {
              return { ...t, name, phone, email, rateSalary };
            } else {
              return t;
            }
          });
          cache.writeQuery({
            query: gql`
            query {
            candidates(offset:${offset},limit:${limit}) {
                id
                name
                email
                phone 
            }
            }
            `,
            data: { candidates: newTodos },
          });
        },
      });
      router.push("/candidate_list");

      // Handle success, reset form, show success message, etc.
    } catch (error) {
      console.error("Error creating candidate:", error);
      // Handle error, show error message, etc.
    }
  });
  console.log(register("name"));
  useEffect(() => {
    reset({
      ...candidateData.candidateById,

      skillItem: skillItem,
    }); // asynchronously reset your form values
  }, [reset, candidateData, skillItem]);
  return (
    <form onSubmit={onSubmit}>
      <div className="grid">
        <div className="col-12">
          <div className="card p-fluid font-medium text-base">
            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">* First name</label>
                  <InputText
                    id="name2"
                    {...register("firstname")}
                    type="text"
                    placeholder="Legal first name"
                    required
                  />
                </div>
                <div
                  className="field col"
                  id="first_name-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.first_name &&
                    state.errors.first_name.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="email2">* Email address</label>
                  <InputText
                    id="email2"
                    type="text"
                    placeholder="Email address"
                    required
                    {...register("email")}
                  />
                </div>
                <div
                  className="field col"
                  id="email-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.email &&
                    state.errors.email.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="formgrid grid">
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="name2">* Last Name</label>
                  <InputText
                    id="name2"
                    type="text"
                    {...register("lastname")}
                    placeholder="Legal last name"
                  />
                </div>
              </div>
              <div className="flex-col field col">
                <div className="field col">
                  <label htmlFor="phone2">* Phone</label>
                  <InputText
                    id="phone2"
                    {...register("phone")}
                    type="text"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div
                  className="field col"
                  id="phone-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.phone &&
                    state.errors.phone.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
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
                    options={skillsData}
                    value={selectedskillItem}
                    onChange={(e) => setSelectedskillItem(e.value)}
                    optionLabel="name"
                    placeholder="Select One"
                  ></Dropdown>
                </div>
                <div
                  className="field col"
                  id="skill-error"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {state.errors?.skill &&
                    state.errors.skill.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
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
                    <InputText
                      id="number"
                      type="text"
                      required
                      {...register("rateSalary")}
                    />
                  </div>
                  <div
                    className="field col"
                    id="rate-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.rate &&
                      state.errors.rate.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="flex-col field col">
                  <div className="field">
                    <label htmlFor="city">* City</label>
                    <InputText id="city" name="city" type="text" />
                  </div>
                  <div
                    className="field col"
                    id="rate-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.city &&
                      state.errors.city.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="flex-col field col">
                  <div className="field text-gray-500">
                    <label htmlFor="visa">Visa</label>
                    <InputText id="visa" name="visa" type="text" />
                  </div>
                  <div
                    className="field col"
                    id="rate-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.visa &&
                      state.errors.visa.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="flex-col field col">
                  <div className="field">
                    <label htmlFor="name2">* Referred by</label>
                    <InputText id="name2" name="referred" type="text" />
                  </div>
                  <div
                    className="field col"
                    id="rate-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.referred &&
                      state.errors.referred.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
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

export default EditForm;
