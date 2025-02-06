// import useUtilsFunction from "@hooks/useUtilsFunction";
// import { useEffect, useState } from "react";

// const VariantList = ({
//   att,
//   option,
//   variants,
//   setValue,
//   varTitle,
//   selectVariant,
//   setSelectVariant,
//   setSelectVa,
//   onChangeMultiSelect
// }) => {
//   const { showingTranslateValue } = useUtilsFunction();
//   const [selectedCheckboxes, setSelectedCheckboxes] = useState(
//     selectVariant[att] ? selectVariant[att] : []
//   ); // Inicializa com os valores pré-selecionados.

//   useEffect(() => {
//     setSelectedCheckboxes(selectVariant[att] ? selectVariant[att] : []);
//   }, [selectVariant[att]]);

//   const handleChangeVariant = (v) => {
//     setValue(v);
//     setSelectVariant({
//       ...selectVariant,
//       [att]: v,
//     });
//     setSelectVa({ [att]: v });
//   };

//   const handleCheckboxChange = (value) => {
//     let updatedCheckboxes = [...selectedCheckboxes];

//     if (selectedCheckboxes.includes(value)) {
//       updatedCheckboxes = updatedCheckboxes.filter((item) => item !== value);
//     } else {
//       updatedCheckboxes.push(value);
//     }

//     setSelectedCheckboxes(updatedCheckboxes);

//     // Dispara a função de callback com o array de valores selecionados
//     onChangeMultiSelect(updatedCheckboxes, att);

//     setSelectVariant({
//       ...selectVariant,
//       [att]: updatedCheckboxes,
//     });

//     setSelectVa({ [att]: updatedCheckboxes });

//     setValue(updatedCheckboxes);
//   };


//   return (
//     <>
//       {option === "Dropdown" ? (
//         <select
//           onChange={(e) => handleChangeVariant(e.target.value)}
//           className="focus:shadow-none w-1/2 px-2 py-1 form-select outline-none h-10 text-sm focus:outline-none block rounded-md bg-gray-100 border-transparent focus:bg-white border-emerald-600 focus:border-emerald-400 focus:ring focus:ring-emerald-200"
//           name="parent"
//         >
//           {[
//             ...new Map(
//               variants.map((v) => [v[att], v].filter(Boolean))
//             ).values(),
//           ]
//             .filter(Boolean)
//             .map(
//               (vl, i) =>
//                 Object?.values(selectVariant).includes(vl[att]) &&
//                 varTitle.map((vr) =>
//                   vr?.variants?.map(
//                     (el) =>
//                       vr?._id === att &&
//                       el?._id === vl[att] && (
//                         <option
//                           key={i + 1}
//                           value={selectVariant[att]}
//                           defaultValue={selectVariant[att]}
//                           hidden
//                         >
//                           {showingTranslateValue(el.name)}
//                         </option>
//                       )
//                     // console.log('el', el._id === v[att] && el.name)
//                   )
//                 )
//             )}

//           {[
//             ...new Map(
//               variants.map((v) => [v[att], v].filter(Boolean))
//             ).values(),
//           ]
//             .filter(Boolean)
//             .map((vl, i) =>
//               varTitle.map((vr) =>
//                 vr?.variants?.map(
//                   (el) =>
//                     vr?._id === att &&
//                     el?._id === vl[att] && (
//                       <option key={el._id} value={vl[att]} defaultValue>
//                         {showingTranslateValue(el.name)}
//                       </option>
//                     )
//                 )
//               )
//             )}
//         </select>
//       ) : option === "Checkbox" ? (
//         <div className="flex flex-col">
//           {[
//             ...new Map(
//               variants?.map((v) => [v[att], v].filter(Boolean))
//             ).values(),
//           ]
//             .filter(Boolean)
//             .map((vl, i) =>
//               varTitle.map((vr) =>
//                 vr?.variants?.map(
//                   (el) =>
//                     vr?._id === att &&
//                     el?._id === vl[att] && (
//                       <label key={el._id} className="inline-flex items-center mt-3">
//                         <input
//                           type="checkbox"
//                           className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
//                           value={vl[att]}
//                           checked={selectedCheckboxes.includes(vl[att])}
//                           onChange={() => handleCheckboxChange(vl[att])}
//                         />
//                         <span className="ml-2 text-gray-700">{showingTranslateValue(el.name)}</span>
//                       </label>
//                     )
//                 )
//               )
//             )}
//         </div>
//       ) : (
//         <div className="grid lg:grid-cols-3 grid-cols-2">
//           {[
//             ...new Map(
//               variants?.map((v) => [v[att], v].filter(Boolean))
//             ).values(),
//           ]
//             .filter(Boolean)
//             .map((vl, i) =>
//               varTitle.map((vr) =>
//                 vr?.variants?.map(
//                   (el) =>
//                     vr?._id === att &&
//                     el?._id === vl[att] && (
//                       <button
//                         onClick={(e) => handleChangeVariant(vl[att])}
//                         key={i + 1}
//                         className={`${
//                           Object?.values(selectVariant).includes(vl[att])
//                             ? "bg-emerald-500 text-white mr-2 border-0 rounded-full inline-flex items-center justify-center px-3 py-1 text-xs font-serif mt-2 focus:outline-none"
//                             : "bg-gray-100 mr-2 border-0 text-gray-600 rounded-full inline-flex items-center justify-center px-3 py-1 text-xs font-serif mt-2 focus:outline-none"
//                         }`}
//                       >
//                         {showingTranslateValue(el.name)}
//                       </button>
//                     )
//                 )
//               )
//             )}
//         </div>
//       )}
//     </>
//   );
// };

