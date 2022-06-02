import React, { useState, useEffect, useCallback } from "react";
import { useCore } from "../../../../Hooks/Context";
import { queryBuilderData } from "../../../../../Data";

import {
  GroupProps,
  QueryBuilderDataProps,
  TypeItemOperatorProps,
  ConditionActive,
  SelectProps,
  ResponsesProps,
} from "../../../../../Validation/Protocols/TypeQueryBuilderDataProps";

import {
  GetCustomInput,
  GetOperatorSelect,
  GetOptionsCondition,
  GetValueDefaultSelect,
  GetResponseInput,
} from "../../../../../Validation/Rules";

import Select from "../../../Atoms/Select";
import { Button } from "../../../Atoms/Button";

import * as S from "./style";

interface teste {
  rule?: number;
  condition?: string[] | string;
  operator?: string[] | string;
  operatorItem?: string[] | string;
  combiner?: null | string[] | string;
  response?: null | ResponsesProps;
  groupId?: number;
}

const RulesGroup = () => {
  const [data, setData] = useState<any>(queryBuilderData);
  const {
    itemOption,
    setItemOption,
    subItemOption,
    setSubItemOption,
    operatorOption,
    setOperatorOption,
    responseOption,
    setResponseOption,
    moreActionOption,
    setMoreActionOption,
    conditions,
    setConditions,
    conditionsOptions,
    setQuery,
    query,
    allCondition,
    inputFields,
    setInputFields,
    groupRules,
    setGroupRules,
    countRules,
    setCountRules,
    countGroups,
  } = useCore();

  const [infoConditions, setInfoConditions] = useState<any>([
    { conditionName: "", values: [], operator: [], combiner: [] },
  ]);

  const [conditionActive, setConditionActive] = useState<ConditionActive>({
    name: "",
    label: "",
  });

  const [operatorActive, setOperatorActive] = useState<ConditionActive>({
    name: "",
    label: "",
  });

  const loading: SelectProps[] = [
    {
      value: "carregando",
      label: "carregando",
    },
  ];

  const handleAddFields = (indexGroup?: number) => {
    const values = [...inputFields];
    const group = groupRules.grupos;
    values.push({
      rule: countRules + 1,
      condition: "",
      operator: "",
      operatorItem: "",
      combiner: "",
      response: null,
      groupId: indexGroup,
    });

    group[countGroups].push({
      rule: countRules + 1,
      condition: "",
      operator: "",
      operatorItem: "",
      combiner: "",
      response: null,
      groupId: indexGroup,
    });

    setGroupRules({ grupos: [...group] });
    setInputFields(values);
  };

  const handleRemoveFields = (index: number) => {
    const values = [...inputFields];
    const conditions = [...infoConditions];

    values.pop();
    conditions.pop();

    setInputFields(values);
    setInfoConditions(conditions);
    setQuery(JSON.stringify(inputFields, null, 2));
  };

  const handleInputChange = (index: number, event: any) => {
    const values = [...inputFields];
    const conditionInfo = [...infoConditions];
    const group = groupRules.grupos;

    switch (event.target.name) {
      case `condition-${index}`:
        values[index].condition = event.target.value;

        setConditionActive({
          name: event.target.value,
          label: event.target.value,
        });

        group[index].condition = event.target.value;
        setGroupRules({ grupos: [...group] });

        conditionInfo[index] = {
          conditionName: event.target.name,
          values: [...loading],
          operator: [...loading],
          combiner: [...conditionsOptions],
        };
        break;
      case `operator-${index}`:
        values[index].operator = event.target.value;

        setOperatorActive({
          name: event.target.value,
          label: event.target.value,
        });

        group[inputFields.length].operator = event.target.value;
        setGroupRules({ grupos: [...group] });

        conditionInfo[index].values = [...subItemOption];
        break;
      case `operatorItem-${index}`:
        values[index].operatorItem = event.target.value;
        conditionInfo[index].operator = [...operatorOption];

        group[inputFields.length].operatorItem = event.target.value;
        setGroupRules({ grupos: [...group] });
        break;
      case `combiner-${index}`:
        values[index].combiner = event.target.value;
        conditionInfo[index].combiner = [...conditionsOptions];

        group[inputFields.length].combiner = event.target.value;
        setGroupRules({ grupos: [...group] });
        break;
    }
    setInfoConditions(conditionInfo);
    setInputFields(values);

    setQuery(JSON.stringify(inputFields, null, 2));
  };

  const resetForm = (e: any) => {
    setCountRules(0);
    setInputFields([
      {
        rule: countRules,
        condition: "",
        operator: "",
        operatorItem: "",
        combiner: null,
        response: null,
      },
    ]);
  };

  useEffect(() => {
    //get options condition
    setItemOption(GetOptionsCondition({ data }));
    //get ValueDefault select
    setSubItemOption(GetValueDefaultSelect({ data, conditionActive }));
    // get operator
    setOperatorOption(GetOperatorSelect({ data, conditionActive }));
    // get response
    setResponseOption(GetResponseInput({ data, conditionActive }));

    console.log("condition", groupRules);
  }, [conditionActive, allCondition, inputFields, groupRules]);

  return (
    <S.Container>
      {inputFields.map((inputField, index) => (
        <>
          <S.CombinerContent active={inputFields[index]?.combiner !== null}>
            {inputFields[index]?.combiner !== null && (
              <S.RuleItem
                key={`${inputFields[index]?.combiner}-${inputField}-${index}`}
              >
                <Select
                  id={`combiner-${index}`}
                  name={`combiner-${index}`}
                  onChange={(event) => handleInputChange(index, event)}
                  options={
                    infoConditions[index]?.values.length > 1
                      ? infoConditions[index]?.combiner
                      : conditionsOptions
                  }
                />
              </S.RuleItem>
            )}
          </S.CombinerContent>
          <S.Rule>
            <S.RuleGroup key={`${inputField}-${index}`}>
              <S.RuleItem>
                <Select
                  id={`condition-${index}`}
                  name={`condition-${index}`}
                  onChange={(event) => handleInputChange(index, event)}
                  options={itemOption}
                />
              </S.RuleItem>
              {conditionActive.name && (
                <S.RuleItem>
                  <Select
                    id={`operator-${index}`}
                    name={`operator-${index}`}
                    onChange={(event) => handleInputChange(index, event)}
                    options={
                      infoConditions[index]?.values.length > 1
                        ? infoConditions[index]?.values
                        : subItemOption
                    }
                    onClick={(event) => handleInputChange(index, event)}
                  />
                </S.RuleItem>
              )}
              {operatorActive.name && (
                <S.RuleItem>
                  <Select
                    id={`operatorItem-${index}`}
                    name={`operatorItem-${index}`}
                    onChange={(event) => handleInputChange(index, event)}
                    options={
                      infoConditions[index]?.operator.length > 1
                        ? infoConditions[index]?.operator
                        : operatorOption
                    }
                    onClick={(event) =>
                      infoConditions[index]?.operator.length > 1 &&
                      handleInputChange(index, event)
                    }
                  />
                </S.RuleItem>
              )}
              {responseOption?.type &&
                responseOption &&
                inputField.rule === index && <>{operatorActive?.label}</>}
              <S.ActionRule>
                <S.ButtonAction
                  type="button"
                  onClick={() => (
                    handleRemoveFields(index), setCountRules(countRules - 1)
                  )}
                >
                  <S.IconDelete />
                </S.ButtonAction>
              </S.ActionRule>
            </S.RuleGroup>
          </S.Rule>
        </>
      ))}
      <S.ContainerButtonAddCondition>
        <Button
          type="button"
          onClick={() => (
            handleAddFields(countGroups), setCountRules(countRules + 1)
          )}
          sizeButton="sm"
          maxWidth="200px"
        >
          Criar outra condição
        </Button>
      </S.ContainerButtonAddCondition>
      {/**
        *  <div>
        <Button type="reset" onClick={resetForm} sizeButton="sm">
          limpar query builder
        </Button>
      </div>
        */}
    </S.Container>
  );
};

export default RulesGroup;
