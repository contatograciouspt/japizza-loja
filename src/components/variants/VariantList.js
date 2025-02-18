import useUtilsFunction from "@hooks/useUtilsFunction";
import { useEffect, useState } from "react";

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVariant,
  setSelectVa,
  onChangeMultiSelect,
}) => {
  const { showingTranslateValue } = useUtilsFunction();

  // Estado local apenas para Checkboxes. Para Radio, usaremos diretamente selectVariant[att].
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(
    option === "Checkbox" ? (selectVariant[att] || []) : []
  );

  // Se for "Checkbox", sincroniza estado local se já houver algo em selectVariant
  useEffect(() => {
    if (option === "Checkbox") {
      if (Array.isArray(selectVariant[att])) {
        setSelectedCheckboxes(selectVariant[att]);
      }
    }
  }, [option, att, selectVariant]);

  // Lida com Radio (ex: Tamanhos). Permite escolher só 1 opção
  const handleRadioChange = (value) => {
    // Salva no objeto global de seleção
    setSelectVariant({
      ...selectVariant,
      [att]: value,
    });
    // Salva no setSelectVa (usado no ProductModal para filtrar e achar preço base)
    setSelectVa({ // ✅ CORREÇÃO IMPORTANTE: setSelectVa atualiza apenas com {att: value}
      [att]: value,
    });
    // Se quiser guardar esse valor num estado "setValue"
    setValue(value);
  };

  // Lida com Checkboxes (ex: Extras). Permite marcar várias
  const handleCheckboxChange = (value) => {
    let updated = [...selectedCheckboxes];
    if (updated.includes(value)) {
      updated = updated.filter((item) => item !== value);
    } else {
      updated.push(value);
    }
    setSelectedCheckboxes(updated);

    // Se quiser salvar extras também em selectVariant, descomente a linha abaixo:
    // setSelectVariant({ ...selectVariant, [att]: updated });

    // Callback que recalcula preços extras
    if (onChangeMultiSelect) {
      onChangeMultiSelect(updated, att);
    }
    // Atualiza o setValue para referência (opcional)
    setValue(updated);
  };

  // Renderização condicional conforme o tipo de opção
  if (option === "Radio") {
    // Tamanhos (Radio) => somente 1 opção selecionada
    return (
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-2">
        {[
          ...new Map(
            variants
              .filter(Boolean)
              .map((v) => [v[att], v])
          ).values(),
        ].map((vl) =>
          varTitle.map((vr) =>
            vr?.variants?.map(
              (el) =>
                vr?._id === att &&
                el?._id === vl[att] && (
                  <button
                    key={el._id}
                    onClick={() => handleRadioChange(vl[att])}
                    className={
                      selectVariant[att] === vl[att]
                        ? "bg-emerald-500 text-white mr-2 border-0 rounded-full px-3 py-1 text-xs font-serif mt-2"
                        : "bg-gray-100 mr-2 border-0 text-gray-600 rounded-full px-3 py-1 text-xs font-serif mt-2"
                    }
                  >
                    {showingTranslateValue(el.name)}
                  </button>
                )
            )
          )
        )}
      </div>
    );
  } else if (option === "Checkbox") {
    // Extras (Checkbox) => múltiplas seleções
    return (
      <div className="flex flex-col">
        {[
          ...new Map(
            variants
              .filter(Boolean)
              .map((v) => [v[att], v])
          ).values(),
        ].map((vl) =>
          varTitle.map((vr) =>
            vr?.variants?.map(
              (el) =>
                vr?._id === att &&
                el._id === vl[att] && (
                  <label key={el._id} className="inline-flex items-center mt-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                      checked={selectedCheckboxes.includes(vl[att])}
                      onChange={() => handleCheckboxChange(vl[att])}
                    />
                    <span className="ml-2 text-gray-700">
                      {showingTranslateValue(el.name)}
                    </span>
                  </label>
                )
            )
          )
        )}
      </div>
    );
  } else if (option === "Dropdown") {
    // Exemplo caso você tenha dropdowns
    return (
      <select
        onChange={(e) => handleRadioChange(e.target.value)}
        className="focus:shadow-none w-1/2 px-2 py-1 form-select outline-none h-10 text-sm block rounded-md bg-gray-100 border-transparent focus:bg-white border-emerald-600 focus:border-emerald-400 focus:ring focus:ring-emerald-200"
      >
        {[
          ...new Map(
            variants
              .filter(Boolean)
              .map((v) => [v[att], v])
          ).values(),
        ].map((vl) =>
          varTitle.map((vr) =>
            vr?.variants?.map(
              (el) =>
                vr?._id === att &&
                el._id === vl[att] && (
                  <option key={el._id} value={vl[att]}>
                    {showingTranslateValue(el.name)}
                  </option>
                )
            )
          )
        )}
      </select>
    );
  } else {
    // Se não for nenhuma das opções acima
    return null;
  }
};

export default VariantList;