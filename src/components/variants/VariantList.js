import React, { useState } from "react"
import useUtilsFunction from "@hooks/useUtilsFunction"

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVariant,
  setSelectVa,
  onChangeMultiSelect
}) => {
  const { showingTranslateValue } = useUtilsFunction()
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([])

  const handleChangeVariant = (v) => {
    if (option === "Checkbox") {
      const updatedSelection = selectedCheckboxes.includes(v)
        ? selectedCheckboxes.filter(item => item !== v)
        : [...selectedCheckboxes, v]

      setSelectedCheckboxes(updatedSelection)

      // Get current attribute and selected extras names
      const currentAttribute = varTitle.find(vr => vr._id === att)
      const selectedNames = updatedSelection.map(selectedId => {
        const variant = currentAttribute?.variants?.find(v => v._id === selectedId)
        return variant?.name?.pt || ''
      }).filter(Boolean)

      setSelectVariant(prev => ({
        ...prev,
        [att]: updatedSelection,
        selectedExtras: selectedNames
      }))

      onChangeMultiSelect(updatedSelection, att)
    } else {
      setValue(v)
      setSelectVariant(prev => ({
        ...prev,
        [att]: v,
        variantNames: showingTranslateValue(
          varTitle.find(vr => vr._id === att)?.variants.find(el => el._id === v)?.name
        )
      }))
      setSelectVa({ [att]: v })
    }
  }

  return (
    <>
      {option === "Dropdown" && (
        <select
          onChange={(e) => handleChangeVariant(e.target.value)}
          className="focus:shadow-none w-1/2 px-2 py-1 form-select outline-none h-10 text-sm focus:outline-none block rounded-md bg-gray-100 border-transparent focus:bg-white border-emerald-600 focus:border-emerald-400 focus:ring focus:ring-emerald-200"
          name="parent"
        >
          {[...new Map(variants.map((v) => [v[att], v].filter(Boolean))).values()]
            .filter(Boolean)
            .map(
              (vl, i) =>
                Object?.values(selectVariant).includes(vl[att]) &&
                varTitle.map((vr) =>
                  vr?.variants?.map(
                    (el) =>
                      vr?._id === att &&
                      el?._id === vl[att] && (
                        <option
                          key={i + 1}
                          value={selectVariant[att]}
                          defaultValue={selectVariant[att]}
                          hidden
                        >
                          {showingTranslateValue(el.name)}
                        </option>
                      )
                  )
                )
            )}
          {[...new Map(variants.map((v) => [v[att], v].filter(Boolean))).values()]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <option key={el._id} value={vl[att]} defaultValue>
                        {showingTranslateValue(el.name)}
                      </option>
                    )
                )
              )
            )}
        </select>
      )}
      {option === "Checkbox" && (
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-2">
          {[...new Map(variants?.map((v) => [v[att], v].filter(Boolean))).values()]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <label
                        key={i + 1}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCheckboxes.includes(vl[att])}
                          onChange={() => handleChangeVariant(vl[att])}
                          className="form-checkbox h-4 w-4 text-emerald-500"
                        />
                        <span className={`text-sm ${selectedCheckboxes.includes(vl[att])
                          ? "text-emerald-500 font-medium"
                          : "text-gray-600"
                          }`}>
                          {showingTranslateValue(el.name)}
                        </span>
                      </label>
                    )
                )
              )
            )}
        </div>
      )}
      {option === "Radio" && (
        <div className="flex flex-wrap">
          {[...new Map(variants?.map((v) => [v[att], v].filter(Boolean))).values()]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <label
                        key={i + 1}
                        className="mr-4 mb-2"
                      >
                        <input
                          type="radio"
                          name={att}
                          checked={Object.values(selectVariant).includes(vl[att])}
                          onChange={() => handleChangeVariant(vl[att])}
                          className="hidden"
                        />
                        <span className={`px-4 py-2 rounded-full cursor-pointer inline-block ${Object.values(selectVariant).includes(vl[att])
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-600"
                          }`}>
                          {showingTranslateValue(el.name)}
                        </span>
                      </label>
                    )
                )
              )
            )}
        </div>
      )}
    </>
  )
}

export default VariantList
