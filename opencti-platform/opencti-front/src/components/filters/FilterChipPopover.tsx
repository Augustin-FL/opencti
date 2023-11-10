import React, { FunctionComponent, SyntheticEvent, useContext, useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import MUIAutocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { OptionValue } from '@components/common/lists/FilterAutocomplete';
import Checkbox from '@mui/material/Checkbox';
import FilterDate from '@components/common/lists/FilterDate';
import { MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { booleanFilters, dateFilters, EqFilters, Filter, integerFilters } from '../../utils/filters/filtersUtils';
import { FiltersHelpersUtil } from './FiltersHelpers.util';
import { useFormatter } from '../i18n';
import { SearchEntitiesUtil } from './SearchEntities.util';
import ItemIcon from '../ItemIcon';
import { UserContext } from '../../utils/hooks/useAuth';

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

const OperatorKeyValues: { [key: string]: string } = {
  eq: 'Equals',
  not_eq: 'Not equals',
  nil: 'Null',
  not_nil: 'Not null',
  gt: 'Greater than',
  gte: 'Greater than/ Equals',
  lt: 'Lower than',
  lte: 'Lower than/ Equals',
};

const getAvailableOperatorForFilter = (filterKey: string): string[] => {
  if (EqFilters.includes(filterKey)) {
    return ['eq', 'not_eq', 'nil', 'not_nil'];
  }
  if (dateFilters.includes(filterKey)) {
    return ['gt', 'gte', 'lt', 'lte'];
  }
  if (integerFilters.includes(filterKey)) {
    return ['gt', 'gte', 'lt', 'lte'];
  }
  if (booleanFilters.includes(filterKey)) {
    return ['eq', 'not_eq'];
  }
  return ['eq', 'not_eq', 'nil', 'not_nil'];
};

export const FilterChipPopover: FunctionComponent<FilterChipMenuProps> = ({ params, handleClose, open, filters }) => {
  console.log(filters);
  const { schema } = useContext(UserContext);
  console.log(schema);
  const { filterKey, filterOperator, anchorEl } = params;
  const [selectOperator, setSelectOperator] = useState(filterOperator);
  const filterValues = filters.find((filter) => filter.key === filterKey && filter.operator === selectOperator)?.values ?? [];
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
  const [entities, searchEntities] = SearchEntitiesUtil.getUseSearch();
  const { t } = useFormatter();
  const optionValues: OptionValue[] = SearchEntitiesUtil.getOptions(filterKey, entities);
  const handleChange = (checked: boolean, value: string) => {
    if (checked) {
      FiltersHelpersUtil.useHandleAddFilter(filterKey, value, selectOperator);
    } else {
      FiltersHelpersUtil.getFilterHelpers()?.handleRemoveRepresentationFilter(filterKey, value, selectOperator);
    }
  };

  const handleChangeOperator = (event: SelectChangeEvent) => {
    FiltersHelpersUtil.getFilterHelpers()?.handleChangeOperatorFilters(filterKey, selectOperator, event.target.value, event as SyntheticEvent);
    setSelectOperator(event.target.value);
  };
  const handleDateChange = (
    k: string,
    value: string,
    operator?: string,
    event?: React.KeyboardEvent,
  ) => {
    FiltersHelpersUtil.useHandleAddFilter(k, value, operator, event);
  };

  const BasicFilterDate = () => <FilterDate
    defaultHandleAddFilter={handleDateChange}
    filterKey={filterKey}
    operator={selectOperator}
    inputValues={inputValues}
    setInputValues={setInputValues}
  />;
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
        padding: '8px',
      }}
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectOperator}
        label="Operator"
        sx={{ marginBottom: '12px' }}
        onChange={handleChangeOperator}
      >
        {
          getAvailableOperatorForFilter(filterKey).map((value) => <MenuItem
            value={value}>{OperatorKeyValues[value]}</MenuItem>)
        }
      </Select>
      {
        dateFilters.includes(filterKey)
          ? <BasicFilterDate/>
          : <>

            {(!['not_nil', 'nil'].includes(selectOperator))
              && <MUIAutocomplete
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
                renderOption={(props, option, { selected }) => {
                  const checked = filterValues.includes(option.value);
                  return <li {...props}
                             onClick={() => handleChange(!checked, option.value)}>
                    <Checkbox
                      checked={checked}
                    />
                    <ItemIcon type={option.type} color={option.color}/>
                    <span style={{ padding: '0 4px' }}>{option.label}</span>
                  </li>;
                }}
              />
            }
          </>
      }
    </div>
  </Popover>;
};
