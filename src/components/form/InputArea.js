// import React from "react";
// import Label from "@components/form/Label";

// const InputArea = ({
//   name,
//   label,
//   type,
//   Icon,
//   register,
//   readOnly,
//   defaultValue,
//   autocomplete,
//   placeholder,
//   required = true,
//   value,
//   rows,
//   onChange,
// }) => {
//   return (
//     <>
//       <Label label={label} />
//       <div className="relative">
//         {Icon && (
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <span className="text-gray-800 focus-within:text-gray-900 sm:text-base">
//               <Icon />{" "}
//             </span>
//           </div>
//         )}
//         {type === "textarea" ? (
//           <textarea
//             {...register(`${name}`, {
//               required: required ? `${label} is required!` : false,
//             })}
//             name={name}
//             readOnly={readOnly}
//             defaultValue={defaultValue}
//             placeholder={placeholder}
//             autoComplete={autocomplete}
//             value={value}
//             rows={rows}
//             onChange={onChange}
//             className={`${Icon ? "py-2 pl-10" : "py-2 px-4 md:px-5"
//               } w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12 ${readOnly ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
//               }`}
//           />
//         ) : (
//           <input
//             {...register(`${name}`, {
//               required: required ? `${label} is required!` : false,
//             })}
//             type={type}
//             name={name}
//             readOnly={readOnly}
//             defaultValue={defaultValue}
//             placeholder={placeholder}
//             autoComplete={autocomplete}
//             value={value}
//             onChange={onChange}
//             className={`${Icon ? "py-2 pl-10" : "py-2 px-4 md:px-5"
//               } w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12 ${readOnly ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
//               }`}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default InputArea;

import React from "react";
import Label from "@components/form/Label";

const InputArea = ({
  name,
  label,
  type,
  Icon,
  register,
  readOnly,
  defaultValue,
  autocomplete,
  placeholder,
  required = true,
  value,
  rows,
  onChange,
}) => {
  const isNIF = name === 'nif';

  const registerOptions = {
    required: required ? `${label} é obrigatório!` : false,
    ...(isNIF && {
      validate: value => value.length === 9 || 'NIF deve ter exatamente 9 dígitos',
      pattern: {
        value: /^\d{9}$/,
        message: 'NIF deve conter exatamente 9 números'
      }
    })
  };

  return (
    <>
      <Label label={label} />
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-800 focus-within:text-gray-900 sm:text-base">
              <Icon />{" "}
            </span>
          </div>
        )}
        {type === "textarea" ? (
          <textarea
            {...register(`${name}`, registerOptions)}
            name={name}
            readOnly={readOnly}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete={autocomplete}
            value={value}
            rows={rows}
            onChange={onChange}
            className={`${Icon ? "py-2 pl-10" : "py-2 px-4 md:px-5"} w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12 ${readOnly ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
          />
        ) : (
          <input
            {...register(`${name}`, registerOptions)}
            type={isNIF ? "text" : type}
            name={name}
            readOnly={readOnly}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete={autocomplete}
            value={value}
            onChange={isNIF ?
              (e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                if (onChange) onChange({ ...e, target: { ...e.target, value } });
              } : onChange}
            maxLength={isNIF ? 9 : undefined}
            className={`${Icon ? "py-2 pl-10" : "py-2 px-4 md:px-5"} w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12 ${readOnly ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
          />
        )}
      </div>
    </>
  );
};

export default InputArea;