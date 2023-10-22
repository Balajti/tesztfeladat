"use client"
"use strict"

import { useForm } from "react-hook-form"
//a fromhoz react hook form-ot használtam megy egyszerű, kis méretű és gyors
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import EmployeeForm from "./EmployeeForm"
import $ from "jquery";
import './index.css'
import { useState } from "react"

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    numberOfEmployees: yup.number().positive().integer().required("Number of employees is required"),
    description: yup.string(),
  })
  .required()

function App() {


  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const [renderNumber, setRenderNumber] = useState(0)
  const [companyName, setCompanyName] = useState("")
  const [isItRendered, setIsItRendered] = useState(false)
  const [numberCount, setnumberCount] = useState(0)


  const onSubmit = handleSubmit((data) => {
    console.log(data)

    setValue("name", data.name)
    setValue("email", data.email)
    setValue("numberOfEmployees", data.numberOfEmployees)
    setValue("description", data.description)
    setRenderNumber(data.numberOfEmployees)
    $(".CompanyForm").hide()
    setIsItRendered(true)
    setCompanyName(data.name)
    const companyData = {
      name: data.name,
      email: data.email,
      numberOfEmployees: data.numberOfEmployees,
      description: data.description
    }
    const jsonFile = {
      companyData: companyData,
      employees: [],
    }
    


    reset({
      name: "",
      email: "",
      numberOfEmployees: 0,
      description: "",
    })
  })

  const renderNumberCount = () => {
    setnumberCount(numberCount + 1)
  }
  if (numberCount == renderNumber) {
    $(".CompanyForm").show()
  }


  return (
    <>
      <div className="CompanyForm">
        <h1>Company Form</h1>
        <form onSubmit={onSubmit}>
          <label>Company name<sup>*</sup></label>
          <input {...register("name", { required: "Company name is required" })} />
          <p>{errors.name?.message}</p>

          <label>Email<sup>*</sup></label>
          <input
            {...register("email", { required: "Email Address is required" })} />
          <p>{errors.email?.message}</p>

          <label>Number of employees<sup>*</sup></label>
          <input type="number" {...register("numberOfEmployees", { min: 1, max: 100 })} />
          <p>{errors.numberOfEmployees?.message}</p>

          <label>Description</label>
          <input {...register("description")} />
          <p>{errors.description?.message}</p>

          <button type="submit" onClick={onSubmit}>Submit</button>

        </form>
      </div>
      {isItRendered && numberCount >= 0 && numberCount < renderNumber &&(
          <EmployeeForm
            renderNumber={renderNumber}
            numberCount={numberCount}
            companyName={companyName}
            renderNumberCount={renderNumberCount}
          />
        )}
    </>
  )
}

export default App
