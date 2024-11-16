'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control} from "react-hook-form"
import { FormfieldType } from "./forms/PatientForm"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"

interface CustomProps {
  control: Control<any>,
  fieldType: FormfieldType,
  name: string,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton} = props;

  switch (fieldType) {
    case FormfieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className="ml-2"                
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              value={field.value || ""}  
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

      case FormfieldType.PHONE_INPUT:
        return(
          <FormControl>
            <PhoneInput
             defaultCountry="IN"
             placeholder = {placeholder}
             international
             withCountryCallingCode
             value={field.value}
             onChange={field.onChange}
             className="input-phone"
            />
          </FormControl>
        )
      case FormfieldType.DATE_PICKER:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calender"
            className="ml-2"          
            />
            <FormControl>
             <DatePicker selected={field.value} 
             onChange={(date) => field.onChange(date)} 
             dateFormat = {dateFormat ?? 'MM/dd/yyyy'}
             showTimeSelect = {showTimeSelect ?? false}
             timeInputLabel="Time:"
             wrapperClassName="date-picker"
             />
            
            </FormControl>

          </div>
        )
      case FormfieldType.SELECT:
          return (
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="shad-select-trigger">
                    <SelectValue placeholder={props.placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="shad-select-content">
                  {props.children}
                </SelectContent>
              </Select>
            </FormControl>
          );
      case FormfieldType.TEXTAREA:
            return (
              <FormControl>
                <Textarea
                  placeholder={props.placeholder}
                  {...field}
                  className="shad-textArea"
                  disabled={props.disabled}
                />
              </FormControl>
            );
      case FormfieldType.SKELETON:
        return (
          renderSkeleton ? renderSkeleton
          (field) : null
        )
      case FormfieldType.CHECKBOX:
        return (
          <FormControl>
            <div className="flex items-center gap-4">
              <Checkbox
                id={props.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor={props.name} className="checkbox-label">
                {props.label}
              </label>
            </div>
          </FormControl>
        );

    default:
      return null;
  }
}

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormfieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
}

export default CustomFormField;
