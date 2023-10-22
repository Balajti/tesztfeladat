"use client"

import { useForm, useController } from "react-hook-form"
//a fromhoz react hook form-ot használtam megy egyszerű, kis méretű és gyors
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Select from 'react-select';
import './index.css'
import { useState } from "react";
import fs from "fs";


const schema = yup
  .object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    jobTitle: yup.number().nullable().required("Job title is required"),
    age: yup.number().positive().integer().required("Age of employees is required"),
    cv: yup.mixed().required("Uploading your CV is required")
  }).required()


function EmployeeForm(props: { renderNumber: number, numberCount: number, companyName: string, renderNumberCount: () => void }){

    const languageList = [
        { value: 1, label: 'Accountant' },
        { value: 2, label: 'Software developer' },
        { value: 3, label: 'Software tester' },
        { value: 4, label: 'Manager' }
    
    ];

    const {
        register,
        setValue,
        handleSubmit,
        control,
        reset,
        formState: { errors },
      } = useForm({resolver: yupResolver(schema)})

      const { field } = useController({ name: 'jobTitle', control });
      const { value: langValue, onChange: langOnChange, ...restLangField } = field;
    
      const [fileCv, setFileCv] = useState({})
      
      
      const onSubmit = handleSubmit((data) => {
        setValue("name", data.name)
        setValue("email", data.email)
        setValue("age", data.age)
        setValue("cv", fileCv)
        console.log(data)
        console.log(fileCv)
        props.renderNumberCount()

        const jobTitle = data.jobTitle == 1 ? "Accountant" : data.jobTitle == 2 ? "Software developer" : data.jobTitle == 3 ? "Software tester" : data.jobTitle == 4 ? "Manager" : "none"

        const employeeData = {
          name: data.name,
          email: data.email,
          jobTitle: jobTitle,
          age: data.age,
          cv: fileCv
        }
        
        
        reset({
          name: "",
          email: "",
          jobTitle: 0,
          age: 0,
          cv: {},
        })        
      })


    const newFile = (e) => {
      const uploadedCV = e.target.files[0]
      setFileCv(uploadedCV)
    }
    return (
        <>
          <h1>{props.companyName}</h1>
          <div>
              <form onSubmit={onSubmit}>
                <label>Name<sup>*</sup></label>
                <input {...register("name", {required: "Company name is required"})} />
                <p>{errors.name?.message}</p>
        
                <label>Email<sup>*</sup></label>
                <input 
                {...register("email", { required: "Email Address is required" })}/>
                <p>{errors.email?.message}</p>
        
        
                <label>Age<sup>*</sup></label>
                <input type="number" {...register("age", { min: 1, max: 100 })} />
                <p>{errors.age?.message}</p>

                <label>Job title<sup>*</sup></label>
                <Select
                    className='select-input'
                    placeholder="Select job title"
                    isClearable
                    options={languageList}
                    value={langValue ? languageList.find(x => x.value === langValue) : langValue}
                    onChange={option => langOnChange(option ? option.value : option)}
                    {...restLangField}
                />
                <p>{errors.jobTitle?.message}</p>
        
                <label>Upload you CV<sup>*</sup></label>
                <input className="upload" type="file" {...register("cv")} onChange={newFile} accept=".pdf" />
                <p>{errors.cv?.message}</p>
        
                <button type="submit" onClick={onSubmit}>Submit</button>
              </form>
            </div>
            </>
    )
}

export default EmployeeForm