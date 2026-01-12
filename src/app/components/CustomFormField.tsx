"use client"

import { Control } from "react-hook-form"
import Image from "next/image"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/Form"
import { Input } from "../components/ui/Input"
import { FormFeildType } from "../Login/page"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import React, { useState } from "react"
import Calendar24 from "../components/ui/DatePicker";
import { Textarea } from "../components/ui/textarea"
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectTrigger, SelectValue } from "./ui/select"
import { SelectContent } from "./ui/select"
import { Check } from "lucide-react"
import { Checkbox } from "./ui/Checkbox"
import { Label } from "@radix-ui/react-label"
import { Calendar22 } from "./ui/Calendar22"

interface CustomProps {
    control: Control<any>,
    fieldtype: FormFeildType,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode,

}

const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {
    const { control, fieldtype, name, label, placeholder, dateFormat, showTimeSelect, iconSrc, iconAlt } = props;
    const [startDate, setStartDate] = useState(new Date());
    switch (props.fieldtype) {
        case FormFeildType.INPUT:
            return (
                <div className="flex-1 rounded-md border border-purple3/50 bg-white  flex items-center gap-2">
                    {props.iconSrc && (
                        <Image
                            src={props.iconSrc}
                            alt={props.iconAlt || "icon"}
                            width={20}
                            height={20}
                            className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                            disabled={props.disabled}
                            placeholder={placeholder}
                            {...field}
                            className="border-0 bg-white placeholder:text-purple4 border-dark-500 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 !important"
                        />
                    </FormControl>
                </div>
            );
        case FormFeildType.PHONE_INPUT: {
            const [value, setValue] = useState()
            return (
                <FormControl>
                    <PhoneInput
                        disabled={props.disabled}
                        defaultCountry="IN"
                        placeholder={placeholder}
                        className=" PhoneInputInput mt-0 h-8 rounded-md outline-0 px-3 text-sm border bg-white placeholder:text-purple4 border-dark-500 !important"
                        value={field.value}
                        international
                        withCountryCallingCode

                        onChange={field.onChange} />

                </FormControl>
            )
        }
        case FormFeildType.DATE_PICKER: {
            return (
                <div className="flex-1 rounded-md border  border-purple3/50 bg-white  flex items-center gap-2">
                    <Image
                        src={"/assets/calendar.svg"}
                        alt={"calendar"}
                        width={20}
                        height={20}
                        className="ml-2 p-1"
                    />
                    <FormControl>

                        <Calendar22 value={field.value} onChange={field.onChange} />
                            
                    </FormControl>

                </div>)

        }
        case FormFeildType.DATE_TIME_PICKER: {
            return (
                <div className="flex-1 rounded-md border  border-purple3/50 bg-white  flex items-center gap-2">
                    
                    <FormControl>

                        <Calendar24 value={field.value} onChange={field.onChange} />
                            
                    </FormControl>

                </div>)

        }
        case FormFeildType.SKELETON: {
            return props.renderSkeleton ? props.renderSkeleton(field) : null;
        }
        case FormFeildType.TEXTAREA: {
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="border w-full min-w-[200px] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white placeholder:text-purple4 text-purple3 border-black/40 h-20  "
                        disabled={props.disabled}
                    />
                </FormControl>
            )
        }
        case FormFeildType.CHECKBOX: {
                return (
            <FormControl>
                <div className="gap-4 flex items-center">
                    <Checkbox
                    id={props.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                    <Label  htmlFor={props.name} className="text-purple3 text-[14px] leading-[18px] font-normal cursor-pointer">
                        {props.label}
                    </Label>
                </div>
            </FormControl>)
        }
        case FormFeildType.SELECT: {


            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="bg-white  placeholder:text-purple3 text-purple3 border-purple3 h-11 focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder={props.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-purple3 border-dark-500">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );
        }
        default:
            break;
    }


}

const CustomFormField = (props: CustomProps) => {
    const { control, fieldtype, name, label, placeholder, iconSrc, iconAlt, disabled } = props;
    return (
        <div>
            <FormField
            
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem  className="flex-1 my-0 py-0">
                        
                        {fieldtype !== FormFeildType.CHECKBOX && label && (
                            <FormLabel>{label}</FormLabel>


                        )}

                        <RenderField  field={field} props={props} />
                        <FormMessage className="shad-error" />



                    </FormItem>
                )}
            />
        </div>
    )
}

export default CustomFormField
