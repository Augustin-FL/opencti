import React, {FunctionComponent, useEffect, useState} from "react";
import {SearchEntitiesUtil} from "./SearchEntities.util";
import Popover from "@mui/material/Popover";
import MUIAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {useFormatter} from "../i18n";
import {OptionValue} from "@components/common/lists/FilterAutocomplete";
import Checkbox from "@mui/material/Checkbox";
import {dateFilters, Filter} from "../../utils/filters/filtersUtils";
import {FiltersHelpersUtil} from "./FiltersHelpers.util";
import FilterDate from "@components/common/lists/FilterDate";
import {MenuItem, Select} from "@mui/material";

interface FilterChipMenuProps {
  handleClose: () => void;
  open: boolean;
  params: FilterChipsParameter;
  filters: Filter[];
}

export interface FilterChipsParameter {
  filterKey: string;
  filterOperator: string;
  anchorEl?: HTMLElement;
}

export const FilterChipPopover: FunctionComponent<FilterChipMenuProps> = ({params, handleClose, open, filters}) => {
  const {filterKey, filterOperator, anchorEl} = params;
  const filterValues = filters.find(filter => filter.key === filterKey && filter.operator === filterOperator)?.values ?? [];
  const [inputValues, setInputValues] = useState<{
    key: string,
    values: string[],
    operator?: string
  }[]>([]);
  const [cacheEntities, setCacheEntities] = useState<
    Record<string, {
      label: string;
      value: string;
      type: string
    }[]>
  >({});
  const [entities, searchEntities] = SearchEntitiesUtil.getUseSearch()
  const {t} = useFormatter();
  let optionValues: OptionValue[] = SearchEntitiesUtil.getOptions(filterKey, entities);
  const handleChange = (checked: boolean, value: string) => {
    if (checked) {
      FiltersHelpersUtil.useHandleAddFilter(filterKey, value, filterOperator);
    } else {
      FiltersHelpersUtil.getFilterHelpers()?.handleRemoveRepresentationFilter(filterKey, value, filterOperator);
    }
  }
  
  const handleChangeOperator = (event) => {
    console.log('changeOperator', event.target.value);
  }
  const handleDateChange = (k: string,
                            value: string,
                            operator?: string,
                            event?: React.KeyboardEvent) => {
    FiltersHelpersUtil.useHandleAddFilter(k, value, operator, event);
  }
  
  const BasicFilterDate = () => <FilterDate
    defaultHandleAddFilter={handleDateChange}
    filterKey={filterKey}
    operator={filterOperator}
    inputValues={inputValues}
    setInputValues={setInputValues}
  />
  
  return <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={handleClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
  >
    <div
      style={{
        width: '250px',
        padding: '8px'
      }}
    >
      {
        dateFilters.includes(filterKey) ?
          <BasicFilterDate/>
          :
          <>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOperator}
              label="Operator"
              sx={{marginBottom: '12px'}}
              onChange={handleChangeOperator}
            >
              <MenuItem value={'eq'}>Equals</MenuItem>
              <MenuItem value={'not_eq'}>Not Equals</MenuItem>
              <MenuItem value={'nil'}>Null</MenuItem>
              <MenuItem value={'not_nil'}>Not Null</MenuItem>
              <MenuItem value={'gt'}>Greater than</MenuItem>
              <MenuItem value={'gte'}>Greater than/Equals</MenuItem>
              <MenuItem value={'lt'}>Lower than</MenuItem>
              <MenuItem value={'lte'}>Lower than/Equals</MenuItem>
            
            </Select>
            <MUIAutocomplete
              multiple
              disableCloseOnSelect
              key={filterKey}
              selectOnFocus={true}
              autoSelect={false}
              autoHighlight={true}
              getOptionLabel={(option) => option.label ?? ''}
              noOptionsText={t('No available options')}
              options={optionValues}
              onInputChange={(event) => searchEntities(
                filterKey,
                cacheEntities,
                setCacheEntities,
                event,
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t(`filter_${filterKey}`)}
                  variant="outlined"
                  size="small"
                  fullWidth={true}
                  onFocus={(event) => searchEntities(
                    filterKey,
                    cacheEntities,
                    setCacheEntities,
                    event,
                  )}
                />
              )}
              renderOption={(props, option, {selected}) => {
                const checked = filterValues.includes(option.value);
                return <li {...props} onClick={() => handleChange(!checked, option.value)}>
                  <Checkbox
                    style={{marginRight: 8}}
                    checked={checked}
                  />
                  {option.label}
                </li>
              }}
            />
          </>
      }
    </div>
  </Popover>
}