// export default VariantList;
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useEffect, useState } from "react";

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVa,
  setSelectVariant,
  onChangeMultiSelect
}) => {
  const { showingTranslateValue } = useUtilsFunction();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(
    selectVariant[att] ? selectVariant[att] : []
  ); // Inicializa com os valores pré-selecionados.

  useEffect(() => {
    setSelectedCheckboxes(selectVariant[att] ? selectVariant[att] : []);
  }, [selectVariant[att]]);

  const handleCheckboxChange = (value) => {
    let updatedCheckboxes = [...selectedCheckboxes];

    if (selectedCheckboxes.includes(value)) {
      updatedCheckboxes = updatedCheckboxes.filter((item) => item !== value);
    } else {
      updatedCheckboxes.push(value);
    }

    setSelectedCheckboxes(updatedCheckboxes);

    onChangeMultiSelect(att, updatedCheckboxes);
    setValue(updatedCheckboxes);
  };

  const handleRadioChange = (value) => {
    onChangeMultiSelect(att, value)
  }

  return (
    <>
      {option === "Dropdown" ? (
        <select
          onChange={(e) => onChangeMultiSelect(att, e.target.value)}
          className="focus:shadow-none w-1/2 px-2 py-1 form-select outline-none h-10 text-sm focus:outline-none block rounded-md bg-gray-100 border-transparent focus:bg-white border-emerald-600 focus:border-emerald-400 focus:ring focus:ring-emerald-200"
          name="parent"
          value={selectVariant[att] || ''}
        >
          <option value="">Selecione</option>
          {[
            ...new Map(
              variants.map((v) => [v[att], v].filter(Boolean))
            ).values(),
          ]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <option key={el._id} value={vl[att]}>
                        {showingTranslateValue(el.name)}
                      </option>
                    )
                )
              )
            )}
        </select>
      ) : option === "Checkbox" ? (
        <div className="flex flex-col">
          {[
            ...new Map(
              variants?.map((v) => [v[att], v].filter(Boolean))
            ).values(),
          ]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <label key={el._id} className="inline-flex items-center mt-3">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-customRed rounded focus:ring-customRed"
                          value={vl[att]}
                          checked={selectedCheckboxes.includes(vl[att])}
                          onChange={() => handleCheckboxChange(vl[att])}
                        />
                        <span className="ml-2 text-gray-700">{showingTranslateValue(el.name)}</span>
                      </label>
                    )
                )
              )
            )}
        </div>
      )
        : option === "Radio" ? (
          <div className="flex flex-col">
            {[
              ...new Map(
                variants?.map((v) => [v[att], v].filter(Boolean))
              ).values(),
            ]
              .filter(Boolean)
              .map((vl, i) =>
                varTitle.map((vr) =>
                  vr?.variants?.map(
                    (el) =>
                      vr?._id === att &&
                      el?._id === vl[att] && (
                        <label key={el._id} className="inline-flex items-center mt-3">
                          <input
                            type="radio"
                            className="form-radio h-5 w-5 text-customRed rounded focus:ring-customRed"
                            value={vl[att]}
                            checked={selectVariant[att] === vl[att]}
                            onChange={() => handleRadioChange(vl[att])}
                          />
                          <span className="ml-2 text-gray-700">{showingTranslateValue(el.name)}</span>
                        </label>
                      )
                  )
                )
              )}
          </div>
        )
          : (
            <div className="grid lg:grid-cols-3 grid-cols-2">
              {[
                ...new Map(
                  variants?.map((v) => [v[att], v].filter(Boolean))
                ).values(),
              ]
                .filter(Boolean)
                .map((vl, i) =>
                  varTitle.map((vr) =>
                    vr?.variants?.map(
                      (el) =>
                        vr?._id === att &&
                        el?._id === vl[att] && (
                          <button
                            onClick={() => onChangeMultiSelect(att, vl[att])}
                            key={i + 1}
                            className={`${Object?.values(selectVariant).includes(vl[att])
                              ? "bg-customRed text-white mr-2 border-0 rounded-full inline-flex items-center justify-center px-3 py-1 text-xs font-serif mt-2 focus:outline-none"
                              : "bg-gray-100 mr-2 border-0 text-gray-600 rounded-full inline-flex items-center justify-center px-3 py-1 text-xs font-serif mt-2 focus:outline-none"
                              }`}
                          >
                            {showingTranslateValue(el.name)}
                          </button>
                        )
                    )
                  )
                )}
            </div>
          )}
    </>
  );
};

export default VariantList;